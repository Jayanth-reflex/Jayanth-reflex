import { execFileSync } from 'node:child_process';

const QUERY = `
query ($login: String!) {
  user(login: $login) {
    login
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    repositoriesContributedTo(first: 100, includeUserRepositories: false, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]) {
      totalCount
    }
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
      nodes {
        name
        languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
          edges { size node { name } }
        }
      }
    }
    pullRequests(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes {
        title
        url
        number
        state
        merged
        mergedAt
        createdAt
        additions
        deletions
        repository {
          nameWithOwner
          description
          stargazerCount
          isPrivate
          owner { login avatarUrl }
        }
      }
    }
  }
}`;

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
  } catch {
    throw new Error('Set GITHUB_TOKEN or sign in with `gh auth login` to fetch profile data.');
  }
}

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token()}`, 'Content-Type': 'application/json', 'User-Agent': 'profile-readme-builder' },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GitHub GraphQL returned ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error(`GitHub GraphQL error: ${json.errors.map((e) => e.message).join('; ')}`);
  return json.data;
}

// Commits made by scheduled jobs under this account. They count toward GitHub's contribution graph,
// so they are subtracted here and the activity card shows hand-written work only.
export const AUTOMATED_COMMITS = [
  { repo: 'Jayanth-reflex/pulse', message: /^data: refresh snapshots/ },
  { repo: 'Jayanth-reflex/cron-job', message: /^Automated commit/ },
];

async function rest(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `bearer ${token()}`, Accept: 'application/vnd.github+json', 'User-Agent': 'profile-readme-builder' },
  });
  if (res.status === 409) return { items: [], next: null }; // empty repository
  if (!res.ok) throw new Error(`GitHub REST ${path} returned ${res.status}: ${await res.text()}`);
  const next = res.headers.get('link')?.match(/<https:\/\/api\.github\.com([^>]+)>;\s*rel="next"/)?.[1] ?? null;
  return { items: await res.json(), next };
}

/** Per-day counts of automated commits over the calendar window, keyed by YYYY-MM-DD. */
async function automatedCommits(login, since) {
  const perDay = {};
  for (const rule of AUTOMATED_COMMITS) {
    let path = `/repos/${rule.repo}/commits?author=${login}&since=${since}&per_page=100`;
    while (path) {
      const { items, next } = await rest(path);
      for (const c of items) {
        if (!rule.message.test(c.commit.message)) continue;
        const day = c.commit.author.date.slice(0, 10);
        perDay[day] = (perDay[day] || 0) + 1;
      }
      path = next;
    }
  }
  return perDay;
}

async function avatarDataUri(url) {
  const sized = `${url}${url.includes('?') ? '&' : '?'}s=80`;
  const res = await fetch(sized);
  if (!res.ok) throw new Error(`Avatar download failed (${res.status}) for ${url}`);
  const type = res.headers.get('content-type') || 'image/png';
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
}

// Markup, notebooks and build files inflate byte counts without saying much about what someone writes.
const IGNORED_LANGUAGES = new Set(['HTML', 'CSS', 'SCSS', 'Jupyter Notebook', 'Makefile', 'Dockerfile', 'Procfile', 'Batchfile', 'PLpgSQL']);

/** Everything the cards need, reduced to plain JSON so builds can also run from the cached copy. */
export async function fetchProfile(login) {
  const { user } = await graphql(QUERY, { login });
  const cc = user.contributionsCollection;

  const firstDay = cc.contributionCalendar.weeks[0].contributionDays[0].date;
  const automated = await automatedCommits(login, `${firstDay}T00:00:00Z`);
  const automatedTotal = Object.values(automated).reduce((a, b) => a + b, 0);
  const days = cc.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: Math.max(0, d.contributionCount - (automated[d.date] || 0)) }));

  const bytes = {};
  for (const repo of user.repositories.nodes) {
    for (const { size, node } of repo.languages.edges) {
      if (!IGNORED_LANGUAGES.has(node.name)) bytes[node.name] = (bytes[node.name] || 0) + size;
    }
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .map(([name, size]) => ({ name, share: size / total }));

  const external = user.pullRequests.nodes.filter(
    (pr) => !pr.repository.isPrivate && pr.repository.owner.login.toLowerCase() !== login.toLowerCase() && (pr.merged || pr.state === 'OPEN'),
  );
  const avatars = {};
  for (const pr of external) {
    const owner = pr.repository.owner;
    avatars[owner.login] ??= await avatarDataUri(owner.avatarUrl);
  }
  const pullRequests = external.map((pr) => ({
    repo: pr.repository.nameWithOwner,
    description: pr.repository.description || '',
    stars: pr.repository.stargazerCount,
    owner: pr.repository.owner.login,
    title: pr.title,
    url: pr.url,
    number: pr.number,
    status: pr.merged ? 'merged' : 'open',
    createdAt: pr.createdAt,
    mergedAt: pr.mergedAt,
    additions: pr.additions,
    deletions: pr.deletions,
  }));

  return {
    login: user.login,
    totals: {
      contributions: cc.contributionCalendar.totalContributions - automatedTotal,
      commits: cc.totalCommitContributions - automatedTotal,
      automatedExcluded: automatedTotal,
      pullRequests: cc.totalPullRequestContributions,
      issues: cc.totalIssueContributions,
      reviews: cc.totalPullRequestReviewContributions,
      private: cc.restrictedContributionsCount,
      reposContributedTo: user.repositoriesContributedTo.totalCount,
    },
    days,
    languages,
    pullRequests,
    avatars,
  };
}

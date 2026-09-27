#!/usr/bin/env node
// Regenerates every card in assets/ and the open source section of README.md.
//
//   node scripts/build.mjs            fetch fresh data from GitHub, then build
//   node scripts/build.mjs --offline  build from the cached data/github.json
//
// Needs GITHUB_TOKEN, or a `gh auth login` session, unless --offline is passed.

import { writeFileSync, readFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, esc } from './lib/svg.mjs';
import { themes } from './lib/theme.mjs';
import { fetchProfile } from './lib/github.mjs';
import { headerCard } from './cards/header.mjs';
import { impactCard } from './cards/impact.mjs';
import { stackCard } from './cards/stack.mjs';
import { activityCard } from './cards/activity.mjs';
import { ossCard, compact } from './cards/oss.mjs';

const LOGIN = 'Jayanth-reflex';
const CACHE = join(ROOT, 'data/github.json');
const ASSETS = join(ROOT, 'assets');
const OSS_DIR = join(ASSETS, 'oss');
const README = join(ROOT, 'README.md');

const offline = process.argv.includes('--offline');
let data;
if (offline) {
  data = JSON.parse(readFileSync(CACHE, 'utf8'));
} else {
  data = await fetchProfile(LOGIN);
  writeFileSync(CACHE, JSON.stringify(data, null, 2) + '\n');
}

const written = [];
function write(path, svg) {
  writeFileSync(path, svg);
  written.push(path.replace(ROOT, ''));
}

mkdirSync(OSS_DIR, { recursive: true });

for (const t of Object.values(themes)) {
  write(join(ASSETS, `header-${t.name}.svg`), headerCard(t));
  write(join(ASSETS, `impact-${t.name}.svg`), impactCard(t));
  write(join(ASSETS, `stack-${t.name}.svg`), stackCard(t));
  write(join(ASSETS, `activity-${t.name}.svg`), activityCard(t, data));
}

// Landed work first, then open PRs ordered by how widely the project is used.
const prs = [...data.pullRequests].sort((a, b) => {
  if (a.status !== b.status) return a.status === 'merged' ? -1 : 1;
  if (a.status === 'merged') return b.mergedAt.localeCompare(a.mergedAt);
  return b.stars - a.stars;
});

const slug = (pr) => `${pr.repo.replace('/', '-')}-${pr.number}`.toLowerCase();
const keep = new Set();
for (const pr of prs) {
  for (const t of Object.values(themes)) {
    const file = `${slug(pr)}-${t.name}.svg`;
    keep.add(file);
    write(join(OSS_DIR, file), ossCard(t, pr, data.avatars[pr.owner]));
  }
}
for (const file of readdirSync(OSS_DIR)) if (!keep.has(file)) rmSync(join(OSS_DIR, file));

// README: only the block between the oss markers is generated.
// Linked images use GitHub's #gh-dark-mode-only / #gh-light-mode-only fragments: GitHub's renderer
// pulls an <img> out of <a><picture>, which breaks both the link and the dark variant.
const picture = (pr) => {
  const alt = esc(`${pr.status === 'merged' ? 'Merged' : 'In review'}: ${pr.title} (${pr.repo}, ${compact(pr.stars)} stars)`);
  const src = `assets/oss/${slug(pr)}`;
  return `<a href="${pr.url}"><img alt="${alt}" src="${src}-dark.svg#gh-dark-mode-only" width="400"><img alt="${alt}" src="${src}-light.svg#gh-light-mode-only" width="400"></a>`;
};
const repos = new Set(prs.map((p) => p.repo));
const merged = prs.filter((p) => p.status === 'merged').length;
const summary = `${prs.length} pull request${prs.length === 1 ? '' : 's'} to ${repos.size} project${repos.size === 1 ? '' : 's'} · ${merged} merged, ${prs.length - merged} in review · cards refresh daily from the GitHub API`;
const block = `<!-- oss:start -->
<p>
${prs.map(picture).join('\n')}
</p>
<sub>${summary}</sub>
<!-- oss:end -->`;

const readme = readFileSync(README, 'utf8');
if (!/<!-- oss:start -->[\s\S]*<!-- oss:end -->/.test(readme)) throw new Error('README.md is missing the <!-- oss:start --> / <!-- oss:end --> markers.');
writeFileSync(README, readme.replace(/<!-- oss:start -->[\s\S]*<!-- oss:end -->/, block));

console.log(`Built ${written.length} SVGs from ${offline ? 'cached' : 'live'} data; ${prs.length} upstream PRs in README.`);

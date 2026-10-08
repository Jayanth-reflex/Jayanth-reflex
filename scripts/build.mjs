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
import { projectCard } from './cards/project.mjs';
import { projects } from './content.mjs';

const LOGIN = 'Jayanth-reflex';
const CACHE = join(ROOT, 'data/github.json');
const ASSETS = join(ROOT, 'assets');
const OSS_DIR = join(ASSETS, 'oss');
const PROJECTS_DIR = join(ASSETS, 'projects');
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
mkdirSync(PROJECTS_DIR, { recursive: true });

for (const t of Object.values(themes)) {
  write(join(ASSETS, `header-${t.name}.svg`), headerCard(t));
  write(join(ASSETS, `impact-${t.name}.svg`), impactCard(t));
  write(join(ASSETS, `stack-${t.name}.svg`), stackCard(t));
  write(join(ASSETS, `activity-${t.name}.svg`), activityCard(t, data));
}

// The 4 most recent PRs, shown landed work first, then open PRs ordered by how widely the project is used.
const TOP = 4;
const recent = [...data.pullRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, TOP);
const prs = recent.sort((a, b) => {
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

// README: only the blocks between the oss and projects markers are generated.
// <a><picture> renders as one linked, theme-aware image. The #gh-dark-mode-only fragments no longer
// hide the other variant, so they showed every card twice.
const picture = (pr) => {
  const alt = esc(`${pr.status === 'merged' ? 'Merged' : 'In review'}: ${pr.title} (${pr.repo}, ${compact(pr.stars)} stars)`);
  const src = `assets/oss/${slug(pr)}`;
  return `<a href="${pr.url}"><picture><source media="(prefers-color-scheme: dark)" srcset="${src}-dark.svg"><img alt="${alt}" src="${src}-light.svg" width="400"></picture></a>`;
};
const merged = prs.filter((p) => p.status === 'merged').length;
const summary = `Top ${prs.length} of my most recent upstream pull requests · ${merged} merged, ${prs.length - merged} in review · cards refresh daily from the GitHub API`;
const block = `<!-- oss:start -->
<p>
${prs.map(picture).join('\n')}
</p>
<sub>${summary}</sub>
<!-- oss:end -->`;

// Project cards, two to a row, each linking to its repo.
const projectKeep = new Set();
projects.forEach((p, i) => {
  for (const t of Object.values(themes)) {
    const file = `${p.repo.toLowerCase()}-${t.name}.svg`;
    projectKeep.add(file);
    write(join(PROJECTS_DIR, file), projectCard(t, p, i));
  }
});
for (const file of readdirSync(PROJECTS_DIR)) if (!projectKeep.has(file)) rmSync(join(PROJECTS_DIR, file));
const projectPicture = (p) => {
  const alt = esc(`${p.repo}: ${p.kind}. ${p.hook}`);
  const src = `assets/projects/${p.repo.toLowerCase()}`;
  return `<a href="https://github.com/${LOGIN}/${p.repo}"><picture><source media="(prefers-color-scheme: dark)" srcset="${src}-dark.svg"><img alt="${alt}" src="${src}-light.svg" width="400"></picture></a>`;
};
const projectsBlock = `<!-- projects:start -->
<p>
${projects.map(projectPicture).join('\n')}
</p>
<!-- projects:end -->`;

const replaceBlock = (text, name, content) => {
  const re = new RegExp(`<!-- ${name}:start -->[\\s\\S]*<!-- ${name}:end -->`);
  if (!re.test(text)) throw new Error(`README.md is missing the <!-- ${name}:start --> / <!-- ${name}:end --> markers.`);
  return text.replace(re, content);
};
let readme = readFileSync(README, 'utf8');
readme = replaceBlock(readme, 'oss', block);
readme = replaceBlock(readme, 'projects', projectsBlock);
writeFileSync(README, readme);

console.log(`Built ${written.length} SVGs from ${offline ? 'cached' : 'live'} data; ${prs.length} upstream PRs in README.`);

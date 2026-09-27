import { svgDoc, esc, textWidth, round } from '../lib/svg.mjs';

const W = 840;
const CELL = 11;
const STEP = 14;
const GRID_X = 64;
const GRID_Y = 82;

/**
 * Five intensity levels on a log scale. Daily counts are heavily skewed and often tied, so
 * quantile cuts collapse; a log scale capped at the 95th percentile keeps the steps visible.
 */
function levels(days) {
  const counts = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
  const cap = counts[Math.floor(0.95 * (counts.length - 1))] || 1;
  return (c) => (c === 0 ? 0 : Math.max(1, Math.min(5, Math.ceil((5 * Math.log1p(c)) / Math.log1p(cap)))));
}

/** Contribution calendar for the last year, rendered like an attention map and swept in column by column. */
export function activityCard(t, data) {
  const days = data.days;
  const level = levels(days);
  const out = [];

  // Pad the first week so rows line up with weekdays (0 = Sunday).
  const firstDow = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
  const cells = [];
  days.forEach((d, i) => {
    const idx = i + firstDow;
    cells.push({ ...d, col: Math.floor(idx / 7), row: idx % 7 });
  });
  const cols = cells.at(-1).col + 1;

  // Month labels at the first column of each month, skipping any that would collide with the next one.
  const months = [];
  for (const c of cells) {
    const m = new Date(c.date + 'T00:00:00Z').getUTCMonth();
    if (c.row === 0 && m !== months.at(-1)?.m) months.push({ m, col: c.col });
  }
  months.forEach(({ m, col }, i) => {
    const next = months[i + 1]?.col ?? cols;
    if (next - col < 3) return;
    const label = new Date(Date.UTC(2000, m, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    out.push(`<text class="m" x="${GRID_X + col * STEP}" y="${GRID_Y - 10}" font-size="10.5" fill="${t.subtle}">${label}</text>`);
  });
  for (const [row, label] of [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']]) {
    out.push(`<text class="m" x="24" y="${GRID_Y + row * STEP + 9}" font-size="10.5" fill="${t.subtle}">${label}</text>`);
  }

  // One group per week so the sweep is a single animation per column.
  for (let col = 0; col < cols; col++) {
    const week = cells.filter((c) => c.col === col);
    const rects = week.map(
      (c) => `<rect x="${GRID_X + col * STEP}" y="${GRID_Y + c.row * STEP}" width="${CELL}" height="${CELL}" rx="2.5" fill="${t.heat[level(c.count)]}"/>`,
    );
    out.push(`<g class="cell" style="animation-delay:${round(0.25 + col * 0.018)}s">${rects.join('')}</g>`);
  }

  // Scan line that crosses the grid once after the sweep, like an attention head reading the sequence.
  const gridW = cols * STEP;
  const gridH = 7 * STEP;
  out.push(`<rect class="scan" x="${GRID_X - 3}" y="${GRID_Y - 3}" width="${STEP + 2}" height="${gridH + 2}" rx="4" fill="none" stroke="${t.accent}" stroke-width="1.5"/>`);

  // Legend
  const lx = W - 24 - 6 * STEP - 4 - textWidth('more', 10.5, { mono: true });
  const ly = GRID_Y + gridH + 22;
  out.push(`<text class="m" x="${lx - 8}" y="${ly + 9}" font-size="10.5" fill="${t.subtle}" text-anchor="end">less</text>`);
  if (data.totals.automatedExcluded) {
    out.push(`<text class="m" x="${GRID_X}" y="${ly + 9}" font-size="10.5" fill="${t.subtle}">excludes ${data.totals.automatedExcluded.toLocaleString('en-US')} automated data-refresh commits</text>`);
  }
  t.heat.forEach((c, i) => out.push(`<rect x="${lx + i * STEP}" y="${ly}" width="${CELL}" height="${CELL}" rx="2.5" fill="${c}"/>`));
  out.push(`<text class="m" x="${lx + 6 * STEP + 4}" y="${ly + 9}" font-size="10.5" fill="${t.subtle}">more</text>`);

  // Totals row
  const tot = data.totals;
  const stats = [
    [tot.commits, 'commits'],
    [tot.pullRequests, 'pull requests'],
    [tot.issues, 'issues opened'],
    [tot.reposContributedTo, 'upstream repos'],
  ];
  const sy = ly + 34;
  out.push(`<line x1="1" y1="${sy}" x2="${W - 1}" y2="${sy}" stroke="${t.hair}"/>`);
  const colW = (W - 48) / stats.length;
  stats.forEach(([n, label], i) => {
    const x = 24 + i * colW;
    out.push(`<g class="rise" style="animation-delay:${round(1.3 + i * 0.08)}s">
  <text class="s" x="${round(x)}" y="${sy + 38}" font-size="24" font-weight="700" letter-spacing="-0.5" fill="${t.fg}">${n.toLocaleString('en-US')}</text>
  <text class="m" x="${round(x)}" y="${sy + 58}" font-size="11.5" fill="${t.subtle}">${esc(label)}</text>
</g>`);
  });

  // Language mix
  const ly2 = sy + 84;
  const langs = data.languages.slice(0, 5);
  const rest = 1 - langs.reduce((a, l) => a + l.share, 0);
  if (rest > 0.005) langs.push({ name: 'other', share: rest });
  const barW = W - 48;
  let lxCur = 24;
  const segs = [];
  const labels = [];
  const ramp = t.ramp.slice().reverse();
  langs.forEach((l, i) => {
    const w = Math.max(2, l.share * barW);
    const color = l.name === 'other' ? t.line : ramp[i % ramp.length];
    segs.push(`<rect x="${round(lxCur)}" y="${ly2}" width="${round(w - 2)}" height="8" rx="2" fill="${color}"/>`);
    lxCur += w;
    labels.push({ name: l.name, pct: Math.round(l.share * 100), color });
  });
  let labX = 24;
  const labelEls = labels.map(({ name, pct, color }) => {
    const s = `<circle cx="${round(labX + 4)}" cy="${ly2 + 27}" r="4" fill="${color}"/><text class="m" x="${round(labX + 14)}" y="${ly2 + 31}" font-size="11.5" fill="${t.muted}">${esc(name)} <tspan fill="${t.subtle}">${pct}%</tspan></text>`;
    labX += textWidth(`${name} ${pct}%`, 11.5, { mono: true }) + 36;
    return s;
  });
  out.push(`<g class="rise" style="animation-delay:1.6s"><g class="growx" style="animation-delay:1.6s">${segs.join('')}</g>${labelEls.join('')}</g>`);

  const H = ly2 + 52;
  const header = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${t.line}"/>
<g class="fade">
  <text class="m" x="24" y="28" font-size="12" fill="${t.subtle}">activity <tspan fill="${t.line}">/</tspan> last 12 months</text>
  <text class="m" x="${W - 24}" y="28" font-size="12" fill="${t.subtle}" text-anchor="end"><tspan fill="${t.fg}">${tot.contributions.toLocaleString('en-US')}</tspan> contributions</text>
  <line x1="1" y1="46" x2="${W - 1}" y2="46" stroke="${t.hair}"/>
</g>`;

  return svgDoc({
    width: W,
    height: H,
    title: 'GitHub activity over the last 12 months',
    desc: `${tot.contributions} contributions, ${tot.commits} commits, ${tot.pullRequests} pull requests, ${tot.issues} issues, ${tot.reposContributedTo} upstream repositories, excluding ${tot.automatedExcluded} automated commits. Languages: ${labels.map((l) => `${l.name} ${l.pct}%`).join(', ')}.`,
    body: [header, ...out].join('\n'),
    css: `
@keyframes cell{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
.cell{animation:cell .35s ease-out both}
@keyframes scan{0%{opacity:0;transform:translateX(0)}6%{opacity:1}94%{opacity:1}100%{opacity:0;transform:translateX(${round(gridW - STEP)}px)}}
.scan{opacity:0;animation:scan 3.2s cubic-bezier(.5,0,.5,1) 1.4s both}`,
  });
}

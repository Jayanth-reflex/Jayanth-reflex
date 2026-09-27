import { svgDoc, esc, textWidth, truncate, wrap, round } from '../lib/svg.mjs';

const W = 412;
const H = 156;

const STAR = 'M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z';
const MERGED = 'M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z';
const OPEN = 'M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z';

export const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n));

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (iso) => {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** One upstream pull request: where it went, what it fixed, and whether it has landed. */
export function ossCard(t, pr, avatar) {
  const [owner, name] = pr.repo.split('/');
  const merged = pr.status === 'merged';
  const statusColor = merged ? t.merged : t.open;
  const statusLabel = merged ? 'Merged' : 'In review';
  const when = fmtDate(merged ? pr.mergedAt : pr.createdAt);

  const stars = compact(pr.stars);
  const starsW = textWidth(stars, 12, { mono: true });
  const nameMax = W - 64 - 16 - starsW - 26;
  const ownerText = `${owner}/`;
  const ownerW = textWidth(ownerText, 14, { weight: 400 });
  const repoName = truncate(name, Math.max(40, nameMax - ownerW), 14, { weight: 600 });

  const titleLines = wrap(pr.title, W - 32, 14.5, { weight: 500 }, 2);
  const desc = truncate(pr.description, W - 64 - 16, 12, { weight: 400 });

  const statusW = textWidth(statusLabel, 12, { weight: 600 });
  const meta = `#${pr.number} · +${pr.additions} −${pr.deletions} · ${when}`;

  const body = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${t.line}"/>
<clipPath id="av"><rect x="16" y="16" width="36" height="36" rx="8"/></clipPath>
<g class="fade">
  <rect x="16" y="16" width="36" height="36" rx="8" fill="${t.well}"/>
  <image href="${avatar}" x="16" y="16" width="36" height="36" clip-path="url(#av)"/>
  <rect x="16.5" y="16.5" width="35" height="35" rx="7.5" fill="none" stroke="${t.line}" stroke-opacity=".6"/>
  <text class="s" x="64" y="31" font-size="14" fill="${t.muted}">${esc(ownerText)}<tspan font-weight="600" fill="${t.fg}">${esc(repoName)}</tspan></text>
  <text class="s" x="64" y="49" font-size="12" fill="${t.subtle}">${esc(desc)}</text>
  <g transform="translate(${round(W - 16 - starsW - 20)} 19)"><path d="${STAR}" fill="${t.subtle}" transform="scale(.8125)"/></g>
  <text class="m" x="${W - 16}" y="31" font-size="12" fill="${t.muted}" text-anchor="end">${esc(stars)}</text>
  <line x1="16" y1="66" x2="${W - 16}" y2="66" stroke="${t.hair}"/>
</g>
<g class="rise" style="animation-delay:.15s">
  ${titleLines.map((l, i) => `<text class="s" x="16" y="${92 + i * 20}" font-size="14.5" font-weight="500" fill="${t.fg}">${esc(l)}</text>`).join('\n  ')}
</g>
<g class="fade" style="animation-delay:.35s">
  <rect x="16" y="${H - 34}" width="${round(statusW + 38)}" height="22" rx="11" fill="${statusColor}" fill-opacity=".14" stroke="${statusColor}" stroke-opacity=".5"/>
  ${merged ? '' : `<rect class="ping" x="16" y="${H - 34}" width="${round(statusW + 38)}" height="22" rx="11" fill="none" stroke="${statusColor}"/>`}
  <g transform="translate(24 ${H - 29})"><path d="${merged ? MERGED : OPEN}" fill="${statusColor}" transform="scale(.75)"/></g>
  <text class="s" x="42" y="${H - 19}" font-size="12" font-weight="600" fill="${statusColor}">${statusLabel}</text>
  <text class="m" x="${round(statusW + 66)}" y="${H - 19}" font-size="11.5" fill="${t.subtle}">${esc(meta)}</text>
</g>`;

  return svgDoc({
    width: W,
    height: H,
    title: `${pr.repo} pull request #${pr.number}`,
    desc: `${statusLabel}: ${pr.title} (${pr.repo}, ${pr.stars} stars, +${pr.additions} −${pr.deletions}, ${when}).`,
    body,
    css: `
@keyframes ping{0%{opacity:.7;transform:scale(1)}70%,100%{opacity:0;transform:scale(1.12,1.5)}}
.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.4s cubic-bezier(0,0,.2,1) 1s infinite}`,
  });
}

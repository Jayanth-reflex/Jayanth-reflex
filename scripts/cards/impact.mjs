import { svgDoc, esc, round, delay, textWidth } from '../lib/svg.mjs';
import { rampColor } from '../lib/theme.mjs';
import { impact, impactFootnote } from '../content.mjs';

const W = 840;
const ROW = 60;
const BAR = { x: 452, w: 250 };

/** Results from past roles, drawn like an eval report: each bar starts at the baseline and shrinks to the measured result. */
export function impactCard(t) {
  const out = [];
  const top = 46;
  const H = top + impact.length * ROW + 58;
  const keyframes = [];

  out.push(`<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${t.line}"/>`);
  out.push(`<g class="fade">
  <text class="m" x="24" y="28" font-size="12" fill="${t.subtle}">measured impact <tspan fill="${t.line}">/</tspan> relative to the baseline</text>
  <rect x="${W - 236}" y="19" width="22" height="8" rx="2" fill="${t.hair}" stroke="${t.line}"/>
  <text class="m" x="${W - 206}" y="28" font-size="12" fill="${t.subtle}">before</text>
  <rect x="${W - 138}" y="19" width="22" height="8" rx="2" fill="${rampColor(t, 0.7)}"/>
  <text class="m" x="${W - 108}" y="28" font-size="12" fill="${t.subtle}">after</text>
  <line x1="1" y1="${top}" x2="${W - 1}" y2="${top}" stroke="${t.hair}"/>
</g>`);

  impact.forEach((row, i) => {
    const y0 = top + i * ROW;
    const d = 0.2 + i * 0.12;
    const after = 1 - row.delta;
    const color = rampColor(t, (row.delta - 0.3) / 0.6);
    keyframes.push(`@keyframes k${i}{from{transform:scaleX(1)}to{transform:scaleX(${after})}}.b${i}{transform-box:fill-box;transform-origin:0 50%;transform:scaleX(${after});animation:k${i} 1.1s cubic-bezier(.6,0,.2,1) ${round(d + 0.35)}s both}`);
    out.push(`<g class="rise" ${delay(d)}>
  <text class="s" x="24" y="${y0 + 27}" font-size="15.5" font-weight="500" fill="${t.fg}">${esc(row.label)}</text>
  <text class="m" x="24" y="${y0 + 46}" font-size="11.5" fill="${t.subtle}">${esc(row.context)}</text>
  <rect x="${BAR.x}" y="${y0 + 24}" width="${BAR.w}" height="12" rx="3" fill="${t.hair}" stroke="${t.line}"/>
  <rect class="b${i}" x="${BAR.x}" y="${y0 + 24}" width="${BAR.w}" height="12" rx="3" fill="${color}"/>
  <text class="s" x="${W - 24}" y="${y0 + 38}" font-size="26" font-weight="700" letter-spacing="-0.5" fill="${t.fg}" text-anchor="end">−${Math.round(row.delta * 100)}%</text>
</g>`);
    if (i < impact.length - 1) out.push(`<line x1="24" y1="${y0 + ROW}" x2="${W - 24}" y2="${y0 + ROW}" stroke="${t.hair}"/>`);
  });

  const fy = top + impact.length * ROW;
  // Shrink the footnote until it fits between the label and the right edge.
  const footText = impactFootnote.join(' · ');
  let footSize = 12.5;
  while (footSize > 10 && textWidth(footText, footSize, { mono: true }) > W - 24 - 112) footSize -= 0.5;
  out.push(`<g class="fade" ${delay(1.4)}>
  <line x1="1" y1="${fy}" x2="${W - 1}" y2="${fy}" stroke="${t.hair}"/>
  <text class="m up" x="24" y="${fy + 33}" font-size="11" fill="${t.subtle}">at scale</text>
  <text class="m" x="112" y="${fy + 33}" font-size="${footSize}" fill="${t.muted}">${impactFootnote.map(esc).join(` <tspan fill="${t.line}">·</tspan> `)}</text>
</g>`);

  return svgDoc({
    width: W,
    height: H,
    title: 'Measured impact',
    desc: impact.map((r) => `${r.label}: ${Math.round(r.delta * 100)}% lower (${r.context}).`).join(' ') + ` At scale: ${impactFootnote.join(', ')}.`,
    body: out.join('\n'),
    css: keyframes.join('\n'),
  });
}

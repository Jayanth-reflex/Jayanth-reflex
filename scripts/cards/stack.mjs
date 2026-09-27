import { svgDoc, esc, textWidth, round, delay } from '../lib/svg.mjs';
import { rampColor } from '../lib/theme.mjs';
import { stack } from '../content.mjs';

const W = 840;
const RAIL = 150;
const CHIPS = { x: 176, right: W - 24, h: 26, gap: 8, size: 12.5 };

/** The toolset laid out as the layers a request passes through, with a dot tracing the path down and back. */
export function stackCard(t) {
  const out = [];
  const top = 46;
  let y = top;
  const centers = [];

  stack.forEach((band, i) => {
    // Lay chips out left to right, wrapping when a row is full.
    const rows = [[]];
    let x = CHIPS.x;
    for (const item of band.items) {
      const w = textWidth(item, CHIPS.size, { mono: true }) + 22;
      if (x + w > CHIPS.right && rows.at(-1).length) {
        rows.push([]);
        x = CHIPS.x;
      }
      rows.at(-1).push({ item, x, w });
      x += w + CHIPS.gap;
    }
    const pad = 14;
    const bandH = pad * 2 + rows.length * CHIPS.h + (rows.length - 1) * CHIPS.gap;
    const cy = y + bandH / 2;
    centers.push(cy);

    const chips = rows.flatMap((row, r) =>
      row.map(({ item, x, w }) => {
        const core = band.core.includes(item);
        const ry = y + pad + r * (CHIPS.h + CHIPS.gap);
        return `<rect x="${round(x)}" y="${ry}" width="${round(w)}" height="${CHIPS.h}" rx="6" fill="${t.well}" stroke="${core ? t.muted : t.line}"/>
    <text class="m" x="${round(x + 11)}" y="${ry + 17.5}" font-size="${CHIPS.size}" fill="${core ? t.fg : t.muted}">${esc(item)}</text>`;
      }),
    );
    out.push(`<g class="rise" ${delay(0.15 + i * 0.08)}>
    <text class="m up" x="24" y="${round(cy + 4)}" font-size="11" fill="${t.subtle}">${esc(band.label)}</text>
    ${chips.join('\n    ')}
</g>`);
    y += bandH;
    if (i < stack.length - 1) out.push(`<line x1="24" y1="${y}" x2="${W - 24}" y2="${y}" stroke="${t.hair}"/>`);
  });

  const H = y + 18;
  const first = centers[0];
  const last = centers.at(-1);
  const rail = [`<line x1="${RAIL}" y1="${round(first)}" x2="${RAIL}" y2="${round(last)}" stroke="${t.line}" stroke-width="1.5"/>`];
  centers.forEach((cy, i) => {
    rail.push(`<circle cx="${RAIL}" cy="${round(cy)}" r="3.5" fill="${rampColor(t, i / (centers.length - 1))}"/>`);
  });
  rail.push(`<circle class="dot" cx="${RAIL}" cy="${round(first)}" r="6" fill="${t.accent}" fill-opacity=".25"/>`);
  rail.push(`<circle class="dot" cx="${RAIL}" cy="${round(first)}" r="3" fill="${t.accent}"/>`);

  const header = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="none" stroke="${t.line}"/>
<g class="fade">
  <text class="m" x="24" y="28" font-size="12" fill="${t.subtle}">stack <tspan fill="${t.line}">/</tspan> ordered by where a request goes</text>
  <text class="m" x="${W - 24}" y="28" font-size="12" fill="${t.subtle}" text-anchor="end">highlighted = daily drivers</text>
  <line x1="1" y1="${top}" x2="${W - 1}" y2="${top}" stroke="${t.hair}"/>
</g>`;

  return svgDoc({
    width: W,
    height: H,
    title: 'Tech stack',
    desc: stack.map((b) => `${b.label}: ${b.items.join(', ')}.`).join(' '),
    body: [header, `<g class="fade" ${delay(0.9)}>${rail.join('\n')}</g>`, ...out].join('\n'),
    css: `
@keyframes travel{0%,8%{transform:translateY(0)}92%,100%{transform:translateY(${round(last - first)}px)}}
.dot{animation:travel 5.5s cubic-bezier(.65,0,.35,1) 1.4s infinite alternate}`,
  });
}

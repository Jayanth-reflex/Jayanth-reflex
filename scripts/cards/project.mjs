import { svgDoc, esc, textWidth, truncate, wrap, round, delay } from '../lib/svg.mjs';

const W = 412;
const H = 196;
const CHIP = { h: 22, gap: 6, size: 11.5 };

/** Accent per card, cycled so neighbouring cards differ. The palest stop is skipped on both themes. */
const accentFor = (t, i) => t.ramp.slice(1)[i % (t.ramp.length - 1)];

/** One of my own projects: the kind of work, its headline number, a short hook and the tools it uses. */
export function projectCard(t, p, i) {
  const accent = accentFor(t, i);

  const statW = textWidth(p.stat.value, 28, { weight: 600 });
  const statLabelW = textWidth(p.stat.label, 11, { weight: 400 });
  const right = Math.max(statW, statLabelW);
  const name = truncate(p.repo, W - 32 - right - 16, 17, { weight: 600 });
  const kind = p.kind.toUpperCase();
  const kindW = textWidth(kind, 10.5, { mono: true, tracking: 0.84 });

  const hook = wrap(p.hook, W - 32, 12.5, { weight: 400 }, 3);

  let x = 16;
  const chips = [];
  for (const [j, c] of p.chips.entries()) {
    const w = textWidth(c, CHIP.size, { mono: true }) + 18;
    if (x + w > W - 16) break;
    chips.push(`<g class="fade" ${delay(0.45 + j * 0.06)}><rect x="${round(x)}" y="${H - 38}" width="${round(w)}" height="${CHIP.h}" rx="6" fill="${t.well}" stroke="${t.line}"/>
    <text class="m" x="${round(x + 9)}" y="${H - 23}" font-size="${CHIP.size}" fill="${t.muted}">${esc(c)}</text></g>`);
    x += w + CHIP.gap;
  }

  const body = `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="12" fill="none" stroke="${t.line}"/>
<rect x="16" y="0" width="${round(kindW + 20)}" height="3" rx="1.5" fill="${accent}" class="growx"/>
<g class="fade">
  <circle cx="20" cy="25" r="4" fill="${accent}"/>
  <text class="m up" x="30" y="29" font-size="10.5" fill="${accent}">${esc(kind)}</text>
  <text class="s" x="16" y="56" font-size="17" font-weight="600" fill="${t.fg}">${esc(name)}</text>
</g>
<g class="rise" ${delay(0.1)}>
  <text class="s" x="${W - 16}" y="44" font-size="28" font-weight="600" fill="${accent}" text-anchor="end">${esc(p.stat.value)}</text>
  <text class="s" x="${W - 16}" y="60" font-size="11" fill="${t.subtle}" text-anchor="end">${esc(p.stat.label)}</text>
</g>
<line x1="16" y1="74" x2="${W - 16}" y2="74" stroke="${t.hair}"/>
<g class="rise" ${delay(0.2)}>
  ${hook.map((l, k) => `<text class="s" x="16" y="${96 + k * 19}" font-size="12.5" fill="${t.muted}">${esc(l)}</text>`).join('\n  ')}
</g>
${chips.join('\n')}`;

  return svgDoc({
    width: W,
    height: H,
    title: p.repo,
    desc: `${p.kind}. ${p.stat.value} ${p.stat.label}. ${p.hook} Built with ${p.chips.join(', ')}.`,
    body,
  });
}

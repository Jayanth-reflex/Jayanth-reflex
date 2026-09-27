import { svgDoc, esc, textWidth, wrap, round, delay } from '../lib/svg.mjs';
import { rampColor } from '../lib/theme.mjs';
import { header as copy } from '../content.mjs';

const W = 840;
const X = 112; // start of the content column; labels sit to its left
const NAME = { size: 58, weight: 700, tracking: -1.4 };
const TAG = { size: 18 };

/**
 * The profile header, drawn as a model decoding the answer to "Who is Jayanth?":
 * the name arrives as tokenizer pieces tinted by probability, then the rest streams in word by word.
 */
export function headerCard(t) {
  const out = [];
  const nameBase = 152;

  out.push(`<rect x=".5" y=".5" width="${W - 1}" height="{H}" rx="14" fill="none" stroke="${t.line}"/>`);

  // Run metadata strip
  out.push(`<g class="fade">
  <text class="m" x="24" y="28" font-size="12" fill="${t.subtle}">jayanth-reflex <tspan fill="${t.line}">/</tspan> generate</text>
  <text class="m" x="${W - 24}" y="28" font-size="12" fill="${t.subtle}" text-anchor="end">temperature 0.2 <tspan fill="${t.line}">·</tspan> top_p 0.95</text>
  <line x1="1" y1="46" x2="${W - 1}" y2="46" stroke="${t.hair}"/>
</g>`);

  // Prompt
  out.push(`<text class="m up fade" x="24" y="87" font-size="11" fill="${t.subtle}" ${delay(0.15)}>prompt</text>`);
  out.push(`<text class="s rise" x="${X}" y="88" font-size="19" fill="${t.muted}" ${delay(0.3)}>${esc(copy.prompt)}</text>`);
  out.push(`<text class="m up fade" x="24" y="${nameBase - 16}" font-size="11" fill="${t.subtle}" ${delay(0.75)}>output</text>`);

  // Name as tokens
  const padX = 4;
  const gap = 2;
  let cur = X;
  copy.tokens.forEach((tok, i) => {
    const lead = tok.text.startsWith(' ') ? textWidth(' ', NAME.size, { weight: NAME.weight }) : 0;
    const word = tok.text.trimStart();
    const w = lead + textWidth(word, NAME.size, NAME);
    const bx = cur - padX;
    const bw = w + padX * 2;
    const color = rampColor(t, (tok.p - 0.6) / 0.4, 'tokens');
    const d = 0.95 + i * 0.24;
    out.push(`<rect class="growx" x="${round(bx)}" y="${nameBase - 47}" width="${round(bw)}" height="62" rx="8" fill="${color}" fill-opacity="${t.tint}" ${delay(d)}/>`);
    out.push(`<rect class="growx" x="${round(bx)}" y="${nameBase + 13}" width="${round(bw)}" height="2" fill="${color}" ${delay(d)}/>`);
    out.push(`<text class="s fade" x="${round(cur + lead)}" y="${nameBase}" font-size="${NAME.size}" font-weight="${NAME.weight}" letter-spacing="${NAME.tracking}" fill="${t.fg}" ${delay(d + 0.08)}>${esc(word)}</text>`);
    out.push(`<text class="m fade" x="${round(bx + 1)}" y="${nameBase + 34}" font-size="11" fill="${t.subtle}" ${delay(d + 0.16)}>${tok.p.toFixed(2).slice(1)}</text>`);
    cur += bw + gap;
  });

  // Facts, right-aligned beside the name
  const factsAt = 2.05;
  const fy = [nameBase - 38, nameBase - 14, nameBase + 10];
  copy.facts.forEach((f, i) => {
    out.push(`<text class="m fade" x="${W - 24}" y="${fy[i]}" font-size="12.5" fill="${t.muted}" text-anchor="end" ${delay(factsAt + i * 0.1)}>${esc(f)}</text>`);
  });
  const statusW = textWidth(copy.status, 12.5, { mono: true });
  const dotX = W - 24 - statusW - 10;
  out.push(`<g class="fade" ${delay(factsAt + 0.2)}>
  <circle cx="${round(dotX)}" cy="${fy[2] - 4}" r="3.5" fill="${t.open}"/>
  <circle class="ping" cx="${round(dotX)}" cy="${fy[2] - 4}" r="3.5" fill="none" stroke="${t.open}"/>
  <text class="m" x="${W - 24}" y="${fy[2]}" font-size="12.5" fill="${t.fg}" text-anchor="end">${esc(copy.status)}</text>
</g>`);

  // Tagline, streamed one word at a time
  const full = `${copy.lead} ${copy.tagline}`;
  const leadCount = copy.lead.split(' ').length;
  const lines = wrap(full, W - 28 - X, TAG.size, { weight: 500 });
  let wordIndex = 0;
  let y = nameBase + 72;
  let caretX = X;
  let caretY = y;
  const start = 2.0;
  const step = 0.042;
  for (const line of lines) {
    let x = X;
    for (const word of line.split(' ')) {
      const isLead = wordIndex < leadCount;
      const weight = isLead ? 600 : 400;
      out.push(`<text class="s rise" x="${round(x)}" y="${y}" font-size="${TAG.size}" font-weight="${weight}" fill="${isLead ? t.fg : t.muted}" ${delay(start + wordIndex * step)}>${esc(word)}</text>`);
      x += textWidth(word + ' ', TAG.size, { weight });
      wordIndex++;
    }
    caretX = x - textWidth(' ', TAG.size) + 4;
    caretY = y;
    y += 28;
  }
  const done = start + wordIndex * step + 0.2;
  out.push(`<rect class="caret" x="${round(caretX)}" y="${caretY - 15}" width="9" height="19" rx="1.5" fill="${t.accent}" style="animation-delay:${round(done)}s,${round(done + 0.5)}s"/>`);

  const H = caretY + 36;
  const body = out.join('\n').replace('{H}', H - 1);

  return svgDoc({
    width: W,
    height: H,
    title: 'Jayanth Reddy, Generative AI Engineer',
    desc: `${copy.lead} ${copy.tagline} ${copy.facts.join('. ')}. ${copy.status}.`,
    body,
    css: `
@keyframes ping{0%{transform:scale(1);opacity:.8}80%,100%{transform:scale(3.2);opacity:0}}
.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.2s cubic-bezier(0,0,.2,1) 3s infinite}
@keyframes blink{50%{opacity:0}}
.caret{animation:fade .01s both,blink 1.1s steps(1) infinite}`,
  });
}

import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

const metrics = JSON.parse(readFileSync(join(ROOT, 'data/metrics.json'), 'utf8'));

const FONTS = {
  sans: { family: 'G', file: join(ROOT, 'assets/fonts/Geist.woff2') },
  mono: { family: 'GM', file: join(ROOT, 'assets/fonts/GeistMono.woff2') },
};

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const round = (n) => Math.round(n * 100) / 100;

/** Rendered width of `str` in px, from glyph advances measured in the browser (see scripts/measure.html). */
export function textWidth(str, size, { weight = 400, mono = false, tracking = 0 } = {}) {
  const chars = [...String(str)];
  const track = tracking * chars.length;
  if (mono) return (chars.length * metrics.mono * size) / metrics.size + track;
  const table = metrics.sans[weight] ?? metrics.sans[400];
  let w = 0;
  for (const ch of chars) w += table[ch] ?? table.o;
  return (w * metrics.kerningFactor * size) / metrics.size + track;
}

/** Cut `str` with an ellipsis so it fits in `max` px. */
export function truncate(str, max, size, opts = {}) {
  if (textWidth(str, size, opts) <= max) return str;
  let s = [...str];
  while (s.length && textWidth(s.join('') + '…', size, opts) > max) s.pop();
  return s.join('').trimEnd() + '…';
}

/** Greedy word wrap into at most `maxLines` lines; the last line is truncated if needed. */
export function wrap(str, max, size, opts = {}, maxLines = Infinity) {
  const words = String(str).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const next = line ? `${line} ${words[i]}` : words[i];
    if (textWidth(next, size, opts) <= max || !line) {
      line = next;
      continue;
    }
    lines.push(line);
    line = words[i];
    if (lines.length === maxLines - 1) {
      line = words.slice(i).join(' ');
      break;
    }
  }
  if (line) lines.push(lines.length === maxLines - 1 ? truncate(line, max, size, opts) : line);
  return lines;
}

let subsetter;
function hasSubsetter() {
  if (subsetter !== undefined) return subsetter;
  try {
    execFileSync('pyftsubset', ['--help'], { stdio: 'ignore' });
    subsetter = true;
  } catch {
    subsetter = false;
  }
  return subsetter;
}

/** Font bytes for the glyphs in `text`. Subsets with fonttools when it is installed (CI); embeds the whole face otherwise. */
function fontData(file, text) {
  if (!hasSubsetter()) return readFileSync(file);
  const dir = mkdtempSync(join(tmpdir(), 'font-'));
  const out = join(dir, 'subset.woff2');
  try {
    execFileSync('pyftsubset', [
      file,
      // Upper-cased too, because the .up class uppercases text in CSS.
      `--text=${[...new Set(text + text.toUpperCase())].join('')} `,
      '--flavor=woff2',
      '--layout-features=kern,liga,calt,tnum',
      '--no-hinting',
      `--output-file=${out}`,
    ]);
    return readFileSync(out);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Characters drawn inside <text> elements, so the subset holds exactly what is rendered. */
function textContent(body, className) {
  const re = new RegExp(`<text[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)</text>`, 'g');
  let out = '';
  for (const m of body.matchAll(re)) {
    out += m[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
  }
  return out;
}

const BASE_CSS = `
.s{font-family:G,-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif}
.m{font-family:GM,ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace;font-variant-ligatures:none}
.up{text-transform:uppercase;letter-spacing:.08em}
@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes growx{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.rise{animation:rise .55s cubic-bezier(.2,.7,.2,1) both}
.fade{animation:fade .45s ease both}
.growx{transform-box:fill-box;transform-origin:0 50%;animation:growx .5s cubic-bezier(.3,.7,.2,1) both}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}`;

/**
 * Wrap a card body in a standalone SVG document. Fonts are embedded as data URIs because
 * GitHub serves README images through a proxy that blocks external requests.
 */
export function svgDoc({ width, height, title, desc, body, css = '' }) {
  const faces = [];
  for (const [cls, font] of Object.entries({ s: FONTS.sans, m: FONTS.mono })) {
    const text = textContent(body, cls);
    if (!text) continue;
    const b64 = fontData(font.file, text).toString('base64');
    faces.push(`@font-face{font-family:${font.family};src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:100 900;font-display:block}`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title>
<desc id="desc">${esc(desc)}</desc>
<style>${faces.join('')}${BASE_CSS}${css}</style>
${body}
</svg>
`;
}

/** Inline animation delay, in seconds. */
export const delay = (s) => `style="animation-delay:${round(s)}s"`;

// Two palettes, one per GitHub theme. Neutrals follow GitHub's own UI colours so the
// cards sit flush on the page; the data colours come from matplotlib's magma colormap,
// the palette attention maps and logit plots are usually drawn in.

export const MAGMA = ['#000004', '#1c1044', '#4f127b', '#812581', '#b5367a', '#e55064', '#fb8761', '#fec287', '#fcfdbf'];

export const themes = {
  dark: {
    name: 'dark',
    fg: '#e6edf3',
    muted: '#9198a1',
    subtle: '#6e7681',
    line: '#3d444d',
    hair: '#262c36',
    well: '#151b23',
    accent: '#fb8761',
    merged: '#ab7df8',
    open: '#3fb950',
    closed: '#f85149',
    tint: 0.3,
    // low → high intensity; the darkest magma stops are dropped because they vanish on a dark canvas
    ramp: ['#812581', '#b5367a', '#e55064', '#fb8761', '#fec287'],
    heat: ['#1c2129', '#6a1c81', '#b5367a', '#f06a5d', '#fea772', '#fcfdbf'],
    // token tints in the header: purple for unsure tokens through rose for confident ones
    tokens: ['#812581', '#9c2e7f', '#b5367a', '#cb4371', '#e55064'],
  },
  light: {
    name: 'light',
    fg: '#1f2328',
    muted: '#59636e',
    subtle: '#818b98',
    line: '#d1d9e0',
    hair: '#e8ecf0',
    well: '#f6f8fa',
    accent: '#b5367a',
    merged: '#8250df',
    open: '#1a7f37',
    closed: '#cf222e',
    tint: 0.2,
    // low → high intensity, readable on white: magma run backwards, minus the palest stop
    ramp: ['#fb8761', '#e55064', '#b5367a', '#812581', '#4f127b'],
    heat: ['#eff2f5', '#fed9a6', '#fb8761', '#d8456c', '#8c2981', '#3b0f70'],
    tokens: ['#fb8761', '#f3735f', '#e55064', '#b5367a', '#812581'],
  },
};

/** Pick a colour for a value in [0, 1] from one of the theme's ordered scales. */
export function rampColor(theme, t, scale = 'ramp') {
  const r = theme[scale];
  const i = Math.max(0, Math.min(r.length - 1, Math.round(t * (r.length - 1))));
  return r[i];
}

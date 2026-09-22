// Original parametric linework: an open optical band, not a screenshot or product claim.
export function lensMarkup() {
  const paths = [];
  const count = 62;
  for (let strand = 0; strand < count; strand += 1) {
    const v = (strand / (count - 1) - 0.5) * 1.36;
    const points = [];
    for (let point = 0; point <= 104; point += 1) {
      const u = (point / 104) * Math.PI * 2;
      const r = 1.54 + v * Math.cos(u / 2);
      const x = r * Math.cos(u);
      const y = r * Math.sin(u);
      const z = v * Math.sin(u / 2);
      const rx = x * 0.94 - y * 0.34;
      const ry = x * 0.34 + y * 0.94;
      const depth = ry * 0.61 + z * 0.79;
      const perspective = 4.8 / (4.8 + depth);
      points.push([330 + rx * perspective * 117, 290 + (ry * 0.79 - z * 0.61) * perspective * 117]
        .map((value) => Math.round(Number(value.toFixed(1)) * 10)));
    }
    // Relative pairs preserve every original 0.1px vertex, with less repeated markup.
    const pair = ([x, y]) => `${x / 10},${y / 10}`.replace(/(^|,|-)0\./g, '$1.');
    const deltas = points.slice(1).map(([x, y], index) => pair([x - points[index][0], y - points[index][1]]));
    paths.push(`<path d="M${pair(points[0])}l${deltas.join(' ')}" opacity="${(0.24 + Math.sin(strand / count * Math.PI) * 0.55).toFixed(2)}"/>`);
  }
  return `<svg class="signal-lens" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 600" fill="none" aria-hidden="true" focusable="false">
    <defs><linearGradient id="lens-ink" x1="140" y1="90" x2="490" y2="490" gradientUnits="userSpaceOnUse"><stop class="lens-stop-a"/><stop offset=".52" class="lens-stop-b"/><stop offset="1" class="lens-stop-c"/></linearGradient></defs>
    <g class="lens-strands" stroke="url(#lens-ink)" stroke-width="1.15">${paths.join('')}</g>
    <ellipse class="lens-orbit" cx="330" cy="304" rx="283" ry="223" stroke="currentColor" stroke-width=".6" stroke-dasharray="1 8" transform="rotate(-24 330 304)"/>
  </svg>`;
}

export const markMarkup = `<svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false"><path d="M8 7v18M24 7v18M8 16c4-9 12 9 16 0" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`;

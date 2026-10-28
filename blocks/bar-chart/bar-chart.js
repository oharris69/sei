const SVG_NS = 'http://www.w3.org/2000/svg';
const COLORS = ['#faa519', '#a6ce39', '#00c0f3', '#131517'];
const BAR = 30;
const BAR_GAP = 10;
const GROUP_INSET = 14;
const PLOT_HEIGHT = 140;
const LABEL_GAP = 22;

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

let measureCtx;
function textWidth(text, font) {
  measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
  measureCtx.font = font;
  return measureCtx.measureText(text).width;
}

function wrap(text, maxWidth, font) {
  const lines = [];
  text.split(/\s+/).forEach((word) => {
    const last = lines[lines.length - 1];
    if (last && textWidth(`${last} ${word}`, font) <= maxWidth) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  });
  return lines;
}

/**
 * Renders the grouped bars into an SVG sized to the given width.
 */
function render(width, series, categories, max) {
  const compact = width < 600;
  const fontSize = compact ? 13 : 18;
  const lineHeight = compact ? 20 : 27;
  const family = getComputedStyle(document.body).fontFamily || 'sans-serif';
  const font = `500 ${fontSize}px ${family}`;
  const slot = width / Math.max(categories.length, 1);
  const groupWidth = series.length * (BAR + BAR_GAP) - BAR_GAP;
  const inset = compact ? Math.max(0, (slot - groupWidth) / 2) : GROUP_INSET;
  const labelWidth = compact ? slot - 10 : Math.min(109, slot - 8);
  const wrapped = categories.map((c) => wrap(c.label, labelWidth, font));
  const maxLines = Math.max(1, ...wrapped.map((l) => l.length));
  const height = PLOT_HEIGHT + LABEL_GAP + maxLines * lineHeight;

  const svg = svgEl('svg', {
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
    class: 'bar-chart-svg',
    'aria-hidden': 'true',
  });

  categories.forEach((category, ci) => {
    const gx = ci * slot;
    const group = svgEl('g', { class: 'bar-chart-group' });
    category.values.forEach((value, si) => {
      const h = Math.max(0, Math.min(value / max, 1)) * PLOT_HEIGHT;
      const rect = svgEl('rect', {
        x: gx + inset + si * (BAR + BAR_GAP),
        y: PLOT_HEIGHT - h,
        width: BAR,
        height: h,
        fill: series[si].color,
        class: 'bar-chart-bar',
      });
      const title = svgEl('title');
      title.textContent = `${category.label} — ${series[si].name}: ${value}`;
      rect.append(title);
      group.append(rect);
    });
    const text = svgEl('text', {
      x: compact ? gx + slot / 2 : gx,
      y: PLOT_HEIGHT + LABEL_GAP + fontSize * 0.8,
      'text-anchor': compact ? 'middle' : 'start',
      class: 'bar-chart-label',
      'font-size': fontSize,
    });
    wrapped[ci].forEach((line, li) => {
      const tspan = svgEl('tspan', { x: text.getAttribute('x'), dy: li ? lineHeight : 0 });
      tspan.textContent = line;
      text.append(tspan);
    });
    group.append(text);
    svg.append(group);
  });

  svg.append(svgEl('line', {
    x1: 0, y1: PLOT_HEIGHT + 0.5, x2: width, y2: PLOT_HEIGHT + 0.5, class: 'bar-chart-axis',
  }));
  return svg;
}

/**
 * Bar chart: grouped vertical bars with a legend, drawn as inline SVG from table data.
 * Header row: [any label] [series name] [series name]…
 * Data rows: [category] [value] [value]… (numbers; scale is 0–100, or 0–max when larger)
 * Series are drawn left to right in column order (orange, green, cyan, ink); the legend lists
 * the last series first. An accessible data table is included for screen readers.
 * @param {Element} block The bar-chart block element
 */
export default function decorate(block) {
  const rows = [...block.children].map((row) => [...row.children].map((c) => c.textContent.trim()));
  const isNum = (t) => t !== '' && !Number.isNaN(parseFloat(t));
  const headerIndex = rows.findIndex((cells) => cells.slice(1).some((t) => t && !isNum(t)));
  const header = headerIndex >= 0 ? rows[headerIndex] : [];
  const dataRows = rows.filter((cells, i) => i !== headerIndex && cells.slice(1).some(isNum));
  const seriesCount = Math.max(0, ...dataRows.map((cells) => cells.length - 1));
  const series = Array.from({ length: seriesCount }, (_, i) => ({
    name: header[i + 1] || `Series ${i + 1}`,
    color: COLORS[i % COLORS.length],
  }));
  const categories = dataRows.map((cells) => ({
    label: cells[0],
    values: series.map((_, i) => parseFloat(cells[i + 1]) || 0),
  }));
  const max = Math.max(100, ...categories.flatMap((c) => c.values));

  block.textContent = '';
  const legend = document.createElement('ul');
  legend.className = 'bar-chart-legend';
  [...series].reverse().forEach((s) => {
    const li = document.createElement('li');
    li.style.setProperty('--series-color', s.color);
    li.textContent = s.name;
    legend.append(li);
  });

  const plot = document.createElement('div');
  plot.className = 'bar-chart-plot';
  plot.setAttribute('role', 'img');
  plot.setAttribute('aria-label', `Bar chart comparing ${series.map((s) => s.name).join(' and ')} for ${categories.map((c) => c.label).join(', ')}`);

  const table = document.createElement('table');
  const head = table.createTHead().insertRow();
  [header[0] || 'Metric', ...series.map((s) => s.name)].forEach((label) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    head.append(th);
  });
  const body = table.createTBody();
  categories.forEach((c) => {
    const tr = body.insertRow();
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = c.label;
    tr.append(th);
    c.values.forEach((v) => { tr.insertCell().textContent = v; });
  });

  const tableWrap = document.createElement('div');
  tableWrap.className = 'bar-chart-table';
  tableWrap.append(table);
  block.append(legend, plot, tableWrap);

  let lastWidth = 0;
  const draw = () => {
    const width = Math.floor(plot.clientWidth);
    if (!width || width === lastWidth) return;
    lastWidth = width;
    plot.replaceChildren(render(width, series, categories, max));
  };
  if (window.ResizeObserver) new ResizeObserver(draw).observe(plot);
  requestAnimationFrame(draw);
  document.fonts?.ready.then(() => { lastWidth = 0; draw(); });
}

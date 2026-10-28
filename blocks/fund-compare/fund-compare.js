const SVG_NS = 'http://www.w3.org/2000/svg';
const COLORS = ['#be0000', '#667085', '#98a2b3', '#00c0f3', '#a6ce39'];
const SIZE = 445;
const RADIUS = 156;
const RINGS = [3 / 7, 5 / 7, 1];

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

const isNumeric = (text) => /^-?\d+(\.\d+)?%?$/.test(text.trim());

/**
 * Point on the radar for axis `i` of `n` at fraction `r` of the radius (axis 0 points up).
 */
function point(i, n, r) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return [SIZE / 2 + Math.cos(angle) * RADIUS * r, SIZE / 2 + Math.sin(angle) * RADIUS * r];
}

function buildRadar(axes, funds, max) {
  const n = axes.length;
  const svg = svgEl('svg', {
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    class: 'fund-compare-radar',
    role: 'img',
    'aria-label': `Radar chart comparing ${funds.map((f) => f.ticker).join(', ')} on ${axes.join(', ')}`,
  });

  const grid = svgEl('g', { class: 'fund-compare-grid' });
  RINGS.forEach((r) => {
    const pts = axes.map((_, i) => point(i, n, r).join(',')).join(' ');
    grid.append(svgEl('polygon', { points: pts }));
  });
  axes.forEach((_, i) => {
    const [x, y] = point(i, n, 1);
    grid.append(svgEl('line', {
      x1: SIZE / 2, y1: SIZE / 2, x2: x, y2: y,
    }));
  });
  svg.append(grid);

  // draw the first fund last so it sits on top
  [...funds].reverse().forEach((fund) => {
    const pts = fund.values.map((v, i) => point(i, n, Math.max(0, Math.min(v / max, 1))).join(',')).join(' ');
    const shape = svgEl('polygon', {
      points: pts,
      class: 'fund-compare-shape',
      fill: fund.color,
      stroke: fund.color,
      'data-fund': fund.ticker,
    });
    const title = svgEl('title');
    title.textContent = `${fund.ticker}: ${axes.map((a, i) => `${a} ${fund.values[i]}`).join(', ')}`;
    shape.append(title);
    svg.append(shape);
  });

  const labels = svgEl('g', { class: 'fund-compare-labels' });
  axes.forEach((axis, i) => {
    const [x, y] = point(i, n, 1);
    const dx = x - SIZE / 2;
    let anchor = 'middle';
    let lx = x;
    let ly = y;
    if (Math.abs(dx) < 1) {
      ly = y < SIZE / 2 ? y - 14 : y + 26;
    } else {
      anchor = dx > 0 ? 'start' : 'end';
      lx = x + (dx > 0 ? 10 : -10);
      ly = y + (y < SIZE / 2 ? -22 : 34);
    }
    const text = svgEl('text', { x: lx, y: ly, 'text-anchor': anchor });
    text.textContent = axis;
    labels.append(text);
  });
  svg.append(labels);
  return svg;
}

function buildTable(axes, funds) {
  const table = document.createElement('table');
  const head = table.createTHead().insertRow();
  ['Fund', ...axes].forEach((label) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    head.append(th);
  });
  const body = table.createTBody();
  funds.forEach((fund) => {
    const tr = body.insertRow();
    const th = document.createElement('th');
    th.scope = 'row';
    th.textContent = fund.ticker;
    tr.append(th);
    fund.values.forEach((v) => { tr.insertCell().textContent = v; });
  });
  return table;
}

/**
 * Fund compare: a list of recommended funds beside a radar chart of their scores.
 * Row 1 (optional): [heading] [optional pill text, e.g. "Strategy"]
 * Axis row: [any label] [axis name] [axis name]… (non-numeric cells)
 * Fund rows: [p ticker, p name, p detail…] [score] [score]… [optional #hex colour]
 * Scores are 0–100 (or 0–max of the scores when larger). Colours default to red,
 * dark grey and light grey in fund order.
 * @param {Element} block The fund-compare block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cellsOf = (row) => [...row.children];
  let headerRow;
  let axisRow;
  const fundRows = [];
  rows.forEach((row) => {
    const cells = cellsOf(row);
    const rest = cells.slice(1).filter((c) => c.textContent.trim() && !/^#[0-9a-f]{3,8}$/i.test(c.textContent.trim()));
    if (rest.length && rest.every((c) => isNumeric(c.textContent))) fundRows.push(row);
    else if (!headerRow && (row.querySelector('h1, h2, h3, h4') || cells.length <= 2) && !axisRow) headerRow = row;
    else if (!axisRow) axisRow = row;
  });

  const funds = fundRows.map((row, index) => {
    const [infoCell, ...valueCells] = cellsOf(row);
    const colorCell = valueCells.find((c) => /^#[0-9a-f]{3,8}$/i.test(c.textContent.trim()));
    const values = valueCells.filter((c) => c !== colorCell).map((c) => parseFloat(c.textContent));
    const lines = [...infoCell.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
    if (!lines.length) lines.push(infoCell.textContent.trim());
    return {
      ticker: lines[0],
      name: lines[1] || '',
      details: lines.slice(2),
      values,
      color: colorCell ? colorCell.textContent.trim() : COLORS[index % COLORS.length],
    };
  });

  const valueCount = Math.max(0, ...funds.map((f) => f.values.length));
  const axes = axisRow
    ? cellsOf(axisRow).slice(1).map((c) => c.textContent.trim()).filter(Boolean)
    : [];
  while (axes.length < valueCount) axes.push(`Metric ${axes.length + 1}`);
  axes.length = valueCount;
  funds.forEach((f) => { while (f.values.length < valueCount) f.values.push(0); });
  const max = Math.max(100, ...funds.flatMap((f) => f.values));

  block.textContent = '';
  const panel = document.createElement('div');
  panel.className = 'fund-compare-panel';

  if (headerRow) {
    const [titleCell, pillCell] = cellsOf(headerRow);
    const header = document.createElement('div');
    header.className = 'fund-compare-header';
    const heading = titleCell?.querySelector('h1, h2, h3, h4') || document.createElement('h2');
    if (!heading.textContent.trim()) heading.textContent = titleCell?.textContent.trim() || '';
    heading.className = 'fund-compare-title';
    header.append(heading);
    if (pillCell?.textContent.trim()) {
      const pill = document.createElement('span');
      pill.className = 'fund-compare-pill';
      pill.textContent = pillCell.textContent.trim();
      header.append(pill);
    }
    panel.append(header);
  }

  const list = document.createElement('ul');
  list.className = 'fund-compare-list';
  funds.forEach((fund) => {
    const li = document.createElement('li');
    li.style.setProperty('--fund-color', fund.color);
    const swatch = document.createElement('span');
    swatch.className = 'fund-compare-swatch';
    swatch.setAttribute('aria-hidden', 'true');
    const body = document.createElement('div');
    const ticker = document.createElement('p');
    ticker.className = 'fund-compare-ticker';
    ticker.textContent = fund.ticker;
    body.append(ticker);
    if (fund.name) {
      const name = document.createElement('p');
      name.className = 'fund-compare-name';
      name.textContent = fund.name;
      body.append(name);
    }
    if (fund.details.length) {
      const details = document.createElement('p');
      details.className = 'fund-compare-details';
      fund.details.forEach((d) => {
        const span = document.createElement('span');
        span.textContent = d;
        details.append(span);
      });
      body.append(details);
    }
    li.append(swatch, body);

    const highlight = (on) => {
      block.querySelectorAll('.fund-compare-shape').forEach((shape) => {
        shape.classList.toggle('dimmed', on && shape.dataset.fund !== fund.ticker);
      });
    };
    li.addEventListener('mouseenter', () => highlight(true));
    li.addEventListener('mouseleave', () => highlight(false));
    list.append(li);
  });
  panel.append(list);
  block.append(panel);

  if (valueCount >= 3 && funds.length) {
    const chart = document.createElement('figure');
    chart.className = 'fund-compare-chart';
    const tableWrap = document.createElement('div');
    tableWrap.className = 'fund-compare-table';
    tableWrap.append(buildTable(axes, funds));
    chart.append(buildRadar(axes, funds, max), tableWrap);
    block.append(chart);
  }
}

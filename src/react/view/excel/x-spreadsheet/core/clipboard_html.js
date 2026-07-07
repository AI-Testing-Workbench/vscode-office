/* global document, window */

function normalizeColor(value) {
  if (!value) return null;
  const text = value.trim().toLowerCase();
  if (!text || text === 'transparent' || text === 'inherit' || text === 'initial') return null;
  if (/^#[0-9a-f]{6}$/i.test(text)) return text;
  if (/^#[0-9a-f]{3}$/i.test(text)) {
    return `#${text[1]}${text[1]}${text[2]}${text[2]}${text[3]}${text[3]}`.toLowerCase();
  }
  const rgb = /^rgba?\(([^)]+)\)$/.exec(text);
  if (rgb) {
    const parts = rgb[1].split(',').map(it => Number.parseFloat(it.trim()));
    if (parts.length >= 3 && parts.every((it, index) => index > 2 || Number.isFinite(it))) {
      if (parts.length > 3 && parts[3] === 0) return null;
      const [r, g, b] = parts.slice(0, 3).map(it => Math.max(0, Math.min(255, Math.round(it))));
      return `#${[r, g, b].map(it => it.toString(16).padStart(2, '0')).join('')}`;
    }
  }
  return null;
}

function parseFontSize(value) {
  if (!value) return null;
  const px = /([\d.]+)px/i.exec(value);
  if (px) return Math.round(Number.parseFloat(px[1]) * 0.75);
  const pt = /([\d.]+)pt/i.exec(value);
  if (pt) return Math.round(Number.parseFloat(pt[1]));
  return null;
}

function borderFromCss(value) {
  if (!value || /none|hidden/i.test(value)) return null;
  const color = normalizeColor(value) || '#000000';
  let style = 'thin';
  if (/double/i.test(value)) style = 'double';
  else if (/dotted/i.test(value)) style = 'dotted';
  else if (/dashed/i.test(value)) style = 'dashed';
  else {
    const width = /([\d.]+)px/i.exec(value);
    if (width && Number.parseFloat(width[1]) >= 2) style = 'medium';
  }
  return [style, color];
}

function styleFromCell(cell) {
  const computed = window.getComputedStyle(cell);
  const style = {};
  const font = {};
  const fontFamily = computed.fontFamily.split(',')[0]?.replace(/^["']|["']$/g, '').trim();
  if (fontFamily) font.name = fontFamily;
  const fontSize = parseFontSize(computed.fontSize);
  if (fontSize) font.size = fontSize;
  if (computed.fontWeight === 'bold' || Number.parseInt(computed.fontWeight, 10) >= 600) font.bold = true;
  if (computed.fontStyle === 'italic') font.italic = true;
  if (Object.keys(font).length > 0) style.font = font;

  const color = normalizeColor(computed.color);
  if (color) style.color = color;
  const bgcolor = normalizeColor(computed.backgroundColor);
  if (bgcolor && bgcolor !== '#ffffff') style.bgcolor = bgcolor;
  if (computed.textDecorationLine.includes('underline')) style.underline = true;
  if (computed.textDecorationLine.includes('line-through')) style.strike = true;
  if (['left', 'center', 'right'].includes(computed.textAlign)) style.align = computed.textAlign;
  if (['top', 'middle', 'bottom'].includes(computed.verticalAlign)) style.valign = computed.verticalAlign;
  if (['pre-wrap', 'pre-line', 'break-spaces'].includes(computed.whiteSpace)) style.textwrap = true;

  const border = {};
  const top = borderFromCss(computed.borderTop);
  const right = borderFromCss(computed.borderRight);
  const bottom = borderFromCss(computed.borderBottom);
  const left = borderFromCss(computed.borderLeft);
  if (top) border.top = top;
  if (right) border.right = right;
  if (bottom) border.bottom = bottom;
  if (left) border.left = left;
  if (Object.keys(border).length > 0) style.border = border;

  return Object.keys(style).length > 0 ? style : null;
}

function collectCellText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue || '';
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }
  if (node.tagName === 'BR') {
    return '\n';
  }
  let text = '';
  node.childNodes.forEach((child) => {
    text += collectCellText(child);
  });
  return text;
}

function cellText(cell) {
  return collectCellText(cell)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseHtmlClipboard(html) {
  if (!html) return null;
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-10000px;top:-10000px;visibility:hidden;pointer-events:none;';
  container.innerHTML = html;
  document.body.appendChild(container);
  try {
    const table = container.querySelector('table');
    if (!table) return null;
    const rows = [];
    const merges = [];
    table.querySelectorAll('tr').forEach((tr, ri) => {
      const row = rows[ri] || [];
      let ci = 0;
      tr.querySelectorAll('td,th').forEach((td) => {
        while (row[ci]) ci += 1;
        const rowspan = Math.max(1, Number.parseInt(td.getAttribute('rowspan') || '1', 10));
        const colspan = Math.max(1, Number.parseInt(td.getAttribute('colspan') || '1', 10));
        row[ci] = {
          text: cellText(td),
          style: styleFromCell(td),
          merge: rowspan > 1 || colspan > 1 ? [rowspan - 1, colspan - 1] : undefined,
        };
        if (rowspan > 1 || colspan > 1) {
          merges.push({
            sri: ri,
            sci: ci,
            eri: ri + rowspan - 1,
            eci: ci + colspan - 1,
          });
        }
        for (let r = ri; r < ri + rowspan; r += 1) {
          rows[r] = rows[r] || [];
          for (let c = ci; c < ci + colspan; c += 1) {
            if (r !== ri || c !== ci) rows[r][c] = { covered: true };
          }
        }
        ci += colspan;
      });
      rows[ri] = row;
    });
    return rows.some(row => row && row.length > 0) ? { rows, merges } : null;
  } finally {
    document.body.removeChild(container);
  }
}

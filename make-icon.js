// Tekent het logo van Song Library en schrijft icon.ico (16-256 px) en logo.png.
// Geen afhankelijkheden: eigen rasterizer met 4x4 supersampling en PNG-codering via zlib.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

// Ontwerp in eenheden 0..1: ronde tegel met blauw-paars verloop, drie boekruggen en een gouden muzieknoot.
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function seg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function sample(x, y) {
  if (Math.hypot(x - 0.5, y - 0.5) > 0.49) return null;
  let c = mix([0.2, 0.3, 0.62], [0.12, 0.09, 0.25], (x + y) / 2);
  // Boekruggen
  const books = [[0.22, 0.34, [0.56, 0.71, 1]], [0.36, 0.48, [0.95, 0.7, 0.42]], [0.5, 0.6, [0.7, 0.86, 0.75]]];
  for (const [x0, x1, col] of books) if (x >= x0 && x <= x1 && y >= 0.26 && y <= 0.76) c = (y < 0.3 || y > 0.72) ? mix(col, [0, 0, 0], 0.35) : col;
  // Muzieknoot: kop, steel en vlag
  const gold = [1, 0.81, 0.35];
  if (Math.hypot((x - 0.69) / 1.25, y - 0.67) < 0.075) c = gold;
  if (seg(x, y, 0.76, 0.66, 0.76, 0.26) < 0.025) c = gold;
  if (seg(x, y, 0.76, 0.27, 0.86, 0.38) < 0.03) c = gold;
  return [...c, 1];
}

function render(size) {
  const ss = 4, px = Buffer.alloc(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sj = 0; sj < ss; sj++) {
        for (let si = 0; si < ss; si++) {
          const s = sample((i + (si + 0.5) / ss) / size, (j + (sj + 0.5) / ss) / size);
          if (!s) continue;
          r += s[0] * s[3]; g += s[1] * s[3]; b += s[2] * s[3]; a += s[3];
        }
      }
      const o = (j * size + i) * 4, n = ss * ss;
      px[o] = a ? Math.round((r / a) * 255) : 0;
      px[o + 1] = a ? Math.round((g / a) * 255) : 0;
      px[o + 2] = a ? Math.round((b / a) * 255) : 0;
      px[o + 3] = Math.round((a / n) * 255);
    }
  }
  return px;
}

function png(size, rgba) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8 bit, RGBA
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ICO-bestand met ingebedde PNG's (ondersteund sinds Windows Vista)
function ico(images) {
  const head = Buffer.alloc(6 + images.length * 16);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    head[e] = size >= 256 ? 0 : size; head[e + 1] = size >= 256 ? 0 : size;
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
    head.writeUInt32LE(data.length, e + 8); head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map(x => x.data)]);
}

const images = [256, 64, 48, 32, 24, 16].map(size => ({ size, data: png(size, render(size)) }));
fs.writeFileSync(path.join(__dirname, 'icon.ico'), ico(images));
fs.writeFileSync(path.join(__dirname, 'logo.png'), images[0].data);
console.log('icon.ico en logo.png gemaakt');

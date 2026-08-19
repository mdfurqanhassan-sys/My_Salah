const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function png(size, r, g, b) {
  const row = Buffer.alloc(1 + size * 3);
  row[0] = 0;
  for (let x = 0; x < size; x++) {
    const cx = x - size / 2;
    const cy = 0;
    const dist = Math.sqrt(cx * cx + cy * cy);
    const outer = size * 0.375;
    const inner = size * 0.125;
    let pr = 11, pg = 32, pb = 24;
    if (dist <= outer && dist >= inner) {
      pr = 231; pg = 199; pb = 108;
    }
    const i = 1 + x * 3;
    row[i] = pr; row[i + 1] = pg; row[i + 2] = pb;
  }
  const raw = Buffer.alloc((1 + size * 3) * size);
  for (let y = 0; y < size; y++) {
    const src = Buffer.alloc(1 + size * 3);
    src[0] = 0;
    for (let x = 0; x < size; x++) {
      const cx = x - size / 2;
      const cy = y - size / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      const outer = size * 0.375;
      const inner = size * 0.125;
      let pr = 11, pg = 32, pb = 24;
      if (dist <= outer && dist >= inner) {
        pr = 231; pg = 199; pb = 108;
      }
      const i = 1 + x * 3;
      src[i] = pr; src[i + 1] = pg; src[i + 2] = pb;
    }
    src.copy(raw, y * src.length);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const root = path.join(__dirname, '..');
const targets = [
  [192, 'icon-192.png'],
  [512, 'icon-512.png'],
  [180, 'icon-180.png']
];
for (const [size, name] of targets) {
  const data = png(size);
  fs.writeFileSync(path.join(root, name), data);
  fs.writeFileSync(path.join(root, 'www', name), data);
}
console.log('icons created');

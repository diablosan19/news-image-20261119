// news-image-20261119 — "The World in One Day", Thursday 19 November 2026.
//
// The front page is entry.png beside this file: a one-page newspaper drawn
// as hand-written HTML/SVG (page.html) and rasterised by render.mjs into a
// 1024x1024 image. This file is the contest entrypoint. It runs offline,
// takes no arguments, and does two things:
//
//   1. Prove the bundled image still meets the contest's hard limits — a
//      whole PNG or JPEG, at most 1024 pixels a side, at most 1 MiB — by
//      reading the width and height out of the file's own header bytes.
//      If the asset ever breaks a limit, refuse to emit it (exit 1)
//      instead of handing the grader an invalid entry.
//   2. Copy the verified bytes, unchanged, to the output directory.
//
// Local dry run (MAKEFUN_OUTPUT_DIR stands in for /output):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_BYTES = 1_048_576; // 1 MiB, per the contest rules
const MAX_SIDE = 1024; // pixels per axis, per the contest rules

function refuse(reason: string): never {
  console.error(`main.ts: refusing to emit entry.png — ${reason}`);
  process.exit(1);
}

// --- header readers --------------------------------------------------------

// CRC-32 (IEEE 802.3 polynomial), used to prove every PNG chunk is whole:
// the contest requires a whole image, not just a valid header.
const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf: Buffer, start: number, end: number): number {
  let c = 0xffffffff;
  for (let i = start; i < end; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// PNG: 8-byte signature, then the IHDR chunk; width and height are the two
// big-endian uint32 values at offsets 16 and 20. Every chunk's CRC is then
// checked and the file must end with the IEND chunk, so a truncated or
// corrupted image is refused rather than emitted.
function pngSize(buf: Buffer): [number, number] {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (buf.length < 24 || !signature.every((b, i) => buf[i] === b)) {
    refuse("PNG signature missing or file truncated before IHDR");
  }
  if (buf.toString("latin1", 12, 16) !== "IHDR") {
    refuse("first PNG chunk is not IHDR");
  }
  const [width, height] = [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  let at = 8;
  let sawIend = false;
  while (at + 8 <= buf.length) {
    const length = buf.readUInt32BE(at);
    const type = buf.toString("latin1", at + 4, at + 8);
    if (at + 12 + length > buf.length) refuse(`PNG chunk ${type} is truncated`);
    const stored = buf.readUInt32BE(at + 8 + length);
    if (crc32(buf, at + 4, at + 8 + length) !== stored) {
      refuse(`PNG chunk ${type} fails its CRC check`);
    }
    at += 12 + length;
    if (type === "IEND") {
      sawIend = true;
      break;
    }
  }
  if (!sawIend) refuse("PNG has no IEND chunk");
  if (at !== buf.length) refuse("trailing bytes after the PNG IEND chunk");
  return [width, height];
}

// JPEG: walk the marker segments after SOI until a start-of-frame segment
// (SOF0, SOF1 or SOF2) turns up; it stores height then width as big-endian
// uint16 values. The file must also end with the EOI marker (0xFF 0xD9),
// so a JPEG cut short is refused rather than emitted.
function jpegSize(buf: Buffer): [number, number] {
  let at = 2;
  let size: [number, number] | null = null;
  while (at + 4 <= buf.length) {
    if (buf[at] !== 0xff) refuse("JPEG marker stream is corrupt");
    const marker = buf[at + 1];
    const length = buf.readUInt16BE(at + 2);
    if (length < 2) refuse("JPEG marker stream is corrupt");
    if (marker >= 0xc0 && marker <= 0xc2 && size === null) {
      if (at + 9 > buf.length) refuse("JPEG frame header is truncated");
      size = [buf.readUInt16BE(at + 7), buf.readUInt16BE(at + 5)];
    }
    if (marker === 0xda) break; // start of scan: entropy data follows
    at += 2 + length;
  }
  if (size === null) return refuse("no JPEG start-of-frame segment found");
  if (buf[buf.length - 2] !== 0xff || buf[buf.length - 1] !== 0xd9) {
    refuse("JPEG has no end-of-image marker");
  }
  return size;
}

function imageSize(buf: Buffer): [number, number] {
  if (buf.length < 2) refuse("file is empty or truncated");
  if (buf[0] === 0x89 && buf[1] === 0x50) return pngSize(buf);
  if (buf[0] === 0xff && buf[1] === 0xd8) return jpegSize(buf);
  return refuse("file is neither PNG nor JPEG");
}

// --- verify, then deliver --------------------------------------------------

const asset = new URL("./entry.png", import.meta.url);
const bytes = readFileSync(asset);

if (bytes.length > MAX_BYTES) {
  refuse(`${bytes.length} bytes exceeds the ${MAX_BYTES}-byte limit`);
}
const [width, height] = imageSize(bytes);
if (width < 1 || height < 1 || width > MAX_SIDE || height > MAX_SIDE) {
  refuse(`image is ${width}x${height}; each side must be within 1..${MAX_SIDE}`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const destination = join(outDir, "entry.png");
copyFileSync(asset, destination);
console.log(
  `main.ts: entry.png verified (${width}x${height}, ${bytes.length} bytes) and written to ${destination}`,
);

import { describe, it, expect } from 'vitest';
import { exifDateFromArrayBuffer } from './exifDate.js';

// Build a minimal little-endian JPEG/EXIF buffer whose DateTimeOriginal
// (tag 0x9003) is "2026:08:15 12:30:00", to exercise the real parse path.
function makeExifJpeg(dateStr = '2026:08:15 12:30:00') {
  const tiff = [];
  const push16 = (arr, v) => { arr.push(v & 0xff, (v >> 8) & 0xff); }; // little-endian
  const push32 = (arr, v) => { arr.push(v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >> 24) & 0xff); };

  push16(tiff, 0x4949);        // "II" little-endian
  push16(tiff, 0x002a);        // magic 42
  push32(tiff, 8);             // IFD0 at offset 8

  // IFD0: one entry → Exif sub-IFD pointer (0x8769) → offset 26
  push16(tiff, 1);
  push16(tiff, 0x8769); push16(tiff, 4); push32(tiff, 1); push32(tiff, 26);
  push32(tiff, 0);             // no next IFD

  // Exif IFD at 26: one entry → DateTimeOriginal (0x9003) ASCII at offset 44
  push16(tiff, 1);
  push16(tiff, 0x9003); push16(tiff, 2); push32(tiff, 20); push32(tiff, 44);
  push32(tiff, 0);

  // Date string (20 bytes incl. NUL) at offset 44
  for (let i = 0; i < 19; i++) tiff.push(dateStr.charCodeAt(i));
  tiff.push(0);

  const exifHeader = [0x45, 0x78, 0x69, 0x66, 0, 0]; // "Exif\0\0"
  const segLen = 2 + exifHeader.length + tiff.length;
  const bytes = [
    0xff, 0xd8,                          // SOI
    0xff, 0xe1, (segLen >> 8) & 0xff, segLen & 0xff, // APP1 + big-endian length
    ...exifHeader,
    ...tiff,
  ];
  return new Uint8Array(bytes).buffer;
}

describe('exifDateFromArrayBuffer', () => {
  it('extracts DateTimeOriginal from a JPEG', () => {
    const ts = exifDateFromArrayBuffer(makeExifJpeg());
    expect(ts).toBe(new Date(2026, 7, 15, 12, 30, 0).getTime());
  });

  it('returns null for a non-JPEG buffer', () => {
    expect(exifDateFromArrayBuffer(new Uint8Array([1, 2, 3, 4]).buffer)).toBe(null);
  });

  it('returns null for a JPEG without EXIF', () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]); // SOI + EOI
    expect(exifDateFromArrayBuffer(bytes.buffer)).toBe(null);
  });
});

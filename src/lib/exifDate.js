// Best-effort EXIF capture-date reader for JPEG files.
//
// We only need one thing: when a photo was actually taken, so the gallery can
// sort chronologically rather than by upload time. This reads the JPEG APP1
// (Exif) segment and pulls DateTimeOriginal (tag 0x9003), falling back to
// DateTimeDigitized (0x9004). Anything unexpected returns null and the caller
// falls back to the file's lastModified date.
//
// Deliberately tiny and dependency-free — it parses just enough of the TIFF
// structure to find the date string and bails out safely on anything odd.

export function exifDateFromArrayBuffer(buf) {
  try {
    const view = new DataView(buf);
    // JPEG files start with SOI marker 0xFFD8.
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;

    const len = view.byteLength;
    let offset = 2;
    while (offset + 4 <= len) {
      const marker = view.getUint16(offset);
      // All segment markers are 0xFFxx; stop if we've fallen off the rails.
      if ((marker & 0xff00) !== 0xff00) break;
      const size = view.getUint16(offset + 2);
      if (marker === 0xffe1) {
        // APP1 — check for the "Exif\0\0" identifier.
        if (view.getUint32(offset + 4) === 0x45786966) {
          return parseExif(view, offset + 10);
        }
      }
      offset += 2 + size;
    }
    return null;
  } catch {
    return null;
  }
}

function parseExif(view, tiff) {
  // Byte order: 0x4949 = little-endian ("II"), 0x4D4D = big-endian ("MM").
  const little = view.getUint16(tiff) === 0x4949;
  const u16 = (o) => view.getUint16(o, little);
  const u32 = (o) => view.getUint32(o, little);

  const ifd0 = tiff + u32(tiff + 4);
  if (ifd0 + 2 > view.byteLength) return null;

  // Find the Exif sub-IFD pointer (tag 0x8769) in IFD0.
  const ifd0Count = u16(ifd0);
  let exifIFD = 0;
  for (let i = 0; i < ifd0Count; i++) {
    const entry = ifd0 + 2 + i * 12;
    if (u16(entry) === 0x8769) {
      exifIFD = tiff + u32(entry + 8);
      break;
    }
  }
  if (!exifIFD || exifIFD + 2 > view.byteLength) return null;

  // Scan the Exif IFD for a date tag.
  const count = u16(exifIFD);
  for (let i = 0; i < count; i++) {
    const entry = exifIFD + 2 + i * 12;
    const tag = u16(entry);
    if (tag === 0x9003 || tag === 0x9004) {
      // ASCII value (>4 bytes) is stored at an offset relative to the TIFF
      // header: "YYYY:MM:DD HH:MM:SS\0".
      const valOffset = tiff + u32(entry + 8);
      let s = '';
      for (let j = 0; j < 19 && valOffset + j < view.byteLength; j++) {
        s += String.fromCharCode(view.getUint8(valOffset + j));
      }
      const m = s.match(/^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
      if (m) {
        const [, Y, Mo, D, H, Mi, S] = m;
        return new Date(+Y, +Mo - 1, +D, +H, +Mi, +S).getTime();
      }
    }
  }
  return null;
}

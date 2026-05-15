/**
 * Unit tests for:
 *   - zipCrc32     (crc32)
 *   - zipHeaders   (createLocalFileHeader, createCentralDirectoryHeader,
 *                   createEndOfCentralDirectoryRecord)
 *   - zipAssembler (stringToUint8Array, assembleZip)
 *   - zipGenerator (createZipFile)
 */
import { crc32 } from '../../../utils/zipGeneratorCore/zipCrc32.js';
import {
  createLocalFileHeader,
  createCentralDirectoryHeader,
  createEndOfCentralDirectoryRecord,
} from '../../../utils/zipGeneratorCore/zipHeaders.js';
import {
  stringToUint8Array,
  assembleZip,
} from '../../../utils/zipGeneratorCore/zipAssembler.js';
import { createZipFile } from '../../../utils/zipGenerator.js';
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Read a 16-bit little-endian value from a Uint8Array at offset */
function readUint16LE(buf, offset) {
  return buf[offset] | (buf[offset + 1] << 8);
}
/** Read a 32-bit little-endian value from a Uint8Array at offset */
function readUint32LE(buf, offset) {
  return (
    (buf[offset] |
      (buf[offset + 1] << 8) |
      (buf[offset + 2] << 16) |
      (buf[offset + 3] << 24)) >>>
    0
  );
}
// ===========================================================================
// crc32
// ===========================================================================
describe('crc32', () => {
  it('returns 0x00000000 for an empty byte array', () => {
    expect(crc32(new Uint8Array([]))).toBe(0x00000000);
  });
  it('returns a 32-bit unsigned integer for any input', () => {
    const result = crc32(new Uint8Array([0x31]));
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
  });
  it('produces the known IEEE CRC-32 for "123456789" (0xCBF43926)', () => {
    const data = new TextEncoder().encode('123456789');
    expect(crc32(data)).toBe(0xcbf43926);
  });
  it('produces different checksums for different inputs', () => {
    const a = crc32(new TextEncoder().encode('hello'));
    const b = crc32(new TextEncoder().encode('world'));
    expect(a).not.toBe(b);
  });
  it('is deterministic — same input always yields the same checksum', () => {
    const data = new TextEncoder().encode('consistent');
    expect(crc32(data)).toBe(crc32(data));
  });
  it('is sensitive to byte order', () => {
    const ab = crc32(new Uint8Array([0x01, 0x02]));
    const ba = crc32(new Uint8Array([0x02, 0x01]));
    expect(ab).not.toBe(ba);
  });
  it('handles a single zero byte without throwing', () => {
    expect(() => crc32(new Uint8Array([0x00]))).not.toThrow();
  });
  it('handles a single 0xFF byte without throwing', () => {
    expect(() => crc32(new Uint8Array([0xff]))).not.toThrow();
  });
});
// ===========================================================================
// createLocalFileHeader
// ===========================================================================
describe('createLocalFileHeader', () => {
  const fileName = new TextEncoder().encode('test.txt');
  const fileContent = new TextEncoder().encode('hello');
  const fileCrc = crc32(fileContent);
  it('has total length of 30 + fileName.length', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(header.length).toBe(30 + fileName.length);
  });
  it('starts with local file signature PK\\x03\\x04', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(header[0]).toBe(0x50);
    expect(header[1]).toBe(0x4b);
    expect(header[2]).toBe(0x03);
    expect(header[3]).toBe(0x04);
  });
  it('sets version-needed-to-extract to 0x0014 at offset 4', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint16LE(header, 4)).toBe(0x0014);
  });
  it('sets general purpose bit flag to 0 at offset 6', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint16LE(header, 6)).toBe(0);
  });
  it('sets compression method to 0 (stored) at offset 8', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint16LE(header, 8)).toBe(0);
  });
  it('encodes the CRC-32 in little-endian at offset 14', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint32LE(header, 14)).toBe(fileCrc >>> 0);
  });
  it('encodes compressed size at offset 18', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint32LE(header, 18)).toBe(fileContent.length);
  });
  it('encodes uncompressed size at offset 22', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint32LE(header, 22)).toBe(fileContent.length);
  });
  it('encodes fileName length at offset 26', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint16LE(header, 26)).toBe(fileName.length);
  });
  it('sets extra field length to 0 at offset 28', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(readUint16LE(header, 28)).toBe(0);
  });
  it('embeds the filename bytes starting at offset 30', () => {
    const header = createLocalFileHeader(fileName, fileContent, fileCrc);
    expect(Array.from(header.slice(30))).toEqual(Array.from(fileName));
  });
  it('handles an empty filename', () => {
    const empty = new Uint8Array(0);
    const header = createLocalFileHeader(empty, fileContent, fileCrc);
    expect(header.length).toBe(30);
  });
  it('handles empty file content', () => {
    const empty = new Uint8Array(0);
    const header = createLocalFileHeader(fileName, empty, 0);
    expect(readUint32LE(header, 18)).toBe(0);
    expect(readUint32LE(header, 22)).toBe(0);
  });
});
// ===========================================================================
// createCentralDirectoryHeader
// ===========================================================================
describe('createCentralDirectoryHeader', () => {
  const fileName = new TextEncoder().encode('file.html');
  const fileContent = new TextEncoder().encode('content');
  const fileCrc = crc32(fileContent);
  const localOffset = 512;
  it('has total length of 46 + fileName.length', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(header.length).toBe(46 + fileName.length);
  });
  it('starts with central directory signature PK\\x01\\x02', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(header[0]).toBe(0x50);
    expect(header[1]).toBe(0x4b);
    expect(header[2]).toBe(0x01);
    expect(header[3]).toBe(0x02);
  });
  it('sets version-made-by to 0x0014 at offset 4', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint16LE(header, 4)).toBe(0x0014);
  });
  it('sets version-needed-to-extract to 0x0014 at offset 6', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint16LE(header, 6)).toBe(0x0014);
  });
  it('sets compression method to 0 at offset 10', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint16LE(header, 10)).toBe(0);
  });
  it('encodes the CRC-32 at offset 16', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint32LE(header, 16)).toBe(fileCrc >>> 0);
  });
  it('encodes compressed size at offset 20', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint32LE(header, 20)).toBe(fileContent.length);
  });
  it('encodes uncompressed size at offset 24', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint32LE(header, 24)).toBe(fileContent.length);
  });
  it('encodes fileName length at offset 28', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint16LE(header, 28)).toBe(fileName.length);
  });
  it('sets extra field length to 0 at offset 30', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint16LE(header, 30)).toBe(0);
  });
  it('sets file comment length to 0 at offset 32', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint16LE(header, 32)).toBe(0);
  });
  it('sets disk number start to 0 at offset 34', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint16LE(header, 34)).toBe(0);
  });
  it('sets external file attributes to 0 at offset 38', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint32LE(header, 38)).toBe(0);
  });
  it('encodes the local header offset at offset 42', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(readUint32LE(header, 42)).toBe(localOffset);
  });
  it('encodes offset 0 correctly', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      0
    );
    expect(readUint32LE(header, 42)).toBe(0);
  });
  it('embeds the filename bytes starting at offset 46', () => {
    const header = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      localOffset
    );
    expect(Array.from(header.slice(46))).toEqual(Array.from(fileName));
  });
});
// ===========================================================================
// createEndOfCentralDirectoryRecord
// ===========================================================================
describe('createEndOfCentralDirectoryRecord', () => {
  it('is always exactly 22 bytes', () => {
    expect(createEndOfCentralDirectoryRecord(0, 0, 0).length).toBe(22);
    expect(createEndOfCentralDirectoryRecord(99, 9999, 99999).length).toBe(22);
  });
  it('starts with EOCD signature PK\\x05\\x06', () => {
    const record = createEndOfCentralDirectoryRecord(3, 100, 200);
    expect(record[0]).toBe(0x50);
    expect(record[1]).toBe(0x4b);
    expect(record[2]).toBe(0x05);
    expect(record[3]).toBe(0x06);
  });
  it('sets number-of-this-disk to 0 at offset 4', () => {
    const record = createEndOfCentralDirectoryRecord(1, 0, 0);
    expect(readUint16LE(record, 4)).toBe(0);
  });
  it('sets disk-where-CD-starts to 0 at offset 6', () => {
    const record = createEndOfCentralDirectoryRecord(1, 0, 0);
    expect(readUint16LE(record, 6)).toBe(0);
  });
  it('encodes file count at offset 8 (records on this disk)', () => {
    const record = createEndOfCentralDirectoryRecord(5, 0, 0);
    expect(readUint16LE(record, 8)).toBe(5);
  });
  it('encodes file count at offset 10 (total records)', () => {
    const record = createEndOfCentralDirectoryRecord(5, 0, 0);
    expect(readUint16LE(record, 10)).toBe(5);
  });
  it('encodes central directory size at offset 12', () => {
    const record = createEndOfCentralDirectoryRecord(1, 256, 0);
    expect(readUint32LE(record, 12)).toBe(256);
  });
  it('encodes central directory offset at offset 16', () => {
    const record = createEndOfCentralDirectoryRecord(1, 0, 1024);
    expect(readUint32LE(record, 16)).toBe(1024);
  });
  it('sets comment length to 0 at offset 20', () => {
    const record = createEndOfCentralDirectoryRecord(0, 0, 0);
    expect(readUint16LE(record, 20)).toBe(0);
  });
  it('handles zero files correctly', () => {
    const record = createEndOfCentralDirectoryRecord(0, 0, 0);
    expect(readUint16LE(record, 8)).toBe(0);
    expect(readUint16LE(record, 10)).toBe(0);
  });
});
// ===========================================================================
// stringToUint8Array
// ===========================================================================
describe('stringToUint8Array', () => {
  it('encodes an ASCII string to correct byte values', () => {
    expect(stringToUint8Array('ABC')).toEqual(new Uint8Array([65, 66, 67]));
  });
  it('encodes an empty string to an empty Uint8Array', () => {
    expect(stringToUint8Array('')).toEqual(new Uint8Array([]));
  });
  it('encodes a multi-byte UTF-8 character (€ → 0xE2 0x82 0xAC)', () => {
    expect(stringToUint8Array('€')).toEqual(new Uint8Array([0xe2, 0x82, 0xac]));
  });
  it('produces the correct length for a purely ASCII string', () => {
    expect(stringToUint8Array('hello').length).toBe(5);
  });
});
// ===========================================================================
// assembleZip
// ===========================================================================
describe('assembleZip', () => {
  it('returns a Blob', () => {
    expect(assembleZip([{ name: 'a.txt', content: 'hello' }])).toBeInstanceOf(
      Blob
    );
  });
  it('returns a Blob with MIME type "application/zip"', () => {
    expect(assembleZip([{ name: 'a.txt', content: 'hello' }]).type).toBe(
      'application/zip'
    );
  });
  it('handles an empty file list without throwing', () => {
    expect(() => assembleZip([])).not.toThrow();
  });
  it('handles multiple files without throwing', () => {
    expect(() =>
      assembleZip([
        { name: 'index.html', content: '<html/>' },
        { name: 'style.css', content: 'body{}' },
        { name: 'main.js', content: 'console.log(1)' },
      ])
    ).not.toThrow();
  });
  it('produces a larger Blob when more files are added', () => {
    const one = assembleZip([{ name: 'a.txt', content: 'x' }]);
    const two = assembleZip([
      { name: 'a.txt', content: 'x' },
      { name: 'b.txt', content: 'y' },
    ]);
    expect(two.size).toBeGreaterThan(one.size);
  });
  it('handles a file with empty content', () => {
    expect(() =>
      assembleZip([{ name: 'empty.txt', content: '' }])
    ).not.toThrow();
  });
  it('handles a file whose name contains path separators', () => {
    expect(() =>
      assembleZip([{ name: 'assets/images/logo.png', content: 'data' }])
    ).not.toThrow();
  });
});
// ===========================================================================
// createZipFile
// ===========================================================================
describe('createZipFile', () => {
  it('returns a Blob', () => {
    expect(createZipFile([{ name: 'test.txt', content: 'hi' }])).toBeInstanceOf(
      Blob
    );
  });
  it('returns a Blob with MIME type "application/zip"', () => {
    expect(createZipFile([{ name: 'test.txt', content: 'hi' }]).type).toBe(
      'application/zip'
    );
  });
  it('produces the same byte size as assembleZip for the same input', () => {
    const files = [{ name: 'x.txt', content: 'abc' }];
    expect(createZipFile(files).size).toBe(assembleZip(files).size);
  });
  it('handles an empty file list without throwing', () => {
    expect(() => createZipFile([])).not.toThrow();
  });
  it('handles multiple files', () => {
    expect(() =>
      createZipFile([
        { name: 'a.html', content: '<p>hi</p>' },
        { name: 'b.css', content: 'p{color:red}' },
      ])
    ).not.toThrow();
  });
});

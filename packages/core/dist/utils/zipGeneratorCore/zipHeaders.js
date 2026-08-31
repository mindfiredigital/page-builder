/* Writes a 32-bit little-endian integer into a Uint8Array at the given offset */
function writeUint32LE(target, value, offset) {
    target.set([
        value & 0xff,
        (value >> 8) & 0xff,
        (value >> 16) & 0xff,
        (value >> 24) & 0xff,
    ], offset);
}
/* Writes a 16-bit little-endian integer into a Uint8Array at the given offset */
function writeUint16LE(target, value, offset) {
    target.set([value & 0xff, (value >> 8) & 0xff], offset);
}
/* Builds the 30-byte local file header that precedes each file's raw content */
export function createLocalFileHeader(fileName, fileContent, crc) {
    const header = new Uint8Array(30 + fileName.length);
    /* Local file header signature: PK\x03\x04 */
    header.set([0x50, 0x4b, 0x03, 0x04]);
    writeUint16LE(header, 0x0014, 4); /* Version needed to extract (2.0) */
    writeUint16LE(header, 0x0000, 6); /* General purpose bit flag */
    writeUint16LE(header, 0x0000, 8); /* Compression method (0 = stored) */
    writeUint16LE(header, 0x0000, 10); /* Last mod file time */
    writeUint16LE(header, 0x0000, 12); /* Last mod file date */
    writeUint32LE(header, crc, 14); /* CRC-32 — offset 14 */
    writeUint32LE(header, fileContent.length, 18); /* Compressed size */
    writeUint32LE(header, fileContent.length, 22); /* Uncompressed size */
    writeUint16LE(header, fileName.length, 26); /* Filename length */
    writeUint16LE(header, 0x0000, 28); /* Extra field length */
    header.set(fileName, 30);
    return header;
}
/* Builds the 46-byte central directory header written after all file data */
export function createCentralDirectoryHeader(fileName, fileContent, crc, localHeaderOffset) {
    const header = new Uint8Array(46 + fileName.length);
    /* Central file header signature: PK\x01\x02 */
    header.set([0x50, 0x4b, 0x01, 0x02]);
    writeUint16LE(header, 0x0014, 4); /* Version made by */
    writeUint16LE(header, 0x0014, 6); /* Version needed to extract */
    writeUint16LE(header, 0x0000, 8); /* General purpose bit flag */
    writeUint16LE(header, 0x0000, 10); /* Compression method */
    writeUint16LE(header, 0x0000, 12); /* Last mod file time */
    writeUint16LE(header, 0x0000, 14); /* Last mod file date */
    writeUint32LE(header, crc, 16); /* CRC-32 */
    writeUint32LE(header, fileContent.length, 20); /* Compressed size */
    writeUint32LE(header, fileContent.length, 24); /* Uncompressed size */
    writeUint16LE(header, fileName.length, 28); /* Filename length */
    writeUint16LE(header, 0x0000, 30); /* Extra field length */
    writeUint16LE(header, 0x0000, 32); /* File comment length */
    writeUint16LE(header, 0x0000, 34); /* Disk number start */
    writeUint16LE(header, 0x0000, 36); /* Internal file attributes */
    writeUint32LE(header, 0x00000000, 38); /* External file attributes */
    writeUint32LE(header, localHeaderOffset, 42); /* Relative offset of local header */
    header.set(fileName, 46);
    return header;
}
/* Builds the 22-byte end-of-central-directory record that terminates the ZIP */
export function createEndOfCentralDirectoryRecord(fileCount, centralDirectorySize, centralDirectoryOffset) {
    const record = new Uint8Array(22);
    /* End of central directory signature: PK\x05\x06 */
    record.set([0x50, 0x4b, 0x05, 0x06]);
    writeUint16LE(record, 0x0000, 4); /* Number of this disk */
    writeUint16LE(record, 0x0000, 6); /* Disk where central directory starts */
    writeUint16LE(record, fileCount, 8); /* Central directory records on this disk */
    writeUint16LE(record, fileCount, 10); /* Total central directory records */
    writeUint32LE(record, centralDirectorySize, 12); /* Size of central directory */
    writeUint32LE(record, centralDirectoryOffset, 16); /* Offset of central directory */
    writeUint16LE(record, 0x0000, 20); /* Comment length */
    return record;
}

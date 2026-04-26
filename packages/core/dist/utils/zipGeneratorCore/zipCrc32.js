/* Computes a CRC-32 checksum for the given byte array */
export function crc32(data) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    /* Process each bit with the standard CRC-32 polynomial 0xEDB88320 */
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  // >>> 0 forces the result to an unsigned 32-bit integer,
  // preventing negative return values from the XOR operation.
  return (crc ^ 0xffffffff) >>> 0;
}

export declare function createLocalFileHeader(
  fileName: Uint8Array,
  fileContent: Uint8Array,
  crc: number
): Uint8Array;
export declare function createCentralDirectoryHeader(
  fileName: Uint8Array,
  fileContent: Uint8Array,
  crc: number,
  localHeaderOffset: number
): Uint8Array;
export declare function createEndOfCentralDirectoryRecord(
  fileCount: number,
  centralDirectorySize: number,
  centralDirectoryOffset: number
): Uint8Array;

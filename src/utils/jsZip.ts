export function createZipFile(
  files: { name: string; content: string }[]
): Blob {
  // Helper function to convert string to Uint8Array
  const stringToUint8Array = (str: string): Uint8Array => {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  };

  // Generate local file header
  const createLocalFileHeader = (
    fileName: Uint8Array,
    fileContent: Uint8Array,
    crc: number
  ): Uint8Array => {
    const header = new Uint8Array(30 + fileName.length);

    // Local file header signature
    header.set([0x50, 0x4b, 0x03, 0x04]);

    // Version needed to extract (2.0)
    header.set([0x14, 0x00], 4);

    // General purpose bit flag (no compression)
    header.set([0x00, 0x00], 6);

    // Compression method (0 = stored)
    header.set([0x00, 0x00], 8);

    // Last mod file time (current time)
    header.set([0x00, 0x00], 10);

    // Last mod file date (current date)
    header.set([0x00, 0x00], 12);

    // CRC-32
    header.set(
      [crc & 0xff, (crc >> 8) & 0xff, (crc >> 16) & 0xff, (crc >> 24) & 0xff],
      14
    );

    // Compressed size
    header.set(
      [
        fileContent.length & 0xff,
        (fileContent.length >> 8) & 0xff,
        (fileContent.length >> 16) & 0xff,
        (fileContent.length >> 24) & 0xff,
      ],
      18
    );

    // Uncompressed size
    header.set(
      [
        fileContent.length & 0xff,
        (fileContent.length >> 8) & 0xff,
        (fileContent.length >> 16) & 0xff,
        (fileContent.length >> 24) & 0xff,
      ],
      22
    );

    // Filename length
    header.set([fileName.length & 0xff, (fileName.length >> 8) & 0xff], 26);

    // Extra field length
    header.set([0x00, 0x00], 28);

    // Filename
    header.set(fileName, 30);

    return header;
  };

  // Generate central directory header
  const createCentralDirectoryHeader = (
    fileName: Uint8Array,
    fileContent: Uint8Array,
    crc: number,
    localHeaderOffset: number
  ): Uint8Array => {
    const header = new Uint8Array(46 + fileName.length);

    // Central file header signature
    header.set([0x50, 0x4b, 0x01, 0x02]);

    // Version made by
    header.set([0x14, 0x00], 4);

    // Version needed to extract
    header.set([0x14, 0x00], 6);

    // General purpose bit flag
    header.set([0x00, 0x00], 8);

    // Compression method (0 = stored)
    header.set([0x00, 0x00], 10);

    // Last mod file time
    header.set([0x00, 0x00], 12);

    // Last mod file date
    header.set([0x00, 0x00], 14);

    // CRC-32
    header.set(
      [crc & 0xff, (crc >> 8) & 0xff, (crc >> 16) & 0xff, (crc >> 24) & 0xff],
      16
    );

    // Compressed size
    header.set(
      [
        fileContent.length & 0xff,
        (fileContent.length >> 8) & 0xff,
        (fileContent.length >> 16) & 0xff,
        (fileContent.length >> 24) & 0xff,
      ],
      20
    );

    // Uncompressed size
    header.set(
      [
        fileContent.length & 0xff,
        (fileContent.length >> 8) & 0xff,
        (fileContent.length >> 16) & 0xff,
        (fileContent.length >> 24) & 0xff,
      ],
      24
    );

    // Filename length
    header.set([fileName.length & 0xff, (fileName.length >> 8) & 0xff], 28);

    // Extra field length
    header.set([0x00, 0x00], 30);

    // File comment length
    header.set([0x00, 0x00], 32);

    // Disk number start
    header.set([0x00, 0x00], 34);

    // Internal file attributes
    header.set([0x00, 0x00], 36);

    // External file attributes
    header.set([0x00, 0x00, 0x00, 0x00], 38);

    // Relative offset of local header
    header.set(
      [
        localHeaderOffset & 0xff,
        (localHeaderOffset >> 8) & 0xff,
        (localHeaderOffset >> 16) & 0xff,
        (localHeaderOffset >> 24) & 0xff,
      ],
      42
    );

    // Filename
    header.set(fileName, 46);

    return header;
  };

  // Generate end of central directory record
  const createEndOfCentralDirectoryRecord = (
    fileCount: number,
    centralDirectorySize: number,
    centralDirectoryOffset: number
  ): Uint8Array => {
    const record = new Uint8Array(22);

    // End of central directory signature
    record.set([0x50, 0x4b, 0x05, 0x06]);

    // Number of this disk
    record.set([0x00, 0x00], 4);

    // Disk where central directory starts
    record.set([0x00, 0x00], 6);

    // Number of central directory records on this disk
    record.set([fileCount & 0xff, (fileCount >> 8) & 0xff], 8);

    // Total number of central directory records
    record.set([fileCount & 0xff, (fileCount >> 8) & 0xff], 10);

    // Size of central directory
    record.set(
      [
        centralDirectorySize & 0xff,
        (centralDirectorySize >> 8) & 0xff,
        (centralDirectorySize >> 16) & 0xff,
        (centralDirectorySize >> 24) & 0xff,
      ],
      12
    );

    // Offset of central directory
    record.set(
      [
        centralDirectoryOffset & 0xff,
        (centralDirectoryOffset >> 8) & 0xff,
        (centralDirectoryOffset >> 16) & 0xff,
        (centralDirectoryOffset >> 24) & 0xff,
      ],
      16
    );

    // Comment length
    record.set([0x00, 0x00], 20);

    return record;
  };

  // Combine all parts to create ZIP file
  const zipParts: Uint8Array[] = [];
  let currentOffset = 0;
  const centralDirectoryHeaders: Uint8Array[] = [];

  // Process each file
  files.forEach(file => {
    const fileName = stringToUint8Array(file.name);
    const fileContent = stringToUint8Array(file.content);

    // Calculate CRC-32
    const fileCrc = crc32(fileContent);

    // Create local file header
    const localHeader = createLocalFileHeader(fileName, fileContent, fileCrc);

    // Add local file header and content to zip parts
    zipParts.push(localHeader);
    zipParts.push(fileContent);

    // Create central directory header
    const centralHeader = createCentralDirectoryHeader(
      fileName,
      fileContent,
      fileCrc,
      currentOffset
    );
    centralDirectoryHeaders.push(centralHeader);

    // Update offset
    currentOffset += localHeader.length + fileContent.length;
  });

  // Add central directory headers
  zipParts.push(...centralDirectoryHeaders);

  // Calculate central directory size
  const centralDirectorySize = centralDirectoryHeaders.reduce(
    (sum, header) => sum + header.length,
    0
  );

  // Create and add end of central directory record
  const endOfCentralDirectory = createEndOfCentralDirectoryRecord(
    files.length,
    centralDirectorySize,
    currentOffset
  );
  zipParts.push(endOfCentralDirectory);

  // Combine all parts into a single Uint8Array
  const zipArray = new Uint8Array(
    zipParts.reduce(
      (acc: number[], part: Uint8Array) => acc.concat(Array.from(part)),
      []
    )
  );

  // Create and return Blob
  return new Blob([zipArray], { type: 'application/zip' });
}

// CRC-32 implementation
function crc32(data: Uint8Array): number {
  // Simple CRC-32 implementation
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return crc ^ 0xffffffff;
}

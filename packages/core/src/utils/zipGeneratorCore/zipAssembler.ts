import { crc32 } from './zipCrc32';
import {
  createLocalFileHeader,
  createCentralDirectoryHeader,
  createEndOfCentralDirectoryRecord,
} from './zipHeaders';

/* Encodes a JS string to a UTF-8 Uint8Array */
export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/* Iterates over every file, builds local + central headers, assembles the ZIP Blob */
export function assembleZip(files: { name: string; content: string }[]): Blob {
  const zipParts: Uint8Array[] = [];
  const centralDirectoryHeaders: Uint8Array[] = [];
  let currentOffset = 0;

  files.forEach(file => {
    const fileName = stringToUint8Array(file.name);
    const fileContent = stringToUint8Array(file.content);
    const fileCrc = crc32(fileContent);

    /* Local header + raw file content go first in the archive */
    const localHeader = createLocalFileHeader(fileName, fileContent, fileCrc);
    zipParts.push(localHeader);
    zipParts.push(fileContent);

    /* Central directory header is queued to be written after all file data */
    centralDirectoryHeaders.push(
      createCentralDirectoryHeader(
        fileName,
        fileContent,
        fileCrc,
        currentOffset
      )
    );

    /* Advance the offset by the size of what we just appended */
    currentOffset += localHeader.length + fileContent.length;
  });

  /* Append all central directory headers after the file data */
  zipParts.push(...centralDirectoryHeaders);

  const centralDirectorySize = centralDirectoryHeaders.reduce(
    (sum, header) => sum + header.length,
    0
  );

  /* The end-of-central-directory record terminates the archive */
  zipParts.push(
    createEndOfCentralDirectoryRecord(
      files.length,
      centralDirectorySize,
      currentOffset
    )
  );

  /* Flatten all Uint8Array parts into a single contiguous array */
  const zipArray = new Uint8Array(
    zipParts.reduce(
      (acc: number[], part: Uint8Array) => acc.concat(Array.from(part)),
      []
    )
  );

  return new Blob([zipArray], { type: 'application/zip' });
}

// Utility function to convert string to Uint8Array
function stringToUint8Array(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}
// Create a ZIP file as a Blob
export function createZipFile(files) {
  const fileRecords = [];
  const centralDirectory = [];
  let offset = 0;
  files.forEach((file, index) => {
    const fileName = stringToUint8Array(file.name);
    const fileContent = stringToUint8Array(file.content);
    // Local file header
    const localHeader = new Uint8Array(30 + fileName.length);
    localHeader.set([
      0x50,
      0x4b,
      0x03,
      0x04, // Local file header signature
      0x14,
      0x00, // Version needed to extract
      0x00,
      0x00, // General purpose bit flag
      0x00,
      0x00, // Compression method (0 = stored)
      0x00,
      0x00, // File modification time
      0x00,
      0x00, // File modification date
      ...Array(4).fill(0x00), // CRC-32 (set to 0 for simplicity)
      ...Array(4).fill(0x00), // Compressed size (no compression)
      ...Array(4).fill(0x00), // Uncompressed size
      fileName.length & 0xff,
      (fileName.length >> 8) & 0xff, // File name length
      0x00,
      0x00, // Extra field length
    ]);
    localHeader.set(fileName, 30); // Append file name
    fileRecords.push(localHeader, fileContent);
    // Central directory header
    const centralHeader = new Uint8Array(46 + fileName.length);
    centralHeader.set([
      0x50,
      0x4b,
      0x01,
      0x02, // Central file header signature
      0x14,
      0x00, // Version made by
      0x14,
      0x00, // Version needed to extract
      0x00,
      0x00, // General purpose bit flag
      0x00,
      0x00, // Compression method
      0x00,
      0x00, // File modification time
      0x00,
      0x00, // File modification date
      ...Array(4).fill(0x00), // CRC-32
      ...Array(4).fill(0x00), // Compressed size
      ...Array(4).fill(0x00), // Uncompressed size
      fileName.length & 0xff,
      (fileName.length >> 8) & 0xff, // File name length
      0x00,
      0x00, // Extra field length
      0x00,
      0x00, // File comment length
      0x00,
      0x00, // Disk number start
      0x00,
      0x00, // Internal file attributes
      ...Array(4).fill(0x00), // External file attributes
      offset & 0xff,
      (offset >> 8) & 0xff,
      (offset >> 16) & 0xff,
      (offset >> 24) & 0xff, // Offset of local file header
    ]);
    centralHeader.set(fileName, 46); // Append file name
    centralDirectory.push(centralHeader);
    offset += localHeader.length + fileContent.length; // Update offset
  });
  // End of central directory record
  const endOfCentralDir = new Uint8Array(22);
  endOfCentralDir.set([
    0x50,
    0x4b,
    0x05,
    0x06, // End of central directory signature
    0x00,
    0x00, // Number of this disk
    0x00,
    0x00, // Disk where central directory starts
    files.length & 0xff,
    (files.length >> 8) & 0xff, // Number of central directory records on this disk
    files.length & 0xff,
    (files.length >> 8) & 0xff, // Total number of central directory records
    centralDirectory.reduce((sum, dir) => sum + dir.length, 0) & 0xff, // Size of central directory
    offset & 0xff,
    (offset >> 8) & 0xff,
    (offset >> 16) & 0xff,
    (offset >> 24) & 0xff, // Offset of central directory
    0x00,
    0x00, // Comment length
  ]);
  // Combine all parts into a single ZIP file
  const zipContent = [...fileRecords, ...centralDirectory, endOfCentralDir];
  const zipArray = new Uint8Array(
    zipContent.reduce((acc, part) => acc.concat(Array.from(part)), [])
  );
  return new Blob([zipArray], { type: 'application/zip' });
}
// Example usage: Export HTML and CSS as a ZIP file
//   exportButton.addEventListener('click', () => {
//     const html = htmlCode.innerText;
//     const css = cssCode.innerText;
//     const zipFile = createZipFile([
//       { name: 'index.html', content: html },
//       { name: 'styles.css', content: css }
//     ]);
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(zipFile);
//     link.download = 'exported-files.zip';
//     link.click();
//     URL.revokeObjectURL(link.href);
//   });

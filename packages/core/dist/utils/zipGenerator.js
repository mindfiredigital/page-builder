import { assembleZip } from './zipGeneratorCore.js';
/* Creates a ZIP Blob from an array of named file objects */
export function createZipFile(files) {
  return assembleZip(files);
}

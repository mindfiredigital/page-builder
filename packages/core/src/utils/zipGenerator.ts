import { assembleZip } from './zipGeneratorCore';

/* Creates a ZIP Blob from an array of named file objects */
export function createZipFile(
  files: { name: string; content: string }[]
): Blob {
  return assembleZip(files);
}

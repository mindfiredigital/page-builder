import { createZipFile } from '../utils/zipGenerator';

/* Builds and returns the "Export to ZIP" button */
export function createExportToZipButton(
  html: string,
  css: string
): HTMLButtonElement {
  const exportButton = document.createElement('button');
  exportButton.textContent = 'Export to ZIP';
  exportButton.classList.add('export-btn');

  exportButton.addEventListener('click', () => {
    const zipFile = createZipFile([
      { name: 'index.html', content: html },
      { name: 'styles.css', content: css },
    ]);

    const objectUrl = URL.createObjectURL(zipFile);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'exported-files.zip';

    /* Link must be in the DOM for Firefox compatibility */
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* Delay revoke so the browser fully reads the blob before it is freed */
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
  });

  return exportButton;
}

import { HTMLGenerator } from './HTMLGenerator';
import { Canvas } from '../canvas/Canvas';
import { showNotification } from '../utils/utilityFunctions';
import html2pdf from 'html2pdf.js';

/* Wires the PDF export button click handler */
export function setupExportPDFButton(): void {
  const exportButton = document.getElementById('export-pdf-btn');
  if (!exportButton) return;

  exportButton.addEventListener('click', async () => {
    showNotification('Generating PDF for download...');

    /* Remove all focus and selection states before capturing */
    (document.activeElement as HTMLElement)?.blur();
    document
      .querySelectorAll('.selected')
      .forEach(el => el.classList.remove('selected'));
    document
      .querySelectorAll('.table-cell-content')
      .forEach(el => (el as HTMLElement).blur());

    /* Wait for the UI to settle before capturing */
    await new Promise(resolve => setTimeout(resolve, 1500));

    const tempContainer = document.createElement('div');

    try {
      const worker = html2pdf();
      if (!worker) {
        showNotification('html2pdf library not loaded');
        return;
      }

      const htmlGenerator = new HTMLGenerator(new Canvas());
      const contentHTML = htmlGenerator.generateHTML();
      let css = htmlGenerator.generateCSS();

      const canvasElement = document.getElementById('canvas');
      if (!canvasElement) return;

      const contentWidth = canvasElement.scrollWidth;
      const contentHeight = canvasElement.scrollHeight;

      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1123;
      const MARGIN_BUFFER_PX = 40;
      const QUALITY_SCALE = 3;

      /* Scale content to fit an A4 page without exceeding 1:1 */
      const widthScaleFactor = (A4_WIDTH_PX - MARGIN_BUFFER_PX) / contentWidth;
      const heightScaleFactor =
        (A4_HEIGHT_PX - MARGIN_BUFFER_PX) / contentHeight;
      const SHRINK_FACTOR = Math.min(widthScaleFactor, heightScaleFactor, 1);
      const FINAL_SCALE = SHRINK_FACTOR * QUALITY_SCALE;

      /* Replace viewport-relative heights so the PDF doesn't overflow */
      css = css.replace(/min-height:\s*100vh/gi, 'min-height: auto');

      const pdfContent = `
        <style>
          ${css}
          * { box-sizing: border-box; }
          html, body, #pdf-wrapper {
            margin: 0; padding: 0;
            overflow: visible !important;
            font-family: Arial, sans-serif !important;
            background-color: white !important;
          }
          *:focus { outline: none !important; box-shadow: none !important; }
          .selected { outline: none !important; box-shadow: none !important; border-color: inherit !important; }
          .table-cell-content:focus { outline: none !important; border: none !important; }
          #pdf-wrapper {
            width: ${contentWidth}px !important;
            height: ${contentHeight}px !important;
            overflow: visible !important;
            transform: none !important;
          }
          #canvas.home {
            width: ${contentWidth}px !important;
            height: ${contentHeight}px !important;
            min-height: auto !important;
            transform: none !important;
            position: relative !important;
            margin: 0 !important; padding: 0 !important;
            overflow: visible !important;
          }
          table, #pdf-wrapper, #canvas.home { page-break-inside: avoid !important; }
        </style>
        <div id="pdf-wrapper">${contentHTML}</div>
      `;

      tempContainer.innerHTML = pdfContent;
      tempContainer.style.cssText = `
        position: absolute; left: -99999px; top: 0;
        width: ${contentWidth}px; height: ${contentHeight}px;
        overflow: visible; background-color: white;
      `;
      document.body.appendChild(tempContainer);

      await new Promise(resolve => setTimeout(resolve, 100));

      const sourceElement = tempContainer.querySelector(
        '#pdf-wrapper'
      ) as HTMLElement;
      if (!sourceElement)
        throw new Error('PDF source element (#pdf-wrapper) not found.');

      await worker
        .set({
          filename: 'exported_page_download.pdf',
          image: { type: 'png', quality: 1 },
          html2canvas: {
            scale: FINAL_SCALE,
            width: contentWidth,
            height: contentHeight,
            useCORS: true,
            logging: false,
            backgroundColor: null,
            letterRendering: true,
            allowTaint: true,
            onclone: (clonedDoc: Document) => {
              /* Strip selection styles from the cloned document */
              clonedDoc
                .querySelectorAll('.selected')
                .forEach(el => el.classList.remove('selected'));
              clonedDoc.querySelectorAll('.table-cell-content').forEach(el => {
                (el as HTMLElement).style.outline = 'none';
                (el as HTMLElement).style.boxShadow = 'none';
              });
            },
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(sourceElement)
        .save();

      showNotification('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      showNotification('Error generating PDF. Check console for details.');
    } finally {
      /* Always clean up the off-screen container */
      if (document.body.contains(tempContainer)) {
        document.body.removeChild(tempContainer);
      }
    }
  });
}

import { showNotification } from '../utils/utilityFunctions';
import { Canvas } from '../canvas/Canvas';
import html2pdf from 'html2pdf.js';

const EDITOR_CHROME_SELECTOR = [
  '.component-controls',
  '.component-label',
  '.pencil-button',
  '.upload-btn',
  '.upload-text',
  '.canvas-resizers',
  '.resizers',
  '.drop-preview',
  '.edit-link-form',
  '.edit-link',
  '.cell-controls',
  '.insert-row-button',
  '.add-row-button',
  '.add-multiple-rows-button',
  '.table-btn-container',
  '.rt-block-controls',
  '.rt-add-popover',
  '#canvas-scroll-spacer',
].join(', ');

/* Wires the PDF export button click handler */
export function setupExportPDFButton(): void {
  const exportButton = document.getElementById('export-pdf-btn');
  if (!exportButton) return;

  exportButton.addEventListener('click', async () => {
    showNotification('Generating PDF for download...');

    const canvasEl = document.getElementById('canvas');
    if (!canvasEl) return;

    /* Remove all focus and selection states */
    (document.activeElement as HTMLElement)?.blur();
    canvasEl
      .querySelectorAll('.selected')
      .forEach(el => el.classList.remove('selected'));
    canvasEl
      .querySelectorAll('.table-cell-content')
      .forEach(el => (el as HTMLElement).blur());

    /* Hide editor-only UI on the live DOM (backup — the onclone handler
       removes them from the clone html2canvas actually renders) */
    const editorEls = Array.from(
      canvasEl.querySelectorAll(EDITOR_CHROME_SELECTOR)
    ) as HTMLElement[];
    editorEls.forEach(el => (el.style.visibility = 'hidden'));

    /* Scroll canvas to top so the clone starts at the beginning */
    const savedScrollTop = canvasEl.scrollTop;
    const savedScrollLeft = canvasEl.scrollLeft;
    canvasEl.scrollTop = 0;
    canvasEl.scrollLeft = 0;

    /* Let the DOM settle after hiding elements */
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      /* Calculate actual content bounds — exclude the scroll spacer which
         inflates scrollHeight far beyond the real content edge */
      let contentWidth: number;
      let contentHeight: number;

      if (Canvas.layoutMode === 'absolute') {
        contentWidth = canvasEl.offsetWidth;
        let maxBottom = 0;
        canvasEl
          .querySelectorAll<HTMLElement>(':scope > .editable-component')
          .forEach(el => {
            const bottom = (parseFloat(el.style.top) || 0) + el.offsetHeight;
            if (bottom > maxBottom) maxBottom = bottom;
          });
        contentHeight = Math.max(1123, maxBottom + 150);
      } else {
        contentWidth = canvasEl.offsetWidth;
        let maxBottom = 0;
        Array.from(canvasEl.children).forEach(child => {
          const el = child as HTMLElement;
          if (el.id === 'canvas-scroll-spacer') return;
          const bottom = el.offsetTop + el.offsetHeight;
          if (bottom > maxBottom) maxBottom = bottom;
        });
        contentHeight = Math.max(maxBottom + 50, canvasEl.clientHeight);
      }

      const PX_TO_MM = 25.4 / 96;
      const pageWidthMm = contentWidth * PX_TO_MM;
      const pageHeightMm = contentHeight * PX_TO_MM;

      await html2pdf()
        .set({
          filename: 'exported_page_download.pdf',
          margin: 0,
          image: { type: 'png', quality: 1 },
          html2canvas: {
            scale: 2,
            width: contentWidth,
            height: contentHeight,
            scrollX: 0,
            scrollY: 0,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            allowTaint: true,
            onclone: (clonedDoc: Document) => {
              /* Fully remove all editor chrome from the clone */
              clonedDoc
                .querySelectorAll(EDITOR_CHROME_SELECTOR)
                .forEach(el => el.remove());
              clonedDoc
                .querySelectorAll('.selected')
                .forEach(el => el.classList.remove('selected'));
              /* Strip editor-specific classes and attributes */
              clonedDoc.querySelectorAll('.editable-component').forEach(el => {
                el.classList.remove(
                  'editable-component',
                  'component-resizer',
                  'selected'
                );
                el.removeAttribute('contenteditable');
                el.removeAttribute('draggable');
              });

              /* Expand the cloned canvas and all ancestors so html2canvas
                 can render the full content — the live DOM uses overflow:auto
                 on #canvas and overflow:hidden on #app which clips content */
              const clonedCanvas = clonedDoc.getElementById('canvas');
              if (clonedCanvas) {
                clonedCanvas.style.overflow = 'visible';
                clonedCanvas.style.height = `${contentHeight}px`;
                clonedCanvas.style.minHeight = `${contentHeight}px`;
                clonedCanvas.style.maxHeight = 'none';
                clonedCanvas.style.boxShadow = 'none';
                clonedCanvas.style.borderRadius = '0';
                clonedCanvas.style.backgroundImage = 'none';
                clonedCanvas.scrollTop = 0;

                let parent = clonedCanvas.parentElement;
                while (parent && parent !== clonedDoc.documentElement) {
                  parent.style.overflow = 'visible';
                  parent.style.height = 'auto';
                  parent.style.maxHeight = 'none';
                  parent = parent.parentElement;
                }
              }

              /* Hide editor-only canvas decorations (corner indicators,
                 box-shadow) that don't appear in the preview */
              const pdfOverride = clonedDoc.createElement('style');
              pdfOverride.textContent = `
                #canvas::before,
                #canvas::after { display: none !important; }
                #canvas {
                  background-image: none !important;
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  overflow: visible !important;
                }
                .container-component[data-depth] {
                  border: none !important;
                  outline: none !important;
                }
              `;
              clonedDoc.head.appendChild(pdfOverride);
            },
          },
          jsPDF: {
            unit: 'mm',
            format: [pageWidthMm, pageHeightMm],
            orientation: 'portrait',
          },
        })
        .from(canvasEl)
        .save();

      showNotification('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      showNotification('Error generating PDF. Check console for details.');
    } finally {
      editorEls.forEach(el => (el.style.visibility = ''));
      canvasEl.scrollTop = savedScrollTop;
      canvasEl.scrollLeft = savedScrollLeft;
    }
  });
}

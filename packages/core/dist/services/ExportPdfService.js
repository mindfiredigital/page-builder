var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { showNotification } from '../utils/utilityFunctions.js';
import { Canvas } from '../canvas/Canvas.js';
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
export function setupExportPDFButton() {
    const exportButton = document.getElementById('export-pdf-btn');
    if (!exportButton)
        return;
    exportButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        showNotification('Generating PDF for download...');
        const canvasEl = document.getElementById('canvas');
        if (!canvasEl)
            return;
        /* Remove all focus and selection states */
        (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
        canvasEl
            .querySelectorAll('.selected')
            .forEach(el => el.classList.remove('selected'));
        canvasEl
            .querySelectorAll('.table-cell-content')
            .forEach(el => el.blur());
        /* Hide editor-only UI on the live DOM (backup — the onclone handler
           removes them from the clone html2canvas actually renders) */
        const editorEls = Array.from(canvasEl.querySelectorAll(EDITOR_CHROME_SELECTOR));
        editorEls.forEach(el => (el.style.visibility = 'hidden'));
        /* Scroll canvas to top so the clone starts at the beginning */
        const savedScrollTop = canvasEl.scrollTop;
        const savedScrollLeft = canvasEl.scrollLeft;
        canvasEl.scrollTop = 0;
        canvasEl.scrollLeft = 0;
        /* Let the DOM settle after hiding elements */
        yield new Promise(resolve => setTimeout(resolve, 300));
        try {
            /* Calculate actual content bounds — exclude the scroll spacer which
               inflates scrollHeight far beyond the real content edge */
            let contentWidth;
            let contentHeight;
            if (Canvas.layoutMode === 'absolute') {
                contentWidth = canvasEl.offsetWidth;
                let maxBottom = 0;
                canvasEl
                    .querySelectorAll(':scope > .editable-component')
                    .forEach(el => {
                    const bottom = (parseFloat(el.style.top) || 0) + el.offsetHeight;
                    if (bottom > maxBottom)
                        maxBottom = bottom;
                });
                contentHeight = Math.max(1123, maxBottom + 150);
            }
            else {
                contentWidth = canvasEl.offsetWidth;
                let maxBottom = 0;
                Array.from(canvasEl.children).forEach(child => {
                    const el = child;
                    if (el.id === 'canvas-scroll-spacer')
                        return;
                    const bottom = el.offsetTop + el.offsetHeight;
                    if (bottom > maxBottom)
                        maxBottom = bottom;
                });
                contentHeight = Math.max(maxBottom + 50, canvasEl.clientHeight);
            }
            const PX_TO_MM = 25.4 / 96;
            /* jsPDF hard-caps any page dimension at 14400pt (= 5080mm, since
               1mm = 72/25.4pt); shrink the page — keeping aspect ratio — before it
               hits that ceiling instead of letting jsPDF silently clamp it.
               Separately, browsers silently return an empty canvas from
               toDataURL() once a canvas dimension crosses roughly 15-16k px (far
               lower on Safari) — html2canvas never surfaces this, jsPDF just
               fails to decode the resulting empty PNG. Cap the render scale so
               that can't happen. */
            const MAX_PAGE_MM = 5000;
            const MAX_CANVAS_PX = 8000;
            let pageWidthMm = contentWidth * PX_TO_MM;
            let pageHeightMm = contentHeight * PX_TO_MM;
            const pageClamp = Math.min(1, MAX_PAGE_MM / Math.max(pageWidthMm, pageHeightMm));
            pageWidthMm *= pageClamp;
            pageHeightMm *= pageClamp;
            const renderScale = Math.min(2, MAX_CANVAS_PX / contentWidth, MAX_CANVAS_PX / contentHeight);
            yield html2pdf()
                .set({
                filename: 'exported_page_download.pdf',
                margin: 0,
                image: { type: 'jpeg', quality: 0.92 },
                html2canvas: {
                    scale: renderScale,
                    width: contentWidth,
                    height: contentHeight,
                    scrollX: 0,
                    scrollY: 0,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    allowTaint: true,
                    onclone: (clonedDoc) => {
                        /* Fully remove all editor chrome from the clone */
                        clonedDoc
                            .querySelectorAll(EDITOR_CHROME_SELECTOR)
                            .forEach(el => el.remove());
                        clonedDoc
                            .querySelectorAll('.selected')
                            .forEach(el => el.classList.remove('selected'));
                        /* Strip editor-specific classes and attributes */
                        clonedDoc.querySelectorAll('.editable-component').forEach(el => {
                            el.classList.remove('editable-component', 'component-resizer', 'selected');
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
        }
        catch (error) {
            console.error('PDF generation error:', error);
            showNotification('Error generating PDF. Check console for details.');
        }
        finally {
            editorEls.forEach(el => (el.style.visibility = ''));
            canvasEl.scrollTop = savedScrollTop;
            canvasEl.scrollLeft = savedScrollLeft;
        }
    }));
}

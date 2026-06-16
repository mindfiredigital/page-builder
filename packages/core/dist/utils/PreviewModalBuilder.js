import { svgs } from '../icons/svgs.js';
/* Builds and returns the full-screen preview modal with an iframe */
export function createFullScreenPreviewModal(html, layoutMode = 'grid', canvasRect = null) {
    const isAbsolute = layoutMode === 'absolute';
    const useCanvasLayout = !isAbsolute && canvasRect !== null && canvasRect.width > 0;
    const fullScreenModal = document.createElement('div');
    fullScreenModal.id = 'preview-modal';
    fullScreenModal.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh; z-index: 10000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    background-color: #f8fafc;
  `;
    const paperWrapper = document.createElement('div');
    const iframe = document.createElement('iframe');
    iframe.id = 'preview-iframe';
    if (isAbsolute) {
        /* A4 paper: fixed dimensions, centred, grey sides show naturally */
        paperWrapper.style.cssText = `
      flex: 1; width: 100%; display: flex;
      align-items: flex-start; justify-content: center;
      overflow: auto; box-sizing: border-box;
    `;
        iframe.style.cssText = `width:869px; min-height:1123px; border:none; background:#fff;
       box-shadow:0 4px 24px rgba(0,0,0,0.12); border-radius:4px; flex-shrink:0;`;
    }
    else if (useCanvasLayout) {
        /* Grid mode: mirror the canvas position so grey areas match the sidebar widths */
        paperWrapper.style.cssText = `
      flex: 1; width: 100%; display: flex;
      align-items: stretch; justify-content: flex-start;
      overflow: auto; box-sizing: border-box;
    `;
        iframe.style.cssText = `
      width: ${canvasRect.width}px;
      flex-shrink: 0;
      border: none;
      background: #fff;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10);
      margin-left: ${canvasRect.left}px;
    `;
    }
    else {
        /* Grid mode fallback (no canvas rect available): fill full viewport */
        paperWrapper.style.cssText = `
      flex: 1; width: 100%; display: flex;
      align-items: flex-start; justify-content: center;
      overflow: auto; box-sizing: border-box;
    `;
        iframe.style.cssText = `width:100%; height:100%; border:none; background:#fff;
       box-shadow:0 4px 24px rgba(0,0,0,0.12); border-radius:4px;`;
    }
    /* Inject cursor:none so hovering over the preview page shows no cursor */
    const noPointerStyle = '<style>*,*::before,*::after{cursor:none!important;}</style>';
    const previewHtml = html.includes('</head>')
        ? html.replace('</head>', noPointerStyle + '</head>')
        : noPointerStyle + html;
    iframe.srcdoc = previewHtml;
    paperWrapper.appendChild(iframe);
    fullScreenModal.appendChild(paperWrapper);
    fullScreenModal.appendChild(createPreviewCloseButton(fullScreenModal));
    /* Responsiveness toggle only shown in grid fallback mode */
    if (!isAbsolute && !useCanvasLayout) {
        const responsivenessContainer = createResponsivenessControls(iframe);
        fullScreenModal.insertBefore(responsivenessContainer, paperWrapper);
    }
    return fullScreenModal;
}
/* Builds the close button that removes the preview modal */
export function createPreviewCloseButton(fullScreenModal) {
    const closeButton = document.createElement('button');
    closeButton.id = 'close-modal-btn';
    closeButton.innerHTML = svgs.closePreviewBtn;
    closeButton.style.cssText = `
    position: absolute; top: 0; left: 0;
    font-size: 20px; border: none; background: none;
    font: bold; color: black; cursor: pointer;
  `;
    const closeModal = () => {
        setTimeout(() => fullScreenModal.remove(), 300);
        document.removeEventListener('keydown', escKeyListener);
    };
    closeButton.addEventListener('click', closeModal);
    /* Also close on Escape key */
    const escKeyListener = (event) => {
        if (event.key === 'Escape')
            closeModal();
    };
    document.addEventListener('keydown', escKeyListener);
    return closeButton;
}
/* Builds the device-size toggle bar (Mobile / Tablet / Desktop) */
export function createResponsivenessControls(iframe) {
    const container = document.createElement('div');
    container.style.cssText = `
    gap: 10px; display: flex; justify-content: center; align-items: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-bottom: 1px solid #e2e8f0; width: 100%;
    background-color: #ffffff; padding: 4px 0;
  `;
    const sizes = [
        { icon: svgs.mobile, title: 'Mobile', width: '375px', height: '100%' },
        { icon: svgs.tablet, title: 'Tablet', width: '768px', height: '100%' },
        { icon: svgs.desktop, title: 'Desktop', width: '100%', height: '100%' },
    ];
    let activeButton = null;
    sizes.forEach(size => {
        const button = document.createElement('button');
        button.style.cssText = `
      padding: 6px 8px; border: 1px solid transparent;
      background: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      border-radius: 4px; transition: background-color 0.2s ease, border-color 0.2s ease;
    `;
        button.title = size.title;
        /* Hover highlight — mirrors the editor navbar style */
        button.addEventListener('mouseenter', () => {
            if (button !== activeButton) {
                button.style.backgroundColor = '#f1f5f9';
                button.style.borderColor = '#cbd5e1';
            }
        });
        button.addEventListener('mouseleave', () => {
            if (button !== activeButton) {
                button.style.backgroundColor = 'transparent';
                button.style.borderColor = 'transparent';
            }
        });
        const iconContainer = document.createElement('div');
        iconContainer.innerHTML = size.icon;
        const svgElement = iconContainer.querySelector('svg');
        if (svgElement) {
            svgElement.style.width = '24px';
            svgElement.style.height = '24px';
            svgElement.classList.add('component-icon');
        }
        button.appendChild(iconContainer);
        button.addEventListener('click', () => {
            /* Deactivate the previously active button */
            if (activeButton) {
                activeButton.style.backgroundColor = 'transparent';
                activeButton.style.borderColor = 'transparent';
            }
            activeButton = button;
            button.style.backgroundColor = '#e2e8f0';
            button.style.borderColor = '#cbd5e1';
            iframe.style.width = size.width;
            iframe.style.height = size.height;
            iframe.style.transition = 'all 0.5s ease';
        });
        container.appendChild(button);
    });
    /* Default to Desktop (last button) being active */
    const defaultBtn = container.lastElementChild;
    if (defaultBtn) {
        activeButton = defaultBtn;
        defaultBtn.style.backgroundColor = '#e2e8f0';
        defaultBtn.style.borderColor = '#cbd5e1';
    }
    return container;
}

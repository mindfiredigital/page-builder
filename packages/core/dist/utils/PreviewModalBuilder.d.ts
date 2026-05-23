export declare function createFullScreenPreviewModal(
  html: string,
  layoutMode?: 'absolute' | 'grid',
  canvasRect?: DOMRect | null
): HTMLElement;
export declare function createPreviewCloseButton(
  fullScreenModal: HTMLElement
): HTMLButtonElement;
export declare function createResponsivenessControls(
  iframe: HTMLIFrameElement
): HTMLElement;

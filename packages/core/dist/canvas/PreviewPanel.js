// import { Canvas } from './Canvas.js';
export class PreviewPanel {
  setPreviewMode(size) {
    const canvas = document.getElementById('canvas');
    // First Remove all classes that start with 'preview-'
    canvas.classList.forEach(className => {
      if (className.startsWith('preview-')) {
        canvas.classList.remove(className);
      }
    });
    // Add the new preview class
    canvas.classList.add(`preview-${size}`);
    // setTimeout(() => {
    //   Canvas.handleResponsiveResize();
    // }, 200);
  }
}

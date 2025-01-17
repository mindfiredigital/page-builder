export class PreviewPanel {
  setPreviewMode(size: 'desktop' | 'tablet' | 'mobile') {
    const canvas = document.getElementById('canvas')!;

    // First Remove all classes that start with 'preview-'
    canvas.classList.forEach(className => {
      if (className.startsWith('preview-')) {
        canvas.classList.remove(className);
      }
    });

    // Add the new preview class
    canvas.classList.add(`preview-${size}`);
  }
}

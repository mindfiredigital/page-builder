export class PreviewPanel {
  setPreviewMode(size: 'desktop' | 'tablet' | 'mobile') {
    const canvas = document.getElementById('canvas')!;
    canvas.className = `preview-${size}`;
  }
}

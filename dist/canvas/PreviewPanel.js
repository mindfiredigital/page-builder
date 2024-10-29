export class PreviewPanel {
  setPreviewMode(size) {
    const canvas = document.getElementById('canvas');
    canvas.className = `preview-${size}`;
  }
}

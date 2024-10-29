export class HTMLGenerator {
  constructor(canvas) {
    this.canvas = canvas;
  }
  generateHTML() {
    var _a;
    return (
      ((_a = document.getElementById('canvas')) === null || _a === void 0
        ? void 0
        : _a.innerHTML) || ''
    );
  }
}

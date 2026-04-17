/* Injects resizer handle styles into document <head> */
export function injectResizerStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .resizer {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: white;
      border: 2px solid #4286f4;
      position: absolute;
    }

    .resizer.top-left {
      left: -5px;
      top: -5px;
      cursor: nwse-resize;
    }

    .resizer.top-right {
      right: -5px;
      top: -5px;
      cursor: nesw-resize;
    }

    .resizer.bottom-left {
      left: -5px;
      bottom: -5px;
      cursor: nesw-resize;
    }

    .resizer.bottom-right {
      right: -5px;
      bottom: -5px;
      cursor: nwse-resize;
    }
  `;
  document.head.appendChild(style);
}

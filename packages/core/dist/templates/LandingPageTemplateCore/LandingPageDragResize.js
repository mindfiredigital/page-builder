/* Attaches drag-and-resize behaviour to a template element */
export function enableDragAndResize(element) {
  let isDragging = false;
  let isResizing = false;
  let startX, startY;
  let startWidth, startHeight;
  /* Remember the element's accumulated translation between drag sessions */
  let initialX = 0;
  let initialY = 0;
  /* Relative positioning keeps the element in normal flow until moved */
  element.style.position = 'relative';
  element.style.cursor = 'move';
  element.addEventListener('mousedown', e => {
    /* Don't start a drag when a resize is already active */
    if (!isResizing) {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      /* Read the last known translation so movement is additive */
      initialX = parseFloat(element.getAttribute('data-x') || '0');
      initialY = parseFloat(element.getAttribute('data-y') || '0');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  });
  const onMouseMove = e => {
    if (!isDragging) return;
    const translateX = initialX + (e.clientX - startX);
    const translateY = initialY + (e.clientY - startY);
    /* CSS transform gives smooth, sub-pixel movement */
    element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    /* Persist the position so the next drag session starts from here */
    element.setAttribute('data-x', translateX.toString());
    element.setAttribute('data-y', translateY.toString());
  };
  const onMouseUp = () => {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  /* Resize handle is only relevant for container elements */
  if (element.classList.contains('container')) {
    const resizeHandle = document.createElement('div');
    Object.assign(resizeHandle.style, {
      width: '10px',
      height: '10px',
      background: 'blue',
      position: 'absolute',
      right: '0',
      bottom: '0',
      cursor: 'se-resize',
    });
    element.appendChild(resizeHandle);
    resizeHandle.addEventListener('mousedown', e => {
      /* Stop propagation so the drag handler above doesn't also fire */
      e.stopPropagation();
      isResizing = true;
      startWidth = element.offsetWidth;
      startHeight = element.offsetHeight;
      startX = e.clientX;
      startY = e.clientY;
      document.addEventListener('mousemove', onResizeMove);
      document.addEventListener('mouseup', onResizeUp);
    });
    const onResizeMove = e => {
      if (!isResizing) return;
      element.style.width = `${startWidth + (e.clientX - startX)}px`;
      element.style.height = `${startHeight + (e.clientY - startY)}px`;
    };
    const onResizeUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', onResizeMove);
      document.removeEventListener('mouseup', onResizeUp);
    };
  }
}

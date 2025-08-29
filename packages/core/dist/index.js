'use strict';
class e {
  constructor(e, t) {
    (this.canvas = e), (this.sidebar = t);
  }
  enable() {
    this.sidebar.querySelectorAll('.draggable').forEach(e => {
      e.addEventListener('dragstart', t => {
        var n, o;
        const s = t;
        null === (n = s.dataTransfer) ||
          void 0 === n ||
          n.setData('component-type', e.id);
        const i = e.getAttribute('data-component-settings');
        i &&
          (null === (o = s.dataTransfer) ||
            void 0 === o ||
            o.setData('custom-settings', i));
      });
    });
  }
}
class t {
  constructor(e = 'Sample Text') {
    this.text = e;
  }
  create() {
    const e = document.createElement('div');
    return (
      (e.innerText = this.text),
      (e.contentEditable = 'true'),
      e.classList.add('text-component'),
      e
    );
  }
  setText(e) {
    this.text = e;
  }
}
class n {
  create(e = null) {
    const t = document.createElement('div');
    t.classList.add('image-component');
    const o = `image-container-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    (t.id = o),
      (t.style.width = '300px'),
      (t.style.height = '300px'),
      (t.style.position = 'relative'),
      (t.style.backgroundColor = e ? 'transparent' : '#f0f0f0'),
      (t.style.display = 'flex'),
      (t.style.border = 'none'),
      (t.style.alignItems = 'center'),
      (t.style.justifyContent = 'center');
    const s = document.createElement('div');
    (s.style.color = '#666666'),
      (s.style.border = 'none'),
      (s.style.display = e ? 'none' : 'block');
    const i = document.createElement('input');
    (i.type = 'file'),
      (i.accept = 'image/*'),
      (i.style.display = 'none'),
      i.addEventListener('change', e => n.handleFileChange(e, t, s));
    const l = document.createElement('button');
    l.classList.add('upload-btn'),
      (l.innerHTML = '🖊️'),
      (l.style.position = 'absolute'),
      (l.style.padding = '8px'),
      (l.style.background = 'transparent'),
      (l.style.border = 'none'),
      (l.style.cursor = 'pointer'),
      (l.style.opacity = '0'),
      (l.style.transition = 'opacity 0.2s'),
      (l.style.left = '50%'),
      (l.style.top = '50%'),
      (l.style.transform = 'translate(-50%, -50%)'),
      (l.style.fontSize = '24px'),
      l.addEventListener('click', () => i.click());
    const a = document.createElement('img'),
      r = `${o}-img`;
    return (
      (a.id = r),
      (a.style.width = '100%'),
      (a.style.height = '100%'),
      (a.style.objectFit = 'contain'),
      (a.style.border = 'none'),
      (a.style.display = 'none'),
      e && ((a.src = e), (a.style.display = 'block')),
      t.addEventListener('mouseenter', () => {
        l.style.opacity = '1';
      }),
      t.addEventListener('mouseleave', () => {
        l.style.opacity = '0';
      }),
      t.appendChild(s),
      t.appendChild(i),
      t.appendChild(l),
      t.appendChild(a),
      t
    );
  }
  static handleFileChange(e, t, n) {
    const o = e.target,
      s = o.files ? o.files[0] : null;
    if (s) {
      const e = new FileReader();
      (e.onload = function () {
        const o = e.result,
          s = t.querySelector('img');
        s &&
          ((s.src = o),
          (s.style.display = 'block'),
          (n.style.display = 'none'),
          (t.style.backgroundColor = 'transparent'));
      }),
        e.readAsDataURL(s);
    }
  }
  static restoreImageUpload(e, t) {
    const n = e.querySelector('div:not(.upload-btn)'),
      o = e.querySelector('input[type="file"]'),
      s = e.querySelector('.upload-btn'),
      i = e.querySelector('img');
    o.addEventListener('change', t => this.handleFileChange(t, e, n)),
      s.addEventListener('click', () => o.click()),
      t
        ? ((i.src = t),
          (i.style.display = 'block'),
          (n.style.display = 'none'),
          (e.style.backgroundColor = 'transparent'))
        : ((i.style.display = 'none'),
          (n.style.display = 'block'),
          (e.style.backgroundColor = '#f0f0f0')),
      e.addEventListener('mouseenter', () => {
        s.style.opacity = '1';
      }),
      e.addEventListener('mouseleave', () => {
        s.style.opacity = '0';
      });
  }
}
class o {
  constructor(e) {
    this.captureStateHandler = e;
  }
  create(e = null) {
    const t = document.createElement('div');
    t.classList.add('video-component');
    const n = document.createElement('input');
    (n.type = 'file'),
      (n.accept = 'video/*'),
      (n.style.display = 'none'),
      n.addEventListener('change', e => {
        this.handleFileChange(e, t), this.captureStateHandler();
      });
    const o = document.createElement('div');
    o.classList.add('upload-text'), (o.innerText = e ? '' : 'Upload Video');
    const s = document.createElement('video');
    (s.controls = !0),
      (s.style.width = '100%'),
      (s.style.height = '100%'),
      (s.style.display = e ? 'block' : 'none'),
      e && (s.src = e);
    const i = document.createElement('button');
    return (
      (i.innerHTML = '🖊️'),
      i.classList.add('pencil-button'),
      i.addEventListener('click', () => n.click()),
      t.appendChild(o),
      t.appendChild(n),
      t.appendChild(s),
      t.appendChild(i),
      t
    );
  }
  handleFileChange(e, t) {
    const n = e.target,
      o = n.files ? n.files[0] : null;
    if (o && o.type.startsWith('video/')) {
      const e = new FileReader();
      (e.onload = () => {
        const n = t.querySelector('video'),
          o = t.querySelector('.upload-text');
        (n.src = e.result),
          (n.style.display = 'block'),
          (o.style.display = 'none');
      }),
        e.readAsDataURL(o);
    } else alert('Please upload a valid video file.');
  }
}
class s {
  create(e = 'Click Me') {
    const t = document.createElement('button');
    return (
      (t.innerText = e),
      t.classList.add('button-component'),
      (t.style.padding = '10px 20px'),
      (t.style.fontSize = '14px'),
      (t.style.borderRadius = '4px'),
      (t.style.cursor = 'pointer'),
      t
    );
  }
}
class i {
  create(e = 1, t = 'Header') {
    const n = document.createElement(`h${e}`);
    return (n.innerText = t), n.classList.add('header-component'), n;
  }
}
class l {
  constructor() {
    (this.MINIMUM_SIZE = 20),
      (this.originalWidth = 0),
      (this.originalHeight = 0),
      (this.originalX = 0),
      (this.originalY = 0),
      (this.originalMouseX = 0),
      (this.originalMouseY = 0),
      (this.currentResizer = null),
      (this.resize = e => {
        if (!this.currentResizer) return;
        const t = e.pageX - this.originalMouseX,
          n = e.pageY - this.originalMouseY;
        if (this.currentResizer.classList.contains('bottom-right')) {
          const e = this.originalWidth + t,
            o = this.originalHeight + n;
          e > this.MINIMUM_SIZE && (this.element.style.width = `${e}px`),
            o > this.MINIMUM_SIZE && (this.element.style.height = `${o}px`);
        } else if (this.currentResizer.classList.contains('bottom-left')) {
          const e = this.originalHeight + n,
            o = this.originalWidth - t;
          e > this.MINIMUM_SIZE && (this.element.style.height = `${e}px`),
            o > this.MINIMUM_SIZE &&
              ((this.element.style.width = `${o}px`),
              (this.element.style.left = `${this.originalX + t}px`));
        } else if (this.currentResizer.classList.contains('top-right')) {
          const e = this.originalWidth + t,
            o = this.originalHeight - n;
          e > this.MINIMUM_SIZE && (this.element.style.width = `${e}px`),
            o > this.MINIMUM_SIZE &&
              ((this.element.style.height = `${o}px`),
              (this.element.style.top = `${this.originalY + n}px`));
        } else if (this.currentResizer.classList.contains('top-left')) {
          const e = this.originalWidth - t,
            o = this.originalHeight - n;
          e > this.MINIMUM_SIZE &&
            ((this.element.style.width = `${e}px`),
            (this.element.style.left = `${this.originalX + t}px`)),
            o > this.MINIMUM_SIZE &&
              ((this.element.style.height = `${o}px`),
              (this.element.style.top = `${this.originalY + n}px`));
        }
      }),
      (this.stopResize = () => {
        window.removeEventListener('mousemove', this.resize),
          window.removeEventListener('mouseup', this.stopResize),
          (this.currentResizer = null),
          k.historyManager.captureState();
      }),
      (this.element = document.createElement('div')),
      this.element.classList.add('container-component'),
      this.element.setAttribute('draggable', 'true'),
      (this.resizers = document.createElement('div')),
      this.resizers.classList.add('resizers'),
      this.element.appendChild(this.resizers),
      this.addResizeHandles(),
      this.addStyles(),
      this.initializeEventListeners();
  }
  addResizeHandles() {
    [
      { class: 'top-left', cursor: 'nwse-resize' },
      { class: 'top-right', cursor: 'nesw-resize' },
      { class: 'bottom-left', cursor: 'nesw-resize' },
      { class: 'bottom-right', cursor: 'nwse-resize' },
    ].forEach(e => {
      const t = document.createElement('div');
      t.classList.add('resizer', e.class),
        t.addEventListener('mousedown', e => this.initResize(e, t)),
        this.resizers.appendChild(t);
    });
  }
  initResize(e, t) {
    e.preventDefault(),
      (this.currentResizer = t),
      (this.originalWidth = parseFloat(
        getComputedStyle(this.element).getPropertyValue('width')
      )),
      (this.originalHeight = parseFloat(
        getComputedStyle(this.element).getPropertyValue('height')
      )),
      (this.originalX = this.element.getBoundingClientRect().left),
      (this.originalY = this.element.getBoundingClientRect().top),
      (this.originalMouseX = e.pageX),
      (this.originalMouseY = e.pageY),
      window.addEventListener('mousemove', this.resize),
      window.addEventListener('mouseup', this.stopResize);
  }
  initializeEventListeners() {
    this.element.addEventListener('dragstart', this.onDragStart.bind(this)),
      this.element.addEventListener('drop', this.onDrop.bind(this)),
      this.element.addEventListener('dragover', e => e.preventDefault()),
      this.element.addEventListener('mouseover', this.onMouseOver.bind(this)),
      this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
  onDragStart(e) {
    e.stopPropagation();
  }
  makeDraggable(e) {
    let t = !1,
      n = 0,
      o = 0,
      s = 0,
      i = 0;
    const l = l => {
        if (!t) return;
        const a = l.clientX - n,
          r = l.clientY - o;
        e.style.transform = `translate(${s + a}px, ${i + r}px)`;
      },
      a = () => {
        (t = !1),
          window.removeEventListener('mousemove', l),
          window.removeEventListener('mouseup', a);
      };
    e.addEventListener('mousedown', r => {
      r.preventDefault(),
        r.stopPropagation(),
        (t = !0),
        (n = r.clientX),
        (o = r.clientY);
      const d = e.getBoundingClientRect();
      (s = d.left),
        (i = d.top),
        window.addEventListener('mousemove', l),
        window.addEventListener('mouseup', a);
    });
  }
  onDrop(e) {
    var t;
    e.preventDefault(), e.stopPropagation();
    const n =
      null === (t = e.dataTransfer) || void 0 === t
        ? void 0
        : t.getData('component-type');
    if (!n) return;
    const o = k.createComponent(n);
    if (!o) return;
    const s = this.element.classList[2],
      i = k.generateUniqueClass(n, !0, s);
    o.classList.add(i);
    const l = document.createElement('span');
    (l.className = 'component-label'),
      (l.textContent = i),
      (o.id = i),
      (l.style.display = 'none'),
      o.appendChild(l),
      o.addEventListener('mouseenter', e => this.showLabel(e, o)),
      o.addEventListener('mouseleave', e => this.hideLabel(e, o)),
      this.element.appendChild(o),
      this.makeDraggable(o),
      k.historyManager.captureState();
  }
  showLabel(e, t) {
    e.stopPropagation();
    const n = t.querySelector('.component-label');
    n && (n.style.display = 'block');
  }
  hideLabel(e, t) {
    e.stopPropagation();
    const n = t.querySelector('.component-label');
    n && (n.style.display = 'none');
  }
  onMouseOver(e) {
    e.stopPropagation();
    document.querySelectorAll('.container-highlight').forEach(e => {
      e.classList.remove('container-highlight');
    }),
      e.target === this.element &&
        this.element.classList.add('container-highlight');
  }
  onMouseLeave(e) {
    e.target === this.element &&
      this.element.classList.remove('container-highlight');
  }
  addStyles() {
    const e = document.createElement('style');
    (e.textContent =
      '\n      .container-component {\n        position: relative !important;\n        display: flex;\n        min-width: 100px;\n        min-height: 100px;\n        cursor: grab;\n        border: 1px solid #ddd;\n      }\n\n      .resizer {\n        width: 10px;\n        height: 10px;\n        border-radius: 50%;\n        background: white;\n        border: 2px solid #4286f4;\n        position: absolute;\n      }\n\n      .resizer.top-left {\n        left: -5px;\n        top: -5px;\n        cursor: nwse-resize;\n      }\n\n      .resizer.top-right {\n        right: -5px;\n        top: -5px;\n        cursor: nesw-resize;\n      }\n\n      .resizer.bottom-left {\n        left: -5px;\n        bottom: -5px;\n        cursor: nesw-resize;\n      }\n\n      .resizer.bottom-right {\n        right: -5px;\n        bottom: -5px;\n        cursor: nwse-resize;\n      }\n    '),
      document.head.appendChild(e);
  }
  create() {
    return this.element;
  }
  static restoreResizer(e) {
    const t = e.querySelector('.resizers');
    t && t.remove();
    const n = document.createElement('div');
    n.classList.add('resizers');
    const o = new l();
    (o.element = e), (o.resizers = n), o.addResizeHandles(), e.appendChild(n);
  }
  static restoreContainer(e) {
    l.restoreResizer(e);
    const t = new l();
    t.element = e;
    e.querySelectorAll('.editable-component').forEach(e => {
      var o;
      if (
        (k.controlsManager.addControlButtons(e),
        k.addDraggableListeners(e),
        e.addEventListener('mouseenter', n => t.showLabel(n, e)),
        e.addEventListener('mouseleave', n => t.hideLabel(n, e)),
        e.classList.contains('image-component'))
      ) {
        const t =
          (null === (o = e.querySelector('img')) || void 0 === o
            ? void 0
            : o.getAttribute('src')) || '';
        n.restoreImageUpload(e, t);
      }
      e.classList.contains('container-component') && this.restoreContainer(e);
    });
  }
}
class a {
  constructor(e, t = `${e}Col-component`) {
    (this.columnCount = e),
      (this.element = document.createElement('div')),
      this.element.classList.add(t),
      this.element.setAttribute('draggable', 'true');
    for (let t = 1; t <= e; t++) {
      const e = this.createColumn(`column-${t}`);
      this.element.appendChild(e);
    }
    this.addStyles(t), this.initializeEventListeners();
  }
  createColumn(e) {
    const t = document.createElement('div');
    return (
      t.classList.add('column', e),
      t.setAttribute('draggable', 'true'),
      (t.style.width = 100 / this.columnCount + '%'),
      t
    );
  }
  initializeEventListeners() {
    this.element.addEventListener('dragover', e => e.preventDefault()),
      this.element.addEventListener('drop', this.onDrop.bind(this));
  }
  onDrop(e) {
    var t;
    e.preventDefault(), e.stopPropagation();
    const n =
      null === (t = e.dataTransfer) || void 0 === t
        ? void 0
        : t.getData('component-type');
    if (!n) return;
    const o = k.createComponent(n);
    if (!o) return;
    const s = e.target;
    if (s && s.classList.contains('column')) {
      s.appendChild(o);
      const e = `${this.element.id}-${`c${Array.from(s.parentElement.children).indexOf(s)}`}`;
      (s.id = e), s.classList.add(e);
      let t = s.querySelector('.column-label');
      t ||
        ((t = document.createElement('span')),
        (t.className = 'column-label'),
        s.appendChild(t)),
        (t.textContent = e);
      const i = k.generateUniqueClass(n, !0, e);
      o.classList.add(i), (o.id = i);
      let l = o.querySelector('.component-label');
      l ||
        ((l = document.createElement('span')),
        (l.className = 'component-label'),
        o.appendChild(l)),
        (l.textContent = i),
        k.historyManager.captureState();
    }
  }
  addStyles(e) {
    const t = document.createElement('style');
    (t.textContent = `\n      .${e} {\n        display: flex;\n        width: 97%;\n        min-width: 100px;\n        min-height: 100px;\n      }\n      .column {\n        flex-grow: 1;\n        min-width: 50px;\n        border: 1px dashed #ddd;\n        padding: 10px;\n        position: relative;\n      }\n      .column:hover {\n        outline: 1px solid #3498db;\n        background: #f5f5f5;\n      }\n    `),
      document.head.appendChild(t);
  }
  create() {
    return this.element;
  }
  static restoreColumn(e) {
    e.querySelectorAll('.editable-component').forEach(e => {
      var t;
      if (
        (k.controlsManager.addControlButtons(e),
        k.addDraggableListeners(e),
        e.classList.contains('image-component'))
      ) {
        const o =
          (null === (t = e.querySelector('img')) || void 0 === t
            ? void 0
            : t.getAttribute('src')) || '';
        n.restoreImageUpload(e, o);
      }
    });
  }
}
class r extends a {
  constructor() {
    super(2, 'twoCol-component');
  }
}
class d extends a {
  constructor() {
    super(3, 'threeCol-component');
  }
}
function c(e, t, n, o) {
  return new (n || (n = Promise))(function (s, i) {
    function l(e) {
      try {
        r(o.next(e));
      } catch (e) {
        i(e);
      }
    }
    function a(e) {
      try {
        r(o.throw(e));
      } catch (e) {
        i(e);
      }
    }
    function r(e) {
      var t;
      e.done
        ? s(e.value)
        : ((t = e.value),
          t instanceof n
            ? t
            : new n(function (e) {
                e(t);
              })).then(l, a);
    }
    r((o = o.apply(e, t || [])).next());
  });
}
'function' == typeof SuppressedError && SuppressedError;
class p {
  constructor() {
    var e, t;
    (this.resolvePromise = null), (this.attributes = []), this.addStyles();
    const n = document.getElementById('modal');
    n
      ? (this.modalElement = n)
      : ((this.modalElement = this.createModalElement()),
        document.body.appendChild(this.modalElement)),
      (this.contentContainer =
        this.modalElement.querySelector('#modal-content')),
      this.hide(),
      null === (e = this.modalElement.querySelector('#close-modal-button')) ||
        void 0 === e ||
        e.addEventListener('click', () => {
          var e;
          this.hide(),
            null === (e = this.resolvePromise) ||
              void 0 === e ||
              e.call(this, null);
        }),
      null === (t = this.modalElement.querySelector('#save-button')) ||
        void 0 === t ||
        t.addEventListener('click', () => {
          this.onSave();
        });
  }
  addStyles() {
    if (document.getElementById('modal-styles')) return;
    const e = document.createElement('style');
    (e.id = 'modal-styles'),
      (e.textContent =
        "\n      .modal-overlay {\n        position: fixed;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        background-color: rgba(0, 0, 0, 0.6);\n        z-index: 10000;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        padding: 20px;\n        backdrop-filter: blur(2px);\n      }\n\n      .modal-content {\n        position: relative;\n        z-index: 10001;\n        width: 100%;\n        max-width: 500px;\n        background-color: white;\n        border-radius: 12px;\n        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);\n        overflow: hidden;\n        animation: fadeInScale 0.2s ease-out;\n        border: 1px solid rgba(0, 0, 0, 0.05);\n      }\n\n      @keyframes fadeInScale {\n        from {\n          opacity: 0;\n          transform: scale(0.95) translate3d(0, -10px, 0);\n        }\n        to {\n          opacity: 1;\n          transform: scale(1) translate3d(0, 0, 0);\n        }\n      }\n\n      .modal-header {\n        background-color: #fafafa;\n        border-bottom: 1px solid #e5e5e5;\n        padding: 20px 24px;\n      }\n\n      .modal-header-content {\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n      }\n\n      .modal-title {\n        font-size: 18px;\n        font-weight: 600;\n        color: #111827;\n        margin: 0;\n        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n      }\n\n      .modal-close-button {\n        background: none;\n        border: none;\n        color: #6b7280;\n        cursor: pointer;\n        padding: 6px;\n        border-radius: 6px;\n        transition: all 0.2s ease;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      }\n\n      .modal-close-button:hover {\n        color: #374151;\n        background-color: #f3f4f6;\n      }\n\n      .modal-close-button svg {\n        width: 20px;\n        height: 20px;\n      }\n\n      .modal-body {\n        padding: 24px;\n        max-height: 60vh;\n        overflow-y: auto;\n      }\n\n      .modal-form {\n        display: flex;\n        flex-direction: column;\n        gap: 20px;\n      }\n\n      .form-field {\n        display: flex;\n        flex-direction: column;\n      }\n\n      .form-label {\n        font-size: 13px;\n        font-weight: 600;\n        color: #374151;\n        margin-bottom: 8px;\n        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n        text-transform: uppercase;\n        letter-spacing: 0.025em;\n      }\n\n      .form-input {\n        padding: 12px 14px;\n        border: 1px solid #d1d5db;\n        border-radius: 8px;\n        font-size: 14px;\n        transition: all 0.2s ease;\n        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n        background-color: white;\n      }\n\n      .form-input:focus {\n        outline: none;\n        border-color: #2563eb;\n        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n        background-color: #fefefe;\n      }\n\n      .form-input:disabled {\n        background-color: #f9fafb;\n        color: #6b7280;\n        cursor: not-allowed;\n      }\n\n      .form-display-value {\n        color: #374151;\n        background-color: #f8fafc;\n        padding: 12px 14px;\n        border-radius: 8px;\n        user-select: text;\n        font-size: 14px;\n        border: 1px solid #e2e8f0;\n        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n      }\n\n      .image-wrapper {\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        gap: 12px;\n      }\n\n      .image-preview {\n        width: 100%;\n        max-width: 240px;\n        border-radius: 8px;\n        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n        object-fit: contain;\n        max-height: 160px;\n        border: 1px solid #e5e7eb;\n      }\n\n      .image-input {\n        width: 100%;\n      }\n\n      .error-text {\n        color: #dc2626;\n        font-size: 13px;\n        font-weight: 500;\n      }\n\n      .modal-footer {\n        background-color: #fafafa;\n        border-top: 1px solid #e5e5e5;\n        padding: 16px 24px;\n        display: flex;\n        justify-content: flex-end;\n        gap: 12px;\n      }\n\n      .save-button {\n        padding: 10px 20px;\n        background-color: #2563eb;\n        color: white;\n        border: none;\n        border-radius: 8px;\n        font-size: 14px;\n        font-weight: 600;\n        cursor: pointer;\n        transition: all 0.2s ease;\n        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n        min-width: 80px;\n      }\n\n      .save-button:hover {\n        background-color: #1d4ed8;\n        transform: translateY(-1px);\n        box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);\n      }\n\n      .save-button:active {\n        transform: translateY(0);\n      }\n\n      .save-button:focus {\n        outline: none;\n        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);\n      }\n\n      /* Hide modal by default */\n      .modal-hidden {\n        display: none !important;\n      }\n    "),
      document.head.appendChild(e);
  }
  createModalElement() {
    const e = document.createElement('div');
    return (
      (e.className = 'modal-overlay modal-hidden'),
      (e.id = 'modal'),
      (e.innerHTML =
        '\n      <div class="modal-content">\n        <div class="modal-header">\n          <div class="modal-header-content">\n            <h2 class="modal-title">Component Settings</h2>\n            <button id="close-modal-button" class="modal-close-button">\n              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />\n              </svg>\n            </button>\n          </div>\n        </div>\n        <div class="modal-body">\n          <div id="modal-content" class="modal-form">\n            \x3c!-- Dynamic form elements will be injected here --\x3e\n          </div>\n          <div class="modal-footer">\n            <button id="save-button" class="save-button">\n              Save\n            </button>\n          </div>\n        </div>\n      </div>\n    '),
      e
    );
  }
  renderForm(e) {
    (this.contentContainer.innerHTML = ''),
      (this.attributes = e),
      e.forEach(e => {
        const t = document.createElement('div');
        t.className = 'form-field';
        const n = document.createElement('label');
        let o;
        switch (
          ((n.className = 'form-label'),
          (n.textContent = e.title),
          n.setAttribute('for', e.id),
          t.appendChild(n),
          e.type)
        ) {
          case 'Input':
            const t = document.createElement('input');
            (t.id = e.id),
              (t.type = 'number' == typeof e.value ? 'number' : 'text'),
              (t.value = e.value || e.default_value || ''),
              (t.disabled = !1 === e.editable),
              (t.className = 'form-input'),
              (o = t);
            break;
          case 'Constant':
          case 'Formula':
            const n = document.createElement('span');
            (n.id = e.id),
              (n.textContent = e.value.toString()),
              (n.className = 'form-display-value'),
              (o = n);
            break;
          case 'Image':
            const s = document.createElement('div');
            s.className = 'image-wrapper';
            const i = document.createElement('img');
            (i.id = `${e.id}-preview`),
              (i.src =
                e.value.toString() ||
                'https://placehold.co/200x100?text=No+Image'),
              (i.alt = `Preview for ${e.title}`),
              (i.className = 'image-preview'),
              (i.onerror = () =>
                (i.src = 'https://placehold.co/200x100?text=Image+Load+Error'));
            const l = document.createElement('input');
            (l.id = e.id),
              (l.type = 'text'),
              (l.placeholder = 'Enter image URL'),
              (l.value = e.value.toString() || ''),
              (l.className = 'form-input image-input'),
              l.addEventListener('input', () => {
                i.src = l.value || 'https://placehold.co/200x100?text=No+Image';
              }),
              s.appendChild(i),
              s.appendChild(l),
              (o = s);
            break;
          default:
            const a = document.createElement('p');
            (a.textContent = `Unsupported type: ${e.type}`),
              (a.className = 'error-text'),
              (o = a);
        }
        t.appendChild(o), this.contentContainer.appendChild(t);
      });
  }
  show(e) {
    return (
      this.renderForm(e),
      this.modalElement.classList.remove('modal-hidden'),
      new Promise(e => {
        this.resolvePromise = e;
      })
    );
  }
  hide() {
    this.modalElement.classList.add('modal-hidden');
  }
  onSave() {
    var e;
    const t = {};
    this.attributes.forEach(e => {
      if ('Input' === e.type) {
        const n = this.modalElement.querySelector(`#${e.id}`);
        n && (t[e.key] = n.value);
      } else if ('Image' === e.type) {
        const n = this.modalElement.querySelector(`#${e.id}`);
        n && (t[e.key] = n.value);
      } else t[e.key] = e.value;
    }),
      this.hide(),
      null === (e = this.resolvePromise) || void 0 === e || e.call(this, t),
      this.resetPromise();
  }
  resetPromise() {
    this.resolvePromise = null;
  }
}
class u {
  constructor() {
    (this.modalComponent = null), (this.modalComponent = new p() || null);
  }
  create(e, t, n = !1, o) {
    u.tableAttributeConfig = o || [];
    const s = document.createElement('div');
    s.classList.add('table-component');
    const i = document.createElement('table');
    (i.style.width = '100%'),
      (i.style.overflow = 'auto'),
      (i.style.borderCollapse = 'collapse');
    for (let n = 0; n < e; n++) {
      const e = document.createElement('tr');
      for (let o = 0; o < t; o++) {
        const t = document.createElement('td');
        (t.textContent = `R${n + 1}C${o + 1}`),
          (t.style.border = '1px solid #000'),
          (t.style.padding = '8px'),
          (t.style.cursor = 'pointer'),
          (t.style.transition = 'background-color 0.2s ease'),
          t.addEventListener('mouseenter', () => {
            t.style.backgroundColor = '#f0f8ff';
          }),
          t.addEventListener('mouseleave', () => {
            t.style.backgroundColor = '';
          }),
          t.addEventListener('click', () => {
            this.handleCellClick(t);
          }),
          e.appendChild(t);
      }
      i.appendChild(e);
    }
    if ((s.appendChild(i), !n)) {
      const e = document.createElement('div');
      e.classList.add('button-container'),
        (e.style.marginTop = '10px'),
        (e.style.display = 'flex'),
        (e.style.gap = '10px');
      const t = document.createElement('button');
      (t.textContent = 'Add Row'),
        t.addEventListener('click', () => this.addRow(i)),
        e.appendChild(t);
      const n = document.createElement('button');
      (n.textContent = 'Add Column'),
        n.addEventListener('click', () => this.addColumn(i)),
        e.appendChild(n),
        s.appendChild(e);
    }
    return s;
  }
  handleCellClick(e) {
    return c(this, void 0, void 0, function* () {
      if (
        this.modalComponent &&
        u.tableAttributeConfig &&
        0 !== u.tableAttributeConfig.length
      )
        try {
          const t = yield this.modalComponent.show(u.tableAttributeConfig);
          if (t) {
            const n = this.findSelectedAttribute(t);
            n && this.updateCellContent(e, n, t);
          }
        } catch (e) {
          console.error('Error handling cell click:', e);
        }
      else
        console.warn('Modal component or table attribute config not available');
    });
  }
  findSelectedAttribute(e) {
    for (const t of u.tableAttributeConfig)
      if (e.hasOwnProperty(t.key) && void 0 !== e[t.key] && '' !== e[t.key])
        return t;
    return null;
  }
  updateCellContent(e, t, n) {
    e.setAttribute('data-attribute-key', t.key),
      e.setAttribute('data-attribute-type', t.type),
      (e.textContent = `${t.key}: ${t.value}`),
      (e.style.backgroundColor = '#e6f3ff'),
      (e.style.fontWeight = 'bold');
  }
  setModalComponent(e) {
    this.modalComponent = e;
  }
  addRow(e) {
    var t;
    const n = e.rows.length,
      o =
        (null === (t = e.rows[0]) || void 0 === t ? void 0 : t.cells.length) ||
        0,
      s = document.createElement('tr');
    for (let e = 0; e < o; e++) {
      const t = document.createElement('td');
      (t.textContent = `R${n + 1}C${e + 1}`),
        (t.style.border = '1px solid #000'),
        (t.style.padding = '8px'),
        (t.style.cursor = 'pointer'),
        (t.style.transition = 'background-color 0.2s ease'),
        t.addEventListener('mouseenter', () => {
          t.style.backgroundColor = '#f0f8ff';
        }),
        t.addEventListener('mouseleave', () => {
          t.style.backgroundColor = '';
        }),
        t.addEventListener('click', () => {
          this.handleCellClick(t);
        }),
        s.appendChild(t);
    }
    e.appendChild(s);
  }
  addColumn(e) {
    const t = e.rows.length;
    for (let n = 0; n < t; n++) {
      const t = document.createElement('td');
      (t.textContent = `R${n + 1}C${e.rows[n].cells.length + 1}`),
        (t.style.border = '1px solid #000'),
        (t.style.padding = '8px'),
        (t.style.cursor = 'pointer'),
        (t.style.transition = 'background-color 0.2s ease'),
        t.addEventListener('mouseenter', () => {
          t.style.backgroundColor = '#f0f8ff';
        }),
        t.addEventListener('mouseleave', () => {
          t.style.backgroundColor = '';
        }),
        t.addEventListener('click', () => {
          this.handleCellClick(t);
        }),
        e.rows[n].appendChild(t);
    }
  }
  setRowCount(e, t) {
    var n;
    if (!e) return;
    const o = e.rows.length,
      s =
        (null === (n = e.rows[0]) || void 0 === n ? void 0 : n.cells.length) ||
        0;
    if ((t < 0 && (t = 0), t > o))
      for (let n = o; n < t; n++) {
        const t = document.createElement('tr');
        for (let e = 0; e < s; e++) {
          const o = document.createElement('td');
          (o.textContent = `R${n + 1}C${e + 1}`),
            (o.style.border = '1px solid #000'),
            (o.style.padding = '8px'),
            (o.style.cursor = 'pointer'),
            (o.style.transition = 'background-color 0.2s ease'),
            o.addEventListener('mouseenter', () => {
              o.style.backgroundColor = '#f0f8ff';
            }),
            o.addEventListener('mouseleave', () => {
              o.style.backgroundColor = '';
            }),
            o.addEventListener('click', () => {
              this.handleCellClick(o);
            }),
            t.appendChild(o);
        }
        e.appendChild(t);
      }
    else if (t < o) for (let n = o - 1; n >= t; n--) e.deleteRow(n);
  }
  setColumnCount(e, t) {
    if (!e || 0 === e.rows.length) return;
    const n = e.rows.length,
      o = e.rows[0].cells.length;
    t < 0 && (t = 0);
    for (let s = 0; s < n; s++) {
      const n = e.rows[s];
      if (t > o)
        for (let e = o; e < t; e++) {
          const t = document.createElement('td');
          (t.textContent = `R${s + 1}C${e + 1}`),
            (t.style.border = '1px solid #000'),
            (t.style.padding = '8px'),
            (t.style.cursor = 'pointer'),
            (t.style.transition = 'background-color 0.2s ease'),
            t.addEventListener('mouseenter', () => {
              t.style.backgroundColor = '#f0f8ff';
            }),
            t.addEventListener('mouseleave', () => {
              t.style.backgroundColor = '';
            }),
            t.addEventListener('click', () => {
              this.handleCellClick(t);
            }),
            n.appendChild(t);
        }
      else if (t < o) for (let e = o - 1; e >= t; e--) n.deleteCell(e);
    }
  }
  createHeder(e) {
    var t;
    if (!e || 0 === e.rows.length) return;
    const n = e.rows[0];
    for (let e = 0; e < n.cells.length; e++) {
      const o = n.cells[e],
        s = document.createElement('th');
      s.innerHTML = o.innerHTML;
      for (const e of Array.from(o.attributes)) s.setAttribute(e.name, e.value);
      (s.style.cursor = 'pointer'),
        (s.style.transition = 'background-color 0.2s ease'),
        s.addEventListener('mouseenter', () => {
          s.style.backgroundColor = '#f0f8ff';
        }),
        s.addEventListener('mouseleave', () => {
          s.style.backgroundColor = '';
        }),
        s.addEventListener('click', () => {
          this.handleCellClick(s);
        }),
        null === (t = o.parentNode) || void 0 === t || t.replaceChild(s, o);
    }
  }
  static restore(e) {
    const t = new u(),
      n = e.querySelector('table');
    if (!n) return void console.error('No table found in container');
    n.querySelectorAll('td, th').forEach(e => {
      const n = e;
      (n.style.cursor = 'pointer'),
        (n.style.transition = 'background-color 0.2s ease'),
        n.addEventListener('mouseenter', () => {
          n.style.backgroundColor = '#f0f8ff';
        }),
        n.addEventListener('mouseleave', () => {
          n.style.backgroundColor = '';
        }),
        n.addEventListener('click', () => {
          t.handleCellClick(n);
        });
    });
    const o = e.querySelector('.button-container');
    if (!o) return void console.error('No button container found');
    o.querySelectorAll('button').forEach(e => {
      var o;
      const s = e.cloneNode(!0);
      null === (o = e.parentNode) || void 0 === o || o.replaceChild(s, e),
        'Add Row' === s.textContent
          ? s.addEventListener('click', () => t.addRow(n))
          : 'Add Column' === s.textContent &&
            s.addEventListener('click', () => t.addColumn(n));
    });
  }
}
class m {
  constructor() {
    (this.link = null), (this.isEditing = !1);
  }
  create(e = '#', t = 'Click Here') {
    const n = document.createElement('div');
    n.classList.add('link-component'),
      (this.link = document.createElement('a')),
      (this.link.href = e),
      (this.link.innerText = t),
      this.link.classList.add('link-component-label');
    const o = document.createElement('button');
    (o.innerHTML = '🖊️'), o.classList.add('edit-link');
    const s = document.createElement('div');
    s.classList.add('edit-link-form');
    const i = document.createElement('input');
    (i.type = 'url'), (i.value = e), (i.placeholder = 'Enter URL');
    const l = document.createElement('input');
    l.type = 'checkbox';
    const a = document.createElement('label');
    (a.innerHTML = 'Open in new tab'), a.appendChild(l);
    const r = document.createElement('button');
    return (
      (r.innerHTML = 'Save'),
      s.appendChild(i),
      s.appendChild(a),
      s.appendChild(r),
      o.addEventListener('click', e => {
        e.preventDefault(),
          (this.isEditing = !0),
          this.link && (this.link.style.display = 'none'),
          (o.style.display = 'none'),
          (s.style.display = 'flex');
      }),
      r.addEventListener('click', e => {
        e.preventDefault(),
          e.stopPropagation(),
          (this.isEditing = !1),
          this.link &&
            ((this.link.href = i.value),
            (this.link.style.display = 'inline'),
            (this.link.target = l.checked ? '_blank' : '_self')),
          (o.style.display = 'inline-flex'),
          (s.style.display = 'none');
      }),
      n.appendChild(this.link),
      n.appendChild(o),
      n.appendChild(s),
      n
    );
  }
  getLinkData() {
    var e, t, n;
    return {
      href: (null === (e = this.link) || void 0 === e ? void 0 : e.href) || '#',
      label:
        (null === (t = this.link) || void 0 === t ? void 0 : t.innerText) ||
        'Click Here',
      target:
        (null === (n = this.link) || void 0 === n ? void 0 : n.target) ||
        '_self',
    };
  }
  updateLink(e, t, n = '_self') {
    this.link &&
      ((this.link.href = e), (this.link.innerText = t), (this.link.target = n));
  }
  isInEditMode() {
    return this.isEditing;
  }
  static restore(e) {
    var t, n;
    const o = e.querySelector('.link-component-label'),
      s = e.querySelector('.edit-link'),
      i = e.querySelector('.edit-link-form'),
      l = i.querySelector('button'),
      a = i.querySelector('input[type="url"]'),
      r = i.querySelector('input[type="checkbox"]');
    if (!(o && s && i && l && a && r))
      return void console.error('Required elements not found');
    (o.style.display = 'inline'),
      (s.style.display = 'inline-flex'),
      (i.style.display = 'none');
    const d = s.cloneNode(!0),
      c = l.cloneNode(!0);
    null === (t = s.parentNode) || void 0 === t || t.replaceChild(d, s),
      null === (n = l.parentNode) || void 0 === n || n.replaceChild(c, l),
      d.addEventListener('click', e => {
        e.preventDefault(),
          (o.style.display = 'none'),
          (d.style.display = 'none'),
          (i.style.display = 'flex');
      }),
      c.addEventListener('click', e => {
        e.preventDefault(),
          e.stopPropagation(),
          (o.href = a.value),
          (o.style.display = 'inline'),
          (o.target = r.checked ? '_blank' : '_self'),
          (d.style.display = 'inline-flex'),
          (i.style.display = 'none');
      });
  }
}
class h {
  create() {
    const e = e => {
        let t,
          n,
          o,
          s,
          i = !1,
          l = !1,
          a = 0,
          r = 0;
        (e.style.position = 'relative'),
          (e.style.cursor = 'move'),
          e.addEventListener('mousedown', o => {
            l ||
              ((i = !0),
              (t = o.clientX),
              (n = o.clientY),
              (a = parseFloat(e.getAttribute('data-x') || '0')),
              (r = parseFloat(e.getAttribute('data-y') || '0')),
              document.addEventListener('mousemove', d),
              document.addEventListener('mouseup', c));
          });
        const d = o => {
            if (i) {
              const s = o.clientX - t,
                i = o.clientY - n,
                l = a + s,
                d = r + i;
              (e.style.transform = `translate(${l}px, ${d}px)`),
                e.setAttribute('data-x', l.toString()),
                e.setAttribute('data-y', d.toString());
            }
          },
          c = () => {
            (i = !1),
              document.removeEventListener('mousemove', d),
              document.removeEventListener('mouseup', c);
          };
        if (e.classList.contains('container')) {
          const i = document.createElement('div');
          Object.assign(i.style, {
            width: '10px',
            height: '10px',
            background: 'blue',
            position: 'absolute',
            right: '0',
            bottom: '0',
            cursor: 'se-resize',
          }),
            e.appendChild(i),
            i.addEventListener('mousedown', i => {
              i.stopPropagation(),
                (l = !0),
                (o = e.offsetWidth),
                (s = e.offsetHeight),
                (t = i.clientX),
                (n = i.clientY),
                document.addEventListener('mousemove', a),
                document.addEventListener('mouseup', r);
            });
          const a = i => {
              if (l) {
                const l = o + (i.clientX - t),
                  a = s + (i.clientY - n);
                (e.style.width = `${l}px`), (e.style.height = `${a}px`);
              }
            },
            r = () => {
              (l = !1),
                document.removeEventListener('mousemove', a),
                document.removeEventListener('mouseup', r);
            };
        }
      },
      n = new l().create();
    n.classList.add('container'),
      Object.assign(n.style, {
        width: '100%',
        maxWidth: 'none',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Roboto', sans-serif",
      }),
      e(n);
    const o = new l().create();
    o.classList.add('container'),
      Object.assign(o.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        width: '100%',
      }),
      e(o);
    const i = new t('MyBrand').create();
    Object.assign(i.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    });
    const a = new l().create();
    a.classList.add('container'),
      Object.assign(a.style, { display: 'flex', gap: '20px' }),
      e(a),
      ['Home', 'Features', 'Contact'].forEach(e => {
        const n = new t(e).create();
        Object.assign(n.style, {
          cursor: 'pointer',
          color: '#555',
          textDecoration: 'none',
        }),
          a.appendChild(n);
      }),
      o.appendChild(i),
      o.appendChild(a);
    const r = new l().create();
    r.classList.add('container'),
      Object.assign(r.style, {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        marginBottom: '40px',
      }),
      e(r);
    const d = new t('Welcome to My Landing Page').create();
    Object.assign(d.style, {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      marginBottom: '40px',
      width: '100%',
    });
    const c = new t(
      'Discover amazing features and build better products with us.'
    ).create();
    Object.assign(c.style, {
      fontSize: '18px',
      color: '#666',
      marginBottom: '30px',
    });
    const p = new s().create();
    Object.assign(p.style, {
      padding: '12px 24px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }),
      p.addEventListener('mouseenter', () => {
        p.style.backgroundColor = '#0056b3';
      }),
      p.addEventListener('mouseleave', () => {
        p.style.backgroundColor = '#007bff';
      }),
      r.appendChild(d),
      r.appendChild(c),
      r.appendChild(p);
    const u = new l().create();
    u.classList.add('container'),
      Object.assign(u.style, {
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
      }),
      e(u);
    const m = new t('© 2025 MyBrand. All rights reserved.').create();
    return (
      Object.assign(m.style, { fontSize: '14px', color: '#999' }),
      u.appendChild(m),
      n.appendChild(o),
      n.appendChild(r),
      n.appendChild(u),
      n
    );
  }
}
class g {
  constructor(e) {
    (this.undoStack = []), (this.redoStack = []), (this.canvas = e);
  }
  captureState() {
    const e = k.getState();
    if (e.length > 0) {
      const t = this.undoStack[this.undoStack.length - 1];
      JSON.stringify(e) !== JSON.stringify(t) &&
        (this.undoStack.push(e),
        this.undoStack.length > 20 && this.undoStack.shift(),
        (this.redoStack = []));
    } else console.warn('No valid state to capture.');
  }
  undo() {
    if (this.undoStack.length > 1) {
      const e = this.undoStack.pop();
      this.redoStack.push(e);
      const t = this.undoStack[this.undoStack.length - 1];
      k.restoreState(t);
    } else if (1 === this.undoStack.length) {
      const e = this.undoStack.pop();
      this.redoStack.push(e);
      const t = k.jsonStorage.load();
      t ? k.restoreState(t) : k.restoreState([]);
    } else console.warn('No more actions to undo.');
  }
  redo() {
    if (this.redoStack.length > 0) {
      const e = this.redoStack.pop();
      this.undoStack.push(e), k.restoreState(e);
    } else console.warn('No more actions to redo.');
  }
}
class v {
  save(e) {
    localStorage.setItem('pageLayout', JSON.stringify(e));
  }
  load() {
    const e = localStorage.getItem('pageLayout');
    return e ? JSON.parse(e) : null;
  }
  remove() {
    localStorage.removeItem('pageLayout');
  }
}
class y {
  constructor(e) {
    (this.icons = {
      delete:
        'https://res.cloudinary.com/dodvwsaqj/image/upload/v1737366522/delete-2-svgrepo-com_fwkzn7.svg',
    }),
      (this.canvas = e);
  }
  addControlButtons(e) {
    let t = e.querySelector('img'),
      n = e.querySelector('.component-controls');
    n ||
      ((n = document.createElement('div')),
      (n.className = 'component-controls'),
      t ? e.appendChild(n) : e.prepend(n));
    const o = this.createDeleteIcon(e);
    n.appendChild(o);
  }
  createDeleteIcon(e) {
    let t = e.querySelector('.delete-icon');
    return (
      t ||
        ((t = document.createElement('img')),
        (t.src = this.icons.delete),
        (t.alt = 'Delete'),
        t.classList.add('delete-icon'),
        e.appendChild(t)),
      (t.onclick = t => {
        t.stopPropagation(), this.handleDelete(e);
      }),
      t
    );
  }
  handleDelete(e) {
    this.canvas.historyManager.captureState(), e.remove();
    const t = this.canvas.getComponents().filter(t => t !== e);
    this.canvas.setComponents(t),
      this.canvas.historyManager.captureState(),
      this.canvas.dispatchDesignChange();
  }
}
function b(e) {
  const t = document.getElementById('notification');
  t &&
    ((t.innerHTML = e),
    t.classList.add('visible'),
    t.classList.remove('hidden'),
    setTimeout(() => {
      t.classList.remove('visible'), t.classList.add('hidden');
    }, 2e3));
}
function f(e, t) {
  let n = null;
  return (...o) => {
    n && clearTimeout(n), (n = setTimeout(() => e(...o), t));
  };
}
class w {
  static updateLayersView() {
    const e = document.getElementById('layers-view');
    if (!e) return;
    e.innerHTML = '';
    const t = document.createElement('div');
    (t.className = 'layers-search'),
      (t.innerHTML =
        '\n      <input type="text" placeholder="Search layers..." id="layers-search-input">\n    '),
      e.appendChild(t);
    const n = document.createElement('div');
    (n.className = 'layers-container'), e.appendChild(n);
    const o = document.getElementById('canvas');
    o && this.buildLayerTree(o, n, 0);
    const s = document.getElementById('layers-search-input');
    s &&
      s.addEventListener('input', e => {
        const t = e.target.value.toLowerCase();
        this.filterLayers(n, t);
      });
  }
  static buildLayerTree(e, t, n) {
    Array.from(e.children)
      .filter(
        e =>
          e.classList.contains('editable-component') ||
          e.classList.contains('component')
      )
      .forEach(e => {
        const o = this.createLayerItem(e, n);
        t.appendChild(o);
        if (
          Array.from(e.children).filter(
            e =>
              e.classList.contains('editable-component') ||
              e.classList.contains('component')
          ).length > 0
        ) {
          const s = document.createElement('div');
          s.className = 'layer-children collapsed';
          const i = o.querySelector('.layer-expand-toggle');
          i &&
            i.addEventListener('click', e => {
              e.stopPropagation(), this.toggleLayerExpansion(i, s);
            }),
            this.buildLayerTree(e, s, n + 1),
            t.appendChild(s);
        }
      });
  }
  static createLayerItem(e, t) {
    const n = document.createElement('div');
    (n.className = 'layer-item'),
      n.setAttribute('data-component-id', e.id),
      n.setAttribute('data-type', this.getComponentType(e));
    const o = Array.from(e.children).some(
      e =>
        e.classList.contains('editable-component') ||
        e.classList.contains('component')
    );
    (n.innerHTML = `\n      <div class="layer-content">\n        ${o ? '<button class="layer-expand-toggle">▶</button>' : '<span style="width: 16px;"></span>'}\n        <span class="layer-name">${this.getComponentName(e)}</span>\n      </div>\n      <div class="layer-actions">\n        <button class="layer-action-btn layer-visibility-btn" title="Toggle visibility">\n          👁️\n        </button>\n        <button class="layer-action-btn layer-delete-btn" title="Delete">\n          🗑️\n        </button>\n      </div>\n    `),
      n.addEventListener('click', t => {
        t.stopPropagation(), this.selectLayer(n, e);
      });
    const s = n.querySelector('.layer-visibility-btn'),
      i = n.querySelector('.layer-delete-btn');
    return (
      s &&
        s.addEventListener('click', t => {
          t.stopPropagation(), this.toggleVisibility(e, s);
        }),
      i &&
        i.addEventListener('click', t => {
          t.stopPropagation(), this.deleteComponent(e, n);
        }),
      n
    );
  }
  static toggleLayerExpansion(e, t) {
    t.classList.contains('expanded')
      ? (t.classList.remove('expanded'),
        t.classList.add('collapsed'),
        e.classList.remove('expanded'))
      : (t.classList.remove('collapsed'),
        t.classList.add('expanded'),
        e.classList.add('expanded'));
  }
  static selectLayer(e, t) {
    document.querySelectorAll('.layer-item.selected').forEach(e => {
      e.classList.remove('selected');
    }),
      e.classList.add('selected'),
      void 0 !== window.CustomizationSidebar &&
        window.CustomizationSidebar.showSidebar(t.id);
  }
  static toggleVisibility(e, t) {
    'none' === e.style.display
      ? ((e.style.display = ''), t.classList.remove('hidden'))
      : ((e.style.display = 'none'), t.classList.add('hidden'));
  }
  static deleteComponent(e, t) {
    confirm('Are you sure you want to delete this component?') &&
      (e.remove(), t.remove(), this.updateLayersView());
  }
  static getComponentType(e) {
    return e.classList.contains('text-component')
      ? 'text'
      : e.classList.contains('button-component')
        ? 'button'
        : e.classList.contains('image-component')
          ? 'image'
          : e.classList.contains('container-component')
            ? 'container'
            : 'component';
  }
  static getComponentName(e) {
    var t;
    if (e.id) return e.id;
    const n = this.getComponentType(e),
      o =
        Array.from(
          (null === (t = e.parentElement) || void 0 === t
            ? void 0
            : t.children) || []
        )
          .filter(t => t.classList.contains(e.classList[0]))
          .indexOf(e) + 1;
    return `${n.charAt(0).toUpperCase() + n.slice(1)} ${o}`;
  }
  static filterLayers(e, t) {
    e.querySelectorAll('.layer-item').forEach(e => {
      var n, o;
      const s = (
        (null ===
          (o =
            null === (n = e.querySelector('.layer-name')) || void 0 === n
              ? void 0
              : n.textContent) || void 0 === o
          ? void 0
          : o.toLowerCase()) || ''
      ).includes(t);
      e.style.display = s ? 'flex' : 'none';
    });
  }
}
const C = {
  desktop:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z" fill="#000000"/>\n                </svg>',
  tablet:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M19 12V11.988M4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>',
  mobile:
    '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M22.461 5H9.539a1.6 1.6 0 0 0-1.601 1.603V25.4A1.6 1.6 0 0 0 9.539 27h12.922c.885 0 1.602-.718 1.602-1.602V6.603A1.603 1.603 0 0 0 22.461 5zm-6.46 20.418a1.022 1.022 0 1 1 1.021-1.021c-.001.634-.46 1.021-1.021 1.021zm6.862-3.501H9.138V7.704h13.725v14.213z"/></svg>',
  save: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M790.706 338.824v112.94H395.412c-31.06 0-56.47 25.3-56.47 56.471v744.509c17.73-6.325 36.592-10.391 56.47-10.391h1129.412c19.877 0 38.738 4.066 56.47 10.39V508.236c0-31.171-25.412-56.47-56.47-56.47h-395.295V338.824h395.295c93.402 0 169.411 76.009 169.411 169.411v1242.353c0 93.403-76.01 169.412-169.411 169.412H395.412C302.009 1920 226 1843.99 226 1750.588V508.235c0-93.402 76.01-169.411 169.412-169.411h395.294Zm734.118 1016.47H395.412c-31.06 0-56.47 25.299-56.47 56.47v338.824c0 31.172 25.41 56.47 56.47 56.47h1129.412c31.058 0 56.47-25.298 56.47-56.47v-338.823c0-31.172-25.412-56.47-56.47-56.47ZM1016.622-.023v880.151l246.212-246.325 79.85 79.85-382.532 382.644-382.645-382.644 79.85-79.85L903.68 880.128V-.022h112.941ZM564.824 1468.235c-62.344 0-112.942 50.71-112.942 112.941s50.598 112.942 112.942 112.942c62.343 0 112.94-50.71 112.94-112.942 0-62.23-50.597-112.94-112.94-112.94Z" fill-rule="evenodd"/>\n                </svg>',
  code: '<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n  viewBox="0 0 493.525 493.525" xml:space="preserve">\n<g id="XMLID_30_">\n <path id="XMLID_32_" d="M430.557,79.556H218.44c21.622,12.688,40.255,29.729,54.859,49.906h157.258\n     c7.196,0,13.063,5.863,13.063,13.06v238.662c0,7.199-5.866,13.064-13.063,13.064H191.894c-7.198,0-13.062-5.865-13.062-13.064\n     V222.173c-6.027-3.1-12.33-5.715-18.845-7.732c-3.818,11.764-12.105,21.787-23.508,27.781c-2.39,1.252-4.987,2.014-7.554,2.844\n     v136.119c0,34.717,28.25,62.971,62.968,62.971h238.663c34.718,0,62.969-28.254,62.969-62.971V142.522\n     C493.525,107.806,465.275,79.556,430.557,79.556z"/>\n <path id="XMLID_31_" d="M129.037,175.989c51.419,1.234,96.388,28.283,122.25,68.865c2.371,3.705,6.434,5.848,10.657,5.848\n     c1.152,0,2.322-0.162,3.46-0.486c5.377-1.545,9.114-6.418,9.179-12.006c0-0.504,0-1.01,0-1.51\n     c0-81.148-64.853-147.023-145.527-148.957V64.155c0-5.492-3.038-10.512-7.879-13.078c-2.16-1.139-4.533-1.707-6.889-1.707\n     c-2.94,0-5.848,0.88-8.35,2.584L5.751,120.526C2.162,122.98,0.018,127.041,0,131.394c-0.017,4.338,2.113,8.418,5.687,10.902\n     l100.17,69.451c2.518,1.753,5.459,2.631,8.414,2.631c2.355,0,4.696-0.553,6.857-1.676c4.855-2.549,7.909-7.6,7.909-13.092V175.989z\n     "/>\n</g>\n</svg>',
  view: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>',
  undo: '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.53033 3.46967C7.82322 3.76256 7.82322 4.23744 7.53033 4.53033L5.81066 6.25H15C18.1756 6.25 20.75 8.82436 20.75 12C20.75 15.1756 18.1756 17.75 15 17.75H8.00001C7.58579 17.75 7.25001 17.4142 7.25001 17C7.25001 16.5858 7.58579 16.25 8.00001 16.25H15C17.3472 16.25 19.25 14.3472 19.25 12C19.25 9.65279 17.3472 7.75 15 7.75H5.81066L7.53033 9.46967C7.82322 9.76256 7.82322 10.2374 7.53033 10.5303C7.23744 10.8232 6.76256 10.8232 6.46967 10.5303L3.46967 7.53033C3.17678 7.23744 3.17678 6.76256 3.46967 6.46967L6.46967 3.46967C6.76256 3.17678 7.23744 3.17678 7.53033 3.46967Z" fill="#1C274C"/>\n            </svg>',
  redo: '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M20 7H9.00001C6.23858 7 4 9.23857 4 12C4 14.7614 6.23858 17 9 17H16M20 7L17 4M20 7L17 10" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>',
  reset:
    '<svg width="800px" height="800px" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">\n    \n                <g fill="none" fill-rule="evenodd" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" transform="matrix(0 1 1 0 2.5 2.5)">\n    \n                <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>\n    \n                <circle cx="8" cy="8" fill="#000000" r="2"/>\n    \n                <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/>\n    \n                </g>\n    \n                </svg>',
  button:
    '<svg width="800px" height="800px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">\n    \n                    <rect x="0" fill="none" width="20" height="20"/>\n    \n                    <g>\n    \n                    <path d="M17 5H3c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm1 7c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h14c.6 0 1 .4 1 1v5z"/>\n    \n                    </g>\n    \n                    </svg>',
  header:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7 5C7.55228 5 8 5.44772 8 6V11.5H16V6C16 5.44772 16.4477 5 17 5C17.5523 5 18 5.44772 18 6V12.5V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V13.5H8V19C8 19.5523 7.55228 20 7 20C6.44772 20 6 19.5523 6 19V12.5V6C6 5.44772 6.44772 5 7 5Z" fill="#000000"/>\n                        </svg>',
  image:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <rect width="24" height="24" fill="white"/>\n            <path d="M21 16V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V18M21 16V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V18M21 16L15.4829 12.3219C15.1843 12.1228 14.8019 12.099 14.4809 12.2595L3 18" stroke="#000000" stroke-linejoin="round"/>\n            <circle cx="8" cy="9" r="2" stroke="#000000" stroke-linejoin="round"/>\n            </svg>',
  video:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <circle cx="12" cy="12" r="10" fill="#000"/>\n                <polygon points="10,8 16,12 10,16" fill="#ffffff"/>\n                </svg>',
  container:
    '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" id="memory-box-outer-light-dashed-all"><path d="M4 0V2H2V4H0V0H4M2 6V10H0V6H2M2 12V16H0V12H2M2 18V20H4V22H0V18H2M6 0H10V2H6V0M12 0H16V2H12V0M18 0H22V4H20V2H18V0M18 22V20H20V18H22V22H18M16 22H12V20H16V22M10 22H6V20H10V22M20 6H22V10H20V6M20 12H22V16H20V12Z" /></svg>',
  text: '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M4 4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V6C20 6.55228 19.5523 7 19 7C18.4477 7 18 6.55228 18 6V5H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V5H6V6C6 6.55228 5.55228 7 5 7C4.44772 7 4 6.55228 4 6V4Z" fill="#000000"/>\n            </svg>',
  hyperlink:
    '<svg \n                      xmlns="http://www.w3.org/2000/svg" \n                      width="18" \n                      height="18" \n                      viewBox="0 0 24 24">\n                      <title>Hyperlink</title>\n                      <path fill="currentColor" d="M14.78 3.653a3.936 3.936 0 1 1 5.567 5.567l-3.627 3.627a3.936 3.936 0 0 1-5.88-.353a.75.75 0 0 0-1.18.928a5.436 5.436 0 0 0 8.12.486l3.628-3.628a5.436 5.436 0 1 0-7.688-7.688l-3 3a.75.75 0 0 0 1.06 1.061z"/>\n                      <path fill="currentColor" d="M7.28 11.153a3.936 3.936 0 0 1 5.88.353a.75.75 0 0 0 1.18-.928a5.436 5.436 0 0 0-8.12-.486L2.592 13.72a5.436 5.436 0 1 0 7.688 7.688l3-3a.75.75 0 1 0-1.06-1.06l-3 3a3.936 3.936 0 0 1-5.567-5.568z"/>\n                  </svg>',
  twocol:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n        <path d="M12 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H12M12 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H12M12 4V20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n        </svg>',
  threecol:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M9.33333 20H5C4.44772 20 4 19.5523 4 19V5C4 4.44772 4.44772 4 5 4H9.33333M9.33333 20V4M9.33333 20H14.6667M9.33333 4H14.6667M14.6667 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H14.6667M14.6667 4V20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>',
  table:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M9 4V20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M15 4V20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M4 9H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M4 15H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>',
  landing:
    '<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n           viewBox="0 0 32 32" xml:space="preserve">\n            <style type="text/css">\n                .st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n                .st1{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}\n                .st2{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:5.2066,0;}\n            </style>\n            <line class="st0" x1="3" y1="11" x2="29" y2="11"/>\n            <line class="st0" x1="7" y1="8" x2="7" y2="8"/>\n            <line class="st0" x1="10" y1="8" x2="10" y2="8"/>\n            <line class="st0" x1="13" y1="8" x2="13" y2="8"/>\n            <rect x="3" y="5" class="st0" width="26" height="22"/>\n            <rect x="6" y="14" class="st0" width="10" height="10"/>\n            <rect x="19" y="21" class="st0" width="7" height="3"/>\n            <line class="st0" x1="20" y1="15" x2="26" y2="15"/>\n            <line class="st0" x1="23" y1="18" x2="26" y2="18"/>\n            <polyline class="st0" points="6,22 12,19 16,22 "/>\n            <line class="st0" x1="9" y1="17" x2="9" y2="17"/>\n            </svg>',
  delete:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>',
  close:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"/>\n                </svg>',
  edit: '<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n    viewBox="0 0 348.882 348.882" xml:space="preserve">\n<g>\n   <path d="M333.988,11.758l-0.42-0.383C325.538,4.04,315.129,0,304.258,0c-12.187,0-23.888,5.159-32.104,14.153L116.803,184.231\n       c-1.416,1.55-2.49,3.379-3.154,5.37l-18.267,54.762c-2.112,6.331-1.052,13.333,2.835,18.729c3.918,5.438,10.23,8.685,16.886,8.685\n       c0,0,0.001,0,0.001,0c2.879,0,5.693-0.592,8.362-1.76l52.89-23.138c1.923-0.841,3.648-2.076,5.063-3.626L336.771,73.176\n       C352.937,55.479,351.69,27.929,333.988,11.758z M130.381,234.247l10.719-32.134l0.904-0.99l20.316,18.556l-0.904,0.99\n       L130.381,234.247z M314.621,52.943L182.553,197.53l-20.316-18.556L294.305,34.386c2.583-2.828,6.118-4.386,9.954-4.386\n       c3.365,0,6.588,1.252,9.082,3.53l0.419,0.383C319.244,38.922,319.63,47.459,314.621,52.943z"/>\n   <path d="M303.85,138.388c-8.284,0-15,6.716-15,15v127.347c0,21.034-17.113,38.147-38.147,38.147H68.904\n       c-21.035,0-38.147-17.113-38.147-38.147V100.413c0-21.034,17.113-38.147,38.147-38.147h131.587c8.284,0,15-6.716,15-15\n       s-6.716-15-15-15H68.904c-37.577,0-68.147,30.571-68.147,68.147v180.321c0,37.576,30.571,68.147,68.147,68.147h181.798\n       c37.576,0,68.147-30.571,68.147-68.147V153.388C318.85,145.104,312.134,138.388,303.85,138.388z"/>\n</g>\n</svg>',
  attribute:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-route-icon lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>',
  settings:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 12h16"/><path d="M4 18h16"/><path d="M4 6h16"/></svg>',
  sidebarMenu:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  customizationMenu:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brush-icon lucide-brush"><path d="m11 10 3 3"/><path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z"/><path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031"/></svg>',
};
class x {
  static init(e, t, n) {
    if (
      ((this.sidebarElement = document.getElementById('customization')),
      (this.controlsContainer = document.getElementById('controls')),
      (this.componentNameHeader = document.getElementById('component-name')),
      (this.customComponentsConfig = e),
      (this.basicComponentsConfig = n),
      (this.editable = t),
      !this.sidebarElement || !this.controlsContainer)
    )
      return void console.error(
        'CustomizationSidebar: Required elements not found.'
      );
    (this.layersViewController = new w()),
      (this.functionsPanel = document.createElement('div')),
      (this.functionsPanel.id = 'functions-panel'),
      (this.functionsPanel.className = 'dropdown-panel'),
      (this.functionsPanel.style.display = 'none'),
      (this.layersModeToggle = document.createElement('div')),
      (this.layersModeToggle.className = 'layers-mode-toggle'),
      (this.layersModeToggle.innerHTML = `\n        <button id="customize-tab" title="Customize" class="active">${C.settings}</button>\n        <button id="attribute-tab" title="Attribute" >${C.attribute}</button>\n        <button id="layers-tab" title="Layers"> ${C.menu} </button>\n    `),
      this.sidebarElement.insertBefore(
        this.layersModeToggle,
        this.componentNameHeader
      ),
      this.sidebarElement.appendChild(this.controlsContainer),
      this.sidebarElement.appendChild(this.functionsPanel),
      (this.controlsContainer.style.display = 'block'),
      (this.layersView = document.createElement('div')),
      (this.layersView.id = 'layers-view'),
      (this.layersView.className = 'layers-view hidden'),
      this.sidebarElement.appendChild(this.layersView);
    const o = this.layersModeToggle.querySelector('#customize-tab'),
      s = this.layersModeToggle.querySelector('#attribute-tab'),
      i = this.layersModeToggle.querySelector('#layers-tab');
    o.addEventListener('click', () => this.switchToCustomizeMode()),
      s.addEventListener('click', () => {
        this.switchToAttributeMode();
      }),
      i.addEventListener('click', () => this.switchToLayersMode());
  }
  static switchToCustomizeMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('attribute-tab'),
      n = document.getElementById('layers-tab'),
      o = document.getElementById('layers-view'),
      s = document.getElementById('component-name');
    e.classList.add('active'),
      t.classList.remove('active'),
      n.classList.remove('active'),
      (o.style.display = 'none'),
      (this.controlsContainer.style.display = 'block'),
      (this.functionsPanel.style.display = 'none'),
      (s.style.display = 'block'),
      this.selectedComponent &&
        this.populateCssControls(this.selectedComponent);
  }
  static switchToAttributeMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('attribute-tab'),
      n = document.getElementById('layers-tab'),
      o = document.getElementById('layers-view'),
      s = document.getElementById('component-name');
    t.classList.add('active'),
      e.classList.remove('active'),
      n.classList.remove('active'),
      (o.style.display = 'none'),
      (this.functionsPanel.style.display = 'block'),
      (this.controlsContainer.style.display = 'none'),
      (s.style.display = 'block'),
      this.selectedComponent &&
        this.populateFunctionalityControls(this.selectedComponent);
  }
  static switchToLayersMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('attribute-tab'),
      n = document.getElementById('layers-tab'),
      o = document.getElementById('layers-view'),
      s = document.getElementById('component-name');
    n.classList.add('active'),
      t.classList.remove('active'),
      e.classList.remove('active'),
      (this.controlsContainer.style.display = 'none'),
      (this.functionsPanel.style.display = 'none'),
      (o.style.display = 'block'),
      (s.style.display = 'none'),
      w.updateLayersView();
  }
  static showSidebar(e) {
    const t = document.getElementById(e);
    if (!t) return void console.error(`Component with ID "${e}" not found.`);
    if (!1 === this.editable) return;
    (this.selectedComponent = t),
      (this.sidebarElement.style.display = 'block'),
      this.sidebarElement.classList.add('visible');
    const n = document.getElementById('menu-btn');
    n &&
      ((n.style.backgroundColor = '#e2e8f0'),
      (n.style.borderColor = '#cbd5e1')),
      (this.componentNameHeader.textContent = `Component: ${e}`),
      this.switchToCustomizeMode();
  }
  static populateCssControls(e) {
    this.controlsContainer.innerHTML = '';
    const t = getComputedStyle(e),
      n = 'canvas' === e.id.toLowerCase();
    this.createSelectControl('Display', 'display', t.display || 'block', [
      'block',
      'inline',
      'inline-block',
      'flex',
      'grid',
      'none',
    ]),
      n ||
        (this.createControl('Width', 'width', 'number', e.offsetWidth, {
          min: 0,
          max: 1e3,
          unit: 'px',
        }),
        this.createControl('Height', 'height', 'number', e.offsetHeight, {
          min: 0,
          max: 1e3,
          unit: 'px',
        }),
        this.createControl(
          'Margin',
          'margin',
          'number',
          parseInt(t.margin) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        ),
        this.createControl(
          'Padding',
          'padding',
          'number',
          parseInt(t.padding) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        )),
      this.createControl(
        'Background Color',
        'background-color',
        'color',
        t.backgroundColor
      ),
      this.createSelectControl('Text Alignment', 'alignment', t.textAlign, [
        'left',
        'center',
        'right',
      ]),
      this.createSelectControl('Font Family', 'font-family', t.fontFamily, [
        'Arial',
        'Verdana',
        'Helvetica',
        'Times New Roman',
        'Georgia',
        'Courier New',
        'sans-serif',
        'serif',
      ]),
      this.createControl(
        'Font Size',
        'font-size',
        'number',
        parseInt(t.fontSize) || 16,
        { min: 0, max: 100, unit: 'px' }
      ),
      this.createControl(
        'Text Color',
        'text-color',
        'color',
        t.color || '#000000'
      ),
      this.createControl(
        'Border Width',
        'border-width',
        'number',
        parseInt(t.borderWidth) || 0,
        { min: 0, max: 20, unit: 'px' }
      ),
      this.createSelectControl(
        'Border Style',
        'border-style',
        t.borderStyle || 'none',
        [
          'none',
          'solid',
          'dashed',
          'dotted',
          'double',
          'groove',
          'ridge',
          'inset',
          'outset',
        ]
      ),
      this.createControl(
        'Border Color',
        'border-color',
        'color',
        t.borderColor || '#000000'
      );
    const o = document.getElementById('background-color');
    o && (o.value = x.rgbToHex(t.backgroundColor));
    const s = document.getElementById('text-color');
    s && (s.value = x.rgbToHex(t.color));
    const i = document.getElementById('border-color');
    i && (i.value = x.rgbToHex(t.borderColor)), this.addListeners(e);
  }
  static populateFunctionalityControls(e) {
    var t, n;
    if (
      ((this.functionsPanel.innerHTML = ''),
      e.classList.contains('table-component'))
    ) {
      const n = e.querySelector('table');
      if (this.basicComponentsConfig) {
        const e = this.basicComponentsConfig.components.find(
          e => 'table' === e.name
        );
        e &&
          e.attributes &&
          e.attributes.length > 0 &&
          e.attributes.map(e => {
            const t = document.createElement('div');
            if (
              'Input' === e.type &&
              ((t.innerHTML = `\n            <label for=${e.key} class="type-input-label">${e.title}</label>\n                <div class="input-wrapper type-input-div">\n                  <input type="text" class="type-input" id=${e.key}  ${e.editable ? '' : 'disabled'}  value=${e.default_value ? e.default_value : ''} >\n                </div>\n            `),
              this.functionsPanel.appendChild(t),
              e.trigger)
            ) {
              const t = document.getElementById(e.key);
              null == t ||
                t.addEventListener(e.trigger, () => {
                  var e, t;
                  (null === (e = this.basicComponentsConfig) || void 0 === e
                    ? void 0
                    : e.globalExecuteFunction) &&
                    (null === (t = this.basicComponentsConfig) ||
                      void 0 === t ||
                      t.globalExecuteFunction());
                });
            }
          });
      } else if (n) {
        const e = n.rows.length,
          o =
            (null === (t = n.rows[0]) || void 0 === t
              ? void 0
              : t.cells.length) || 0,
          s = document.createElement('div');
        s.classList.add('control-wrapper'),
          (s.innerHTML = `\n                  <label for="table-rows">Number of Rows:</label>\n                  <div class="input-wrapper">\n                    <input type="number" id="table-rows" value="${e}" min="0">\n                  </div>\n              `),
          this.functionsPanel.appendChild(s);
        const i = s.querySelector('#table-rows');
        i.addEventListener(
          'input',
          f(() => {
            const e = parseInt(i.value);
            if (!isNaN(e)) {
              new u().setRowCount(n, e), k.historyManager.captureState();
            }
          }, 300)
        );
        const l = document.createElement('div');
        l.classList.add('control-wrapper'),
          (l.innerHTML = `\n                  <label for="table-cols">Number of Columns:</label>\n                  <div class="input-wrapper">\n                    <input type="number" id="table-cols" value="${o}" min="0">\n                  </div>\n              `),
          this.functionsPanel.appendChild(l);
        const a = l.querySelector('#table-cols');
        a.addEventListener(
          'input',
          f(() => {
            const e = parseInt(a.value);
            if (!isNaN(e)) {
              new u().setColumnCount(n, e), k.historyManager.captureState();
            }
          }, 300)
        );
        const r = document.createElement('div');
        r.classList.add('control-wrapper'),
          (r.innerHTML =
            '\n          <label for="table-header">Create Header:</label>\n          <div class="input-wrapper">\n            <input type="checkbox" id="table-header"  min="0">\n          </div\n        '),
          this.functionsPanel.appendChild(r);
        const d = r.querySelector('#table-header');
        d.addEventListener(
          'input',
          f(() => {
            if (d.checked) {
              new u().createHeder(n), k.historyManager.captureState();
            }
          }, 300)
        );
      }
    } else if (e.classList.contains('custom-component')) {
      const t =
          null ===
            (n = Array.from(e.classList).find(e => e.endsWith('-component'))) ||
          void 0 === n
            ? void 0
            : n.replace('-component', ''),
        o = x.customComponentsConfig;
      if (t && o && o[t] && o[t].settingsComponentTagName) {
        const n = o[t].settingsComponentTagName;
        let s = this.functionsPanel.querySelector(n);
        s ||
          ((s = document.createElement(n)), this.functionsPanel.appendChild(s)),
          s.setAttribute(
            'data-settings',
            JSON.stringify({ targetComponentId: e.id })
          );
      }
    } else
      this.functionsPanel.innerHTML =
        '<p>No specific settings for this component.</p>';
  }
  static rgbToHex(e) {
    const t = e.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
    if (!t) return e;
    return `#${((1 << 24) | (parseInt(t[1], 10) << 16) | (parseInt(t[2], 10) << 8) | parseInt(t[3], 10)).toString(16).slice(1).toUpperCase()}`;
  }
  static createControl(e, t, n, o, s = {}) {
    const i = document.createElement('div');
    i.classList.add('control-wrapper');
    if ('number' === n && s.unit) {
      const l = s.unit;
      i.innerHTML = `\n                <label for="${t}">${e}:</label>\n                <div class="input-wrapper">\n                  <input type="${n}" id="${t}" value="${o}">\n                  <select id="${t}-unit">\n                      <option value="px" ${'px' === l ? 'selected' : ''}>px</option>\n                      <option value="rem" ${'rem' === l ? 'selected' : ''}>rem</option>\n                      <option value="vh" ${'vh' === l ? 'selected' : ''}>vh</option>\n                      <option value="%" ${'%' === l ? 'selected' : ''}>%</option>\n                  </select>\n                </div\n            `;
    } else
      i.innerHTML = `\n        <label for="${t}">${e}:</label>\n        <div class="input-wrapper">\n          <input type="color" id="${t}" value="${o}">\n          <input type="text" id="${t}-value" style="font-size: 0.8rem; width: 200px; margin-left: 8px;" value="${o}">\n        </div>\n      `;
    const l = i.querySelector('input'),
      a = i.querySelector(`#${t}-unit`);
    l &&
      Object.keys(s).forEach(e => {
        l.setAttribute(e, s[e].toString());
      });
    const r = i.querySelector(`input[type="color"]#${t}`),
      d = i.querySelector(`#${t}-value`);
    r &&
      r.addEventListener('input', () => {
        d && (d.value = r.value);
      }),
      d &&
        d.addEventListener('input', () => {
          r && (r.value = d.value);
        }),
      this.controlsContainer.appendChild(i),
      a &&
        a.addEventListener('change', () => {
          const e = a.value,
            t = parseInt(l.value);
          l.value = `${t}${e}`;
        });
  }
  static createSelectControl(e, t, n, o) {
    const s = document.createElement('div');
    s.classList.add('control-wrapper');
    const i = o
      .map(
        e => `<option value="${e}" ${e === n ? 'selected' : ''}>${e}</option>`
      )
      .join('');
    (s.innerHTML = `\n                <label for="${t}">${e}:</label>\n                <div class="input-wrapper">\n                  <select id="${t}">${i}</select>\n                </div>\n            `),
      this.controlsContainer.appendChild(s);
  }
  static addListeners(e) {
    var t, n, o, s, i, l, a, r, d, c, p, u, m, h, g, v;
    const y = {
        width: document.getElementById('width'),
        height: document.getElementById('height'),
        backgroundColor: document.getElementById('background-color'),
        margin: document.getElementById('margin'),
        padding: document.getElementById('padding'),
        alignment: document.getElementById('alignment'),
        fontSize: document.getElementById('font-size'),
        textColor: document.getElementById('text-color'),
        borderWidth: document.getElementById('border-width'),
        borderStyle: document.getElementById('border-style'),
        borderColor: document.getElementById('border-color'),
        display: document.getElementById('display'),
        fontFamily: document.getElementById('font-family'),
      },
      b = f(() => {
        k.dispatchDesignChange(), k.historyManager.captureState();
      }, 300);
    null === (t = y.width) ||
      void 0 === t ||
      t.addEventListener('input', () => {
        const t = document.getElementById('width-unit').value;
        (e.style.width = `${y.width.value}${t}`), b();
      }),
      null === (n = y.height) ||
        void 0 === n ||
        n.addEventListener('input', () => {
          const t = document.getElementById('height-unit').value;
          (e.style.height = `${y.height.value}${t}`), b();
        }),
      null === (o = y.backgroundColor) ||
        void 0 === o ||
        o.addEventListener('input', () => {
          (e.style.backgroundColor = y.backgroundColor.value),
            (document.getElementById('background-color-value').value =
              y.backgroundColor.value),
            b();
        }),
      null === (s = document.getElementById('background-color-value')) ||
        void 0 === s ||
        s.addEventListener('input', t => {
          const n = t.target;
          (e.style.backgroundColor = n.value),
            (document.getElementById('background-color').value = n.value),
            b();
        }),
      null === (i = y.margin) ||
        void 0 === i ||
        i.addEventListener('input', () => {
          const t = document.getElementById('margin-unit').value;
          (e.style.margin = `${y.margin.value}${t}`), b();
        }),
      null === (l = y.padding) ||
        void 0 === l ||
        l.addEventListener('input', () => {
          const t = document.getElementById('padding-unit').value;
          (e.style.padding = `${y.padding.value}${t}`), b();
        }),
      null === (a = y.alignment) ||
        void 0 === a ||
        a.addEventListener('change', () => {
          (e.style.textAlign = y.alignment.value), b();
        }),
      null === (r = y.fontSize) ||
        void 0 === r ||
        r.addEventListener('input', () => {
          const t = document.getElementById('font-size-unit').value;
          (e.style.fontSize = `${y.fontSize.value}${t}`), b();
        }),
      null === (d = y.textColor) ||
        void 0 === d ||
        d.addEventListener('input', () => {
          (e.style.color = y.textColor.value),
            (document.getElementById('text-color-value').value =
              y.textColor.value),
            b();
        }),
      null === (c = document.getElementById('text-color-value')) ||
        void 0 === c ||
        c.addEventListener('input', t => {
          const n = t.target;
          (e.style.color = n.value),
            (document.getElementById('text-color').value = n.value),
            b();
        }),
      null === (p = y.borderWidth) ||
        void 0 === p ||
        p.addEventListener('input', () => {
          const t = document.getElementById('border-width-unit').value;
          (e.style.borderWidth = `${y.borderWidth.value}${t}`), b();
        }),
      null === (u = y.borderStyle) ||
        void 0 === u ||
        u.addEventListener('change', () => {
          (e.style.borderStyle = y.borderStyle.value), b();
        }),
      null === (m = y.borderColor) ||
        void 0 === m ||
        m.addEventListener('input', () => {
          (e.style.borderColor = y.borderColor.value),
            (document.getElementById('border-color-value').value =
              y.borderColor.value),
            b();
        }),
      null === (h = document.getElementById('border-color-value')) ||
        void 0 === h ||
        h.addEventListener('input', t => {
          const n = t.target;
          (e.style.borderColor = n.value),
            (document.getElementById('border-color').value = n.value),
            b();
        }),
      null === (g = y.display) ||
        void 0 === g ||
        g.addEventListener('change', () => {
          (e.style.display = y.display.value), b();
        }),
      null === (v = y.fontFamily) ||
        void 0 === v ||
        v.addEventListener('change', () => {
          (e.style.fontFamily = y.fontFamily.value), b();
        });
  }
  static getLayersViewController() {
    return this.layersViewController;
  }
}
(x.selectedComponent = null),
  (x.customComponentsConfig = null),
  (x.basicComponentsConfig = null);
class E {
  constructor(e = 20) {
    this.cellSize = e;
  }
  initializeDropPreview(e) {
    const t = e.querySelector('.drop-preview');
    t && t.remove();
    const n = document.createElement('div');
    (n.className = 'drop-preview'),
      e.appendChild(n),
      e.addEventListener('dragover', t => {
        t.preventDefault(), this.showGridCornerHighlight(t, n, e);
      }),
      e.addEventListener('dragleave', () => {
        n.classList.remove('visible');
      });
  }
  showGridCornerHighlight(e, t, n) {
    const { gridX: o, gridY: s } = this.mousePositionAtGridCorner(e, n);
    (t.style.left = `${o}px`),
      (t.style.top = `${s}px`),
      (t.style.width = '20px'),
      (t.style.height = '20px'),
      t.classList.add('visible');
  }
  mousePositionAtGridCorner(e, t) {
    const n = t.getBoundingClientRect(),
      o = t.scrollLeft,
      s = t.scrollTop,
      i = e.clientX - n.left + o,
      l = e.clientY - n.top + s,
      a = 10 * Math.round(i / 10),
      r = 10 * Math.round(l / 10);
    return { gridX: Math.max(20, a - 20), gridY: Math.max(20, r - 20) };
  }
  getCellSize() {
    return this.cellSize;
  }
}
var L;
class k {
  static getComponents() {
    return L.components;
  }
  static setComponents(e) {
    L.components = e;
  }
  static init(t = null, n, o) {
    var s;
    this.editable = n;
    const i = o.components.find(e => 'table' === e.name),
      l =
        null === (s = null == i ? void 0 : i.attributes) || void 0 === s
          ? void 0
          : s.filter(e => 'Formula' == e.type);
    (this.tableAttributeConfig = l),
      i && i.attributes && i.attributes.length,
      (L.canvasElement = document.getElementById('canvas')),
      (L.sidebarElement = document.getElementById('sidebar')),
      window.addEventListener('table-design-change', () => {
        L.dispatchDesignChange();
      }),
      L.canvasElement.addEventListener('drop', L.onDrop.bind(L)),
      L.canvasElement.addEventListener('dragover', e => e.preventDefault()),
      L.canvasElement.classList.add('preview-desktop'),
      L.canvasElement.addEventListener('click', e => {
        const t = e.target;
        t && x.showSidebar(t.id);
      }),
      (L.canvasElement.style.position = 'relative'),
      (this.lastCanvasWidth = L.canvasElement.offsetWidth),
      (L.historyManager = new g(L.canvasElement)),
      (L.jsonStorage = new v()),
      (L.controlsManager = new y(L)),
      (L.gridManager = new E()),
      L.gridManager.initializeDropPreview(L.canvasElement);
    if ((new e(L.canvasElement, L.sidebarElement).enable(), t))
      L.restoreState(t);
    else {
      const e = L.jsonStorage.load();
      e && L.restoreState(e);
    }
  }
  static dispatchDesignChange() {
    if (L.canvasElement && this.editable) {
      const e = L.getState(),
        t = new CustomEvent('design-change', {
          detail: e,
          bubbles: !0,
          composed: !0,
        });
      L.canvasElement.dispatchEvent(t);
    }
  }
  static clearCanvas() {
    (L.canvasElement.innerHTML = ''),
      (L.components = []),
      L.historyManager.captureState(),
      L.gridManager.initializeDropPreview(L.canvasElement),
      L.gridManager.initializeDropPreview(L.canvasElement),
      L.dispatchDesignChange();
  }
  static getState() {
    return L.components.map(e => {
      const t = e.classList[0].split(/\d/)[0].replace('-component', ''),
        n = e.querySelector('img'),
        o = n ? n.src : null,
        s = e.querySelector('video'),
        i = s ? s.src : null,
        l = window.getComputedStyle(e),
        a = {};
      for (let e = 0; e < l.length; e++) {
        const t = l[e],
          n = l.getPropertyValue(t);
        n &&
          'initial' !== n &&
          'auto' !== n &&
          'none' !== n &&
          '' !== n &&
          (a[t] = n);
      }
      const r = {};
      Array.from(e.attributes)
        .filter(e => e.name.startsWith('data-'))
        .forEach(e => {
          r[e.name] = e.value;
        });
      let d = {};
      if (e.classList.contains('custom-component')) {
        const t = e.getAttribute('data-component-props');
        if (t)
          try {
            d = JSON.parse(t);
          } catch (e) {
            console.error('Error parsing data-component-props:', e);
          }
      }
      return {
        id: e.id,
        type: t,
        content: e.innerHTML,
        position: { x: e.offsetLeft, y: e.offsetTop },
        dimensions: { width: e.offsetWidth, height: e.offsetHeight },
        style: a,
        inlineStyle: e.getAttribute('style') || '',
        classes: Array.from(e.classList),
        dataAttributes: r,
        imageSrc: o,
        videoSrc: i,
        props: d,
      };
    });
  }
  static restoreState(e) {
    (L.canvasElement.innerHTML = ''),
      (L.components = []),
      e.forEach(e => {
        const t = e.dataAttributes['data-custom-settings'] || null,
          o = L.createComponent(e.type, t, e.content);
        if (o) {
          if (
            (e.classes.includes('custom-component') ||
              (o.innerHTML = e.content),
            (o.className = ''),
            e.classes.forEach(e => {
              o.classList.add(e);
            }),
            'video' === e.type && e.videoSrc)
          ) {
            const t = o.querySelector('video'),
              n = o.querySelector('.upload-text');
            (t.src = e.videoSrc),
              (t.style.display = 'block'),
              (n.style.display = 'none');
          }
          e.inlineStyle && o.setAttribute('style', e.inlineStyle),
            e.computedStyle &&
              Object.keys(e.computedStyle).forEach(t => {
                o.style.setProperty(t, e.computedStyle[t]);
              }),
            e.dataAttributes &&
              Object.entries(e.dataAttributes).forEach(([e, t]) => {
                o.setAttribute(e, t);
              }),
            L.controlsManager.addControlButtons(o),
            L.addDraggableListeners(o),
            o.classList.contains('container-component') &&
              l.restoreContainer(o),
            (o.classList.contains('twoCol-component') ||
              o.classList.contains('threeCol-component')) &&
              a.restoreColumn(o),
            'image' === e.type && n.restoreImageUpload(o, e.imageSrc),
            'table' === e.type && u.restore(o),
            'link' === e.type && m.restore(o),
            L.canvasElement.appendChild(o),
            L.components.push(o);
        }
      }),
      L.gridManager.initializeDropPreview(L.canvasElement);
  }
  static onDrop(e) {
    var t, n;
    if (
      (e.preventDefault(), e.target.classList.contains('container-component'))
    )
      return;
    const o =
      null === (t = e.dataTransfer) || void 0 === t
        ? void 0
        : t.getData('component-type');
    let s =
      null === (n = e.dataTransfer) || void 0 === n
        ? void 0
        : n.getData('custom-settings');
    if (!o) return;
    if (!s || '' === s.trim()) {
      if (
        document.querySelector(`[data-component="${o}"]`) &&
        window.customComponents &&
        window.customComponents[o]
      ) {
        const e = window.customComponents[o];
        e.settings && (s = JSON.stringify(e.settings));
      }
    }
    const { gridX: i, gridY: l } = this.gridManager.mousePositionAtGridCorner(
        e,
        L.canvasElement
      ),
      a = L.createComponent(o, s);
    if (a) {
      const t = L.generateUniqueClass(o);
      (a.id = t),
        a.classList.add(t),
        (a.style.position = 'absolute'),
        'container' === o || 'twoCol' === o || 'threeCol' === o
          ? (a.style.top = `${e.offsetY}px`)
          : ((a.style.position = 'absolute'),
            (a.style.left = `${i}px`),
            (a.style.top = `${l}px`)),
        L.components.push(a),
        L.canvasElement.appendChild(a),
        L.addDraggableListeners(a),
        L.historyManager.captureState();
    }
    L.dispatchDesignChange();
  }
  static reorderComponent(e, t) {
    if (
      e < 0 ||
      t < 0 ||
      e >= this.components.length ||
      t >= this.components.length
    )
      return void console.error('Invalid indices for reordering');
    const [n] = this.components.splice(e, 1);
    this.components.splice(t, 0, n);
    const o = document.getElementById('canvas-container');
    o &&
      ((o.innerHTML = ''),
      this.components.forEach(e => {
        o.appendChild(e);
      })),
      this.historyManager.captureState(),
      L.dispatchDesignChange();
  }
  static createComponent(e, t = null, n) {
    let o = null;
    const s = L.componentFactory[e];
    if (s) o = s();
    else {
      const t = document.querySelector(`[data-component='${e}']`),
        n = null == t ? void 0 : t.getAttribute('data-tag-name');
      if (!n) return null;
      (o = document.createElement(n)),
        o.classList.add(`${e}-component`, 'custom-component'),
        o.classList.add(`${e}-component`, 'custom-component'),
        o.setAttribute('data-component-type', e);
    }
    if (o) {
      new ResizeObserver(e => {
        L.dispatchDesignChange();
      }).observe(o),
        o.classList.add('editable-component'),
        'container' != e && o.classList.add('component-resizer');
      const t = L.generateUniqueClass(e);
      o.setAttribute('id', t),
        'image' === e
          ? o.setAttribute('contenteditable', 'false')
          : (o.setAttribute('contenteditable', 'true'),
            o.addEventListener('input', () => {
              L.historyManager.captureState();
            }));
      const n = document.createElement('span');
      (n.className = 'component-label'),
        (n.textContent = t),
        o.appendChild(n),
        L.controlsManager.addControlButtons(o);
    }
    return o;
  }
  static generateUniqueClass(e, t = !1, n = null) {
    if (t && n) {
      let t = L.components.find(e => e.classList.contains(n));
      if (!t && ((t = document.querySelector(`.${n}`)), !t))
        return `${n}-${e}1`;
      const o = Array.from(t.children),
        s = new RegExp(`${n}-${e}(\\d+)`);
      let i = 0;
      return (
        o.forEach(e => {
          e.classList.forEach(e => {
            const t = e.match(s);
            if (t) {
              const e = parseInt(t[1]);
              i = Math.max(i, e);
            }
          });
        }),
        `${n}-${e}${i + 1}`
      );
    }
    {
      const t = new RegExp(`${e}(\\d+)`);
      let n = 0;
      return (
        L.components.forEach(e => {
          e.classList.forEach(e => {
            const o = e.match(t);
            if (o) {
              const e = parseInt(o[1]);
              n = Math.max(n, e);
            }
          });
        }),
        `${e}${n + 1}`
      );
    }
  }
  static addDraggableListeners(e) {
    e.setAttribute('draggable', 'true'), (e.style.cursor = 'grab');
    let t = 0,
      n = 0,
      o = 0,
      s = 0,
      i = 0,
      l = 0;
    e.addEventListener('dragstart', a => {
      a.dataTransfer &&
        ((t = a.clientX),
        (n = a.clientY),
        (i = L.canvasElement.scrollLeft),
        (l = L.canvasElement.scrollTop),
        (o = parseFloat(e.style.left) || 0),
        (s = parseFloat(e.style.top) || 0),
        (a.dataTransfer.effectAllowed = 'move'),
        (e.style.cursor = 'grabbing'));
    }),
      e.addEventListener('dragend', a => {
        a.preventDefault();
        const r = L.canvasElement.scrollLeft,
          d = L.canvasElement.scrollTop,
          c = r - i,
          p = d - l,
          u = a.clientX - t,
          m = a.clientY - n;
        let h = o + u + c,
          g = s + m + p;
        const v = L.canvasElement.getBoundingClientRect(),
          y = a.clientX - v.left + L.canvasElement.scrollLeft,
          b = a.clientY - v.top + L.canvasElement.scrollTop,
          f = L.canvasElement.getBoundingClientRect(),
          w = t - f.left + i,
          C = n - f.top + l;
        (h = y + (o - w)), (g = b + (s - C));
        const x = e.getBoundingClientRect(),
          E = L.canvasElement.scrollWidth - x.width,
          k = L.canvasElement.scrollHeight - x.height;
        (h = Math.max(0, Math.min(h, E))),
          (g = Math.max(0, Math.min(g, k))),
          (e.style.left = `${h}px`),
          (e.style.top = `${g}px`),
          (e.style.cursor = 'grab'),
          L.historyManager.captureState(),
          L.dispatchDesignChange();
      });
  }
}
(L = k),
  (k.components = []),
  (k.componentFactory = {
    button: () => new s().create(),
    header: () => new i().create(),
    image: () => new n().create(),
    video: () => new o(() => L.historyManager.captureState()).create(),
    table: () => new u().create(2, 2, void 0, L.tableAttributeConfig),
    text: () => new t().create(),
    container: () => new l().create(),
    twoCol: () => new r().create(),
    threeCol: () => new d().create(),
    landingpage: () => new h().create(),
    link: () => new m().create(),
  });
const S = document.getElementById('canvas'),
  M = new (class {
    constructor() {
      (this.selectedElement = null),
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    deleteSelectedElement() {
      this.selectedElement &&
        (this.selectedElement.remove(), (this.selectedElement = null));
    }
    handleKeydown(e) {
      'Delete' === e.key && this.deleteSelectedElement();
    }
    selectElement(e) {
      this.selectedElement && this.selectedElement.classList.remove('selected'),
        (this.selectedElement = e),
        this.selectedElement.classList.add('selected');
    }
  })();
S &&
  S.addEventListener('click', e => {
    const t = e.target;
    t !== S && M.selectElement(t);
  });
class B {
  constructor(e) {
    this.canvas = e;
  }
  init() {
    document
      .getElementById('sidebar')
      .addEventListener('click', this.onOptionClick.bind(this));
  }
  onOptionClick(e) {
    const t = e.target;
    t.classList.contains('config-option') && this.applyConfig(t.dataset.option);
  }
  applyConfig(e) {
    const t = document.querySelector('.selected');
    if (t)
      switch (e) {
        case 'color':
          t.style.color = 'blue';
          break;
        case 'padding':
          t.style.padding = '10px';
      }
  }
}
class H {
  constructor(e) {
    (this.canvas = e),
      (this.styleElement = document.createElement('style')),
      document.head.appendChild(this.styleElement);
  }
  generateHTML() {
    const e = document.getElementById('canvas');
    if (!e)
      return console.warn('Canvas element not found!'), this.getBaseHTML();
    const t = e.cloneNode(!0);
    return this.cleanupElements(t), this.getBaseHTML(t.innerHTML);
  }
  getBaseHTML(e = 'children') {
    return `<!DOCTYPE html>\n<html>\n<head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Page Builder</title>\n    <style>\n      ${this.generateCSS()}\n    </style>\n </head>\n        <body>\n            <div id="canvas" class="home">\n            ${e}\n            </div>\n        </body>\n      </html>`;
  }
  cleanupElements(e) {
    const t = ['contenteditable', 'draggable'],
      n = [
        'component-controls',
        'delete-icon',
        'component-label',
        'column-label',
        'resizers',
        'resizer',
        'upload-btn',
        'component-resizer',
        'drop-preview',
        'edit-link-form',
        'edit-link',
      ];
    Array.from(e.children).forEach(e => {
      const o = e;
      t.forEach(e => {
        o.removeAttribute(e);
      }),
        n.forEach(e => {
          o.classList.remove(e);
        });
      o
        .querySelectorAll(
          '.component-controls, .delete-icon, .component-label, .column-label, .resizers, .resizer, .drop-preview, .upload-btn, .edit-link, .edit-link-form, input'
        )
        .forEach(e => e.remove()),
        o.children.length > 0 && this.cleanupElements(o);
    });
  }
  generateCSS() {
    const e = document.getElementById('canvas');
    if (!e) return '';
    const t = e
        ? window.getComputedStyle(e).getPropertyValue('background-color')
        : 'rgb(255, 255, 255)',
      n = [],
      o = new Set();
    n.push(
      `\n      body, html {\n          margin: 0;\n          padding: 0;\n          width: 100%;\n          height: 100%;\n          box-sizing: border-box;\n      }\n        #canvas.home {\n      position: relative;\n      display: block;\n      width: 100%;\n      min-height: 100vh;\n      background-color: ${t};\n      margin: 0;\n      overflow: visible;\n  }\n\n      table {\n          border-collapse: collapse ;\n\n      }\n          .editable-component{\n          border:none !important;\n          box-shadow:none !important;\n          }\n\n      `
    );
    const s = e.querySelectorAll('*'),
      i = [
        'component-controls',
        'delete-icon',
        'component-label',
        'resizers',
        'resizer',
        'upload-btn',
        'edit-link-form',
        'edit-link',
      ];
    return (
      s.forEach((e, t) => {
        if (i.some(t => e.classList.contains(t))) return;
        const s = window.getComputedStyle(e),
          l = [];
        if (
          e instanceof SVGElement ||
          (e.closest('svg') &&
            ['path', 'circle', 'rect', 'polygon'].includes(
              e.tagName.toLowerCase()
            ))
        )
          return void this.handleSVGElement(e, l, s, t, n, o);
        for (let e = 0; e < s.length; e++) {
          const t = s[e],
            n = s.getPropertyValue(t);
          'resize' !== t &&
            n &&
            'initial' !== n &&
            'auto' !== n &&
            'none' !== n &&
            '' !== n &&
            l.push(`${t}: ${n};`);
        }
        const a = this.generateUniqueSelector(e);
        !o.has(a) &&
          l.length > 0 &&
          (o.add(a),
          n.push(`\n        ${a} {\n          ${l.join('\n  ')}\n        }`));
      }),
      n.join('\n')
    );
  }
  handleSVGElement(e, t, n, o, s, i) {
    if (
      'path' === e.tagName.toLowerCase() ||
      'circle' === e.tagName.toLowerCase() ||
      'rect' === e.tagName.toLowerCase() ||
      'polygon' === e.tagName.toLowerCase()
    ) {
      const i = this.generateSVGSpecificSelector(e, o);
      [
        'fill',
        'stroke',
        'stroke-width',
        'opacity',
        'fill-opacity',
        'stroke-opacity',
      ].forEach(e => {
        const o = n.getPropertyValue(e);
        o &&
          'none' !== o &&
          '' !== o &&
          'initial' !== o &&
          t.push(`${e}: ${o} !important;`);
      }),
        t.length > 0 &&
          s.push(`\n        ${i} {\n          ${t.join('\n  ')}\n        }`);
    } else {
      for (let e = 0; e < n.length; e++) {
        const o = n[e],
          s = n.getPropertyValue(o);
        'resize' !== o &&
          s &&
          'initial' !== s &&
          'auto' !== s &&
          'none' !== s &&
          '' !== s &&
          t.push(`${o}: ${s};`);
      }
      const o = this.generateUniqueSelector(e);
      !i.has(o) &&
        t.length > 0 &&
        (i.add(o),
        s.push(`\n        ${o} {\n          ${t.join('\n  ')}\n        }`));
    }
  }
  generateSVGSpecificSelector(e, t) {
    const n = e.closest('svg'),
      o = null == n ? void 0 : n.parentElement;
    let s = '';
    if (o)
      if (o.id) s += `#${o.id} `;
      else if (o.className) {
        const e = o.className
          .toString()
          .split(' ')
          .filter(
            e =>
              !e.includes('component-') &&
              !e.includes('delete-') &&
              !e.includes('resizer')
          )
          .join('.');
        e && (s += `.${e} `);
      }
    n &&
      (n.className.baseVal
        ? (s += `svg.${n.className.baseVal.split(' ').join('.')} `)
        : (s += 'svg '));
    const i = e.parentElement;
    if (i) {
      const t = Array.from(i.children)
        .filter(t => t.tagName === e.tagName)
        .indexOf(e);
      s += `${e.tagName.toLowerCase()}:nth-of-type(${t + 1})`;
    } else s += `${e.tagName.toLowerCase()}`;
    return s || `${e.tagName.toLowerCase()}-${t}`;
  }
  generateUniqueSelector(e) {
    if (e.id) return `#${e.id}`;
    if (e instanceof SVGElement) {
      const t = e.getAttribute('class');
      if (t) return `.${t.toString().split(' ').join('.')}`;
    }
    if (e.className) return `.${e.className.toString().split(' ').join('.')}`;
    const t = [];
    let n = e;
    for (; n && 'body' !== n.tagName.toLowerCase() && !n.id; ) {
      const e = n.parentElement;
      if (!e) break;
      const o = Array.from(e.children).filter(e => e.tagName === n.tagName);
      let s = n.tagName.toLowerCase();
      if (o.length > 1) {
        s += `:nth-of-type(${o.indexOf(n) + 1})`;
      }
      const i = Array.from(n.classList).filter(
        e =>
          !e.includes('component-') &&
          !e.includes('delete-') &&
          !e.includes('resizer')
      );
      i.length > 0 && (s += `.${i.join('.')}`), t.unshift(s), (n = e);
    }
    return (
      n && (n.id ? t.unshift(`#${n.id}`) : t.unshift(n.tagName.toLowerCase())),
      t.join(' > ')
    );
  }
  applyCSS(e) {
    this.styleElement.textContent = e;
  }
}
function $(e) {
  const t = e => new TextEncoder().encode(e),
    n = [];
  let o = 0;
  const s = [];
  e.forEach(e => {
    const i = t(e.name),
      l = t(e.content),
      a = (function (e) {
        let t = 4294967295;
        for (let n = 0; n < e.length; n++) {
          t ^= e[n];
          for (let e = 0; e < 8; e++) t = (t >>> 1) ^ (1 & t ? 3988292384 : 0);
        }
        return 4294967295 ^ t;
      })(l),
      r = ((e, t, n) => {
        const o = new Uint8Array(30 + e.length);
        return (
          o.set([80, 75, 3, 4]),
          o.set([20, 0], 4),
          o.set([0, 0], 6),
          o.set([0, 0], 8),
          o.set([0, 0], 10),
          o.set([0, 0], 12),
          o.set(
            [255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255],
            14
          ),
          o.set(
            [
              255 & t.length,
              (t.length >> 8) & 255,
              (t.length >> 16) & 255,
              (t.length >> 24) & 255,
            ],
            18
          ),
          o.set(
            [
              255 & t.length,
              (t.length >> 8) & 255,
              (t.length >> 16) & 255,
              (t.length >> 24) & 255,
            ],
            22
          ),
          o.set([255 & e.length, (e.length >> 8) & 255], 26),
          o.set([0, 0], 28),
          o.set(e, 30),
          o
        );
      })(i, l, a);
    n.push(r), n.push(l);
    const d = ((e, t, n, o) => {
      const s = new Uint8Array(46 + e.length);
      return (
        s.set([80, 75, 1, 2]),
        s.set([20, 0], 4),
        s.set([20, 0], 6),
        s.set([0, 0], 8),
        s.set([0, 0], 10),
        s.set([0, 0], 12),
        s.set([0, 0], 14),
        s.set([255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255], 16),
        s.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          20
        ),
        s.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          24
        ),
        s.set([255 & e.length, (e.length >> 8) & 255], 28),
        s.set([0, 0], 30),
        s.set([0, 0], 32),
        s.set([0, 0], 34),
        s.set([0, 0], 36),
        s.set([0, 0, 0, 0], 38),
        s.set([255 & o, (o >> 8) & 255, (o >> 16) & 255, (o >> 24) & 255], 42),
        s.set(e, 46),
        s
      );
    })(i, l, a, o);
    s.push(d), (o += r.length + l.length);
  }),
    n.push(...s);
  const i = s.reduce((e, t) => e + t.length, 0),
    l = ((e, t, n) => {
      const o = new Uint8Array(22);
      return (
        o.set([80, 75, 5, 6]),
        o.set([0, 0], 4),
        o.set([0, 0], 6),
        o.set([255 & e, (e >> 8) & 255], 8),
        o.set([255 & e, (e >> 8) & 255], 10),
        o.set([255 & t, (t >> 8) & 255, (t >> 16) & 255, (t >> 24) & 255], 12),
        o.set([255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255], 16),
        o.set([0, 0], 20),
        o
      );
    })(e.length, i, o);
  n.push(l);
  const a = new Uint8Array(n.reduce((e, t) => e.concat(Array.from(t)), []));
  return new Blob([a], { type: 'application/zip' });
}
class I {
  static init() {
    document.addEventListener('keydown', this.handleKeydown);
  }
  static handleKeydown(e) {
    if (e.ctrlKey || e.metaKey)
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault(), k.historyManager.undo();
          break;
        case 'y':
          e.preventDefault(), k.historyManager.redo();
      }
  }
}
class z {
  setPreviewMode(e) {
    const t = document.getElementById('canvas');
    t.classList.forEach(e => {
      e.startsWith('preview-') && t.classList.remove(e);
    }),
      t.classList.add(`preview-${e}`);
  }
}
class T {
  constructor(
    e = { Basic: { components: [] }, Extra: [], Custom: {} },
    t = null,
    n = !0,
    o
  ) {
    (this.dynamicComponents = e),
      (this.initialDesign = t),
      (this.canvas = new k()),
      (this.sidebar = new B(this.canvas)),
      (this.htmlGenerator = new H(this.canvas)),
      (this.jsonStorage = new v()),
      (this.previewPanel = new z()),
      (this.editable = n),
      (this.brandTitle = o),
      this.initializeEventListeners();
  }
  static resetHeaderFlag() {
    T.headerInitialized = !1;
  }
  initializeEventListeners() {
    (this.canvas = new k()),
      (this.sidebar = new B(this.canvas)),
      (this.htmlGenerator = new H(this.canvas)),
      (this.jsonStorage = new v()),
      (this.previewPanel = new z()),
      this.setupInitialComponents(),
      this.setupSaveButton(),
      this.setupResetButton(),
      this.handleExport(),
      this.setupExportHTMLButton(),
      this.setupExportPDFButton(),
      this.setupViewButton(),
      this.setupPreviewModeButtons(),
      this.setupUndoRedoButtons();
  }
  setupInitialComponents() {
    !(function (e, t) {
      (!e ||
        (0 === e.Basic.components.length &&
          0 === e.Extra.length &&
          0 === Object.keys(e.Custom).length)) &&
        (e = {
          Basic: {
            components: [
              { name: 'button' },
              { name: 'header' },
              { name: 'text' },
              { name: 'image' },
              { name: 'video' },
              { name: 'container' },
              { name: 'twoCol' },
              { name: 'threeCol' },
              { name: 'table' },
              { name: 'link' },
            ],
          },
          Extra: ['landingpage'],
          Custom: {},
        });
      const n = document.getElementById('sidebar');
      if ((n.classList.add('visible'), !n))
        return void console.error('Sidebar element not found');
      !1 === t && (n.style.display = 'none');
      const o = {
          button: C.button,
          header: C.header,
          image: C.image,
          video: C.video,
          text: C.text,
          container: C.container,
          twoCol: C.twocol,
          threeCol: C.threecol,
          table: C.table,
          landingpage: C.landing,
          link: C.hyperlink,
        },
        s = {
          button: 'Button',
          header: 'Header',
          image: 'Image',
          video: 'Link Video',
          text: 'Text',
          container: 'Container',
          twoCol: 'Two Column Layout',
          threeCol: 'Three Column Layout',
          table: 'Table',
          landingpage: 'Landing Page Template',
          link: 'Link',
        },
        i = document.createElement('div');
      i.classList.add('menu'),
        Object.entries(e).forEach(([e, t]) => {
          const n = document.createElement('div');
          n.classList.add('category');
          const l = document.createElement('h4');
          l.classList.add('categoryHeading'),
            (l.innerHTML = e),
            n.prepend(l),
            Array.isArray(t)
              ? t.forEach(e => {
                  const t = document.createElement('div');
                  t.classList.add('draggable'),
                    (t.id = e),
                    t.setAttribute('draggable', 'true'),
                    t.setAttribute('data-component', e);
                  const i = s[e] || `Drag to add ${e}`;
                  if ((t.setAttribute('title', i), o[e])) {
                    t.innerHTML = ` ${o[e]}\n          <div class="drag-text">${e}</div>`;
                    const n = t.querySelector('svg');
                    n && n.classList.add('component-icon');
                  } else console.warn(`Icon not found for component: ${i}`);
                  n.appendChild(t);
                })
              : 'Basic' === e && 'object' == typeof t
                ? t.components.forEach(e => {
                    let t;
                    'object' == typeof e &&
                      null !== e &&
                      'name' in e &&
                      (t = e.name);
                    const i = document.createElement('div');
                    i.classList.add('draggable'),
                      (i.id = t),
                      i.setAttribute('draggable', 'true'),
                      i.setAttribute('data-component', t);
                    const l = s[t] || `Drag to add ${t}`;
                    if ((i.setAttribute('title', l), o[t])) {
                      i.innerHTML = ` ${o[t]}\n          <div class="drag-text">${t}</div>`;
                      const e = i.querySelector('svg');
                      e && e.classList.add('component-icon');
                    } else console.warn(`Icon not found for component: ${l}`);
                    n.appendChild(i);
                  })
                : 'Custom' === e &&
                  'object' == typeof t &&
                  Object.entries(t).forEach(([e, t]) => {
                    const o = document.createElement('div');
                    if (
                      (o.classList.add('draggable', 'custom-component'),
                      (o.id = e),
                      o.setAttribute('draggable', 'true'),
                      o.setAttribute('data-component', e),
                      'string' == typeof t)
                    ) {
                      o.setAttribute('data-tag-name', t),
                        o.setAttribute('title', `Drag to add ${e}`);
                      const n = document.createElement('span');
                      n.classList.add('custom-component-letter'),
                        (n.textContent = e.charAt(0).toUpperCase()),
                        o.appendChild(n);
                    } else {
                      const {
                        component: n,
                        svg: s,
                        title: i,
                        settingsComponent: l,
                      } = t;
                      if (
                        (o.setAttribute('data-tag-name', n),
                        o.setAttribute('title', i || `Drag to add ${e}`),
                        l &&
                          o.setAttribute(
                            'data-custom-settings',
                            JSON.stringify(l)
                          ),
                        s)
                      ) {
                        o.innerHTML =
                          o.innerHTML = ` ${s}\n          <div class="drag-text">${i}</div>`;
                        const e = o.querySelector('svg');
                        e && e.classList.add('component-icon');
                      } else {
                        const t = document.createElement('span');
                        t.classList.add('custom-component-letter'),
                          (t.textContent = e.charAt(0).toUpperCase()),
                          o.appendChild(t);
                      }
                    }
                    n.appendChild(o);
                  }),
            i.appendChild(n);
        }),
        n.appendChild(i);
    })(this.dynamicComponents, this.editable),
      k.init(this.initialDesign, this.editable, this.dynamicComponents.Basic),
      this.sidebar.init(),
      I.init(),
      x.init(
        this.dynamicComponents.Custom,
        this.editable,
        this.dynamicComponents.Basic
      ),
      this.createHeaderIfNeeded();
  }
  createHeaderIfNeeded() {
    if (document.getElementById('page-builder-header'))
      T.headerInitialized = !0;
    else {
      const e = document.getElementById('app');
      if (e && e.parentNode) {
        const t = document.createElement('header');
        (t.id = 'page-builder-header'),
          t.appendChild(
            (function (e, t = 'Page Builder') {
              const n = document.createElement('nav');
              n.id = 'preview-navbar';
              const o = {
                  desktop: C.desktop,
                  tablet: C.tablet,
                  mobile: C.mobile,
                  save: C.save,
                  export: C.code,
                  view: C.view,
                  undo: C.undo,
                  redo: C.redo,
                  reset: C.reset,
                  menu: C.customizationMenu,
                  sidebarMenu: C.sidebarMenu,
                },
                s = e
                  ? [
                      {
                        id: 'preview-desktop',
                        icon: o.desktop,
                        title: 'Preview in Desktop',
                      },
                      {
                        id: 'preview-tablet',
                        icon: o.tablet,
                        title: 'Preview in Tablet',
                      },
                      {
                        id: 'preview-mobile',
                        icon: o.mobile,
                        title: 'Preview in Mobile',
                      },
                      { id: 'undo-btn', icon: o.undo, title: 'Undo button' },
                      { id: 'redo-btn', icon: o.redo, title: 'Redo button' },
                      {
                        id: 'sidebar-menu',
                        icon: o.sidebarMenu,
                        title: 'Sidebar Menu',
                      },
                    ]
                  : [
                      {
                        id: 'preview-desktop',
                        icon: o.desktop,
                        title: 'Preview in Desktop',
                      },
                      {
                        id: 'preview-tablet',
                        icon: o.tablet,
                        title: 'Preview in Tablet',
                      },
                      {
                        id: 'preview-mobile',
                        icon: o.mobile,
                        title: 'Preview in Mobile',
                      },
                    ],
                i =
                  !0 === e || null === e
                    ? [
                        { id: 'view-btn', icon: o.view, title: 'View' },
                        { id: 'save-btn', icon: o.save, title: 'Save Layout' },
                        { id: 'reset-btn', icon: o.reset, title: 'Reset' },
                        { id: 'export-btn', icon: o.export, title: 'Export' },
                        {
                          id: 'menu-btn',
                          icon: o.menu,
                          title: 'Customization Menu',
                        },
                      ]
                    : [
                        { id: 'view-btn', icon: o.view, title: 'View' },
                        { id: 'export-btn', icon: o.export, title: 'Export' },
                      ],
                l = document.createElement('div');
              l.classList.add('left-buttons'),
                s.forEach(({ id: e, icon: t, title: n }) => {
                  const o = document.createElement('button');
                  (o.id = e),
                    o.classList.add('preview-btn'),
                    (o.title = n),
                    (o.style.color = '#000'),
                    (o.innerHTML = t);
                  const s = o.querySelector('svg');
                  s && s.classList.add('nav-icon'),
                    'sidebar-menu' === o.id &&
                      ((o.style.backgroundColor = '#e2e8f0'),
                      (o.style.borderColor = '#cbd5e1'),
                      (o.onclick = () => {
                        const e = document.getElementById('sidebar'),
                          t =
                            null == e
                              ? void 0
                              : e.classList.contains('visible');
                        e &&
                          (t
                            ? (e.classList.remove('visible'),
                              (e.style.display = 'none'),
                              (o.style.backgroundColor = '#ffffff'),
                              (o.style.border = 'none'),
                              (o.style.border = '1px solid #ffffff'))
                            : ((e.style.display = 'block'),
                              e.classList.add('visible'),
                              (o.style.backgroundColor = '#e2e8f0'),
                              (o.style.borderColor = '#cbd5e1')));
                      })),
                    l.appendChild(o);
                });
              const a = document.createElement('div');
              a.classList.add('center-text'), (a.textContent = t);
              const r = document.createElement('div');
              return (
                r.classList.add('right-buttons'),
                i.forEach(({ id: e, icon: t, title: n }) => {
                  const o = document.createElement('button');
                  (o.id = e),
                    o.classList.add('preview-btn'),
                    (o.title = n),
                    (o.style.color = '#000'),
                    (o.innerHTML = t);
                  const s = o.querySelector('svg');
                  s && s.classList.add('nav-icon'),
                    r.appendChild(o),
                    'menu-btn' === e &&
                      o &&
                      (o.onclick = () => {
                        const e = document.getElementById('customization'),
                          t = null == e ? void 0 : e.classList,
                          n = null == t ? void 0 : t.contains('visible');
                        e &&
                          (n
                            ? (e.classList.remove('visible'),
                              (e.style.display = 'none'),
                              (o.style.backgroundColor = '#ffffff'),
                              (o.style.border = 'none'),
                              (o.style.border = '1px solid #ffffff'))
                            : ((e.style.display = 'block'),
                              e.classList.add('visible'),
                              (o.style.backgroundColor = '#e2e8f0'),
                              (o.style.borderColor = '#cbd5e1')));
                      });
                }),
                n.appendChild(l),
                n.appendChild(a),
                n.appendChild(r),
                n
              );
            })(this.editable, this.brandTitle)
          ),
          e.parentNode.insertBefore(t, e),
          (T.headerInitialized = !0);
      } else console.error('Error: #app not found in the DOM');
    }
  }
  setupSaveButton() {
    const e = document.getElementById('save-btn');
    e &&
      e.addEventListener('click', () => {
        const e = k.getState();
        this.jsonStorage.save(e), b('Saving progress...');
      });
  }
  setupResetButton() {
    const e = document.getElementById('reset-btn');
    e &&
      e.addEventListener('click', () => {
        !(function (e, t, n) {
          const o = document.getElementById('dialog'),
            s = document.getElementById('dialog-yes'),
            i = document.getElementById('dialog-no'),
            l = document.getElementById('dialog-message');
          l && (l.innerHTML = e),
            null == o || o.classList.remove('hidden'),
            null == s ||
              s.addEventListener('click', () => {
                t(), null == o || o.classList.add('hidden');
              }),
            null == i ||
              i.addEventListener('click', () => {
                n(), null == o || o.classList.add('hidden');
              });
        })(
          'Are you sure you want to reset the layout?',
          () => {
            this.jsonStorage.remove(),
              k.clearCanvas(),
              b('The saved layout has been successfully reset.');
          },
          () => {
            console.log('Layout reset canceled.');
          }
        );
      });
  }
  handleExport() {
    const e = document.getElementById('export-btn');
    if (e) {
      const t = document.createElement('div');
      t.classList.add('export-dropdown');
      const n = document.createElement('div');
      (n.textContent = 'HTML'),
        n.classList.add('export-option'),
        (n.id = 'export-html-btn');
      const o = document.createElement('div');
      (o.textContent = 'PDF'),
        o.classList.add('export-option'),
        (o.id = 'export-pdf-btn'),
        t.appendChild(n),
        t.appendChild(o),
        e.appendChild(t),
        e.addEventListener('click', e => {
          e.stopPropagation(), t.classList.toggle('visible');
        }),
        document.addEventListener('click', n => {
          e.contains(n.target) || t.classList.remove('visible');
        });
    }
  }
  setupExportHTMLButton() {
    const e = document.getElementById('export-html-btn');
    e &&
      e.addEventListener('click', () => {
        const e = new H(new k()),
          t = e.generateHTML(),
          n = e.generateCSS(),
          o = (function (e) {
            return e
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(
                /\s([a-zA-Z-]+)="(.*?)"/g,
                (e, t, n) =>
                  ` ${t}=<span class="attribute">"</span><span class="string">${n}</span><span class="attribute">"</span>`
              )
              .replace(
                /(&lt;\/?[a-zA-Z-]+&gt;)/g,
                '<span class="tag">$1</span>'
              );
          })(t),
          s = (function (e) {
            return e
              .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="property">$1</span>')
              .replace(/(:\s*[^;]+;)/g, '<span class="value">$1</span>')
              .replace(/({|})/g, '<span class="bracket">$1</span>');
          })(n),
          i = this.createExportModal(o, s, t, n);
        document.body.appendChild(i), i.classList.add('show');
      });
  }
  setupExportPDFButton() {
    const e = document.getElementById('export-pdf-btn');
    e &&
      e.addEventListener('click', () => {
        const e = new H(new k()),
          t = e.generateHTML(),
          n = e.generateCSS(),
          o = window.open('', '_blank');
        if (o) {
          const e = `\n            <html>\n              <head>\n                <title>Export PDF</title>\n                <style>\n                  ${n} \n                  body {\n                    margin: 0;\n                    padding: 20px;\n                    font-family: Arial, sans-serif;\n                  }\n                  @media print {\n                    /* Ensure print styles are applied */\n                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n                    \n                    /* Remove browser headers and footers */\n                    @page {\n                      size: auto;\n                      margin: 0mm;  /* Remove default margins */\n                    }\n                    \n                    /* For Chrome/Safari */\n                    @page { margin: 0; }\n                    html { margin: 0; }\n                  }\n                </style>\n              </head>\n              <body>\n                ${t} \x3c!-- Generated HTML --\x3e\n              </body>\n            </html>\n          `;
          o.document.write(e),
            o.document.close(),
            setTimeout(() => {
              o.print(), o.close();
            }, 500);
        }
      });
  }
  createExportModal(e, t, n, o) {
    const s = document.createElement('div');
    (s.id = 'export-dialog'), s.classList.add('modal');
    const i = document.createElement('div');
    i.classList.add('modal-content');
    const l = this.createCloseButton(s);
    i.appendChild(l);
    const a = this.createCodeSection('HTML', e),
      r = this.createCodeSection('CSS', t),
      d = this.createExportToZipButton(n, o);
    i.appendChild(a), i.appendChild(r), i.appendChild(d);
    const c = document.createElement('div');
    return (
      c.classList.add('button-wrapper'),
      c.appendChild(i),
      s.appendChild(c),
      this.setupModalEventListeners(s),
      s
    );
  }
  createCloseButton(e) {
    const t = document.createElement('button');
    return (
      (t.textContent = '×'),
      t.classList.add('close-btn'),
      t.addEventListener('click', () => this.closeModal(e)),
      t
    );
  }
  createCodeSection(e, t) {
    const n = document.createElement('div');
    n.classList.add('modal-section');
    const o = document.createElement('h2');
    o.textContent = e;
    const s = document.createElement('div');
    return (
      s.classList.add('code-block'),
      s.setAttribute('contenteditable', 'true'),
      (s.innerHTML = t),
      n.appendChild(o),
      n.appendChild(s),
      n
    );
  }
  createExportToZipButton(e, t) {
    const n = document.createElement('button');
    return (
      (n.textContent = 'Export to ZIP'),
      n.classList.add('export-btn'),
      n.addEventListener('click', () => {
        const n = $([
            { name: 'index.html', content: e },
            { name: 'styles.css', content: t },
          ]),
          o = document.createElement('a');
        (o.href = URL.createObjectURL(n)),
          (o.download = 'exported-files.zip'),
          o.click(),
          URL.revokeObjectURL(o.href);
      }),
      n
    );
  }
  setupModalEventListeners(e) {
    e.addEventListener('click', t => {
      t.target === e && this.closeModal(e);
    }),
      document.addEventListener('keydown', t => {
        'Escape' === t.key && this.closeModal(e);
      });
  }
  closeModal(e) {
    e.classList.remove('show'),
      e.classList.add('hide'),
      setTimeout(() => e.remove(), 300);
  }
  setupViewButton() {
    const e = document.getElementById('view-btn');
    e &&
      e.addEventListener('click', () => {
        const e = this.htmlGenerator.generateHTML(),
          t = this.createFullScreenPreviewModal(e);
        document.body.appendChild(t);
      });
  }
  createFullScreenPreviewModal(e) {
    const t = document.createElement('div');
    (t.id = 'preview-modal'),
      (t.style.cssText =
        '\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100vw;\n      height: 100vh;\n      background: #f5f5f5;\n      z-index: 10000;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: flex-start;\n      padding: 10px;\n    ');
    const n = document.createElement('iframe');
    (n.id = 'preview-iframe'),
      (n.style.cssText =
        '\n      width: 97%;\n      height: 90%;\n      border: none;\n      background: #fff;\n      margin-right: 20px;\n    '),
      (n.srcdoc = e),
      t.appendChild(n);
    const o = this.createPreviewCloseButton(t);
    t.appendChild(o);
    const s = this.createResponsivenessControls(n);
    return t.insertBefore(s, n), t;
  }
  createPreviewCloseButton(e) {
    const t = document.createElement('button');
    (t.id = 'close-modal-btn'),
      (t.textContent = '✕'),
      (t.style.cssText =
        '\n      position: absolute;\n      top: 10px;\n      right: 20px;\n      font-size: 20px;\n      border: none;\n      background: none;\n      cursor: pointer;\n    ');
    const n = () => {
      setTimeout(() => e.remove(), 300),
        document.removeEventListener('keydown', o);
    };
    t.addEventListener('click', n);
    const o = e => {
      'Escape' === e.key && n();
    };
    return document.addEventListener('keydown', o), t;
  }
  createResponsivenessControls(e) {
    const t = document.createElement('div');
    t.style.cssText =
      '\n      display: flex;\n      gap: 10px;\n      margin-bottom: 10px;\n    ';
    return (
      [
        { icon: C.mobile, title: 'Desktop', width: '375px', height: '100%' },
        { icon: C.tablet, title: 'Tablet', width: '768px', height: '100%' },
        { icon: C.desktop, title: 'Mobile', width: '97%', height: '100%' },
      ].forEach(n => {
        const o = document.createElement('button');
        (o.style.cssText =
          '\n        padding: 5px;\n        border: none;\n        background: none;\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      '),
          (o.title = n.title);
        const s = document.createElement('div');
        s.innerHTML = n.icon;
        const i = s.querySelector('svg');
        i &&
          ((i.style.width = '24px'),
          (i.style.height = '24px'),
          i.classList.add('component-icon')),
          o.appendChild(s),
          o.addEventListener('click', () => {
            (e.style.width = n.width),
              (e.style.height = n.height),
              (e.style.transition = 'all 0.5s ease');
          }),
          t.appendChild(o);
      }),
      t
    );
  }
  setupPreviewModeButtons() {
    const e = document.getElementById('preview-desktop'),
      t = document.getElementById('preview-tablet'),
      n = document.getElementById('preview-mobile');
    e &&
      e.addEventListener('click', () => {
        this.previewPanel.setPreviewMode('desktop');
      }),
      t &&
        t.addEventListener('click', () => {
          this.previewPanel.setPreviewMode('tablet');
        }),
      n &&
        n.addEventListener('click', () => {
          this.previewPanel.setPreviewMode('mobile');
        });
  }
  setupUndoRedoButtons() {
    const e = document.getElementById('undo-btn'),
      t = document.getElementById('redo-btn');
    e &&
      e.addEventListener('click', () => {
        k.historyManager.undo();
      }),
      t &&
        t.addEventListener('click', () => {
          k.historyManager.redo();
        });
  }
}
T.headerInitialized = !1;
const V = new T();
(exports.PageBuilder = T), (exports.PageBuilderCore = V);

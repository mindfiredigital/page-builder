'use strict';
class e {
  constructor(e, t) {
    (this.canvas = e), (this.sidebar = t);
  }
  enable() {
    this.sidebar.querySelectorAll('.draggable').forEach(e => {
      e.addEventListener('dragstart', t => {
        var n;
        const s = t;
        console.log(`Dragging component: ${e.id}`),
          null === (n = s.dataTransfer) ||
            void 0 === n ||
            n.setData('component-type', e.id);
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
    const s = `image-container-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    (t.id = s),
      (t.style.width = '300px'),
      (t.style.height = '300px'),
      (t.style.position = 'relative'),
      (t.style.backgroundColor = e ? 'transparent' : '#f0f0f0'),
      (t.style.display = 'flex'),
      (t.style.border = 'none'),
      (t.style.alignItems = 'center'),
      (t.style.justifyContent = 'center');
    const o = document.createElement('div');
    (o.style.color = '#666666'),
      (o.style.border = 'none'),
      (o.style.display = e ? 'none' : 'block');
    const i = document.createElement('input');
    (i.type = 'file'),
      (i.accept = 'image/*'),
      (i.style.display = 'none'),
      i.addEventListener('change', e => n.handleFileChange(e, t, o));
    const r = document.createElement('button');
    r.classList.add('upload-btn'),
      (r.innerHTML = '🖊️'),
      (r.style.position = 'absolute'),
      (r.style.padding = '8px'),
      (r.style.background = 'transparent'),
      (r.style.border = 'none'),
      (r.style.cursor = 'pointer'),
      (r.style.opacity = '0'),
      (r.style.transition = 'opacity 0.2s'),
      (r.style.left = '50%'),
      (r.style.top = '50%'),
      (r.style.transform = 'translate(-50%, -50%)'),
      (r.style.fontSize = '24px'),
      r.addEventListener('click', () => i.click());
    const l = document.createElement('img'),
      a = `${s}-img`;
    return (
      (l.id = a),
      (l.style.width = '100%'),
      (l.style.height = '100%'),
      (l.style.objectFit = 'contain'),
      (l.style.border = 'none'),
      (l.style.display = 'none'),
      e && ((l.src = e), (l.style.display = 'block')),
      t.addEventListener('mouseenter', () => {
        r.style.opacity = '1';
      }),
      t.addEventListener('mouseleave', () => {
        r.style.opacity = '0';
      }),
      t.appendChild(o),
      t.appendChild(i),
      t.appendChild(r),
      t.appendChild(l),
      t
    );
  }
  static handleFileChange(e, t, n) {
    const s = e.target,
      o = s.files ? s.files[0] : null;
    if (o) {
      const e = new FileReader();
      (e.onload = function () {
        const s = e.result,
          o = t.querySelector('img');
        o &&
          ((o.src = s),
          (o.style.display = 'block'),
          (n.style.display = 'none'),
          (t.style.backgroundColor = 'transparent'));
      }),
        e.readAsDataURL(o);
    }
  }
  static restoreImageUpload(e, t) {
    const n = e.querySelector('div:not(.upload-btn)'),
      s = e.querySelector('input[type="file"]'),
      o = e.querySelector('.upload-btn'),
      i = e.querySelector('img');
    s.addEventListener('change', t => this.handleFileChange(t, e, n)),
      o.addEventListener('click', () => s.click()),
      t
        ? ((i.src = t),
          (i.style.display = 'block'),
          (n.style.display = 'none'),
          (e.style.backgroundColor = 'transparent'))
        : ((i.style.display = 'none'),
          (n.style.display = 'block'),
          (e.style.backgroundColor = '#f0f0f0')),
      e.addEventListener('mouseenter', () => {
        o.style.opacity = '1';
      }),
      e.addEventListener('mouseleave', () => {
        o.style.opacity = '0';
      });
  }
}
class s {
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
    const s = document.createElement('div');
    s.classList.add('upload-text'), (s.innerText = e ? '' : 'Upload Video');
    const o = document.createElement('video');
    (o.controls = !0),
      (o.style.width = '100%'),
      (o.style.height = '100%'),
      (o.style.display = e ? 'block' : 'none'),
      e && (o.src = e);
    const i = document.createElement('button');
    return (
      (i.innerHTML = '🖊️'),
      i.classList.add('pencil-button'),
      i.addEventListener('click', () => n.click()),
      t.appendChild(s),
      t.appendChild(n),
      t.appendChild(o),
      t.appendChild(i),
      t
    );
  }
  handleFileChange(e, t) {
    const n = e.target,
      s = n.files ? n.files[0] : null;
    if (s && s.type.startsWith('video/')) {
      const e = new FileReader();
      (e.onload = () => {
        const n = t.querySelector('video'),
          s = t.querySelector('.upload-text');
        (n.src = e.result),
          (n.style.display = 'block'),
          (s.style.display = 'none');
      }),
        e.readAsDataURL(s);
    } else alert('Please upload a valid video file.');
  }
}
class o {
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
class r {
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
            s = this.originalHeight + n;
          e > this.MINIMUM_SIZE && (this.element.style.width = `${e}px`),
            s > this.MINIMUM_SIZE && (this.element.style.height = `${s}px`);
        } else if (this.currentResizer.classList.contains('bottom-left')) {
          const e = this.originalHeight + n,
            s = this.originalWidth - t;
          e > this.MINIMUM_SIZE && (this.element.style.height = `${e}px`),
            s > this.MINIMUM_SIZE &&
              ((this.element.style.width = `${s}px`),
              (this.element.style.left = `${this.originalX + t}px`));
        } else if (this.currentResizer.classList.contains('top-right')) {
          const e = this.originalWidth + t,
            s = this.originalHeight - n;
          e > this.MINIMUM_SIZE && (this.element.style.width = `${e}px`),
            s > this.MINIMUM_SIZE &&
              ((this.element.style.height = `${s}px`),
              (this.element.style.top = `${this.originalY + n}px`));
        } else if (this.currentResizer.classList.contains('top-left')) {
          const e = this.originalWidth - t,
            s = this.originalHeight - n;
          e > this.MINIMUM_SIZE &&
            ((this.element.style.width = `${e}px`),
            (this.element.style.left = `${this.originalX + t}px`)),
            s > this.MINIMUM_SIZE &&
              ((this.element.style.height = `${s}px`),
              (this.element.style.top = `${this.originalY + n}px`));
        }
      }),
      (this.stopResize = () => {
        window.removeEventListener('mousemove', this.resize),
          window.removeEventListener('mouseup', this.stopResize),
          (this.currentResizer = null),
          C.historyManager.captureState();
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
      s = 0,
      o = 0,
      i = 0;
    const r = r => {
        if (!t) return;
        const l = r.clientX - n,
          a = r.clientY - s;
        e.style.transform = `translate(${o + l}px, ${i + a}px)`;
      },
      l = () => {
        (t = !1),
          window.removeEventListener('mousemove', r),
          window.removeEventListener('mouseup', l);
      };
    e.addEventListener('mousedown', a => {
      a.preventDefault(),
        a.stopPropagation(),
        (t = !0),
        (n = a.clientX),
        (s = a.clientY);
      const d = e.getBoundingClientRect();
      (o = d.left),
        (i = d.top),
        window.addEventListener('mousemove', r),
        window.addEventListener('mouseup', l);
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
    const s = C.createComponent(n);
    if (!s) return;
    const o = this.element.classList[2],
      i = C.generateUniqueClass(n, !0, o);
    s.classList.add(i);
    const r = document.createElement('span');
    (r.className = 'component-label'),
      (r.textContent = i),
      (s.id = i),
      (r.style.display = 'none'),
      s.appendChild(r),
      s.addEventListener('mouseenter', e => this.showLabel(e, s)),
      s.addEventListener('mouseleave', e => this.hideLabel(e, s)),
      this.element.appendChild(s),
      this.makeDraggable(s),
      C.historyManager.captureState();
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
    const s = new r();
    (s.element = e), (s.resizers = n), s.addResizeHandles(), e.appendChild(n);
  }
  static restoreContainer(e) {
    r.restoreResizer(e);
    const t = new r();
    t.element = e;
    e.querySelectorAll('.editable-component').forEach(e => {
      var s;
      if (
        (C.controlsManager.addControlButtons(e),
        C.addDraggableListeners(e),
        e.addEventListener('mouseenter', n => t.showLabel(n, e)),
        e.addEventListener('mouseleave', n => t.hideLabel(n, e)),
        e.classList.contains('image-component'))
      ) {
        const t =
          (null === (s = e.querySelector('img')) || void 0 === s
            ? void 0
            : s.getAttribute('src')) || '';
        n.restoreImageUpload(e, t);
      }
      e.classList.contains('container-component') && this.restoreContainer(e);
    });
  }
}
class l {
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
    const s = C.createComponent(n);
    if (!s) return;
    const o = e.target;
    if (o && o.classList.contains('column')) {
      o.appendChild(s);
      const e = `${this.element.id}-${`c${Array.from(o.parentElement.children).indexOf(o)}`}`;
      (o.id = e), o.classList.add(e);
      let t = o.querySelector('.column-label');
      t ||
        ((t = document.createElement('span')),
        (t.className = 'column-label'),
        o.appendChild(t)),
        (t.textContent = e);
      const i = C.generateUniqueClass(n, !0, e);
      s.classList.add(i), (s.id = i);
      let r = s.querySelector('.component-label');
      r ||
        ((r = document.createElement('span')),
        (r.className = 'component-label'),
        s.appendChild(r)),
        (r.textContent = i),
        C.historyManager.captureState();
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
        (C.controlsManager.addControlButtons(e),
        C.addDraggableListeners(e),
        e.classList.contains('image-component'))
      ) {
        const s =
          (null === (t = e.querySelector('img')) || void 0 === t
            ? void 0
            : t.getAttribute('src')) || '';
        n.restoreImageUpload(e, s);
      }
    });
  }
}
class a extends l {
  constructor() {
    super(2, 'twoCol-component');
  }
}
class d extends l {
  constructor() {
    super(3, 'threeCol-component');
  }
}
class c {
  create(e, t, n = !1) {
    const s = document.createElement('div');
    s.classList.add('table-component');
    const o = document.createElement('table');
    (o.style.width = '100%'), (o.style.borderCollapse = 'collapse');
    for (let n = 0; n < e; n++) {
      const e = document.createElement('tr');
      for (let s = 0; s < t; s++) {
        const t = document.createElement('td');
        (t.textContent = `R${n + 1}C${s + 1}`),
          (t.style.border = '1px solid #000'),
          (t.style.padding = '8px'),
          e.appendChild(t);
      }
      o.appendChild(e);
    }
    if ((s.appendChild(o), !n)) {
      const e = document.createElement('div');
      e.classList.add('button-container'),
        (e.style.marginTop = '10px'),
        (e.style.display = 'flex'),
        (e.style.gap = '10px');
      const t = document.createElement('button');
      (t.textContent = 'Add Row'),
        t.addEventListener('click', () => this.addRow(o)),
        e.appendChild(t);
      const n = document.createElement('button');
      (n.textContent = 'Add Column'),
        n.addEventListener('click', () => this.addColumn(o)),
        e.appendChild(n),
        s.appendChild(e);
    }
    return s;
  }
  addRow(e) {
    var t;
    const n = e.rows.length,
      s =
        (null === (t = e.rows[0]) || void 0 === t ? void 0 : t.cells.length) ||
        0,
      o = document.createElement('tr');
    for (let e = 0; e < s; e++) {
      const t = document.createElement('td');
      (t.textContent = `R${n + 1}C${e + 1}`),
        (t.style.border = '1px solid #000'),
        (t.style.padding = '8px'),
        o.appendChild(t);
    }
    e.appendChild(o);
  }
  addColumn(e) {
    const t = e.rows.length;
    for (let n = 0; n < t; n++) {
      const t = document.createElement('td');
      (t.textContent = `R${n + 1}C${e.rows[n].cells.length + 1}`),
        (t.style.border = '1px solid #000'),
        (t.style.padding = '8px'),
        e.rows[n].appendChild(t);
    }
  }
  static restore(e) {
    const t = new c(),
      n = e.querySelector('table');
    if (!n) return void console.error('No table found in container');
    const s = e.querySelector('.button-container');
    if (!s) return void console.error('No button container found');
    s.querySelectorAll('button').forEach(e => {
      var s;
      const o = e.cloneNode(!0);
      null === (s = e.parentNode) || void 0 === s || s.replaceChild(o, e),
        'Add Row' === o.textContent
          ? o.addEventListener('click', () => t.addRow(n))
          : 'Add Column' === o.textContent &&
            o.addEventListener('click', () => t.addColumn(n));
    });
  }
}
class p {
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
    const s = document.createElement('button');
    (s.innerHTML = '🖊️'), s.classList.add('edit-link');
    const o = document.createElement('div');
    o.classList.add('edit-link-form');
    const i = document.createElement('input');
    (i.type = 'url'), (i.value = e), (i.placeholder = 'Enter URL');
    const r = document.createElement('input');
    r.type = 'checkbox';
    const l = document.createElement('label');
    (l.innerHTML = 'Open in new tab'), l.appendChild(r);
    const a = document.createElement('button');
    return (
      (a.innerHTML = 'Save'),
      o.appendChild(i),
      o.appendChild(l),
      o.appendChild(a),
      s.addEventListener('click', e => {
        e.preventDefault(),
          (this.isEditing = !0),
          this.link && (this.link.style.display = 'none'),
          (s.style.display = 'none'),
          (o.style.display = 'flex');
      }),
      a.addEventListener('click', e => {
        e.preventDefault(),
          e.stopPropagation(),
          (this.isEditing = !1),
          this.link &&
            ((this.link.href = i.value),
            (this.link.style.display = 'inline'),
            (this.link.target = r.checked ? '_blank' : '_self')),
          (s.style.display = 'inline-flex'),
          (o.style.display = 'none');
      }),
      n.appendChild(this.link),
      n.appendChild(s),
      n.appendChild(o),
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
    const s = e.querySelector('.link-component-label'),
      o = e.querySelector('.edit-link'),
      i = e.querySelector('.edit-link-form'),
      r = i.querySelector('button'),
      l = i.querySelector('input[type="url"]'),
      a = i.querySelector('input[type="checkbox"]');
    if (!(s && o && i && r && l && a))
      return void console.error('Required elements not found');
    (s.style.display = 'inline'),
      (o.style.display = 'inline-flex'),
      (i.style.display = 'none');
    const d = o.cloneNode(!0),
      c = r.cloneNode(!0);
    null === (t = o.parentNode) || void 0 === t || t.replaceChild(d, o),
      null === (n = r.parentNode) || void 0 === n || n.replaceChild(c, r),
      d.addEventListener('click', e => {
        e.preventDefault(),
          (s.style.display = 'none'),
          (d.style.display = 'none'),
          (i.style.display = 'flex');
      }),
      c.addEventListener('click', e => {
        e.preventDefault(),
          e.stopPropagation(),
          (s.href = l.value),
          (s.style.display = 'inline'),
          (s.target = a.checked ? '_blank' : '_self'),
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
          s,
          o,
          i = !1,
          r = !1,
          l = 0,
          a = 0;
        (e.style.position = 'relative'),
          (e.style.cursor = 'move'),
          e.addEventListener('mousedown', s => {
            r ||
              ((i = !0),
              (t = s.clientX),
              (n = s.clientY),
              (l = parseFloat(e.getAttribute('data-x') || '0')),
              (a = parseFloat(e.getAttribute('data-y') || '0')),
              document.addEventListener('mousemove', d),
              document.addEventListener('mouseup', c));
          });
        const d = s => {
            if (i) {
              const o = s.clientX - t,
                i = s.clientY - n,
                r = l + o,
                d = a + i;
              (e.style.transform = `translate(${r}px, ${d}px)`),
                e.setAttribute('data-x', r.toString()),
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
                (r = !0),
                (s = e.offsetWidth),
                (o = e.offsetHeight),
                (t = i.clientX),
                (n = i.clientY),
                document.addEventListener('mousemove', l),
                document.addEventListener('mouseup', a);
            });
          const l = i => {
              if (r) {
                const r = s + (i.clientX - t),
                  l = o + (i.clientY - n);
                (e.style.width = `${r}px`), (e.style.height = `${l}px`);
              }
            },
            a = () => {
              (r = !1),
                document.removeEventListener('mousemove', l),
                document.removeEventListener('mouseup', a);
            };
        }
      },
      n = new r().create();
    n.classList.add('container'),
      Object.assign(n.style, {
        width: '100%',
        maxWidth: 'none',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Roboto', sans-serif",
      }),
      e(n);
    const s = new r().create();
    s.classList.add('container'),
      Object.assign(s.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        width: '100%',
      }),
      e(s);
    const i = new t('MyBrand').create();
    Object.assign(i.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    });
    const l = new r().create();
    l.classList.add('container'),
      Object.assign(l.style, { display: 'flex', gap: '20px' }),
      e(l),
      ['Home', 'Features', 'Contact'].forEach(e => {
        const n = new t(e).create();
        Object.assign(n.style, {
          cursor: 'pointer',
          color: '#555',
          textDecoration: 'none',
        }),
          l.appendChild(n);
      }),
      s.appendChild(i),
      s.appendChild(l);
    const a = new r().create();
    a.classList.add('container'),
      Object.assign(a.style, {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        marginBottom: '40px',
      }),
      e(a);
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
    const p = new o().create();
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
      a.appendChild(d),
      a.appendChild(c),
      a.appendChild(p);
    const h = new r().create();
    h.classList.add('container'),
      Object.assign(h.style, {
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
      }),
      e(h);
    const u = new t('© 2025 MyBrand. All rights reserved.').create();
    return (
      Object.assign(u.style, { fontSize: '14px', color: '#999' }),
      h.appendChild(u),
      n.appendChild(s),
      n.appendChild(a),
      n.appendChild(h),
      n
    );
  }
}
class u {
  constructor(e) {
    (this.undoStack = []), (this.redoStack = []), (this.canvas = e);
  }
  captureState() {
    const e = C.getState();
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
      C.restoreState(t);
    } else if (1 === this.undoStack.length) {
      const e = this.undoStack.pop();
      this.redoStack.push(e);
      const t = C.jsonStorage.load();
      t ? C.restoreState(t) : C.restoreState([]);
    } else console.warn('No more actions to undo.');
  }
  redo() {
    if (this.redoStack.length > 0) {
      const e = this.redoStack.pop();
      this.undoStack.push(e), C.restoreState(e);
    } else console.warn('No more actions to redo.');
  }
}
class m {
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
class g {
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
    const s = this.createDeleteIcon(e);
    n.appendChild(s);
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
    this.canvas.setComponents(t), this.canvas.historyManager.captureState();
  }
}
function y(e) {
  const t = document.getElementById('notification');
  t &&
    ((t.innerHTML = e),
    t.classList.add('visible'),
    t.classList.remove('hidden'),
    setTimeout(() => {
      t.classList.remove('visible'), t.classList.add('hidden');
    }, 2e3));
}
class v {
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
    return `<!DOCTYPE html>\n<html>\n<head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Page Builder</title>\n    <style>\n      ${this.generateCSS()}\n    </style>\n </head>\n        <body>\n            <div id="page" class="home">\n            ${e}\n            </div>\n        </body>\n      </html>`;
  }
  cleanupElements(e) {
    const t = ['contenteditable', 'draggable', 'style'],
      n = [
        'component-controls',
        'delete-icon',
        'component-label',
        'column-label',
        'editable-component',
        'resizers',
        'resizer',
        'upload-btn',
        'component-resizer',
        'drop-preview',
        'edit-link-form',
        'edit-link',
      ];
    Array.from(e.children).forEach(s => {
      const o = s;
      t.forEach(e => {
        o.removeAttribute(e);
      }),
        n.forEach(e => {
          o.classList.remove(e);
        });
      e.querySelectorAll('input').forEach(e => e.remove());
      o
        .querySelectorAll(
          '.component-controls, .delete-icon, .component-label,.column-label, .resizers, .resizer, .drop-preview, .upload-btn, component-resizer,.edit-link, .edit-link-form'
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
      n = [];
    n.push(
      `\n      body, html {\n          margin: 0;\n          padding: 0;\n          width: 100%;\n          height: 100%;\n          box-sizing: border-box;\n      }\n      .home {\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          width: 100%;\n          min-height:100vh;\n          background-color: ${t};\n          margin: 0;\n      }\n      `
    );
    const s = e.querySelectorAll('*'),
      o = [
        'position',
        'top',
        'left',
        'right',
        'bottom',
        'width',
        'height',
        'min-width',
        'min-height',
        'max-width',
        'max-height',
        'margin',
        'padding',
        'background-color',
        'background-image',
        'border',
        'border-radius',
        'transform',
        'opacity',
        'z-index',
        'display',
        'flex-direction',
        'justify-content',
        'align-items',
        'flex-wrap',
        'font-size',
        'font-weight',
        'color',
        'text-align',
        'line-height',
        'font-family',
      ],
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
      s.forEach(e => {
        if (i.some(t => e.classList.contains(t))) return;
        const t = window.getComputedStyle(e),
          s = [];
        o.forEach(e => {
          const n = t.getPropertyValue(e);
          if (n && 'none' !== n && '' !== n) {
            if ('resize' === e) return;
            s.push(`${e}: ${n};`);
          }
        });
        const r = this.generateUniqueSelector(e);
        s.length > 0 &&
          n.push(`\n        ${r} {\n          ${s.join('\n  ')}\n        }`);
      }),
      n.join('\n')
    );
  }
  generateUniqueSelector(e) {
    if (e.id) return `#${e.id}`;
    if (e.className) return `.${e.className.split(' ').join('.')}`;
    const t = e.parentElement;
    if (t) {
      const n = Array.from(t.children).indexOf(e);
      return `${e.tagName.toLowerCase()}:nth-child(${n + 1})`;
    }
    return e.tagName.toLowerCase();
  }
  applyCSS(e) {
    this.styleElement.textContent = e;
  }
}
class w {
  constructor(e = '#layers-view', t = '#page') {
    this.initializeElements(e, t);
  }
  initializeElements(e, t) {
    (w.layersView = document.querySelector(e)),
      w.layersView ||
        ((w.layersView = document.createElement('div')),
        (w.layersView.id = 'layers-view'),
        (w.layersView.className = 'layers-view'),
        document.body.appendChild(w.layersView),
        console.warn(`Layers view element created: ${e}`)),
      (w.canvasRoot = document.querySelector(t)),
      w.canvasRoot ||
        (console.error(`Canvas root element not found: ${t}`),
        (w.canvasRoot = document.body));
  }
  static buildLayerHierarchyFromDOM(e) {
    const t = new v(new C()).generateHTML(),
      n = new DOMParser().parseFromString(t, 'text/html'),
      s = (e, t = 0) => {
        var n;
        const o = e;
        if (!o.id) return null;
        const i = {
          id: o.id,
          isVisible:
            'none' !==
            (null === (n = o.style) || void 0 === n ? void 0 : n.display),
          isLocked: 'true' === o.getAttribute('data-locked'),
          depth: t,
          children: [],
        };
        return (
          Array.from(e.children).forEach(e => {
            const n = s(e, t + 1);
            n && i.children.push(n);
          }),
          i
        );
      };
    return Array.from(n.body.children)
      .map(e => s(e))
      .filter(e => null !== e);
  }
  static updateLayersView() {
    if (!this.layersView || !this.canvasRoot)
      return void console.error('Layers view or canvas root not initialized');
    this.layersView.innerHTML = '';
    const e = this.buildLayerHierarchyFromDOM(this.canvasRoot),
      t = document.createElement('ul');
    (t.className = 'layers-list'),
      this.renderLayerItems(t, e),
      this.layersView.appendChild(t);
  }
  static renderLayerItems(e, t, n = 0) {
    const s = document.createElement('ul');
    (s.className = 'layer-list'),
      e.appendChild(s),
      t.forEach(e => {
        const t = document.createElement('li');
        (t.className = 'layer-item-container'), s.appendChild(t);
        const o = this.createLayerItemElement(e);
        if (
          ((o.style.paddingLeft = 12 * n + 'px'),
          t.appendChild(o),
          e.children && e.children.length > 0)
        ) {
          const s = document.createElement('span');
          (s.className = 'layer-expand-toggle'),
            (s.textContent = '▶'),
            o.insertBefore(s, o.firstChild);
          const i = document.createElement('div');
          (i.className = 'child-container'),
            (i.style.display = 'none'),
            t.appendChild(i),
            this.renderLayerItems(i, e.children, n + 1),
            s.addEventListener('click', () => {
              'block' === i.style.display
                ? ((i.style.display = 'none'), (s.textContent = '▶'))
                : ((i.style.display = 'block'), (s.textContent = '▼'));
            });
        }
      });
  }
  static createLayerItemElement(e) {
    const t = document.createElement('li');
    (t.className = 'layer-item'), (t.dataset.layerId = e.id);
    const n = document.createElement('span');
    (n.className = 'layer-visibility'),
      (n.innerHTML = e.isVisible ? '👁️' : '👁️‍🗨️'),
      n.addEventListener('click', () => this.toggleLayerVisibility(e));
    const s = document.createElement('span');
    (s.className = 'layer-name'),
      (s.textContent = `${e.id}`),
      s.addEventListener('click', () => this.selectLayer(e));
    const o = document.createElement('span');
    return (
      (o.className = 'layer-lock'),
      (o.innerHTML = e.isLocked ? '🔒' : '🔓'),
      o.addEventListener('click', () => this.toggleLayerLock(e)),
      (t.draggable = !0),
      t.addEventListener('dragstart', t => this.handleDragStart(t, e)),
      t.addEventListener('dragover', this.handleDragOver),
      t.addEventListener('drop', t => this.handleDrop(t, e)),
      t.appendChild(n),
      t.appendChild(s),
      t.appendChild(o),
      t
    );
  }
  static toggleLayerVisibility(e) {
    const t = document.getElementById(e.id);
    t &&
      ('none' === t.style.display
        ? ((t.style.display = t.dataset.originalDisplay || ''),
          (e.isVisible = !0))
        : ((t.dataset.originalDisplay = t.style.display),
          (t.style.display = 'none'),
          (e.isVisible = !1)),
      this.updateLayersView());
  }
  static toggleLayerLock(e) {
    const t = document.getElementById(e.id);
    t &&
      ((e.isLocked = !e.isLocked),
      e.isLocked
        ? (t.setAttribute('data-locked', 'true'),
          (t.style.pointerEvents = 'none'))
        : (t.removeAttribute('data-locked'), (t.style.pointerEvents = 'auto')),
      this.updateLayersView());
  }
  static selectLayer(e) {
    this.switchToCustomizeMode(e.id);
  }
  static handleDragStart(e, t) {
    e.dataTransfer &&
      (e.dataTransfer.setData('text/plain', t.id),
      (this.draggedItem = e.target));
  }
  static handleDragOver(e) {
    e.preventDefault(), e.stopPropagation();
  }
  static handleDrop(e, t) {
    var n;
    if ((e.preventDefault(), e.stopPropagation(), !e.dataTransfer)) return;
    const s = parseInt(
        (null === (n = e.dataTransfer) || void 0 === n
          ? void 0
          : n.getData('text/plain')) || '-1'
      ),
      o = parseInt(t.id || '-1');
    C.reorderComponent(s, o), this.updateLayersView();
  }
  static switchToCustomizeMode(e) {
    const t = document.getElementById('customize-sidebar');
    t && ((t.style.display = 'block'), this.loadLayerProperties(e));
  }
  static loadLayerProperties(e) {
    const t = document.getElementById(e);
    if (!t) return;
    const n = document.getElementById('layer-properties');
    n &&
      (n.innerHTML = `\n        <h3>Layer Properties: ${e}</h3>\n        <div>Visibility: ${'none' !== t.style.display ? 'Visible' : 'Hidden'}</div>\n        <div>Locked: ${'true' === t.getAttribute('data-locked') ? 'Yes' : 'No'}</div>\n      `);
  }
}
(w.layersView = null), (w.canvasRoot = null), (w.draggedItem = null);
class b {
  static init() {
    if (
      ((this.sidebarElement = document.getElementById('customization')),
      (this.controlsContainer = document.getElementById('controls')),
      (this.componentNameHeader = document.getElementById('component-name')),
      (this.closeButton = document.createElement('button')),
      !this.sidebarElement || !this.controlsContainer)
    )
      return void console.error(
        'CustomizationSidebar: Required elements not found.'
      );
    (this.layersViewController = new w()),
      (this.layersModeToggle = document.createElement('div')),
      (this.layersModeToggle.className = 'layers-mode-toggle'),
      (this.layersModeToggle.innerHTML =
        '\n      <button id="customize-tab" title="Customize" class="active">⚙️</button>\n      <button id="layers-tab" title="Layers"> ☰ </button>\n    '),
      this.sidebarElement.insertBefore(
        this.layersModeToggle,
        this.componentNameHeader
      ),
      (this.layersView = document.createElement('div')),
      (this.layersView.id = 'layers-view'),
      (this.layersView.className = 'layers-view hidden'),
      this.controlsContainer.appendChild(this.layersView);
    const e = this.layersModeToggle.querySelector('#customize-tab'),
      t = this.layersModeToggle.querySelector('#layers-tab');
    e.addEventListener('click', () => this.switchToCustomizeMode()),
      t.addEventListener('click', () => this.switchToLayersMode()),
      this.sidebarElement.appendChild(this.closeButton),
      (this.closeButton.textContent = '×'),
      this.closeButton.classList.add('close-button'),
      this.closeButton.addEventListener('click', () => {
        this.hideSidebar();
      });
  }
  static switchToCustomizeMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('layers-tab'),
      n = document.getElementById('layers-view'),
      s = document.getElementById('controls'),
      o = document.getElementById('component-name');
    e.classList.add('active'),
      t.classList.remove('active'),
      n.classList.add('hidden'),
      s.classList.remove('hidden'),
      (s.style.display = 'block'),
      (n.style.display = 'none'),
      (o.style.display = 'block');
  }
  static switchToLayersMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('layers-tab'),
      n = document.getElementById('layers-view'),
      s = document.getElementById('controls'),
      o = document.getElementById('component-name');
    t.classList.add('active'),
      e.classList.remove('active'),
      (s.style.display = 'none'),
      (n.style.display = 'block'),
      (o.style.display = 'none'),
      w.updateLayersView();
  }
  static updateLayersView() {
    w.updateLayersView();
  }
  static showSidebar(e) {
    const t = document.getElementById('customize-tab'),
      n = document.getElementById('layers-tab'),
      s = document.getElementById('layers-view'),
      o = document.getElementById('controls');
    t.classList.add('active'),
      n.classList.remove('active'),
      s.classList.add('hidden'),
      o.classList.remove('hidden');
    const i = document.getElementById(e);
    if ((console.log(`Showing sidebar for: ${e}`), !i))
      return void console.error(`Component with ID "${e}" not found.`);
    const r = 'canvas' === e.toLowerCase();
    (this.sidebarElement.style.display = 'block'),
      (this.controlsContainer.innerHTML = ''),
      (this.componentNameHeader.textContent = `Component: ${e}`);
    const l = getComputedStyle(i);
    this.createSelectControl('Display', 'display', l.display || 'block', [
      'block',
      'inline',
      'inline-block',
      'flex',
      'grid',
      'none',
    ]),
      r ||
        (this.createControl('Width', 'width', 'number', i.offsetWidth, {
          min: 0,
          max: 1e3,
          unit: 'px',
        }),
        this.createControl('Height', 'height', 'number', i.offsetHeight, {
          min: 0,
          max: 1e3,
          unit: 'px',
        }),
        this.createControl(
          'Margin',
          'margin',
          'number',
          parseInt(l.margin) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        ),
        this.createControl(
          'Padding',
          'padding',
          'number',
          parseInt(l.padding) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        )),
      this.createControl('Color', 'color', 'color', l.backgroundColor),
      this.createSelectControl('Text Alignment', 'alignment', l.textAlign, [
        'left',
        'center',
        'right',
      ]),
      this.createSelectControl('Font Family', 'font-family', l.fontFamily, [
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
        parseInt(l.fontSize) || 16,
        { min: 0, max: 100, unit: 'px' }
      ),
      this.createControl(
        'Text Color',
        'text-color',
        'color',
        l.color || '#000000'
      ),
      this.createControl(
        'Border Width',
        'border-width',
        'number',
        parseInt(l.borderWidth) || 0,
        { min: 0, max: 20, unit: 'px' }
      ),
      this.createSelectControl(
        'Border Style',
        'border-style',
        l.borderStyle || 'none',
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
        l.borderColor || '#000000'
      );
    const a = b.rgbToHex(l.backgroundColor),
      d = document.getElementById('color');
    d && (d.value = a), this.addListeners(i);
  }
  static hideSidebar() {
    this.sidebarElement && (this.sidebarElement.style.display = 'none');
  }
  static rgbToHex(e) {
    const t = e.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
    if (!t) return e;
    return `#${((1 << 24) | (parseInt(t[1], 10) << 16) | (parseInt(t[2], 10) << 8) | parseInt(t[3], 10)).toString(16).slice(1).toUpperCase()}`;
  }
  static createControl(e, t, n, s, o = {}) {
    const i = document.createElement('div');
    i.classList.add('control-wrapper');
    if ('number' === n && o.unit) {
      const r = o.unit;
      i.innerHTML = `\n                  <label for="${t}">${e}:</label>\n                  <input type="${n}" id="${t}" value="${s}">\n                  <select id="${t}-unit">\n                      <option value="px" ${'px' === r ? 'selected' : ''}>px</option>\n                      <option value="rem" ${'rem' === r ? 'selected' : ''}>rem</option>\n                      <option value="vh" ${'vh' === r ? 'selected' : ''}>vh</option>\n                      <option value="%" ${'%' === r ? 'selected' : ''}>%</option>\n                  </select>\n              `;
    } else
      i.innerHTML = `\n          <label for="${t}">${e}:</label>\n          <input type="color" id="${t}" value="${s}">\n          <input type="text" id="color-value" style="font-size: 0.8rem; width: 80px; margin-left: 8px;" value="${s}">\n        `;
    const r = i.querySelector('input'),
      l = i.querySelector(`#${t}-unit`);
    r &&
      Object.keys(o).forEach(e => {
        r.setAttribute(e, o[e].toString());
      });
    const a = i.querySelector('input[type="color"]'),
      d = i.querySelector('#color-value');
    a &&
      a.addEventListener('input', () => {
        d && (d.value = a.value);
      }),
      d &&
        d.addEventListener('input', () => {
          a && (a.value = d.value);
        }),
      this.controlsContainer.appendChild(i),
      l &&
        l.addEventListener('change', () => {
          const e = l.value,
            t = parseInt(r.value);
          r.value = `${t}${e}`;
        });
  }
  static createSelectControl(e, t, n, s) {
    const o = document.createElement('div');
    o.classList.add('control-wrapper');
    const i = s
      .map(
        e => `<option value="${e}" ${e === n ? 'selected' : ''}>${e}</option>`
      )
      .join('');
    (o.innerHTML = `\n              <label for="${t}">${e}:</label>\n              <select id="${t}">${i}</select>\n          `),
      this.controlsContainer.appendChild(o);
  }
  static addListeners(e) {
    var t, n, s, o, i, r, l, a, d, c, p, h, u;
    const m = {
      width: document.getElementById('width'),
      height: document.getElementById('height'),
      color: document.getElementById('color'),
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
    };
    if (!m) return;
    const g = (function (e, t) {
      let n = null;
      return (...s) => {
        n && clearTimeout(n), (n = setTimeout(() => e(...s), t));
      };
    })(() => {
      C.historyManager.captureState();
    }, 300);
    null === (t = m.width) ||
      void 0 === t ||
      t.addEventListener('input', () => {
        const t = document.getElementById('width-unit').value;
        (e.style.width = `${m.width.value}${t}`), g();
      }),
      null === (n = m.height) ||
        void 0 === n ||
        n.addEventListener('input', () => {
          const t = document.getElementById('height-unit').value;
          (e.style.height = `${m.height.value}${t}`), g();
        }),
      null === (s = m.color) ||
        void 0 === s ||
        s.addEventListener('input', () => {
          e.style.backgroundColor = m.color.value;
          const t = document.querySelector('#color-value');
          t && (t.textContent = m.color.value), g();
        }),
      null === (o = m.margin) ||
        void 0 === o ||
        o.addEventListener('input', () => {
          const t = document.getElementById('margin-unit').value;
          (e.style.margin = `${m.margin.value}${t}`), g();
        }),
      null === (i = m.padding) ||
        void 0 === i ||
        i.addEventListener('input', () => {
          const t = document.getElementById('padding-unit').value;
          (e.style.padding = `${m.padding.value}${t}`), g();
        }),
      null === (r = m.alignment) ||
        void 0 === r ||
        r.addEventListener('change', () => {
          (e.style.textAlign = m.alignment.value), g();
        }),
      null === (l = m.fontSize) ||
        void 0 === l ||
        l.addEventListener('input', () => {
          const t = document.getElementById('font-size-unit').value;
          (e.style.fontSize = `${m.fontSize.value}${t}`), g();
        }),
      null === (a = m.textColor) ||
        void 0 === a ||
        a.addEventListener('input', () => {
          (e.style.color = m.textColor.value), g();
        }),
      null === (d = m.borderWidth) ||
        void 0 === d ||
        d.addEventListener('input', () => {
          const t = document.getElementById('border-width-unit').value;
          (e.style.borderWidth = `${m.borderWidth.value}${t}`), g();
        }),
      null === (c = m.borderStyle) ||
        void 0 === c ||
        c.addEventListener('change', () => {
          (e.style.borderStyle = m.borderStyle.value), g();
        }),
      null === (p = m.borderColor) ||
        void 0 === p ||
        p.addEventListener('input', () => {
          (e.style.borderColor = m.borderColor.value), g();
        }),
      null === (h = m.display) ||
        void 0 === h ||
        h.addEventListener('change', () => {
          (e.style.display = m.display.value), g();
        }),
      null === (u = m.fontFamily) ||
        void 0 === u ||
        u.addEventListener('change', () => {
          (e.style.fontFamily = m.fontFamily.value), g();
        });
  }
  static getLayersViewController() {
    return this.layersViewController;
  }
}
class f {
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
    const { gridX: s, gridY: o } = this.mousePositionAtGridCorner(e, n);
    (t.style.left = `${s}px`),
      (t.style.top = `${o}px`),
      (t.style.width = '20px'),
      (t.style.height = '20px'),
      t.classList.add('visible');
  }
  mousePositionAtGridCorner(e, t) {
    const n = t.getBoundingClientRect(),
      s = e.clientX - n.left,
      o = e.clientY - n.top;
    return { gridX: 20 * Math.floor(s / 20), gridY: 20 * Math.floor(o / 20) };
  }
  getCellSize() {
    return this.cellSize;
  }
}
class C {
  static getComponents() {
    return C.components;
  }
  static setComponents(e) {
    C.components = e;
  }
  static init() {
    (C.canvasElement = document.getElementById('canvas')),
      (C.sidebarElement = document.getElementById('sidebar')),
      C.canvasElement.addEventListener('drop', C.onDrop.bind(C)),
      C.canvasElement.addEventListener('dragover', e => e.preventDefault()),
      C.canvasElement.addEventListener('click', e => {
        const t = e.target;
        t && b.showSidebar(t.id);
      }),
      (C.canvasElement.style.position = 'relative'),
      (C.historyManager = new u(C.canvasElement)),
      (C.jsonStorage = new m()),
      (C.controlsManager = new g(C)),
      (C.gridManager = new f()),
      C.gridManager.initializeDropPreview(C.canvasElement);
    new e(C.canvasElement, C.sidebarElement).enable();
    const t = C.jsonStorage.load();
    t && C.restoreState(t);
  }
  static clearCanvas() {
    (C.canvasElement.innerHTML = ''),
      (C.components = []),
      C.historyManager.captureState(),
      C.gridManager.initializeDropPreview(C.canvasElement);
  }
  static getState() {
    return C.components.map(e => {
      const t = e.classList[0].split(/\d/)[0].replace('-component', ''),
        n = e.querySelector('img') ? e.querySelector('img').src : null,
        s = window.getComputedStyle(e),
        o = {};
      [
        'position',
        'top',
        'left',
        'right',
        'bottom',
        'width',
        'height',
        'min-width',
        'min-height',
        'max-width',
        'max-height',
        'margin',
        'padding',
        'background-color',
        'background-image',
        'border',
        'border-radius',
        'transform',
        'opacity',
        'z-index',
        'display',
        'flex-direction',
        'justify-content',
        'align-items',
        'flex-wrap',
        'font-size',
        'font-weight',
        'color',
        'text-align',
        'line-height',
      ].forEach(e => {
        o[e] = s.getPropertyValue(e);
      });
      const i = {};
      return (
        Array.from(e.attributes)
          .filter(e => e.name.startsWith('data-'))
          .forEach(e => {
            i[e.name] = e.value;
          }),
        {
          id: e.id,
          type: t,
          content: e.innerHTML,
          position: { x: e.offsetLeft, y: e.offsetTop },
          dimensions: { width: e.offsetWidth, height: e.offsetHeight },
          style: o,
          inlineStyle: e.getAttribute('style') || '',
          classes: Array.from(e.classList),
          dataAttributes: i,
          imageSrc: n,
        }
      );
    });
  }
  static restoreState(e) {
    (C.canvasElement.innerHTML = ''),
      (C.components = []),
      e.forEach(e => {
        const t = C.createComponent(e.type);
        if (t) {
          if (
            (e.classes.includes('custom-component') ||
              (t.innerHTML = e.content),
            (t.className = ''),
            e.classes.forEach(e => {
              t.classList.add(e);
            }),
            'video' === e.type && e.videoSrc)
          ) {
            const n = t.querySelector('video'),
              s = t.querySelector('.upload-text');
            (n.src = e.videoSrc),
              (n.style.display = 'block'),
              (s.style.display = 'none');
          }
          e.inlineStyle && t.setAttribute('style', e.inlineStyle),
            e.computedStyle &&
              Object.keys(e.computedStyle).forEach(n => {
                t.style.setProperty(n, e.computedStyle[n]);
              }),
            e.dataAttributes &&
              Object.entries(e.dataAttributes).forEach(([e, n]) => {
                t.setAttribute(e, n);
              }),
            C.controlsManager.addControlButtons(t),
            C.addDraggableListeners(t),
            t.classList.contains('container-component') &&
              r.restoreContainer(t),
            (t.classList.contains('twoCol-component') ||
              t.classList.contains('threeCol-component')) &&
              l.restoreColumn(t),
            'image' === e.type && n.restoreImageUpload(t, e.imageSrc),
            'table' === e.type && c.restore(t),
            'link' === e.type && p.restore(t),
            C.canvasElement.appendChild(t),
            C.components.push(t);
        }
      }),
      C.gridManager.initializeDropPreview(C.canvasElement);
  }
  static onDrop(e) {
    var t;
    if (
      (e.preventDefault(), e.target.classList.contains('container-component'))
    )
      return;
    const n =
      null === (t = e.dataTransfer) || void 0 === t
        ? void 0
        : t.getData('component-type');
    if (!n) return;
    const { gridX: s, gridY: o } = this.gridManager.mousePositionAtGridCorner(
        e,
        C.canvasElement
      ),
      i = C.createComponent(n);
    if (i) {
      const t = C.generateUniqueClass(n);
      (i.id = t),
        i.classList.add(t),
        (i.style.position = 'absolute'),
        'container' === n || 'twoCol' === n || 'threeCol' === n
          ? (i.style.top = `${e.offsetY}px`)
          : ((i.style.position = 'absolute'),
            (i.style.left = `${s}px`),
            (i.style.top = `${o}px`)),
        C.components.push(i),
        C.canvasElement.appendChild(i),
        C.addDraggableListeners(i),
        b.updateLayersView(),
        C.historyManager.captureState();
    }
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
    const s = document.getElementById('canvas-container');
    s &&
      ((s.innerHTML = ''),
      this.components.forEach(e => {
        s.appendChild(e);
      })),
      this.historyManager.captureState();
  }
  static createComponent(e) {
    let t = null;
    const n = C.componentFactory[e];
    if (n) t = n();
    else {
      const n = document.querySelector(`[data-component='${e}']`),
        s = null == n ? void 0 : n.getAttribute('data-tag-name');
      if (!s) return console.warn(`Unknown component type: ${e}`), null;
      (t = document.createElement(s)),
        t.classList.add(`${e}-component`, 'custom-component');
    }
    if (t) {
      t.classList.add('editable-component'),
        'container' != e && t.classList.add('component-resizer');
      const n = C.generateUniqueClass(e);
      t.setAttribute('id', n),
        'image' === e
          ? t.setAttribute('contenteditable', 'false')
          : t.setAttribute('contenteditable', 'true');
      const s = document.createElement('span');
      (s.className = 'component-label'),
        (s.textContent = n),
        t.appendChild(s),
        C.controlsManager.addControlButtons(t),
        b.updateLayersView();
    }
    return t;
  }
  static generateUniqueClass(e, t = !1, n = null) {
    if (t && n) {
      let t = C.components.find(e => e.classList.contains(n));
      if (!t && ((t = document.querySelector(`.${n}`)), !t))
        return (
          console.warn(`Container with class ${n} not found.`), `${n}-${e}1`
        );
      const s = Array.from(t.children),
        o = new RegExp(`${n}-${e}(\\d+)`);
      let i = 0;
      return (
        s.forEach(e => {
          e.classList.forEach(e => {
            const t = e.match(o);
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
        C.components.forEach(e => {
          e.classList.forEach(e => {
            const s = e.match(t);
            if (s) {
              const e = parseInt(s[1]);
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
      s = 0,
      o = 0;
    e.addEventListener('dragstart', i => {
      if (i.dataTransfer) {
        const r = C.canvasElement.getBoundingClientRect(),
          l = e.getBoundingClientRect();
        (t = i.clientX),
          (n = i.clientY),
          (s = l.left - r.left),
          (o = l.top - r.top),
          (i.dataTransfer.effectAllowed = 'move'),
          (e.style.cursor = 'grabbing');
      }
    }),
      e.addEventListener('dragend', i => {
        i.preventDefault();
        const r = i.clientX - t,
          l = i.clientY - n;
        let a = s + r,
          d = o + l;
        const c = C.canvasElement.offsetWidth - e.offsetWidth,
          p = C.canvasElement.offsetHeight - e.offsetHeight;
        (a = Math.max(0, Math.min(a, c))),
          (d = Math.max(0, Math.min(d, p))),
          (e.style.left = `${a}px`),
          (e.style.top = `${d}px`),
          (e.style.cursor = 'grab'),
          C.historyManager.captureState();
      });
  }
  static exportLayout() {
    return C.components.map(e => ({ type: e.className, content: e.innerHTML }));
  }
}
(C.components = []),
  (C.componentFactory = {
    button: () => new o().create(),
    header: () => new i().create(),
    image: () => new n().create(),
    video: () => new s(() => C.historyManager.captureState()).create(),
    table: () => new c().create(2, 2),
    text: () => new t().create(),
    container: () => new r().create(),
    twoCol: () => new a().create(),
    threeCol: () => new d().create(),
    landingpage: () => new h().create(),
    link: () => new p().create(),
  });
const E = document.getElementById('canvas'),
  x = new (class {
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
E &&
  E.addEventListener('click', e => {
    const t = e.target;
    t !== E && x.selectElement(t);
  });
class L {
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
const k = {
  desktop:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z" fill="#000000"/>\n                </svg>',
  tablet:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M19 12V11.988M4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>',
  mobile:
    '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M22.461 5H9.539a1.6 1.6 0 0 0-1.601 1.603V25.4A1.6 1.6 0 0 0 9.539 27h12.922c.885 0 1.602-.718 1.602-1.602V6.603A1.603 1.603 0 0 0 22.461 5zm-6.46 20.418a1.022 1.022 0 1 1 1.021-1.021c-.001.634-.46 1.021-1.021 1.021zm6.862-3.501H9.138V7.704h13.725v14.213z"/></svg>',
  save: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M790.706 338.824v112.94H395.412c-31.06 0-56.47 25.3-56.47 56.471v744.509c17.73-6.325 36.592-10.391 56.47-10.391h1129.412c19.877 0 38.738 4.066 56.47 10.39V508.236c0-31.171-25.412-56.47-56.47-56.47h-395.295V338.824h395.295c93.402 0 169.411 76.009 169.411 169.411v1242.353c0 93.403-76.01 169.412-169.411 169.412H395.412C302.009 1920 226 1843.99 226 1750.588V508.235c0-93.402 76.01-169.411 169.412-169.411h395.294Zm734.118 1016.47H395.412c-31.06 0-56.47 25.299-56.47 56.47v338.824c0 31.172 25.41 56.47 56.47 56.47h1129.412c31.058 0 56.47-25.298 56.47-56.47v-338.823c0-31.172-25.412-56.47-56.47-56.47ZM1016.622-.023v880.151l246.212-246.325 79.85 79.85-382.532 382.644-382.645-382.644 79.85-79.85L903.68 880.128V-.022h112.941ZM564.824 1468.235c-62.344 0-112.942 50.71-112.942 112.941s50.598 112.942 112.942 112.942c62.343 0 112.94-50.71 112.94-112.942 0-62.23-50.597-112.94-112.94-112.94Z" fill-rule="evenodd"/>\n                </svg>',
  code: '<svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n  viewBox="0 0 493.525 493.525" xml:space="preserve">\n<g id="XMLID_30_">\n <path id="XMLID_32_" d="M430.557,79.556H218.44c21.622,12.688,40.255,29.729,54.859,49.906h157.258\n     c7.196,0,13.063,5.863,13.063,13.06v238.662c0,7.199-5.866,13.064-13.063,13.064H191.894c-7.198,0-13.062-5.865-13.062-13.064\n     V222.173c-6.027-3.1-12.33-5.715-18.845-7.732c-3.818,11.764-12.105,21.787-23.508,27.781c-2.39,1.252-4.987,2.014-7.554,2.844\n     v136.119c0,34.717,28.25,62.971,62.968,62.971h238.663c34.718,0,62.969-28.254,62.969-62.971V142.522\n     C493.525,107.806,465.275,79.556,430.557,79.556z"/>\n <path id="XMLID_31_" d="M129.037,175.989c51.419,1.234,96.388,28.283,122.25,68.865c2.371,3.705,6.434,5.848,10.657,5.848\n     c1.152,0,2.322-0.162,3.46-0.486c5.377-1.545,9.114-6.418,9.179-12.006c0-0.504,0-1.01,0-1.51\n     c0-81.148-64.853-147.023-145.527-148.957V64.155c0-5.492-3.038-10.512-7.879-13.078c-2.16-1.139-4.533-1.707-6.889-1.707\n     c-2.94,0-5.848,0.88-8.35,2.584L5.751,120.526C2.162,122.98,0.018,127.041,0,131.394c-0.017,4.338,2.113,8.418,5.687,10.902\n     l100.17,69.451c2.518,1.753,5.459,2.631,8.414,2.631c2.355,0,4.696-0.553,6.857-1.676c4.855-2.549,7.909-7.6,7.909-13.092V175.989z\n     "/>\n</g>\n</svg>',
  view: '<svg width="800px" height="800px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 12.5C19.5 14.985 16.366 17 12.5 17C8.634 17 5.5 14.985 5.5 12.5C5.5 10.015 8.634 8 12.5 8C16.366 8 19.5 10.015 19.5 12.5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.25 12.5C14.2716 13.1393 13.9429 13.7395 13.3925 14.0656C12.8422 14.3917 12.1578 14.3917 11.6075 14.0656C11.0571 13.7395 10.7284 13.1393 10.75 12.5C10.7284 11.8607 11.0571 11.2604 11.6075 10.9344C12.1578 10.6083 12.8422 10.6083 13.3925 10.9344C13.9429 11.2604 14.2716 11.8607 14.25 12.5V12.5Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                    </svg>',
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
};
function M(e) {
  const t = e => new TextEncoder().encode(e),
    n = [];
  let s = 0;
  const o = [];
  e.forEach(e => {
    const i = t(e.name),
      r = t(e.content),
      l = (function (e) {
        let t = 4294967295;
        for (let n = 0; n < e.length; n++) {
          t ^= e[n];
          for (let e = 0; e < 8; e++) t = (t >>> 1) ^ (1 & t ? 3988292384 : 0);
        }
        return 4294967295 ^ t;
      })(r),
      a = ((e, t, n) => {
        const s = new Uint8Array(30 + e.length);
        return (
          s.set([80, 75, 3, 4]),
          s.set([20, 0], 4),
          s.set([0, 0], 6),
          s.set([0, 0], 8),
          s.set([0, 0], 10),
          s.set([0, 0], 12),
          s.set(
            [255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255],
            14
          ),
          s.set(
            [
              255 & t.length,
              (t.length >> 8) & 255,
              (t.length >> 16) & 255,
              (t.length >> 24) & 255,
            ],
            18
          ),
          s.set(
            [
              255 & t.length,
              (t.length >> 8) & 255,
              (t.length >> 16) & 255,
              (t.length >> 24) & 255,
            ],
            22
          ),
          s.set([255 & e.length, (e.length >> 8) & 255], 26),
          s.set([0, 0], 28),
          s.set(e, 30),
          s
        );
      })(i, r, l);
    n.push(a), n.push(r);
    const d = ((e, t, n, s) => {
      const o = new Uint8Array(46 + e.length);
      return (
        o.set([80, 75, 1, 2]),
        o.set([20, 0], 4),
        o.set([20, 0], 6),
        o.set([0, 0], 8),
        o.set([0, 0], 10),
        o.set([0, 0], 12),
        o.set([0, 0], 14),
        o.set([255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255], 16),
        o.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          20
        ),
        o.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          24
        ),
        o.set([255 & e.length, (e.length >> 8) & 255], 28),
        o.set([0, 0], 30),
        o.set([0, 0], 32),
        o.set([0, 0], 34),
        o.set([0, 0], 36),
        o.set([0, 0, 0, 0], 38),
        o.set([255 & s, (s >> 8) & 255, (s >> 16) & 255, (s >> 24) & 255], 42),
        o.set(e, 46),
        o
      );
    })(i, r, l, s);
    o.push(d), (s += a.length + r.length);
  }),
    n.push(...o);
  const i = o.reduce((e, t) => e + t.length, 0),
    r = ((e, t, n) => {
      const s = new Uint8Array(22);
      return (
        s.set([80, 75, 5, 6]),
        s.set([0, 0], 4),
        s.set([0, 0], 6),
        s.set([255 & e, (e >> 8) & 255], 8),
        s.set([255 & e, (e >> 8) & 255], 10),
        s.set([255 & t, (t >> 8) & 255, (t >> 16) & 255, (t >> 24) & 255], 12),
        s.set([255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255], 16),
        s.set([0, 0], 20),
        s
      );
    })(e.length, i, s);
  n.push(r);
  const l = new Uint8Array(n.reduce((e, t) => e.concat(Array.from(t)), []));
  return new Blob([l], { type: 'application/zip' });
}
class S {
  static init() {
    document.addEventListener('keydown', this.handleKeydown);
  }
  static handleKeydown(e) {
    if (e.ctrlKey || e.metaKey)
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault(), C.historyManager.undo();
          break;
        case 'y':
          e.preventDefault(), C.historyManager.redo();
      }
  }
}
class H {
  setPreviewMode(e) {
    const t = document.getElementById('canvas');
    t.classList.forEach(e => {
      e.startsWith('preview-') && t.classList.remove(e);
    }),
      t.classList.add(`preview-${e}`);
  }
}
class B {
  constructor(e = { Basic: [], Extra: [], Custom: {} }) {
    (this.dynamicComponents = e),
      (this.canvas = new C()),
      (this.sidebar = new L(this.canvas)),
      (this.htmlGenerator = new v(this.canvas)),
      (this.jsonStorage = new m()),
      (this.previewPanel = new H()),
      this.initializeEventListeners();
  }
  initializeEventListeners() {
    (this.canvas = new C()),
      (this.sidebar = new L(this.canvas)),
      (this.htmlGenerator = new v(this.canvas)),
      (this.jsonStorage = new m()),
      (this.previewPanel = new H()),
      this.setupInitialComponents(),
      this.setupSaveButton(),
      this.setupResetButton(),
      this.setupExportHTMLButton(),
      this.setupViewButton(),
      this.setupPreviewModeButtons(),
      this.setupUndoRedoButtons();
  }
  setupInitialComponents() {
    if (
      ((function (e) {
        (!e ||
          (0 === e.Basic.length &&
            0 === e.Extra.length &&
            0 === Object.keys(e.Custom).length)) &&
          (e = {
            Basic: [
              'button',
              'header',
              'text',
              'image',
              'video',
              'container',
              'twoCol',
              'threeCol',
              'table',
              'link',
            ],
            Extra: ['landingpage'],
            Custom: {},
          });
        const t = document.getElementById('sidebar');
        if (!t) return void console.error('Sidebar element not found');
        const n = {
            button: k.button,
            header: k.header,
            image: k.image,
            video: k.video,
            text: k.text,
            container: k.container,
            twoCol: k.twocol,
            threeCol: k.threecol,
            table: k.table,
            landingpage: k.landing,
            link: k.hyperlink,
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
          o = document.createElement('div');
        o.classList.add('menu'),
          Object.entries(e).forEach(([e, t]) => {
            const i = document.createElement('div');
            i.classList.add('category');
            const r = document.createElement('h4');
            r.classList.add('categoryHeading'),
              (r.innerHTML = e),
              i.prepend(r),
              Array.isArray(t)
                ? t.forEach(e => {
                    const t = document.createElement('div');
                    t.classList.add('draggable'),
                      (t.id = e),
                      t.setAttribute('draggable', 'true'),
                      t.setAttribute('data-component', e);
                    const o = s[e] || `Drag to add ${e}`;
                    if ((t.setAttribute('title', o), n[e])) {
                      t.innerHTML = n[e];
                      const s = t.querySelector('svg');
                      s && s.classList.add('component-icon');
                    } else console.warn(`Icon not found for component: ${e}`);
                    i.appendChild(t);
                  })
                : 'Custom' === e &&
                  'object' == typeof t &&
                  Object.entries(t).forEach(([e, t]) => {
                    const n = document.createElement('div');
                    if (
                      (n.classList.add('draggable', 'custom-component'),
                      (n.id = e),
                      n.setAttribute('draggable', 'true'),
                      n.setAttribute('data-component', e),
                      'string' == typeof t)
                    ) {
                      n.setAttribute('data-tag-name', t),
                        n.setAttribute('title', `Drag to add ${e}`);
                      const s = document.createElement('span');
                      s.classList.add('custom-component-letter'),
                        (s.textContent = e.charAt(0).toUpperCase()),
                        n.appendChild(s);
                    } else {
                      const { component: s, svg: o, title: i } = t;
                      if (
                        (n.setAttribute('data-tag-name', s),
                        n.setAttribute('title', i || `Drag to add ${e}`),
                        o)
                      ) {
                        n.innerHTML = o;
                        const e = n.querySelector('svg');
                        e && e.classList.add('component-icon');
                      } else {
                        const t = document.createElement('span');
                        t.classList.add('custom-component-letter'),
                          (t.textContent = e.charAt(0).toUpperCase()),
                          n.appendChild(t);
                      }
                    }
                    i.appendChild(n);
                  }),
              o.appendChild(i);
          }),
          t.appendChild(o);
      })(this.dynamicComponents),
      C.init(),
      this.sidebar.init(),
      S.init(),
      b.init(),
      !B.headerInitialized)
    ) {
      if (document.getElementById('page-builder-header'))
        B.headerInitialized = !0;
      else {
        const e = document.getElementById('app');
        if (e && e.parentNode) {
          const t = document.createElement('header');
          (t.id = 'page-builder-header'),
            t.appendChild(
              (function () {
                const e = document.createElement('nav');
                e.id = 'preview-navbar';
                const t = {
                    desktop: k.desktop,
                    tablet: k.tablet,
                    mobile: k.mobile,
                    save: k.save,
                    export: k.code,
                    view: k.view,
                    undo: k.undo,
                    redo: k.redo,
                    reset: k.reset,
                  },
                  n = [
                    {
                      id: 'preview-desktop',
                      icon: t.desktop,
                      title: 'Preview in Desktop',
                    },
                    {
                      id: 'preview-tablet',
                      icon: t.tablet,
                      title: 'Preview in Tablet',
                    },
                    {
                      id: 'preview-mobile',
                      icon: t.mobile,
                      title: 'Preview in Mobile',
                    },
                    { id: 'undo-btn', icon: t.undo, title: 'Undo button' },
                    { id: 'redo-btn', icon: t.redo, title: 'Redo button' },
                  ],
                  s = [
                    { id: 'view-btn', icon: t.view, title: 'View' },
                    { id: 'save-btn', icon: t.save, title: 'Save Layout' },
                    { id: 'reset-btn', icon: t.reset, title: 'Reset' },
                    { id: 'export-html-btn', icon: t.export, title: 'Export' },
                  ],
                  o = document.createElement('div');
                o.classList.add('left-buttons'),
                  n.forEach(({ id: e, icon: t, title: n }) => {
                    const s = document.createElement('button');
                    (s.id = e),
                      s.classList.add('preview-btn'),
                      (s.title = n),
                      (s.innerHTML = t);
                    const i = s.querySelector('svg');
                    i && i.classList.add('nav-icon'), o.appendChild(s);
                  });
                const i = document.createElement('div');
                i.classList.add('center-text'),
                  (i.textContent = 'Page Builder');
                const r = document.createElement('div');
                return (
                  r.classList.add('right-buttons'),
                  s.forEach(({ id: e, icon: t, title: n }) => {
                    const s = document.createElement('button');
                    (s.id = e),
                      s.classList.add('preview-btn'),
                      (s.title = n),
                      (s.innerHTML = t);
                    const o = s.querySelector('svg');
                    o && o.classList.add('nav-icon'), r.appendChild(s);
                  }),
                  e.appendChild(o),
                  e.appendChild(i),
                  e.appendChild(r),
                  e
                );
              })()
            ),
            e.parentNode.insertBefore(t, e),
            (B.headerInitialized = !0);
        } else console.error('Error: #app not found in the DOM');
      }
    }
  }
  setupSaveButton() {
    const e = document.getElementById('save-btn');
    e &&
      e.addEventListener('click', () => {
        const e = C.getState();
        this.jsonStorage.save(e), y('Saving progress...');
      });
  }
  setupResetButton() {
    const e = document.getElementById('reset-btn');
    e &&
      e.addEventListener('click', () => {
        !(function (e, t, n) {
          const s = document.getElementById('dialog'),
            o = document.getElementById('dialog-yes'),
            i = document.getElementById('dialog-no'),
            r = document.getElementById('dialog-message');
          r && (r.innerHTML = e),
            null == s || s.classList.remove('hidden'),
            null == o ||
              o.addEventListener('click', () => {
                t(), null == s || s.classList.add('hidden');
              }),
            null == i ||
              i.addEventListener('click', () => {
                n(), null == s || s.classList.add('hidden');
              });
        })(
          'Are you sure you want to reset the layout?',
          () => {
            this.jsonStorage.remove(),
              C.clearCanvas(),
              y('The saved layout has been successfully reset.');
          },
          () => {
            console.log('Layout reset canceled.');
          }
        );
      });
  }
  setupExportHTMLButton() {
    const e = document.getElementById('export-html-btn');
    e &&
      e.addEventListener('click', () => {
        const e = new v(new C()),
          t = e.generateHTML(),
          n = e.generateCSS(),
          s = (function (e) {
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
          o = (function (e) {
            return e
              .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="property">$1</span>')
              .replace(/(:\s*[^;]+;)/g, '<span class="value">$1</span>')
              .replace(/({|})/g, '<span class="bracket">$1</span>');
          })(n),
          i = this.createExportModal(s, o, t, n);
        document.body.appendChild(i), i.classList.add('show');
      });
  }
  createExportModal(e, t, n, s) {
    const o = document.createElement('div');
    (o.id = 'export-dialog'), o.classList.add('modal');
    const i = document.createElement('div');
    i.classList.add('modal-content');
    const r = this.createCloseButton(o);
    i.appendChild(r);
    const l = this.createCodeSection('HTML', e),
      a = this.createCodeSection('CSS', t),
      d = this.createExportToZipButton(n, s);
    i.appendChild(l), i.appendChild(a), i.appendChild(d);
    const c = document.createElement('div');
    return (
      c.classList.add('button-wrapper'),
      c.appendChild(i),
      o.appendChild(c),
      this.setupModalEventListeners(o),
      o
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
    const s = document.createElement('h2');
    s.textContent = e;
    const o = document.createElement('div');
    return (
      o.classList.add('code-block'),
      o.setAttribute('contenteditable', 'true'),
      (o.innerHTML = t),
      n.appendChild(s),
      n.appendChild(o),
      n
    );
  }
  createExportToZipButton(e, t) {
    const n = document.createElement('button');
    return (
      (n.textContent = 'Export to ZIP'),
      n.classList.add('export-btn'),
      n.addEventListener('click', () => {
        const n = M([
            { name: 'index.html', content: e },
            { name: 'styles.css', content: t },
          ]),
          s = document.createElement('a');
        (s.href = URL.createObjectURL(n)),
          (s.download = 'exported-files.zip'),
          s.click(),
          URL.revokeObjectURL(s.href);
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
        '\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100vw;\n      height: 100vh;\n      background: #f5f5f5;\n      z-index: 1000;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: flex-start;\n      padding: 10px;\n    ');
    const n = document.createElement('iframe');
    (n.id = 'preview-iframe'),
      (n.style.cssText =
        '\n      width: 97%;\n      height: 90%;\n      border: none;\n      background: #fff;\n      margin-right: 20px;\n    '),
      (n.srcdoc = e),
      t.appendChild(n);
    const s = this.createPreviewCloseButton(t);
    t.appendChild(s);
    const o = this.createResponsivenessControls(n);
    return t.insertBefore(o, n), t;
  }
  createPreviewCloseButton(e) {
    const t = document.createElement('button');
    (t.id = 'close-modal-btn'),
      (t.textContent = '✕'),
      (t.style.cssText =
        '\n      position: absolute;\n      top: 10px;\n      right: 20px;\n      font-size: 20px;\n      border: none;\n      background: none;\n      cursor: pointer;\n    ');
    const n = () => {
      setTimeout(() => e.remove(), 300),
        document.removeEventListener('keydown', s);
    };
    t.addEventListener('click', n);
    const s = e => {
      'Escape' === e.key && n();
    };
    return document.addEventListener('keydown', s), t;
  }
  createResponsivenessControls(e) {
    const t = document.createElement('div');
    t.style.cssText =
      '\n      display: flex;\n      gap: 10px;\n      margin-bottom: 10px;\n    ';
    return (
      [
        { icon: k.mobile, title: 'Desktop', width: '375px', height: '90%' },
        { icon: k.tablet, title: 'Tablet', width: '768px', height: '90%' },
        { icon: k.desktop, title: 'Mobile', width: '97%', height: '90%' },
      ].forEach(n => {
        const s = document.createElement('button');
        (s.style.cssText =
          '\n        padding: 5px;\n        border: none;\n        background: none;\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      '),
          (s.title = n.title);
        const o = document.createElement('div');
        o.innerHTML = n.icon;
        const i = o.querySelector('svg');
        i &&
          ((i.style.width = '24px'),
          (i.style.height = '24px'),
          i.classList.add('component-icon')),
          s.appendChild(o),
          s.addEventListener('click', () => {
            (e.style.width = n.width), (e.style.height = n.height);
          }),
          t.appendChild(s);
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
        C.historyManager.undo();
      }),
      t &&
        t.addEventListener('click', () => {
          C.historyManager.redo();
        });
  }
}
B.headerInitialized = !1;
const I = new B();
(exports.PageBuilder = B), (exports.PageBuilderCore = I);

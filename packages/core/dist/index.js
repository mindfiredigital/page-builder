'use strict';
class e {
  constructor(e, t) {
    (this.canvas = e), (this.sidebar = t);
  }
  enable() {
    this.sidebar.querySelectorAll('.draggable').forEach(e => {
      e.addEventListener('dragstart', t => {
        var n, r;
        const l = t;
        console.log(`Dragging component: ${e.id}`),
          null === (n = l.dataTransfer) ||
            void 0 === n ||
            n.setData('component-type', e.id);
        const a = e.getAttribute('data-component-settings');
        a &&
          (null === (r = l.dataTransfer) ||
            void 0 === r ||
            r.setData('custom-settings', a),
          console.log('Setting custom settings from DOM:', JSON.parse(a)));
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
    const r = `image-container-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    (t.id = r),
      (t.style.width = '300px'),
      (t.style.height = '300px'),
      (t.style.position = 'relative'),
      (t.style.backgroundColor = e ? 'transparent' : '#f0f0f0'),
      (t.style.display = 'flex'),
      (t.style.border = 'none'),
      (t.style.alignItems = 'center'),
      (t.style.justifyContent = 'center');
    const l = document.createElement('div');
    (l.style.color = '#666666'),
      (l.style.border = 'none'),
      (l.style.display = e ? 'none' : 'block');
    const a = document.createElement('input');
    (a.type = 'file'),
      (a.accept = 'image/*'),
      (a.style.display = 'none'),
      a.addEventListener('change', e => n.handleFileChange(e, t, l));
    const o = document.createElement('button');
    o.classList.add('upload-btn'),
      (o.innerHTML = '🖊️'),
      (o.style.position = 'absolute'),
      (o.style.padding = '8px'),
      (o.style.background = 'transparent'),
      (o.style.border = 'none'),
      (o.style.cursor = 'pointer'),
      (o.style.opacity = '0'),
      (o.style.transition = 'opacity 0.2s'),
      (o.style.left = '50%'),
      (o.style.top = '50%'),
      (o.style.transform = 'translate(-50%, -50%)'),
      (o.style.fontSize = '24px'),
      o.addEventListener('click', () => a.click());
    const i = document.createElement('img'),
      s = `${r}-img`;
    return (
      (i.id = s),
      (i.style.width = '100%'),
      (i.style.height = '100%'),
      (i.style.objectFit = 'contain'),
      (i.style.border = 'none'),
      (i.style.display = 'none'),
      e && ((i.src = e), (i.style.display = 'block')),
      t.addEventListener('mouseenter', () => {
        o.style.opacity = '1';
      }),
      t.addEventListener('mouseleave', () => {
        o.style.opacity = '0';
      }),
      t.appendChild(l),
      t.appendChild(a),
      t.appendChild(o),
      t.appendChild(i),
      t
    );
  }
  static handleFileChange(e, t, n) {
    const r = e.target,
      l = r.files ? r.files[0] : null;
    if (l) {
      const e = new FileReader();
      (e.onload = function () {
        const r = e.result,
          l = t.querySelector('img');
        l &&
          ((l.src = r),
          (l.style.display = 'block'),
          (n.style.display = 'none'),
          (t.style.backgroundColor = 'transparent'));
      }),
        e.readAsDataURL(l);
    }
  }
  static restoreImageUpload(e, t) {
    const n = e.querySelector('div:not(.upload-btn)'),
      r = e.querySelector('input[type="file"]'),
      l = e.querySelector('.upload-btn'),
      a = e.querySelector('img');
    r.addEventListener('change', t => this.handleFileChange(t, e, n)),
      l.addEventListener('click', () => r.click()),
      t
        ? ((a.src = t),
          (a.style.display = 'block'),
          (n.style.display = 'none'),
          (e.style.backgroundColor = 'transparent'))
        : ((a.style.display = 'none'),
          (n.style.display = 'block'),
          (e.style.backgroundColor = '#f0f0f0')),
      e.addEventListener('mouseenter', () => {
        l.style.opacity = '1';
      }),
      e.addEventListener('mouseleave', () => {
        l.style.opacity = '0';
      });
  }
}
class r {
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
    const r = document.createElement('div');
    r.classList.add('upload-text'), (r.innerText = e ? '' : 'Upload Video');
    const l = document.createElement('video');
    (l.controls = !0),
      (l.style.width = '100%'),
      (l.style.height = '100%'),
      (l.style.display = e ? 'block' : 'none'),
      e && (l.src = e);
    const a = document.createElement('button');
    return (
      (a.innerHTML = '🖊️'),
      a.classList.add('pencil-button'),
      a.addEventListener('click', () => n.click()),
      t.appendChild(r),
      t.appendChild(n),
      t.appendChild(l),
      t.appendChild(a),
      t
    );
  }
  handleFileChange(e, t) {
    const n = e.target,
      r = n.files ? n.files[0] : null;
    if (r && r.type.startsWith('video/')) {
      const e = new FileReader();
      (e.onload = () => {
        const n = t.querySelector('video'),
          r = t.querySelector('.upload-text');
        (n.src = e.result),
          (n.style.display = 'block'),
          (r.style.display = 'none');
      }),
        e.readAsDataURL(r);
    } else alert('Please upload a valid video file.');
  }
}
class l {
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
class a {
  create(e = 1, t = 'Header') {
    const n = document.createElement(`h${e}`);
    return (n.innerText = t), n.classList.add('header-component'), n;
  }
}
class o {
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
            r = this.originalHeight + n;
          e > this.MINIMUM_SIZE && (this.element.style.width = `${e}px`),
            r > this.MINIMUM_SIZE && (this.element.style.height = `${r}px`);
        } else if (this.currentResizer.classList.contains('bottom-left')) {
          const e = this.originalHeight + n,
            r = this.originalWidth - t;
          e > this.MINIMUM_SIZE && (this.element.style.height = `${e}px`),
            r > this.MINIMUM_SIZE &&
              ((this.element.style.width = `${r}px`),
              (this.element.style.left = `${this.originalX + t}px`));
        } else if (this.currentResizer.classList.contains('top-right')) {
          const e = this.originalWidth + t,
            r = this.originalHeight - n;
          e > this.MINIMUM_SIZE && (this.element.style.width = `${e}px`),
            r > this.MINIMUM_SIZE &&
              ((this.element.style.height = `${r}px`),
              (this.element.style.top = `${this.originalY + n}px`));
        } else if (this.currentResizer.classList.contains('top-left')) {
          const e = this.originalWidth - t,
            r = this.originalHeight - n;
          e > this.MINIMUM_SIZE &&
            ((this.element.style.width = `${e}px`),
            (this.element.style.left = `${this.originalX + t}px`)),
            r > this.MINIMUM_SIZE &&
              ((this.element.style.height = `${r}px`),
              (this.element.style.top = `${this.originalY + n}px`));
        }
      }),
      (this.stopResize = () => {
        window.removeEventListener('mousemove', this.resize),
          window.removeEventListener('mouseup', this.stopResize),
          (this.currentResizer = null),
          U.historyManager.captureState();
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
      r = 0,
      l = 0,
      a = 0;
    const o = o => {
        if (!t) return;
        const i = o.clientX - n,
          s = o.clientY - r;
        e.style.transform = `translate(${l + i}px, ${a + s}px)`;
      },
      i = () => {
        (t = !1),
          window.removeEventListener('mousemove', o),
          window.removeEventListener('mouseup', i);
      };
    e.addEventListener('mousedown', s => {
      s.preventDefault(),
        s.stopPropagation(),
        (t = !0),
        (n = s.clientX),
        (r = s.clientY);
      const u = e.getBoundingClientRect();
      (l = u.left),
        (a = u.top),
        window.addEventListener('mousemove', o),
        window.addEventListener('mouseup', i);
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
    const r = U.createComponent(n);
    if (!r) return;
    const l = this.element.classList[2],
      a = U.generateUniqueClass(n, !0, l);
    r.classList.add(a);
    const o = document.createElement('span');
    (o.className = 'component-label'),
      (o.textContent = a),
      (r.id = a),
      (o.style.display = 'none'),
      r.appendChild(o),
      r.addEventListener('mouseenter', e => this.showLabel(e, r)),
      r.addEventListener('mouseleave', e => this.hideLabel(e, r)),
      this.element.appendChild(r),
      this.makeDraggable(r),
      U.historyManager.captureState();
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
    const r = new o();
    (r.element = e), (r.resizers = n), r.addResizeHandles(), e.appendChild(n);
  }
  static restoreContainer(e) {
    o.restoreResizer(e);
    const t = new o();
    t.element = e;
    e.querySelectorAll('.editable-component').forEach(e => {
      var r;
      if (
        (U.controlsManager.addControlButtons(e),
        U.addDraggableListeners(e),
        e.addEventListener('mouseenter', n => t.showLabel(n, e)),
        e.addEventListener('mouseleave', n => t.hideLabel(n, e)),
        e.classList.contains('image-component'))
      ) {
        const t =
          (null === (r = e.querySelector('img')) || void 0 === r
            ? void 0
            : r.getAttribute('src')) || '';
        n.restoreImageUpload(e, t);
      }
      e.classList.contains('container-component') && this.restoreContainer(e);
    });
  }
}
class i {
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
    const r = U.createComponent(n);
    if (!r) return;
    const l = e.target;
    if (l && l.classList.contains('column')) {
      l.appendChild(r);
      const e = `${this.element.id}-${`c${Array.from(l.parentElement.children).indexOf(l)}`}`;
      (l.id = e), l.classList.add(e);
      let t = l.querySelector('.column-label');
      t ||
        ((t = document.createElement('span')),
        (t.className = 'column-label'),
        l.appendChild(t)),
        (t.textContent = e);
      const a = U.generateUniqueClass(n, !0, e);
      r.classList.add(a), (r.id = a);
      let o = r.querySelector('.component-label');
      o ||
        ((o = document.createElement('span')),
        (o.className = 'component-label'),
        r.appendChild(o)),
        (o.textContent = a),
        U.historyManager.captureState();
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
        (U.controlsManager.addControlButtons(e),
        U.addDraggableListeners(e),
        e.classList.contains('image-component'))
      ) {
        const r =
          (null === (t = e.querySelector('img')) || void 0 === t
            ? void 0
            : t.getAttribute('src')) || '';
        n.restoreImageUpload(e, r);
      }
    });
  }
}
class s extends i {
  constructor() {
    super(2, 'twoCol-component');
  }
}
class u extends i {
  constructor() {
    super(3, 'threeCol-component');
  }
}
class c {
  create(e, t, n = !1) {
    const r = document.createElement('div');
    r.classList.add('table-component');
    const l = document.createElement('table');
    (l.style.width = '100%'), (l.style.borderCollapse = 'collapse');
    for (let n = 0; n < e; n++) {
      const e = document.createElement('tr');
      for (let r = 0; r < t; r++) {
        const t = document.createElement('td');
        (t.textContent = `R${n + 1}C${r + 1}`),
          (t.style.border = '1px solid #000'),
          (t.style.padding = '8px'),
          e.appendChild(t);
      }
      l.appendChild(e);
    }
    if ((r.appendChild(l), !n)) {
      const e = document.createElement('div');
      e.classList.add('button-container'),
        (e.style.marginTop = '10px'),
        (e.style.display = 'flex'),
        (e.style.gap = '10px');
      const t = document.createElement('button');
      (t.textContent = 'Add Row'),
        t.addEventListener('click', () => this.addRow(l)),
        e.appendChild(t);
      const n = document.createElement('button');
      (n.textContent = 'Add Column'),
        n.addEventListener('click', () => this.addColumn(l)),
        e.appendChild(n),
        r.appendChild(e);
    }
    return r;
  }
  addRow(e) {
    var t;
    const n = e.rows.length,
      r =
        (null === (t = e.rows[0]) || void 0 === t ? void 0 : t.cells.length) ||
        0,
      l = document.createElement('tr');
    for (let e = 0; e < r; e++) {
      const t = document.createElement('td');
      (t.textContent = `R${n + 1}C${e + 1}`),
        (t.style.border = '1px solid #000'),
        (t.style.padding = '8px'),
        l.appendChild(t);
    }
    e.appendChild(l);
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
  setRowCount(e, t) {
    var n;
    if (!e) return;
    const r = e.rows.length,
      l =
        (null === (n = e.rows[0]) || void 0 === n ? void 0 : n.cells.length) ||
        0;
    if ((t < 0 && (t = 0), t > r))
      for (let n = r; n < t; n++) {
        const t = document.createElement('tr');
        for (let e = 0; e < l; e++) {
          const r = document.createElement('td');
          (r.textContent = `R${n + 1}C${e + 1}`),
            (r.style.border = '1px solid #000'),
            (r.style.padding = '8px'),
            t.appendChild(r);
        }
        e.appendChild(t);
      }
    else if (t < r) for (let n = r - 1; n >= t; n--) e.deleteRow(n);
  }
  setColumnCount(e, t) {
    if (!e || 0 === e.rows.length) return;
    const n = e.rows.length,
      r = e.rows[0].cells.length;
    t < 0 && (t = 0);
    for (let l = 0; l < n; l++) {
      const n = e.rows[l];
      if (t > r)
        for (let e = r; e < t; e++) {
          const t = document.createElement('td');
          (t.textContent = `R${l + 1}C${e + 1}`),
            (t.style.border = '1px solid #000'),
            (t.style.padding = '8px'),
            n.appendChild(t);
        }
      else if (t < r) for (let e = r - 1; e >= t; e--) n.deleteCell(e);
    }
  }
  createHeder(e) {
    var t;
    if (!e || 0 === e.rows.length) return;
    const n = e.rows[0];
    for (let e = 0; e < n.cells.length; e++) {
      const r = n.cells[e],
        l = document.createElement('th');
      l.innerHTML = r.innerHTML;
      for (const e of Array.from(r.attributes)) l.setAttribute(e.name, e.value);
      null === (t = r.parentNode) || void 0 === t || t.replaceChild(l, r);
    }
  }
  static restore(e) {
    const t = new c(),
      n = e.querySelector('table');
    if (!n) return void console.error('No table found in container');
    const r = e.querySelector('.button-container');
    if (!r) return void console.error('No button container found');
    r.querySelectorAll('button').forEach(e => {
      var r;
      const l = e.cloneNode(!0);
      null === (r = e.parentNode) || void 0 === r || r.replaceChild(l, e),
        'Add Row' === l.textContent
          ? l.addEventListener('click', () => t.addRow(n))
          : 'Add Column' === l.textContent &&
            l.addEventListener('click', () => t.addColumn(n));
    });
  }
}
class d {
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
    const r = document.createElement('button');
    (r.innerHTML = '🖊️'), r.classList.add('edit-link');
    const l = document.createElement('div');
    l.classList.add('edit-link-form');
    const a = document.createElement('input');
    (a.type = 'url'), (a.value = e), (a.placeholder = 'Enter URL');
    const o = document.createElement('input');
    o.type = 'checkbox';
    const i = document.createElement('label');
    (i.innerHTML = 'Open in new tab'), i.appendChild(o);
    const s = document.createElement('button');
    return (
      (s.innerHTML = 'Save'),
      l.appendChild(a),
      l.appendChild(i),
      l.appendChild(s),
      r.addEventListener('click', e => {
        e.preventDefault(),
          (this.isEditing = !0),
          this.link && (this.link.style.display = 'none'),
          (r.style.display = 'none'),
          (l.style.display = 'flex');
      }),
      s.addEventListener('click', e => {
        e.preventDefault(),
          e.stopPropagation(),
          (this.isEditing = !1),
          this.link &&
            ((this.link.href = a.value),
            (this.link.style.display = 'inline'),
            (this.link.target = o.checked ? '_blank' : '_self')),
          (r.style.display = 'inline-flex'),
          (l.style.display = 'none');
      }),
      n.appendChild(this.link),
      n.appendChild(r),
      n.appendChild(l),
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
    const r = e.querySelector('.link-component-label'),
      l = e.querySelector('.edit-link'),
      a = e.querySelector('.edit-link-form'),
      o = a.querySelector('button'),
      i = a.querySelector('input[type="url"]'),
      s = a.querySelector('input[type="checkbox"]');
    if (!(r && l && a && o && i && s))
      return void console.error('Required elements not found');
    (r.style.display = 'inline'),
      (l.style.display = 'inline-flex'),
      (a.style.display = 'none');
    const u = l.cloneNode(!0),
      c = o.cloneNode(!0);
    null === (t = l.parentNode) || void 0 === t || t.replaceChild(u, l),
      null === (n = o.parentNode) || void 0 === n || n.replaceChild(c, o),
      u.addEventListener('click', e => {
        e.preventDefault(),
          (r.style.display = 'none'),
          (u.style.display = 'none'),
          (a.style.display = 'flex');
      }),
      c.addEventListener('click', e => {
        e.preventDefault(),
          e.stopPropagation(),
          (r.href = i.value),
          (r.style.display = 'inline'),
          (r.target = s.checked ? '_blank' : '_self'),
          (u.style.display = 'inline-flex'),
          (a.style.display = 'none');
      });
  }
}
class f {
  create() {
    const e = e => {
        let t,
          n,
          r,
          l,
          a = !1,
          o = !1,
          i = 0,
          s = 0;
        (e.style.position = 'relative'),
          (e.style.cursor = 'move'),
          e.addEventListener('mousedown', r => {
            o ||
              ((a = !0),
              (t = r.clientX),
              (n = r.clientY),
              (i = parseFloat(e.getAttribute('data-x') || '0')),
              (s = parseFloat(e.getAttribute('data-y') || '0')),
              document.addEventListener('mousemove', u),
              document.addEventListener('mouseup', c));
          });
        const u = r => {
            if (a) {
              const l = r.clientX - t,
                a = r.clientY - n,
                o = i + l,
                u = s + a;
              (e.style.transform = `translate(${o}px, ${u}px)`),
                e.setAttribute('data-x', o.toString()),
                e.setAttribute('data-y', u.toString());
            }
          },
          c = () => {
            (a = !1),
              document.removeEventListener('mousemove', u),
              document.removeEventListener('mouseup', c);
          };
        if (e.classList.contains('container')) {
          const a = document.createElement('div');
          Object.assign(a.style, {
            width: '10px',
            height: '10px',
            background: 'blue',
            position: 'absolute',
            right: '0',
            bottom: '0',
            cursor: 'se-resize',
          }),
            e.appendChild(a),
            a.addEventListener('mousedown', a => {
              a.stopPropagation(),
                (o = !0),
                (r = e.offsetWidth),
                (l = e.offsetHeight),
                (t = a.clientX),
                (n = a.clientY),
                document.addEventListener('mousemove', i),
                document.addEventListener('mouseup', s);
            });
          const i = a => {
              if (o) {
                const o = r + (a.clientX - t),
                  i = l + (a.clientY - n);
                (e.style.width = `${o}px`), (e.style.height = `${i}px`);
              }
            },
            s = () => {
              (o = !1),
                document.removeEventListener('mousemove', i),
                document.removeEventListener('mouseup', s);
            };
        }
      },
      n = new o().create();
    n.classList.add('container'),
      Object.assign(n.style, {
        width: '100%',
        maxWidth: 'none',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Roboto', sans-serif",
      }),
      e(n);
    const r = new o().create();
    r.classList.add('container'),
      Object.assign(r.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        width: '100%',
      }),
      e(r);
    const a = new t('MyBrand').create();
    Object.assign(a.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    });
    const i = new o().create();
    i.classList.add('container'),
      Object.assign(i.style, { display: 'flex', gap: '20px' }),
      e(i),
      ['Home', 'Features', 'Contact'].forEach(e => {
        const n = new t(e).create();
        Object.assign(n.style, {
          cursor: 'pointer',
          color: '#555',
          textDecoration: 'none',
        }),
          i.appendChild(n);
      }),
      r.appendChild(a),
      r.appendChild(i);
    const s = new o().create();
    s.classList.add('container'),
      Object.assign(s.style, {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        marginBottom: '40px',
      }),
      e(s);
    const u = new t('Welcome to My Landing Page').create();
    Object.assign(u.style, {
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
    const d = new l().create();
    Object.assign(d.style, {
      padding: '12px 24px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }),
      d.addEventListener('mouseenter', () => {
        d.style.backgroundColor = '#0056b3';
      }),
      d.addEventListener('mouseleave', () => {
        d.style.backgroundColor = '#007bff';
      }),
      s.appendChild(u),
      s.appendChild(c),
      s.appendChild(d);
    const f = new o().create();
    f.classList.add('container'),
      Object.assign(f.style, {
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
      }),
      e(f);
    const p = new t('© 2025 MyBrand. All rights reserved.').create();
    return (
      Object.assign(p.style, { fontSize: '14px', color: '#999' }),
      f.appendChild(p),
      n.appendChild(r),
      n.appendChild(s),
      n.appendChild(f),
      n
    );
  }
}
class p {
  constructor(e) {
    (this.undoStack = []), (this.redoStack = []), (this.canvas = e);
  }
  captureState() {
    const e = U.getState();
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
      U.restoreState(t);
    } else if (1 === this.undoStack.length) {
      const e = this.undoStack.pop();
      this.redoStack.push(e);
      const t = U.jsonStorage.load();
      t ? U.restoreState(t) : U.restoreState([]);
    } else console.warn('No more actions to undo.');
  }
  redo() {
    if (this.redoStack.length > 0) {
      const e = this.redoStack.pop();
      this.undoStack.push(e), U.restoreState(e);
    } else console.warn('No more actions to redo.');
  }
}
class h {
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
class m {
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
    const r = this.createDeleteIcon(e);
    n.appendChild(r);
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
        t.stopPropagation(), console.log('clciked'), this.handleDelete(e);
      }),
      t
    );
  }
  handleDelete(e) {
    this.canvas.historyManager.captureState(), e.remove();
    const t = this.canvas.getComponents().filter(t => t !== e);
    this.canvas.setComponents(t),
      this.canvas.historyManager.captureState(),
      console.log('event'),
      this.canvas.dispatchDesignChange();
  }
}
function g(e) {
  const t = document.getElementById('notification');
  t &&
    ((t.innerHTML = e),
    t.classList.add('visible'),
    t.classList.remove('hidden'),
    setTimeout(() => {
      t.classList.remove('visible'), t.classList.add('hidden');
    }, 2e3));
}
function v(e, t) {
  let n = null;
  return (...r) => {
    n && clearTimeout(n), (n = setTimeout(() => e(...r), t));
  };
}
class y {
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
    Array.from(e.children).forEach(r => {
      const l = r;
      t.forEach(e => {
        l.removeAttribute(e);
      }),
        n.forEach(e => {
          l.classList.remove(e);
        });
      e.querySelectorAll('input').forEach(e => e.remove());
      l
        .querySelectorAll(
          '.component-controls, .delete-icon, .component-label,.column-label, .resizers, .resizer, .drop-preview, .upload-btn, component-resizer,.edit-link, .edit-link-form'
        )
        .forEach(e => e.remove()),
        l.children.length > 0 && this.cleanupElements(l);
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
    const r = e.querySelectorAll('*'),
      l = [
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
      a = [
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
      r.forEach(e => {
        if (a.some(t => e.classList.contains(t))) return;
        const t = window.getComputedStyle(e),
          r = [];
        l.forEach(e => {
          const n = t.getPropertyValue(e);
          if (n && 'none' !== n && '' !== n) {
            if ('resize' === e) return;
            r.push(`${e}: ${n};`);
          }
        });
        const o = this.generateUniqueSelector(e);
        r.length > 0 &&
          n.push(`\n        ${o} {\n          ${r.join('\n  ')}\n        }`);
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
class b {
  constructor(e = '#layers-view', t = '#canvas') {
    this.initializeElements(e, t);
  }
  initializeElements(e, t) {
    (b.layersView = document.querySelector(e)),
      b.layersView ||
        ((b.layersView = document.createElement('div')),
        (b.layersView.id = 'layers-view'),
        (b.layersView.className = 'layers-view'),
        document.body.appendChild(b.layersView),
        console.warn(`Layers view element created: ${e}`)),
      (b.canvasRoot = document.querySelector(t)),
      b.canvasRoot ||
        (console.error(`Canvas root element not found: ${t}`),
        (b.canvasRoot = document.body));
  }
  static buildLayerHierarchyFromDOM(e) {
    const t = new y(new U()).generateHTML(),
      n = new DOMParser().parseFromString(t, 'text/html'),
      r = (e, t = 0) => {
        var n;
        const l = e;
        if (!l.id) return null;
        const a = {
          id: l.id,
          isVisible:
            'none' !==
            (null === (n = l.style) || void 0 === n ? void 0 : n.display),
          isLocked: 'true' === l.getAttribute('data-locked'),
          depth: t,
          children: [],
        };
        return (
          Array.from(e.children).forEach(e => {
            const n = r(e, t + 1);
            n && a.children.push(n);
          }),
          a
        );
      };
    return Array.from(n.body.children)
      .map(e => r(e))
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
    const r = document.createElement('ul');
    (r.className = 'layer-list'),
      e.appendChild(r),
      t.forEach(e => {
        const t = document.createElement('li');
        (t.className = 'layer-item-container'), r.appendChild(t);
        const l = this.createLayerItemElement(e);
        if (
          ((l.style.paddingLeft = 12 * n + 'px'),
          t.appendChild(l),
          e.children && e.children.length > 0)
        ) {
          const r = document.createElement('span');
          (r.className = 'layer-expand-toggle'),
            (r.textContent = '▶'),
            l.insertBefore(r, l.firstChild);
          const a = document.createElement('div');
          (a.className = 'child-container'),
            (a.style.display = 'none'),
            t.appendChild(a),
            this.renderLayerItems(a, e.children, n + 1),
            r.addEventListener('click', () => {
              'block' === a.style.display
                ? ((a.style.display = 'none'), (r.textContent = '▶'))
                : ((a.style.display = 'block'), (r.textContent = '▼'));
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
    const r = document.createElement('span');
    (r.className = 'layer-name'),
      (r.textContent = `${e.id}`),
      r.addEventListener('click', () => this.selectLayer(e));
    const l = document.createElement('span');
    return (
      (l.className = 'layer-lock'),
      (l.innerHTML = e.isLocked ? '🔒' : '🔓'),
      l.addEventListener('click', () => this.toggleLayerLock(e)),
      (t.draggable = !0),
      t.addEventListener('dragstart', t => this.handleDragStart(t, e)),
      t.addEventListener('dragover', this.handleDragOver),
      t.addEventListener('drop', t => this.handleDrop(t, e)),
      t.appendChild(n),
      t.appendChild(r),
      t.appendChild(l),
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
    const r = parseInt(
        (null === (n = e.dataTransfer) || void 0 === n
          ? void 0
          : n.getData('text/plain')) || '-1'
      ),
      l = parseInt(t.id || '-1');
    U.reorderComponent(r, l), this.updateLayersView();
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
(b.layersView = null), (b.canvasRoot = null), (b.draggedItem = null);
var w,
  k,
  C = {},
  E = { exports: {} },
  x = {},
  S = { exports: {} },
  L = {};
function M() {
  if (w) return L;
  w = 1;
  var e = Symbol.for('react.element'),
    t = Symbol.for('react.portal'),
    n = Symbol.for('react.fragment'),
    r = Symbol.for('react.strict_mode'),
    l = Symbol.for('react.profiler'),
    a = Symbol.for('react.provider'),
    o = Symbol.for('react.context'),
    i = Symbol.for('react.forward_ref'),
    s = Symbol.for('react.suspense'),
    u = Symbol.for('react.memo'),
    c = Symbol.for('react.lazy'),
    d = Symbol.iterator;
  var f = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    p = Object.assign,
    h = {};
  function m(e, t, n) {
    (this.props = e),
      (this.context = t),
      (this.refs = h),
      (this.updater = n || f);
  }
  function g() {}
  function v(e, t, n) {
    (this.props = e),
      (this.context = t),
      (this.refs = h),
      (this.updater = n || f);
  }
  (m.prototype.isReactComponent = {}),
    (m.prototype.setState = function (e, t) {
      if ('object' != typeof e && 'function' != typeof e && null != e)
        throw Error(
          'setState(...): takes an object of state variables to update or a function which returns an object of state variables.'
        );
      this.updater.enqueueSetState(this, e, t, 'setState');
    }),
    (m.prototype.forceUpdate = function (e) {
      this.updater.enqueueForceUpdate(this, e, 'forceUpdate');
    }),
    (g.prototype = m.prototype);
  var y = (v.prototype = new g());
  (y.constructor = v), p(y, m.prototype), (y.isPureReactComponent = !0);
  var b = Array.isArray,
    k = Object.prototype.hasOwnProperty,
    C = { current: null },
    E = { key: !0, ref: !0, __self: !0, __source: !0 };
  function x(t, n, r) {
    var l,
      a = {},
      o = null,
      i = null;
    if (null != n)
      for (l in (void 0 !== n.ref && (i = n.ref),
      void 0 !== n.key && (o = '' + n.key),
      n))
        k.call(n, l) && !E.hasOwnProperty(l) && (a[l] = n[l]);
    var s = arguments.length - 2;
    if (1 === s) a.children = r;
    else if (1 < s) {
      for (var u = Array(s), c = 0; c < s; c++) u[c] = arguments[c + 2];
      a.children = u;
    }
    if (t && t.defaultProps)
      for (l in (s = t.defaultProps)) void 0 === a[l] && (a[l] = s[l]);
    return {
      $$typeof: e,
      type: t,
      key: o,
      ref: i,
      props: a,
      _owner: C.current,
    };
  }
  function S(t) {
    return 'object' == typeof t && null !== t && t.$$typeof === e;
  }
  var M = /\/+/g;
  function z(e, t) {
    return 'object' == typeof e && null !== e && null != e.key
      ? (function (e) {
          var t = { '=': '=0', ':': '=2' };
          return (
            '$' +
            e.replace(/[=:]/g, function (e) {
              return t[e];
            })
          );
        })('' + e.key)
      : t.toString(36);
  }
  function T(n, r, l, a, o) {
    var i = typeof n;
    ('undefined' !== i && 'boolean' !== i) || (n = null);
    var s = !1;
    if (null === n) s = !0;
    else
      switch (i) {
        case 'string':
        case 'number':
          s = !0;
          break;
        case 'object':
          switch (n.$$typeof) {
            case e:
            case t:
              s = !0;
          }
      }
    if (s)
      return (
        (o = o((s = n))),
        (n = '' === a ? '.' + z(s, 0) : a),
        b(o)
          ? ((l = ''),
            null != n && (l = n.replace(M, '$&/') + '/'),
            T(o, r, l, '', function (e) {
              return e;
            }))
          : null != o &&
            (S(o) &&
              (o = (function (t, n) {
                return {
                  $$typeof: e,
                  type: t.type,
                  key: n,
                  ref: t.ref,
                  props: t.props,
                  _owner: t._owner,
                };
              })(
                o,
                l +
                  (!o.key || (s && s.key === o.key)
                    ? ''
                    : ('' + o.key).replace(M, '$&/') + '/') +
                  n
              )),
            r.push(o)),
        1
      );
    if (((s = 0), (a = '' === a ? '.' : a + ':'), b(n)))
      for (var u = 0; u < n.length; u++) {
        var c = a + z((i = n[u]), u);
        s += T(i, r, l, c, o);
      }
    else if (
      ((c = (function (e) {
        return null === e || 'object' != typeof e
          ? null
          : 'function' == typeof (e = (d && e[d]) || e['@@iterator'])
            ? e
            : null;
      })(n)),
      'function' == typeof c)
    )
      for (n = c.call(n), u = 0; !(i = n.next()).done; )
        s += T((i = i.value), r, l, (c = a + z(i, u++)), o);
    else if ('object' === i)
      throw (
        ((r = String(n)),
        Error(
          'Objects are not valid as a React child (found: ' +
            ('[object Object]' === r
              ? 'object with keys {' + Object.keys(n).join(', ') + '}'
              : r) +
            '). If you meant to render a collection of children, use an array instead.'
        ))
      );
    return s;
  }
  function _(e, t, n) {
    if (null == e) return e;
    var r = [],
      l = 0;
    return (
      T(e, r, '', '', function (e) {
        return t.call(n, e, l++);
      }),
      r
    );
  }
  function P(e) {
    if (-1 === e._status) {
      var t = e._result;
      (t = t()).then(
        function (t) {
          (0 !== e._status && -1 !== e._status) ||
            ((e._status = 1), (e._result = t));
        },
        function (t) {
          (0 !== e._status && -1 !== e._status) ||
            ((e._status = 2), (e._result = t));
        }
      ),
        -1 === e._status && ((e._status = 0), (e._result = t));
    }
    if (1 === e._status) return e._result.default;
    throw e._result;
  }
  var N = { current: null },
    I = { transition: null },
    R = {
      ReactCurrentDispatcher: N,
      ReactCurrentBatchConfig: I,
      ReactCurrentOwner: C,
    };
  function H() {
    throw Error('act(...) is not supported in production builds of React.');
  }
  return (
    (L.Children = {
      map: _,
      forEach: function (e, t, n) {
        _(
          e,
          function () {
            t.apply(this, arguments);
          },
          n
        );
      },
      count: function (e) {
        var t = 0;
        return (
          _(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          _(e, function (e) {
            return e;
          }) || []
        );
      },
      only: function (e) {
        if (!S(e))
          throw Error(
            'React.Children.only expected to receive a single React element child.'
          );
        return e;
      },
    }),
    (L.Component = m),
    (L.Fragment = n),
    (L.Profiler = l),
    (L.PureComponent = v),
    (L.StrictMode = r),
    (L.Suspense = s),
    (L.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = R),
    (L.act = H),
    (L.cloneElement = function (t, n, r) {
      if (null == t)
        throw Error(
          'React.cloneElement(...): The argument must be a React element, but you passed ' +
            t +
            '.'
        );
      var l = p({}, t.props),
        a = t.key,
        o = t.ref,
        i = t._owner;
      if (null != n) {
        if (
          (void 0 !== n.ref && ((o = n.ref), (i = C.current)),
          void 0 !== n.key && (a = '' + n.key),
          t.type && t.type.defaultProps)
        )
          var s = t.type.defaultProps;
        for (u in n)
          k.call(n, u) &&
            !E.hasOwnProperty(u) &&
            (l[u] = void 0 === n[u] && void 0 !== s ? s[u] : n[u]);
      }
      var u = arguments.length - 2;
      if (1 === u) l.children = r;
      else if (1 < u) {
        s = Array(u);
        for (var c = 0; c < u; c++) s[c] = arguments[c + 2];
        l.children = s;
      }
      return { $$typeof: e, type: t.type, key: a, ref: o, props: l, _owner: i };
    }),
    (L.createContext = function (e) {
      return (
        ((e = {
          $$typeof: o,
          _currentValue: e,
          _currentValue2: e,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null,
        }).Provider = { $$typeof: a, _context: e }),
        (e.Consumer = e)
      );
    }),
    (L.createElement = x),
    (L.createFactory = function (e) {
      var t = x.bind(null, e);
      return (t.type = e), t;
    }),
    (L.createRef = function () {
      return { current: null };
    }),
    (L.forwardRef = function (e) {
      return { $$typeof: i, render: e };
    }),
    (L.isValidElement = S),
    (L.lazy = function (e) {
      return { $$typeof: c, _payload: { _status: -1, _result: e }, _init: P };
    }),
    (L.memo = function (e, t) {
      return { $$typeof: u, type: e, compare: void 0 === t ? null : t };
    }),
    (L.startTransition = function (e) {
      var t = I.transition;
      I.transition = {};
      try {
        e();
      } finally {
        I.transition = t;
      }
    }),
    (L.unstable_act = H),
    (L.useCallback = function (e, t) {
      return N.current.useCallback(e, t);
    }),
    (L.useContext = function (e) {
      return N.current.useContext(e);
    }),
    (L.useDebugValue = function () {}),
    (L.useDeferredValue = function (e) {
      return N.current.useDeferredValue(e);
    }),
    (L.useEffect = function (e, t) {
      return N.current.useEffect(e, t);
    }),
    (L.useId = function () {
      return N.current.useId();
    }),
    (L.useImperativeHandle = function (e, t, n) {
      return N.current.useImperativeHandle(e, t, n);
    }),
    (L.useInsertionEffect = function (e, t) {
      return N.current.useInsertionEffect(e, t);
    }),
    (L.useLayoutEffect = function (e, t) {
      return N.current.useLayoutEffect(e, t);
    }),
    (L.useMemo = function (e, t) {
      return N.current.useMemo(e, t);
    }),
    (L.useReducer = function (e, t, n) {
      return N.current.useReducer(e, t, n);
    }),
    (L.useRef = function (e) {
      return N.current.useRef(e);
    }),
    (L.useState = function (e) {
      return N.current.useState(e);
    }),
    (L.useSyncExternalStore = function (e, t, n) {
      return N.current.useSyncExternalStore(e, t, n);
    }),
    (L.useTransition = function () {
      return N.current.useTransition();
    }),
    (L.version = '18.3.1'),
    L
  );
}
function z() {
  return k || ((k = 1), (S.exports = M())), S.exports;
}
var T,
  _,
  P,
  N,
  I,
  R = { exports: {} },
  H = {};
function D() {
  return (
    _ ||
      ((_ = 1),
      (R.exports =
        (T ||
          ((T = 1),
          (function (e) {
            function t(e, t) {
              var n = e.length;
              e.push(t);
              e: for (; 0 < n; ) {
                var r = (n - 1) >>> 1,
                  a = e[r];
                if (!(0 < l(a, t))) break e;
                (e[r] = t), (e[n] = a), (n = r);
              }
            }
            function n(e) {
              return 0 === e.length ? null : e[0];
            }
            function r(e) {
              if (0 === e.length) return null;
              var t = e[0],
                n = e.pop();
              if (n !== t) {
                e[0] = n;
                e: for (var r = 0, a = e.length, o = a >>> 1; r < o; ) {
                  var i = 2 * (r + 1) - 1,
                    s = e[i],
                    u = i + 1,
                    c = e[u];
                  if (0 > l(s, n))
                    u < a && 0 > l(c, s)
                      ? ((e[r] = c), (e[u] = n), (r = u))
                      : ((e[r] = s), (e[i] = n), (r = i));
                  else {
                    if (!(u < a && 0 > l(c, n))) break e;
                    (e[r] = c), (e[u] = n), (r = u);
                  }
                }
              }
              return t;
            }
            function l(e, t) {
              var n = e.sortIndex - t.sortIndex;
              return 0 !== n ? n : e.id - t.id;
            }
            if (
              'object' == typeof performance &&
              'function' == typeof performance.now
            ) {
              var a = performance;
              e.unstable_now = function () {
                return a.now();
              };
            } else {
              var o = Date,
                i = o.now();
              e.unstable_now = function () {
                return o.now() - i;
              };
            }
            var s = [],
              u = [],
              c = 1,
              d = null,
              f = 3,
              p = !1,
              h = !1,
              m = !1,
              g = 'function' == typeof setTimeout ? setTimeout : null,
              v = 'function' == typeof clearTimeout ? clearTimeout : null,
              y = 'undefined' != typeof setImmediate ? setImmediate : null;
            function b(e) {
              for (var l = n(u); null !== l; ) {
                if (null === l.callback) r(u);
                else {
                  if (!(l.startTime <= e)) break;
                  r(u), (l.sortIndex = l.expirationTime), t(s, l);
                }
                l = n(u);
              }
            }
            function w(e) {
              if (((m = !1), b(e), !h))
                if (null !== n(s)) (h = !0), N(k);
                else {
                  var t = n(u);
                  null !== t && I(w, t.startTime - e);
                }
            }
            function k(t, l) {
              (h = !1), m && ((m = !1), v(S), (S = -1)), (p = !0);
              var a = f;
              try {
                for (
                  b(l), d = n(s);
                  null !== d && (!(d.expirationTime > l) || (t && !z()));

                ) {
                  var o = d.callback;
                  if ('function' == typeof o) {
                    (d.callback = null), (f = d.priorityLevel);
                    var i = o(d.expirationTime <= l);
                    (l = e.unstable_now()),
                      'function' == typeof i
                        ? (d.callback = i)
                        : d === n(s) && r(s),
                      b(l);
                  } else r(s);
                  d = n(s);
                }
                if (null !== d) var c = !0;
                else {
                  var g = n(u);
                  null !== g && I(w, g.startTime - l), (c = !1);
                }
                return c;
              } finally {
                (d = null), (f = a), (p = !1);
              }
            }
            'undefined' != typeof navigator &&
              void 0 !== navigator.scheduling &&
              void 0 !== navigator.scheduling.isInputPending &&
              navigator.scheduling.isInputPending.bind(navigator.scheduling);
            var C,
              E = !1,
              x = null,
              S = -1,
              L = 5,
              M = -1;
            function z() {
              return !(e.unstable_now() - M < L);
            }
            function T() {
              if (null !== x) {
                var t = e.unstable_now();
                M = t;
                var n = !0;
                try {
                  n = x(!0, t);
                } finally {
                  n ? C() : ((E = !1), (x = null));
                }
              } else E = !1;
            }
            if ('function' == typeof y)
              C = function () {
                y(T);
              };
            else if ('undefined' != typeof MessageChannel) {
              var _ = new MessageChannel(),
                P = _.port2;
              (_.port1.onmessage = T),
                (C = function () {
                  P.postMessage(null);
                });
            } else
              C = function () {
                g(T, 0);
              };
            function N(e) {
              (x = e), E || ((E = !0), C());
            }
            function I(t, n) {
              S = g(function () {
                t(e.unstable_now());
              }, n);
            }
            (e.unstable_IdlePriority = 5),
              (e.unstable_ImmediatePriority = 1),
              (e.unstable_LowPriority = 4),
              (e.unstable_NormalPriority = 3),
              (e.unstable_Profiling = null),
              (e.unstable_UserBlockingPriority = 2),
              (e.unstable_cancelCallback = function (e) {
                e.callback = null;
              }),
              (e.unstable_continueExecution = function () {
                h || p || ((h = !0), N(k));
              }),
              (e.unstable_forceFrameRate = function (e) {
                0 > e || 125 < e
                  ? console.error(
                      'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported'
                    )
                  : (L = 0 < e ? Math.floor(1e3 / e) : 5);
              }),
              (e.unstable_getCurrentPriorityLevel = function () {
                return f;
              }),
              (e.unstable_getFirstCallbackNode = function () {
                return n(s);
              }),
              (e.unstable_next = function (e) {
                switch (f) {
                  case 1:
                  case 2:
                  case 3:
                    var t = 3;
                    break;
                  default:
                    t = f;
                }
                var n = f;
                f = t;
                try {
                  return e();
                } finally {
                  f = n;
                }
              }),
              (e.unstable_pauseExecution = function () {}),
              (e.unstable_requestPaint = function () {}),
              (e.unstable_runWithPriority = function (e, t) {
                switch (e) {
                  case 1:
                  case 2:
                  case 3:
                  case 4:
                  case 5:
                    break;
                  default:
                    e = 3;
                }
                var n = f;
                f = e;
                try {
                  return t();
                } finally {
                  f = n;
                }
              }),
              (e.unstable_scheduleCallback = function (r, l, a) {
                var o = e.unstable_now();
                switch (
                  ((a =
                    'object' == typeof a &&
                    null !== a &&
                    'number' == typeof (a = a.delay) &&
                    0 < a
                      ? o + a
                      : o),
                  r)
                ) {
                  case 1:
                    var i = -1;
                    break;
                  case 2:
                    i = 250;
                    break;
                  case 5:
                    i = 1073741823;
                    break;
                  case 4:
                    i = 1e4;
                    break;
                  default:
                    i = 5e3;
                }
                return (
                  (r = {
                    id: c++,
                    callback: l,
                    priorityLevel: r,
                    startTime: a,
                    expirationTime: (i = a + i),
                    sortIndex: -1,
                  }),
                  a > o
                    ? ((r.sortIndex = a),
                      t(u, r),
                      null === n(s) &&
                        r === n(u) &&
                        (m ? (v(S), (S = -1)) : (m = !0), I(w, a - o)))
                    : ((r.sortIndex = i), t(s, r), h || p || ((h = !0), N(k))),
                  r
                );
              }),
              (e.unstable_shouldYield = z),
              (e.unstable_wrapCallback = function (e) {
                var t = f;
                return function () {
                  var n = f;
                  f = t;
                  try {
                    return e.apply(this, arguments);
                  } finally {
                    f = n;
                  }
                };
              });
          })(H)),
        H))),
    R.exports
  );
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ function B() {
  if (P) return x;
  P = 1;
  var e = z(),
    t = D();
  function n(e) {
    for (
      var t = 'https://reactjs.org/docs/error-decoder.html?invariant=' + e,
        n = 1;
      n < arguments.length;
      n++
    )
      t += '&args[]=' + encodeURIComponent(arguments[n]);
    return (
      'Minified React error #' +
      e +
      '; visit ' +
      t +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  var r = new Set(),
    l = {};
  function a(e, t) {
    o(e, t), o(e + 'Capture', t);
  }
  function o(e, t) {
    for (l[e] = t, e = 0; e < t.length; e++) r.add(t[e]);
  }
  var i = !(
      'undefined' == typeof window ||
      void 0 === window.document ||
      void 0 === window.document.createElement
    ),
    s = Object.prototype.hasOwnProperty,
    u =
      /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
    c = {},
    d = {};
  function f(e, t, n, r, l, a, o) {
    (this.acceptsBooleans = 2 === t || 3 === t || 4 === t),
      (this.attributeName = r),
      (this.attributeNamespace = l),
      (this.mustUseProperty = n),
      (this.propertyName = e),
      (this.type = t),
      (this.sanitizeURL = a),
      (this.removeEmptyString = o);
  }
  var p = {};
  'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
    .split(' ')
    .forEach(function (e) {
      p[e] = new f(e, 0, !1, e, null, !1, !1);
    }),
    [
      ['acceptCharset', 'accept-charset'],
      ['className', 'class'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
    ].forEach(function (e) {
      var t = e[0];
      p[t] = new f(t, 1, !1, e[1], null, !1, !1);
    }),
    ['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(
      function (e) {
        p[e] = new f(e, 2, !1, e.toLowerCase(), null, !1, !1);
      }
    ),
    [
      'autoReverse',
      'externalResourcesRequired',
      'focusable',
      'preserveAlpha',
    ].forEach(function (e) {
      p[e] = new f(e, 2, !1, e, null, !1, !1);
    }),
    'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
      .split(' ')
      .forEach(function (e) {
        p[e] = new f(e, 3, !1, e.toLowerCase(), null, !1, !1);
      }),
    ['checked', 'multiple', 'muted', 'selected'].forEach(function (e) {
      p[e] = new f(e, 3, !0, e, null, !1, !1);
    }),
    ['capture', 'download'].forEach(function (e) {
      p[e] = new f(e, 4, !1, e, null, !1, !1);
    }),
    ['cols', 'rows', 'size', 'span'].forEach(function (e) {
      p[e] = new f(e, 6, !1, e, null, !1, !1);
    }),
    ['rowSpan', 'start'].forEach(function (e) {
      p[e] = new f(e, 5, !1, e.toLowerCase(), null, !1, !1);
    });
  var h = /[\-:]([a-z])/g;
  function m(e) {
    return e[1].toUpperCase();
  }
  function g(e, t, n, r) {
    var l = p.hasOwnProperty(t) ? p[t] : null;
    (null !== l
      ? 0 !== l.type
      : r ||
        !(2 < t.length) ||
        ('o' !== t[0] && 'O' !== t[0]) ||
        ('n' !== t[1] && 'N' !== t[1])) &&
      ((function (e, t, n, r) {
        if (
          null == t ||
          (function (e, t, n, r) {
            if (null !== n && 0 === n.type) return !1;
            switch (typeof t) {
              case 'function':
              case 'symbol':
                return !0;
              case 'boolean':
                return (
                  !r &&
                  (null !== n
                    ? !n.acceptsBooleans
                    : 'data-' !== (e = e.toLowerCase().slice(0, 5)) &&
                      'aria-' !== e)
                );
              default:
                return !1;
            }
          })(e, t, n, r)
        )
          return !0;
        if (r) return !1;
        if (null !== n)
          switch (n.type) {
            case 3:
              return !t;
            case 4:
              return !1 === t;
            case 5:
              return isNaN(t);
            case 6:
              return isNaN(t) || 1 > t;
          }
        return !1;
      })(t, n, l, r) && (n = null),
      r || null === l
        ? (function (e) {
            return (
              !!s.call(d, e) ||
              (!s.call(c, e) && (u.test(e) ? (d[e] = !0) : ((c[e] = !0), !1)))
            );
          })(t) &&
          (null === n ? e.removeAttribute(t) : e.setAttribute(t, '' + n))
        : l.mustUseProperty
          ? (e[l.propertyName] = null === n ? 3 !== l.type && '' : n)
          : ((t = l.attributeName),
            (r = l.attributeNamespace),
            null === n
              ? e.removeAttribute(t)
              : ((n =
                  3 === (l = l.type) || (4 === l && !0 === n) ? '' : '' + n),
                r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
    .split(' ')
    .forEach(function (e) {
      var t = e.replace(h, m);
      p[t] = new f(t, 1, !1, e, null, !1, !1);
    }),
    'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'
      .split(' ')
      .forEach(function (e) {
        var t = e.replace(h, m);
        p[t] = new f(t, 1, !1, e, 'http://www.w3.org/1999/xlink', !1, !1);
      }),
    ['xml:base', 'xml:lang', 'xml:space'].forEach(function (e) {
      var t = e.replace(h, m);
      p[t] = new f(t, 1, !1, e, 'http://www.w3.org/XML/1998/namespace', !1, !1);
    }),
    ['tabIndex', 'crossOrigin'].forEach(function (e) {
      p[e] = new f(e, 1, !1, e.toLowerCase(), null, !1, !1);
    }),
    (p.xlinkHref = new f(
      'xlinkHref',
      1,
      !1,
      'xlink:href',
      'http://www.w3.org/1999/xlink',
      !0,
      !1
    )),
    ['src', 'href', 'action', 'formAction'].forEach(function (e) {
      p[e] = new f(e, 1, !1, e.toLowerCase(), null, !0, !0);
    });
  var v = e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
    y = Symbol.for('react.element'),
    b = Symbol.for('react.portal'),
    w = Symbol.for('react.fragment'),
    k = Symbol.for('react.strict_mode'),
    C = Symbol.for('react.profiler'),
    E = Symbol.for('react.provider'),
    S = Symbol.for('react.context'),
    L = Symbol.for('react.forward_ref'),
    M = Symbol.for('react.suspense'),
    T = Symbol.for('react.suspense_list'),
    _ = Symbol.for('react.memo'),
    N = Symbol.for('react.lazy'),
    I = Symbol.for('react.offscreen'),
    R = Symbol.iterator;
  function H(e) {
    return null === e || 'object' != typeof e
      ? null
      : 'function' == typeof (e = (R && e[R]) || e['@@iterator'])
        ? e
        : null;
  }
  var B,
    $ = Object.assign;
  function V(e) {
    if (void 0 === B)
      try {
        throw Error();
      } catch (e) {
        var t = e.stack.trim().match(/\n( *(at )?)/);
        B = (t && t[1]) || '';
      }
    return '\n' + B + e;
  }
  var F = !1;
  function O(e, t) {
    if (!e || F) return '';
    F = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t)
        if (
          ((t = function () {
            throw Error();
          }),
          Object.defineProperty(t.prototype, 'props', {
            set: function () {
              throw Error();
            },
          }),
          'object' == typeof Reflect && Reflect.construct)
        ) {
          try {
            Reflect.construct(t, []);
          } catch (e) {
            var r = e;
          }
          Reflect.construct(e, [], t);
        } else {
          try {
            t.call();
          } catch (e) {
            r = e;
          }
          e.call(t.prototype);
        }
      else {
        try {
          throw Error();
        } catch (e) {
          r = e;
        }
        e();
      }
    } catch (t) {
      if (t && r && 'string' == typeof t.stack) {
        for (
          var l = t.stack.split('\n'),
            a = r.stack.split('\n'),
            o = l.length - 1,
            i = a.length - 1;
          1 <= o && 0 <= i && l[o] !== a[i];

        )
          i--;
        for (; 1 <= o && 0 <= i; o--, i--)
          if (l[o] !== a[i]) {
            if (1 !== o || 1 !== i)
              do {
                if ((o--, 0 > --i || l[o] !== a[i])) {
                  var s = '\n' + l[o].replace(' at new ', ' at ');
                  return (
                    e.displayName &&
                      s.includes('<anonymous>') &&
                      (s = s.replace('<anonymous>', e.displayName)),
                    s
                  );
                }
              } while (1 <= o && 0 <= i);
            break;
          }
      }
    } finally {
      (F = !1), (Error.prepareStackTrace = n);
    }
    return (e = e ? e.displayName || e.name : '') ? V(e) : '';
  }
  function A(e) {
    switch (e.tag) {
      case 5:
        return V(e.type);
      case 16:
        return V('Lazy');
      case 13:
        return V('Suspense');
      case 19:
        return V('SuspenseList');
      case 0:
      case 2:
      case 15:
        return (e = O(e.type, !1));
      case 11:
        return (e = O(e.type.render, !1));
      case 1:
        return (e = O(e.type, !0));
      default:
        return '';
    }
  }
  function U(e) {
    if (null == e) return null;
    if ('function' == typeof e) return e.displayName || e.name || null;
    if ('string' == typeof e) return e;
    switch (e) {
      case w:
        return 'Fragment';
      case b:
        return 'Portal';
      case C:
        return 'Profiler';
      case k:
        return 'StrictMode';
      case M:
        return 'Suspense';
      case T:
        return 'SuspenseList';
    }
    if ('object' == typeof e)
      switch (e.$$typeof) {
        case S:
          return (e.displayName || 'Context') + '.Consumer';
        case E:
          return (e._context.displayName || 'Context') + '.Provider';
        case L:
          var t = e.render;
          return (
            (e = e.displayName) ||
              (e =
                '' !== (e = t.displayName || t.name || '')
                  ? 'ForwardRef(' + e + ')'
                  : 'ForwardRef'),
            e
          );
        case _:
          return null !== (t = e.displayName || null) ? t : U(e.type) || 'Memo';
        case N:
          (t = e._payload), (e = e._init);
          try {
            return U(e(t));
          } catch (e) {}
      }
    return null;
  }
  function j(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return 'Cache';
      case 9:
        return (t.displayName || 'Context') + '.Consumer';
      case 10:
        return (t._context.displayName || 'Context') + '.Provider';
      case 18:
        return 'DehydratedFragment';
      case 11:
        return (
          (e = (e = t.render).displayName || e.name || ''),
          t.displayName || ('' !== e ? 'ForwardRef(' + e + ')' : 'ForwardRef')
        );
      case 7:
        return 'Fragment';
      case 5:
        return t;
      case 4:
        return 'Portal';
      case 3:
        return 'Root';
      case 6:
        return 'Text';
      case 16:
        return U(t);
      case 8:
        return t === k ? 'StrictMode' : 'Mode';
      case 22:
        return 'Offscreen';
      case 12:
        return 'Profiler';
      case 21:
        return 'Scope';
      case 13:
        return 'Suspense';
      case 19:
        return 'SuspenseList';
      case 25:
        return 'TracingMarker';
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if ('function' == typeof t) return t.displayName || t.name || null;
        if ('string' == typeof t) return t;
    }
    return null;
  }
  function q(e) {
    switch (typeof e) {
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
      case 'object':
        return e;
      default:
        return '';
    }
  }
  function W(e) {
    var t = e.type;
    return (
      (e = e.nodeName) &&
      'input' === e.toLowerCase() &&
      ('checkbox' === t || 'radio' === t)
    );
  }
  function Q(e) {
    e._valueTracker ||
      (e._valueTracker = (function (e) {
        var t = W(e) ? 'checked' : 'value',
          n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
          r = '' + e[t];
        if (
          !e.hasOwnProperty(t) &&
          void 0 !== n &&
          'function' == typeof n.get &&
          'function' == typeof n.set
        ) {
          var l = n.get,
            a = n.set;
          return (
            Object.defineProperty(e, t, {
              configurable: !0,
              get: function () {
                return l.call(this);
              },
              set: function (e) {
                (r = '' + e), a.call(this, e);
              },
            }),
            Object.defineProperty(e, t, { enumerable: n.enumerable }),
            {
              getValue: function () {
                return r;
              },
              setValue: function (e) {
                r = '' + e;
              },
              stopTracking: function () {
                (e._valueTracker = null), delete e[t];
              },
            }
          );
        }
      })(e));
  }
  function Y(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      r = '';
    return (
      e && (r = W(e) ? (e.checked ? 'true' : 'false') : e.value),
      (e = r) !== n && (t.setValue(e), !0)
    );
  }
  function X(e) {
    if (
      void 0 === (e = e || ('undefined' != typeof document ? document : void 0))
    )
      return null;
    try {
      return e.activeElement || e.body;
    } catch (t) {
      return e.body;
    }
  }
  function Z(e, t) {
    var n = t.checked;
    return $({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: null != n ? n : e._wrapperState.initialChecked,
    });
  }
  function K(e, t) {
    var n = null == t.defaultValue ? '' : t.defaultValue,
      r = null != t.checked ? t.checked : t.defaultChecked;
    (n = q(null != t.value ? t.value : n)),
      (e._wrapperState = {
        initialChecked: r,
        initialValue: n,
        controlled:
          'checkbox' === t.type || 'radio' === t.type
            ? null != t.checked
            : null != t.value,
      });
  }
  function G(e, t) {
    null != (t = t.checked) && g(e, 'checked', t, !1);
  }
  function J(e, t) {
    G(e, t);
    var n = q(t.value),
      r = t.type;
    if (null != n)
      'number' === r
        ? ((0 === n && '' === e.value) || e.value != n) && (e.value = '' + n)
        : e.value !== '' + n && (e.value = '' + n);
    else if ('submit' === r || 'reset' === r)
      return void e.removeAttribute('value');
    t.hasOwnProperty('value')
      ? te(e, t.type, n)
      : t.hasOwnProperty('defaultValue') && te(e, t.type, q(t.defaultValue)),
      null == t.checked &&
        null != t.defaultChecked &&
        (e.defaultChecked = !!t.defaultChecked);
  }
  function ee(e, t, n) {
    if (t.hasOwnProperty('value') || t.hasOwnProperty('defaultValue')) {
      var r = t.type;
      if (
        !(
          ('submit' !== r && 'reset' !== r) ||
          (void 0 !== t.value && null !== t.value)
        )
      )
        return;
      (t = '' + e._wrapperState.initialValue),
        n || t === e.value || (e.value = t),
        (e.defaultValue = t);
    }
    '' !== (n = e.name) && (e.name = ''),
      (e.defaultChecked = !!e._wrapperState.initialChecked),
      '' !== n && (e.name = n);
  }
  function te(e, t, n) {
    ('number' === t && X(e.ownerDocument) === e) ||
      (null == n
        ? (e.defaultValue = '' + e._wrapperState.initialValue)
        : e.defaultValue !== '' + n && (e.defaultValue = '' + n));
  }
  var ne = Array.isArray;
  function re(e, t, n, r) {
    if (((e = e.options), t)) {
      t = {};
      for (var l = 0; l < n.length; l++) t['$' + n[l]] = !0;
      for (n = 0; n < e.length; n++)
        (l = t.hasOwnProperty('$' + e[n].value)),
          e[n].selected !== l && (e[n].selected = l),
          l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = '' + q(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n)
          return (e[l].selected = !0), void (r && (e[l].defaultSelected = !0));
        null !== t || e[l].disabled || (t = e[l]);
      }
      null !== t && (t.selected = !0);
    }
  }
  function le(e, t) {
    if (null != t.dangerouslySetInnerHTML) throw Error(n(91));
    return $({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: '' + e._wrapperState.initialValue,
    });
  }
  function ae(e, t) {
    var r = t.value;
    if (null == r) {
      if (((r = t.children), (t = t.defaultValue), null != r)) {
        if (null != t) throw Error(n(92));
        if (ne(r)) {
          if (1 < r.length) throw Error(n(93));
          r = r[0];
        }
        t = r;
      }
      null == t && (t = ''), (r = t);
    }
    e._wrapperState = { initialValue: q(r) };
  }
  function oe(e, t) {
    var n = q(t.value),
      r = q(t.defaultValue);
    null != n &&
      ((n = '' + n) !== e.value && (e.value = n),
      null == t.defaultValue && e.defaultValue !== n && (e.defaultValue = n)),
      null != r && (e.defaultValue = '' + r);
  }
  function ie(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue &&
      '' !== t &&
      null !== t &&
      (e.value = t);
  }
  function se(e) {
    switch (e) {
      case 'svg':
        return 'http://www.w3.org/2000/svg';
      case 'math':
        return 'http://www.w3.org/1998/Math/MathML';
      default:
        return 'http://www.w3.org/1999/xhtml';
    }
  }
  function ue(e, t) {
    return null == e || 'http://www.w3.org/1999/xhtml' === e
      ? se(t)
      : 'http://www.w3.org/2000/svg' === e && 'foreignObject' === t
        ? 'http://www.w3.org/1999/xhtml'
        : e;
  }
  var ce,
    de,
    fe =
      ((de = function (e, t) {
        if ('http://www.w3.org/2000/svg' !== e.namespaceURI || 'innerHTML' in e)
          e.innerHTML = t;
        else {
          for (
            (ce = ce || document.createElement('div')).innerHTML =
              '<svg>' + t.valueOf().toString() + '</svg>',
              t = ce.firstChild;
            e.firstChild;

          )
            e.removeChild(e.firstChild);
          for (; t.firstChild; ) e.appendChild(t.firstChild);
        }
      }),
      'undefined' != typeof MSApp && MSApp.execUnsafeLocalFunction
        ? function (e, t, n, r) {
            MSApp.execUnsafeLocalFunction(function () {
              return de(e, t);
            });
          }
        : de);
  function pe(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && 3 === n.nodeType)
        return void (n.nodeValue = t);
    }
    e.textContent = t;
  }
  var he = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0,
    },
    me = ['Webkit', 'ms', 'Moz', 'O'];
  function ge(e, t, n) {
    return null == t || 'boolean' == typeof t || '' === t
      ? ''
      : n || 'number' != typeof t || 0 === t || (he.hasOwnProperty(e) && he[e])
        ? ('' + t).trim()
        : t + 'px';
  }
  function ve(e, t) {
    for (var n in ((e = e.style), t))
      if (t.hasOwnProperty(n)) {
        var r = 0 === n.indexOf('--'),
          l = ge(n, t[n], r);
        'float' === n && (n = 'cssFloat'), r ? e.setProperty(n, l) : (e[n] = l);
      }
  }
  Object.keys(he).forEach(function (e) {
    me.forEach(function (t) {
      (t = t + e.charAt(0).toUpperCase() + e.substring(1)), (he[t] = he[e]);
    });
  });
  var ye = $(
    { menuitem: !0 },
    {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0,
    }
  );
  function be(e, t) {
    if (t) {
      if (ye[e] && (null != t.children || null != t.dangerouslySetInnerHTML))
        throw Error(n(137, e));
      if (null != t.dangerouslySetInnerHTML) {
        if (null != t.children) throw Error(n(60));
        if (
          'object' != typeof t.dangerouslySetInnerHTML ||
          !('__html' in t.dangerouslySetInnerHTML)
        )
          throw Error(n(61));
      }
      if (null != t.style && 'object' != typeof t.style) throw Error(n(62));
    }
  }
  function we(e, t) {
    if (-1 === e.indexOf('-')) return 'string' == typeof t.is;
    switch (e) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var ke = null;
  function Ce(e) {
    return (
      (e = e.target || e.srcElement || window).correspondingUseElement &&
        (e = e.correspondingUseElement),
      3 === e.nodeType ? e.parentNode : e
    );
  }
  var Ee = null,
    xe = null,
    Se = null;
  function Le(e) {
    if ((e = wl(e))) {
      if ('function' != typeof Ee) throw Error(n(280));
      var t = e.stateNode;
      t && ((t = Cl(t)), Ee(e.stateNode, e.type, t));
    }
  }
  function Me(e) {
    xe ? (Se ? Se.push(e) : (Se = [e])) : (xe = e);
  }
  function ze() {
    if (xe) {
      var e = xe,
        t = Se;
      if (((Se = xe = null), Le(e), t)) for (e = 0; e < t.length; e++) Le(t[e]);
    }
  }
  function Te(e, t) {
    return e(t);
  }
  function _e() {}
  var Pe = !1;
  function Ne(e, t, n) {
    if (Pe) return e(t, n);
    Pe = !0;
    try {
      return Te(e, t, n);
    } finally {
      (Pe = !1), (null !== xe || null !== Se) && (_e(), ze());
    }
  }
  function Ie(e, t) {
    var r = e.stateNode;
    if (null === r) return null;
    var l = Cl(r);
    if (null === l) return null;
    r = l[t];
    e: switch (t) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        (l = !l.disabled) ||
          (l = !(
            'button' === (e = e.type) ||
            'input' === e ||
            'select' === e ||
            'textarea' === e
          )),
          (e = !l);
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (r && 'function' != typeof r) throw Error(n(231, t, typeof r));
    return r;
  }
  var Re = !1;
  if (i)
    try {
      var He = {};
      Object.defineProperty(He, 'passive', {
        get: function () {
          Re = !0;
        },
      }),
        window.addEventListener('test', He, He),
        window.removeEventListener('test', He, He);
    } catch (de) {
      Re = !1;
    }
  function De(e, t, n, r, l, a, o, i, s) {
    var u = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, u);
    } catch (e) {
      this.onError(e);
    }
  }
  var Be = !1,
    $e = null,
    Ve = !1,
    Fe = null,
    Oe = {
      onError: function (e) {
        (Be = !0), ($e = e);
      },
    };
  function Ae(e, t, n, r, l, a, o, i, s) {
    (Be = !1), ($e = null), De.apply(Oe, arguments);
  }
  function Ue(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do {
        !!(4098 & (t = e).flags) && (n = t.return), (e = t.return);
      } while (e);
    }
    return 3 === t.tag ? n : null;
  }
  function je(e) {
    if (13 === e.tag) {
      var t = e.memoizedState;
      if (
        (null === t && null !== (e = e.alternate) && (t = e.memoizedState),
        null !== t)
      )
        return t.dehydrated;
    }
    return null;
  }
  function qe(e) {
    if (Ue(e) !== e) throw Error(n(188));
  }
  function We(e) {
    return null !==
      (e = (function (e) {
        var t = e.alternate;
        if (!t) {
          if (null === (t = Ue(e))) throw Error(n(188));
          return t !== e ? null : e;
        }
        for (var r = e, l = t; ; ) {
          var a = r.return;
          if (null === a) break;
          var o = a.alternate;
          if (null === o) {
            if (null !== (l = a.return)) {
              r = l;
              continue;
            }
            break;
          }
          if (a.child === o.child) {
            for (o = a.child; o; ) {
              if (o === r) return qe(a), e;
              if (o === l) return qe(a), t;
              o = o.sibling;
            }
            throw Error(n(188));
          }
          if (r.return !== l.return) (r = a), (l = o);
          else {
            for (var i = !1, s = a.child; s; ) {
              if (s === r) {
                (i = !0), (r = a), (l = o);
                break;
              }
              if (s === l) {
                (i = !0), (l = a), (r = o);
                break;
              }
              s = s.sibling;
            }
            if (!i) {
              for (s = o.child; s; ) {
                if (s === r) {
                  (i = !0), (r = o), (l = a);
                  break;
                }
                if (s === l) {
                  (i = !0), (l = o), (r = a);
                  break;
                }
                s = s.sibling;
              }
              if (!i) throw Error(n(189));
            }
          }
          if (r.alternate !== l) throw Error(n(190));
        }
        if (3 !== r.tag) throw Error(n(188));
        return r.stateNode.current === r ? e : t;
      })(e))
      ? Qe(e)
      : null;
  }
  function Qe(e) {
    if (5 === e.tag || 6 === e.tag) return e;
    for (e = e.child; null !== e; ) {
      var t = Qe(e);
      if (null !== t) return t;
      e = e.sibling;
    }
    return null;
  }
  var Ye = t.unstable_scheduleCallback,
    Xe = t.unstable_cancelCallback,
    Ze = t.unstable_shouldYield,
    Ke = t.unstable_requestPaint,
    Ge = t.unstable_now,
    Je = t.unstable_getCurrentPriorityLevel,
    et = t.unstable_ImmediatePriority,
    tt = t.unstable_UserBlockingPriority,
    nt = t.unstable_NormalPriority,
    rt = t.unstable_LowPriority,
    lt = t.unstable_IdlePriority,
    at = null,
    ot = null;
  var it = Math.clz32
      ? Math.clz32
      : function (e) {
          return (e >>>= 0), 0 === e ? 32 : (31 - ((st(e) / ut) | 0)) | 0;
        },
    st = Math.log,
    ut = Math.LN2;
  var ct = 64,
    dt = 4194304;
  function ft(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return 4194240 & e;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return 130023424 & e;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function pt(e, t) {
    var n = e.pendingLanes;
    if (0 === n) return 0;
    var r = 0,
      l = e.suspendedLanes,
      a = e.pingedLanes,
      o = 268435455 & n;
    if (0 !== o) {
      var i = o & ~l;
      0 !== i ? (r = ft(i)) : 0 !== (a &= o) && (r = ft(a));
    } else 0 !== (o = n & ~l) ? (r = ft(o)) : 0 !== a && (r = ft(a));
    if (0 === r) return 0;
    if (
      0 !== t &&
      t !== r &&
      0 === (t & l) &&
      ((l = r & -r) >= (a = t & -t) || (16 === l && 4194240 & a))
    )
      return t;
    if ((4 & r && (r |= 16 & n), 0 !== (t = e.entangledLanes)))
      for (e = e.entanglements, t &= r; 0 < t; )
        (l = 1 << (n = 31 - it(t))), (r |= e[n]), (t &= ~l);
    return r;
  }
  function ht(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      default:
        return -1;
    }
  }
  function mt(e) {
    return 0 !== (e = -1073741825 & e.pendingLanes)
      ? e
      : 1073741824 & e
        ? 1073741824
        : 0;
  }
  function gt() {
    var e = ct;
    return !(4194240 & (ct <<= 1)) && (ct = 64), e;
  }
  function vt(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function yt(e, t, n) {
    (e.pendingLanes |= t),
      536870912 !== t && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
      ((e = e.eventTimes)[(t = 31 - it(t))] = n);
  }
  function bt(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
      var r = 31 - it(n),
        l = 1 << r;
      (l & t) | (e[r] & t) && (e[r] |= t), (n &= ~l);
    }
  }
  var wt = 0;
  function kt(e) {
    return 1 < (e &= -e) ? (4 < e ? (268435455 & e ? 16 : 536870912) : 4) : 1;
  }
  var Ct,
    Et,
    xt,
    St,
    Lt,
    Mt = !1,
    zt = [],
    Tt = null,
    _t = null,
    Pt = null,
    Nt = new Map(),
    It = new Map(),
    Rt = [],
    Ht =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
        ' '
      );
  function Dt(e, t) {
    switch (e) {
      case 'focusin':
      case 'focusout':
        Tt = null;
        break;
      case 'dragenter':
      case 'dragleave':
        _t = null;
        break;
      case 'mouseover':
      case 'mouseout':
        Pt = null;
        break;
      case 'pointerover':
      case 'pointerout':
        Nt.delete(t.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        It.delete(t.pointerId);
    }
  }
  function Bt(e, t, n, r, l, a) {
    return null === e || e.nativeEvent !== a
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: r,
          nativeEvent: a,
          targetContainers: [l],
        }),
        null !== t && null !== (t = wl(t)) && Et(t),
        e)
      : ((e.eventSystemFlags |= r),
        (t = e.targetContainers),
        null !== l && -1 === t.indexOf(l) && t.push(l),
        e);
  }
  function $t(e) {
    var t = bl(e.target);
    if (null !== t) {
      var n = Ue(t);
      if (null !== n)
        if (13 === (t = n.tag)) {
          if (null !== (t = je(n)))
            return (
              (e.blockedOn = t),
              void Lt(e.priority, function () {
                xt(n);
              })
            );
        } else if (3 === t && n.stateNode.current.memoizedState.isDehydrated)
          return void (e.blockedOn =
            3 === n.tag ? n.stateNode.containerInfo : null);
    }
    e.blockedOn = null;
  }
  function Vt(e) {
    if (null !== e.blockedOn) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = Zt(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (null !== n)
        return null !== (t = wl(n)) && Et(t), (e.blockedOn = n), !1;
      var r = new (n = e.nativeEvent).constructor(n.type, n);
      (ke = r), n.target.dispatchEvent(r), (ke = null), t.shift();
    }
    return !0;
  }
  function Ft(e, t, n) {
    Vt(e) && n.delete(t);
  }
  function Ot() {
    (Mt = !1),
      null !== Tt && Vt(Tt) && (Tt = null),
      null !== _t && Vt(_t) && (_t = null),
      null !== Pt && Vt(Pt) && (Pt = null),
      Nt.forEach(Ft),
      It.forEach(Ft);
  }
  function At(e, n) {
    e.blockedOn === n &&
      ((e.blockedOn = null),
      Mt ||
        ((Mt = !0),
        t.unstable_scheduleCallback(t.unstable_NormalPriority, Ot)));
  }
  function Ut(e) {
    function t(t) {
      return At(t, e);
    }
    if (0 < zt.length) {
      At(zt[0], e);
      for (var n = 1; n < zt.length; n++) {
        var r = zt[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (
      null !== Tt && At(Tt, e),
        null !== _t && At(_t, e),
        null !== Pt && At(Pt, e),
        Nt.forEach(t),
        It.forEach(t),
        n = 0;
      n < Rt.length;
      n++
    )
      (r = Rt[n]).blockedOn === e && (r.blockedOn = null);
    for (; 0 < Rt.length && null === (n = Rt[0]).blockedOn; )
      $t(n), null === n.blockedOn && Rt.shift();
  }
  var jt = v.ReactCurrentBatchConfig,
    qt = !0;
  function Wt(e, t, n, r) {
    var l = wt,
      a = jt.transition;
    jt.transition = null;
    try {
      (wt = 1), Yt(e, t, n, r);
    } finally {
      (wt = l), (jt.transition = a);
    }
  }
  function Qt(e, t, n, r) {
    var l = wt,
      a = jt.transition;
    jt.transition = null;
    try {
      (wt = 4), Yt(e, t, n, r);
    } finally {
      (wt = l), (jt.transition = a);
    }
  }
  function Yt(e, t, n, r) {
    if (qt) {
      var l = Zt(e, t, n, r);
      if (null === l) qr(e, t, r, Xt, n), Dt(e, r);
      else if (
        (function (e, t, n, r, l) {
          switch (t) {
            case 'focusin':
              return (Tt = Bt(Tt, e, t, n, r, l)), !0;
            case 'dragenter':
              return (_t = Bt(_t, e, t, n, r, l)), !0;
            case 'mouseover':
              return (Pt = Bt(Pt, e, t, n, r, l)), !0;
            case 'pointerover':
              var a = l.pointerId;
              return Nt.set(a, Bt(Nt.get(a) || null, e, t, n, r, l)), !0;
            case 'gotpointercapture':
              return (
                (a = l.pointerId),
                It.set(a, Bt(It.get(a) || null, e, t, n, r, l)),
                !0
              );
          }
          return !1;
        })(l, e, t, n, r)
      )
        r.stopPropagation();
      else if ((Dt(e, r), 4 & t && -1 < Ht.indexOf(e))) {
        for (; null !== l; ) {
          var a = wl(l);
          if (
            (null !== a && Ct(a),
            null === (a = Zt(e, t, n, r)) && qr(e, t, r, Xt, n),
            a === l)
          )
            break;
          l = a;
        }
        null !== l && r.stopPropagation();
      } else qr(e, t, r, null, n);
    }
  }
  var Xt = null;
  function Zt(e, t, n, r) {
    if (((Xt = null), null !== (e = bl((e = Ce(r))))))
      if (null === (t = Ue(e))) e = null;
      else if (13 === (n = t.tag)) {
        if (null !== (e = je(t))) return e;
        e = null;
      } else if (3 === n) {
        if (t.stateNode.current.memoizedState.isDehydrated)
          return 3 === t.tag ? t.stateNode.containerInfo : null;
        e = null;
      } else t !== e && (e = null);
    return (Xt = e), null;
  }
  function Kt(e) {
    switch (e) {
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'resize':
      case 'seeked':
      case 'submit':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 1;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'scroll':
      case 'toggle':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 4;
      case 'message':
        switch (Je()) {
          case et:
            return 1;
          case tt:
            return 4;
          case nt:
          case rt:
            return 16;
          case lt:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Gt = null,
    Jt = null,
    en = null;
  function tn() {
    if (en) return en;
    var e,
      t,
      n = Jt,
      r = n.length,
      l = 'value' in Gt ? Gt.value : Gt.textContent,
      a = l.length;
    for (e = 0; e < r && n[e] === l[e]; e++);
    var o = r - e;
    for (t = 1; t <= o && n[r - t] === l[a - t]; t++);
    return (en = l.slice(e, 1 < t ? 1 - t : void 0));
  }
  function nn(e) {
    var t = e.keyCode;
    return (
      'charCode' in e
        ? 0 === (e = e.charCode) && 13 === t && (e = 13)
        : (e = t),
      10 === e && (e = 13),
      32 <= e || 13 === e ? e : 0
    );
  }
  function rn() {
    return !0;
  }
  function ln() {
    return !1;
  }
  function an(e) {
    function t(t, n, r, l, a) {
      for (var o in ((this._reactName = t),
      (this._targetInst = r),
      (this.type = n),
      (this.nativeEvent = l),
      (this.target = a),
      (this.currentTarget = null),
      e))
        e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(l) : l[o]));
      return (
        (this.isDefaultPrevented = (
          null != l.defaultPrevented ? l.defaultPrevented : !1 === l.returnValue
        )
          ? rn
          : ln),
        (this.isPropagationStopped = ln),
        this
      );
    }
    return (
      $(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var e = this.nativeEvent;
          e &&
            (e.preventDefault
              ? e.preventDefault()
              : 'unknown' != typeof e.returnValue && (e.returnValue = !1),
            (this.isDefaultPrevented = rn));
        },
        stopPropagation: function () {
          var e = this.nativeEvent;
          e &&
            (e.stopPropagation
              ? e.stopPropagation()
              : 'unknown' != typeof e.cancelBubble && (e.cancelBubble = !0),
            (this.isPropagationStopped = rn));
        },
        persist: function () {},
        isPersistent: rn,
      }),
      t
    );
  }
  var on,
    sn,
    un,
    cn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    dn = an(cn),
    fn = $({}, cn, { view: 0, detail: 0 }),
    pn = an(fn),
    hn = $({}, fn, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Ln,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return void 0 === e.relatedTarget
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return 'movementX' in e
          ? e.movementX
          : (e !== un &&
              (un && 'mousemove' === e.type
                ? ((on = e.screenX - un.screenX), (sn = e.screenY - un.screenY))
                : (sn = on = 0),
              (un = e)),
            on);
      },
      movementY: function (e) {
        return 'movementY' in e ? e.movementY : sn;
      },
    }),
    mn = an(hn),
    gn = an($({}, hn, { dataTransfer: 0 })),
    vn = an($({}, fn, { relatedTarget: 0 })),
    yn = an($({}, cn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 })),
    bn = $({}, cn, {
      clipboardData: function (e) {
        return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
      },
    }),
    wn = an(bn),
    kn = an($({}, cn, { data: 0 })),
    Cn = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    En = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    xn = {
      Alt: 'altKey',
      Control: 'ctrlKey',
      Meta: 'metaKey',
      Shift: 'shiftKey',
    };
  function Sn(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : !!(e = xn[e]) && !!t[e];
  }
  function Ln() {
    return Sn;
  }
  var Mn = $({}, fn, {
      key: function (e) {
        if (e.key) {
          var t = Cn[e.key] || e.key;
          if ('Unidentified' !== t) return t;
        }
        return 'keypress' === e.type
          ? 13 === (e = nn(e))
            ? 'Enter'
            : String.fromCharCode(e)
          : 'keydown' === e.type || 'keyup' === e.type
            ? En[e.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Ln,
      charCode: function (e) {
        return 'keypress' === e.type ? nn(e) : 0;
      },
      keyCode: function (e) {
        return 'keydown' === e.type || 'keyup' === e.type ? e.keyCode : 0;
      },
      which: function (e) {
        return 'keypress' === e.type
          ? nn(e)
          : 'keydown' === e.type || 'keyup' === e.type
            ? e.keyCode
            : 0;
      },
    }),
    zn = an(Mn),
    Tn = an(
      $({}, hn, {
        pointerId: 0,
        width: 0,
        height: 0,
        pressure: 0,
        tangentialPressure: 0,
        tiltX: 0,
        tiltY: 0,
        twist: 0,
        pointerType: 0,
        isPrimary: 0,
      })
    ),
    _n = an(
      $({}, fn, {
        touches: 0,
        targetTouches: 0,
        changedTouches: 0,
        altKey: 0,
        metaKey: 0,
        ctrlKey: 0,
        shiftKey: 0,
        getModifierState: Ln,
      })
    ),
    Pn = an($({}, cn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
    Nn = $({}, hn, {
      deltaX: function (e) {
        return 'deltaX' in e
          ? e.deltaX
          : 'wheelDeltaX' in e
            ? -e.wheelDeltaX
            : 0;
      },
      deltaY: function (e) {
        return 'deltaY' in e
          ? e.deltaY
          : 'wheelDeltaY' in e
            ? -e.wheelDeltaY
            : 'wheelDelta' in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    In = an(Nn),
    Rn = [9, 13, 27, 32],
    Hn = i && 'CompositionEvent' in window,
    Dn = null;
  i && 'documentMode' in document && (Dn = document.documentMode);
  var Bn = i && 'TextEvent' in window && !Dn,
    $n = i && (!Hn || (Dn && 8 < Dn && 11 >= Dn)),
    Vn = String.fromCharCode(32),
    Fn = !1;
  function On(e, t) {
    switch (e) {
      case 'keyup':
        return -1 !== Rn.indexOf(t.keyCode);
      case 'keydown':
        return 229 !== t.keyCode;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function An(e) {
    return 'object' == typeof (e = e.detail) && 'data' in e ? e.data : null;
  }
  var Un = !1;
  var jn = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function qn(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return 'input' === t ? !!jn[e.type] : 'textarea' === t;
  }
  function Wn(e, t, n, r) {
    Me(r),
      0 < (t = Qr(t, 'onChange')).length &&
        ((n = new dn('onChange', 'change', null, n, r)),
        e.push({ event: n, listeners: t }));
  }
  var Qn = null,
    Yn = null;
  function Xn(e) {
    Vr(e, 0);
  }
  function Zn(e) {
    if (Y(kl(e))) return e;
  }
  function Kn(e, t) {
    if ('change' === e) return t;
  }
  var Gn = !1;
  if (i) {
    var Jn;
    if (i) {
      var er = 'oninput' in document;
      if (!er) {
        var tr = document.createElement('div');
        tr.setAttribute('oninput', 'return;'),
          (er = 'function' == typeof tr.oninput);
      }
      Jn = er;
    } else Jn = !1;
    Gn = Jn && (!document.documentMode || 9 < document.documentMode);
  }
  function nr() {
    Qn && (Qn.detachEvent('onpropertychange', rr), (Yn = Qn = null));
  }
  function rr(e) {
    if ('value' === e.propertyName && Zn(Yn)) {
      var t = [];
      Wn(t, Yn, e, Ce(e)), Ne(Xn, t);
    }
  }
  function lr(e, t, n) {
    'focusin' === e
      ? (nr(), (Yn = n), (Qn = t).attachEvent('onpropertychange', rr))
      : 'focusout' === e && nr();
  }
  function ar(e) {
    if ('selectionchange' === e || 'keyup' === e || 'keydown' === e)
      return Zn(Yn);
  }
  function or(e, t) {
    if ('click' === e) return Zn(t);
  }
  function ir(e, t) {
    if ('input' === e || 'change' === e) return Zn(t);
  }
  var sr =
    'function' == typeof Object.is
      ? Object.is
      : function (e, t) {
          return (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t);
        };
  function ur(e, t) {
    if (sr(e, t)) return !0;
    if (
      'object' != typeof e ||
      null === e ||
      'object' != typeof t ||
      null === t
    )
      return !1;
    var n = Object.keys(e),
      r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!s.call(t, l) || !sr(e[l], t[l])) return !1;
    }
    return !0;
  }
  function cr(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function dr(e, t) {
    var n,
      r = cr(e);
    for (e = 0; r; ) {
      if (3 === r.nodeType) {
        if (((n = e + r.textContent.length), e <= t && n >= t))
          return { node: r, offset: t - e };
        e = n;
      }
      e: {
        for (; r; ) {
          if (r.nextSibling) {
            r = r.nextSibling;
            break e;
          }
          r = r.parentNode;
        }
        r = void 0;
      }
      r = cr(r);
    }
  }
  function fr(e, t) {
    return (
      !(!e || !t) &&
      (e === t ||
        ((!e || 3 !== e.nodeType) &&
          (t && 3 === t.nodeType
            ? fr(e, t.parentNode)
            : 'contains' in e
              ? e.contains(t)
              : !!e.compareDocumentPosition &&
                !!(16 & e.compareDocumentPosition(t)))))
    );
  }
  function pr() {
    for (var e = window, t = X(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = 'string' == typeof t.contentWindow.location.href;
      } catch (e) {
        n = !1;
      }
      if (!n) break;
      t = X((e = t.contentWindow).document);
    }
    return t;
  }
  function hr(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      (('input' === t &&
        ('text' === e.type ||
          'search' === e.type ||
          'tel' === e.type ||
          'url' === e.type ||
          'password' === e.type)) ||
        'textarea' === t ||
        'true' === e.contentEditable)
    );
  }
  function mr(e) {
    var t = pr(),
      n = e.focusedElem,
      r = e.selectionRange;
    if (
      t !== n &&
      n &&
      n.ownerDocument &&
      fr(n.ownerDocument.documentElement, n)
    ) {
      if (null !== r && hr(n))
        if (
          ((t = r.start),
          void 0 === (e = r.end) && (e = t),
          'selectionStart' in n)
        )
          (n.selectionStart = t),
            (n.selectionEnd = Math.min(e, n.value.length));
        else if (
          (e = ((t = n.ownerDocument || document) && t.defaultView) || window)
            .getSelection
        ) {
          e = e.getSelection();
          var l = n.textContent.length,
            a = Math.min(r.start, l);
          (r = void 0 === r.end ? a : Math.min(r.end, l)),
            !e.extend && a > r && ((l = r), (r = a), (a = l)),
            (l = dr(n, a));
          var o = dr(n, r);
          l &&
            o &&
            (1 !== e.rangeCount ||
              e.anchorNode !== l.node ||
              e.anchorOffset !== l.offset ||
              e.focusNode !== o.node ||
              e.focusOffset !== o.offset) &&
            ((t = t.createRange()).setStart(l.node, l.offset),
            e.removeAllRanges(),
            a > r
              ? (e.addRange(t), e.extend(o.node, o.offset))
              : (t.setEnd(o.node, o.offset), e.addRange(t)));
        }
      for (t = [], e = n; (e = e.parentNode); )
        1 === e.nodeType &&
          t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for ('function' == typeof n.focus && n.focus(), n = 0; n < t.length; n++)
        ((e = t[n]).element.scrollLeft = e.left), (e.element.scrollTop = e.top);
    }
  }
  var gr = i && 'documentMode' in document && 11 >= document.documentMode,
    vr = null,
    yr = null,
    br = null,
    wr = !1;
  function kr(e, t, n) {
    var r =
      n.window === n ? n.document : 9 === n.nodeType ? n : n.ownerDocument;
    wr ||
      null == vr ||
      vr !== X(r) ||
      ('selectionStart' in (r = vr) && hr(r)
        ? (r = { start: r.selectionStart, end: r.selectionEnd })
        : (r = {
            anchorNode: (r = (
              (r.ownerDocument && r.ownerDocument.defaultView) ||
              window
            ).getSelection()).anchorNode,
            anchorOffset: r.anchorOffset,
            focusNode: r.focusNode,
            focusOffset: r.focusOffset,
          }),
      (br && ur(br, r)) ||
        ((br = r),
        0 < (r = Qr(yr, 'onSelect')).length &&
          ((t = new dn('onSelect', 'select', null, t, n)),
          e.push({ event: t, listeners: r }),
          (t.target = vr))));
  }
  function Cr(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n['Webkit' + e] = 'webkit' + t),
      (n['Moz' + e] = 'moz' + t),
      n
    );
  }
  var Er = {
      animationend: Cr('Animation', 'AnimationEnd'),
      animationiteration: Cr('Animation', 'AnimationIteration'),
      animationstart: Cr('Animation', 'AnimationStart'),
      transitionend: Cr('Transition', 'TransitionEnd'),
    },
    xr = {},
    Sr = {};
  function Lr(e) {
    if (xr[e]) return xr[e];
    if (!Er[e]) return e;
    var t,
      n = Er[e];
    for (t in n) if (n.hasOwnProperty(t) && t in Sr) return (xr[e] = n[t]);
    return e;
  }
  i &&
    ((Sr = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete Er.animationend.animation,
      delete Er.animationiteration.animation,
      delete Er.animationstart.animation),
    'TransitionEvent' in window || delete Er.transitionend.transition);
  var Mr = Lr('animationend'),
    zr = Lr('animationiteration'),
    Tr = Lr('animationstart'),
    _r = Lr('transitionend'),
    Pr = new Map(),
    Nr =
      'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' '
      );
  function Ir(e, t) {
    Pr.set(e, t), a(t, [e]);
  }
  for (var Rr = 0; Rr < Nr.length; Rr++) {
    var Hr = Nr[Rr];
    Ir(Hr.toLowerCase(), 'on' + (Hr[0].toUpperCase() + Hr.slice(1)));
  }
  Ir(Mr, 'onAnimationEnd'),
    Ir(zr, 'onAnimationIteration'),
    Ir(Tr, 'onAnimationStart'),
    Ir('dblclick', 'onDoubleClick'),
    Ir('focusin', 'onFocus'),
    Ir('focusout', 'onBlur'),
    Ir(_r, 'onTransitionEnd'),
    o('onMouseEnter', ['mouseout', 'mouseover']),
    o('onMouseLeave', ['mouseout', 'mouseover']),
    o('onPointerEnter', ['pointerout', 'pointerover']),
    o('onPointerLeave', ['pointerout', 'pointerover']),
    a(
      'onChange',
      'change click focusin focusout input keydown keyup selectionchange'.split(
        ' '
      )
    ),
    a(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' '
      )
    ),
    a('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    a(
      'onCompositionEnd',
      'compositionend focusout keydown keypress keyup mousedown'.split(' ')
    ),
    a(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' ')
    ),
    a(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' ')
    );
  var Dr =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' '
      ),
    Br = new Set(
      'cancel close invalid load scroll toggle'.split(' ').concat(Dr)
    );
  function $r(e, t, r) {
    var l = e.type || 'unknown-event';
    (e.currentTarget = r),
      (function (e, t, r, l, a, o, i, s, u) {
        if ((Ae.apply(this, arguments), Be)) {
          if (!Be) throw Error(n(198));
          var c = $e;
          (Be = !1), ($e = null), Ve || ((Ve = !0), (Fe = c));
        }
      })(l, t, void 0, e),
      (e.currentTarget = null);
  }
  function Vr(e, t) {
    t = !!(4 & t);
    for (var n = 0; n < e.length; n++) {
      var r = e[n],
        l = r.event;
      r = r.listeners;
      e: {
        var a = void 0;
        if (t)
          for (var o = r.length - 1; 0 <= o; o--) {
            var i = r[o],
              s = i.instance,
              u = i.currentTarget;
            if (((i = i.listener), s !== a && l.isPropagationStopped()))
              break e;
            $r(l, i, u), (a = s);
          }
        else
          for (o = 0; o < r.length; o++) {
            if (
              ((s = (i = r[o]).instance),
              (u = i.currentTarget),
              (i = i.listener),
              s !== a && l.isPropagationStopped())
            )
              break e;
            $r(l, i, u), (a = s);
          }
      }
    }
    if (Ve) throw ((e = Fe), (Ve = !1), (Fe = null), e);
  }
  function Fr(e, t) {
    var n = t[gl];
    void 0 === n && (n = t[gl] = new Set());
    var r = e + '__bubble';
    n.has(r) || (jr(t, e, 2, !1), n.add(r));
  }
  function Or(e, t, n) {
    var r = 0;
    t && (r |= 4), jr(n, e, r, t);
  }
  var Ar = '_reactListening' + Math.random().toString(36).slice(2);
  function Ur(e) {
    if (!e[Ar]) {
      (e[Ar] = !0),
        r.forEach(function (t) {
          'selectionchange' !== t && (Br.has(t) || Or(t, !1, e), Or(t, !0, e));
        });
      var t = 9 === e.nodeType ? e : e.ownerDocument;
      null === t || t[Ar] || ((t[Ar] = !0), Or('selectionchange', !1, t));
    }
  }
  function jr(e, t, n, r) {
    switch (Kt(t)) {
      case 1:
        var l = Wt;
        break;
      case 4:
        l = Qt;
        break;
      default:
        l = Yt;
    }
    (n = l.bind(null, t, n, e)),
      (l = void 0),
      !Re ||
        ('touchstart' !== t && 'touchmove' !== t && 'wheel' !== t) ||
        (l = !0),
      r
        ? void 0 !== l
          ? e.addEventListener(t, n, { capture: !0, passive: l })
          : e.addEventListener(t, n, !0)
        : void 0 !== l
          ? e.addEventListener(t, n, { passive: l })
          : e.addEventListener(t, n, !1);
  }
  function qr(e, t, n, r, l) {
    var a = r;
    if (!(1 & t || 2 & t || null === r))
      e: for (;;) {
        if (null === r) return;
        var o = r.tag;
        if (3 === o || 4 === o) {
          var i = r.stateNode.containerInfo;
          if (i === l || (8 === i.nodeType && i.parentNode === l)) break;
          if (4 === o)
            for (o = r.return; null !== o; ) {
              var s = o.tag;
              if (
                (3 === s || 4 === s) &&
                ((s = o.stateNode.containerInfo) === l ||
                  (8 === s.nodeType && s.parentNode === l))
              )
                return;
              o = o.return;
            }
          for (; null !== i; ) {
            if (null === (o = bl(i))) return;
            if (5 === (s = o.tag) || 6 === s) {
              r = a = o;
              continue e;
            }
            i = i.parentNode;
          }
        }
        r = r.return;
      }
    Ne(function () {
      var r = a,
        l = Ce(n),
        o = [];
      e: {
        var i = Pr.get(e);
        if (void 0 !== i) {
          var s = dn,
            u = e;
          switch (e) {
            case 'keypress':
              if (0 === nn(n)) break e;
            case 'keydown':
            case 'keyup':
              s = zn;
              break;
            case 'focusin':
              (u = 'focus'), (s = vn);
              break;
            case 'focusout':
              (u = 'blur'), (s = vn);
              break;
            case 'beforeblur':
            case 'afterblur':
              s = vn;
              break;
            case 'click':
              if (2 === n.button) break e;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              s = mn;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              s = gn;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              s = _n;
              break;
            case Mr:
            case zr:
            case Tr:
              s = yn;
              break;
            case _r:
              s = Pn;
              break;
            case 'scroll':
              s = pn;
              break;
            case 'wheel':
              s = In;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              s = wn;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              s = Tn;
          }
          var c = !!(4 & t),
            d = !c && 'scroll' === e,
            f = c ? (null !== i ? i + 'Capture' : null) : i;
          c = [];
          for (var p, h = r; null !== h; ) {
            var m = (p = h).stateNode;
            if (
              (5 === p.tag &&
                null !== m &&
                ((p = m),
                null !== f && null != (m = Ie(h, f)) && c.push(Wr(h, m, p))),
              d)
            )
              break;
            h = h.return;
          }
          0 < c.length &&
            ((i = new s(i, u, null, n, l)), o.push({ event: i, listeners: c }));
        }
      }
      if (!(7 & t)) {
        if (
          ((s = 'mouseout' === e || 'pointerout' === e),
          (!(i = 'mouseover' === e || 'pointerover' === e) ||
            n === ke ||
            !(u = n.relatedTarget || n.fromElement) ||
            (!bl(u) && !u[ml])) &&
            (s || i) &&
            ((i =
              l.window === l
                ? l
                : (i = l.ownerDocument)
                  ? i.defaultView || i.parentWindow
                  : window),
            s
              ? ((s = r),
                null !==
                  (u = (u = n.relatedTarget || n.toElement) ? bl(u) : null) &&
                  (u !== (d = Ue(u)) || (5 !== u.tag && 6 !== u.tag)) &&
                  (u = null))
              : ((s = null), (u = r)),
            s !== u))
        ) {
          if (
            ((c = mn),
            (m = 'onMouseLeave'),
            (f = 'onMouseEnter'),
            (h = 'mouse'),
            ('pointerout' !== e && 'pointerover' !== e) ||
              ((c = Tn),
              (m = 'onPointerLeave'),
              (f = 'onPointerEnter'),
              (h = 'pointer')),
            (d = null == s ? i : kl(s)),
            (p = null == u ? i : kl(u)),
            ((i = new c(m, h + 'leave', s, n, l)).target = d),
            (i.relatedTarget = p),
            (m = null),
            bl(l) === r &&
              (((c = new c(f, h + 'enter', u, n, l)).target = p),
              (c.relatedTarget = d),
              (m = c)),
            (d = m),
            s && u)
          )
            e: {
              for (f = u, h = 0, p = c = s; p; p = Yr(p)) h++;
              for (p = 0, m = f; m; m = Yr(m)) p++;
              for (; 0 < h - p; ) (c = Yr(c)), h--;
              for (; 0 < p - h; ) (f = Yr(f)), p--;
              for (; h--; ) {
                if (c === f || (null !== f && c === f.alternate)) break e;
                (c = Yr(c)), (f = Yr(f));
              }
              c = null;
            }
          else c = null;
          null !== s && Xr(o, i, s, c, !1),
            null !== u && null !== d && Xr(o, d, u, c, !0);
        }
        if (
          'select' ===
            (s =
              (i = r ? kl(r) : window).nodeName && i.nodeName.toLowerCase()) ||
          ('input' === s && 'file' === i.type)
        )
          var g = Kn;
        else if (qn(i))
          if (Gn) g = ir;
          else {
            g = ar;
            var v = lr;
          }
        else
          (s = i.nodeName) &&
            'input' === s.toLowerCase() &&
            ('checkbox' === i.type || 'radio' === i.type) &&
            (g = or);
        switch (
          (g && (g = g(e, r))
            ? Wn(o, g, n, l)
            : (v && v(e, i, r),
              'focusout' === e &&
                (v = i._wrapperState) &&
                v.controlled &&
                'number' === i.type &&
                te(i, 'number', i.value)),
          (v = r ? kl(r) : window),
          e)
        ) {
          case 'focusin':
            (qn(v) || 'true' === v.contentEditable) &&
              ((vr = v), (yr = r), (br = null));
            break;
          case 'focusout':
            br = yr = vr = null;
            break;
          case 'mousedown':
            wr = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            (wr = !1), kr(o, n, l);
            break;
          case 'selectionchange':
            if (gr) break;
          case 'keydown':
          case 'keyup':
            kr(o, n, l);
        }
        var y;
        if (Hn)
          e: {
            switch (e) {
              case 'compositionstart':
                var b = 'onCompositionStart';
                break e;
              case 'compositionend':
                b = 'onCompositionEnd';
                break e;
              case 'compositionupdate':
                b = 'onCompositionUpdate';
                break e;
            }
            b = void 0;
          }
        else
          Un
            ? On(e, n) && (b = 'onCompositionEnd')
            : 'keydown' === e &&
              229 === n.keyCode &&
              (b = 'onCompositionStart');
        b &&
          ($n &&
            'ko' !== n.locale &&
            (Un || 'onCompositionStart' !== b
              ? 'onCompositionEnd' === b && Un && (y = tn())
              : ((Jt = 'value' in (Gt = l) ? Gt.value : Gt.textContent),
                (Un = !0))),
          0 < (v = Qr(r, b)).length &&
            ((b = new kn(b, e, null, n, l)),
            o.push({ event: b, listeners: v }),
            y ? (b.data = y) : null !== (y = An(n)) && (b.data = y))),
          (y = Bn
            ? (function (e, t) {
                switch (e) {
                  case 'compositionend':
                    return An(t);
                  case 'keypress':
                    return 32 !== t.which ? null : ((Fn = !0), Vn);
                  case 'textInput':
                    return (e = t.data) === Vn && Fn ? null : e;
                  default:
                    return null;
                }
              })(e, n)
            : (function (e, t) {
                if (Un)
                  return 'compositionend' === e || (!Hn && On(e, t))
                    ? ((e = tn()), (en = Jt = Gt = null), (Un = !1), e)
                    : null;
                switch (e) {
                  case 'paste':
                  default:
                    return null;
                  case 'keypress':
                    if (
                      !(t.ctrlKey || t.altKey || t.metaKey) ||
                      (t.ctrlKey && t.altKey)
                    ) {
                      if (t.char && 1 < t.char.length) return t.char;
                      if (t.which) return String.fromCharCode(t.which);
                    }
                    return null;
                  case 'compositionend':
                    return $n && 'ko' !== t.locale ? null : t.data;
                }
              })(e, n)) &&
            0 < (r = Qr(r, 'onBeforeInput')).length &&
            ((l = new kn('onBeforeInput', 'beforeinput', null, n, l)),
            o.push({ event: l, listeners: r }),
            (l.data = y));
      }
      Vr(o, t);
    });
  }
  function Wr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Qr(e, t) {
    for (var n = t + 'Capture', r = []; null !== e; ) {
      var l = e,
        a = l.stateNode;
      5 === l.tag &&
        null !== a &&
        ((l = a),
        null != (a = Ie(e, n)) && r.unshift(Wr(e, a, l)),
        null != (a = Ie(e, t)) && r.push(Wr(e, a, l))),
        (e = e.return);
    }
    return r;
  }
  function Yr(e) {
    if (null === e) return null;
    do {
      e = e.return;
    } while (e && 5 !== e.tag);
    return e || null;
  }
  function Xr(e, t, n, r, l) {
    for (var a = t._reactName, o = []; null !== n && n !== r; ) {
      var i = n,
        s = i.alternate,
        u = i.stateNode;
      if (null !== s && s === r) break;
      5 === i.tag &&
        null !== u &&
        ((i = u),
        l
          ? null != (s = Ie(n, a)) && o.unshift(Wr(n, s, i))
          : l || (null != (s = Ie(n, a)) && o.push(Wr(n, s, i)))),
        (n = n.return);
    }
    0 !== o.length && e.push({ event: t, listeners: o });
  }
  var Zr = /\r\n?/g,
    Kr = /\u0000|\uFFFD/g;
  function Gr(e) {
    return ('string' == typeof e ? e : '' + e)
      .replace(Zr, '\n')
      .replace(Kr, '');
  }
  function Jr(e, t, r) {
    if (((t = Gr(t)), Gr(e) !== t && r)) throw Error(n(425));
  }
  function el() {}
  var tl = null,
    nl = null;
  function rl(e, t) {
    return (
      'textarea' === e ||
      'noscript' === e ||
      'string' == typeof t.children ||
      'number' == typeof t.children ||
      ('object' == typeof t.dangerouslySetInnerHTML &&
        null !== t.dangerouslySetInnerHTML &&
        null != t.dangerouslySetInnerHTML.__html)
    );
  }
  var ll = 'function' == typeof setTimeout ? setTimeout : void 0,
    al = 'function' == typeof clearTimeout ? clearTimeout : void 0,
    ol = 'function' == typeof Promise ? Promise : void 0,
    il =
      'function' == typeof queueMicrotask
        ? queueMicrotask
        : void 0 !== ol
          ? function (e) {
              return ol.resolve(null).then(e).catch(sl);
            }
          : ll;
  function sl(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function ul(e, t) {
    var n = t,
      r = 0;
    do {
      var l = n.nextSibling;
      if ((e.removeChild(n), l && 8 === l.nodeType))
        if ('/$' === (n = l.data)) {
          if (0 === r) return e.removeChild(l), void Ut(t);
          r--;
        } else ('$' !== n && '$?' !== n && '$!' !== n) || r++;
      n = l;
    } while (n);
    Ut(t);
  }
  function cl(e) {
    for (; null != e; e = e.nextSibling) {
      var t = e.nodeType;
      if (1 === t || 3 === t) break;
      if (8 === t) {
        if ('$' === (t = e.data) || '$!' === t || '$?' === t) break;
        if ('/$' === t) return null;
      }
    }
    return e;
  }
  function dl(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (8 === e.nodeType) {
        var n = e.data;
        if ('$' === n || '$!' === n || '$?' === n) {
          if (0 === t) return e;
          t--;
        } else '/$' === n && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var fl = Math.random().toString(36).slice(2),
    pl = '__reactFiber$' + fl,
    hl = '__reactProps$' + fl,
    ml = '__reactContainer$' + fl,
    gl = '__reactEvents$' + fl,
    vl = '__reactListeners$' + fl,
    yl = '__reactHandles$' + fl;
  function bl(e) {
    var t = e[pl];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if ((t = n[ml] || n[pl])) {
        if (
          ((n = t.alternate),
          null !== t.child || (null !== n && null !== n.child))
        )
          for (e = dl(e); null !== e; ) {
            if ((n = e[pl])) return n;
            e = dl(e);
          }
        return t;
      }
      n = (e = n).parentNode;
    }
    return null;
  }
  function wl(e) {
    return !(e = e[pl] || e[ml]) ||
      (5 !== e.tag && 6 !== e.tag && 13 !== e.tag && 3 !== e.tag)
      ? null
      : e;
  }
  function kl(e) {
    if (5 === e.tag || 6 === e.tag) return e.stateNode;
    throw Error(n(33));
  }
  function Cl(e) {
    return e[hl] || null;
  }
  var El = [],
    xl = -1;
  function Sl(e) {
    return { current: e };
  }
  function Ll(e) {
    0 > xl || ((e.current = El[xl]), (El[xl] = null), xl--);
  }
  function Ml(e, t) {
    xl++, (El[xl] = e.current), (e.current = t);
  }
  var zl = {},
    Tl = Sl(zl),
    _l = Sl(!1),
    Pl = zl;
  function Nl(e, t) {
    var n = e.type.contextTypes;
    if (!n) return zl;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
      return r.__reactInternalMemoizedMaskedChildContext;
    var l,
      a = {};
    for (l in n) a[l] = t[l];
    return (
      r &&
        (((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = t),
        (e.__reactInternalMemoizedMaskedChildContext = a)),
      a
    );
  }
  function Il(e) {
    return null != (e = e.childContextTypes);
  }
  function Rl() {
    Ll(_l), Ll(Tl);
  }
  function Hl(e, t, r) {
    if (Tl.current !== zl) throw Error(n(168));
    Ml(Tl, t), Ml(_l, r);
  }
  function Dl(e, t, r) {
    var l = e.stateNode;
    if (((t = t.childContextTypes), 'function' != typeof l.getChildContext))
      return r;
    for (var a in (l = l.getChildContext()))
      if (!(a in t)) throw Error(n(108, j(e) || 'Unknown', a));
    return $({}, r, l);
  }
  function Bl(e) {
    return (
      (e =
        ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) ||
        zl),
      (Pl = Tl.current),
      Ml(Tl, e),
      Ml(_l, _l.current),
      !0
    );
  }
  function $l(e, t, r) {
    var l = e.stateNode;
    if (!l) throw Error(n(169));
    r
      ? ((e = Dl(e, t, Pl)),
        (l.__reactInternalMemoizedMergedChildContext = e),
        Ll(_l),
        Ll(Tl),
        Ml(Tl, e))
      : Ll(_l),
      Ml(_l, r);
  }
  var Vl = null,
    Fl = !1,
    Ol = !1;
  function Al(e) {
    null === Vl ? (Vl = [e]) : Vl.push(e);
  }
  function Ul() {
    if (!Ol && null !== Vl) {
      Ol = !0;
      var e = 0,
        t = wt;
      try {
        var n = Vl;
        for (wt = 1; e < n.length; e++) {
          var r = n[e];
          do {
            r = r(!0);
          } while (null !== r);
        }
        (Vl = null), (Fl = !1);
      } catch (t) {
        throw (null !== Vl && (Vl = Vl.slice(e + 1)), Ye(et, Ul), t);
      } finally {
        (wt = t), (Ol = !1);
      }
    }
    return null;
  }
  var jl = [],
    ql = 0,
    Wl = null,
    Ql = 0,
    Yl = [],
    Xl = 0,
    Zl = null,
    Kl = 1,
    Gl = '';
  function Jl(e, t) {
    (jl[ql++] = Ql), (jl[ql++] = Wl), (Wl = e), (Ql = t);
  }
  function ea(e, t, n) {
    (Yl[Xl++] = Kl), (Yl[Xl++] = Gl), (Yl[Xl++] = Zl), (Zl = e);
    var r = Kl;
    e = Gl;
    var l = 32 - it(r) - 1;
    (r &= ~(1 << l)), (n += 1);
    var a = 32 - it(t) + l;
    if (30 < a) {
      var o = l - (l % 5);
      (a = (r & ((1 << o) - 1)).toString(32)),
        (r >>= o),
        (l -= o),
        (Kl = (1 << (32 - it(t) + l)) | (n << l) | r),
        (Gl = a + e);
    } else (Kl = (1 << a) | (n << l) | r), (Gl = e);
  }
  function ta(e) {
    null !== e.return && (Jl(e, 1), ea(e, 1, 0));
  }
  function na(e) {
    for (; e === Wl; )
      (Wl = jl[--ql]), (jl[ql] = null), (Ql = jl[--ql]), (jl[ql] = null);
    for (; e === Zl; )
      (Zl = Yl[--Xl]),
        (Yl[Xl] = null),
        (Gl = Yl[--Xl]),
        (Yl[Xl] = null),
        (Kl = Yl[--Xl]),
        (Yl[Xl] = null);
  }
  var ra = null,
    la = null,
    aa = !1,
    oa = null;
  function ia(e, t) {
    var n = Nu(5, null, null, 0);
    (n.elementType = 'DELETED'),
      (n.stateNode = t),
      (n.return = e),
      null === (t = e.deletions)
        ? ((e.deletions = [n]), (e.flags |= 16))
        : t.push(n);
  }
  function sa(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return (
          null !==
            (t =
              1 !== t.nodeType || n.toLowerCase() !== t.nodeName.toLowerCase()
                ? null
                : t) &&
          ((e.stateNode = t), (ra = e), (la = cl(t.firstChild)), !0)
        );
      case 6:
        return (
          null !== (t = '' === e.pendingProps || 3 !== t.nodeType ? null : t) &&
          ((e.stateNode = t), (ra = e), (la = null), !0)
        );
      case 13:
        return (
          null !== (t = 8 !== t.nodeType ? null : t) &&
          ((n = null !== Zl ? { id: Kl, overflow: Gl } : null),
          (e.memoizedState = {
            dehydrated: t,
            treeContext: n,
            retryLane: 1073741824,
          }),
          ((n = Nu(18, null, null, 0)).stateNode = t),
          (n.return = e),
          (e.child = n),
          (ra = e),
          (la = null),
          !0)
        );
      default:
        return !1;
    }
  }
  function ua(e) {
    return !(!(1 & e.mode) || 128 & e.flags);
  }
  function ca(e) {
    if (aa) {
      var t = la;
      if (t) {
        var r = t;
        if (!sa(e, t)) {
          if (ua(e)) throw Error(n(418));
          t = cl(r.nextSibling);
          var l = ra;
          t && sa(e, t)
            ? ia(l, r)
            : ((e.flags = (-4097 & e.flags) | 2), (aa = !1), (ra = e));
        }
      } else {
        if (ua(e)) throw Error(n(418));
        (e.flags = (-4097 & e.flags) | 2), (aa = !1), (ra = e);
      }
    }
  }
  function da(e) {
    for (
      e = e.return;
      null !== e && 5 !== e.tag && 3 !== e.tag && 13 !== e.tag;

    )
      e = e.return;
    ra = e;
  }
  function fa(e) {
    if (e !== ra) return !1;
    if (!aa) return da(e), (aa = !0), !1;
    var t;
    if (
      ((t = 3 !== e.tag) &&
        !(t = 5 !== e.tag) &&
        (t =
          'head' !== (t = e.type) &&
          'body' !== t &&
          !rl(e.type, e.memoizedProps)),
      t && (t = la))
    ) {
      if (ua(e)) throw (pa(), Error(n(418)));
      for (; t; ) ia(e, t), (t = cl(t.nextSibling));
    }
    if ((da(e), 13 === e.tag)) {
      if (!(e = null !== (e = e.memoizedState) ? e.dehydrated : null))
        throw Error(n(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (8 === e.nodeType) {
            var r = e.data;
            if ('/$' === r) {
              if (0 === t) {
                la = cl(e.nextSibling);
                break e;
              }
              t--;
            } else ('$' !== r && '$!' !== r && '$?' !== r) || t++;
          }
          e = e.nextSibling;
        }
        la = null;
      }
    } else la = ra ? cl(e.stateNode.nextSibling) : null;
    return !0;
  }
  function pa() {
    for (var e = la; e; ) e = cl(e.nextSibling);
  }
  function ha() {
    (la = ra = null), (aa = !1);
  }
  function ma(e) {
    null === oa ? (oa = [e]) : oa.push(e);
  }
  var ga = v.ReactCurrentBatchConfig;
  function va(e, t, r) {
    if (
      null !== (e = r.ref) &&
      'function' != typeof e &&
      'object' != typeof e
    ) {
      if (r._owner) {
        if ((r = r._owner)) {
          if (1 !== r.tag) throw Error(n(309));
          var l = r.stateNode;
        }
        if (!l) throw Error(n(147, e));
        var a = l,
          o = '' + e;
        return null !== t &&
          null !== t.ref &&
          'function' == typeof t.ref &&
          t.ref._stringRef === o
          ? t.ref
          : ((t = function (e) {
              var t = a.refs;
              null === e ? delete t[o] : (t[o] = e);
            }),
            (t._stringRef = o),
            t);
      }
      if ('string' != typeof e) throw Error(n(284));
      if (!r._owner) throw Error(n(290, e));
    }
    return e;
  }
  function ya(e, t) {
    throw (
      ((e = Object.prototype.toString.call(t)),
      Error(
        n(
          31,
          '[object Object]' === e
            ? 'object with keys {' + Object.keys(t).join(', ') + '}'
            : e
        )
      ))
    );
  }
  function ba(e) {
    return (0, e._init)(e._payload);
  }
  function wa(e) {
    function t(t, n) {
      if (e) {
        var r = t.deletions;
        null === r ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
      }
    }
    function r(n, r) {
      if (!e) return null;
      for (; null !== r; ) t(n, r), (r = r.sibling);
      return null;
    }
    function l(e, t) {
      for (e = new Map(); null !== t; )
        null !== t.key ? e.set(t.key, t) : e.set(t.index, t), (t = t.sibling);
      return e;
    }
    function a(e, t) {
      return ((e = Ru(e, t)).index = 0), (e.sibling = null), e;
    }
    function o(t, n, r) {
      return (
        (t.index = r),
        e
          ? null !== (r = t.alternate)
            ? (r = r.index) < n
              ? ((t.flags |= 2), n)
              : r
            : ((t.flags |= 2), n)
          : ((t.flags |= 1048576), n)
      );
    }
    function i(t) {
      return e && null === t.alternate && (t.flags |= 2), t;
    }
    function s(e, t, n, r) {
      return null === t || 6 !== t.tag
        ? (((t = $u(n, e.mode, r)).return = e), t)
        : (((t = a(t, n)).return = e), t);
    }
    function u(e, t, n, r) {
      var l = n.type;
      return l === w
        ? d(e, t, n.props.children, r, n.key)
        : null !== t &&
            (t.elementType === l ||
              ('object' == typeof l &&
                null !== l &&
                l.$$typeof === N &&
                ba(l) === t.type))
          ? (((r = a(t, n.props)).ref = va(e, t, n)), (r.return = e), r)
          : (((r = Hu(n.type, n.key, n.props, null, e.mode, r)).ref = va(
              e,
              t,
              n
            )),
            (r.return = e),
            r);
    }
    function c(e, t, n, r) {
      return null === t ||
        4 !== t.tag ||
        t.stateNode.containerInfo !== n.containerInfo ||
        t.stateNode.implementation !== n.implementation
        ? (((t = Vu(n, e.mode, r)).return = e), t)
        : (((t = a(t, n.children || [])).return = e), t);
    }
    function d(e, t, n, r, l) {
      return null === t || 7 !== t.tag
        ? (((t = Du(n, e.mode, r, l)).return = e), t)
        : (((t = a(t, n)).return = e), t);
    }
    function f(e, t, n) {
      if (('string' == typeof t && '' !== t) || 'number' == typeof t)
        return ((t = $u('' + t, e.mode, n)).return = e), t;
      if ('object' == typeof t && null !== t) {
        switch (t.$$typeof) {
          case y:
            return (
              ((n = Hu(t.type, t.key, t.props, null, e.mode, n)).ref = va(
                e,
                null,
                t
              )),
              (n.return = e),
              n
            );
          case b:
            return ((t = Vu(t, e.mode, n)).return = e), t;
          case N:
            return f(e, (0, t._init)(t._payload), n);
        }
        if (ne(t) || H(t)) return ((t = Du(t, e.mode, n, null)).return = e), t;
        ya(e, t);
      }
      return null;
    }
    function p(e, t, n, r) {
      var l = null !== t ? t.key : null;
      if (('string' == typeof n && '' !== n) || 'number' == typeof n)
        return null !== l ? null : s(e, t, '' + n, r);
      if ('object' == typeof n && null !== n) {
        switch (n.$$typeof) {
          case y:
            return n.key === l ? u(e, t, n, r) : null;
          case b:
            return n.key === l ? c(e, t, n, r) : null;
          case N:
            return p(e, t, (l = n._init)(n._payload), r);
        }
        if (ne(n) || H(n)) return null !== l ? null : d(e, t, n, r, null);
        ya(e, n);
      }
      return null;
    }
    function h(e, t, n, r, l) {
      if (('string' == typeof r && '' !== r) || 'number' == typeof r)
        return s(t, (e = e.get(n) || null), '' + r, l);
      if ('object' == typeof r && null !== r) {
        switch (r.$$typeof) {
          case y:
            return u(t, (e = e.get(null === r.key ? n : r.key) || null), r, l);
          case b:
            return c(t, (e = e.get(null === r.key ? n : r.key) || null), r, l);
          case N:
            return h(e, t, n, (0, r._init)(r._payload), l);
        }
        if (ne(r) || H(r)) return d(t, (e = e.get(n) || null), r, l, null);
        ya(t, r);
      }
      return null;
    }
    function m(n, a, i, s) {
      for (
        var u = null, c = null, d = a, m = (a = 0), g = null;
        null !== d && m < i.length;
        m++
      ) {
        d.index > m ? ((g = d), (d = null)) : (g = d.sibling);
        var v = p(n, d, i[m], s);
        if (null === v) {
          null === d && (d = g);
          break;
        }
        e && d && null === v.alternate && t(n, d),
          (a = o(v, a, m)),
          null === c ? (u = v) : (c.sibling = v),
          (c = v),
          (d = g);
      }
      if (m === i.length) return r(n, d), aa && Jl(n, m), u;
      if (null === d) {
        for (; m < i.length; m++)
          null !== (d = f(n, i[m], s)) &&
            ((a = o(d, a, m)), null === c ? (u = d) : (c.sibling = d), (c = d));
        return aa && Jl(n, m), u;
      }
      for (d = l(n, d); m < i.length; m++)
        null !== (g = h(d, n, m, i[m], s)) &&
          (e && null !== g.alternate && d.delete(null === g.key ? m : g.key),
          (a = o(g, a, m)),
          null === c ? (u = g) : (c.sibling = g),
          (c = g));
      return (
        e &&
          d.forEach(function (e) {
            return t(n, e);
          }),
        aa && Jl(n, m),
        u
      );
    }
    function g(a, i, s, u) {
      var c = H(s);
      if ('function' != typeof c) throw Error(n(150));
      if (null == (s = c.call(s))) throw Error(n(151));
      for (
        var d = (c = null), m = i, g = (i = 0), v = null, y = s.next();
        null !== m && !y.done;
        g++, y = s.next()
      ) {
        m.index > g ? ((v = m), (m = null)) : (v = m.sibling);
        var b = p(a, m, y.value, u);
        if (null === b) {
          null === m && (m = v);
          break;
        }
        e && m && null === b.alternate && t(a, m),
          (i = o(b, i, g)),
          null === d ? (c = b) : (d.sibling = b),
          (d = b),
          (m = v);
      }
      if (y.done) return r(a, m), aa && Jl(a, g), c;
      if (null === m) {
        for (; !y.done; g++, y = s.next())
          null !== (y = f(a, y.value, u)) &&
            ((i = o(y, i, g)), null === d ? (c = y) : (d.sibling = y), (d = y));
        return aa && Jl(a, g), c;
      }
      for (m = l(a, m); !y.done; g++, y = s.next())
        null !== (y = h(m, a, g, y.value, u)) &&
          (e && null !== y.alternate && m.delete(null === y.key ? g : y.key),
          (i = o(y, i, g)),
          null === d ? (c = y) : (d.sibling = y),
          (d = y));
      return (
        e &&
          m.forEach(function (e) {
            return t(a, e);
          }),
        aa && Jl(a, g),
        c
      );
    }
    return function e(n, l, o, s) {
      if (
        ('object' == typeof o &&
          null !== o &&
          o.type === w &&
          null === o.key &&
          (o = o.props.children),
        'object' == typeof o && null !== o)
      ) {
        switch (o.$$typeof) {
          case y:
            e: {
              for (var u = o.key, c = l; null !== c; ) {
                if (c.key === u) {
                  if ((u = o.type) === w) {
                    if (7 === c.tag) {
                      r(n, c.sibling),
                        ((l = a(c, o.props.children)).return = n),
                        (n = l);
                      break e;
                    }
                  } else if (
                    c.elementType === u ||
                    ('object' == typeof u &&
                      null !== u &&
                      u.$$typeof === N &&
                      ba(u) === c.type)
                  ) {
                    r(n, c.sibling),
                      ((l = a(c, o.props)).ref = va(n, c, o)),
                      (l.return = n),
                      (n = l);
                    break e;
                  }
                  r(n, c);
                  break;
                }
                t(n, c), (c = c.sibling);
              }
              o.type === w
                ? (((l = Du(o.props.children, n.mode, s, o.key)).return = n),
                  (n = l))
                : (((s = Hu(o.type, o.key, o.props, null, n.mode, s)).ref = va(
                    n,
                    l,
                    o
                  )),
                  (s.return = n),
                  (n = s));
            }
            return i(n);
          case b:
            e: {
              for (c = o.key; null !== l; ) {
                if (l.key === c) {
                  if (
                    4 === l.tag &&
                    l.stateNode.containerInfo === o.containerInfo &&
                    l.stateNode.implementation === o.implementation
                  ) {
                    r(n, l.sibling),
                      ((l = a(l, o.children || [])).return = n),
                      (n = l);
                    break e;
                  }
                  r(n, l);
                  break;
                }
                t(n, l), (l = l.sibling);
              }
              ((l = Vu(o, n.mode, s)).return = n), (n = l);
            }
            return i(n);
          case N:
            return e(n, l, (c = o._init)(o._payload), s);
        }
        if (ne(o)) return m(n, l, o, s);
        if (H(o)) return g(n, l, o, s);
        ya(n, o);
      }
      return ('string' == typeof o && '' !== o) || 'number' == typeof o
        ? ((o = '' + o),
          null !== l && 6 === l.tag
            ? (r(n, l.sibling), ((l = a(l, o)).return = n), (n = l))
            : (r(n, l), ((l = $u(o, n.mode, s)).return = n), (n = l)),
          i(n))
        : r(n, l);
    };
  }
  var ka = wa(!0),
    Ca = wa(!1),
    Ea = Sl(null),
    xa = null,
    Sa = null,
    La = null;
  function Ma() {
    La = Sa = xa = null;
  }
  function za(e) {
    var t = Ea.current;
    Ll(Ea), (e._currentValue = t);
  }
  function Ta(e, t, n) {
    for (; null !== e; ) {
      var r = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), null !== r && (r.childLanes |= t))
          : null !== r && (r.childLanes & t) !== t && (r.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function _a(e, t) {
    (xa = e),
      (La = Sa = null),
      null !== (e = e.dependencies) &&
        null !== e.firstContext &&
        (0 !== (e.lanes & t) && (wi = !0), (e.firstContext = null));
  }
  function Pa(e) {
    var t = e._currentValue;
    if (La !== e)
      if (((e = { context: e, memoizedValue: t, next: null }), null === Sa)) {
        if (null === xa) throw Error(n(308));
        (Sa = e), (xa.dependencies = { lanes: 0, firstContext: e });
      } else Sa = Sa.next = e;
    return t;
  }
  var Na = null;
  function Ia(e) {
    null === Na ? (Na = [e]) : Na.push(e);
  }
  function Ra(e, t, n, r) {
    var l = t.interleaved;
    return (
      null === l ? ((n.next = n), Ia(t)) : ((n.next = l.next), (l.next = n)),
      (t.interleaved = n),
      Ha(e, r)
    );
  }
  function Ha(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (null !== n && (n.lanes |= t), n = e, e = e.return; null !== e; )
      (e.childLanes |= t),
        null !== (n = e.alternate) && (n.childLanes |= t),
        (n = e),
        (e = e.return);
    return 3 === n.tag ? n.stateNode : null;
  }
  var Da = !1;
  function Ba(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, interleaved: null, lanes: 0 },
      effects: null,
    };
  }
  function $a(e, t) {
    (e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          effects: e.effects,
        });
  }
  function Va(e, t) {
    return {
      eventTime: e,
      lane: t,
      tag: 0,
      payload: null,
      callback: null,
      next: null,
    };
  }
  function Fa(e, t, n) {
    var r = e.updateQueue;
    if (null === r) return null;
    if (((r = r.shared), 2 & Ts)) {
      var l = r.pending;
      return (
        null === l ? (t.next = t) : ((t.next = l.next), (l.next = t)),
        (r.pending = t),
        Ha(e, n)
      );
    }
    return (
      null === (l = r.interleaved)
        ? ((t.next = t), Ia(r))
        : ((t.next = l.next), (l.next = t)),
      (r.interleaved = t),
      Ha(e, n)
    );
  }
  function Oa(e, t, n) {
    if (null !== (t = t.updateQueue) && ((t = t.shared), 4194240 & n)) {
      var r = t.lanes;
      (n |= r &= e.pendingLanes), (t.lanes = n), bt(e, n);
    }
  }
  function Aa(e, t) {
    var n = e.updateQueue,
      r = e.alternate;
    if (null !== r && n === (r = r.updateQueue)) {
      var l = null,
        a = null;
      if (null !== (n = n.firstBaseUpdate)) {
        do {
          var o = {
            eventTime: n.eventTime,
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: n.callback,
            next: null,
          };
          null === a ? (l = a = o) : (a = a.next = o), (n = n.next);
        } while (null !== n);
        null === a ? (l = a = t) : (a = a.next = t);
      } else l = a = t;
      return (
        (n = {
          baseState: r.baseState,
          firstBaseUpdate: l,
          lastBaseUpdate: a,
          shared: r.shared,
          effects: r.effects,
        }),
        void (e.updateQueue = n)
      );
    }
    null === (e = n.lastBaseUpdate) ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t);
  }
  function Ua(e, t, n, r) {
    var l = e.updateQueue;
    Da = !1;
    var a = l.firstBaseUpdate,
      o = l.lastBaseUpdate,
      i = l.shared.pending;
    if (null !== i) {
      l.shared.pending = null;
      var s = i,
        u = s.next;
      (s.next = null), null === o ? (a = u) : (o.next = u), (o = s);
      var c = e.alternate;
      null !== c &&
        (i = (c = c.updateQueue).lastBaseUpdate) !== o &&
        (null === i ? (c.firstBaseUpdate = u) : (i.next = u),
        (c.lastBaseUpdate = s));
    }
    if (null !== a) {
      var d = l.baseState;
      for (o = 0, c = u = s = null, i = a; ; ) {
        var f = i.lane,
          p = i.eventTime;
        if ((r & f) === f) {
          null !== c &&
            (c = c.next =
              {
                eventTime: p,
                lane: 0,
                tag: i.tag,
                payload: i.payload,
                callback: i.callback,
                next: null,
              });
          e: {
            var h = e,
              m = i;
            switch (((f = t), (p = n), m.tag)) {
              case 1:
                if ('function' == typeof (h = m.payload)) {
                  d = h.call(p, d, f);
                  break e;
                }
                d = h;
                break e;
              case 3:
                h.flags = (-65537 & h.flags) | 128;
              case 0:
                if (
                  null ==
                  (f =
                    'function' == typeof (h = m.payload) ? h.call(p, d, f) : h)
                )
                  break e;
                d = $({}, d, f);
                break e;
              case 2:
                Da = !0;
            }
          }
          null !== i.callback &&
            0 !== i.lane &&
            ((e.flags |= 64),
            null === (f = l.effects) ? (l.effects = [i]) : f.push(i));
        } else
          (p = {
            eventTime: p,
            lane: f,
            tag: i.tag,
            payload: i.payload,
            callback: i.callback,
            next: null,
          }),
            null === c ? ((u = c = p), (s = d)) : (c = c.next = p),
            (o |= f);
        if (null === (i = i.next)) {
          if (null === (i = l.shared.pending)) break;
          (i = (f = i).next),
            (f.next = null),
            (l.lastBaseUpdate = f),
            (l.shared.pending = null);
        }
      }
      if (
        (null === c && (s = d),
        (l.baseState = s),
        (l.firstBaseUpdate = u),
        (l.lastBaseUpdate = c),
        null !== (t = l.shared.interleaved))
      ) {
        l = t;
        do {
          (o |= l.lane), (l = l.next);
        } while (l !== t);
      } else null === a && (l.shared.lanes = 0);
      (Bs |= o), (e.lanes = o), (e.memoizedState = d);
    }
  }
  function ja(e, t, r) {
    if (((e = t.effects), (t.effects = null), null !== e))
      for (t = 0; t < e.length; t++) {
        var l = e[t],
          a = l.callback;
        if (null !== a) {
          if (((l.callback = null), (l = r), 'function' != typeof a))
            throw Error(n(191, a));
          a.call(l);
        }
      }
  }
  var qa = {},
    Wa = Sl(qa),
    Qa = Sl(qa),
    Ya = Sl(qa);
  function Xa(e) {
    if (e === qa) throw Error(n(174));
    return e;
  }
  function Za(e, t) {
    switch ((Ml(Ya, t), Ml(Qa, e), Ml(Wa, qa), (e = t.nodeType))) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : ue(null, '');
        break;
      default:
        t = ue(
          (t = (e = 8 === e ? t.parentNode : t).namespaceURI || null),
          (e = e.tagName)
        );
    }
    Ll(Wa), Ml(Wa, t);
  }
  function Ka() {
    Ll(Wa), Ll(Qa), Ll(Ya);
  }
  function Ga(e) {
    Xa(Ya.current);
    var t = Xa(Wa.current),
      n = ue(t, e.type);
    t !== n && (Ml(Qa, e), Ml(Wa, n));
  }
  function Ja(e) {
    Qa.current === e && (Ll(Wa), Ll(Qa));
  }
  var eo = Sl(0);
  function to(e) {
    for (var t = e; null !== t; ) {
      if (13 === t.tag) {
        var n = t.memoizedState;
        if (
          null !== n &&
          (null === (n = n.dehydrated) || '$?' === n.data || '$!' === n.data)
        )
          return t;
      } else if (19 === t.tag && void 0 !== t.memoizedProps.revealOrder) {
        if (128 & t.flags) return t;
      } else if (null !== t.child) {
        (t.child.return = t), (t = t.child);
        continue;
      }
      if (t === e) break;
      for (; null === t.sibling; ) {
        if (null === t.return || t.return === e) return null;
        t = t.return;
      }
      (t.sibling.return = t.return), (t = t.sibling);
    }
    return null;
  }
  var no = [];
  function ro() {
    for (var e = 0; e < no.length; e++)
      no[e]._workInProgressVersionPrimary = null;
    no.length = 0;
  }
  var lo = v.ReactCurrentDispatcher,
    ao = v.ReactCurrentBatchConfig,
    oo = 0,
    io = null,
    so = null,
    uo = null,
    co = !1,
    fo = !1,
    po = 0,
    ho = 0;
  function mo() {
    throw Error(n(321));
  }
  function go(e, t) {
    if (null === t) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!sr(e[n], t[n])) return !1;
    return !0;
  }
  function vo(e, t, r, l, a, o) {
    if (
      ((oo = o),
      (io = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (lo.current = null === e || null === e.memoizedState ? ei : ti),
      (e = r(l, a)),
      fo)
    ) {
      o = 0;
      do {
        if (((fo = !1), (po = 0), 25 <= o)) throw Error(n(301));
        (o += 1),
          (uo = so = null),
          (t.updateQueue = null),
          (lo.current = ni),
          (e = r(l, a));
      } while (fo);
    }
    if (
      ((lo.current = Jo),
      (t = null !== so && null !== so.next),
      (oo = 0),
      (uo = so = io = null),
      (co = !1),
      t)
    )
      throw Error(n(300));
    return e;
  }
  function yo() {
    var e = 0 !== po;
    return (po = 0), e;
  }
  function bo() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return null === uo ? (io.memoizedState = uo = e) : (uo = uo.next = e), uo;
  }
  function wo() {
    if (null === so) {
      var e = io.alternate;
      e = null !== e ? e.memoizedState : null;
    } else e = so.next;
    var t = null === uo ? io.memoizedState : uo.next;
    if (null !== t) (uo = t), (so = e);
    else {
      if (null === e) throw Error(n(310));
      (e = {
        memoizedState: (so = e).memoizedState,
        baseState: so.baseState,
        baseQueue: so.baseQueue,
        queue: so.queue,
        next: null,
      }),
        null === uo ? (io.memoizedState = uo = e) : (uo = uo.next = e);
    }
    return uo;
  }
  function ko(e, t) {
    return 'function' == typeof t ? t(e) : t;
  }
  function Co(e) {
    var t = wo(),
      r = t.queue;
    if (null === r) throw Error(n(311));
    r.lastRenderedReducer = e;
    var l = so,
      a = l.baseQueue,
      o = r.pending;
    if (null !== o) {
      if (null !== a) {
        var i = a.next;
        (a.next = o.next), (o.next = i);
      }
      (l.baseQueue = a = o), (r.pending = null);
    }
    if (null !== a) {
      (o = a.next), (l = l.baseState);
      var s = (i = null),
        u = null,
        c = o;
      do {
        var d = c.lane;
        if ((oo & d) === d)
          null !== u &&
            (u = u.next =
              {
                lane: 0,
                action: c.action,
                hasEagerState: c.hasEagerState,
                eagerState: c.eagerState,
                next: null,
              }),
            (l = c.hasEagerState ? c.eagerState : e(l, c.action));
        else {
          var f = {
            lane: d,
            action: c.action,
            hasEagerState: c.hasEagerState,
            eagerState: c.eagerState,
            next: null,
          };
          null === u ? ((s = u = f), (i = l)) : (u = u.next = f),
            (io.lanes |= d),
            (Bs |= d);
        }
        c = c.next;
      } while (null !== c && c !== o);
      null === u ? (i = l) : (u.next = s),
        sr(l, t.memoizedState) || (wi = !0),
        (t.memoizedState = l),
        (t.baseState = i),
        (t.baseQueue = u),
        (r.lastRenderedState = l);
    }
    if (null !== (e = r.interleaved)) {
      a = e;
      do {
        (o = a.lane), (io.lanes |= o), (Bs |= o), (a = a.next);
      } while (a !== e);
    } else null === a && (r.lanes = 0);
    return [t.memoizedState, r.dispatch];
  }
  function Eo(e) {
    var t = wo(),
      r = t.queue;
    if (null === r) throw Error(n(311));
    r.lastRenderedReducer = e;
    var l = r.dispatch,
      a = r.pending,
      o = t.memoizedState;
    if (null !== a) {
      r.pending = null;
      var i = (a = a.next);
      do {
        (o = e(o, i.action)), (i = i.next);
      } while (i !== a);
      sr(o, t.memoizedState) || (wi = !0),
        (t.memoizedState = o),
        null === t.baseQueue && (t.baseState = o),
        (r.lastRenderedState = o);
    }
    return [o, l];
  }
  function xo() {}
  function So(e, t) {
    var r = io,
      l = wo(),
      a = t(),
      o = !sr(l.memoizedState, a);
    if (
      (o && ((l.memoizedState = a), (wi = !0)),
      (l = l.queue),
      Bo(zo.bind(null, r, l, e), [e]),
      l.getSnapshot !== t || o || (null !== uo && 1 & uo.memoizedState.tag))
    ) {
      if (
        ((r.flags |= 2048),
        No(9, Mo.bind(null, r, l, a, t), void 0, null),
        null === _s)
      )
        throw Error(n(349));
      30 & oo || Lo(r, t, a);
    }
    return a;
  }
  function Lo(e, t, n) {
    (e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      null === (t = io.updateQueue)
        ? ((t = { lastEffect: null, stores: null }),
          (io.updateQueue = t),
          (t.stores = [e]))
        : null === (n = t.stores)
          ? (t.stores = [e])
          : n.push(e);
  }
  function Mo(e, t, n, r) {
    (t.value = n), (t.getSnapshot = r), To(t) && _o(e);
  }
  function zo(e, t, n) {
    return n(function () {
      To(t) && _o(e);
    });
  }
  function To(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !sr(e, n);
    } catch (e) {
      return !0;
    }
  }
  function _o(e) {
    var t = Ha(e, 1);
    null !== t && ru(t, e, 1, -1);
  }
  function Po(e) {
    var t = bo();
    return (
      'function' == typeof e && (e = e()),
      (t.memoizedState = t.baseState = e),
      (e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: ko,
        lastRenderedState: e,
      }),
      (t.queue = e),
      (e = e.dispatch = Xo.bind(null, io, e)),
      [t.memoizedState, e]
    );
  }
  function No(e, t, n, r) {
    return (
      (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
      null === (t = io.updateQueue)
        ? ((t = { lastEffect: null, stores: null }),
          (io.updateQueue = t),
          (t.lastEffect = e.next = e))
        : null === (n = t.lastEffect)
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
      e
    );
  }
  function Io() {
    return wo().memoizedState;
  }
  function Ro(e, t, n, r) {
    var l = bo();
    (io.flags |= e),
      (l.memoizedState = No(1 | t, n, void 0, void 0 === r ? null : r));
  }
  function Ho(e, t, n, r) {
    var l = wo();
    r = void 0 === r ? null : r;
    var a = void 0;
    if (null !== so) {
      var o = so.memoizedState;
      if (((a = o.destroy), null !== r && go(r, o.deps)))
        return void (l.memoizedState = No(t, n, a, r));
    }
    (io.flags |= e), (l.memoizedState = No(1 | t, n, a, r));
  }
  function Do(e, t) {
    return Ro(8390656, 8, e, t);
  }
  function Bo(e, t) {
    return Ho(2048, 8, e, t);
  }
  function $o(e, t) {
    return Ho(4, 2, e, t);
  }
  function Vo(e, t) {
    return Ho(4, 4, e, t);
  }
  function Fo(e, t) {
    return 'function' == typeof t
      ? ((e = e()),
        t(e),
        function () {
          t(null);
        })
      : null != t
        ? ((e = e()),
          (t.current = e),
          function () {
            t.current = null;
          })
        : void 0;
  }
  function Oo(e, t, n) {
    return (
      (n = null != n ? n.concat([e]) : null), Ho(4, 4, Fo.bind(null, t, e), n)
    );
  }
  function Ao() {}
  function Uo(e, t) {
    var n = wo();
    t = void 0 === t ? null : t;
    var r = n.memoizedState;
    return null !== r && null !== t && go(t, r[1])
      ? r[0]
      : ((n.memoizedState = [e, t]), e);
  }
  function jo(e, t) {
    var n = wo();
    t = void 0 === t ? null : t;
    var r = n.memoizedState;
    return null !== r && null !== t && go(t, r[1])
      ? r[0]
      : ((e = e()), (n.memoizedState = [e, t]), e);
  }
  function qo(e, t, n) {
    return 21 & oo
      ? (sr(n, t) ||
          ((n = gt()), (io.lanes |= n), (Bs |= n), (e.baseState = !0)),
        t)
      : (e.baseState && ((e.baseState = !1), (wi = !0)), (e.memoizedState = n));
  }
  function Wo(e, t) {
    var n = wt;
    (wt = 0 !== n && 4 > n ? n : 4), e(!0);
    var r = ao.transition;
    ao.transition = {};
    try {
      e(!1), t();
    } finally {
      (wt = n), (ao.transition = r);
    }
  }
  function Qo() {
    return wo().memoizedState;
  }
  function Yo(e, t, n) {
    var r = nu(e);
    if (
      ((n = {
        lane: r,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Zo(e))
    )
      Ko(t, n);
    else if (null !== (n = Ra(e, t, n, r))) {
      ru(n, e, r, tu()), Go(n, t, r);
    }
  }
  function Xo(e, t, n) {
    var r = nu(e),
      l = {
        lane: r,
        action: n,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      };
    if (Zo(e)) Ko(t, l);
    else {
      var a = e.alternate;
      if (
        0 === e.lanes &&
        (null === a || 0 === a.lanes) &&
        null !== (a = t.lastRenderedReducer)
      )
        try {
          var o = t.lastRenderedState,
            i = a(o, n);
          if (((l.hasEagerState = !0), (l.eagerState = i), sr(i, o))) {
            var s = t.interleaved;
            return (
              null === s
                ? ((l.next = l), Ia(t))
                : ((l.next = s.next), (s.next = l)),
              void (t.interleaved = l)
            );
          }
        } catch (e) {}
      null !== (n = Ra(e, t, l, r)) && (ru(n, e, r, (l = tu())), Go(n, t, r));
    }
  }
  function Zo(e) {
    var t = e.alternate;
    return e === io || (null !== t && t === io);
  }
  function Ko(e, t) {
    fo = co = !0;
    var n = e.pending;
    null === n ? (t.next = t) : ((t.next = n.next), (n.next = t)),
      (e.pending = t);
  }
  function Go(e, t, n) {
    if (4194240 & n) {
      var r = t.lanes;
      (n |= r &= e.pendingLanes), (t.lanes = n), bt(e, n);
    }
  }
  var Jo = {
      readContext: Pa,
      useCallback: mo,
      useContext: mo,
      useEffect: mo,
      useImperativeHandle: mo,
      useInsertionEffect: mo,
      useLayoutEffect: mo,
      useMemo: mo,
      useReducer: mo,
      useRef: mo,
      useState: mo,
      useDebugValue: mo,
      useDeferredValue: mo,
      useTransition: mo,
      useMutableSource: mo,
      useSyncExternalStore: mo,
      useId: mo,
      unstable_isNewReconciler: !1,
    },
    ei = {
      readContext: Pa,
      useCallback: function (e, t) {
        return (bo().memoizedState = [e, void 0 === t ? null : t]), e;
      },
      useContext: Pa,
      useEffect: Do,
      useImperativeHandle: function (e, t, n) {
        return (
          (n = null != n ? n.concat([e]) : null),
          Ro(4194308, 4, Fo.bind(null, t, e), n)
        );
      },
      useLayoutEffect: function (e, t) {
        return Ro(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        return Ro(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = bo();
        return (
          (t = void 0 === t ? null : t),
          (e = e()),
          (n.memoizedState = [e, t]),
          e
        );
      },
      useReducer: function (e, t, n) {
        var r = bo();
        return (
          (t = void 0 !== n ? n(t) : t),
          (r.memoizedState = r.baseState = t),
          (e = {
            pending: null,
            interleaved: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: t,
          }),
          (r.queue = e),
          (e = e.dispatch = Yo.bind(null, io, e)),
          [r.memoizedState, e]
        );
      },
      useRef: function (e) {
        return (e = { current: e }), (bo().memoizedState = e);
      },
      useState: Po,
      useDebugValue: Ao,
      useDeferredValue: function (e) {
        return (bo().memoizedState = e);
      },
      useTransition: function () {
        var e = Po(!1),
          t = e[0];
        return (e = Wo.bind(null, e[1])), (bo().memoizedState = e), [t, e];
      },
      useMutableSource: function () {},
      useSyncExternalStore: function (e, t, r) {
        var l = io,
          a = bo();
        if (aa) {
          if (void 0 === r) throw Error(n(407));
          r = r();
        } else {
          if (((r = t()), null === _s)) throw Error(n(349));
          30 & oo || Lo(l, t, r);
        }
        a.memoizedState = r;
        var o = { value: r, getSnapshot: t };
        return (
          (a.queue = o),
          Do(zo.bind(null, l, o, e), [e]),
          (l.flags |= 2048),
          No(9, Mo.bind(null, l, o, r, t), void 0, null),
          r
        );
      },
      useId: function () {
        var e = bo(),
          t = _s.identifierPrefix;
        if (aa) {
          var n = Gl;
          (t =
            ':' +
            t +
            'R' +
            (n = (Kl & ~(1 << (32 - it(Kl) - 1))).toString(32) + n)),
            0 < (n = po++) && (t += 'H' + n.toString(32)),
            (t += ':');
        } else t = ':' + t + 'r' + (n = ho++).toString(32) + ':';
        return (e.memoizedState = t);
      },
      unstable_isNewReconciler: !1,
    },
    ti = {
      readContext: Pa,
      useCallback: Uo,
      useContext: Pa,
      useEffect: Bo,
      useImperativeHandle: Oo,
      useInsertionEffect: $o,
      useLayoutEffect: Vo,
      useMemo: jo,
      useReducer: Co,
      useRef: Io,
      useState: function () {
        return Co(ko);
      },
      useDebugValue: Ao,
      useDeferredValue: function (e) {
        return qo(wo(), so.memoizedState, e);
      },
      useTransition: function () {
        return [Co(ko)[0], wo().memoizedState];
      },
      useMutableSource: xo,
      useSyncExternalStore: So,
      useId: Qo,
      unstable_isNewReconciler: !1,
    },
    ni = {
      readContext: Pa,
      useCallback: Uo,
      useContext: Pa,
      useEffect: Bo,
      useImperativeHandle: Oo,
      useInsertionEffect: $o,
      useLayoutEffect: Vo,
      useMemo: jo,
      useReducer: Eo,
      useRef: Io,
      useState: function () {
        return Eo(ko);
      },
      useDebugValue: Ao,
      useDeferredValue: function (e) {
        var t = wo();
        return null === so ? (t.memoizedState = e) : qo(t, so.memoizedState, e);
      },
      useTransition: function () {
        return [Eo(ko)[0], wo().memoizedState];
      },
      useMutableSource: xo,
      useSyncExternalStore: So,
      useId: Qo,
      unstable_isNewReconciler: !1,
    };
  function ri(e, t) {
    if (e && e.defaultProps) {
      for (var n in ((t = $({}, t)), (e = e.defaultProps)))
        void 0 === t[n] && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function li(e, t, n, r) {
    (n = null == (n = n(r, (t = e.memoizedState))) ? t : $({}, t, n)),
      (e.memoizedState = n),
      0 === e.lanes && (e.updateQueue.baseState = n);
  }
  var ai = {
    isMounted: function (e) {
      return !!(e = e._reactInternals) && Ue(e) === e;
    },
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var r = tu(),
        l = nu(e),
        a = Va(r, l);
      (a.payload = t),
        null != n && (a.callback = n),
        null !== (t = Fa(e, a, l)) && (ru(t, e, l, r), Oa(t, e, l));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var r = tu(),
        l = nu(e),
        a = Va(r, l);
      (a.tag = 1),
        (a.payload = t),
        null != n && (a.callback = n),
        null !== (t = Fa(e, a, l)) && (ru(t, e, l, r), Oa(t, e, l));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = tu(),
        r = nu(e),
        l = Va(n, r);
      (l.tag = 2),
        null != t && (l.callback = t),
        null !== (t = Fa(e, l, r)) && (ru(t, e, r, n), Oa(t, e, r));
    },
  };
  function oi(e, t, n, r, l, a, o) {
    return 'function' == typeof (e = e.stateNode).shouldComponentUpdate
      ? e.shouldComponentUpdate(r, a, o)
      : !t.prototype ||
          !t.prototype.isPureReactComponent ||
          !ur(n, r) ||
          !ur(l, a);
  }
  function ii(e, t, n) {
    var r = !1,
      l = zl,
      a = t.contextType;
    return (
      'object' == typeof a && null !== a
        ? (a = Pa(a))
        : ((l = Il(t) ? Pl : Tl.current),
          (a = (r = null != (r = t.contextTypes)) ? Nl(e, l) : zl)),
      (t = new t(n, a)),
      (e.memoizedState =
        null !== t.state && void 0 !== t.state ? t.state : null),
      (t.updater = ai),
      (e.stateNode = t),
      (t._reactInternals = e),
      r &&
        (((e = e.stateNode).__reactInternalMemoizedUnmaskedChildContext = l),
        (e.__reactInternalMemoizedMaskedChildContext = a)),
      t
    );
  }
  function si(e, t, n, r) {
    (e = t.state),
      'function' == typeof t.componentWillReceiveProps &&
        t.componentWillReceiveProps(n, r),
      'function' == typeof t.UNSAFE_componentWillReceiveProps &&
        t.UNSAFE_componentWillReceiveProps(n, r),
      t.state !== e && ai.enqueueReplaceState(t, t.state, null);
  }
  function ui(e, t, n, r) {
    var l = e.stateNode;
    (l.props = n), (l.state = e.memoizedState), (l.refs = {}), Ba(e);
    var a = t.contextType;
    'object' == typeof a && null !== a
      ? (l.context = Pa(a))
      : ((a = Il(t) ? Pl : Tl.current), (l.context = Nl(e, a))),
      (l.state = e.memoizedState),
      'function' == typeof (a = t.getDerivedStateFromProps) &&
        (li(e, t, a, n), (l.state = e.memoizedState)),
      'function' == typeof t.getDerivedStateFromProps ||
        'function' == typeof l.getSnapshotBeforeUpdate ||
        ('function' != typeof l.UNSAFE_componentWillMount &&
          'function' != typeof l.componentWillMount) ||
        ((t = l.state),
        'function' == typeof l.componentWillMount && l.componentWillMount(),
        'function' == typeof l.UNSAFE_componentWillMount &&
          l.UNSAFE_componentWillMount(),
        t !== l.state && ai.enqueueReplaceState(l, l.state, null),
        Ua(e, n, l, r),
        (l.state = e.memoizedState)),
      'function' == typeof l.componentDidMount && (e.flags |= 4194308);
  }
  function ci(e, t) {
    try {
      var n = '',
        r = t;
      do {
        (n += A(r)), (r = r.return);
      } while (r);
      var l = n;
    } catch (e) {
      l = '\nError generating stack: ' + e.message + '\n' + e.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function di(e, t, n) {
    return {
      value: e,
      source: null,
      stack: null != n ? n : null,
      digest: null != t ? t : null,
    };
  }
  function fi(e, t) {
    try {
      console.error(t.value);
    } catch (e) {
      setTimeout(function () {
        throw e;
      });
    }
  }
  var pi = 'function' == typeof WeakMap ? WeakMap : Map;
  function hi(e, t, n) {
    ((n = Va(-1, n)).tag = 3), (n.payload = { element: null });
    var r = t.value;
    return (
      (n.callback = function () {
        qs || ((qs = !0), (Ws = r)), fi(0, t);
      }),
      n
    );
  }
  function mi(e, t, n) {
    (n = Va(-1, n)).tag = 3;
    var r = e.type.getDerivedStateFromError;
    if ('function' == typeof r) {
      var l = t.value;
      (n.payload = function () {
        return r(l);
      }),
        (n.callback = function () {
          fi(0, t);
        });
    }
    var a = e.stateNode;
    return (
      null !== a &&
        'function' == typeof a.componentDidCatch &&
        (n.callback = function () {
          fi(0, t),
            'function' != typeof r &&
              (null === Qs ? (Qs = new Set([this])) : Qs.add(this));
          var e = t.stack;
          this.componentDidCatch(t.value, {
            componentStack: null !== e ? e : '',
          });
        }),
      n
    );
  }
  function gi(e, t, n) {
    var r = e.pingCache;
    if (null === r) {
      r = e.pingCache = new pi();
      var l = new Set();
      r.set(t, l);
    } else void 0 === (l = r.get(t)) && ((l = new Set()), r.set(t, l));
    l.has(n) || (l.add(n), (e = Lu.bind(null, e, t, n)), t.then(e, e));
  }
  function vi(e) {
    do {
      var t;
      if (
        ((t = 13 === e.tag) &&
          (t = null === (t = e.memoizedState) || null !== t.dehydrated),
        t)
      )
        return e;
      e = e.return;
    } while (null !== e);
    return null;
  }
  function yi(e, t, n, r, l) {
    return 1 & e.mode
      ? ((e.flags |= 65536), (e.lanes = l), e)
      : (e === t
          ? (e.flags |= 65536)
          : ((e.flags |= 128),
            (n.flags |= 131072),
            (n.flags &= -52805),
            1 === n.tag &&
              (null === n.alternate
                ? (n.tag = 17)
                : (((t = Va(-1, 1)).tag = 2), Fa(n, t, 1))),
            (n.lanes |= 1)),
        e);
  }
  var bi = v.ReactCurrentOwner,
    wi = !1;
  function ki(e, t, n, r) {
    t.child = null === e ? Ca(t, null, n, r) : ka(t, e.child, n, r);
  }
  function Ci(e, t, n, r, l) {
    n = n.render;
    var a = t.ref;
    return (
      _a(t, l),
      (r = vo(e, t, n, r, a, l)),
      (n = yo()),
      null === e || wi
        ? (aa && n && ta(t), (t.flags |= 1), ki(e, t, r, l), t.child)
        : ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~l),
          qi(e, t, l))
    );
  }
  function Ei(e, t, n, r, l) {
    if (null === e) {
      var a = n.type;
      return 'function' != typeof a ||
        Iu(a) ||
        void 0 !== a.defaultProps ||
        null !== n.compare ||
        void 0 !== n.defaultProps
        ? (((e = Hu(n.type, null, r, t, t.mode, l)).ref = t.ref),
          (e.return = t),
          (t.child = e))
        : ((t.tag = 15), (t.type = a), xi(e, t, a, r, l));
    }
    if (((a = e.child), 0 === (e.lanes & l))) {
      var o = a.memoizedProps;
      if ((n = null !== (n = n.compare) ? n : ur)(o, r) && e.ref === t.ref)
        return qi(e, t, l);
    }
    return (
      (t.flags |= 1),
      ((e = Ru(a, r)).ref = t.ref),
      (e.return = t),
      (t.child = e)
    );
  }
  function xi(e, t, n, r, l) {
    if (null !== e) {
      var a = e.memoizedProps;
      if (ur(a, r) && e.ref === t.ref) {
        if (((wi = !1), (t.pendingProps = r = a), 0 === (e.lanes & l)))
          return (t.lanes = e.lanes), qi(e, t, l);
        131072 & e.flags && (wi = !0);
      }
    }
    return Mi(e, t, n, r, l);
  }
  function Si(e, t, n) {
    var r = t.pendingProps,
      l = r.children,
      a = null !== e ? e.memoizedState : null;
    if ('hidden' === r.mode)
      if (1 & t.mode) {
        if (!(1073741824 & n))
          return (
            (e = null !== a ? a.baseLanes | n : n),
            (t.lanes = t.childLanes = 1073741824),
            (t.memoizedState = {
              baseLanes: e,
              cachePool: null,
              transitions: null,
            }),
            (t.updateQueue = null),
            Ml(Rs, Is),
            (Is |= e),
            null
          );
        (t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          (r = null !== a ? a.baseLanes : n),
          Ml(Rs, Is),
          (Is |= r);
      } else
        (t.memoizedState = {
          baseLanes: 0,
          cachePool: null,
          transitions: null,
        }),
          Ml(Rs, Is),
          (Is |= n);
    else
      null !== a ? ((r = a.baseLanes | n), (t.memoizedState = null)) : (r = n),
        Ml(Rs, Is),
        (Is |= r);
    return ki(e, t, l, n), t.child;
  }
  function Li(e, t) {
    var n = t.ref;
    ((null === e && null !== n) || (null !== e && e.ref !== n)) &&
      ((t.flags |= 512), (t.flags |= 2097152));
  }
  function Mi(e, t, n, r, l) {
    var a = Il(n) ? Pl : Tl.current;
    return (
      (a = Nl(t, a)),
      _a(t, l),
      (n = vo(e, t, n, r, a, l)),
      (r = yo()),
      null === e || wi
        ? (aa && r && ta(t), (t.flags |= 1), ki(e, t, n, l), t.child)
        : ((t.updateQueue = e.updateQueue),
          (t.flags &= -2053),
          (e.lanes &= ~l),
          qi(e, t, l))
    );
  }
  function zi(e, t, n, r, l) {
    if (Il(n)) {
      var a = !0;
      Bl(t);
    } else a = !1;
    if ((_a(t, l), null === t.stateNode))
      ji(e, t), ii(t, n, r), ui(t, n, r, l), (r = !0);
    else if (null === e) {
      var o = t.stateNode,
        i = t.memoizedProps;
      o.props = i;
      var s = o.context,
        u = n.contextType;
      'object' == typeof u && null !== u
        ? (u = Pa(u))
        : (u = Nl(t, (u = Il(n) ? Pl : Tl.current)));
      var c = n.getDerivedStateFromProps,
        d =
          'function' == typeof c ||
          'function' == typeof o.getSnapshotBeforeUpdate;
      d ||
        ('function' != typeof o.UNSAFE_componentWillReceiveProps &&
          'function' != typeof o.componentWillReceiveProps) ||
        ((i !== r || s !== u) && si(t, o, r, u)),
        (Da = !1);
      var f = t.memoizedState;
      (o.state = f),
        Ua(t, r, o, l),
        (s = t.memoizedState),
        i !== r || f !== s || _l.current || Da
          ? ('function' == typeof c && (li(t, n, c, r), (s = t.memoizedState)),
            (i = Da || oi(t, n, i, r, f, s, u))
              ? (d ||
                  ('function' != typeof o.UNSAFE_componentWillMount &&
                    'function' != typeof o.componentWillMount) ||
                  ('function' == typeof o.componentWillMount &&
                    o.componentWillMount(),
                  'function' == typeof o.UNSAFE_componentWillMount &&
                    o.UNSAFE_componentWillMount()),
                'function' == typeof o.componentDidMount &&
                  (t.flags |= 4194308))
              : ('function' == typeof o.componentDidMount &&
                  (t.flags |= 4194308),
                (t.memoizedProps = r),
                (t.memoizedState = s)),
            (o.props = r),
            (o.state = s),
            (o.context = u),
            (r = i))
          : ('function' == typeof o.componentDidMount && (t.flags |= 4194308),
            (r = !1));
    } else {
      (o = t.stateNode),
        $a(e, t),
        (i = t.memoizedProps),
        (u = t.type === t.elementType ? i : ri(t.type, i)),
        (o.props = u),
        (d = t.pendingProps),
        (f = o.context),
        'object' == typeof (s = n.contextType) && null !== s
          ? (s = Pa(s))
          : (s = Nl(t, (s = Il(n) ? Pl : Tl.current)));
      var p = n.getDerivedStateFromProps;
      (c =
        'function' == typeof p ||
        'function' == typeof o.getSnapshotBeforeUpdate) ||
        ('function' != typeof o.UNSAFE_componentWillReceiveProps &&
          'function' != typeof o.componentWillReceiveProps) ||
        ((i !== d || f !== s) && si(t, o, r, s)),
        (Da = !1),
        (f = t.memoizedState),
        (o.state = f),
        Ua(t, r, o, l);
      var h = t.memoizedState;
      i !== d || f !== h || _l.current || Da
        ? ('function' == typeof p && (li(t, n, p, r), (h = t.memoizedState)),
          (u = Da || oi(t, n, u, r, f, h, s) || !1)
            ? (c ||
                ('function' != typeof o.UNSAFE_componentWillUpdate &&
                  'function' != typeof o.componentWillUpdate) ||
                ('function' == typeof o.componentWillUpdate &&
                  o.componentWillUpdate(r, h, s),
                'function' == typeof o.UNSAFE_componentWillUpdate &&
                  o.UNSAFE_componentWillUpdate(r, h, s)),
              'function' == typeof o.componentDidUpdate && (t.flags |= 4),
              'function' == typeof o.getSnapshotBeforeUpdate &&
                (t.flags |= 1024))
            : ('function' != typeof o.componentDidUpdate ||
                (i === e.memoizedProps && f === e.memoizedState) ||
                (t.flags |= 4),
              'function' != typeof o.getSnapshotBeforeUpdate ||
                (i === e.memoizedProps && f === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = r),
              (t.memoizedState = h)),
          (o.props = r),
          (o.state = h),
          (o.context = s),
          (r = u))
        : ('function' != typeof o.componentDidUpdate ||
            (i === e.memoizedProps && f === e.memoizedState) ||
            (t.flags |= 4),
          'function' != typeof o.getSnapshotBeforeUpdate ||
            (i === e.memoizedProps && f === e.memoizedState) ||
            (t.flags |= 1024),
          (r = !1));
    }
    return Ti(e, t, n, r, a, l);
  }
  function Ti(e, t, n, r, l, a) {
    Li(e, t);
    var o = !!(128 & t.flags);
    if (!r && !o) return l && $l(t, n, !1), qi(e, t, a);
    (r = t.stateNode), (bi.current = t);
    var i =
      o && 'function' != typeof n.getDerivedStateFromError ? null : r.render();
    return (
      (t.flags |= 1),
      null !== e && o
        ? ((t.child = ka(t, e.child, null, a)), (t.child = ka(t, null, i, a)))
        : ki(e, t, i, a),
      (t.memoizedState = r.state),
      l && $l(t, n, !0),
      t.child
    );
  }
  function _i(e) {
    var t = e.stateNode;
    t.pendingContext
      ? Hl(0, t.pendingContext, t.pendingContext !== t.context)
      : t.context && Hl(0, t.context, !1),
      Za(e, t.containerInfo);
  }
  function Pi(e, t, n, r, l) {
    return ha(), ma(l), (t.flags |= 256), ki(e, t, n, r), t.child;
  }
  var Ni,
    Ii,
    Ri,
    Hi,
    Di = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Bi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function $i(e, t, r) {
    var l,
      a = t.pendingProps,
      o = eo.current,
      i = !1,
      s = !!(128 & t.flags);
    if (
      ((l = s) || (l = (null === e || null !== e.memoizedState) && !!(2 & o)),
      l
        ? ((i = !0), (t.flags &= -129))
        : (null !== e && null === e.memoizedState) || (o |= 1),
      Ml(eo, 1 & o),
      null === e)
    )
      return (
        ca(t),
        null !== (e = t.memoizedState) && null !== (e = e.dehydrated)
          ? (1 & t.mode
              ? '$!' === e.data
                ? (t.lanes = 8)
                : (t.lanes = 1073741824)
              : (t.lanes = 1),
            null)
          : ((s = a.children),
            (e = a.fallback),
            i
              ? ((a = t.mode),
                (i = t.child),
                (s = { mode: 'hidden', children: s }),
                1 & a || null === i
                  ? (i = Bu(s, a, 0, null))
                  : ((i.childLanes = 0), (i.pendingProps = s)),
                (e = Du(e, a, r, null)),
                (i.return = t),
                (e.return = t),
                (i.sibling = e),
                (t.child = i),
                (t.child.memoizedState = Bi(r)),
                (t.memoizedState = Di),
                e)
              : Vi(t, s))
      );
    if (null !== (o = e.memoizedState) && null !== (l = o.dehydrated))
      return (function (e, t, r, l, a, o, i) {
        if (r)
          return 256 & t.flags
            ? ((t.flags &= -257), Fi(e, t, i, (l = di(Error(n(422))))))
            : null !== t.memoizedState
              ? ((t.child = e.child), (t.flags |= 128), null)
              : ((o = l.fallback),
                (a = t.mode),
                (l = Bu({ mode: 'visible', children: l.children }, a, 0, null)),
                ((o = Du(o, a, i, null)).flags |= 2),
                (l.return = t),
                (o.return = t),
                (l.sibling = o),
                (t.child = l),
                1 & t.mode && ka(t, e.child, null, i),
                (t.child.memoizedState = Bi(i)),
                (t.memoizedState = Di),
                o);
        if (!(1 & t.mode)) return Fi(e, t, i, null);
        if ('$!' === a.data) {
          if ((l = a.nextSibling && a.nextSibling.dataset)) var s = l.dgst;
          return (l = s), Fi(e, t, i, (l = di((o = Error(n(419))), l, void 0)));
        }
        if (((s = 0 !== (i & e.childLanes)), wi || s)) {
          if (null !== (l = _s)) {
            switch (i & -i) {
              case 4:
                a = 2;
                break;
              case 16:
                a = 8;
                break;
              case 64:
              case 128:
              case 256:
              case 512:
              case 1024:
              case 2048:
              case 4096:
              case 8192:
              case 16384:
              case 32768:
              case 65536:
              case 131072:
              case 262144:
              case 524288:
              case 1048576:
              case 2097152:
              case 4194304:
              case 8388608:
              case 16777216:
              case 33554432:
              case 67108864:
                a = 32;
                break;
              case 536870912:
                a = 268435456;
                break;
              default:
                a = 0;
            }
            0 !== (a = 0 !== (a & (l.suspendedLanes | i)) ? 0 : a) &&
              a !== o.retryLane &&
              ((o.retryLane = a), Ha(e, a), ru(l, e, a, -1));
          }
          return gu(), Fi(e, t, i, (l = di(Error(n(421)))));
        }
        return '$?' === a.data
          ? ((t.flags |= 128),
            (t.child = e.child),
            (t = zu.bind(null, e)),
            (a._reactRetry = t),
            null)
          : ((e = o.treeContext),
            (la = cl(a.nextSibling)),
            (ra = t),
            (aa = !0),
            (oa = null),
            null !== e &&
              ((Yl[Xl++] = Kl),
              (Yl[Xl++] = Gl),
              (Yl[Xl++] = Zl),
              (Kl = e.id),
              (Gl = e.overflow),
              (Zl = t)),
            (t = Vi(t, l.children)),
            (t.flags |= 4096),
            t);
      })(e, t, s, a, l, o, r);
    if (i) {
      (i = a.fallback), (s = t.mode), (l = (o = e.child).sibling);
      var u = { mode: 'hidden', children: a.children };
      return (
        1 & s || t.child === o
          ? ((a = Ru(o, u)).subtreeFlags = 14680064 & o.subtreeFlags)
          : (((a = t.child).childLanes = 0),
            (a.pendingProps = u),
            (t.deletions = null)),
        null !== l ? (i = Ru(l, i)) : ((i = Du(i, s, r, null)).flags |= 2),
        (i.return = t),
        (a.return = t),
        (a.sibling = i),
        (t.child = a),
        (a = i),
        (i = t.child),
        (s =
          null === (s = e.child.memoizedState)
            ? Bi(r)
            : {
                baseLanes: s.baseLanes | r,
                cachePool: null,
                transitions: s.transitions,
              }),
        (i.memoizedState = s),
        (i.childLanes = e.childLanes & ~r),
        (t.memoizedState = Di),
        a
      );
    }
    return (
      (e = (i = e.child).sibling),
      (a = Ru(i, { mode: 'visible', children: a.children })),
      !(1 & t.mode) && (a.lanes = r),
      (a.return = t),
      (a.sibling = null),
      null !== e &&
        (null === (r = t.deletions)
          ? ((t.deletions = [e]), (t.flags |= 16))
          : r.push(e)),
      (t.child = a),
      (t.memoizedState = null),
      a
    );
  }
  function Vi(e, t) {
    return (
      ((t = Bu({ mode: 'visible', children: t }, e.mode, 0, null)).return = e),
      (e.child = t)
    );
  }
  function Fi(e, t, n, r) {
    return (
      null !== r && ma(r),
      ka(t, e.child, null, n),
      ((e = Vi(t, t.pendingProps.children)).flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function Oi(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    null !== r && (r.lanes |= t), Ta(e.return, t, n);
  }
  function Ai(e, t, n, r, l) {
    var a = e.memoizedState;
    null === a
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: r,
          tail: n,
          tailMode: l,
        })
      : ((a.isBackwards = t),
        (a.rendering = null),
        (a.renderingStartTime = 0),
        (a.last = r),
        (a.tail = n),
        (a.tailMode = l));
  }
  function Ui(e, t, n) {
    var r = t.pendingProps,
      l = r.revealOrder,
      a = r.tail;
    if ((ki(e, t, r.children, n), 2 & (r = eo.current)))
      (r = (1 & r) | 2), (t.flags |= 128);
    else {
      if (null !== e && 128 & e.flags)
        e: for (e = t.child; null !== e; ) {
          if (13 === e.tag) null !== e.memoizedState && Oi(e, n, t);
          else if (19 === e.tag) Oi(e, n, t);
          else if (null !== e.child) {
            (e.child.return = e), (e = e.child);
            continue;
          }
          if (e === t) break e;
          for (; null === e.sibling; ) {
            if (null === e.return || e.return === t) break e;
            e = e.return;
          }
          (e.sibling.return = e.return), (e = e.sibling);
        }
      r &= 1;
    }
    if ((Ml(eo, r), 1 & t.mode))
      switch (l) {
        case 'forwards':
          for (n = t.child, l = null; null !== n; )
            null !== (e = n.alternate) && null === to(e) && (l = n),
              (n = n.sibling);
          null === (n = l)
            ? ((l = t.child), (t.child = null))
            : ((l = n.sibling), (n.sibling = null)),
            Ai(t, !1, l, n, a);
          break;
        case 'backwards':
          for (n = null, l = t.child, t.child = null; null !== l; ) {
            if (null !== (e = l.alternate) && null === to(e)) {
              t.child = l;
              break;
            }
            (e = l.sibling), (l.sibling = n), (n = l), (l = e);
          }
          Ai(t, !0, n, null, a);
          break;
        case 'together':
          Ai(t, !1, null, null, void 0);
          break;
        default:
          t.memoizedState = null;
      }
    else t.memoizedState = null;
    return t.child;
  }
  function ji(e, t) {
    !(1 & t.mode) &&
      null !== e &&
      ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
  }
  function qi(e, t, r) {
    if (
      (null !== e && (t.dependencies = e.dependencies),
      (Bs |= t.lanes),
      0 === (r & t.childLanes))
    )
      return null;
    if (null !== e && t.child !== e.child) throw Error(n(153));
    if (null !== t.child) {
      for (
        r = Ru((e = t.child), e.pendingProps), t.child = r, r.return = t;
        null !== e.sibling;

      )
        (e = e.sibling), ((r = r.sibling = Ru(e, e.pendingProps)).return = t);
      r.sibling = null;
    }
    return t.child;
  }
  function Wi(e, t) {
    if (!aa)
      switch (e.tailMode) {
        case 'hidden':
          t = e.tail;
          for (var n = null; null !== t; )
            null !== t.alternate && (n = t), (t = t.sibling);
          null === n ? (e.tail = null) : (n.sibling = null);
          break;
        case 'collapsed':
          n = e.tail;
          for (var r = null; null !== n; )
            null !== n.alternate && (r = n), (n = n.sibling);
          null === r
            ? t || null === e.tail
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (r.sibling = null);
      }
  }
  function Qi(e) {
    var t = null !== e.alternate && e.alternate.child === e.child,
      n = 0,
      r = 0;
    if (t)
      for (var l = e.child; null !== l; )
        (n |= l.lanes | l.childLanes),
          (r |= 14680064 & l.subtreeFlags),
          (r |= 14680064 & l.flags),
          (l.return = e),
          (l = l.sibling);
    else
      for (l = e.child; null !== l; )
        (n |= l.lanes | l.childLanes),
          (r |= l.subtreeFlags),
          (r |= l.flags),
          (l.return = e),
          (l = l.sibling);
    return (e.subtreeFlags |= r), (e.childLanes = n), t;
  }
  function Yi(e, t, r) {
    var a = t.pendingProps;
    switch ((na(t), t.tag)) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Qi(t), null;
      case 1:
      case 17:
        return Il(t.type) && Rl(), Qi(t), null;
      case 3:
        return (
          (a = t.stateNode),
          Ka(),
          Ll(_l),
          Ll(Tl),
          ro(),
          a.pendingContext &&
            ((a.context = a.pendingContext), (a.pendingContext = null)),
          (null !== e && null !== e.child) ||
            (fa(t)
              ? (t.flags |= 4)
              : null === e ||
                (e.memoizedState.isDehydrated && !(256 & t.flags)) ||
                ((t.flags |= 1024), null !== oa && (iu(oa), (oa = null)))),
          Ii(e, t),
          Qi(t),
          null
        );
      case 5:
        Ja(t);
        var o = Xa(Ya.current);
        if (((r = t.type), null !== e && null != t.stateNode))
          Ri(e, t, r, a, o),
            e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
        else {
          if (!a) {
            if (null === t.stateNode) throw Error(n(166));
            return Qi(t), null;
          }
          if (((e = Xa(Wa.current)), fa(t))) {
            (a = t.stateNode), (r = t.type);
            var i = t.memoizedProps;
            switch (((a[pl] = t), (a[hl] = i), (e = !!(1 & t.mode)), r)) {
              case 'dialog':
                Fr('cancel', a), Fr('close', a);
                break;
              case 'iframe':
              case 'object':
              case 'embed':
                Fr('load', a);
                break;
              case 'video':
              case 'audio':
                for (o = 0; o < Dr.length; o++) Fr(Dr[o], a);
                break;
              case 'source':
                Fr('error', a);
                break;
              case 'img':
              case 'image':
              case 'link':
                Fr('error', a), Fr('load', a);
                break;
              case 'details':
                Fr('toggle', a);
                break;
              case 'input':
                K(a, i), Fr('invalid', a);
                break;
              case 'select':
                (a._wrapperState = { wasMultiple: !!i.multiple }),
                  Fr('invalid', a);
                break;
              case 'textarea':
                ae(a, i), Fr('invalid', a);
            }
            for (var s in (be(r, i), (o = null), i))
              if (i.hasOwnProperty(s)) {
                var u = i[s];
                'children' === s
                  ? 'string' == typeof u
                    ? a.textContent !== u &&
                      (!0 !== i.suppressHydrationWarning &&
                        Jr(a.textContent, u, e),
                      (o = ['children', u]))
                    : 'number' == typeof u &&
                      a.textContent !== '' + u &&
                      (!0 !== i.suppressHydrationWarning &&
                        Jr(a.textContent, u, e),
                      (o = ['children', '' + u]))
                  : l.hasOwnProperty(s) &&
                    null != u &&
                    'onScroll' === s &&
                    Fr('scroll', a);
              }
            switch (r) {
              case 'input':
                Q(a), ee(a, i, !0);
                break;
              case 'textarea':
                Q(a), ie(a);
                break;
              case 'select':
              case 'option':
                break;
              default:
                'function' == typeof i.onClick && (a.onclick = el);
            }
            (a = o), (t.updateQueue = a), null !== a && (t.flags |= 4);
          } else {
            (s = 9 === o.nodeType ? o : o.ownerDocument),
              'http://www.w3.org/1999/xhtml' === e && (e = se(r)),
              'http://www.w3.org/1999/xhtml' === e
                ? 'script' === r
                  ? (((e = s.createElement('div')).innerHTML =
                      '<script></script>'),
                    (e = e.removeChild(e.firstChild)))
                  : 'string' == typeof a.is
                    ? (e = s.createElement(r, { is: a.is }))
                    : ((e = s.createElement(r)),
                      'select' === r &&
                        ((s = e),
                        a.multiple
                          ? (s.multiple = !0)
                          : a.size && (s.size = a.size)))
                : (e = s.createElementNS(e, r)),
              (e[pl] = t),
              (e[hl] = a),
              Ni(e, t, !1, !1),
              (t.stateNode = e);
            e: {
              switch (((s = we(r, a)), r)) {
                case 'dialog':
                  Fr('cancel', e), Fr('close', e), (o = a);
                  break;
                case 'iframe':
                case 'object':
                case 'embed':
                  Fr('load', e), (o = a);
                  break;
                case 'video':
                case 'audio':
                  for (o = 0; o < Dr.length; o++) Fr(Dr[o], e);
                  o = a;
                  break;
                case 'source':
                  Fr('error', e), (o = a);
                  break;
                case 'img':
                case 'image':
                case 'link':
                  Fr('error', e), Fr('load', e), (o = a);
                  break;
                case 'details':
                  Fr('toggle', e), (o = a);
                  break;
                case 'input':
                  K(e, a), (o = Z(e, a)), Fr('invalid', e);
                  break;
                case 'option':
                default:
                  o = a;
                  break;
                case 'select':
                  (e._wrapperState = { wasMultiple: !!a.multiple }),
                    (o = $({}, a, { value: void 0 })),
                    Fr('invalid', e);
                  break;
                case 'textarea':
                  ae(e, a), (o = le(e, a)), Fr('invalid', e);
              }
              for (i in (be(r, o), (u = o)))
                if (u.hasOwnProperty(i)) {
                  var c = u[i];
                  'style' === i
                    ? ve(e, c)
                    : 'dangerouslySetInnerHTML' === i
                      ? null != (c = c ? c.__html : void 0) && fe(e, c)
                      : 'children' === i
                        ? 'string' == typeof c
                          ? ('textarea' !== r || '' !== c) && pe(e, c)
                          : 'number' == typeof c && pe(e, '' + c)
                        : 'suppressContentEditableWarning' !== i &&
                          'suppressHydrationWarning' !== i &&
                          'autoFocus' !== i &&
                          (l.hasOwnProperty(i)
                            ? null != c && 'onScroll' === i && Fr('scroll', e)
                            : null != c && g(e, i, c, s));
                }
              switch (r) {
                case 'input':
                  Q(e), ee(e, a, !1);
                  break;
                case 'textarea':
                  Q(e), ie(e);
                  break;
                case 'option':
                  null != a.value && e.setAttribute('value', '' + q(a.value));
                  break;
                case 'select':
                  (e.multiple = !!a.multiple),
                    null != (i = a.value)
                      ? re(e, !!a.multiple, i, !1)
                      : null != a.defaultValue &&
                        re(e, !!a.multiple, a.defaultValue, !0);
                  break;
                default:
                  'function' == typeof o.onClick && (e.onclick = el);
              }
              switch (r) {
                case 'button':
                case 'input':
                case 'select':
                case 'textarea':
                  a = !!a.autoFocus;
                  break e;
                case 'img':
                  a = !0;
                  break e;
                default:
                  a = !1;
              }
            }
            a && (t.flags |= 4);
          }
          null !== t.ref && ((t.flags |= 512), (t.flags |= 2097152));
        }
        return Qi(t), null;
      case 6:
        if (e && null != t.stateNode) Hi(e, t, e.memoizedProps, a);
        else {
          if ('string' != typeof a && null === t.stateNode) throw Error(n(166));
          if (((r = Xa(Ya.current)), Xa(Wa.current), fa(t))) {
            if (
              ((a = t.stateNode),
              (r = t.memoizedProps),
              (a[pl] = t),
              (i = a.nodeValue !== r) && null !== (e = ra))
            )
              switch (e.tag) {
                case 3:
                  Jr(a.nodeValue, r, !!(1 & e.mode));
                  break;
                case 5:
                  !0 !== e.memoizedProps.suppressHydrationWarning &&
                    Jr(a.nodeValue, r, !!(1 & e.mode));
              }
            i && (t.flags |= 4);
          } else
            ((a = (9 === r.nodeType ? r : r.ownerDocument).createTextNode(a))[
              pl
            ] = t),
              (t.stateNode = a);
        }
        return Qi(t), null;
      case 13:
        if (
          (Ll(eo),
          (a = t.memoizedState),
          null === e ||
            (null !== e.memoizedState && null !== e.memoizedState.dehydrated))
        ) {
          if (aa && null !== la && 1 & t.mode && !(128 & t.flags))
            pa(), ha(), (t.flags |= 98560), (i = !1);
          else if (((i = fa(t)), null !== a && null !== a.dehydrated)) {
            if (null === e) {
              if (!i) throw Error(n(318));
              if (!(i = null !== (i = t.memoizedState) ? i.dehydrated : null))
                throw Error(n(317));
              i[pl] = t;
            } else
              ha(),
                !(128 & t.flags) && (t.memoizedState = null),
                (t.flags |= 4);
            Qi(t), (i = !1);
          } else null !== oa && (iu(oa), (oa = null)), (i = !0);
          if (!i) return 65536 & t.flags ? t : null;
        }
        return 128 & t.flags
          ? ((t.lanes = r), t)
          : ((a = null !== a) !== (null !== e && null !== e.memoizedState) &&
              a &&
              ((t.child.flags |= 8192),
              1 & t.mode &&
                (null === e || 1 & eo.current ? 0 === Hs && (Hs = 3) : gu())),
            null !== t.updateQueue && (t.flags |= 4),
            Qi(t),
            null);
      case 4:
        return (
          Ka(),
          Ii(e, t),
          null === e && Ur(t.stateNode.containerInfo),
          Qi(t),
          null
        );
      case 10:
        return za(t.type._context), Qi(t), null;
      case 19:
        if ((Ll(eo), null === (i = t.memoizedState))) return Qi(t), null;
        if (((a = !!(128 & t.flags)), null === (s = i.rendering)))
          if (a) Wi(i, !1);
          else {
            if (0 !== Hs || (null !== e && 128 & e.flags))
              for (e = t.child; null !== e; ) {
                if (null !== (s = to(e))) {
                  for (
                    t.flags |= 128,
                      Wi(i, !1),
                      null !== (a = s.updateQueue) &&
                        ((t.updateQueue = a), (t.flags |= 4)),
                      t.subtreeFlags = 0,
                      a = r,
                      r = t.child;
                    null !== r;

                  )
                    (e = a),
                      ((i = r).flags &= 14680066),
                      null === (s = i.alternate)
                        ? ((i.childLanes = 0),
                          (i.lanes = e),
                          (i.child = null),
                          (i.subtreeFlags = 0),
                          (i.memoizedProps = null),
                          (i.memoizedState = null),
                          (i.updateQueue = null),
                          (i.dependencies = null),
                          (i.stateNode = null))
                        : ((i.childLanes = s.childLanes),
                          (i.lanes = s.lanes),
                          (i.child = s.child),
                          (i.subtreeFlags = 0),
                          (i.deletions = null),
                          (i.memoizedProps = s.memoizedProps),
                          (i.memoizedState = s.memoizedState),
                          (i.updateQueue = s.updateQueue),
                          (i.type = s.type),
                          (e = s.dependencies),
                          (i.dependencies =
                            null === e
                              ? null
                              : {
                                  lanes: e.lanes,
                                  firstContext: e.firstContext,
                                })),
                      (r = r.sibling);
                  return Ml(eo, (1 & eo.current) | 2), t.child;
                }
                e = e.sibling;
              }
            null !== i.tail &&
              Ge() > Us &&
              ((t.flags |= 128), (a = !0), Wi(i, !1), (t.lanes = 4194304));
          }
        else {
          if (!a)
            if (null !== (e = to(s))) {
              if (
                ((t.flags |= 128),
                (a = !0),
                null !== (r = e.updateQueue) &&
                  ((t.updateQueue = r), (t.flags |= 4)),
                Wi(i, !0),
                null === i.tail &&
                  'hidden' === i.tailMode &&
                  !s.alternate &&
                  !aa)
              )
                return Qi(t), null;
            } else
              2 * Ge() - i.renderingStartTime > Us &&
                1073741824 !== r &&
                ((t.flags |= 128), (a = !0), Wi(i, !1), (t.lanes = 4194304));
          i.isBackwards
            ? ((s.sibling = t.child), (t.child = s))
            : (null !== (r = i.last) ? (r.sibling = s) : (t.child = s),
              (i.last = s));
        }
        return null !== i.tail
          ? ((t = i.tail),
            (i.rendering = t),
            (i.tail = t.sibling),
            (i.renderingStartTime = Ge()),
            (t.sibling = null),
            (r = eo.current),
            Ml(eo, a ? (1 & r) | 2 : 1 & r),
            t)
          : (Qi(t), null);
      case 22:
      case 23:
        return (
          fu(),
          (a = null !== t.memoizedState),
          null !== e && (null !== e.memoizedState) !== a && (t.flags |= 8192),
          a && 1 & t.mode
            ? !!(1073741824 & Is) &&
              (Qi(t), 6 & t.subtreeFlags && (t.flags |= 8192))
            : Qi(t),
          null
        );
      case 24:
      case 25:
        return null;
    }
    throw Error(n(156, t.tag));
  }
  function Xi(e, t) {
    switch ((na(t), t.tag)) {
      case 1:
        return (
          Il(t.type) && Rl(),
          65536 & (e = t.flags) ? ((t.flags = (-65537 & e) | 128), t) : null
        );
      case 3:
        return (
          Ka(),
          Ll(_l),
          Ll(Tl),
          ro(),
          65536 & (e = t.flags) && !(128 & e)
            ? ((t.flags = (-65537 & e) | 128), t)
            : null
        );
      case 5:
        return Ja(t), null;
      case 13:
        if ((Ll(eo), null !== (e = t.memoizedState) && null !== e.dehydrated)) {
          if (null === t.alternate) throw Error(n(340));
          ha();
        }
        return 65536 & (e = t.flags)
          ? ((t.flags = (-65537 & e) | 128), t)
          : null;
      case 19:
        return Ll(eo), null;
      case 4:
        return Ka(), null;
      case 10:
        return za(t.type._context), null;
      case 22:
      case 23:
        return fu(), null;
      default:
        return null;
    }
  }
  (Ni = function (e, t) {
    for (var n = t.child; null !== n; ) {
      if (5 === n.tag || 6 === n.tag) e.appendChild(n.stateNode);
      else if (4 !== n.tag && null !== n.child) {
        (n.child.return = n), (n = n.child);
        continue;
      }
      if (n === t) break;
      for (; null === n.sibling; ) {
        if (null === n.return || n.return === t) return;
        n = n.return;
      }
      (n.sibling.return = n.return), (n = n.sibling);
    }
  }),
    (Ii = function () {}),
    (Ri = function (e, t, n, r) {
      var a = e.memoizedProps;
      if (a !== r) {
        (e = t.stateNode), Xa(Wa.current);
        var o,
          i = null;
        switch (n) {
          case 'input':
            (a = Z(e, a)), (r = Z(e, r)), (i = []);
            break;
          case 'select':
            (a = $({}, a, { value: void 0 })),
              (r = $({}, r, { value: void 0 })),
              (i = []);
            break;
          case 'textarea':
            (a = le(e, a)), (r = le(e, r)), (i = []);
            break;
          default:
            'function' != typeof a.onClick &&
              'function' == typeof r.onClick &&
              (e.onclick = el);
        }
        for (c in (be(n, r), (n = null), a))
          if (!r.hasOwnProperty(c) && a.hasOwnProperty(c) && null != a[c])
            if ('style' === c) {
              var s = a[c];
              for (o in s) s.hasOwnProperty(o) && (n || (n = {}), (n[o] = ''));
            } else
              'dangerouslySetInnerHTML' !== c &&
                'children' !== c &&
                'suppressContentEditableWarning' !== c &&
                'suppressHydrationWarning' !== c &&
                'autoFocus' !== c &&
                (l.hasOwnProperty(c)
                  ? i || (i = [])
                  : (i = i || []).push(c, null));
        for (c in r) {
          var u = r[c];
          if (
            ((s = null != a ? a[c] : void 0),
            r.hasOwnProperty(c) && u !== s && (null != u || null != s))
          )
            if ('style' === c)
              if (s) {
                for (o in s)
                  !s.hasOwnProperty(o) ||
                    (u && u.hasOwnProperty(o)) ||
                    (n || (n = {}), (n[o] = ''));
                for (o in u)
                  u.hasOwnProperty(o) &&
                    s[o] !== u[o] &&
                    (n || (n = {}), (n[o] = u[o]));
              } else n || (i || (i = []), i.push(c, n)), (n = u);
            else
              'dangerouslySetInnerHTML' === c
                ? ((u = u ? u.__html : void 0),
                  (s = s ? s.__html : void 0),
                  null != u && s !== u && (i = i || []).push(c, u))
                : 'children' === c
                  ? ('string' != typeof u && 'number' != typeof u) ||
                    (i = i || []).push(c, '' + u)
                  : 'suppressContentEditableWarning' !== c &&
                    'suppressHydrationWarning' !== c &&
                    (l.hasOwnProperty(c)
                      ? (null != u && 'onScroll' === c && Fr('scroll', e),
                        i || s === u || (i = []))
                      : (i = i || []).push(c, u));
        }
        n && (i = i || []).push('style', n);
        var c = i;
        (t.updateQueue = c) && (t.flags |= 4);
      }
    }),
    (Hi = function (e, t, n, r) {
      n !== r && (t.flags |= 4);
    });
  var Zi = !1,
    Ki = !1,
    Gi = 'function' == typeof WeakSet ? WeakSet : Set,
    Ji = null;
  function es(e, t) {
    var n = e.ref;
    if (null !== n)
      if ('function' == typeof n)
        try {
          n(null);
        } catch (n) {
          Su(e, t, n);
        }
      else n.current = null;
  }
  function ts(e, t, n) {
    try {
      n();
    } catch (n) {
      Su(e, t, n);
    }
  }
  var ns = !1;
  function rs(e, t, n) {
    var r = t.updateQueue;
    if (null !== (r = null !== r ? r.lastEffect : null)) {
      var l = (r = r.next);
      do {
        if ((l.tag & e) === e) {
          var a = l.destroy;
          (l.destroy = void 0), void 0 !== a && ts(t, n, a);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function ls(e, t) {
    if (null !== (t = null !== (t = t.updateQueue) ? t.lastEffect : null)) {
      var n = (t = t.next);
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function as(e) {
    var t = e.ref;
    if (null !== t) {
      var n = e.stateNode;
      e.tag, (e = n), 'function' == typeof t ? t(e) : (t.current = e);
    }
  }
  function os(e) {
    var t = e.alternate;
    null !== t && ((e.alternate = null), os(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      5 === e.tag &&
        null !== (t = e.stateNode) &&
        (delete t[pl], delete t[hl], delete t[gl], delete t[vl], delete t[yl]),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null);
  }
  function is(e) {
    return 5 === e.tag || 3 === e.tag || 4 === e.tag;
  }
  function ss(e) {
    e: for (;;) {
      for (; null === e.sibling; ) {
        if (null === e.return || is(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        5 !== e.tag && 6 !== e.tag && 18 !== e.tag;

      ) {
        if (2 & e.flags) continue e;
        if (null === e.child || 4 === e.tag) continue e;
        (e.child.return = e), (e = e.child);
      }
      if (!(2 & e.flags)) return e.stateNode;
    }
  }
  function us(e, t, n) {
    var r = e.tag;
    if (5 === r || 6 === r)
      (e = e.stateNode),
        t
          ? 8 === n.nodeType
            ? n.parentNode.insertBefore(e, t)
            : n.insertBefore(e, t)
          : (8 === n.nodeType
              ? (t = n.parentNode).insertBefore(e, n)
              : (t = n).appendChild(e),
            null != (n = n._reactRootContainer) ||
              null !== t.onclick ||
              (t.onclick = el));
    else if (4 !== r && null !== (e = e.child))
      for (us(e, t, n), e = e.sibling; null !== e; )
        us(e, t, n), (e = e.sibling);
  }
  function cs(e, t, n) {
    var r = e.tag;
    if (5 === r || 6 === r)
      (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (4 !== r && null !== (e = e.child))
      for (cs(e, t, n), e = e.sibling; null !== e; )
        cs(e, t, n), (e = e.sibling);
  }
  var ds = null,
    fs = !1;
  function ps(e, t, n) {
    for (n = n.child; null !== n; ) hs(e, t, n), (n = n.sibling);
  }
  function hs(e, t, n) {
    if (ot && 'function' == typeof ot.onCommitFiberUnmount)
      try {
        ot.onCommitFiberUnmount(at, n);
      } catch (e) {}
    switch (n.tag) {
      case 5:
        Ki || es(n, t);
      case 6:
        var r = ds,
          l = fs;
        (ds = null),
          ps(e, t, n),
          (fs = l),
          null !== (ds = r) &&
            (fs
              ? ((e = ds),
                (n = n.stateNode),
                8 === e.nodeType
                  ? e.parentNode.removeChild(n)
                  : e.removeChild(n))
              : ds.removeChild(n.stateNode));
        break;
      case 18:
        null !== ds &&
          (fs
            ? ((e = ds),
              (n = n.stateNode),
              8 === e.nodeType
                ? ul(e.parentNode, n)
                : 1 === e.nodeType && ul(e, n),
              Ut(e))
            : ul(ds, n.stateNode));
        break;
      case 4:
        (r = ds),
          (l = fs),
          (ds = n.stateNode.containerInfo),
          (fs = !0),
          ps(e, t, n),
          (ds = r),
          (fs = l);
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (
          !Ki &&
          null !== (r = n.updateQueue) &&
          null !== (r = r.lastEffect)
        ) {
          l = r = r.next;
          do {
            var a = l,
              o = a.destroy;
            (a = a.tag),
              void 0 !== o && (2 & a || 4 & a) && ts(n, t, o),
              (l = l.next);
          } while (l !== r);
        }
        ps(e, t, n);
        break;
      case 1:
        if (
          !Ki &&
          (es(n, t),
          'function' == typeof (r = n.stateNode).componentWillUnmount)
        )
          try {
            (r.props = n.memoizedProps),
              (r.state = n.memoizedState),
              r.componentWillUnmount();
          } catch (e) {
            Su(n, t, e);
          }
        ps(e, t, n);
        break;
      case 21:
        ps(e, t, n);
        break;
      case 22:
        1 & n.mode
          ? ((Ki = (r = Ki) || null !== n.memoizedState), ps(e, t, n), (Ki = r))
          : ps(e, t, n);
        break;
      default:
        ps(e, t, n);
    }
  }
  function ms(e) {
    var t = e.updateQueue;
    if (null !== t) {
      e.updateQueue = null;
      var n = e.stateNode;
      null === n && (n = e.stateNode = new Gi()),
        t.forEach(function (t) {
          var r = Tu.bind(null, e, t);
          n.has(t) || (n.add(t), t.then(r, r));
        });
    }
  }
  function gs(e, t) {
    var r = t.deletions;
    if (null !== r)
      for (var l = 0; l < r.length; l++) {
        var a = r[l];
        try {
          var o = e,
            i = t,
            s = i;
          e: for (; null !== s; ) {
            switch (s.tag) {
              case 5:
                (ds = s.stateNode), (fs = !1);
                break e;
              case 3:
              case 4:
                (ds = s.stateNode.containerInfo), (fs = !0);
                break e;
            }
            s = s.return;
          }
          if (null === ds) throw Error(n(160));
          hs(o, i, a), (ds = null), (fs = !1);
          var u = a.alternate;
          null !== u && (u.return = null), (a.return = null);
        } catch (e) {
          Su(a, t, e);
        }
      }
    if (12854 & t.subtreeFlags)
      for (t = t.child; null !== t; ) vs(t, e), (t = t.sibling);
  }
  function vs(e, t) {
    var r = e.alternate,
      l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if ((gs(t, e), ys(e), 4 & l)) {
          try {
            rs(3, e, e.return), ls(3, e);
          } catch (t) {
            Su(e, e.return, t);
          }
          try {
            rs(5, e, e.return);
          } catch (t) {
            Su(e, e.return, t);
          }
        }
        break;
      case 1:
        gs(t, e), ys(e), 512 & l && null !== r && es(r, r.return);
        break;
      case 5:
        if (
          (gs(t, e),
          ys(e),
          512 & l && null !== r && es(r, r.return),
          32 & e.flags)
        ) {
          var a = e.stateNode;
          try {
            pe(a, '');
          } catch (t) {
            Su(e, e.return, t);
          }
        }
        if (4 & l && null != (a = e.stateNode)) {
          var o = e.memoizedProps,
            i = null !== r ? r.memoizedProps : o,
            s = e.type,
            u = e.updateQueue;
          if (((e.updateQueue = null), null !== u))
            try {
              'input' === s && 'radio' === o.type && null != o.name && G(a, o),
                we(s, i);
              var c = we(s, o);
              for (i = 0; i < u.length; i += 2) {
                var d = u[i],
                  f = u[i + 1];
                'style' === d
                  ? ve(a, f)
                  : 'dangerouslySetInnerHTML' === d
                    ? fe(a, f)
                    : 'children' === d
                      ? pe(a, f)
                      : g(a, d, f, c);
              }
              switch (s) {
                case 'input':
                  J(a, o);
                  break;
                case 'textarea':
                  oe(a, o);
                  break;
                case 'select':
                  var p = a._wrapperState.wasMultiple;
                  a._wrapperState.wasMultiple = !!o.multiple;
                  var h = o.value;
                  null != h
                    ? re(a, !!o.multiple, h, !1)
                    : p !== !!o.multiple &&
                      (null != o.defaultValue
                        ? re(a, !!o.multiple, o.defaultValue, !0)
                        : re(a, !!o.multiple, o.multiple ? [] : '', !1));
              }
              a[hl] = o;
            } catch (t) {
              Su(e, e.return, t);
            }
        }
        break;
      case 6:
        if ((gs(t, e), ys(e), 4 & l)) {
          if (null === e.stateNode) throw Error(n(162));
          (a = e.stateNode), (o = e.memoizedProps);
          try {
            a.nodeValue = o;
          } catch (t) {
            Su(e, e.return, t);
          }
        }
        break;
      case 3:
        if (
          (gs(t, e), ys(e), 4 & l && null !== r && r.memoizedState.isDehydrated)
        )
          try {
            Ut(t.containerInfo);
          } catch (t) {
            Su(e, e.return, t);
          }
        break;
      case 4:
      default:
        gs(t, e), ys(e);
        break;
      case 13:
        gs(t, e),
          ys(e),
          8192 & (a = e.child).flags &&
            ((o = null !== a.memoizedState),
            (a.stateNode.isHidden = o),
            !o ||
              (null !== a.alternate && null !== a.alternate.memoizedState) ||
              (As = Ge())),
          4 & l && ms(e);
        break;
      case 22:
        if (
          ((d = null !== r && null !== r.memoizedState),
          1 & e.mode ? ((Ki = (c = Ki) || d), gs(t, e), (Ki = c)) : gs(t, e),
          ys(e),
          8192 & l)
        ) {
          if (
            ((c = null !== e.memoizedState),
            (e.stateNode.isHidden = c) && !d && 1 & e.mode)
          )
            for (Ji = e, d = e.child; null !== d; ) {
              for (f = Ji = d; null !== Ji; ) {
                switch (((h = (p = Ji).child), p.tag)) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    rs(4, p, p.return);
                    break;
                  case 1:
                    es(p, p.return);
                    var m = p.stateNode;
                    if ('function' == typeof m.componentWillUnmount) {
                      (l = p), (r = p.return);
                      try {
                        (t = l),
                          (m.props = t.memoizedProps),
                          (m.state = t.memoizedState),
                          m.componentWillUnmount();
                      } catch (e) {
                        Su(l, r, e);
                      }
                    }
                    break;
                  case 5:
                    es(p, p.return);
                    break;
                  case 22:
                    if (null !== p.memoizedState) {
                      Cs(f);
                      continue;
                    }
                }
                null !== h ? ((h.return = p), (Ji = h)) : Cs(f);
              }
              d = d.sibling;
            }
          e: for (d = null, f = e; ; ) {
            if (5 === f.tag) {
              if (null === d) {
                d = f;
                try {
                  (a = f.stateNode),
                    c
                      ? 'function' == typeof (o = a.style).setProperty
                        ? o.setProperty('display', 'none', 'important')
                        : (o.display = 'none')
                      : ((s = f.stateNode),
                        (i =
                          null != (u = f.memoizedProps.style) &&
                          u.hasOwnProperty('display')
                            ? u.display
                            : null),
                        (s.style.display = ge('display', i)));
                } catch (t) {
                  Su(e, e.return, t);
                }
              }
            } else if (6 === f.tag) {
              if (null === d)
                try {
                  f.stateNode.nodeValue = c ? '' : f.memoizedProps;
                } catch (t) {
                  Su(e, e.return, t);
                }
            } else if (
              ((22 !== f.tag && 23 !== f.tag) ||
                null === f.memoizedState ||
                f === e) &&
              null !== f.child
            ) {
              (f.child.return = f), (f = f.child);
              continue;
            }
            if (f === e) break e;
            for (; null === f.sibling; ) {
              if (null === f.return || f.return === e) break e;
              d === f && (d = null), (f = f.return);
            }
            d === f && (d = null),
              (f.sibling.return = f.return),
              (f = f.sibling);
          }
        }
        break;
      case 19:
        gs(t, e), ys(e), 4 & l && ms(e);
      case 21:
    }
  }
  function ys(e) {
    var t = e.flags;
    if (2 & t) {
      try {
        e: {
          for (var r = e.return; null !== r; ) {
            if (is(r)) {
              var l = r;
              break e;
            }
            r = r.return;
          }
          throw Error(n(160));
        }
        switch (l.tag) {
          case 5:
            var a = l.stateNode;
            32 & l.flags && (pe(a, ''), (l.flags &= -33)), cs(e, ss(e), a);
            break;
          case 3:
          case 4:
            var o = l.stateNode.containerInfo;
            us(e, ss(e), o);
            break;
          default:
            throw Error(n(161));
        }
      } catch (t) {
        Su(e, e.return, t);
      }
      e.flags &= -3;
    }
    4096 & t && (e.flags &= -4097);
  }
  function bs(e, t, n) {
    (Ji = e), ws(e);
  }
  function ws(e, t, n) {
    for (var r = !!(1 & e.mode); null !== Ji; ) {
      var l = Ji,
        a = l.child;
      if (22 === l.tag && r) {
        var o = null !== l.memoizedState || Zi;
        if (!o) {
          var i = l.alternate,
            s = (null !== i && null !== i.memoizedState) || Ki;
          i = Zi;
          var u = Ki;
          if (((Zi = o), (Ki = s) && !u))
            for (Ji = l; null !== Ji; )
              (s = (o = Ji).child),
                22 === o.tag && null !== o.memoizedState
                  ? Es(l)
                  : null !== s
                    ? ((s.return = o), (Ji = s))
                    : Es(l);
          for (; null !== a; ) (Ji = a), ws(a), (a = a.sibling);
          (Ji = l), (Zi = i), (Ki = u);
        }
        ks(e);
      } else
        8772 & l.subtreeFlags && null !== a
          ? ((a.return = l), (Ji = a))
          : ks(e);
    }
  }
  function ks(e) {
    for (; null !== Ji; ) {
      var t = Ji;
      if (8772 & t.flags) {
        var r = t.alternate;
        try {
          if (8772 & t.flags)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                Ki || ls(5, t);
                break;
              case 1:
                var l = t.stateNode;
                if (4 & t.flags && !Ki)
                  if (null === r) l.componentDidMount();
                  else {
                    var a =
                      t.elementType === t.type
                        ? r.memoizedProps
                        : ri(t.type, r.memoizedProps);
                    l.componentDidUpdate(
                      a,
                      r.memoizedState,
                      l.__reactInternalSnapshotBeforeUpdate
                    );
                  }
                var o = t.updateQueue;
                null !== o && ja(t, o, l);
                break;
              case 3:
                var i = t.updateQueue;
                if (null !== i) {
                  if (((r = null), null !== t.child))
                    switch (t.child.tag) {
                      case 5:
                      case 1:
                        r = t.child.stateNode;
                    }
                  ja(t, i, r);
                }
                break;
              case 5:
                var s = t.stateNode;
                if (null === r && 4 & t.flags) {
                  r = s;
                  var u = t.memoizedProps;
                  switch (t.type) {
                    case 'button':
                    case 'input':
                    case 'select':
                    case 'textarea':
                      u.autoFocus && r.focus();
                      break;
                    case 'img':
                      u.src && (r.src = u.src);
                  }
                }
                break;
              case 6:
              case 4:
              case 12:
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              case 13:
                if (null === t.memoizedState) {
                  var c = t.alternate;
                  if (null !== c) {
                    var d = c.memoizedState;
                    if (null !== d) {
                      var f = d.dehydrated;
                      null !== f && Ut(f);
                    }
                  }
                }
                break;
              default:
                throw Error(n(163));
            }
          Ki || (512 & t.flags && as(t));
        } catch (e) {
          Su(t, t.return, e);
        }
      }
      if (t === e) {
        Ji = null;
        break;
      }
      if (null !== (r = t.sibling)) {
        (r.return = t.return), (Ji = r);
        break;
      }
      Ji = t.return;
    }
  }
  function Cs(e) {
    for (; null !== Ji; ) {
      var t = Ji;
      if (t === e) {
        Ji = null;
        break;
      }
      var n = t.sibling;
      if (null !== n) {
        (n.return = t.return), (Ji = n);
        break;
      }
      Ji = t.return;
    }
  }
  function Es(e) {
    for (; null !== Ji; ) {
      var t = Ji;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              ls(4, t);
            } catch (e) {
              Su(t, n, e);
            }
            break;
          case 1:
            var r = t.stateNode;
            if ('function' == typeof r.componentDidMount) {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (e) {
                Su(t, l, e);
              }
            }
            var a = t.return;
            try {
              as(t);
            } catch (e) {
              Su(t, a, e);
            }
            break;
          case 5:
            var o = t.return;
            try {
              as(t);
            } catch (e) {
              Su(t, o, e);
            }
        }
      } catch (e) {
        Su(t, t.return, e);
      }
      if (t === e) {
        Ji = null;
        break;
      }
      var i = t.sibling;
      if (null !== i) {
        (i.return = t.return), (Ji = i);
        break;
      }
      Ji = t.return;
    }
  }
  var xs,
    Ss = Math.ceil,
    Ls = v.ReactCurrentDispatcher,
    Ms = v.ReactCurrentOwner,
    zs = v.ReactCurrentBatchConfig,
    Ts = 0,
    _s = null,
    Ps = null,
    Ns = 0,
    Is = 0,
    Rs = Sl(0),
    Hs = 0,
    Ds = null,
    Bs = 0,
    $s = 0,
    Vs = 0,
    Fs = null,
    Os = null,
    As = 0,
    Us = 1 / 0,
    js = null,
    qs = !1,
    Ws = null,
    Qs = null,
    Ys = !1,
    Xs = null,
    Zs = 0,
    Ks = 0,
    Gs = null,
    Js = -1,
    eu = 0;
  function tu() {
    return 6 & Ts ? Ge() : -1 !== Js ? Js : (Js = Ge());
  }
  function nu(e) {
    return 1 & e.mode
      ? 2 & Ts && 0 !== Ns
        ? Ns & -Ns
        : null !== ga.transition
          ? (0 === eu && (eu = gt()), eu)
          : 0 !== (e = wt)
            ? e
            : (e = void 0 === (e = window.event) ? 16 : Kt(e.type))
      : 1;
  }
  function ru(e, t, r, l) {
    if (50 < Ks) throw ((Ks = 0), (Gs = null), Error(n(185)));
    yt(e, r, l),
      (2 & Ts && e === _s) ||
        (e === _s && (!(2 & Ts) && ($s |= r), 4 === Hs && su(e, Ns)),
        lu(e, l),
        1 === r &&
          0 === Ts &&
          !(1 & t.mode) &&
          ((Us = Ge() + 500), Fl && Ul()));
  }
  function lu(e, t) {
    var n = e.callbackNode;
    !(function (e, t) {
      for (
        var n = e.suspendedLanes,
          r = e.pingedLanes,
          l = e.expirationTimes,
          a = e.pendingLanes;
        0 < a;

      ) {
        var o = 31 - it(a),
          i = 1 << o,
          s = l[o];
        -1 === s
          ? (0 !== (i & n) && 0 === (i & r)) || (l[o] = ht(i, t))
          : s <= t && (e.expiredLanes |= i),
          (a &= ~i);
      }
    })(e, t);
    var r = pt(e, e === _s ? Ns : 0);
    if (0 === r)
      null !== n && Xe(n), (e.callbackNode = null), (e.callbackPriority = 0);
    else if (((t = r & -r), e.callbackPriority !== t)) {
      if ((null != n && Xe(n), 1 === t))
        0 === e.tag
          ? (function (e) {
              (Fl = !0), Al(e);
            })(uu.bind(null, e))
          : Al(uu.bind(null, e)),
          il(function () {
            !(6 & Ts) && Ul();
          }),
          (n = null);
      else {
        switch (kt(r)) {
          case 1:
            n = et;
            break;
          case 4:
            n = tt;
            break;
          case 16:
          default:
            n = nt;
            break;
          case 536870912:
            n = lt;
        }
        n = _u(n, au.bind(null, e));
      }
      (e.callbackPriority = t), (e.callbackNode = n);
    }
  }
  function au(e, t) {
    if (((Js = -1), (eu = 0), 6 & Ts)) throw Error(n(327));
    var r = e.callbackNode;
    if (Eu() && e.callbackNode !== r) return null;
    var l = pt(e, e === _s ? Ns : 0);
    if (0 === l) return null;
    if (30 & l || 0 !== (l & e.expiredLanes) || t) t = vu(e, l);
    else {
      t = l;
      var a = Ts;
      Ts |= 2;
      var o = mu();
      for (
        (_s === e && Ns === t) || ((js = null), (Us = Ge() + 500), pu(e, t));
        ;

      )
        try {
          bu();
          break;
        } catch (t) {
          hu(e, t);
        }
      Ma(),
        (Ls.current = o),
        (Ts = a),
        null !== Ps ? (t = 0) : ((_s = null), (Ns = 0), (t = Hs));
    }
    if (0 !== t) {
      if ((2 === t && 0 !== (a = mt(e)) && ((l = a), (t = ou(e, a))), 1 === t))
        throw ((r = Ds), pu(e, 0), su(e, l), lu(e, Ge()), r);
      if (6 === t) su(e, l);
      else {
        if (
          ((a = e.current.alternate),
          !(
            30 & l ||
            (function (e) {
              for (var t = e; ; ) {
                if (16384 & t.flags) {
                  var n = t.updateQueue;
                  if (null !== n && null !== (n = n.stores))
                    for (var r = 0; r < n.length; r++) {
                      var l = n[r],
                        a = l.getSnapshot;
                      l = l.value;
                      try {
                        if (!sr(a(), l)) return !1;
                      } catch (e) {
                        return !1;
                      }
                    }
                }
                if (((n = t.child), 16384 & t.subtreeFlags && null !== n))
                  (n.return = t), (t = n);
                else {
                  if (t === e) break;
                  for (; null === t.sibling; ) {
                    if (null === t.return || t.return === e) return !0;
                    t = t.return;
                  }
                  (t.sibling.return = t.return), (t = t.sibling);
                }
              }
              return !0;
            })(a) ||
            ((t = vu(e, l)),
            2 === t && ((o = mt(e)), 0 !== o && ((l = o), (t = ou(e, o)))),
            1 !== t)
          ))
        )
          throw ((r = Ds), pu(e, 0), su(e, l), lu(e, Ge()), r);
        switch (((e.finishedWork = a), (e.finishedLanes = l), t)) {
          case 0:
          case 1:
            throw Error(n(345));
          case 2:
          case 5:
            Cu(e, Os, js);
            break;
          case 3:
            if (
              (su(e, l), (130023424 & l) === l && 10 < (t = As + 500 - Ge()))
            ) {
              if (0 !== pt(e, 0)) break;
              if (((a = e.suspendedLanes) & l) !== l) {
                tu(), (e.pingedLanes |= e.suspendedLanes & a);
                break;
              }
              e.timeoutHandle = ll(Cu.bind(null, e, Os, js), t);
              break;
            }
            Cu(e, Os, js);
            break;
          case 4:
            if ((su(e, l), (4194240 & l) === l)) break;
            for (t = e.eventTimes, a = -1; 0 < l; ) {
              var i = 31 - it(l);
              (o = 1 << i), (i = t[i]) > a && (a = i), (l &= ~o);
            }
            if (
              ((l = a),
              10 <
                (l =
                  (120 > (l = Ge() - l)
                    ? 120
                    : 480 > l
                      ? 480
                      : 1080 > l
                        ? 1080
                        : 1920 > l
                          ? 1920
                          : 3e3 > l
                            ? 3e3
                            : 4320 > l
                              ? 4320
                              : 1960 * Ss(l / 1960)) - l))
            ) {
              e.timeoutHandle = ll(Cu.bind(null, e, Os, js), l);
              break;
            }
            Cu(e, Os, js);
            break;
          default:
            throw Error(n(329));
        }
      }
    }
    return lu(e, Ge()), e.callbackNode === r ? au.bind(null, e) : null;
  }
  function ou(e, t) {
    var n = Fs;
    return (
      e.current.memoizedState.isDehydrated && (pu(e, t).flags |= 256),
      2 !== (e = vu(e, t)) && ((t = Os), (Os = n), null !== t && iu(t)),
      e
    );
  }
  function iu(e) {
    null === Os ? (Os = e) : Os.push.apply(Os, e);
  }
  function su(e, t) {
    for (
      t &= ~Vs,
        t &= ~$s,
        e.suspendedLanes |= t,
        e.pingedLanes &= ~t,
        e = e.expirationTimes;
      0 < t;

    ) {
      var n = 31 - it(t),
        r = 1 << n;
      (e[n] = -1), (t &= ~r);
    }
  }
  function uu(e) {
    if (6 & Ts) throw Error(n(327));
    Eu();
    var t = pt(e, 0);
    if (!(1 & t)) return lu(e, Ge()), null;
    var r = vu(e, t);
    if (0 !== e.tag && 2 === r) {
      var l = mt(e);
      0 !== l && ((t = l), (r = ou(e, l)));
    }
    if (1 === r) throw ((r = Ds), pu(e, 0), su(e, t), lu(e, Ge()), r);
    if (6 === r) throw Error(n(345));
    return (
      (e.finishedWork = e.current.alternate),
      (e.finishedLanes = t),
      Cu(e, Os, js),
      lu(e, Ge()),
      null
    );
  }
  function cu(e, t) {
    var n = Ts;
    Ts |= 1;
    try {
      return e(t);
    } finally {
      0 === (Ts = n) && ((Us = Ge() + 500), Fl && Ul());
    }
  }
  function du(e) {
    null !== Xs && 0 === Xs.tag && !(6 & Ts) && Eu();
    var t = Ts;
    Ts |= 1;
    var n = zs.transition,
      r = wt;
    try {
      if (((zs.transition = null), (wt = 1), e)) return e();
    } finally {
      (wt = r), (zs.transition = n), !(6 & (Ts = t)) && Ul();
    }
  }
  function fu() {
    (Is = Rs.current), Ll(Rs);
  }
  function pu(e, t) {
    (e.finishedWork = null), (e.finishedLanes = 0);
    var n = e.timeoutHandle;
    if ((-1 !== n && ((e.timeoutHandle = -1), al(n)), null !== Ps))
      for (n = Ps.return; null !== n; ) {
        var r = n;
        switch ((na(r), r.tag)) {
          case 1:
            null != (r = r.type.childContextTypes) && Rl();
            break;
          case 3:
            Ka(), Ll(_l), Ll(Tl), ro();
            break;
          case 5:
            Ja(r);
            break;
          case 4:
            Ka();
            break;
          case 13:
          case 19:
            Ll(eo);
            break;
          case 10:
            za(r.type._context);
            break;
          case 22:
          case 23:
            fu();
        }
        n = n.return;
      }
    if (
      ((_s = e),
      (Ps = e = Ru(e.current, null)),
      (Ns = Is = t),
      (Hs = 0),
      (Ds = null),
      (Vs = $s = Bs = 0),
      (Os = Fs = null),
      null !== Na)
    ) {
      for (t = 0; t < Na.length; t++)
        if (null !== (r = (n = Na[t]).interleaved)) {
          n.interleaved = null;
          var l = r.next,
            a = n.pending;
          if (null !== a) {
            var o = a.next;
            (a.next = l), (r.next = o);
          }
          n.pending = r;
        }
      Na = null;
    }
    return e;
  }
  function hu(e, t) {
    for (;;) {
      var r = Ps;
      try {
        if ((Ma(), (lo.current = Jo), co)) {
          for (var l = io.memoizedState; null !== l; ) {
            var a = l.queue;
            null !== a && (a.pending = null), (l = l.next);
          }
          co = !1;
        }
        if (
          ((oo = 0),
          (uo = so = io = null),
          (fo = !1),
          (po = 0),
          (Ms.current = null),
          null === r || null === r.return)
        ) {
          (Hs = 1), (Ds = t), (Ps = null);
          break;
        }
        e: {
          var o = e,
            i = r.return,
            s = r,
            u = t;
          if (
            ((t = Ns),
            (s.flags |= 32768),
            null !== u && 'object' == typeof u && 'function' == typeof u.then)
          ) {
            var c = u,
              d = s,
              f = d.tag;
            if (!(1 & d.mode || (0 !== f && 11 !== f && 15 !== f))) {
              var p = d.alternate;
              p
                ? ((d.updateQueue = p.updateQueue),
                  (d.memoizedState = p.memoizedState),
                  (d.lanes = p.lanes))
                : ((d.updateQueue = null), (d.memoizedState = null));
            }
            var h = vi(i);
            if (null !== h) {
              (h.flags &= -257),
                yi(h, i, s, 0, t),
                1 & h.mode && gi(o, c, t),
                (u = c);
              var m = (t = h).updateQueue;
              if (null === m) {
                var g = new Set();
                g.add(u), (t.updateQueue = g);
              } else m.add(u);
              break e;
            }
            if (!(1 & t)) {
              gi(o, c, t), gu();
              break e;
            }
            u = Error(n(426));
          } else if (aa && 1 & s.mode) {
            var v = vi(i);
            if (null !== v) {
              !(65536 & v.flags) && (v.flags |= 256),
                yi(v, i, s, 0, t),
                ma(ci(u, s));
              break e;
            }
          }
          (o = u = ci(u, s)),
            4 !== Hs && (Hs = 2),
            null === Fs ? (Fs = [o]) : Fs.push(o),
            (o = i);
          do {
            switch (o.tag) {
              case 3:
                (o.flags |= 65536),
                  (t &= -t),
                  (o.lanes |= t),
                  Aa(o, hi(0, u, t));
                break e;
              case 1:
                s = u;
                var y = o.type,
                  b = o.stateNode;
                if (
                  !(
                    128 & o.flags ||
                    ('function' != typeof y.getDerivedStateFromError &&
                      (null === b ||
                        'function' != typeof b.componentDidCatch ||
                        (null !== Qs && Qs.has(b))))
                  )
                ) {
                  (o.flags |= 65536),
                    (t &= -t),
                    (o.lanes |= t),
                    Aa(o, mi(o, s, t));
                  break e;
                }
            }
            o = o.return;
          } while (null !== o);
        }
        ku(r);
      } catch (e) {
        (t = e), Ps === r && null !== r && (Ps = r = r.return);
        continue;
      }
      break;
    }
  }
  function mu() {
    var e = Ls.current;
    return (Ls.current = Jo), null === e ? Jo : e;
  }
  function gu() {
    (0 !== Hs && 3 !== Hs && 2 !== Hs) || (Hs = 4),
      null === _s || (!(268435455 & Bs) && !(268435455 & $s)) || su(_s, Ns);
  }
  function vu(e, t) {
    var r = Ts;
    Ts |= 2;
    var l = mu();
    for ((_s === e && Ns === t) || ((js = null), pu(e, t)); ; )
      try {
        yu();
        break;
      } catch (t) {
        hu(e, t);
      }
    if ((Ma(), (Ts = r), (Ls.current = l), null !== Ps)) throw Error(n(261));
    return (_s = null), (Ns = 0), Hs;
  }
  function yu() {
    for (; null !== Ps; ) wu(Ps);
  }
  function bu() {
    for (; null !== Ps && !Ze(); ) wu(Ps);
  }
  function wu(e) {
    var t = xs(e.alternate, e, Is);
    (e.memoizedProps = e.pendingProps),
      null === t ? ku(e) : (Ps = t),
      (Ms.current = null);
  }
  function ku(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (((e = t.return), 32768 & t.flags)) {
        if (null !== (n = Xi(n, t))) return (n.flags &= 32767), void (Ps = n);
        if (null === e) return (Hs = 6), void (Ps = null);
        (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null);
      } else if (null !== (n = Yi(n, t, Is))) return void (Ps = n);
      if (null !== (t = t.sibling)) return void (Ps = t);
      Ps = t = e;
    } while (null !== t);
    0 === Hs && (Hs = 5);
  }
  function Cu(e, t, r) {
    var l = wt,
      a = zs.transition;
    try {
      (zs.transition = null),
        (wt = 1),
        (function (e, t, r, l) {
          do {
            Eu();
          } while (null !== Xs);
          if (6 & Ts) throw Error(n(327));
          r = e.finishedWork;
          var a = e.finishedLanes;
          if (null === r) return null;
          if (((e.finishedWork = null), (e.finishedLanes = 0), r === e.current))
            throw Error(n(177));
          (e.callbackNode = null), (e.callbackPriority = 0);
          var o = r.lanes | r.childLanes;
          if (
            ((function (e, t) {
              var n = e.pendingLanes & ~t;
              (e.pendingLanes = t),
                (e.suspendedLanes = 0),
                (e.pingedLanes = 0),
                (e.expiredLanes &= t),
                (e.mutableReadLanes &= t),
                (e.entangledLanes &= t),
                (t = e.entanglements);
              var r = e.eventTimes;
              for (e = e.expirationTimes; 0 < n; ) {
                var l = 31 - it(n),
                  a = 1 << l;
                (t[l] = 0), (r[l] = -1), (e[l] = -1), (n &= ~a);
              }
            })(e, o),
            e === _s && ((Ps = _s = null), (Ns = 0)),
            (!(2064 & r.subtreeFlags) && !(2064 & r.flags)) ||
              Ys ||
              ((Ys = !0),
              _u(nt, function () {
                return Eu(), null;
              })),
            (o = !!(15990 & r.flags)),
            !!(15990 & r.subtreeFlags) || o)
          ) {
            (o = zs.transition), (zs.transition = null);
            var i = wt;
            wt = 1;
            var s = Ts;
            (Ts |= 4),
              (Ms.current = null),
              (function (e, t) {
                if (((tl = qt), hr((e = pr())))) {
                  if ('selectionStart' in e)
                    var r = { start: e.selectionStart, end: e.selectionEnd };
                  else
                    e: {
                      var l =
                        (r = ((r = e.ownerDocument) && r.defaultView) || window)
                          .getSelection && r.getSelection();
                      if (l && 0 !== l.rangeCount) {
                        r = l.anchorNode;
                        var a = l.anchorOffset,
                          o = l.focusNode;
                        l = l.focusOffset;
                        try {
                          r.nodeType, o.nodeType;
                        } catch (e) {
                          r = null;
                          break e;
                        }
                        var i = 0,
                          s = -1,
                          u = -1,
                          c = 0,
                          d = 0,
                          f = e,
                          p = null;
                        t: for (;;) {
                          for (
                            var h;
                            f !== r ||
                              (0 !== a && 3 !== f.nodeType) ||
                              (s = i + a),
                              f !== o ||
                                (0 !== l && 3 !== f.nodeType) ||
                                (u = i + l),
                              3 === f.nodeType && (i += f.nodeValue.length),
                              null !== (h = f.firstChild);

                          )
                            (p = f), (f = h);
                          for (;;) {
                            if (f === e) break t;
                            if (
                              (p === r && ++c === a && (s = i),
                              p === o && ++d === l && (u = i),
                              null !== (h = f.nextSibling))
                            )
                              break;
                            p = (f = p).parentNode;
                          }
                          f = h;
                        }
                        r = -1 === s || -1 === u ? null : { start: s, end: u };
                      } else r = null;
                    }
                  r = r || { start: 0, end: 0 };
                } else r = null;
                for (
                  nl = { focusedElem: e, selectionRange: r }, qt = !1, Ji = t;
                  null !== Ji;

                )
                  if (
                    ((e = (t = Ji).child), 1028 & t.subtreeFlags && null !== e)
                  )
                    (e.return = t), (Ji = e);
                  else
                    for (; null !== Ji; ) {
                      t = Ji;
                      try {
                        var m = t.alternate;
                        if (1024 & t.flags)
                          switch (t.tag) {
                            case 0:
                            case 11:
                            case 15:
                            case 5:
                            case 6:
                            case 4:
                            case 17:
                              break;
                            case 1:
                              if (null !== m) {
                                var g = m.memoizedProps,
                                  v = m.memoizedState,
                                  y = t.stateNode,
                                  b = y.getSnapshotBeforeUpdate(
                                    t.elementType === t.type
                                      ? g
                                      : ri(t.type, g),
                                    v
                                  );
                                y.__reactInternalSnapshotBeforeUpdate = b;
                              }
                              break;
                            case 3:
                              var w = t.stateNode.containerInfo;
                              1 === w.nodeType
                                ? (w.textContent = '')
                                : 9 === w.nodeType &&
                                  w.documentElement &&
                                  w.removeChild(w.documentElement);
                              break;
                            default:
                              throw Error(n(163));
                          }
                      } catch (e) {
                        Su(t, t.return, e);
                      }
                      if (null !== (e = t.sibling)) {
                        (e.return = t.return), (Ji = e);
                        break;
                      }
                      Ji = t.return;
                    }
                (m = ns), (ns = !1);
              })(e, r),
              vs(r, e),
              mr(nl),
              (qt = !!tl),
              (nl = tl = null),
              (e.current = r),
              bs(r),
              Ke(),
              (Ts = s),
              (wt = i),
              (zs.transition = o);
          } else e.current = r;
          if (
            (Ys && ((Ys = !1), (Xs = e), (Zs = a)),
            (o = e.pendingLanes),
            0 === o && (Qs = null),
            (function (e) {
              if (ot && 'function' == typeof ot.onCommitFiberRoot)
                try {
                  ot.onCommitFiberRoot(
                    at,
                    e,
                    void 0,
                    !(128 & ~e.current.flags)
                  );
                } catch (e) {}
            })(r.stateNode),
            lu(e, Ge()),
            null !== t)
          )
            for (l = e.onRecoverableError, r = 0; r < t.length; r++)
              (a = t[r]),
                l(a.value, { componentStack: a.stack, digest: a.digest });
          if (qs) throw ((qs = !1), (e = Ws), (Ws = null), e);
          !!(1 & Zs) && 0 !== e.tag && Eu(),
            (o = e.pendingLanes),
            1 & o ? (e === Gs ? Ks++ : ((Ks = 0), (Gs = e))) : (Ks = 0),
            Ul();
        })(e, t, r, l);
    } finally {
      (zs.transition = a), (wt = l);
    }
    return null;
  }
  function Eu() {
    if (null !== Xs) {
      var e = kt(Zs),
        t = zs.transition,
        r = wt;
      try {
        if (((zs.transition = null), (wt = 16 > e ? 16 : e), null === Xs))
          var l = !1;
        else {
          if (((e = Xs), (Xs = null), (Zs = 0), 6 & Ts)) throw Error(n(331));
          var a = Ts;
          for (Ts |= 4, Ji = e.current; null !== Ji; ) {
            var o = Ji,
              i = o.child;
            if (16 & Ji.flags) {
              var s = o.deletions;
              if (null !== s) {
                for (var u = 0; u < s.length; u++) {
                  var c = s[u];
                  for (Ji = c; null !== Ji; ) {
                    var d = Ji;
                    switch (d.tag) {
                      case 0:
                      case 11:
                      case 15:
                        rs(8, d, o);
                    }
                    var f = d.child;
                    if (null !== f) (f.return = d), (Ji = f);
                    else
                      for (; null !== Ji; ) {
                        var p = (d = Ji).sibling,
                          h = d.return;
                        if ((os(d), d === c)) {
                          Ji = null;
                          break;
                        }
                        if (null !== p) {
                          (p.return = h), (Ji = p);
                          break;
                        }
                        Ji = h;
                      }
                  }
                }
                var m = o.alternate;
                if (null !== m) {
                  var g = m.child;
                  if (null !== g) {
                    m.child = null;
                    do {
                      var v = g.sibling;
                      (g.sibling = null), (g = v);
                    } while (null !== g);
                  }
                }
                Ji = o;
              }
            }
            if (2064 & o.subtreeFlags && null !== i) (i.return = o), (Ji = i);
            else
              e: for (; null !== Ji; ) {
                if (2048 & (o = Ji).flags)
                  switch (o.tag) {
                    case 0:
                    case 11:
                    case 15:
                      rs(9, o, o.return);
                  }
                var y = o.sibling;
                if (null !== y) {
                  (y.return = o.return), (Ji = y);
                  break e;
                }
                Ji = o.return;
              }
          }
          var b = e.current;
          for (Ji = b; null !== Ji; ) {
            var w = (i = Ji).child;
            if (2064 & i.subtreeFlags && null !== w) (w.return = i), (Ji = w);
            else
              e: for (i = b; null !== Ji; ) {
                if (2048 & (s = Ji).flags)
                  try {
                    switch (s.tag) {
                      case 0:
                      case 11:
                      case 15:
                        ls(9, s);
                    }
                  } catch (e) {
                    Su(s, s.return, e);
                  }
                if (s === i) {
                  Ji = null;
                  break e;
                }
                var k = s.sibling;
                if (null !== k) {
                  (k.return = s.return), (Ji = k);
                  break e;
                }
                Ji = s.return;
              }
          }
          if (
            ((Ts = a),
            Ul(),
            ot && 'function' == typeof ot.onPostCommitFiberRoot)
          )
            try {
              ot.onPostCommitFiberRoot(at, e);
            } catch (e) {}
          l = !0;
        }
        return l;
      } finally {
        (wt = r), (zs.transition = t);
      }
    }
    return !1;
  }
  function xu(e, t, n) {
    (e = Fa(e, (t = hi(0, (t = ci(n, t)), 1)), 1)),
      (t = tu()),
      null !== e && (yt(e, 1, t), lu(e, t));
  }
  function Su(e, t, n) {
    if (3 === e.tag) xu(e, e, n);
    else
      for (; null !== t; ) {
        if (3 === t.tag) {
          xu(t, e, n);
          break;
        }
        if (1 === t.tag) {
          var r = t.stateNode;
          if (
            'function' == typeof t.type.getDerivedStateFromError ||
            ('function' == typeof r.componentDidCatch &&
              (null === Qs || !Qs.has(r)))
          ) {
            (t = Fa(t, (e = mi(t, (e = ci(n, e)), 1)), 1)),
              (e = tu()),
              null !== t && (yt(t, 1, e), lu(t, e));
            break;
          }
        }
        t = t.return;
      }
  }
  function Lu(e, t, n) {
    var r = e.pingCache;
    null !== r && r.delete(t),
      (t = tu()),
      (e.pingedLanes |= e.suspendedLanes & n),
      _s === e &&
        (Ns & n) === n &&
        (4 === Hs || (3 === Hs && (130023424 & Ns) === Ns && 500 > Ge() - As)
          ? pu(e, 0)
          : (Vs |= n)),
      lu(e, t);
  }
  function Mu(e, t) {
    0 === t &&
      (1 & e.mode
        ? ((t = dt), !(130023424 & (dt <<= 1)) && (dt = 4194304))
        : (t = 1));
    var n = tu();
    null !== (e = Ha(e, t)) && (yt(e, t, n), lu(e, n));
  }
  function zu(e) {
    var t = e.memoizedState,
      n = 0;
    null !== t && (n = t.retryLane), Mu(e, n);
  }
  function Tu(e, t) {
    var r = 0;
    switch (e.tag) {
      case 13:
        var l = e.stateNode,
          a = e.memoizedState;
        null !== a && (r = a.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      default:
        throw Error(n(314));
    }
    null !== l && l.delete(t), Mu(e, r);
  }
  function _u(e, t) {
    return Ye(e, t);
  }
  function Pu(e, t, n, r) {
    (this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = r),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null);
  }
  function Nu(e, t, n, r) {
    return new Pu(e, t, n, r);
  }
  function Iu(e) {
    return !(!(e = e.prototype) || !e.isReactComponent);
  }
  function Ru(e, t) {
    var n = e.alternate;
    return (
      null === n
        ? (((n = Nu(e.tag, t, e.key, e.mode)).elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = 14680064 & e.flags),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies =
        null === t ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      n
    );
  }
  function Hu(e, t, r, l, a, o) {
    var i = 2;
    if (((l = e), 'function' == typeof e)) Iu(e) && (i = 1);
    else if ('string' == typeof e) i = 5;
    else
      e: switch (e) {
        case w:
          return Du(r.children, a, o, t);
        case k:
          (i = 8), (a |= 8);
          break;
        case C:
          return ((e = Nu(12, r, t, 2 | a)).elementType = C), (e.lanes = o), e;
        case M:
          return ((e = Nu(13, r, t, a)).elementType = M), (e.lanes = o), e;
        case T:
          return ((e = Nu(19, r, t, a)).elementType = T), (e.lanes = o), e;
        case I:
          return Bu(r, a, o, t);
        default:
          if ('object' == typeof e && null !== e)
            switch (e.$$typeof) {
              case E:
                i = 10;
                break e;
              case S:
                i = 9;
                break e;
              case L:
                i = 11;
                break e;
              case _:
                i = 14;
                break e;
              case N:
                (i = 16), (l = null);
                break e;
            }
          throw Error(n(130, null == e ? e : typeof e, ''));
      }
    return (
      ((t = Nu(i, r, t, a)).elementType = e), (t.type = l), (t.lanes = o), t
    );
  }
  function Du(e, t, n, r) {
    return ((e = Nu(7, e, r, t)).lanes = n), e;
  }
  function Bu(e, t, n, r) {
    return (
      ((e = Nu(22, e, r, t)).elementType = I),
      (e.lanes = n),
      (e.stateNode = { isHidden: !1 }),
      e
    );
  }
  function $u(e, t, n) {
    return ((e = Nu(6, e, null, t)).lanes = n), e;
  }
  function Vu(e, t, n) {
    return (
      ((t = Nu(4, null !== e.children ? e.children : [], e.key, t)).lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  function Fu(e, t, n, r, l) {
    (this.tag = t),
      (this.containerInfo = e),
      (this.finishedWork =
        this.pingCache =
        this.current =
        this.pendingChildren =
          null),
      (this.timeoutHandle = -1),
      (this.callbackNode = this.pendingContext = this.context = null),
      (this.callbackPriority = 0),
      (this.eventTimes = vt(0)),
      (this.expirationTimes = vt(-1)),
      (this.entangledLanes =
        this.finishedLanes =
        this.mutableReadLanes =
        this.expiredLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = vt(0)),
      (this.identifierPrefix = r),
      (this.onRecoverableError = l),
      (this.mutableSourceEagerHydrationData = null);
  }
  function Ou(e, t, n, r, l, a, o, i, s) {
    return (
      (e = new Fu(e, t, n, i, s)),
      1 === t ? ((t = 1), !0 === a && (t |= 8)) : (t = 0),
      (a = Nu(3, null, null, t)),
      (e.current = a),
      (a.stateNode = e),
      (a.memoizedState = {
        element: r,
        isDehydrated: n,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null,
      }),
      Ba(a),
      e
    );
  }
  function Au(e) {
    if (!e) return zl;
    e: {
      if (Ue((e = e._reactInternals)) !== e || 1 !== e.tag) throw Error(n(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Il(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (null !== t);
      throw Error(n(171));
    }
    if (1 === e.tag) {
      var r = e.type;
      if (Il(r)) return Dl(e, r, t);
    }
    return t;
  }
  function Uu(e, t, n, r, l, a, o, i, s) {
    return (
      ((e = Ou(n, r, !0, e, 0, a, 0, i, s)).context = Au(null)),
      (n = e.current),
      ((a = Va((r = tu()), (l = nu(n)))).callback = null != t ? t : null),
      Fa(n, a, l),
      (e.current.lanes = l),
      yt(e, l, r),
      lu(e, r),
      e
    );
  }
  function ju(e, t, n, r) {
    var l = t.current,
      a = tu(),
      o = nu(l);
    return (
      (n = Au(n)),
      null === t.context ? (t.context = n) : (t.pendingContext = n),
      ((t = Va(a, o)).payload = { element: e }),
      null !== (r = void 0 === r ? null : r) && (t.callback = r),
      null !== (e = Fa(l, t, o)) && (ru(e, l, o, a), Oa(e, l, o)),
      o
    );
  }
  function qu(e) {
    return (e = e.current).child ? (e.child.tag, e.child.stateNode) : null;
  }
  function Wu(e, t) {
    if (null !== (e = e.memoizedState) && null !== e.dehydrated) {
      var n = e.retryLane;
      e.retryLane = 0 !== n && n < t ? n : t;
    }
  }
  function Qu(e, t) {
    Wu(e, t), (e = e.alternate) && Wu(e, t);
  }
  xs = function (e, t, r) {
    if (null !== e)
      if (e.memoizedProps !== t.pendingProps || _l.current) wi = !0;
      else {
        if (0 === (e.lanes & r) && !(128 & t.flags))
          return (
            (wi = !1),
            (function (e, t, n) {
              switch (t.tag) {
                case 3:
                  _i(t), ha();
                  break;
                case 5:
                  Ga(t);
                  break;
                case 1:
                  Il(t.type) && Bl(t);
                  break;
                case 4:
                  Za(t, t.stateNode.containerInfo);
                  break;
                case 10:
                  var r = t.type._context,
                    l = t.memoizedProps.value;
                  Ml(Ea, r._currentValue), (r._currentValue = l);
                  break;
                case 13:
                  if (null !== (r = t.memoizedState))
                    return null !== r.dehydrated
                      ? (Ml(eo, 1 & eo.current), (t.flags |= 128), null)
                      : 0 !== (n & t.child.childLanes)
                        ? $i(e, t, n)
                        : (Ml(eo, 1 & eo.current),
                          null !== (e = qi(e, t, n)) ? e.sibling : null);
                  Ml(eo, 1 & eo.current);
                  break;
                case 19:
                  if (((r = 0 !== (n & t.childLanes)), 128 & e.flags)) {
                    if (r) return Ui(e, t, n);
                    t.flags |= 128;
                  }
                  if (
                    (null !== (l = t.memoizedState) &&
                      ((l.rendering = null),
                      (l.tail = null),
                      (l.lastEffect = null)),
                    Ml(eo, eo.current),
                    r)
                  )
                    break;
                  return null;
                case 22:
                case 23:
                  return (t.lanes = 0), Si(e, t, n);
              }
              return qi(e, t, n);
            })(e, t, r)
          );
        wi = !!(131072 & e.flags);
      }
    else (wi = !1), aa && 1048576 & t.flags && ea(t, Ql, t.index);
    switch (((t.lanes = 0), t.tag)) {
      case 2:
        var l = t.type;
        ji(e, t), (e = t.pendingProps);
        var a = Nl(t, Tl.current);
        _a(t, r), (a = vo(null, t, l, e, a, r));
        var o = yo();
        return (
          (t.flags |= 1),
          'object' == typeof a &&
          null !== a &&
          'function' == typeof a.render &&
          void 0 === a.$$typeof
            ? ((t.tag = 1),
              (t.memoizedState = null),
              (t.updateQueue = null),
              Il(l) ? ((o = !0), Bl(t)) : (o = !1),
              (t.memoizedState =
                null !== a.state && void 0 !== a.state ? a.state : null),
              Ba(t),
              (a.updater = ai),
              (t.stateNode = a),
              (a._reactInternals = t),
              ui(t, l, e, r),
              (t = Ti(null, t, l, !0, o, r)))
            : ((t.tag = 0), aa && o && ta(t), ki(null, t, a, r), (t = t.child)),
          t
        );
      case 16:
        l = t.elementType;
        e: {
          switch (
            (ji(e, t),
            (e = t.pendingProps),
            (l = (a = l._init)(l._payload)),
            (t.type = l),
            (a = t.tag =
              (function (e) {
                if ('function' == typeof e) return Iu(e) ? 1 : 0;
                if (null != e) {
                  if ((e = e.$$typeof) === L) return 11;
                  if (e === _) return 14;
                }
                return 2;
              })(l)),
            (e = ri(l, e)),
            a)
          ) {
            case 0:
              t = Mi(null, t, l, e, r);
              break e;
            case 1:
              t = zi(null, t, l, e, r);
              break e;
            case 11:
              t = Ci(null, t, l, e, r);
              break e;
            case 14:
              t = Ei(null, t, l, ri(l.type, e), r);
              break e;
          }
          throw Error(n(306, l, ''));
        }
        return t;
      case 0:
        return (
          (l = t.type),
          (a = t.pendingProps),
          Mi(e, t, l, (a = t.elementType === l ? a : ri(l, a)), r)
        );
      case 1:
        return (
          (l = t.type),
          (a = t.pendingProps),
          zi(e, t, l, (a = t.elementType === l ? a : ri(l, a)), r)
        );
      case 3:
        e: {
          if ((_i(t), null === e)) throw Error(n(387));
          (l = t.pendingProps),
            (a = (o = t.memoizedState).element),
            $a(e, t),
            Ua(t, l, null, r);
          var i = t.memoizedState;
          if (((l = i.element), o.isDehydrated)) {
            if (
              ((o = {
                element: l,
                isDehydrated: !1,
                cache: i.cache,
                pendingSuspenseBoundaries: i.pendingSuspenseBoundaries,
                transitions: i.transitions,
              }),
              (t.updateQueue.baseState = o),
              (t.memoizedState = o),
              256 & t.flags)
            ) {
              t = Pi(e, t, l, r, (a = ci(Error(n(423)), t)));
              break e;
            }
            if (l !== a) {
              t = Pi(e, t, l, r, (a = ci(Error(n(424)), t)));
              break e;
            }
            for (
              la = cl(t.stateNode.containerInfo.firstChild),
                ra = t,
                aa = !0,
                oa = null,
                r = Ca(t, null, l, r),
                t.child = r;
              r;

            )
              (r.flags = (-3 & r.flags) | 4096), (r = r.sibling);
          } else {
            if ((ha(), l === a)) {
              t = qi(e, t, r);
              break e;
            }
            ki(e, t, l, r);
          }
          t = t.child;
        }
        return t;
      case 5:
        return (
          Ga(t),
          null === e && ca(t),
          (l = t.type),
          (a = t.pendingProps),
          (o = null !== e ? e.memoizedProps : null),
          (i = a.children),
          rl(l, a) ? (i = null) : null !== o && rl(l, o) && (t.flags |= 32),
          Li(e, t),
          ki(e, t, i, r),
          t.child
        );
      case 6:
        return null === e && ca(t), null;
      case 13:
        return $i(e, t, r);
      case 4:
        return (
          Za(t, t.stateNode.containerInfo),
          (l = t.pendingProps),
          null === e ? (t.child = ka(t, null, l, r)) : ki(e, t, l, r),
          t.child
        );
      case 11:
        return (
          (l = t.type),
          (a = t.pendingProps),
          Ci(e, t, l, (a = t.elementType === l ? a : ri(l, a)), r)
        );
      case 7:
        return ki(e, t, t.pendingProps, r), t.child;
      case 8:
      case 12:
        return ki(e, t, t.pendingProps.children, r), t.child;
      case 10:
        e: {
          if (
            ((l = t.type._context),
            (a = t.pendingProps),
            (o = t.memoizedProps),
            (i = a.value),
            Ml(Ea, l._currentValue),
            (l._currentValue = i),
            null !== o)
          )
            if (sr(o.value, i)) {
              if (o.children === a.children && !_l.current) {
                t = qi(e, t, r);
                break e;
              }
            } else
              for (null !== (o = t.child) && (o.return = t); null !== o; ) {
                var s = o.dependencies;
                if (null !== s) {
                  i = o.child;
                  for (var u = s.firstContext; null !== u; ) {
                    if (u.context === l) {
                      if (1 === o.tag) {
                        (u = Va(-1, r & -r)).tag = 2;
                        var c = o.updateQueue;
                        if (null !== c) {
                          var d = (c = c.shared).pending;
                          null === d
                            ? (u.next = u)
                            : ((u.next = d.next), (d.next = u)),
                            (c.pending = u);
                        }
                      }
                      (o.lanes |= r),
                        null !== (u = o.alternate) && (u.lanes |= r),
                        Ta(o.return, r, t),
                        (s.lanes |= r);
                      break;
                    }
                    u = u.next;
                  }
                } else if (10 === o.tag) i = o.type === t.type ? null : o.child;
                else if (18 === o.tag) {
                  if (null === (i = o.return)) throw Error(n(341));
                  (i.lanes |= r),
                    null !== (s = i.alternate) && (s.lanes |= r),
                    Ta(i, r, t),
                    (i = o.sibling);
                } else i = o.child;
                if (null !== i) i.return = o;
                else
                  for (i = o; null !== i; ) {
                    if (i === t) {
                      i = null;
                      break;
                    }
                    if (null !== (o = i.sibling)) {
                      (o.return = i.return), (i = o);
                      break;
                    }
                    i = i.return;
                  }
                o = i;
              }
          ki(e, t, a.children, r), (t = t.child);
        }
        return t;
      case 9:
        return (
          (a = t.type),
          (l = t.pendingProps.children),
          _a(t, r),
          (l = l((a = Pa(a)))),
          (t.flags |= 1),
          ki(e, t, l, r),
          t.child
        );
      case 14:
        return (
          (a = ri((l = t.type), t.pendingProps)),
          Ei(e, t, l, (a = ri(l.type, a)), r)
        );
      case 15:
        return xi(e, t, t.type, t.pendingProps, r);
      case 17:
        return (
          (l = t.type),
          (a = t.pendingProps),
          (a = t.elementType === l ? a : ri(l, a)),
          ji(e, t),
          (t.tag = 1),
          Il(l) ? ((e = !0), Bl(t)) : (e = !1),
          _a(t, r),
          ii(t, l, a),
          ui(t, l, a, r),
          Ti(null, t, l, !0, e, r)
        );
      case 19:
        return Ui(e, t, r);
      case 22:
        return Si(e, t, r);
    }
    throw Error(n(156, t.tag));
  };
  var Yu =
    'function' == typeof reportError
      ? reportError
      : function (e) {
          console.error(e);
        };
  function Xu(e) {
    this._internalRoot = e;
  }
  function Zu(e) {
    this._internalRoot = e;
  }
  function Ku(e) {
    return !(!e || (1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType));
  }
  function Gu(e) {
    return !(
      !e ||
      (1 !== e.nodeType &&
        9 !== e.nodeType &&
        11 !== e.nodeType &&
        (8 !== e.nodeType || ' react-mount-point-unstable ' !== e.nodeValue))
    );
  }
  function Ju() {}
  function ec(e, t, n, r, l) {
    var a = n._reactRootContainer;
    if (a) {
      var o = a;
      if ('function' == typeof l) {
        var i = l;
        l = function () {
          var e = qu(o);
          i.call(e);
        };
      }
      ju(t, o, e, l);
    } else
      o = (function (e, t, n, r, l) {
        if (l) {
          if ('function' == typeof r) {
            var a = r;
            r = function () {
              var e = qu(o);
              a.call(e);
            };
          }
          var o = Uu(t, r, e, 0, null, !1, 0, '', Ju);
          return (
            (e._reactRootContainer = o),
            (e[ml] = o.current),
            Ur(8 === e.nodeType ? e.parentNode : e),
            du(),
            o
          );
        }
        for (; (l = e.lastChild); ) e.removeChild(l);
        if ('function' == typeof r) {
          var i = r;
          r = function () {
            var e = qu(s);
            i.call(e);
          };
        }
        var s = Ou(e, 0, !1, null, 0, !1, 0, '', Ju);
        return (
          (e._reactRootContainer = s),
          (e[ml] = s.current),
          Ur(8 === e.nodeType ? e.parentNode : e),
          du(function () {
            ju(t, s, n, r);
          }),
          s
        );
      })(n, t, e, l, r);
    return qu(o);
  }
  (Zu.prototype.render = Xu.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (null === t) throw Error(n(409));
      ju(e, t, null, null);
    }),
    (Zu.prototype.unmount = Xu.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (null !== e) {
          this._internalRoot = null;
          var t = e.containerInfo;
          du(function () {
            ju(null, e, null, null);
          }),
            (t[ml] = null);
        }
      }),
    (Zu.prototype.unstable_scheduleHydration = function (e) {
      if (e) {
        var t = St();
        e = { blockedOn: null, target: e, priority: t };
        for (var n = 0; n < Rt.length && 0 !== t && t < Rt[n].priority; n++);
        Rt.splice(n, 0, e), 0 === n && $t(e);
      }
    }),
    (Ct = function (e) {
      switch (e.tag) {
        case 3:
          var t = e.stateNode;
          if (t.current.memoizedState.isDehydrated) {
            var n = ft(t.pendingLanes);
            0 !== n &&
              (bt(t, 1 | n),
              lu(t, Ge()),
              !(6 & Ts) && ((Us = Ge() + 500), Ul()));
          }
          break;
        case 13:
          du(function () {
            var t = Ha(e, 1);
            if (null !== t) {
              var n = tu();
              ru(t, e, 1, n);
            }
          }),
            Qu(e, 1);
      }
    }),
    (Et = function (e) {
      if (13 === e.tag) {
        var t = Ha(e, 134217728);
        if (null !== t) ru(t, e, 134217728, tu());
        Qu(e, 134217728);
      }
    }),
    (xt = function (e) {
      if (13 === e.tag) {
        var t = nu(e),
          n = Ha(e, t);
        if (null !== n) ru(n, e, t, tu());
        Qu(e, t);
      }
    }),
    (St = function () {
      return wt;
    }),
    (Lt = function (e, t) {
      var n = wt;
      try {
        return (wt = e), t();
      } finally {
        wt = n;
      }
    }),
    (Ee = function (e, t, r) {
      switch (t) {
        case 'input':
          if ((J(e, r), (t = r.name), 'radio' === r.type && null != t)) {
            for (r = e; r.parentNode; ) r = r.parentNode;
            for (
              r = r.querySelectorAll(
                'input[name=' + JSON.stringify('' + t) + '][type="radio"]'
              ),
                t = 0;
              t < r.length;
              t++
            ) {
              var l = r[t];
              if (l !== e && l.form === e.form) {
                var a = Cl(l);
                if (!a) throw Error(n(90));
                Y(l), J(l, a);
              }
            }
          }
          break;
        case 'textarea':
          oe(e, r);
          break;
        case 'select':
          null != (t = r.value) && re(e, !!r.multiple, t, !1);
      }
    }),
    (Te = cu),
    (_e = du);
  var tc = { usingClientEntryPoint: !1, Events: [wl, kl, Cl, Me, ze, cu] },
    nc = {
      findFiberByHostInstance: bl,
      bundleType: 0,
      version: '18.3.1',
      rendererPackageName: 'react-dom',
    },
    rc = {
      bundleType: nc.bundleType,
      version: nc.version,
      rendererPackageName: nc.rendererPackageName,
      rendererConfig: nc.rendererConfig,
      overrideHookState: null,
      overrideHookStateDeletePath: null,
      overrideHookStateRenamePath: null,
      overrideProps: null,
      overridePropsDeletePath: null,
      overridePropsRenamePath: null,
      setErrorHandler: null,
      setSuspenseHandler: null,
      scheduleUpdate: null,
      currentDispatcherRef: v.ReactCurrentDispatcher,
      findHostInstanceByFiber: function (e) {
        return null === (e = We(e)) ? null : e.stateNode;
      },
      findFiberByHostInstance: nc.findFiberByHostInstance,
      findHostInstancesForRefresh: null,
      scheduleRefresh: null,
      scheduleRoot: null,
      setRefreshHandler: null,
      getCurrentFiber: null,
      reconcilerVersion: '18.3.1-next-f1338f8080-20240426',
    };
  if ('undefined' != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var lc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!lc.isDisabled && lc.supportsFiber)
      try {
        (at = lc.inject(rc)), (ot = lc);
      } catch (de) {}
  }
  return (
    (x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = tc),
    (x.createPortal = function (e, t) {
      var r =
        2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!Ku(t)) throw Error(n(200));
      return (function (e, t, n) {
        var r =
          3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return {
          $$typeof: b,
          key: null == r ? null : '' + r,
          children: e,
          containerInfo: t,
          implementation: n,
        };
      })(e, t, null, r);
    }),
    (x.createRoot = function (e, t) {
      if (!Ku(e)) throw Error(n(299));
      var r = !1,
        l = '',
        a = Yu;
      return (
        null != t &&
          (!0 === t.unstable_strictMode && (r = !0),
          void 0 !== t.identifierPrefix && (l = t.identifierPrefix),
          void 0 !== t.onRecoverableError && (a = t.onRecoverableError)),
        (t = Ou(e, 1, !1, null, 0, r, 0, l, a)),
        (e[ml] = t.current),
        Ur(8 === e.nodeType ? e.parentNode : e),
        new Xu(t)
      );
    }),
    (x.findDOMNode = function (e) {
      if (null == e) return null;
      if (1 === e.nodeType) return e;
      var t = e._reactInternals;
      if (void 0 === t) {
        if ('function' == typeof e.render) throw Error(n(188));
        throw ((e = Object.keys(e).join(',')), Error(n(268, e)));
      }
      return (e = null === (e = We(t)) ? null : e.stateNode);
    }),
    (x.flushSync = function (e) {
      return du(e);
    }),
    (x.hydrate = function (e, t, r) {
      if (!Gu(t)) throw Error(n(200));
      return ec(null, e, t, !0, r);
    }),
    (x.hydrateRoot = function (e, t, r) {
      if (!Ku(e)) throw Error(n(405));
      var l = (null != r && r.hydratedSources) || null,
        a = !1,
        o = '',
        i = Yu;
      if (
        (null != r &&
          (!0 === r.unstable_strictMode && (a = !0),
          void 0 !== r.identifierPrefix && (o = r.identifierPrefix),
          void 0 !== r.onRecoverableError && (i = r.onRecoverableError)),
        (t = Uu(t, null, e, 1, null != r ? r : null, a, 0, o, i)),
        (e[ml] = t.current),
        Ur(e),
        l)
      )
        for (e = 0; e < l.length; e++)
          (a = (a = (r = l[e])._getVersion)(r._source)),
            null == t.mutableSourceEagerHydrationData
              ? (t.mutableSourceEagerHydrationData = [r, a])
              : t.mutableSourceEagerHydrationData.push(r, a);
      return new Zu(t);
    }),
    (x.render = function (e, t, r) {
      if (!Gu(t)) throw Error(n(200));
      return ec(null, e, t, !1, r);
    }),
    (x.unmountComponentAtNode = function (e) {
      if (!Gu(e)) throw Error(n(40));
      return (
        !!e._reactRootContainer &&
        (du(function () {
          ec(null, null, e, !1, function () {
            (e._reactRootContainer = null), (e[ml] = null);
          });
        }),
        !0)
      );
    }),
    (x.unstable_batchedUpdates = cu),
    (x.unstable_renderSubtreeIntoContainer = function (e, t, r, l) {
      if (!Gu(r)) throw Error(n(200));
      if (null == e || void 0 === e._reactInternals) throw Error(n(38));
      return ec(e, t, r, !1, l);
    }),
    (x.version = '18.3.1-next-f1338f8080-20240426'),
    x
  );
}
var $ = (function () {
    if (I) return C;
    I = 1;
    var e =
      (N ||
        ((N = 1),
        (function e() {
          if (
            'undefined' != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
            'function' == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE
          )
            try {
              __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(e);
            } catch (e) {
              console.error(e);
            }
        })(),
        (E.exports = B())),
      E.exports);
    return (C.createRoot = e.createRoot), (C.hydrateRoot = e.hydrateRoot), C;
  })(),
  V = z();
const F = {
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
  attribute:
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-route-icon lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>',
};
class O {
  static init(e) {
    if (
      ((this.sidebarElement = document.getElementById('customization')),
      (this.controlsContainer = document.getElementById('controls')),
      (this.componentNameHeader = document.getElementById('component-name')),
      (this.closeButton = document.createElement('button')),
      (this.customComponentsConfig = e),
      !this.sidebarElement || !this.controlsContainer)
    )
      return void console.error(
        'CustomizationSidebar: Required elements not found.'
      );
    (this.layersViewController = new b()),
      (this.functionsPanel = document.createElement('div')),
      (this.functionsPanel.id = 'functions-panel'),
      (this.functionsPanel.className = 'dropdown-panel'),
      (this.functionsPanel.style.display = 'none'),
      (this.layersModeToggle = document.createElement('div')),
      (this.layersModeToggle.className = 'layers-mode-toggle'),
      (this.layersModeToggle.innerHTML = `\n        <button id="customize-tab" title="Customize" class="active">⚙️</button>\n        <button id="attribute-tab" title="Attribute" >${F.attribute}</button>\n        <button id="layers-tab" title="Layers"> ☰ </button>\n    `),
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
    const t = this.layersModeToggle.querySelector('#customize-tab'),
      n = this.layersModeToggle.querySelector('#attribute-tab'),
      r = this.layersModeToggle.querySelector('#layers-tab');
    t.addEventListener('click', () => this.switchToCustomizeMode()),
      n.addEventListener('click', () => {
        console.log('attribute tab clicked'), this.switchToAttributeMode();
      }),
      r.addEventListener('click', () => this.switchToLayersMode()),
      this.sidebarElement.appendChild(this.closeButton),
      (this.closeButton.textContent = '×'),
      this.closeButton.classList.add('close-button'),
      this.closeButton.addEventListener('click', () => {
        this.hideSidebar();
      });
  }
  static switchToCustomizeMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('attribute-tab'),
      n = document.getElementById('layers-tab'),
      r = document.getElementById('layers-view'),
      l = document.getElementById('component-name');
    e.classList.add('active'),
      t.classList.remove('active'),
      n.classList.remove('active'),
      (r.style.display = 'none'),
      (this.controlsContainer.style.display = 'block'),
      (this.functionsPanel.style.display = 'none'),
      (l.style.display = 'block'),
      this.selectedComponent &&
        this.populateCssControls(this.selectedComponent);
  }
  static switchToAttributeMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('attribute-tab'),
      n = document.getElementById('layers-tab'),
      r = document.getElementById('layers-view'),
      l = document.getElementById('component-name');
    t.classList.add('active'),
      e.classList.remove('active'),
      n.classList.remove('active'),
      (r.style.display = 'none'),
      (this.functionsPanel.style.display = 'block'),
      (this.controlsContainer.style.display = 'none'),
      (l.style.display = 'block'),
      this.selectedComponent &&
        this.populateFunctionalityControls(this.selectedComponent);
  }
  static switchToLayersMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('attribute-tab'),
      n = document.getElementById('layers-tab'),
      r = document.getElementById('layers-view'),
      l = document.getElementById('component-name');
    n.classList.add('active'),
      t.classList.remove('active'),
      e.classList.remove('active'),
      (this.controlsContainer.style.display = 'none'),
      (this.functionsPanel.style.display = 'none'),
      (r.style.display = 'block'),
      (l.style.display = 'none'),
      b.updateLayersView();
  }
  static showSidebar(e) {
    const t = document.getElementById(e);
    t
      ? ((this.selectedComponent = t),
        (this.sidebarElement.style.display = 'block'),
        (this.componentNameHeader.textContent = `Component: ${e}`),
        this.switchToCustomizeMode())
      : console.error(`Component with ID "${e}" not found.`);
  }
  static hideSidebar() {
    this.sidebarElement &&
      ((this.sidebarElement.style.display = 'none'),
      (this.selectedComponent = null));
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
    const r = document.getElementById('background-color');
    r && (r.value = O.rgbToHex(t.backgroundColor));
    const l = document.getElementById('text-color');
    l && (l.value = O.rgbToHex(t.color));
    const a = document.getElementById('border-color');
    a && (a.value = O.rgbToHex(t.borderColor)), this.addListeners(e);
  }
  static populateFunctionalityControls(e) {
    var t, n;
    if (
      ((this.functionsPanel.innerHTML = ''),
      e.classList.contains('table-component'))
    ) {
      const n = e.querySelector('table');
      if (n) {
        const e = n.rows.length,
          r =
            (null === (t = n.rows[0]) || void 0 === t
              ? void 0
              : t.cells.length) || 0,
          l = document.createElement('div');
        l.classList.add('control-wrapper'),
          (l.innerHTML = `\n                  <label for="table-rows">Number of Rows:</label>\n                  <div class="input-wrapper">\n                    <input type="number" id="table-rows" value="${e}" min="0">\n                  </div>\n              `),
          this.functionsPanel.appendChild(l);
        const a = l.querySelector('#table-rows');
        a.addEventListener(
          'input',
          v(() => {
            const e = parseInt(a.value);
            if (!isNaN(e)) {
              new c().setRowCount(n, e), U.historyManager.captureState();
            }
          }, 300)
        );
        const o = document.createElement('div');
        o.classList.add('control-wrapper'),
          (o.innerHTML = `\n                  <label for="table-cols">Number of Columns:</label>\n                  <div class="input-wrapper">\n                    <input type="number" id="table-cols" value="${r}" min="0">\n                  </div>\n              `),
          this.functionsPanel.appendChild(o);
        const i = o.querySelector('#table-cols');
        i.addEventListener(
          'input',
          v(() => {
            const e = parseInt(i.value);
            if (!isNaN(e)) {
              new c().setColumnCount(n, e), U.historyManager.captureState();
            }
          }, 300)
        );
        const s = document.createElement('div');
        s.classList.add('control-wrapper'),
          (s.innerHTML =
            '\n          <label for="table-header">Create Header:</label>\n          <div class="input-wrapper">\n            <input type="checkbox" id="table-header"  min="0">\n          </div\n        '),
          this.functionsPanel.appendChild(s);
        const u = s.querySelector('#table-header');
        u.addEventListener(
          'input',
          v(() => {
            if (u.checked) {
              new c().createHeder(n), U.historyManager.captureState();
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
        r = O.customComponentsConfig;
      if (
        (console.log(r, 'config'), t && r && r[t] && r[t].settingsComponent)
      ) {
        const n = r[t].settingsComponent,
          l = document.createElement('div');
        (l.id = `react-settings-mount-point-${e.id}`),
          this.functionsPanel.appendChild(l),
          (this.settingsReactRoot = $.createRoot(l)),
          this.settingsReactRoot.render(
            V.createElement(n, { targetComponentId: e.id })
          ),
          console.log(
            `Mounted React settings component for ${t} (ID: ${e.id})`
          );
      }
    } else
      console.log(
        'DEBUG: Component is not a custom component and not a table component.'
      ),
        (this.functionsPanel.innerHTML =
          '<p>No specific settings for this component.</p>');
  }
  static unmountSettingsComponent() {
    this.settingsReactRoot &&
      (this.settingsReactRoot.unmount(),
      (this.settingsReactRoot = null),
      console.log('Unmounted React settings component.'));
  }
  static rgbToHex(e) {
    const t = e.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
    if (!t) return e;
    return `#${((1 << 24) | (parseInt(t[1], 10) << 16) | (parseInt(t[2], 10) << 8) | parseInt(t[3], 10)).toString(16).slice(1).toUpperCase()}`;
  }
  static createControl(e, t, n, r, l = {}) {
    const a = document.createElement('div');
    a.classList.add('control-wrapper');
    if ('number' === n && l.unit) {
      const o = l.unit;
      a.innerHTML = `\n                <label for="${t}">${e}:</label>\n                <div class="input-wrapper">\n                  <input type="${n}" id="${t}" value="${r}">\n                  <select id="${t}-unit">\n                      <option value="px" ${'px' === o ? 'selected' : ''}>px</option>\n                      <option value="rem" ${'rem' === o ? 'selected' : ''}>rem</option>\n                      <option value="vh" ${'vh' === o ? 'selected' : ''}>vh</option>\n                      <option value="%" ${'%' === o ? 'selected' : ''}>%</option>\n                  </select>\n                </div\n            `;
    } else
      a.innerHTML = `\n        <label for="${t}">${e}:</label>\n        <div class="input-wrapper">\n          <input type="color" id="${t}" value="${r}">\n          <input type="text" id="${t}-value" style="font-size: 0.8rem; width: 80px; margin-left: 8px;" value="${r}">\n        </div>\n      `;
    const o = a.querySelector('input'),
      i = a.querySelector(`#${t}-unit`);
    o &&
      Object.keys(l).forEach(e => {
        o.setAttribute(e, l[e].toString());
      });
    const s = a.querySelector(`input[type="color"]#${t}`),
      u = a.querySelector(`#${t}-value`);
    s &&
      s.addEventListener('input', () => {
        u && (u.value = s.value);
      }),
      u &&
        u.addEventListener('input', () => {
          s && (s.value = u.value);
        }),
      this.controlsContainer.appendChild(a),
      i &&
        i.addEventListener('change', () => {
          const e = i.value,
            t = parseInt(o.value);
          o.value = `${t}${e}`;
        });
  }
  static createSelectControl(e, t, n, r) {
    const l = document.createElement('div');
    l.classList.add('control-wrapper');
    const a = r
      .map(
        e => `<option value="${e}" ${e === n ? 'selected' : ''}>${e}</option>`
      )
      .join('');
    (l.innerHTML = `\n                <label for="${t}">${e}:</label>\n                <div class="input-wrapper">\n                  <select id="${t}">${a}</select>\n                </div>\n            `),
      this.controlsContainer.appendChild(l);
  }
  static addListeners(e) {
    var t, n, r, l, a, o, i, s, u, c, d, f, p, h, m, g;
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
      b = v(() => {
        U.historyManager.captureState();
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
      null === (r = y.backgroundColor) ||
        void 0 === r ||
        r.addEventListener('input', () => {
          (e.style.backgroundColor = y.backgroundColor.value),
            (document.getElementById('background-color-value').value =
              y.backgroundColor.value),
            b();
        }),
      null === (l = document.getElementById('background-color-value')) ||
        void 0 === l ||
        l.addEventListener('input', t => {
          const n = t.target;
          (e.style.backgroundColor = n.value),
            (document.getElementById('background-color').value = n.value),
            b();
        }),
      null === (a = y.margin) ||
        void 0 === a ||
        a.addEventListener('input', () => {
          const t = document.getElementById('margin-unit').value;
          (e.style.margin = `${y.margin.value}${t}`), b();
        }),
      null === (o = y.padding) ||
        void 0 === o ||
        o.addEventListener('input', () => {
          const t = document.getElementById('padding-unit').value;
          (e.style.padding = `${y.padding.value}${t}`), b();
        }),
      null === (i = y.alignment) ||
        void 0 === i ||
        i.addEventListener('change', () => {
          (e.style.textAlign = y.alignment.value), b();
        }),
      null === (s = y.fontSize) ||
        void 0 === s ||
        s.addEventListener('input', () => {
          const t = document.getElementById('font-size-unit').value;
          (e.style.fontSize = `${y.fontSize.value}${t}`), b();
        }),
      null === (u = y.textColor) ||
        void 0 === u ||
        u.addEventListener('input', () => {
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
      null === (d = y.borderWidth) ||
        void 0 === d ||
        d.addEventListener('input', () => {
          const t = document.getElementById('border-width-unit').value;
          (e.style.borderWidth = `${y.borderWidth.value}${t}`), b();
        }),
      null === (f = y.borderStyle) ||
        void 0 === f ||
        f.addEventListener('change', () => {
          (e.style.borderStyle = y.borderStyle.value), b();
        }),
      null === (p = y.borderColor) ||
        void 0 === p ||
        p.addEventListener('input', () => {
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
      null === (m = y.display) ||
        void 0 === m ||
        m.addEventListener('change', () => {
          (e.style.display = y.display.value), b();
        }),
      null === (g = y.fontFamily) ||
        void 0 === g ||
        g.addEventListener('change', () => {
          (e.style.fontFamily = y.fontFamily.value), b();
        });
  }
  static getLayersViewController() {
    return this.layersViewController;
  }
}
(O.selectedComponent = null),
  (O.settingsReactRoot = null),
  (O.customComponentsConfig = null);
class A {
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
    const { gridX: r, gridY: l } = this.mousePositionAtGridCorner(e, n);
    (t.style.left = `${r}px`),
      (t.style.top = `${l}px`),
      (t.style.width = '20px'),
      (t.style.height = '20px'),
      t.classList.add('visible');
  }
  mousePositionAtGridCorner(e, t) {
    const n = t.getBoundingClientRect(),
      r = e.clientX - n.left,
      l = e.clientY - n.top;
    return { gridX: 20 * Math.floor(r / 20), gridY: 20 * Math.floor(l / 20) };
  }
  getCellSize() {
    return this.cellSize;
  }
}
class U {
  static getComponents() {
    return U.components;
  }
  static setComponents(e) {
    U.components = e;
  }
  static init(t = null) {
    (U.canvasElement = document.getElementById('canvas')),
      (U.sidebarElement = document.getElementById('sidebar')),
      U.canvasElement.addEventListener('drop', U.onDrop.bind(U)),
      U.canvasElement.addEventListener('dragover', e => e.preventDefault()),
      U.canvasElement.addEventListener('click', e => {
        const t = e.target;
        t && O.showSidebar(t.id);
      }),
      (U.canvasElement.style.position = 'relative'),
      (U.historyManager = new p(U.canvasElement)),
      (U.jsonStorage = new h()),
      (U.controlsManager = new m(U)),
      (U.gridManager = new A()),
      U.gridManager.initializeDropPreview(U.canvasElement);
    if ((new e(U.canvasElement, U.sidebarElement).enable(), t))
      console.log('Canvas: Restoring state from initialData prop.'),
        U.restoreState(t);
    else {
      const e = U.jsonStorage.load();
      e &&
        (console.log('Canvas: Restoring state from localStorage.'),
        U.restoreState(e));
    }
  }
  static dispatchDesignChange() {
    if (U.canvasElement) {
      const e = U.getState(),
        t = new CustomEvent('design-change', {
          detail: e,
          bubbles: !0,
          composed: !0,
        });
      U.canvasElement.dispatchEvent(t),
        console.log('Canvas: Dispatched design-change event', e);
    }
  }
  static clearCanvas() {
    (U.canvasElement.innerHTML = ''),
      (U.components = []),
      U.historyManager.captureState(),
      U.gridManager.initializeDropPreview(U.canvasElement),
      U.gridManager.initializeDropPreview(U.canvasElement),
      U.dispatchDesignChange();
  }
  static getState() {
    return U.components.map(e => {
      const t = e.classList[0].split(/\d/)[0].replace('-component', ''),
        n = e.querySelector('img'),
        r = n ? n.src : null,
        l = e.querySelector('video'),
        a = l ? l.src : null,
        o = window.getComputedStyle(e),
        i = {};
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
        i[e] = o.getPropertyValue(e);
      });
      const s = {};
      Array.from(e.attributes)
        .filter(e => e.name.startsWith('data-'))
        .forEach(e => {
          s[e.name] = e.value;
        });
      let u = {};
      if (e.classList.contains('custom-component')) {
        const t = e.getAttribute('data-component-props');
        if (t)
          try {
            u = JSON.parse(t);
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
        style: i,
        inlineStyle: e.getAttribute('style') || '',
        classes: Array.from(e.classList),
        dataAttributes: s,
        imageSrc: r,
        videoSrc: a,
        props: u,
      };
    });
  }
  static restoreState(e) {
    (U.canvasElement.innerHTML = ''),
      (U.components = []),
      e.forEach(e => {
        const t = e.dataAttributes['data-custom-settings'] || null,
          r = U.createComponent(e.type, t);
        if (r) {
          if (
            (e.classes.includes('custom-component') ||
              (r.innerHTML = e.content),
            (r.className = ''),
            e.classes.forEach(e => {
              r.classList.add(e);
            }),
            'video' === e.type && e.videoSrc)
          ) {
            const t = r.querySelector('video'),
              n = r.querySelector('.upload-text');
            (t.src = e.videoSrc),
              (t.style.display = 'block'),
              (n.style.display = 'none');
          }
          e.inlineStyle && r.setAttribute('style', e.inlineStyle),
            e.computedStyle &&
              Object.keys(e.computedStyle).forEach(t => {
                r.style.setProperty(t, e.computedStyle[t]);
              }),
            e.dataAttributes &&
              Object.entries(e.dataAttributes).forEach(([e, t]) => {
                r.setAttribute(e, t);
              }),
            U.controlsManager.addControlButtons(r),
            U.addDraggableListeners(r),
            r.classList.contains('container-component') &&
              o.restoreContainer(r),
            (r.classList.contains('twoCol-component') ||
              r.classList.contains('threeCol-component')) &&
              i.restoreColumn(r),
            'image' === e.type && n.restoreImageUpload(r, e.imageSrc),
            'table' === e.type && c.restore(r),
            'link' === e.type && d.restore(r),
            U.canvasElement.appendChild(r),
            U.components.push(r);
        }
      }),
      U.gridManager.initializeDropPreview(U.canvasElement);
  }
  static onDrop(e) {
    var t, n;
    if (
      (e.preventDefault(), e.target.classList.contains('container-component'))
    )
      return;
    const r =
      null === (t = e.dataTransfer) || void 0 === t
        ? void 0
        : t.getData('component-type');
    let l =
      null === (n = e.dataTransfer) || void 0 === n
        ? void 0
        : n.getData('custom-settings');
    if (!r) return;
    if (!l || '' === l.trim()) {
      if (
        document.querySelector(`[data-component="${r}"]`) &&
        window.customComponents &&
        window.customComponents[r]
      ) {
        const e = window.customComponents[r];
        e.settings && (l = JSON.stringify(e.settings));
      }
    }
    const { gridX: a, gridY: o } = this.gridManager.mousePositionAtGridCorner(
        e,
        U.canvasElement
      ),
      i = U.createComponent(r, l);
    if (i) {
      const t = U.generateUniqueClass(r);
      (i.id = t),
        i.classList.add(t),
        (i.style.position = 'absolute'),
        'container' === r || 'twoCol' === r || 'threeCol' === r
          ? (i.style.top = `${e.offsetY}px`)
          : ((i.style.position = 'absolute'),
            (i.style.left = `${a}px`),
            (i.style.top = `${o}px`)),
        U.components.push(i),
        U.canvasElement.appendChild(i),
        U.addDraggableListeners(i),
        U.historyManager.captureState();
    }
    U.dispatchDesignChange();
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
    const r = document.getElementById('canvas-container');
    r &&
      ((r.innerHTML = ''),
      this.components.forEach(e => {
        r.appendChild(e);
      })),
      this.historyManager.captureState(),
      U.dispatchDesignChange();
  }
  static createComponent(e, t = null) {
    let n = null;
    const r = U.componentFactory[e];
    if (r) n = r();
    else {
      const t = document.querySelector(`[data-component='${e}']`),
        r = null == t ? void 0 : t.getAttribute('data-tag-name');
      if (!r) return null;
      (n = document.createElement(r)),
        n.classList.add(`${e}-component`, 'custom-component'),
        n.setAttribute('data-component-type', e);
    }
    if (n) {
      n.classList.add('editable-component'),
        'container' != e && n.classList.add('component-resizer');
      const t = U.generateUniqueClass(e);
      n.setAttribute('id', t),
        'image' === e
          ? n.setAttribute('contenteditable', 'false')
          : (n.setAttribute('contenteditable', 'true'),
            n.addEventListener('input', () => {
              U.historyManager.captureState();
            }));
      const r = document.createElement('span');
      (r.className = 'component-label'),
        (r.textContent = t),
        n.appendChild(r),
        U.controlsManager.addControlButtons(n);
    }
    return n;
  }
  static generateUniqueClass(e, t = !1, n = null) {
    if (t && n) {
      let t = U.components.find(e => e.classList.contains(n));
      if (!t && ((t = document.querySelector(`.${n}`)), !t))
        return `${n}-${e}1`;
      const r = Array.from(t.children),
        l = new RegExp(`${n}-${e}(\\d+)`);
      let a = 0;
      return (
        r.forEach(e => {
          e.classList.forEach(e => {
            const t = e.match(l);
            if (t) {
              const e = parseInt(t[1]);
              a = Math.max(a, e);
            }
          });
        }),
        `${n}-${e}${a + 1}`
      );
    }
    {
      const t = new RegExp(`${e}(\\d+)`);
      let n = 0;
      return (
        U.components.forEach(e => {
          e.classList.forEach(e => {
            const r = e.match(t);
            if (r) {
              const e = parseInt(r[1]);
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
      r = 0,
      l = 0;
    e.addEventListener('dragstart', a => {
      if (a.dataTransfer) {
        const o = U.canvasElement.getBoundingClientRect(),
          i = e.getBoundingClientRect();
        (t = a.clientX),
          (n = a.clientY),
          (r = i.left - o.left),
          (l = i.top - o.top),
          (a.dataTransfer.effectAllowed = 'move'),
          (e.style.cursor = 'grabbing');
      }
    }),
      e.addEventListener('dragend', a => {
        a.preventDefault();
        const o = a.clientX - t,
          i = a.clientY - n;
        let s = r + o,
          u = l + i;
        const c = U.canvasElement.offsetWidth - e.offsetWidth,
          d = U.canvasElement.offsetHeight - e.offsetHeight;
        (s = Math.max(0, Math.min(s, c))),
          (u = Math.max(0, Math.min(u, d))),
          (e.style.left = `${s}px`),
          (e.style.top = `${u}px`),
          (e.style.cursor = 'grab'),
          U.historyManager.captureState(),
          U.dispatchDesignChange();
      });
  }
  static exportLayout() {
    return U.components.map(e => ({ type: e.className, content: e.innerHTML }));
  }
}
(U.components = []),
  (U.componentFactory = {
    button: () => new l().create(),
    header: () => new a().create(),
    image: () => new n().create(),
    video: () => new r(() => U.historyManager.captureState()).create(),
    table: () => new c().create(2, 2),
    text: () => new t().create(),
    container: () => new o().create(),
    twoCol: () => new s().create(),
    threeCol: () => new u().create(),
    landingpage: () => new f().create(),
    link: () => new d().create(),
  });
const j = document.getElementById('canvas'),
  q = new (class {
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
j &&
  j.addEventListener('click', e => {
    const t = e.target;
    t !== j && q.selectElement(t);
  });
class W {
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
function Q(e) {
  const t = e => new TextEncoder().encode(e),
    n = [];
  let r = 0;
  const l = [];
  e.forEach(e => {
    const a = t(e.name),
      o = t(e.content),
      i = (function (e) {
        let t = 4294967295;
        for (let n = 0; n < e.length; n++) {
          t ^= e[n];
          for (let e = 0; e < 8; e++) t = (t >>> 1) ^ (1 & t ? 3988292384 : 0);
        }
        return 4294967295 ^ t;
      })(o),
      s = ((e, t, n) => {
        const r = new Uint8Array(30 + e.length);
        return (
          r.set([80, 75, 3, 4]),
          r.set([20, 0], 4),
          r.set([0, 0], 6),
          r.set([0, 0], 8),
          r.set([0, 0], 10),
          r.set([0, 0], 12),
          r.set(
            [255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255],
            14
          ),
          r.set(
            [
              255 & t.length,
              (t.length >> 8) & 255,
              (t.length >> 16) & 255,
              (t.length >> 24) & 255,
            ],
            18
          ),
          r.set(
            [
              255 & t.length,
              (t.length >> 8) & 255,
              (t.length >> 16) & 255,
              (t.length >> 24) & 255,
            ],
            22
          ),
          r.set([255 & e.length, (e.length >> 8) & 255], 26),
          r.set([0, 0], 28),
          r.set(e, 30),
          r
        );
      })(a, o, i);
    n.push(s), n.push(o);
    const u = ((e, t, n, r) => {
      const l = new Uint8Array(46 + e.length);
      return (
        l.set([80, 75, 1, 2]),
        l.set([20, 0], 4),
        l.set([20, 0], 6),
        l.set([0, 0], 8),
        l.set([0, 0], 10),
        l.set([0, 0], 12),
        l.set([0, 0], 14),
        l.set([255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255], 16),
        l.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          20
        ),
        l.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          24
        ),
        l.set([255 & e.length, (e.length >> 8) & 255], 28),
        l.set([0, 0], 30),
        l.set([0, 0], 32),
        l.set([0, 0], 34),
        l.set([0, 0], 36),
        l.set([0, 0, 0, 0], 38),
        l.set([255 & r, (r >> 8) & 255, (r >> 16) & 255, (r >> 24) & 255], 42),
        l.set(e, 46),
        l
      );
    })(a, o, i, r);
    l.push(u), (r += s.length + o.length);
  }),
    n.push(...l);
  const a = l.reduce((e, t) => e + t.length, 0),
    o = ((e, t, n) => {
      const r = new Uint8Array(22);
      return (
        r.set([80, 75, 5, 6]),
        r.set([0, 0], 4),
        r.set([0, 0], 6),
        r.set([255 & e, (e >> 8) & 255], 8),
        r.set([255 & e, (e >> 8) & 255], 10),
        r.set([255 & t, (t >> 8) & 255, (t >> 16) & 255, (t >> 24) & 255], 12),
        r.set([255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255], 16),
        r.set([0, 0], 20),
        r
      );
    })(e.length, a, r);
  n.push(o);
  const i = new Uint8Array(n.reduce((e, t) => e.concat(Array.from(t)), []));
  return new Blob([i], { type: 'application/zip' });
}
class Y {
  static init() {
    document.addEventListener('keydown', this.handleKeydown);
  }
  static handleKeydown(e) {
    if (e.ctrlKey || e.metaKey)
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault(), U.historyManager.undo();
          break;
        case 'y':
          e.preventDefault(), U.historyManager.redo();
      }
  }
}
class X {
  setPreviewMode(e) {
    const t = document.getElementById('canvas');
    t.classList.forEach(e => {
      e.startsWith('preview-') && t.classList.remove(e);
    }),
      t.classList.add(`preview-${e}`);
  }
}
class Z {
  constructor(e = { Basic: [], Extra: [], Custom: {} }, t = null) {
    (this.dynamicComponents = e),
      (this.initialDesign = t),
      (this.canvas = new U()),
      (this.sidebar = new W(this.canvas)),
      (this.htmlGenerator = new y(this.canvas)),
      (this.jsonStorage = new h()),
      (this.previewPanel = new X()),
      this.initializeEventListeners();
  }
  static resetHeaderFlag() {
    Z.headerInitialized = !1;
  }
  initializeEventListeners() {
    (this.canvas = new U()),
      (this.sidebar = new W(this.canvas)),
      (this.htmlGenerator = new y(this.canvas)),
      (this.jsonStorage = new h()),
      (this.previewPanel = new X()),
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
    !(function (e) {
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
          button: F.button,
          header: F.header,
          image: F.image,
          video: F.video,
          text: F.text,
          container: F.container,
          twoCol: F.twocol,
          threeCol: F.threecol,
          table: F.table,
          landingpage: F.landing,
          link: F.hyperlink,
        },
        r = {
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
        l = document.createElement('div');
      l.classList.add('menu'),
        Object.entries(e).forEach(([e, t]) => {
          const a = document.createElement('div');
          a.classList.add('category');
          const o = document.createElement('h4');
          o.classList.add('categoryHeading'),
            (o.innerHTML = e),
            a.prepend(o),
            Array.isArray(t)
              ? t.forEach(e => {
                  const t = document.createElement('div');
                  t.classList.add('draggable'),
                    (t.id = e),
                    t.setAttribute('draggable', 'true'),
                    t.setAttribute('data-component', e);
                  const l = r[e] || `Drag to add ${e}`;
                  if ((t.setAttribute('title', l), n[e])) {
                    t.innerHTML = n[e];
                    const r = t.querySelector('svg');
                    r && r.classList.add('component-icon');
                  } else console.warn(`Icon not found for component: ${e}`);
                  a.appendChild(t);
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
                    const r = document.createElement('span');
                    r.classList.add('custom-component-letter'),
                      (r.textContent = e.charAt(0).toUpperCase()),
                      n.appendChild(r);
                  } else {
                    const {
                      component: r,
                      svg: l,
                      title: a,
                      settingsComponent: o,
                    } = t;
                    if (
                      (n.setAttribute('data-tag-name', r),
                      n.setAttribute('title', a || `Drag to add ${e}`),
                      console.log(o, 'config'),
                      o &&
                        n.setAttribute(
                          'data-custom-settings',
                          JSON.stringify(o)
                        ),
                      l)
                    ) {
                      n.innerHTML = l;
                      const e = n.querySelector('svg');
                      e && e.classList.add('component-icon');
                    } else {
                      const t = document.createElement('span');
                      t.classList.add('custom-component-letter'),
                        (t.textContent = e.charAt(0).toUpperCase()),
                        n.appendChild(t);
                    }
                  }
                  a.appendChild(n);
                }),
            l.appendChild(a);
        }),
        t.appendChild(l);
    })(this.dynamicComponents),
      U.init(this.initialDesign),
      this.sidebar.init(),
      Y.init(),
      console.log(this.dynamicComponents, 'cut'),
      O.init(this.dynamicComponents.Custom),
      this.createHeaderIfNeeded();
  }
  createHeaderIfNeeded() {
    if (document.getElementById('page-builder-header'))
      Z.headerInitialized = !0;
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
                  desktop: F.desktop,
                  tablet: F.tablet,
                  mobile: F.mobile,
                  save: F.save,
                  export: F.code,
                  view: F.view,
                  undo: F.undo,
                  redo: F.redo,
                  reset: F.reset,
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
                r = [
                  { id: 'view-btn', icon: t.view, title: 'View' },
                  { id: 'save-btn', icon: t.save, title: 'Save Layout' },
                  { id: 'reset-btn', icon: t.reset, title: 'Reset' },
                  { id: 'export-btn', icon: t.export, title: 'Export' },
                ],
                l = document.createElement('div');
              l.classList.add('left-buttons'),
                n.forEach(({ id: e, icon: t, title: n }) => {
                  const r = document.createElement('button');
                  (r.id = e),
                    r.classList.add('preview-btn'),
                    (r.title = n),
                    (r.innerHTML = t);
                  const a = r.querySelector('svg');
                  a && a.classList.add('nav-icon'), l.appendChild(r);
                });
              const a = document.createElement('div');
              a.classList.add('center-text'), (a.textContent = 'Page Builder');
              const o = document.createElement('div');
              return (
                o.classList.add('right-buttons'),
                r.forEach(({ id: e, icon: t, title: n }) => {
                  const r = document.createElement('button');
                  (r.id = e),
                    r.classList.add('preview-btn'),
                    (r.title = n),
                    (r.innerHTML = t);
                  const l = r.querySelector('svg');
                  l && l.classList.add('nav-icon'), o.appendChild(r);
                }),
                e.appendChild(l),
                e.appendChild(a),
                e.appendChild(o),
                e
              );
            })()
          ),
          e.parentNode.insertBefore(t, e),
          (Z.headerInitialized = !0);
      } else console.error('Error: #app not found in the DOM');
    }
  }
  setupSaveButton() {
    const e = document.getElementById('save-btn');
    e &&
      e.addEventListener('click', () => {
        const e = U.getState();
        this.jsonStorage.save(e), g('Saving progress...');
      });
  }
  setupResetButton() {
    const e = document.getElementById('reset-btn');
    e &&
      e.addEventListener('click', () => {
        !(function (e, t, n) {
          const r = document.getElementById('dialog'),
            l = document.getElementById('dialog-yes'),
            a = document.getElementById('dialog-no'),
            o = document.getElementById('dialog-message');
          o && (o.innerHTML = e),
            null == r || r.classList.remove('hidden'),
            null == l ||
              l.addEventListener('click', () => {
                t(), null == r || r.classList.add('hidden');
              }),
            null == a ||
              a.addEventListener('click', () => {
                n(), null == r || r.classList.add('hidden');
              });
        })(
          'Are you sure you want to reset the layout?',
          () => {
            this.jsonStorage.remove(),
              U.clearCanvas(),
              g('The saved layout has been successfully reset.');
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
      const r = document.createElement('div');
      (r.textContent = 'PDF'),
        r.classList.add('export-option'),
        (r.id = 'export-pdf-btn'),
        t.appendChild(n),
        t.appendChild(r),
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
        const e = new y(new U()),
          t = e.generateHTML(),
          n = e.generateCSS(),
          r = (function (e) {
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
          l = (function (e) {
            return e
              .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="property">$1</span>')
              .replace(/(:\s*[^;]+;)/g, '<span class="value">$1</span>')
              .replace(/({|})/g, '<span class="bracket">$1</span>');
          })(n),
          a = this.createExportModal(r, l, t, n);
        document.body.appendChild(a), a.classList.add('show');
      });
  }
  setupExportPDFButton() {
    const e = document.getElementById('export-pdf-btn');
    e &&
      e.addEventListener('click', () => {
        console.log('clicked on pdf');
        const e = new y(new U()),
          t = e.generateHTML(),
          n = e.generateCSS(),
          r = window.open('', '_blank');
        if (r) {
          const e = `\n            <html>\n              <head>\n                <title>Export PDF</title>\n                <style>\n                  ${n} /* Generated CSS */\n                  body {\n                    margin: 0;\n                    padding: 20px;\n                    font-family: Arial, sans-serif;\n                  }\n                  @media print {\n                    /* Ensure print styles are applied */\n                    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }\n                    \n                    /* Remove browser headers and footers */\n                    @page {\n                      size: auto;\n                      margin: 0mm;  /* Remove default margins */\n                    }\n                    \n                    /* For Chrome/Safari */\n                    @page { margin: 0; }\n                    html { margin: 0; }\n                  }\n                </style>\n              </head>\n              <body>\n                ${t} \x3c!-- Generated HTML --\x3e\n              </body>\n            </html>\n          `;
          r.document.write(e),
            r.document.close(),
            setTimeout(() => {
              r.print(), r.close();
            }, 500);
        }
      });
  }
  createExportModal(e, t, n, r) {
    const l = document.createElement('div');
    (l.id = 'export-dialog'), l.classList.add('modal');
    const a = document.createElement('div');
    a.classList.add('modal-content');
    const o = this.createCloseButton(l);
    a.appendChild(o);
    const i = this.createCodeSection('HTML', e),
      s = this.createCodeSection('CSS', t),
      u = this.createExportToZipButton(n, r);
    a.appendChild(i), a.appendChild(s), a.appendChild(u);
    const c = document.createElement('div');
    return (
      c.classList.add('button-wrapper'),
      c.appendChild(a),
      l.appendChild(c),
      this.setupModalEventListeners(l),
      l
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
    const r = document.createElement('h2');
    r.textContent = e;
    const l = document.createElement('div');
    return (
      l.classList.add('code-block'),
      l.setAttribute('contenteditable', 'true'),
      (l.innerHTML = t),
      n.appendChild(r),
      n.appendChild(l),
      n
    );
  }
  createExportToZipButton(e, t) {
    const n = document.createElement('button');
    return (
      (n.textContent = 'Export to ZIP'),
      n.classList.add('export-btn'),
      n.addEventListener('click', () => {
        const n = Q([
            { name: 'index.html', content: e },
            { name: 'styles.css', content: t },
          ]),
          r = document.createElement('a');
        (r.href = URL.createObjectURL(n)),
          (r.download = 'exported-files.zip'),
          r.click(),
          URL.revokeObjectURL(r.href);
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
    const r = this.createPreviewCloseButton(t);
    t.appendChild(r);
    const l = this.createResponsivenessControls(n);
    return t.insertBefore(l, n), t;
  }
  createPreviewCloseButton(e) {
    const t = document.createElement('button');
    (t.id = 'close-modal-btn'),
      (t.textContent = '✕'),
      (t.style.cssText =
        '\n      position: absolute;\n      top: 10px;\n      right: 20px;\n      font-size: 20px;\n      border: none;\n      background: none;\n      cursor: pointer;\n    ');
    const n = () => {
      setTimeout(() => e.remove(), 300),
        document.removeEventListener('keydown', r);
    };
    t.addEventListener('click', n);
    const r = e => {
      'Escape' === e.key && n();
    };
    return document.addEventListener('keydown', r), t;
  }
  createResponsivenessControls(e) {
    const t = document.createElement('div');
    t.style.cssText =
      '\n      display: flex;\n      gap: 10px;\n      margin-bottom: 10px;\n    ';
    return (
      [
        { icon: F.mobile, title: 'Desktop', width: '375px', height: '90%' },
        { icon: F.tablet, title: 'Tablet', width: '768px', height: '90%' },
        { icon: F.desktop, title: 'Mobile', width: '97%', height: '90%' },
      ].forEach(n => {
        const r = document.createElement('button');
        (r.style.cssText =
          '\n        padding: 5px;\n        border: none;\n        background: none;\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      '),
          (r.title = n.title);
        const l = document.createElement('div');
        l.innerHTML = n.icon;
        const a = l.querySelector('svg');
        a &&
          ((a.style.width = '24px'),
          (a.style.height = '24px'),
          a.classList.add('component-icon')),
          r.appendChild(l),
          r.addEventListener('click', () => {
            (e.style.width = n.width), (e.style.height = n.height);
          }),
          t.appendChild(r);
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
        U.historyManager.undo();
      }),
      t &&
        t.addEventListener('click', () => {
          U.historyManager.redo();
        });
  }
}
Z.headerInitialized = !1;
const K = new Z();
(exports.PageBuilder = Z), (exports.PageBuilderCore = K);

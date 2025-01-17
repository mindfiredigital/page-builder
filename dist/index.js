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
    const i = document.createElement('div');
    (i.style.color = '#666666'),
      (i.style.border = 'none'),
      (i.style.display = e ? 'none' : 'block');
    const o = document.createElement('input');
    (o.type = 'file'),
      (o.accept = 'image/*'),
      (o.style.display = 'none'),
      o.addEventListener('change', e => n.handleFileChange(e, t, i));
    const a = document.createElement('button');
    a.classList.add('upload-btn'),
      (a.innerHTML = '🖊️'),
      (a.style.position = 'absolute'),
      (a.style.padding = '8px'),
      (a.style.background = 'transparent'),
      (a.style.border = 'none'),
      (a.style.cursor = 'pointer'),
      (a.style.opacity = '0'),
      (a.style.transition = 'opacity 0.2s'),
      (a.style.left = '50%'),
      (a.style.top = '50%'),
      (a.style.transform = 'translate(-50%, -50%)'),
      (a.style.fontSize = '24px'),
      a.addEventListener('click', () => o.click());
    const r = document.createElement('img'),
      l = `${s}-img`;
    return (
      (r.id = l),
      (r.style.width = '100%'),
      (r.style.height = '100%'),
      (r.style.objectFit = 'contain'),
      (r.style.border = 'none'),
      (r.style.display = 'none'),
      e && ((r.src = e), (r.style.display = 'block')),
      t.addEventListener('mouseenter', () => {
        a.style.opacity = '1';
      }),
      t.addEventListener('mouseleave', () => {
        a.style.opacity = '0';
      }),
      t.appendChild(i),
      t.appendChild(o),
      t.appendChild(a),
      t.appendChild(r),
      t
    );
  }
  static handleFileChange(e, t, n) {
    const s = e.target,
      i = s.files ? s.files[0] : null;
    if (i) {
      const e = new FileReader();
      (e.onload = function () {
        const s = e.result,
          i = t.querySelector('img');
        i &&
          ((i.src = s),
          (i.style.display = 'block'),
          (n.style.display = 'none'),
          (t.style.backgroundColor = 'transparent'));
      }),
        e.readAsDataURL(i);
    }
  }
  static restoreImageUpload(e, t) {
    const n = e.querySelector('div:not(.upload-btn)'),
      s = e.querySelector('input[type="file"]'),
      i = e.querySelector('.upload-btn'),
      o = e.querySelector('img');
    s.addEventListener('change', t => this.handleFileChange(t, e, n)),
      i.addEventListener('click', () => s.click()),
      t
        ? ((o.src = t),
          (o.style.display = 'block'),
          (n.style.display = 'none'),
          (e.style.backgroundColor = 'transparent'))
        : ((o.style.display = 'none'),
          (n.style.display = 'block'),
          (e.style.backgroundColor = '#f0f0f0')),
      e.addEventListener('mouseenter', () => {
        i.style.opacity = '1';
      }),
      e.addEventListener('mouseleave', () => {
        i.style.opacity = '0';
      });
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
          b.historyManager.captureState();
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
      i = 0,
      o = 0;
    const a = a => {
        if (!t) return;
        const r = a.clientX - n,
          l = a.clientY - s;
        e.style.transform = `translate(${i + r}px, ${o + l}px)`;
      },
      r = () => {
        (t = !1),
          window.removeEventListener('mousemove', a),
          window.removeEventListener('mouseup', r);
      };
    e.addEventListener('mousedown', l => {
      l.preventDefault(),
        l.stopPropagation(),
        (t = !0),
        (n = l.clientX),
        (s = l.clientY);
      const d = e.getBoundingClientRect();
      (i = d.left),
        (o = d.top),
        window.addEventListener('mousemove', a),
        window.addEventListener('mouseup', r);
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
    const s = b.createComponent(n);
    if (!s) return;
    const i = this.element.classList[2],
      o = b.generateUniqueClass(n, !0, i);
    s.classList.add(o);
    const a = document.createElement('span');
    (a.className = 'component-label'),
      (a.textContent = o),
      (s.id = o),
      (a.style.display = 'none'),
      s.appendChild(a),
      s.addEventListener('mouseenter', e => this.showLabel(e, s)),
      s.addEventListener('mouseleave', e => this.hideLabel(e, s)),
      this.element.appendChild(s),
      this.makeDraggable(s),
      b.historyManager.captureState();
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
    const s = new o();
    (s.element = e), (s.resizers = n), s.addResizeHandles(), e.appendChild(n);
  }
  static restoreContainer(e) {
    o.restoreResizer(e);
    const t = new o();
    t.element = e;
    e.querySelectorAll('.editable-component').forEach(e => {
      var s;
      if (
        (b.controlsManager.addControlButtons(e),
        b.addDraggableListeners(e),
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
    const s = b.createComponent(n);
    if (!s) return;
    const i = e.target;
    if (i && i.classList.contains('column')) {
      i.appendChild(s);
      const e = `${this.element.id}-${`c${Array.from(i.parentElement.children).indexOf(i) + 1}`}`;
      (i.id = e), i.classList.add(e);
      let t = i.querySelector('.column-label');
      t ||
        ((t = document.createElement('span')),
        (t.className = 'column-label'),
        i.appendChild(t)),
        (t.textContent = e);
      const o = b.generateUniqueClass(n, !0, e);
      s.classList.add(o), (s.id = o);
      let a = s.querySelector('.component-label');
      a ||
        ((a = document.createElement('span')),
        (a.className = 'component-label'),
        s.appendChild(a)),
        (a.textContent = o),
        b.historyManager.captureState();
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
        (b.controlsManager.addControlButtons(e),
        b.addDraggableListeners(e),
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
class r extends a {
  constructor() {
    super(2, 'twoCol-component');
  }
}
class l extends a {
  constructor() {
    super(3, 'threeCol-component');
  }
}
class d {
  create() {
    const e = e => {
        let t,
          n,
          s,
          i,
          o = !1,
          a = !1,
          r = 0,
          l = 0;
        (e.style.position = 'relative'),
          (e.style.cursor = 'move'),
          e.addEventListener('mousedown', s => {
            a ||
              ((o = !0),
              (t = s.clientX),
              (n = s.clientY),
              (r = parseFloat(e.getAttribute('data-x') || '0')),
              (l = parseFloat(e.getAttribute('data-y') || '0')),
              document.addEventListener('mousemove', d),
              document.addEventListener('mouseup', c));
          });
        const d = s => {
            if (o) {
              const i = s.clientX - t,
                o = s.clientY - n,
                a = r + i,
                d = l + o;
              (e.style.transform = `translate(${a}px, ${d}px)`),
                e.setAttribute('data-x', a.toString()),
                e.setAttribute('data-y', d.toString());
            }
          },
          c = () => {
            (o = !1),
              document.removeEventListener('mousemove', d),
              document.removeEventListener('mouseup', c);
          };
        if (e.classList.contains('container')) {
          const o = document.createElement('div');
          Object.assign(o.style, {
            width: '10px',
            height: '10px',
            background: 'blue',
            position: 'absolute',
            right: '0',
            bottom: '0',
            cursor: 'se-resize',
          }),
            e.appendChild(o),
            o.addEventListener('mousedown', o => {
              o.stopPropagation(),
                (a = !0),
                (s = e.offsetWidth),
                (i = e.offsetHeight),
                (t = o.clientX),
                (n = o.clientY),
                document.addEventListener('mousemove', r),
                document.addEventListener('mouseup', l);
            });
          const r = o => {
              if (a) {
                const a = s + (o.clientX - t),
                  r = i + (o.clientY - n);
                (e.style.width = `${a}px`), (e.style.height = `${r}px`);
              }
            },
            l = () => {
              (a = !1),
                document.removeEventListener('mousemove', r),
                document.removeEventListener('mouseup', l);
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
    const i = new o().create();
    i.classList.add('container'),
      Object.assign(i.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        width: '100%',
      }),
      e(i);
    const a = new t('MyBrand').create();
    Object.assign(a.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    });
    const r = new o().create();
    r.classList.add('container'),
      Object.assign(r.style, { display: 'flex', gap: '20px' }),
      e(r),
      ['Home', 'Features', 'Contact'].forEach(e => {
        const n = new t(e).create();
        Object.assign(n.style, {
          cursor: 'pointer',
          color: '#555',
          textDecoration: 'none',
        }),
          r.appendChild(n);
      }),
      i.appendChild(a),
      i.appendChild(r);
    const l = new o().create();
    l.classList.add('container'),
      Object.assign(l.style, {
        textAlign: 'center',
        padding: '60px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        marginBottom: '40px',
      }),
      e(l);
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
    const m = new s().create();
    Object.assign(m.style, {
      padding: '12px 24px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }),
      m.addEventListener('mouseenter', () => {
        m.style.backgroundColor = '#0056b3';
      }),
      m.addEventListener('mouseleave', () => {
        m.style.backgroundColor = '#007bff';
      }),
      l.appendChild(d),
      l.appendChild(c),
      l.appendChild(m);
    const p = new o().create();
    p.classList.add('container'),
      Object.assign(p.style, {
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
      }),
      e(p);
    const u = new t('© 2025 MyBrand. All rights reserved.').create();
    return (
      Object.assign(u.style, { fontSize: '14px', color: '#999' }),
      p.appendChild(u),
      n.appendChild(i),
      n.appendChild(l),
      n.appendChild(p),
      n
    );
  }
}
class c {
  constructor(e) {
    (this.undoStack = []), (this.redoStack = []), (this.canvas = e);
  }
  captureState() {
    const e = b.getState();
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
      b.restoreState(t);
    } else if (1 === this.undoStack.length) {
      const e = this.undoStack.pop();
      this.redoStack.push(e);
      const t = b.jsonStorage.load();
      t ? b.restoreState(t) : b.restoreState([]);
    } else console.warn('No more actions to undo.');
  }
  redo() {
    if (this.redoStack.length > 0) {
      const e = this.redoStack.pop();
      this.undoStack.push(e), b.restoreState(e);
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
class p {
  constructor(e) {
    (this.icons = { delete: 'dist/icons/delete.png' }), (this.canvas = e);
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
function u(e) {
  const t = document.getElementById('notification');
  t &&
    ((t.innerHTML = e),
    t.classList.add('visible'),
    t.classList.remove('hidden'),
    setTimeout(() => {
      t.classList.remove('visible'), t.classList.add('hidden');
    }, 2e3));
}
class h {
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
      ];
    Array.from(e.children).forEach(s => {
      const i = s;
      t.forEach(e => {
        i.removeAttribute(e);
      }),
        n.forEach(e => {
          i.classList.remove(e);
        });
      e.querySelectorAll('input').forEach(e => e.remove());
      i
        .querySelectorAll(
          '.component-controls, .delete-icon, .component-label,.column-label, .resizers, .resizer, .drop-preview, .upload-btn, component-resizer'
        )
        .forEach(e => e.remove()),
        i.children.length > 0 && this.cleanupElements(i);
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
      i = [
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
      o = [
        'component-controls',
        'delete-icon',
        'component-label',
        'resizers',
        'resizer',
        'upload-btn',
      ];
    return (
      s.forEach(e => {
        if (o.some(t => e.classList.contains(t))) return;
        const t = window.getComputedStyle(e),
          s = [];
        i.forEach(e => {
          const n = t.getPropertyValue(e);
          if (n && 'none' !== n && '' !== n) {
            if ('resize' === e) return;
            s.push(`${e}: ${n};`);
          }
        });
        const a = this.generateUniqueSelector(e);
        s.length > 0 &&
          n.push(`\n        ${a} {\n          ${s.join('\n  ')}\n        }`);
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
class g {
  constructor(e = '#layers-view', t = '#page') {
    this.initializeElements(e, t);
  }
  initializeElements(e, t) {
    (g.layersView = document.querySelector(e)),
      g.layersView ||
        ((g.layersView = document.createElement('div')),
        (g.layersView.id = 'layers-view'),
        (g.layersView.className = 'layers-view'),
        document.body.appendChild(g.layersView),
        console.warn(`Layers view element created: ${e}`)),
      (g.canvasRoot = document.querySelector(t)),
      g.canvasRoot ||
        (console.error(`Canvas root element not found: ${t}`),
        (g.canvasRoot = document.body));
  }
  static buildLayerHierarchyFromDOM(e) {
    const t = new h(new b()).generateHTML(),
      n = new DOMParser().parseFromString(t, 'text/html'),
      s = (e, t = 0) => {
        var n;
        const i = e;
        if (!i.id) return null;
        const o = {
          id: i.id,
          isVisible:
            'none' !==
            (null === (n = i.style) || void 0 === n ? void 0 : n.display),
          isLocked: 'true' === i.getAttribute('data-locked'),
          depth: t,
          children: [],
        };
        return (
          Array.from(e.children).forEach(e => {
            const n = s(e, t + 1);
            n && o.children.push(n);
          }),
          o
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
    t.forEach(t => {
      const s = this.createLayerItemElement(t);
      if (
        ((s.style.paddingLeft = 1 * n + 'px'),
        t.children && t.children.length > 0)
      ) {
        const i = document.createElement('span');
        (i.className = 'layer-expand-toggle'), (i.textContent = '▶');
        const o = document.createElement('ul');
        (o.className = 'layer-children'),
          (o.style.display = 'none'),
          (o.style.paddingLeft = '0'),
          this.renderLayerItems(o, t.children, n + 1),
          i.addEventListener('click', () => {
            'block' === o.style.display
              ? ((o.style.display = 'none'), (i.textContent = '▶'))
              : ((o.style.display = 'block'), (i.textContent = '▼'));
          }),
          s.appendChild(i),
          e.appendChild(s),
          e.appendChild(o);
      } else e.appendChild(s);
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
    const i = document.createElement('span');
    return (
      (i.className = 'layer-lock'),
      (i.innerHTML = e.isLocked ? '🔒' : '🔓'),
      i.addEventListener('click', () => this.toggleLayerLock(e)),
      (t.draggable = !0),
      t.addEventListener('dragstart', t => this.handleDragStart(t, e)),
      t.addEventListener('dragover', this.handleDragOver),
      t.addEventListener('drop', t => this.handleDrop(t, e)),
      t.appendChild(n),
      t.appendChild(s),
      t.appendChild(i),
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
      i = parseInt(t.id || '-1');
    b.reorderComponent(s, i), this.updateLayersView();
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
(g.layersView = null), (g.canvasRoot = null), (g.draggedItem = null);
class y {
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
    (this.layersViewController = new g()),
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
      i = document.getElementById('component-name');
    e.classList.add('active'),
      t.classList.remove('active'),
      n.classList.add('hidden'),
      s.classList.remove('hidden'),
      (s.style.display = 'block'),
      (n.style.display = 'none'),
      (i.style.display = 'block');
  }
  static switchToLayersMode() {
    const e = document.getElementById('customize-tab'),
      t = document.getElementById('layers-tab'),
      n = document.getElementById('layers-view'),
      s = document.getElementById('controls'),
      i = document.getElementById('component-name');
    t.classList.add('active'),
      e.classList.remove('active'),
      (s.style.display = 'none'),
      (n.style.display = 'block'),
      (i.style.display = 'none'),
      g.updateLayersView();
  }
  static updateLayersView() {
    g.updateLayersView();
  }
  static showSidebar(e) {
    const t = document.getElementById('customize-tab'),
      n = document.getElementById('layers-tab'),
      s = document.getElementById('layers-view'),
      i = document.getElementById('controls');
    t.classList.add('active'),
      n.classList.remove('active'),
      s.classList.add('hidden'),
      i.classList.remove('hidden');
    const o = document.getElementById(e);
    if ((console.log(`Showing sidebar for: ${e}`), !o))
      return void console.error(`Component with ID "${e}" not found.`);
    const a = 'canvas' === e.toLowerCase();
    (this.sidebarElement.style.display = 'block'),
      (this.controlsContainer.innerHTML = ''),
      (this.componentNameHeader.textContent = `Component: ${e}`);
    const r = getComputedStyle(o);
    this.createSelectControl('Display', 'display', r.display || 'block', [
      'block',
      'inline',
      'inline-block',
      'flex',
      'grid',
      'none',
    ]),
      a ||
        (this.createControl('Width', 'width', 'number', o.offsetWidth, {
          min: 0,
          max: 1e3,
          unit: 'px',
        }),
        this.createControl('Height', 'height', 'number', o.offsetHeight, {
          min: 0,
          max: 1e3,
          unit: 'px',
        }),
        this.createControl(
          'Margin',
          'margin',
          'number',
          parseInt(r.margin) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        ),
        this.createControl(
          'Padding',
          'padding',
          'number',
          parseInt(r.padding) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        )),
      this.createControl('Color', 'color', 'color', r.backgroundColor),
      this.createSelectControl('Text Alignment', 'alignment', r.textAlign, [
        'left',
        'center',
        'right',
      ]),
      this.createSelectControl('Font Family', 'font-family', r.fontFamily, [
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
        parseInt(r.fontSize) || 16,
        { min: 0, max: 100, unit: 'px' }
      ),
      this.createControl(
        'Text Color',
        'text-color',
        'color',
        r.color || '#000000'
      ),
      this.createControl(
        'Border Width',
        'border-width',
        'number',
        parseInt(r.borderWidth) || 0,
        { min: 0, max: 20, unit: 'px' }
      ),
      this.createSelectControl(
        'Border Style',
        'border-style',
        r.borderStyle || 'none',
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
        r.borderColor || '#000000'
      );
    const l = y.rgbToHex(r.backgroundColor),
      d = document.getElementById('color');
    d && (d.value = l), this.addListeners(o);
  }
  static hideSidebar() {
    this.sidebarElement && (this.sidebarElement.style.display = 'none');
  }
  static rgbToHex(e) {
    const t = e.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/);
    if (!t) return e;
    return `#${((1 << 24) | (parseInt(t[1], 10) << 16) | (parseInt(t[2], 10) << 8) | parseInt(t[3], 10)).toString(16).slice(1).toUpperCase()}`;
  }
  static createControl(e, t, n, s, i = {}) {
    const o = document.createElement('div');
    o.classList.add('control-wrapper');
    if ('number' === n && i.unit) {
      const a = i.unit;
      o.innerHTML = `\n                  <label for="${t}">${e}:</label>\n                  <input type="${n}" id="${t}" value="${s}">\n                  <select id="${t}-unit">\n                      <option value="px" ${'px' === a ? 'selected' : ''}>px</option>\n                      <option value="rem" ${'rem' === a ? 'selected' : ''}>rem</option>\n                      <option value="vh" ${'vh' === a ? 'selected' : ''}>vh</option>\n                      <option value="%" ${'%' === a ? 'selected' : ''}>%</option>\n                  </select>\n              `;
    } else
      o.innerHTML = `\n          <label for="${t}">${e}:</label>\n          <input type="color" id="${t}" value="${s}">\n          <input type="text" id="color-value" style="font-size: 0.8rem; width: 80px; margin-left: 8px;" value="${s}">\n        `;
    const a = o.querySelector('input'),
      r = o.querySelector(`#${t}-unit`);
    a &&
      Object.keys(i).forEach(e => {
        a.setAttribute(e, i[e].toString());
      });
    const l = o.querySelector('input[type="color"]'),
      d = o.querySelector('#color-value');
    l &&
      l.addEventListener('input', () => {
        d && (d.value = l.value);
      }),
      d &&
        d.addEventListener('input', () => {
          l && (l.value = d.value);
        }),
      this.controlsContainer.appendChild(o),
      r &&
        r.addEventListener('change', () => {
          const e = r.value,
            t = parseInt(a.value);
          a.value = `${t}${e}`;
        });
  }
  static createSelectControl(e, t, n, s) {
    const i = document.createElement('div');
    i.classList.add('control-wrapper');
    const o = s
      .map(
        e => `<option value="${e}" ${e === n ? 'selected' : ''}>${e}</option>`
      )
      .join('');
    (i.innerHTML = `\n              <label for="${t}">${e}:</label>\n              <select id="${t}">${o}</select>\n          `),
      this.controlsContainer.appendChild(i);
  }
  static addListeners(e) {
    var t, n, s, i, o, a, r, l, d, c, m, p, u;
    const h = {
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
    if (!h) return;
    const g = (function (e, t) {
      let n = null;
      return (...s) => {
        n && clearTimeout(n), (n = setTimeout(() => e(...s), t));
      };
    })(() => {
      b.historyManager.captureState();
    }, 300);
    null === (t = h.width) ||
      void 0 === t ||
      t.addEventListener('input', () => {
        const t = document.getElementById('width-unit').value;
        (e.style.width = `${h.width.value}${t}`), g();
      }),
      null === (n = h.height) ||
        void 0 === n ||
        n.addEventListener('input', () => {
          const t = document.getElementById('height-unit').value;
          (e.style.height = `${h.height.value}${t}`), g();
        }),
      null === (s = h.color) ||
        void 0 === s ||
        s.addEventListener('input', () => {
          e.style.backgroundColor = h.color.value;
          const t = document.querySelector('#color-value');
          t && (t.textContent = h.color.value), g();
        }),
      null === (i = h.margin) ||
        void 0 === i ||
        i.addEventListener('input', () => {
          const t = document.getElementById('margin-unit').value;
          (e.style.margin = `${h.margin.value}${t}`), g();
        }),
      null === (o = h.padding) ||
        void 0 === o ||
        o.addEventListener('input', () => {
          const t = document.getElementById('padding-unit').value;
          (e.style.padding = `${h.padding.value}${t}`), g();
        }),
      null === (a = h.alignment) ||
        void 0 === a ||
        a.addEventListener('change', () => {
          (e.style.textAlign = h.alignment.value), g();
        }),
      null === (r = h.fontSize) ||
        void 0 === r ||
        r.addEventListener('input', () => {
          const t = document.getElementById('font-size-unit').value;
          (e.style.fontSize = `${h.fontSize.value}${t}`), g();
        }),
      null === (l = h.textColor) ||
        void 0 === l ||
        l.addEventListener('input', () => {
          (e.style.color = h.textColor.value), g();
        }),
      null === (d = h.borderWidth) ||
        void 0 === d ||
        d.addEventListener('input', () => {
          const t = document.getElementById('border-width-unit').value;
          (e.style.borderWidth = `${h.borderWidth.value}${t}`), g();
        }),
      null === (c = h.borderStyle) ||
        void 0 === c ||
        c.addEventListener('change', () => {
          (e.style.borderStyle = h.borderStyle.value), g();
        }),
      null === (m = h.borderColor) ||
        void 0 === m ||
        m.addEventListener('input', () => {
          (e.style.borderColor = h.borderColor.value), g();
        }),
      null === (p = h.display) ||
        void 0 === p ||
        p.addEventListener('change', () => {
          (e.style.display = h.display.value), g();
        }),
      null === (u = h.fontFamily) ||
        void 0 === u ||
        u.addEventListener('change', () => {
          (e.style.fontFamily = h.fontFamily.value), g();
        });
  }
  static getLayersViewController() {
    return this.layersViewController;
  }
}
class v {
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
    const { gridX: s, gridY: i } = this.mousePositionAtGridCorner(e, n);
    (t.style.left = `${s}px`),
      (t.style.top = `${i}px`),
      (t.style.width = '20px'),
      (t.style.height = '20px'),
      t.classList.add('visible');
  }
  mousePositionAtGridCorner(e, t) {
    const n = t.getBoundingClientRect(),
      s = e.clientX - n.left,
      i = e.clientY - n.top;
    return { gridX: 20 * Math.floor(s / 20), gridY: 20 * Math.floor(i / 20) };
  }
  getCellSize() {
    return this.cellSize;
  }
}
class b {
  static getComponents() {
    return b.components;
  }
  static setComponents(e) {
    b.components = e;
  }
  static init() {
    (b.canvasElement = document.getElementById('canvas')),
      (b.sidebarElement = document.getElementById('sidebar')),
      b.canvasElement.addEventListener('drop', b.onDrop.bind(b)),
      b.canvasElement.addEventListener('dragover', e => e.preventDefault()),
      b.canvasElement.addEventListener('click', e => {
        const t = e.target;
        console.log('this is my component,', t),
          console.log('this is component id ', t.id),
          t && y.showSidebar(t.id);
      }),
      (b.canvasElement.style.position = 'relative'),
      (b.historyManager = new c(b.canvasElement)),
      (b.jsonStorage = new m()),
      (b.controlsManager = new p(b)),
      (b.gridManager = new v()),
      b.gridManager.initializeDropPreview(b.canvasElement);
    new e(b.canvasElement, b.sidebarElement).enable();
    const t = b.jsonStorage.load();
    t && b.restoreState(t);
  }
  static clearCanvas() {
    (b.canvasElement.innerHTML = ''),
      (b.components = []),
      b.historyManager.captureState(),
      b.gridManager.initializeDropPreview(b.canvasElement);
  }
  static getState() {
    return b.components.map(e => {
      const t = e.classList[0].split(/\d/)[0].replace('-component', ''),
        n = e.querySelector('img') ? e.querySelector('img').src : null,
        s = window.getComputedStyle(e),
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
        i[e] = s.getPropertyValue(e);
      });
      const o = {};
      return (
        Array.from(e.attributes)
          .filter(e => e.name.startsWith('data-'))
          .forEach(e => {
            o[e.name] = e.value;
          }),
        {
          id: e.id,
          type: t,
          content: e.innerHTML,
          position: { x: e.offsetLeft, y: e.offsetTop },
          dimensions: { width: e.offsetWidth, height: e.offsetHeight },
          style: i,
          inlineStyle: e.getAttribute('style') || '',
          classes: Array.from(e.classList),
          dataAttributes: o,
          imageSrc: n,
        }
      );
    });
  }
  static restoreState(e) {
    (b.canvasElement.innerHTML = ''),
      (b.components = []),
      e.forEach(e => {
        const t = b.createComponent(e.type);
        t &&
          ((t.innerHTML = e.content),
          (t.className = ''),
          e.classes.forEach(e => {
            t.classList.add(e);
          }),
          e.inlineStyle && t.setAttribute('style', e.inlineStyle),
          e.computedStyle &&
            Object.keys(e.computedStyle).forEach(n => {
              t.style.setProperty(n, e.computedStyle[n]);
            }),
          e.dataAttributes &&
            Object.entries(e.dataAttributes).forEach(([e, n]) => {
              t.setAttribute(e, n);
            }),
          b.controlsManager.addControlButtons(t),
          b.addDraggableListeners(t),
          t.classList.contains('container-component') && o.restoreContainer(t),
          (t.classList.contains('twoCol-component') ||
            t.classList.contains('threeCol-component')) &&
            a.restoreColumn(t),
          'image' === e.type && n.restoreImageUpload(t, e.imageSrc),
          b.canvasElement.appendChild(t),
          b.components.push(t));
      }),
      b.gridManager.initializeDropPreview(b.canvasElement);
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
    if ((console.log(`Dropped component type: ${n}`), !n)) return;
    const { gridX: s, gridY: i } = this.gridManager.mousePositionAtGridCorner(
        e,
        b.canvasElement
      ),
      o = b.createComponent(n);
    if (o) {
      const t = b.generateUniqueClass(n);
      (o.id = t),
        o.classList.add(t),
        (o.style.position = 'absolute'),
        'container' === n || 'twoCol' === n || 'threeCol' === n
          ? (o.style.top = `${e.offsetY}px`)
          : ((o.style.position = 'absolute'),
            (o.style.left = `${s}px`),
            (o.style.top = `${i}px`));
      const a = document.createElement('span');
      (a.className = 'component-label'),
        (a.textContent = t),
        o.appendChild(a),
        b.components.push(o),
        b.canvasElement.appendChild(o),
        b.addDraggableListeners(o),
        y.updateLayersView(),
        b.historyManager.captureState();
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
    const t = b.componentFactory[e];
    if (!t) return console.warn(`Unknown component type: ${e}`), null;
    const n = t();
    if (n) {
      n.classList.add('editable-component'),
        'container' != e && n.classList.add('component-resizer');
      const t = b.generateUniqueClass(e);
      n.setAttribute('id', t),
        'image' === e
          ? n.setAttribute('contenteditable', 'false')
          : n.setAttribute('contenteditable', 'true'),
        b.controlsManager.addControlButtons(n),
        y.updateLayersView();
    }
    return n;
  }
  static generateUniqueClass(e, t = !1, n = null) {
    if (t && n) {
      let t = b.components.find(e => e.classList.contains(n));
      if (!t && ((t = document.querySelector(`.${n}`)), !t))
        return (
          console.warn(`Container with class ${n} not found.`), `${n}-${e}1`
        );
      const s = Array.from(t.children),
        i = new RegExp(`${n}-${e}(\\d+)`);
      let o = 0;
      return (
        s.forEach(e => {
          e.classList.forEach(e => {
            const t = e.match(i);
            if (t) {
              const e = parseInt(t[1]);
              o = Math.max(o, e);
            }
          });
        }),
        `${n}-${e}${o + 1}`
      );
    }
    {
      const t = new RegExp(`${e}(\\d+)`);
      let n = 0;
      return (
        b.components.forEach(e => {
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
      i = 0;
    e.addEventListener('dragstart', o => {
      if (o.dataTransfer) {
        const a = b.canvasElement.getBoundingClientRect(),
          r = e.getBoundingClientRect();
        (t = o.clientX),
          (n = o.clientY),
          (s = r.left - a.left),
          (i = r.top - a.top),
          (o.dataTransfer.effectAllowed = 'move'),
          (e.style.cursor = 'grabbing');
      }
    }),
      e.addEventListener('dragend', o => {
        o.preventDefault();
        const a = o.clientX - t,
          r = o.clientY - n;
        let l = s + a,
          d = i + r;
        const c = b.canvasElement.offsetWidth - e.offsetWidth,
          m = b.canvasElement.offsetHeight - e.offsetHeight;
        (l = Math.max(0, Math.min(l, c))),
          (d = Math.max(0, Math.min(d, m))),
          (e.style.left = `${l}px`),
          (e.style.top = `${d}px`),
          (e.style.cursor = 'grab'),
          b.historyManager.captureState();
      });
  }
  static exportLayout() {
    return b.components.map(e => ({ type: e.className, content: e.innerHTML }));
  }
}
(b.components = []),
  (b.componentFactory = {
    button: () => new s().create(),
    header: () => new i().create(),
    image: () => new n().create(),
    text: () => new t().create(),
    container: () => new o().create(),
    twoCol: () => new r().create(),
    threeCol: () => new l().create(),
    landingpage: () => new d().create(),
  });
const E = document.getElementById('canvas'),
  f = new (class {
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
    t !== E && f.selectElement(t);
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
function w(e) {
  const t = e => new TextEncoder().encode(e),
    n = [];
  let s = 0;
  const i = [];
  e.forEach(e => {
    const o = t(e.name),
      a = t(e.content),
      r = (function (e) {
        let t = 4294967295;
        for (let n = 0; n < e.length; n++) {
          t ^= e[n];
          for (let e = 0; e < 8; e++) t = (t >>> 1) ^ (1 & t ? 3988292384 : 0);
        }
        return 4294967295 ^ t;
      })(a),
      l = ((e, t, n) => {
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
      })(o, a, r);
    n.push(l), n.push(a);
    const d = ((e, t, n, s) => {
      const i = new Uint8Array(46 + e.length);
      return (
        i.set([80, 75, 1, 2]),
        i.set([20, 0], 4),
        i.set([20, 0], 6),
        i.set([0, 0], 8),
        i.set([0, 0], 10),
        i.set([0, 0], 12),
        i.set([0, 0], 14),
        i.set([255 & n, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255], 16),
        i.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          20
        ),
        i.set(
          [
            255 & t.length,
            (t.length >> 8) & 255,
            (t.length >> 16) & 255,
            (t.length >> 24) & 255,
          ],
          24
        ),
        i.set([255 & e.length, (e.length >> 8) & 255], 28),
        i.set([0, 0], 30),
        i.set([0, 0], 32),
        i.set([0, 0], 34),
        i.set([0, 0], 36),
        i.set([0, 0, 0, 0], 38),
        i.set([255 & s, (s >> 8) & 255, (s >> 16) & 255, (s >> 24) & 255], 42),
        i.set(e, 46),
        i
      );
    })(o, a, r, s);
    i.push(d), (s += l.length + a.length);
  }),
    n.push(...i);
  const o = i.reduce((e, t) => e + t.length, 0),
    a = ((e, t, n) => {
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
    })(e.length, o, s);
  n.push(a);
  const r = new Uint8Array(n.reduce((e, t) => e.concat(Array.from(t)), []));
  return new Blob([r], { type: 'application/zip' });
}
class C {
  static init() {
    document.addEventListener('keydown', this.handleKeydown);
  }
  static handleKeydown(e) {
    if (e.ctrlKey || e.metaKey)
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault(), b.historyManager.undo();
          break;
        case 'y':
          e.preventDefault(), b.historyManager.redo();
      }
  }
}
class x {
  setPreviewMode(e) {
    const t = document.getElementById('canvas');
    t.classList.forEach(e => {
      e.startsWith('preview-') && t.classList.remove(e);
    }),
      t.classList.add(`preview-${e}`);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  var e, t, n, s, i, o, a, r, l;
  const d = new b(),
    c = new L(d),
    p = new h(d),
    g = new m(),
    v = new x();
  !(function () {
    const e = document.getElementById('sidebar'),
      t = {
        button: 'dist/icons/button.png',
        header: 'dist/icons/header.png',
        image: 'dist/icons/image.png',
        text: 'dist/icons/text.png',
        container: 'dist/icons/square.png',
        twoCol: 'dist/icons/column.png',
        threeCol: 'dist/icons/threecolumn.png',
        landingpage: 'dist/icons/landingpage.png',
      },
      n = {
        button: 'Button',
        header: 'Header',
        image: 'Image',
        text: 'Text',
        container: 'Container',
        twoCol: 'Two Column Layout',
        threeCol: 'Three Column Layout',
        landingpage: 'Landing Page Template',
      },
      s = document.createElement('div');
    s.classList.add('menu'),
      Object.entries({
        Basic: [
          'button',
          'header',
          'text',
          'image',
          'container',
          'twoCol',
          'threeCol',
        ],
        Extra: ['landingpage'],
      }).forEach(([e, i]) => {
        const o = document.createElement('div');
        o.classList.add('category');
        const a = document.createElement('h4');
        a.classList.add('categoryHeading'),
          (a.innerHTML = e),
          o.prepend(a),
          i.forEach(e => {
            const s = document.createElement('div');
            s.classList.add('draggable'),
              (s.id = e),
              s.setAttribute('draggable', 'true'),
              s.setAttribute('data-component', e);
            const i = n[e] || `Drag to add ${e}`;
            s.setAttribute('title', i);
            const a = document.createElement('img');
            (a.src = t[e]),
              (a.alt = `${e} icon`),
              s.appendChild(a),
              o.appendChild(s);
          }),
          s.appendChild(o);
      }),
      e.appendChild(s);
  })(),
    b.init(),
    c.init(),
    C.init(),
    y.init();
  const E = document.createElement('header');
  function f(e) {
    e.classList.remove('show'),
      e.classList.add('hide'),
      setTimeout(() => e.remove(), 300);
  }
  E.appendChild(
    (function () {
      const e = document.createElement('nav');
      e.id = 'preview-navbar';
      const t = [
          {
            id: 'preview-desktop',
            icon: 'dist/icons/computer.png',
            title: 'Preview in Desktop',
          },
          {
            id: 'preview-tablet',
            icon: 'dist/icons/tablet.png',
            title: 'Preview in Tablet',
          },
          {
            id: 'preview-mobile',
            icon: 'dist/icons/mobile.png',
            title: 'Preview in Mobile',
          },
          { id: 'undo-btn', icon: 'dist/icons/undo.png', title: 'Undo button' },
          { id: 'redo-btn', icon: 'dist/icons/redo.png', title: 'Redo button' },
        ],
        n = [
          { id: 'view-btn', icon: 'dist/icons/view.png', title: 'View' },
          { id: 'save-btn', icon: 'dist/icons/file.png', title: 'Save Layout' },
          { id: 'reset-btn', icon: 'dist/icons/reset.png', title: 'Reset' },
          {
            id: 'export-html-btn',
            icon: 'dist/icons/code.png',
            title: 'Export HTML',
          },
        ],
        s = document.createElement('div');
      s.classList.add('left-buttons'),
        t.forEach(({ id: e, icon: t, title: n }) => {
          const i = document.createElement('button');
          (i.id = e), i.classList.add('preview-btn'), (i.title = n);
          const o = document.createElement('img');
          (o.src = t),
            (o.alt = `${n}`),
            o.classList.add('nav-icon'),
            i.appendChild(o),
            s.appendChild(i);
        });
      const i = document.createElement('div');
      i.classList.add('center-text'), (i.textContent = 'Page Builder');
      const o = document.createElement('div');
      return (
        o.classList.add('right-buttons'),
        n.forEach(({ id: e, icon: t, title: n }) => {
          const s = document.createElement('button');
          (s.id = e), s.classList.add('preview-btn'), (s.title = n);
          const i = document.createElement('img');
          (i.src = t),
            (i.alt = `${n}`),
            i.classList.add('nav-icon'),
            s.appendChild(i),
            o.appendChild(s);
        }),
        e.appendChild(s),
        e.appendChild(i),
        e.appendChild(o),
        e
      );
    })()
  ),
    document.body.insertBefore(E, document.getElementById('app')),
    null === (e = document.getElementById('save-btn')) ||
      void 0 === e ||
      e.addEventListener('click', () => {
        const e = b.getState();
        g.save(e), u('Saving progress...');
      }),
    null === (t = document.getElementById('reset-btn')) ||
      void 0 === t ||
      t.addEventListener('click', () => {
        !(function (e, t, n) {
          const s = document.getElementById('dialog'),
            i = document.getElementById('dialog-yes'),
            o = document.getElementById('dialog-no'),
            a = document.getElementById('dialog-message');
          a && (a.innerHTML = e),
            null == s || s.classList.remove('hidden'),
            null == i ||
              i.addEventListener('click', () => {
                t(), null == s || s.classList.add('hidden');
              }),
            null == o ||
              o.addEventListener('click', () => {
                n(), null == s || s.classList.add('hidden');
              });
        })(
          'Are you sure you want to reset the layout?',
          () => {
            g.remove(),
              b.clearCanvas(),
              u('The saved layout has been successfully reset.');
          },
          () => {
            console.log('Layout reset canceled.');
          }
        );
      }),
    null === (n = document.getElementById('export-html-btn')) ||
      void 0 === n ||
      n.addEventListener('click', () => {
        const e = new h(new b()),
          t = e.generateHTML(),
          n = e.generateCSS();
        console.log('this is html', t);
        const s = (function (e) {
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
          i = (function (e) {
            return e
              .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="property">$1</span>')
              .replace(/(:\s*[^;]+;)/g, '<span class="value">$1</span>')
              .replace(/({|})/g, '<span class="bracket">$1</span>');
          })(n),
          o = document.createElement('div');
        (o.id = 'export-dialog'), o.classList.add('modal');
        const a = document.createElement('div');
        a.classList.add('modal-content');
        const r = document.createElement('button');
        (r.textContent = '×'),
          r.classList.add('close-btn'),
          r.addEventListener('click', () => {
            f(o);
          }),
          a.appendChild(r);
        const l = document.createElement('div');
        l.classList.add('modal-section');
        const d = document.createElement('h2');
        d.textContent = 'HTML';
        const c = document.createElement('div');
        c.classList.add('code-block'),
          c.setAttribute('contenteditable', 'true'),
          (c.innerHTML = s),
          l.appendChild(d),
          l.appendChild(c);
        const m = document.createElement('div');
        m.classList.add('modal-section');
        const p = document.createElement('h2');
        p.textContent = 'CSS';
        const u = document.createElement('div');
        u.classList.add('code-block'),
          u.setAttribute('contenteditable', 'true'),
          (u.innerHTML = i),
          m.appendChild(p),
          m.appendChild(u);
        const g = document.createElement('div');
        g.classList.add('button-wrapper');
        const y = document.createElement('button');
        (y.textContent = 'Export to ZIP'),
          y.classList.add('export-btn'),
          y.addEventListener('click', () => {
            const e = w([
                { name: 'index.html', content: t },
                { name: 'styles.css', content: n },
              ]),
              s = document.createElement('a');
            (s.href = URL.createObjectURL(e)),
              (s.download = 'exported-files.zip'),
              s.click(),
              URL.revokeObjectURL(s.href);
          }),
          a.appendChild(l),
          a.appendChild(m),
          a.appendChild(y),
          g.appendChild(a),
          o.appendChild(g),
          document.body.appendChild(o),
          o.classList.add('show'),
          o.addEventListener('click', e => {
            e.target === o && f(o);
          }),
          document.addEventListener('keydown', e => {
            'Escape' === e.key && f(o);
          });
      }),
    null === (s = document.getElementById('view-btn')) ||
      void 0 === s ||
      s.addEventListener('click', () => {
        const e = p.generateHTML(),
          t = document.createElement('div');
        (t.id = 'preview-modal'),
          (t.style.cssText =
            '\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    background: #f5f5f5;\n    z-index: 1000;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    justify-content: flex-start;\n    padding: 10px;\n  ');
        const n = document.createElement('iframe');
        (n.id = 'preview-iframe'),
          (n.style.cssText =
            '\n    width: 97%;\n    height: 90%;\n    border: none;\n    background: #fff;\n    margin-right: 20px;\n  '),
          (n.srcdoc = e),
          t.appendChild(n);
        const s = document.createElement('button');
        (s.id = 'close-modal-btn'),
          (s.textContent = '✕'),
          (s.style.cssText =
            '\n    position: absolute;\n    top: 10px;\n    right: 20px;\n    font-size: 20px;\n    border: none;\n    background: none;\n    cursor: pointer;\n  '),
          t.appendChild(s);
        const i = document.createElement('div');
        i.style.cssText =
          '\n    display: flex;\n    gap: 10px;\n    margin-bottom: 10px;\n  ';
        [
          {
            icon: 'dist/icons/mobile.png',
            title: 'Desktop',
            width: '375px',
            height: '90%',
          },
          {
            icon: 'dist/icons/tablet.png',
            title: 'Tablet',
            width: '768px',
            height: '90%',
          },
          {
            icon: 'dist/icons/computer.png',
            title: 'Mobile',
            width: '97%',
            height: '90%',
          },
        ].forEach(e => {
          const t = document.createElement('button');
          (t.style.cssText =
            '\n      padding: 5px;\n      border: none;\n      background: none;\n      cursor: pointer;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    '),
            (t.title = e.title);
          const s = document.createElement('img');
          (s.src = e.icon),
            (s.alt = 'Device Icon'),
            (s.style.cssText =
              '\n      width: 24px;\n      height: 24px;\n    '),
            t.appendChild(s),
            t.addEventListener('click', () => {
              (n.style.width = e.width), (n.style.height = e.height);
            }),
            i.appendChild(t);
        }),
          t.insertBefore(i, n),
          document.body.appendChild(t);
        const o = () => {
          setTimeout(() => t.remove(), 300),
            document.removeEventListener('keydown', a);
        };
        s.addEventListener('click', o);
        const a = e => {
          'Escape' === e.key && o();
        };
        document.addEventListener('keydown', a);
      }),
    null === (i = document.getElementById('preview-desktop')) ||
      void 0 === i ||
      i.addEventListener('click', () => {
        v.setPreviewMode('desktop');
      }),
    null === (o = document.getElementById('preview-tablet')) ||
      void 0 === o ||
      o.addEventListener('click', () => {
        v.setPreviewMode('tablet');
      }),
    null === (a = document.getElementById('preview-mobile')) ||
      void 0 === a ||
      a.addEventListener('click', () => {
        v.setPreviewMode('mobile');
      }),
    null === (r = document.getElementById('undo-btn')) ||
      void 0 === r ||
      r.addEventListener('click', () => {
        b.historyManager.undo();
      }),
    null === (l = document.getElementById('redo-btn')) ||
      void 0 === l ||
      l.addEventListener('click', () => {
        b.historyManager.redo();
      });
});

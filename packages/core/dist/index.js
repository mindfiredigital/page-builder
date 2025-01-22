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
      l.addEventListener('click', () => o.click());
    const a = document.createElement('img'),
      r = `${s}-img`;
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
      t.appendChild(i),
      t.appendChild(o),
      t.appendChild(l),
      t.appendChild(a),
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
  create(e = null) {
    const t = document.createElement('div');
    t.classList.add('video-container');
    const n = document.createElement('input');
    (n.type = 'file'),
      (n.accept = 'video/*'),
      (n.style.display = 'none'),
      n.addEventListener('change', e => this.handleFileChange(e, t));
    const s = document.createElement('div');
    s.classList.add('upload-text'), (s.innerText = e ? '' : 'Upload Video');
    const i = document.createElement('video');
    (i.controls = !0),
      (i.style.width = '100%'),
      (i.style.height = '100%'),
      (i.style.display = e ? 'block' : 'none'),
      e && (i.src = e);
    const o = document.createElement('button');
    return (
      (o.innerHTML = '🖊️'),
      o.classList.add('pencil-button'),
      o.addEventListener('click', () => n.click()),
      t.appendChild(s),
      t.appendChild(n),
      t.appendChild(i),
      t.appendChild(o),
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
class i {
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
class o {
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
    const l = l => {
        if (!t) return;
        const a = l.clientX - n,
          r = l.clientY - s;
        e.style.transform = `translate(${i + a}px, ${o + r}px)`;
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
        (s = r.clientY);
      const d = e.getBoundingClientRect();
      (i = d.left),
        (o = d.top),
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
    const s = b.createComponent(n);
    if (!s) return;
    const i = this.element.classList[2],
      o = b.generateUniqueClass(n, !0, i);
    s.classList.add(o);
    const l = document.createElement('span');
    (l.className = 'component-label'),
      (l.textContent = o),
      (s.id = o),
      (l.style.display = 'none'),
      s.appendChild(l),
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
    const s = new l();
    (s.element = e), (s.resizers = n), s.addResizeHandles(), e.appendChild(n);
  }
  static restoreContainer(e) {
    l.restoreResizer(e);
    const t = new l();
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
      let l = s.querySelector('.component-label');
      l ||
        ((l = document.createElement('span')),
        (l.className = 'component-label'),
        s.appendChild(l)),
        (l.textContent = o),
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
class d extends a {
  constructor() {
    super(3, 'threeCol-component');
  }
}
class c {
  constructor() {
    (this.link = null), (this.isEditing = !1);
  }
  create(e = '#', t = 'Click Here') {
    const n = document.createElement('div');
    n.classList.add('link-component-container'),
      (this.link = document.createElement('a')),
      (this.link.href = e),
      (this.link.innerText = t),
      this.link.classList.add('link-component');
    const s = document.createElement('button');
    (s.innerText = 'Edit'), s.classList.add('edit-button');
    const i = document.createElement('div');
    i.classList.add('edit-form');
    const o = document.createElement('input');
    (o.type = 'url'), (o.value = e), (o.placeholder = 'Enter URL');
    const l = document.createElement('input');
    (l.type = 'text'), (l.value = t), (l.placeholder = 'Enter Label');
    const a = document.createElement('input');
    a.type = 'checkbox';
    const r = document.createElement('label');
    (r.innerText = 'Open in new tab'), r.appendChild(a);
    const d = document.createElement('button');
    return (
      (d.innerText = 'Save'),
      i.appendChild(o),
      i.appendChild(l),
      i.appendChild(r),
      i.appendChild(d),
      s.addEventListener('click', e => {
        e.preventDefault(),
          (this.isEditing = !0),
          this.link && (this.link.style.display = 'none'),
          (s.style.display = 'none'),
          (i.style.display = 'flex');
      }),
      d.addEventListener('click', e => {
        e.preventDefault(),
          (this.isEditing = !1),
          this.link &&
            ((this.link.href = o.value),
            (this.link.innerText = l.value),
            (this.link.style.display = 'inline'),
            (this.link.target = a.checked ? '_blank' : '_self')),
          (s.style.display = 'inline-flex'),
          (i.style.display = 'none');
      }),
      n.appendChild(this.link),
      n.appendChild(s),
      n.appendChild(i),
      n
    );
  }
  getLinkData() {
    var e, t;
    return {
      href: (null === (e = this.link) || void 0 === e ? void 0 : e.href) || '#',
      label:
        (null === (t = this.link) || void 0 === t ? void 0 : t.innerText) ||
        'Click Here',
    };
  }
  updateLink(e, t, n = '_self') {
    this.link &&
      ((this.link.href = e), (this.link.innerText = t), (this.link.target = n));
  }
  isInEditMode() {
    return this.isEditing;
  }
}
class p {
  create() {
    const e = e => {
        let t,
          n,
          s,
          i,
          o = !1,
          l = !1,
          a = 0,
          r = 0;
        (e.style.position = 'relative'),
          (e.style.cursor = 'move'),
          e.addEventListener('mousedown', s => {
            l ||
              ((o = !0),
              (t = s.clientX),
              (n = s.clientY),
              (a = parseFloat(e.getAttribute('data-x') || '0')),
              (r = parseFloat(e.getAttribute('data-y') || '0')),
              document.addEventListener('mousemove', d),
              document.addEventListener('mouseup', c));
          });
        const d = s => {
            if (o) {
              const i = s.clientX - t,
                o = s.clientY - n,
                l = a + i,
                d = r + o;
              (e.style.transform = `translate(${l}px, ${d}px)`),
                e.setAttribute('data-x', l.toString()),
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
                (l = !0),
                (s = e.offsetWidth),
                (i = e.offsetHeight),
                (t = o.clientX),
                (n = o.clientY),
                document.addEventListener('mousemove', a),
                document.addEventListener('mouseup', r);
            });
          const a = o => {
              if (l) {
                const l = s + (o.clientX - t),
                  a = i + (o.clientY - n);
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
    const s = new l().create();
    s.classList.add('container'),
      Object.assign(s.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        width: '100%',
      }),
      e(s);
    const o = new t('MyBrand').create();
    Object.assign(o.style, {
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
      s.appendChild(o),
      s.appendChild(a);
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
    const p = new i().create();
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
    const h = new l().create();
    h.classList.add('container'),
      Object.assign(h.style, {
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
      }),
      e(h);
    const m = new t('© 2025 MyBrand. All rights reserved.').create();
    return (
      Object.assign(m.style, { fontSize: '14px', color: '#999' }),
      h.appendChild(m),
      n.appendChild(s),
      n.appendChild(r),
      n.appendChild(h),
      n
    );
  }
}
class h {
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
class u {
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
        const l = this.generateUniqueSelector(e);
        s.length > 0 &&
          n.push(`\n        ${l} {\n          ${s.join('\n  ')}\n        }`);
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
class v {
  constructor(e = '#layers-view', t = '#page') {
    this.initializeElements(e, t);
  }
  initializeElements(e, t) {
    (v.layersView = document.querySelector(e)),
      v.layersView ||
        ((v.layersView = document.createElement('div')),
        (v.layersView.id = 'layers-view'),
        (v.layersView.className = 'layers-view'),
        document.body.appendChild(v.layersView),
        console.warn(`Layers view element created: ${e}`)),
      (v.canvasRoot = document.querySelector(t)),
      v.canvasRoot ||
        (console.error(`Canvas root element not found: ${t}`),
        (v.canvasRoot = document.body));
  }
  static buildLayerHierarchyFromDOM(e) {
    const t = new y(new b()).generateHTML(),
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
(v.layersView = null), (v.canvasRoot = null), (v.draggedItem = null);
class w {
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
    (this.layersViewController = new v()),
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
      v.updateLayersView();
  }
  static updateLayersView() {
    v.updateLayersView();
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
    const l = 'canvas' === e.toLowerCase();
    (this.sidebarElement.style.display = 'block'),
      (this.controlsContainer.innerHTML = ''),
      (this.componentNameHeader.textContent = `Component: ${e}`);
    const a = getComputedStyle(o);
    this.createSelectControl('Display', 'display', a.display || 'block', [
      'block',
      'inline',
      'inline-block',
      'flex',
      'grid',
      'none',
    ]),
      l ||
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
          parseInt(a.margin) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        ),
        this.createControl(
          'Padding',
          'padding',
          'number',
          parseInt(a.padding) || 0,
          { min: 0, max: 1e3, unit: 'px' }
        )),
      this.createControl('Color', 'color', 'color', a.backgroundColor),
      this.createSelectControl('Text Alignment', 'alignment', a.textAlign, [
        'left',
        'center',
        'right',
      ]),
      this.createSelectControl('Font Family', 'font-family', a.fontFamily, [
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
        parseInt(a.fontSize) || 16,
        { min: 0, max: 100, unit: 'px' }
      ),
      this.createControl(
        'Text Color',
        'text-color',
        'color',
        a.color || '#000000'
      ),
      this.createControl(
        'Border Width',
        'border-width',
        'number',
        parseInt(a.borderWidth) || 0,
        { min: 0, max: 20, unit: 'px' }
      ),
      this.createSelectControl(
        'Border Style',
        'border-style',
        a.borderStyle || 'none',
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
        a.borderColor || '#000000'
      );
    const r = w.rgbToHex(a.backgroundColor),
      d = document.getElementById('color');
    d && (d.value = r), this.addListeners(o);
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
      const l = i.unit;
      o.innerHTML = `\n                  <label for="${t}">${e}:</label>\n                  <input type="${n}" id="${t}" value="${s}">\n                  <select id="${t}-unit">\n                      <option value="px" ${'px' === l ? 'selected' : ''}>px</option>\n                      <option value="rem" ${'rem' === l ? 'selected' : ''}>rem</option>\n                      <option value="vh" ${'vh' === l ? 'selected' : ''}>vh</option>\n                      <option value="%" ${'%' === l ? 'selected' : ''}>%</option>\n                  </select>\n              `;
    } else
      o.innerHTML = `\n          <label for="${t}">${e}:</label>\n          <input type="color" id="${t}" value="${s}">\n          <input type="text" id="color-value" style="font-size: 0.8rem; width: 80px; margin-left: 8px;" value="${s}">\n        `;
    const l = o.querySelector('input'),
      a = o.querySelector(`#${t}-unit`);
    l &&
      Object.keys(i).forEach(e => {
        l.setAttribute(e, i[e].toString());
      });
    const r = o.querySelector('input[type="color"]'),
      d = o.querySelector('#color-value');
    r &&
      r.addEventListener('input', () => {
        d && (d.value = r.value);
      }),
      d &&
        d.addEventListener('input', () => {
          r && (r.value = d.value);
        }),
      this.controlsContainer.appendChild(o),
      a &&
        a.addEventListener('change', () => {
          const e = a.value,
            t = parseInt(l.value);
          l.value = `${t}${e}`;
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
    var t, n, s, i, o, l, a, r, d, c, p, h, m;
    const u = {
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
    if (!u) return;
    const g = (function (e, t) {
      let n = null;
      return (...s) => {
        n && clearTimeout(n), (n = setTimeout(() => e(...s), t));
      };
    })(() => {
      b.historyManager.captureState();
    }, 300);
    null === (t = u.width) ||
      void 0 === t ||
      t.addEventListener('input', () => {
        const t = document.getElementById('width-unit').value;
        (e.style.width = `${u.width.value}${t}`), g();
      }),
      null === (n = u.height) ||
        void 0 === n ||
        n.addEventListener('input', () => {
          const t = document.getElementById('height-unit').value;
          (e.style.height = `${u.height.value}${t}`), g();
        }),
      null === (s = u.color) ||
        void 0 === s ||
        s.addEventListener('input', () => {
          e.style.backgroundColor = u.color.value;
          const t = document.querySelector('#color-value');
          t && (t.textContent = u.color.value), g();
        }),
      null === (i = u.margin) ||
        void 0 === i ||
        i.addEventListener('input', () => {
          const t = document.getElementById('margin-unit').value;
          (e.style.margin = `${u.margin.value}${t}`), g();
        }),
      null === (o = u.padding) ||
        void 0 === o ||
        o.addEventListener('input', () => {
          const t = document.getElementById('padding-unit').value;
          (e.style.padding = `${u.padding.value}${t}`), g();
        }),
      null === (l = u.alignment) ||
        void 0 === l ||
        l.addEventListener('change', () => {
          (e.style.textAlign = u.alignment.value), g();
        }),
      null === (a = u.fontSize) ||
        void 0 === a ||
        a.addEventListener('input', () => {
          const t = document.getElementById('font-size-unit').value;
          (e.style.fontSize = `${u.fontSize.value}${t}`), g();
        }),
      null === (r = u.textColor) ||
        void 0 === r ||
        r.addEventListener('input', () => {
          (e.style.color = u.textColor.value), g();
        }),
      null === (d = u.borderWidth) ||
        void 0 === d ||
        d.addEventListener('input', () => {
          const t = document.getElementById('border-width-unit').value;
          (e.style.borderWidth = `${u.borderWidth.value}${t}`), g();
        }),
      null === (c = u.borderStyle) ||
        void 0 === c ||
        c.addEventListener('change', () => {
          (e.style.borderStyle = u.borderStyle.value), g();
        }),
      null === (p = u.borderColor) ||
        void 0 === p ||
        p.addEventListener('input', () => {
          (e.style.borderColor = u.borderColor.value), g();
        }),
      null === (h = u.display) ||
        void 0 === h ||
        h.addEventListener('change', () => {
          (e.style.display = u.display.value), g();
        }),
      null === (m = u.fontFamily) ||
        void 0 === m ||
        m.addEventListener('change', () => {
          (e.style.fontFamily = u.fontFamily.value), g();
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
          t && w.showSidebar(t.id);
      }),
      (b.canvasElement.style.position = 'relative'),
      (b.historyManager = new h(b.canvasElement)),
      (b.jsonStorage = new m()),
      (b.controlsManager = new u(b)),
      (b.gridManager = new f()),
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
          t.classList.contains('container-component') && l.restoreContainer(t),
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
      const l = document.createElement('span');
      (l.className = 'component-label'),
        (l.textContent = t),
        o.appendChild(l),
        b.components.push(o),
        b.canvasElement.appendChild(o),
        b.addDraggableListeners(o),
        w.updateLayersView(),
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
        w.updateLayersView();
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
        const l = b.canvasElement.getBoundingClientRect(),
          a = e.getBoundingClientRect();
        (t = o.clientX),
          (n = o.clientY),
          (s = a.left - l.left),
          (i = a.top - l.top),
          (o.dataTransfer.effectAllowed = 'move'),
          (e.style.cursor = 'grabbing');
      }
    }),
      e.addEventListener('dragend', o => {
        o.preventDefault();
        const l = o.clientX - t,
          a = o.clientY - n;
        let r = s + l,
          d = i + a;
        const c = b.canvasElement.offsetWidth - e.offsetWidth,
          p = b.canvasElement.offsetHeight - e.offsetHeight;
        (r = Math.max(0, Math.min(r, c))),
          (d = Math.max(0, Math.min(d, p))),
          (e.style.left = `${r}px`),
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
    button: () => new i().create(),
    header: () => new o().create(),
    image: () => new n().create(),
    video: () => new s().create(),
    text: () => new t().create(),
    container: () => new l().create(),
    twoCol: () => new r().create(),
    threeCol: () => new d().create(),
    landingpage: () => new p().create(),
    link: () => new c().create(),
  });
const C = document.getElementById('canvas'),
  E = new (class {
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
C &&
  C.addEventListener('click', e => {
    const t = e.target;
    t !== C && E.selectElement(t);
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
const x = {
  desktop:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path fill-rule="evenodd" clip-rule="evenodd" d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z" fill="#000000"/>\n                </svg>',
  tablet:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M19 12V11.988M4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>',
  mobile:
    '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M22.461 5H9.539a1.6 1.6 0 0 0-1.601 1.603V25.4A1.6 1.6 0 0 0 9.539 27h12.922c.885 0 1.602-.718 1.602-1.602V6.603A1.603 1.603 0 0 0 22.461 5zm-6.46 20.418a1.022 1.022 0 1 1 1.021-1.021c-.001.634-.46 1.021-1.021 1.021zm6.862-3.501H9.138V7.704h13.725v14.213z"/></svg>',
  save: '<svg fill="#000000" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M790.706 338.824v112.94H395.412c-31.06 0-56.47 25.3-56.47 56.471v744.509c17.73-6.325 36.592-10.391 56.47-10.391h1129.412c19.877 0 38.738 4.066 56.47 10.39V508.236c0-31.171-25.412-56.47-56.47-56.47h-395.295V338.824h395.295c93.402 0 169.411 76.009 169.411 169.411v1242.353c0 93.403-76.01 169.412-169.411 169.412H395.412C302.009 1920 226 1843.99 226 1750.588V508.235c0-93.402 76.01-169.411 169.412-169.411h395.294Zm734.118 1016.47H395.412c-31.06 0-56.47 25.299-56.47 56.47v338.824c0 31.172 25.41 56.47 56.47 56.47h1129.412c31.058 0 56.47-25.298 56.47-56.47v-338.823c0-31.172-25.412-56.47-56.47-56.47ZM1016.622-.023v880.151l246.212-246.325 79.85 79.85-382.532 382.644-382.645-382.644 79.85-79.85L903.68 880.128V-.022h112.941ZM564.824 1468.235c-62.344 0-112.942 50.71-112.942 112.941s50.598 112.942 112.942 112.942c62.343 0 112.94-50.71 112.94-112.942 0-62.23-50.597-112.94-112.94-112.94Z" fill-rule="evenodd"/>\n                </svg>',
  code: '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M14.1809 4.2755C14.581 4.3827 14.8185 4.79396 14.7113 5.19406L10.7377 20.0238C10.6304 20.4239 10.2192 20.6613 9.81909 20.5541C9.41899 20.4469 9.18156 20.0356 9.28876 19.6355L13.2624 4.80583C13.3696 4.40573 13.7808 4.16829 14.1809 4.2755Z" fill="#1C274C"/>\n            <path d="M16.4425 7.32781C16.7196 7.01993 17.1938 6.99497 17.5017 7.27206L19.2392 8.8358C19.9756 9.49847 20.5864 10.0482 21.0058 10.5467C21.4468 11.071 21.7603 11.6342 21.7603 12.3295C21.7603 13.0248 21.4468 13.5881 21.0058 14.1123C20.5864 14.6109 19.9756 15.1606 19.2392 15.8233L17.5017 17.387C17.1938 17.6641 16.7196 17.6391 16.4425 17.3313C16.1654 17.0234 16.1904 16.5492 16.4983 16.2721L18.1947 14.7452C18.9826 14.0362 19.5138 13.5558 19.8579 13.1467C20.1882 12.7541 20.2603 12.525 20.2603 12.3295C20.2603 12.1341 20.1882 11.9049 19.8579 11.5123C19.5138 11.1033 18.9826 10.6229 18.1947 9.91383L16.4983 8.387C16.1904 8.10991 16.1654 7.63569 16.4425 7.32781Z" fill="#1C274C"/>\n            <path d="M7.50178 8.387C7.80966 8.10991 7.83462 7.63569 7.55752 7.32781C7.28043 7.01993 6.80621 6.99497 6.49833 7.27206L4.76084 8.8358C4.0245 9.49847 3.41369 10.0482 2.99428 10.5467C2.55325 11.071 2.23975 11.6342 2.23975 12.3295C2.23975 13.0248 2.55325 13.5881 2.99428 14.1123C3.41369 14.6109 4.02449 15.1606 4.76082 15.8232L6.49833 17.387C6.80621 17.6641 7.28043 17.6391 7.55752 17.3313C7.83462 17.0234 7.80966 16.5492 7.50178 16.2721L5.80531 14.7452C5.01743 14.0362 4.48623 13.5558 4.14213 13.1467C3.81188 12.7541 3.73975 12.525 3.73975 12.3295C3.73975 12.1341 3.81188 11.9049 4.14213 11.5123C4.48623 11.1033 5.01743 10.6229 5.80531 9.91383L7.50178 8.387Z" fill="#1C274C"/>\n            </svg>',
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
  landing:
    '<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" \n           viewBox="0 0 32 32" xml:space="preserve">\n            <style type="text/css">\n                .st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}\n                .st1{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}\n                .st2{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:5.2066,0;}\n            </style>\n            <line class="st0" x1="3" y1="11" x2="29" y2="11"/>\n            <line class="st0" x1="7" y1="8" x2="7" y2="8"/>\n            <line class="st0" x1="10" y1="8" x2="10" y2="8"/>\n            <line class="st0" x1="13" y1="8" x2="13" y2="8"/>\n            <rect x="3" y="5" class="st0" width="26" height="22"/>\n            <rect x="6" y="14" class="st0" width="10" height="10"/>\n            <rect x="19" y="21" class="st0" width="7" height="3"/>\n            <line class="st0" x1="20" y1="15" x2="26" y2="15"/>\n            <line class="st0" x1="23" y1="18" x2="26" y2="18"/>\n            <polyline class="st0" points="6,22 12,19 16,22 "/>\n            <line class="st0" x1="9" y1="17" x2="9" y2="17"/>\n            </svg>',
  delete:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>',
  close:
    '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z" fill="#0F0F0F"/>\n                </svg>',
};
function k(e) {
  const t = e => new TextEncoder().encode(e),
    n = [];
  let s = 0;
  const i = [];
  e.forEach(e => {
    const o = t(e.name),
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
      })(o, l, a);
    n.push(r), n.push(l);
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
    })(o, l, a, s);
    i.push(d), (s += r.length + l.length);
  }),
    n.push(...i);
  const o = i.reduce((e, t) => e + t.length, 0),
    l = ((e, t, n) => {
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
  n.push(l);
  const a = new Uint8Array(n.reduce((e, t) => e.concat(Array.from(t)), []));
  return new Blob([a], { type: 'application/zip' });
}
class M {
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
class S {
  setPreviewMode(e) {
    const t = document.getElementById('canvas');
    t.classList.forEach(e => {
      e.startsWith('preview-') && t.classList.remove(e);
    }),
      t.classList.add(`preview-${e}`);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  var e, t, n, s, i, o, l, a, r;
  const d = new b(),
    c = new L(d),
    p = new y(d),
    h = new m(),
    u = new S();
  !(function () {
    const e = document.getElementById('sidebar'),
      t = {
        button: x.button,
        header: x.header,
        image: x.image,
        video: x.video,
        text: x.text,
        container: x.container,
        twoCol: x.twocol,
        threeCol: x.threecol,
        landingpage: x.landing,
        link: x.hyperlink,
      },
      n = {
        button: 'Button',
        header: 'Header',
        image: 'Image',
        video: 'Link Video',
        text: 'Text',
        container: 'Container',
        twoCol: 'Two Column Layout',
        threeCol: 'Three Column Layout',
        landingpage: 'Landing Page Template',
        link: 'Link',
      },
      s = document.createElement('div');
    s.classList.add('menu'),
      Object.entries({
        Basic: [
          'button',
          'header',
          'text',
          'image',
          'video',
          'container',
          'twoCol',
          'threeCol',
          'link',
        ],
        Extra: ['landingpage'],
      }).forEach(([e, i]) => {
        const o = document.createElement('div');
        o.classList.add('category');
        const l = document.createElement('h4');
        l.classList.add('categoryHeading'),
          (l.innerHTML = e),
          o.prepend(l),
          i.forEach(e => {
            const s = document.createElement('div');
            s.classList.add('draggable'),
              (s.id = e),
              s.setAttribute('draggable', 'true'),
              s.setAttribute('data-component', e);
            const i = n[e] || `Drag to add ${e}`;
            if ((s.setAttribute('title', i), t[e])) {
              s.innerHTML = t[e];
              const n = s.querySelector('svg');
              n && n.classList.add('component-icon');
            } else console.warn(`Icon not found for component: ${e}`);
            o.appendChild(s);
          }),
          s.appendChild(o);
      }),
      e.appendChild(s);
  })(),
    b.init(),
    c.init(),
    M.init(),
    w.init();
  const v = document.createElement('header');
  function f(e) {
    e.classList.remove('show'),
      e.classList.add('hide'),
      setTimeout(() => e.remove(), 300);
  }
  v.appendChild(
    (function () {
      const e = document.createElement('nav');
      e.id = 'preview-navbar';
      const t = {
          desktop: x.desktop,
          tablet: x.tablet,
          mobile: x.mobile,
          save: x.save,
          export: x.code,
          view: x.view,
          undo: x.undo,
          redo: x.redo,
          reset: x.reset,
        },
        n = [
          {
            id: 'preview-desktop',
            icon: t.desktop,
            title: 'Preview in Desktop',
          },
          { id: 'preview-tablet', icon: t.tablet, title: 'Preview in Tablet' },
          { id: 'preview-mobile', icon: t.mobile, title: 'Preview in Mobile' },
          { id: 'undo-btn', icon: t.undo, title: 'Undo button' },
          { id: 'redo-btn', icon: t.redo, title: 'Redo button' },
        ],
        s = [
          { id: 'view-btn', icon: t.view, title: 'View' },
          { id: 'save-btn', icon: t.save, title: 'Save Layout' },
          { id: 'reset-btn', icon: t.reset, title: 'Reset' },
          { id: 'export-html-btn', icon: t.export, title: 'Export HTML' },
        ],
        i = document.createElement('div');
      i.classList.add('left-buttons'),
        n.forEach(({ id: e, icon: t, title: n }) => {
          const s = document.createElement('button');
          (s.id = e),
            s.classList.add('preview-btn'),
            (s.title = n),
            (s.innerHTML = t);
          const o = s.querySelector('svg');
          o && o.classList.add('nav-icon'), i.appendChild(s);
        });
      const o = document.createElement('div');
      o.classList.add('center-text'), (o.textContent = 'Page Builder');
      const l = document.createElement('div');
      return (
        l.classList.add('right-buttons'),
        s.forEach(({ id: e, icon: t, title: n }) => {
          const s = document.createElement('button');
          (s.id = e),
            s.classList.add('preview-btn'),
            (s.title = n),
            (s.innerHTML = t);
          const i = s.querySelector('svg');
          i && i.classList.add('nav-icon'), l.appendChild(s);
        }),
        e.appendChild(i),
        e.appendChild(o),
        e.appendChild(l),
        e
      );
    })()
  ),
    document.body.insertBefore(v, document.getElementById('app')),
    null === (e = document.getElementById('save-btn')) ||
      void 0 === e ||
      e.addEventListener('click', () => {
        const e = b.getState();
        h.save(e), g('Saving progress...');
      }),
    null === (t = document.getElementById('reset-btn')) ||
      void 0 === t ||
      t.addEventListener('click', () => {
        !(function (e, t, n) {
          const s = document.getElementById('dialog'),
            i = document.getElementById('dialog-yes'),
            o = document.getElementById('dialog-no'),
            l = document.getElementById('dialog-message');
          l && (l.innerHTML = e),
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
            h.remove(),
              b.clearCanvas(),
              g('The saved layout has been successfully reset.');
          },
          () => {
            console.log('Layout reset canceled.');
          }
        );
      }),
    null === (n = document.getElementById('export-html-btn')) ||
      void 0 === n ||
      n.addEventListener('click', () => {
        const e = new y(new b()),
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
        const l = document.createElement('div');
        l.classList.add('modal-content');
        const a = document.createElement('button');
        (a.textContent = '×'),
          a.classList.add('close-btn'),
          a.addEventListener('click', () => {
            f(o);
          }),
          l.appendChild(a);
        const r = document.createElement('div');
        r.classList.add('modal-section');
        const d = document.createElement('h2');
        d.textContent = 'HTML';
        const c = document.createElement('div');
        c.classList.add('code-block'),
          c.setAttribute('contenteditable', 'true'),
          (c.innerHTML = s),
          r.appendChild(d),
          r.appendChild(c);
        const p = document.createElement('div');
        p.classList.add('modal-section');
        const h = document.createElement('h2');
        h.textContent = 'CSS';
        const m = document.createElement('div');
        m.classList.add('code-block'),
          m.setAttribute('contenteditable', 'true'),
          (m.innerHTML = i),
          p.appendChild(h),
          p.appendChild(m);
        const u = document.createElement('div');
        u.classList.add('button-wrapper');
        const g = document.createElement('button');
        (g.textContent = 'Export to ZIP'),
          g.classList.add('export-btn'),
          g.addEventListener('click', () => {
            const e = k([
                { name: 'index.html', content: t },
                { name: 'styles.css', content: n },
              ]),
              s = document.createElement('a');
            (s.href = URL.createObjectURL(e)),
              (s.download = 'exported-files.zip'),
              s.click(),
              URL.revokeObjectURL(s.href);
          }),
          l.appendChild(r),
          l.appendChild(p),
          l.appendChild(g),
          u.appendChild(l),
          o.appendChild(u),
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
          { icon: x.mobile, title: 'Desktop', width: '375px', height: '90%' },
          { icon: x.tablet, title: 'Tablet', width: '768px', height: '90%' },
          { icon: x.desktop, title: 'Mobile', width: '97%', height: '90%' },
        ].forEach(e => {
          const t = document.createElement('button');
          (t.style.cssText =
            '\n        padding: 5px;\n        border: none;\n        background: none;\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n      '),
            (t.title = e.title);
          const s = document.createElement('div');
          s.innerHTML = e.icon;
          const o = s.querySelector('svg');
          o &&
            ((o.style.width = '24px'),
            (o.style.height = '24px'),
            o.classList.add('component-icon')),
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
            document.removeEventListener('keydown', l);
        };
        s.addEventListener('click', o);
        const l = e => {
          'Escape' === e.key && o();
        };
        document.addEventListener('keydown', l);
      }),
    null === (i = document.getElementById('preview-desktop')) ||
      void 0 === i ||
      i.addEventListener('click', () => {
        u.setPreviewMode('desktop');
      }),
    null === (o = document.getElementById('preview-tablet')) ||
      void 0 === o ||
      o.addEventListener('click', () => {
        u.setPreviewMode('tablet');
      }),
    null === (l = document.getElementById('preview-mobile')) ||
      void 0 === l ||
      l.addEventListener('click', () => {
        u.setPreviewMode('mobile');
      }),
    null === (a = document.getElementById('undo-btn')) ||
      void 0 === a ||
      a.addEventListener('click', () => {
        b.historyManager.undo();
      }),
    null === (r = document.getElementById('redo-btn')) ||
      void 0 === r ||
      r.addEventListener('click', () => {
        b.historyManager.redo();
      });
});

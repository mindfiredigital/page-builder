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
function t(e, t, n, o) {
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
class n {
  constructor() {
    var e, t;
    (this.resolvePromise = null), (this.attributes = []);
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
        (t.className = 'form-field'), t.setAttribute('data-attr-key', e.key);
        const n = document.createElement('div');
        (n.className = 'form-field-header'),
          n.setAttribute('data-attr-id', e.id),
          t.addEventListener('click', () => {
            this.contentContainer.querySelectorAll('.form-field').forEach(e => {
              e.classList.remove('selected');
            }),
              t.classList.add('selected');
          });
        const o = document.createElement('button');
        (o.className = 'expand-button'),
          (o.type = 'button'),
          (o.innerHTML =
            '\n        <svg class="expand-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />\n        </svg>\n      ');
        const s = document.createElement('div');
        s.className = 'title-key-container';
        const i = document.createElement('span');
        (i.className = 'form-title'), (i.textContent = e.title);
        const l = document.createElement('span');
        (l.className = 'form-key'),
          (l.textContent = `(${e.key})`),
          s.appendChild(i),
          s.appendChild(l),
          n.appendChild(o),
          n.appendChild(s);
        const a = document.createElement('div');
        a.className = 'form-value-container form-value-collapsed';
        const r = document.createElement('label');
        let d;
        (r.className = 'form-label'),
          (r.textContent = 'Value:'),
          r.setAttribute('for', e.id);
        const c = document.createElement('span');
        (c.id = e.id),
          (c.textContent = e.value ? e.value.toString() : null),
          (c.className = 'form-display-value'),
          (d = c),
          a.appendChild(r),
          a.appendChild(d),
          t.appendChild(n),
          t.appendChild(a),
          this.contentContainer.appendChild(t),
          n.addEventListener('click', () => {
            this.toggleFieldExpansion(e.id);
          });
      });
  }
  toggleFieldExpansion(e) {
    const t = this.modalElement.querySelector(`[data-attr-id="${e}"]`),
      n = null == t ? void 0 : t.nextElementSibling,
      o = null == t ? void 0 : t.querySelector('.expand-icon');
    if (n && o) {
      !n.classList.contains('form-value-collapsed')
        ? (n.classList.add('form-value-collapsed'),
          (o.style.transform = 'rotate(0deg)'))
        : (n.classList.remove('form-value-collapsed'),
          (o.style.transform = 'rotate(90deg)'));
    }
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
    const t = this.contentContainer.querySelector('.form-field.selected'),
      n = {};
    if (t) {
      const e = t.getAttribute('data-attr-key'),
        o = this.attributes.find(t => t.key === e);
      o && (n[o.key] = o.value);
    }
    this.hide(),
      null === (e = this.resolvePromise) || void 0 === e || e.call(this, n),
      this.resetPromise();
  }
  resetPromise() {
    this.resolvePromise = null;
  }
}
class o {
  constructor(e = 'Sample Text') {
    (this.text = e), (this.modalComponent = new n());
  }
  create(e) {
    o.textAttributeConfig = e || [];
    const t = document.createElement('div');
    return (
      (t.innerText = this.text),
      (t.contentEditable = 'true'),
      t.classList.add('text-component'),
      t
    );
  }
  setText(e) {
    this.text = e;
  }
  seedFormulaValues(e) {
    document.querySelectorAll('.text-component').forEach(t => {
      const n = t.querySelector('.component-controls'),
        o = t.getAttribute('data-attribute-key');
      o &&
        e.hasOwnProperty(o) &&
        ((t.textContent = e[o]), (t.style.color = '#000000')),
        n && t.appendChild(n);
    }),
      L.dispatchDesignChange();
  }
  updateInputValues(e) {
    document.querySelectorAll('.text-component').forEach(t => {
      const n = t.querySelector('.component-controls'),
        o = t.getAttribute('data-attribute-key'),
        s = t.getAttribute('data-attribute-type');
      o && e.hasOwnProperty(o) && 'Input' === s && (t.textContent = e[o]),
        n && t.appendChild(n);
    }),
      L.dispatchDesignChange();
  }
  handleTextClick(e) {
    return t(this, void 0, void 0, function* () {
      var t;
      if (
        this.modalComponent &&
        0 !==
          (null === (t = o.textAttributeConfig) || void 0 === t
            ? void 0
            : t.length)
      )
        try {
          const t = yield this.modalComponent.show(o.textAttributeConfig);
          if (t) {
            const n = this.findSelectedAttribute(t);
            n && this.updateTextContent(e, n);
          }
        } catch (e) {
          console.error('Error handling text component click:', e);
        }
      else
        console.warn('Modal component or text attribute config not available');
    });
  }
  findSelectedAttribute(e) {
    for (const t of o.textAttributeConfig)
      if (e.hasOwnProperty(t.key) && void 0 !== e[t.key] && '' !== e[t.key])
        return t;
    return null;
  }
  updateTextContent(e, t) {
    const n = e.querySelector('.component-controls');
    e.setAttribute('data-attribute-key', t.key),
      e.setAttribute('data-attribute-type', t.type),
      'Formula' === t.type
        ? ((e.textContent = `${t.title}`),
          (e.style.fontSize = '10px'),
          (e.style.color = 'rgb(188 191 198)'),
          (e.style.fontWeight = '500'))
        : ('Constant' !== t.type && 'Input' !== t.type) ||
          (e.textContent = `${t.value}`),
      n && e.appendChild(n),
      null == L || L.dispatchDesignChange();
  }
}
o.textAttributeConfig = [];
class s {
  create(e = null, t) {
    s.imageAttributeConfig = t;
    const n = document.createElement('div');
    n.classList.add('image-component');
    const o = `image-container-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    (n.id = o),
      (n.style.width = '300px'),
      (n.style.height = '300px'),
      (n.style.position = 'relative'),
      (n.style.backgroundColor = e ? 'transparent' : '#f0f0f0'),
      (n.style.display = 'flex'),
      (n.style.border = 'none'),
      (n.style.alignItems = 'center'),
      (n.style.justifyContent = 'center');
    const i = document.createElement('div');
    (i.style.color = '#666666'),
      (i.style.border = 'none'),
      (i.style.display = e ? 'none' : 'block');
    const l = document.createElement('input');
    (l.type = 'file'),
      (l.accept = 'image/*'),
      (l.style.display = 'none'),
      l.addEventListener('change', e => s.handleFileChange(e, n, i));
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
      a.addEventListener('click', () => l.click());
    const r = document.createElement('img'),
      d = `${o}-img`;
    return (
      (r.id = d),
      (r.style.width = '100%'),
      (r.style.height = '100%'),
      (r.style.objectFit = 'contain'),
      (r.style.border = 'none'),
      (r.style.display = 'none'),
      e && ((r.src = e), (r.style.display = 'block')),
      n.addEventListener('mouseenter', () => {
        a.style.opacity = '1';
      }),
      n.addEventListener('mouseleave', () => {
        a.style.opacity = '0';
      }),
      n.appendChild(i),
      n.appendChild(l),
      n.appendChild(a),
      n.appendChild(r),
      n
    );
  }
  static handleFileChange(e, n, o) {
    const i = e.target,
      l = i.files ? i.files[0] : null;
    if (l) {
      const e = new FileReader();
      (e.onload = function () {
        return t(this, void 0, void 0, function* () {
          const t = e.result,
            i = n.querySelector('img');
          if (i) {
            if (s.imageAttributeConfig) {
              const e = yield s.imageAttributeConfig(t);
              i.src = e.url;
            } else i.src = t;
            (i.style.display = 'block'),
              (o.style.display = 'none'),
              (n.style.backgroundColor = 'transparent'),
              null == L || L.dispatchDesignChange();
          }
        });
      }),
        e.readAsDataURL(l);
    }
  }
  static restoreImageUpload(e, t, n) {
    const o = e.querySelector('div:not(.upload-btn)'),
      s = e.querySelector('input[type="file"]'),
      i = e.querySelector('.upload-btn'),
      l = e.querySelector('img');
    !1 !== n
      ? (s.addEventListener('change', t => this.handleFileChange(t, e, o)),
        i.addEventListener('click', () => s.click()),
        t
          ? ((l.src = t),
            (l.style.display = 'block'),
            (o.style.display = 'none'),
            (e.style.backgroundColor = 'transparent'))
          : ((l.style.display = 'none'),
            (o.style.display = 'block'),
            (e.style.backgroundColor = '#f0f0f0')),
        e.addEventListener('mouseenter', () => {
          i.style.opacity = '1';
        }),
        e.addEventListener('mouseleave', () => {
          i.style.opacity = '0';
        }))
      : i.remove();
  }
}
class i {
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
  constructor() {
    this.modalComponent = new n();
  }
  create(e = 1, t = 'Header', n) {
    a.headerAttributeConfig = n || [];
    const o = document.createElement(`h${e}`);
    return (o.innerText = t), o.classList.add('header-component'), o;
  }
  seedFormulaValues(e) {
    document.querySelectorAll('.header-component').forEach(t => {
      const n = t.querySelector('.component-controls'),
        o = t.getAttribute('data-attribute-key');
      o &&
        e.hasOwnProperty(o) &&
        ((t.textContent = e[o]), (t.style.color = '#000000')),
        n && t.appendChild(n);
    }),
      L.dispatchDesignChange();
  }
  updateInputValues(e) {
    document.querySelectorAll('.header-component').forEach(t => {
      const n = t.querySelector('.component-controls'),
        o = t.getAttribute('data-attribute-key'),
        s = t.getAttribute('data-attribute-type');
      o && e.hasOwnProperty(o) && 'Input' === s && (t.textContent = e[o]),
        n && t.appendChild(n);
    }),
      L.dispatchDesignChange();
  }
  handleHeaderClick(e) {
    return t(this, void 0, void 0, function* () {
      var t;
      if (
        this.modalComponent &&
        0 !==
          (null === (t = a.headerAttributeConfig) || void 0 === t
            ? void 0
            : t.length)
      )
        try {
          const t = yield this.modalComponent.show(a.headerAttributeConfig);
          if (t) {
            const n = this.findSelectedAttribute(t);
            n && this.updateHeaderContent(e, n);
          }
        } catch (e) {
          console.error('Error handling header component click:', e);
        }
      else
        console.warn(
          'Modal component or header attribute config not available'
        );
    });
  }
  findSelectedAttribute(e) {
    for (const t of a.headerAttributeConfig)
      if (e.hasOwnProperty(t.key) && void 0 !== e[t.key] && '' !== e[t.key])
        return t;
    return null;
  }
  updateHeaderContent(e, t) {
    const n = e.querySelector('.component-controls');
    e.setAttribute('data-attribute-key', t.key),
      e.setAttribute('data-attribute-type', t.type),
      'Formula' === t.type
        ? ((e.textContent = `${t.title}`),
          (e.style.color = 'rgb(188 191 198)'),
          (e.style.fontWeight = '500'))
        : ('Constant' !== t.type && 'Input' !== t.type) ||
          (e.textContent = `${t.value}`),
      n && e.appendChild(n),
      null == L || L.dispatchDesignChange();
  }
  static restore(e) {
    const t = e.closest('.header-component');
    if (t) {
      const e = t.getAttribute('data-attribute-key'),
        n = t.getAttribute('data-attribute-type');
      if (e) {
        const o = a.headerAttributeConfig.find(t => t.key === e);
        if (o) {
          const e = t.querySelector('.component-controls');
          !o.default_value || ('Formula' !== n && 'Input' !== n)
            ? 'Formula' === n &&
              ((t.textContent = `${o.title}`),
              (t.style.color = 'rgb(188 191 198)'),
              (t.style.fontWeight = '500'))
            : ((t.textContent = `${o.default_value}`),
              (t.style.color = '#000000')),
            e && t.appendChild(e);
        }
      }
    }
  }
}
a.headerAttributeConfig = [];
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
          L.historyManager.captureState();
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
    const o = L.createComponent(n);
    if (!o) return;
    const s = this.element.classList[2],
      i = L.generateUniqueClass(n, !0, s);
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
      L.historyManager.captureState();
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
    const o = new r();
    (o.element = e), (o.resizers = n), o.addResizeHandles(), e.appendChild(n);
  }
  static restoreContainer(e) {
    r.restoreResizer(e);
    const t = new r();
    t.element = e;
    e.querySelectorAll('.editable-component').forEach(e => {
      var n;
      if (
        (L.controlsManager.addControlButtons(e),
        L.addDraggableListeners(e),
        e.addEventListener('mouseenter', n => t.showLabel(n, e)),
        e.addEventListener('mouseleave', n => t.hideLabel(n, e)),
        e.classList.contains('image-component'))
      ) {
        const t =
          (null === (n = e.querySelector('img')) || void 0 === n
            ? void 0
            : n.getAttribute('src')) || '';
        s.restoreImageUpload(e, t, null);
      }
      e.classList.contains('container-component') && this.restoreContainer(e);
    });
  }
}
class d {
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
    const o = L.createComponent(n);
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
      const i = L.generateUniqueClass(n, !0, e);
      o.classList.add(i), (o.id = i);
      let l = o.querySelector('.component-label');
      l ||
        ((l = document.createElement('span')),
        (l.className = 'component-label'),
        o.appendChild(l)),
        (l.textContent = i),
        L.historyManager.captureState();
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
        (L.controlsManager.addControlButtons(e),
        L.addDraggableListeners(e),
        e.classList.contains('image-component'))
      ) {
        const n =
          (null === (t = e.querySelector('img')) || void 0 === t
            ? void 0
            : t.getAttribute('src')) || '';
        s.restoreImageUpload(e, n, null);
      }
    });
  }
}
class c extends d {
  constructor() {
    super(2, 'twoCol-component');
  }
}
class u extends d {
  constructor() {
    super(3, 'threeCol-component');
  }
}
class p {
  constructor() {
    (this.modalComponent = null), (this.modalComponent = new n() || null);
  }
  create(e, t, n = !1, o) {
    p.tableAttributeConfig = o || [];
    const s = document.createElement('div');
    s.classList.add('table-component');
    const i = L.generateUniqueClass('table');
    (s.id = i),
      (s.style.minWidth = '250px'),
      (s.style.border = '1px solid #2F3132'),
      (s.style.borderRadius = '8px'),
      (s.style.display = 'flex'),
      (s.style.flexDirection = 'column');
    const l = document.createElement('div');
    (l.style.display = 'flex'),
      (l.style.flexDirection = 'column'),
      l.classList.add('table-wrapper');
    for (let n = 0; n < e; n++) {
      const e = this.createTableRow(n, t, i);
      l.appendChild(e);
    }
    if ((s.appendChild(l), !n)) {
      const e = document.createElement('button');
      (e.textContent = 'Add Row'),
        (e.className = 'add-row-button'),
        this.styleButton(e, '#2563eb', '#1d4ed8'),
        e.addEventListener('click', () => {
          this.addRow(l, i);
        });
      const t = document.createElement('div');
      (t.style.textAlign = 'center'),
        (t.style.marginTop = '10px'),
        (t.style.marginBottom = '10px'),
        t.appendChild(e),
        s.appendChild(t);
    }
    return s;
  }
  createTableRow(e, t, n) {
    const o = document.createElement('div');
    (o.style.display = 'grid'),
      (o.style.gridTemplateColumns = `repeat(${t}, 1fr)`),
      (o.className = 'table-row');
    for (let s = 0; s < t; s++) {
      const t = this.createTableCell(e, s, n);
      o.appendChild(t);
    }
    return o;
  }
  createTableCell(e, t, n) {
    const o = document.createElement('div');
    (o.className = 'table-cell'),
      (o.id = `table-cell-T-${n}-R${e}-C${t}`),
      (o.textContent = `R${e + 1}C${t + 1}`),
      (o.style.border = '1px solid #2F3132'),
      (o.style.padding = '8px 12px'),
      (o.style.minHeight = '45px'),
      (o.style.position = 'relative'),
      (o.style.cursor = 'pointer'),
      (o.style.transition = 'background-color 0.2s ease'),
      (o.style.display = 'flex'),
      (o.style.alignItems = 'center'),
      (o.style.justifyContent = 'flex-start');
    const s = document.createElement('div');
    (s.className = 'cell-controls'),
      (s.style.position = 'absolute'),
      (s.style.bottom = '5px'),
      (s.style.right = '5px'),
      (s.style.display = 'flex'),
      (s.style.gap = '4px'),
      (s.style.alignItems = 'center'),
      (s.style.justifyContent = 'center');
    const i = document.createElement('button');
    (i.textContent = '+'),
      (i.className = 'add-cell-button'),
      (i.style.width = '15px'),
      (i.style.height = '15px'),
      (i.style.border = 'none'),
      (i.style.borderRadius = '3px'),
      (i.style.backgroundColor = '#10b981'),
      (i.style.color = 'white'),
      (i.style.fontSize = '12px'),
      (i.style.cursor = 'pointer'),
      (i.style.display = 'flex'),
      (i.style.alignItems = 'center'),
      (i.style.justifyContent = 'center'),
      (i.style.fontWeight = 'bold'),
      i.addEventListener('mouseenter', () => {
        i.style.backgroundColor = '#059669';
      }),
      i.addEventListener('mouseleave', () => {
        i.style.backgroundColor = '#10b981';
      }),
      i.addEventListener('click', e => {
        e.stopPropagation(), this.addCellToRow(o, n);
      });
    const l = document.createElement('button');
    return (
      (l.innerHTML = '×'),
      (l.className = 'delete-cell-button'),
      (l.style.width = '15px'),
      (l.style.height = '15px'),
      (l.style.border = 'none'),
      (l.style.borderRadius = '3px'),
      (l.style.backgroundColor = '#ef4444'),
      (l.style.color = 'white'),
      (l.style.fontSize = '14px'),
      (l.style.cursor = 'pointer'),
      (l.style.display = 'flex'),
      (l.style.alignItems = 'center'),
      (l.style.justifyContent = 'center'),
      (l.style.fontWeight = 'bold'),
      l.addEventListener('mouseenter', () => {
        l.style.backgroundColor = '#dc2626';
      }),
      l.addEventListener('mouseleave', () => {
        l.style.backgroundColor = '#ef4444';
      }),
      l.addEventListener('click', e => {
        e.stopPropagation(), this.deleteCell(o);
      }),
      s.appendChild(i),
      s.appendChild(l),
      o.appendChild(s),
      o
    );
  }
  addCellToRow(e, t) {
    const n = e.parentElement;
    if (!n) return;
    const o = Array.from(n.parentElement.children).indexOf(n),
      s = n.children.length,
      i = this.createTableCell(o, s, t);
    n.appendChild(i), (n.style.gridTemplateColumns = `repeat(${s + 1}, 1fr)`);
  }
  deleteCell(e) {
    const t = e.parentElement;
    if (!t) return;
    const n = t.children.length;
    if ((t.removeChild(e), 1 === n)) {
      const e = t.parentElement;
      e && e.children.length > 1 && e.removeChild(t);
    } else t.style.gridTemplateColumns = `repeat(${n - 1}, 1fr)`;
  }
  styleButton(e, t, n) {
    (e.style.padding = '8px 16px'),
      (e.style.backgroundColor = t),
      (e.style.color = 'white'),
      (e.style.border = 'none'),
      (e.style.borderRadius = '6px'),
      (e.style.fontSize = '14px'),
      (e.style.fontWeight = '500'),
      (e.style.cursor = 'pointer'),
      (e.style.transition = 'background-color 0.2s ease'),
      e.addEventListener('mouseenter', () => {
        e.style.backgroundColor = n;
      }),
      e.addEventListener('mouseleave', () => {
        e.style.backgroundColor = t;
      });
  }
  handleCellClick(e) {
    return t(this, void 0, void 0, function* () {
      if (
        this.modalComponent &&
        p.tableAttributeConfig &&
        0 !== p.tableAttributeConfig.length
      )
        try {
          const t = yield this.modalComponent.show(p.tableAttributeConfig);
          if (t) {
            const n = this.findSelectedAttribute(t);
            n && this.updateCellContent(e, n);
          }
        } catch (e) {
          console.error('Error handling cell click:', e);
        }
      else
        console.warn('Modal component or table attribute config not available');
    });
  }
  findSelectedAttribute(e) {
    for (const t of p.tableAttributeConfig)
      if (e.hasOwnProperty(t.key) && void 0 !== e[t.key] && '' !== e[t.key])
        return t;
    return null;
  }
  seedFormulaValues(e) {
    document.querySelectorAll('.table-component').forEach(t => {
      t.querySelectorAll('div[data-attribute-key]').forEach(t => {
        const n = t.querySelector('.cell-controls'),
          o = t.getAttribute('data-attribute-key');
        o &&
          e.hasOwnProperty(o) &&
          ((t.textContent = e[o]), (t.style.color = '#000000')),
          n && t.appendChild(n);
      });
    }),
      L.dispatchDesignChange();
  }
  updateInputValues(e) {
    document.querySelectorAll('.table-component').forEach(t => {
      t.querySelectorAll('div[data-attribute-key]').forEach(t => {
        const n = t.getAttribute('data-attribute-key'),
          o = t.getAttribute('data-attribute-type');
        n && e.hasOwnProperty(n) && 'Input' === o && (t.textContent = e[n]);
      });
    }),
      L.dispatchDesignChange();
  }
  updateCellContent(e, t) {
    e.setAttribute('data-attribute-key', t.key),
      e.setAttribute('data-attribute-type', t.type);
    const n = e.querySelector('.cell-controls');
    'Formula' === t.type
      ? ((e.textContent = `${t.title}`),
        (e.style.fontSize = '10px'),
        (e.style.color = 'rgb(188 191 198)'),
        (e.style.fontWeight = '500'))
      : 'Constant' === t.type && (e.textContent = `${t.value}`),
      n && e.appendChild(n),
      null == L || L.dispatchDesignChange();
  }
  setModalComponent(e) {
    this.modalComponent = e;
  }
  addRow(e, t) {
    const n = e.children.length,
      o = this.createTableRow(n, 1, t);
    e.appendChild(o), L.dispatchDesignChange();
  }
  static restore(e, t) {
    const n = new p(),
      o = e.querySelector('.table-wrapper'),
      s = null == o ? void 0 : o.closest('.table-component'),
      i = null == s ? void 0 : s.id;
    if (!o) return void console.error('No table wrapper found in container');
    o.querySelectorAll('.table-cell').forEach(e => {
      const o = e,
        s = o.getAttribute('data-attribute-key'),
        l = o.getAttribute('data-attribute-type');
      if (s) {
        const t = p.tableAttributeConfig.find(e => e.key === s);
        if (t) {
          const n = e.querySelector('.cell-controls');
          !t.default_value || ('Formula' !== l && 'Input' !== l)
            ? 'Formula' === l &&
              ((o.textContent = `${t.title}`),
              (o.style.fontSize = '10px'),
              (o.style.color = 'rgb(188 191 198)'),
              (o.style.fontWeight = '500'))
            : ((o.textContent = `${t.default_value}`),
              (o.style.fontSize = '14px'),
              (o.style.color = '#000000')),
            n && e.appendChild(n);
        }
      }
      const a = o.querySelector('.cell-controls');
      if (!1 !== t) {
        if (a) {
          const e = a.querySelector('.add-cell-button'),
            t = a.querySelector('.delete-cell-button');
          e &&
            e.addEventListener('click', e => {
              e.stopPropagation(), n.addCellToRow(o, i);
            }),
            t &&
              t.addEventListener('click', e => {
                e.stopPropagation(), n.deleteCell(o);
              });
        }
      } else null == a || a.remove();
    });
    const l = e.querySelector('.add-row-button');
    l &&
      l.addEventListener('click', () => {
        n.addRow(o, i);
      });
  }
}
class h {
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
class m {
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
      t = new r().create();
    t.classList.add('container'),
      Object.assign(t.style, {
        width: '100%',
        maxWidth: 'none',
        margin: '0 auto',
        padding: '20px',
        fontFamily: "'Roboto', sans-serif",
      }),
      e(t);
    const n = new r().create();
    n.classList.add('container'),
      Object.assign(n.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        width: '100%',
      }),
      e(n);
    const s = new o('MyBrand').create();
    Object.assign(s.style, {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    });
    const i = new r().create();
    i.classList.add('container'),
      Object.assign(i.style, { display: 'flex', gap: '20px' }),
      e(i),
      ['Home', 'Features', 'Contact'].forEach(e => {
        const t = new o(e).create();
        Object.assign(t.style, {
          cursor: 'pointer',
          color: '#555',
          textDecoration: 'none',
        }),
          i.appendChild(t);
      }),
      n.appendChild(s),
      n.appendChild(i);
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
    const d = new o('Welcome to My Landing Page').create();
    Object.assign(d.style, {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      marginBottom: '40px',
      width: '100%',
    });
    const c = new o(
      'Discover amazing features and build better products with us.'
    ).create();
    Object.assign(c.style, {
      fontSize: '18px',
      color: '#666',
      marginBottom: '30px',
    });
    const u = new l().create();
    Object.assign(u.style, {
      padding: '12px 24px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }),
      u.addEventListener('mouseenter', () => {
        u.style.backgroundColor = '#0056b3';
      }),
      u.addEventListener('mouseleave', () => {
        u.style.backgroundColor = '#007bff';
      }),
      a.appendChild(d),
      a.appendChild(c),
      a.appendChild(u);
    const p = new r().create();
    p.classList.add('container'),
      Object.assign(p.style, {
        textAlign: 'center',
        padding: '20px',
        marginTop: '40px',
        borderTop: '1px solid #ddd',
      }),
      e(p);
    const h = new o('© 2025 MyBrand. All rights reserved.').create();
    return (
      Object.assign(h.style, { fontSize: '14px', color: '#999' }),
      p.appendChild(h),
      t.appendChild(n),
      t.appendChild(a),
      t.appendChild(p),
      t
    );
  }
}
class g {
  constructor(e) {
    (this.undoStack = []), (this.redoStack = []), (this.canvas = e);
  }
  captureState() {
    const e = L.getState();
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
      L.restoreState(t);
    } else if (1 === this.undoStack.length) {
      const e = this.undoStack.pop();
      this.redoStack.push(e);
      const t = L.jsonStorage.load();
      t ? L.restoreState(t) : L.restoreState([]);
    } else console.warn('No more actions to undo.');
  }
  redo() {
    if (this.redoStack.length > 0) {
      const e = this.redoStack.pop();
      this.undoStack.push(e), L.restoreState(e);
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
class f {
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
class w {
  static init(e, t, n, o) {
    if (
      ((this.sidebarElement = document.getElementById('customization')),
      (this.controlsContainer = document.getElementById('controls')),
      (this.componentNameHeader = document.getElementById('component-name')),
      (this.customComponentsConfig = e),
      (this.basicComponentsConfig = n),
      (this.editable = t),
      (this.showAttributeTab = o),
      !this.sidebarElement || !this.controlsContainer)
    )
      return void console.error(
        'CustomizationSidebar: Required elements not found.'
      );
    (this.layersViewController = new f()),
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
    const s = this.layersModeToggle.querySelector('#customize-tab'),
      i = this.layersModeToggle.querySelector('#attribute-tab'),
      l = this.layersModeToggle.querySelector('#layers-tab');
    !1 === this.editable && !0 === o
      ? ((s.style.display = 'none'),
        (l.style.display = 'none'),
        i.classList.add('active'),
        s.classList.remove('active'),
        l.classList.remove('active'),
        this.switchToAttributeMode())
      : (s.addEventListener('click', () => this.switchToCustomizeMode()),
        i.addEventListener('click', () => {
          this.switchToAttributeMode();
        }),
        l.addEventListener('click', () => this.switchToLayersMode()));
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
      f.updateLayersView();
  }
  static showSidebar(e) {
    const t = document.getElementById(e);
    if (!t) return void console.error(`Component with ID "${e}" not found.`);
    if (!1 === this.editable && !0 !== this.showAttributeTab) return;
    (this.selectedComponent = t),
      (this.sidebarElement.style.display = 'block'),
      this.sidebarElement.classList.add('visible');
    const n = document.getElementById('menu-btn');
    n &&
      ((n.style.backgroundColor = '#e2e8f0'),
      (n.style.borderColor = '#cbd5e1')),
      (this.componentNameHeader.textContent = `Component: ${e}`),
      !1 !== this.editable || !0 !== this.showAttributeTab
        ? this.switchToCustomizeMode()
        : this.switchToAttributeMode();
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
      ('flex' !== t.display && 'flex' !== e.style.display) ||
        (this.createSelectControl(
          'Flex Direction',
          'flex-direction',
          t.flexDirection || 'row',
          ['row', 'row-reverse', 'column', 'column-reverse']
        ),
        this.createSelectControl(
          'Align Items',
          'align-items',
          t.alignItems || 'stretch',
          ['stretch', 'flex-start', 'flex-end', 'center', 'baseline']
        ),
        this.createSelectControl(
          'Justify Content',
          'justify-content',
          t.justifyContent || 'flex-start',
          [
            'flex-start',
            'flex-end',
            'center',
            'space-between',
            'space-around',
            'space-evenly',
          ]
        )),
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
      this.createSelectControl('Font Weight', 'font-weight', t.fontWeight, [
        'normal',
        'bold',
        'bolder',
        'lighter',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
      ]),
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
    o && (o.value = w.rgbToHex(t.backgroundColor));
    const s = document.getElementById('text-color');
    s && (s.value = w.rgbToHex(t.color));
    const i = document.getElementById('border-color');
    i && (i.value = w.rgbToHex(t.borderColor)), this.addListeners(e);
  }
  static handleInputTrigger(e) {
    return t(this, void 0, void 0, function* () {
      var e, t, n;
      const s = w.selectedComponent;
      if (!s) return;
      let i;
      if (
        (s.classList.contains('table-component')
          ? (i =
              null === (e = w.basicComponentsConfig) || void 0 === e
                ? void 0
                : e.components.find(e => 'table' === e.name))
          : s.classList.contains('text-component')
            ? (i =
                null === (t = w.basicComponentsConfig) || void 0 === t
                  ? void 0
                  : t.components.find(e => 'text' === e.name))
            : s.classList.contains('header-component') &&
              (i =
                null === (n = w.basicComponentsConfig) || void 0 === n
                  ? void 0
                  : n.components.find(e => 'header' === e.name)),
        console.log(i),
        i && i.globalExecuteFunction)
      ) {
        const e = {};
        w.functionsPanel.querySelectorAll('.attribute-input').forEach(t => {
          const n = t;
          e[n.id] = n.value;
        });
        const t = yield i.globalExecuteFunction(e),
          n = new p(),
          s = new o(),
          l = new a();
        t &&
          (s.seedFormulaValues(t),
          n.seedFormulaValues(t),
          l.seedFormulaValues(t),
          L.historyManager.captureState()),
          s.updateInputValues(e),
          n.updateInputValues(e),
          l.updateInputValues(e);
      }
    });
  }
  static createAttributeControls(e) {
    const t = document.createElement('div');
    (t.className = 'attribute-input-container'),
      (t.innerHTML = `\n    <div class="attribute-header">\n      <label for="${e.key}" class="attribute-label">${e.title}</label>\n      ${e.editable ? '' : '<span class="readonly-badge">Read Only</span>'}\n    </div>\n    <div class="attribute-input-wrapper">\n      <input \n        type="text" \n        class="attribute-input" \n        id="${e.key}"  \n        ${e.editable ? '' : 'disabled readonly'} \n        value="${e.default_value || ''}" \n        placeholder="Enter ${e.title.toLowerCase()}..."\n      >\n    </div>\n  `),
      this.functionsPanel.appendChild(t);
    const n = document.getElementById(e.key);
    if (!1 !== e.editable) {
      const o = document.createElement('div');
      (o.className = 'event-configurator'),
        (o.innerHTML = `\n      <div class="event-trigger-section">\n        <div class="trigger-header">\n          <label class="trigger-label">Trigger Event:</label>\n        </div>\n        <div class="trigger-select-wrapper">\n          <select class="event-selector" id="event-selector-${e.key}">\n            <option value="input">On Input (Real-time)</option>\n            <option value="change">On Change</option>\n            <option value="blur">On Focus Lost</option>\n            <option value="keyup">On Key Release</option>\n            <option value="click">On Click</option>\n          </select>\n          <div class="select-arrow">▼</div>\n        </div>\n      </div>\n    `),
        t.appendChild(o);
      const s = document.getElementById(`event-selector-${e.key}`),
        i = e => {
          ['input', 'change', 'blur', 'keyup', 'click'].forEach(e => {
            n.removeEventListener(e, this.handleInputTrigger);
          }),
            n.addEventListener(e, this.handleInputTrigger),
            t.setAttribute('data-trigger', e);
        };
      s.addEventListener('change', () => {
        var e;
        const t = s.value;
        i(t),
          null === (e = s.parentElement) ||
            void 0 === e ||
            e.classList.add('trigger-changed'),
          setTimeout(() => {
            var e;
            null === (e = s.parentElement) ||
              void 0 === e ||
              e.classList.remove('trigger-changed');
          }, 300);
      });
      const l = 'input';
      (s.value = l),
        i(l),
        n.addEventListener('focus', () => {
          t.classList.add('input-focused');
        }),
        n.addEventListener('blur', () => {
          t.classList.remove('input-focused');
        });
    }
  }
  static populateFunctionalityControls(e) {
    var t, n, s, i;
    let l;
    this.functionsPanel.innerHTML = '';
    let r = !1;
    if (e.classList.contains('table-component'))
      (l =
        null === (t = this.basicComponentsConfig) || void 0 === t
          ? void 0
          : t.components.find(e => 'table' === e.name)),
        (r = !1);
    else if (e.classList.contains('text-component'))
      (l =
        null === (n = this.basicComponentsConfig) || void 0 === n
          ? void 0
          : n.components.find(e => 'text' === e.name)),
        (r = !0);
    else if (e.classList.contains('header-component'))
      (l =
        null === (s = this.basicComponentsConfig) || void 0 === s
          ? void 0
          : s.components.find(e => 'header' === e.name)),
        (r = !0);
    else if (e.classList.contains('table-cell')) r = !0;
    else if (e.classList.contains('custom-component')) {
      const t =
          null ===
            (i = Array.from(e.classList).find(e => e.endsWith('-component'))) ||
          void 0 === i
            ? void 0
            : i.replace('-component', ''),
        n = w.customComponentsConfig;
      if (t && n && n[t] && n[t].settingsComponentTagName) {
        const o = n[t].settingsComponentTagName;
        let s = this.functionsPanel.querySelector(o);
        s ||
          ((s = document.createElement(o)), this.functionsPanel.appendChild(s)),
          s.setAttribute(
            'data-settings',
            JSON.stringify({ targetComponentId: e.id })
          );
      }
    }
    if (
      (l &&
        l.attributes &&
        l.attributes.length > 0 &&
        l.attributes.forEach(e => {
          'Input' === e.type && this.createAttributeControls(e);
        }),
      r && !1 !== this.editable)
    ) {
      const t = document.createElement('button');
      (t.textContent = `Set ${e.classList[0].replace('-component', '')} Attribute`),
        (t.className = 'set-attribute-button'),
        this.functionsPanel.appendChild(t),
        t.addEventListener('click', () => {
          if (e.classList.contains('text-component')) {
            new o().handleTextClick(e);
          } else if (e.classList.contains('header-component')) {
            new a().handleHeaderClick(e);
          } else if (e.classList.contains('table-cell')) {
            new p().handleCellClick(e);
          }
        });
    } else
      l ||
        (this.functionsPanel.innerHTML =
          '<p>No specific settings for this component.</p>');
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
    var t, n, o, s, i, l, a, r, d, c, u, p, h, m, g, v, y, b, f, C;
    const w = {
        width: document.getElementById('width'),
        height: document.getElementById('height'),
        backgroundColor: document.getElementById('background-color'),
        margin: document.getElementById('margin'),
        padding: document.getElementById('padding'),
        alignment: document.getElementById('alignment'),
        fontSize: document.getElementById('font-size'),
        fontWeight: document.getElementById('font-weight'),
        textColor: document.getElementById('text-color'),
        borderWidth: document.getElementById('border-width'),
        borderStyle: document.getElementById('border-style'),
        borderColor: document.getElementById('border-color'),
        display: document.getElementById('display'),
        fontFamily: document.getElementById('font-family'),
        flexDirection: document.getElementById('flex-direction'),
        alignItems: document.getElementById('align-items'),
        justifyContent: document.getElementById('justify-content'),
      },
      x = (function (e, t) {
        let n = null;
        return (...o) => {
          n && clearTimeout(n), (n = setTimeout(() => e(...o), t));
        };
      })(() => {
        L.dispatchDesignChange(), L.historyManager.captureState();
      }, 300);
    null === (t = w.width) ||
      void 0 === t ||
      t.addEventListener('input', () => {
        const t = document.getElementById('width-unit').value;
        (e.style.width = `${w.width.value}${t}`), x();
      }),
      null === (n = w.height) ||
        void 0 === n ||
        n.addEventListener('input', () => {
          const t = document.getElementById('height-unit').value;
          (e.style.height = `${w.height.value}${t}`), x();
        }),
      null === (o = w.backgroundColor) ||
        void 0 === o ||
        o.addEventListener('input', () => {
          (e.style.backgroundColor = w.backgroundColor.value),
            (document.getElementById('background-color-value').value =
              w.backgroundColor.value),
            x();
        }),
      null === (s = document.getElementById('background-color-value')) ||
        void 0 === s ||
        s.addEventListener('input', t => {
          const n = t.target;
          (e.style.backgroundColor = n.value),
            (document.getElementById('background-color').value = n.value),
            x();
        }),
      null === (i = w.margin) ||
        void 0 === i ||
        i.addEventListener('input', () => {
          const t = document.getElementById('margin-unit').value;
          (e.style.margin = `${w.margin.value}${t}`), x();
        }),
      null === (l = w.padding) ||
        void 0 === l ||
        l.addEventListener('input', () => {
          const t = document.getElementById('padding-unit').value;
          (e.style.padding = `${w.padding.value}${t}`), x();
        }),
      null === (a = w.alignment) ||
        void 0 === a ||
        a.addEventListener('change', () => {
          (e.style.textAlign = w.alignment.value), x();
        }),
      null === (r = w.fontSize) ||
        void 0 === r ||
        r.addEventListener('input', () => {
          const t = document.getElementById('font-size-unit').value;
          (e.style.fontSize = `${w.fontSize.value}${t}`), x();
        }),
      null === (d = w.fontWeight) ||
        void 0 === d ||
        d.addEventListener('change', () => {
          (e.style.fontWeight = w.fontWeight.value), x();
        }),
      null === (c = w.textColor) ||
        void 0 === c ||
        c.addEventListener('input', () => {
          (e.style.color = w.textColor.value),
            (document.getElementById('text-color-value').value =
              w.textColor.value),
            x();
        }),
      null === (u = document.getElementById('text-color-value')) ||
        void 0 === u ||
        u.addEventListener('input', t => {
          const n = t.target;
          (e.style.color = n.value),
            (document.getElementById('text-color').value = n.value),
            x();
        }),
      null === (p = w.borderWidth) ||
        void 0 === p ||
        p.addEventListener('input', () => {
          const t = document.getElementById('border-width-unit').value;
          (e.style.borderWidth = `${w.borderWidth.value}${t}`), x();
        }),
      null === (h = w.borderStyle) ||
        void 0 === h ||
        h.addEventListener('change', () => {
          (e.style.borderStyle = w.borderStyle.value), x();
        }),
      null === (m = w.borderColor) ||
        void 0 === m ||
        m.addEventListener('input', () => {
          (e.style.borderColor = w.borderColor.value),
            (document.getElementById('border-color-value').value =
              w.borderColor.value),
            x();
        }),
      null === (g = document.getElementById('border-color-value')) ||
        void 0 === g ||
        g.addEventListener('input', t => {
          const n = t.target;
          (e.style.borderColor = n.value),
            (document.getElementById('border-color').value = n.value),
            x();
        }),
      null === (v = w.display) ||
        void 0 === v ||
        v.addEventListener('change', () => {
          (e.style.display = w.display.value), x(), this.populateCssControls(e);
        }),
      null === (y = w.flexDirection) ||
        void 0 === y ||
        y.addEventListener('change', () => {
          (e.style.flexDirection = w.flexDirection.value), x();
        }),
      null === (b = w.alignItems) ||
        void 0 === b ||
        b.addEventListener('change', () => {
          (e.style.alignItems = w.alignItems.value), x();
        }),
      null === (f = w.fontFamily) ||
        void 0 === f ||
        f.addEventListener('change', () => {
          (e.style.fontFamily = w.fontFamily.value), x();
        }),
      null === (C = w.justifyContent) ||
        void 0 === C ||
        C.addEventListener('change', () => {
          (e.style.justifyContent = w.justifyContent.value), x();
        });
  }
  static getLayersViewController() {
    return this.layersViewController;
  }
}
(w.selectedComponent = null),
  (w.customComponentsConfig = null),
  (w.basicComponentsConfig = null),
  (w.showAttributeTab = void 0);
class x {
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
var E;
class L {
  static getComponents() {
    return E.components;
  }
  static setComponents(e) {
    E.components = e;
  }
  static init(t = null, n, o) {
    this.editable = n;
    const s = o.components.find(e => 'table' === e.name);
    this.tableAttributeConfig = null == s ? void 0 : s.attributes;
    const i = o.components.find(e => 'text' === e.name);
    this.textAttributeConfig = null == i ? void 0 : i.attributes;
    const l = o.components.find(e => 'header' === e.name);
    this.headerAttributeConfig = null == l ? void 0 : l.attributes;
    const a = o.components.find(e => 'image' === e.name);
    (this.ImageAttributeConfig = null == a ? void 0 : a.globalExecuteFunction),
      s && s.attributes && s.attributes.length,
      (E.canvasElement = document.getElementById('canvas')),
      (E.sidebarElement = document.getElementById('sidebar')),
      window.addEventListener('table-design-change', () => {
        E.dispatchDesignChange();
      }),
      E.canvasElement.addEventListener('drop', E.onDrop.bind(E)),
      E.canvasElement.addEventListener('dragover', e => e.preventDefault()),
      E.canvasElement.classList.add('preview-desktop'),
      E.canvasElement.addEventListener('click', e => {
        const t = e.target;
        t && w.showSidebar(t.id);
      }),
      (E.canvasElement.style.position = 'relative'),
      (this.lastCanvasWidth = E.canvasElement.offsetWidth),
      (E.historyManager = new g(E.canvasElement)),
      (E.jsonStorage = new v()),
      (E.controlsManager = new y(E)),
      (E.gridManager = new x()),
      E.gridManager.initializeDropPreview(E.canvasElement);
    if ((new e(E.canvasElement, E.sidebarElement).enable(), t))
      E.restoreState(t);
    else {
      const e = E.jsonStorage.load();
      e && E.restoreState(e);
    }
  }
  static dispatchDesignChange() {
    if (E.canvasElement && this.editable) {
      const e = E.getState(),
        t = new CustomEvent('design-change', {
          detail: e,
          bubbles: !0,
          composed: !0,
        });
      E.canvasElement.dispatchEvent(t), E.jsonStorage.save(e);
    }
  }
  static clearCanvas() {
    (E.canvasElement.innerHTML = ''),
      (E.components = []),
      E.historyManager.captureState(),
      E.gridManager.initializeDropPreview(E.canvasElement),
      E.gridManager.initializeDropPreview(E.canvasElement),
      E.dispatchDesignChange();
  }
  static getState() {
    return E.components.map(e => {
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
        position: {
          x: e.offsetLeft,
          y: e.offsetTop,
          '@mindfiredigital/page-builder-react':
            'file:../../../Desktop/page-builder/page-builder/packages/react/mindfiredigital-page-builder-react-1.2.3.tgz',
        },
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
    (E.canvasElement.innerHTML = ''),
      (E.components = []),
      e.forEach(e => {
        const t = e.dataAttributes['data-custom-settings'] || null,
          n = E.createComponent(e.type, t, e.content);
        if (n) {
          if (
            (e.classes.includes('custom-component') ||
              (n.innerHTML = e.content),
            (n.className = ''),
            e.classes.forEach(e => {
              n.classList.add(e);
            }),
            'video' === e.type && e.videoSrc)
          ) {
            const t = n.querySelector('video'),
              o = n.querySelector('.upload-text');
            (t.src = e.videoSrc),
              (t.style.display = 'block'),
              (o.style.display = 'none');
          }
          e.inlineStyle && n.setAttribute('style', e.inlineStyle),
            e.computedStyle &&
              Object.keys(e.computedStyle).forEach(t => {
                n.style.setProperty(t, e.computedStyle[t]);
              }),
            e.dataAttributes &&
              Object.entries(e.dataAttributes).forEach(([e, t]) => {
                n.setAttribute(e, t);
              }),
            E.controlsManager.addControlButtons(n),
            E.addDraggableListeners(n),
            n.classList.contains('container-component') &&
              r.restoreContainer(n),
            (n.classList.contains('twoCol-component') ||
              n.classList.contains('threeCol-component')) &&
              d.restoreColumn(n),
            'image' === e.type &&
              s.restoreImageUpload(n, e.imageSrc, this.editable),
            'table' === e.type && p.restore(n, this.editable),
            'link' === e.type && h.restore(n),
            'header' === e.type && a.restore(n),
            E.canvasElement.appendChild(n),
            E.components.push(n);
        }
      }),
      E.gridManager.initializeDropPreview(E.canvasElement);
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
        E.canvasElement
      ),
      a = E.createComponent(o, s);
    if (a && !1 !== this.editable) {
      const t = E.generateUniqueClass(o);
      (a.id = t),
        a.classList.add(t),
        (a.style.position = 'absolute'),
        'container' === o || 'twoCol' === o || 'threeCol' === o
          ? (a.style.top = `${e.offsetY}px`)
          : ((a.style.position = 'absolute'),
            (a.style.left = `${i}px`),
            (a.style.top = `${l}px`)),
        E.components.push(a),
        E.canvasElement.appendChild(a),
        E.addDraggableListeners(a),
        E.historyManager.captureState();
    }
    E.dispatchDesignChange();
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
      E.dispatchDesignChange();
  }
  static createComponent(e, t = null, n) {
    let o = null;
    const s = E.componentFactory[e];
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
        E.dispatchDesignChange();
      }).observe(o),
        o.classList.add('editable-component'),
        'container' != e && o.classList.add('component-resizer');
      const t = E.generateUniqueClass(e);
      o.setAttribute('id', t),
        'image' === e
          ? o.setAttribute('contenteditable', 'false')
          : (o.setAttribute('contenteditable', 'true'),
            o.addEventListener('input', () => {
              this.dispatchDesignChange(), E.historyManager.captureState();
            }));
      const n = document.createElement('span');
      (n.className = 'component-label'),
        (n.textContent = t),
        o.appendChild(n),
        E.controlsManager.addControlButtons(o);
    }
    return o;
  }
  static generateUniqueClass(e, t = !1, n = null) {
    if (t && n) {
      let t = E.components.find(e => e.classList.contains(n));
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
        E.components.forEach(e => {
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
        (i = E.canvasElement.scrollLeft),
        (l = E.canvasElement.scrollTop),
        (o = parseFloat(e.style.left) || 0),
        (s = parseFloat(e.style.top) || 0),
        (a.dataTransfer.effectAllowed = 'move'),
        (e.style.cursor = 'grabbing'));
    }),
      e.addEventListener('dragend', a => {
        a.preventDefault();
        const r = E.canvasElement.scrollLeft,
          d = E.canvasElement.scrollTop,
          c = r - i,
          u = d - l,
          p = a.clientX - t,
          h = a.clientY - n;
        let m = o + p + c,
          g = s + h + u;
        const v = E.canvasElement.getBoundingClientRect(),
          y = a.clientX - v.left + E.canvasElement.scrollLeft,
          b = a.clientY - v.top + E.canvasElement.scrollTop,
          f = E.canvasElement.getBoundingClientRect(),
          C = t - f.left + i,
          w = n - f.top + l;
        (m = y + (o - C)), (g = b + (s - w));
        const x = e.getBoundingClientRect(),
          L = E.canvasElement.scrollWidth - x.width,
          k = E.canvasElement.scrollHeight - x.height;
        (m = Math.max(0, Math.min(m, L))),
          (g = Math.max(0, Math.min(g, k))),
          (e.style.left = `${m}px`),
          (e.style.top = `${g}px`),
          (e.style.cursor = 'grab'),
          E.historyManager.captureState(),
          E.dispatchDesignChange();
      });
  }
}
(E = L),
  (L.components = []),
  (L.componentFactory = {
    button: () => new l().create(),
    header: () => new a().create(1, 'Header', E.headerAttributeConfig),
    image: () => new s().create(void 0, E.ImageAttributeConfig),
    video: () => new i(() => E.historyManager.captureState()).create(),
    table: () => new p().create(2, 2, void 0, E.tableAttributeConfig),
    text: () => new o().create(E.textAttributeConfig),
    container: () => new r().create(),
    twoCol: () => new c().create(),
    threeCol: () => new u().create(),
    landingpage: () => new m().create(),
    link: () => new h().create(),
  });
const k = document.getElementById('canvas'),
  S = new (class {
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
k &&
  k.addEventListener('click', e => {
    const t = e.target;
    t !== k && S.selectElement(t);
  });
class M {
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
class I {
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
          '.component-controls, .delete-icon, .component-label, .column-label, .resizers, .resizer, .drop-preview, .upload-btn, .edit-link, .edit-link-form, input, .cell-controls,.add-row-button'
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
      `\n      body, html {\n          margin: 0;\n          padding: 0;\n          width: 100%;\n          height: 100%;\n          box-sizing: border-box;\n      }\n        #canvas.home {\n      position: relative;\n      display: block;\n      width: 100%;\n      min-height: 100vh;\n      background-color: ${t};\n      margin: 0;\n      overflow: visible;\n  }\n\n      table {\n          border-collapse: collapse ;\n\n      }\n         \n      `
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
        'box-shadow',
        'overflow',
        'fill',
        'cursor',
        'transition',
        'border-bottom',
        'border-top',
        'border-left',
        'border-right',
        'box-sizing',
        '-webkit-box-pack',
        'letter-spacing',
        '-webkit-tap-highlight-color',
        'pointer-events',
      ],
      l = [
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
        if (l.some(t => e.classList.contains(t))) return;
        const s = window.getComputedStyle(e),
          a = [],
          r = e instanceof SVGElement || e.closest('svg');
        i.forEach(e => {
          const t = s.getPropertyValue(e);
          if (
            t &&
            'none' !== t &&
            '' !== t &&
            'initial' !== t &&
            'auto' !== t
          ) {
            if ('background-color' === e && 'rgba(0, 0, 0, 0)' === t) return;
            if ('border-width' === e && '0px' === t) return;
            if ('color' === e && 'rgb(0, 0, 0)' === t && !r) return;
            if ('font-weight' === e && '400' === t) return;
            a.push(`${e}: ${t};`);
          }
        });
        const d = this.generateUniqueSelector(e);
        !o.has(d) &&
          a.length > 0 &&
          (o.add(d),
          n.push(
            `\n          ${d} {\n            ${a.join('\n  ')}\n          }\n        `
          ));
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
    const t = [];
    let n = e;
    for (; n && 'body' !== n.tagName.toLowerCase(); ) {
      let e = n.tagName.toLowerCase(),
        o = n.parentElement;
      if (n.id) {
        t.unshift(`#${n.id}`);
        break;
      }
      const s = Array.from(n.classList).filter(
        e =>
          !(
            e.includes('component-') ||
            e.includes('delete-') ||
            e.includes('resizer') ||
            e.includes('selected')
          )
      );
      if ((s.length > 0 && (e += `.${s.join('.')}`), o)) {
        const t = Array.from(o.children).filter(e => e.tagName === n.tagName);
        if (t.length > 1) {
          e += `:nth-of-type(${t.indexOf(n) + 1})`;
        }
      }
      t.unshift(e), (n = o);
    }
    return t.join(' > ');
  }
  applyCSS(e) {
    this.styleElement.textContent = e;
  }
}
function A(e) {
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
class B {
  static init() {
    document.addEventListener('keydown', this.handleKeydown);
  }
  static handleKeydown(e) {
    if (e.ctrlKey || e.metaKey)
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault(), L.historyManager.undo();
          break;
        case 'y':
          e.preventDefault(), L.historyManager.redo();
      }
  }
}
class $ {
  setPreviewMode(e) {
    const t = document.getElementById('canvas');
    t.classList.forEach(e => {
      e.startsWith('preview-') && t.classList.remove(e);
    }),
      t.classList.add(`preview-${e}`);
  }
}
class H {
  constructor(
    e = { Basic: { components: [] }, Extra: [], Custom: {} },
    t = null,
    n = !0,
    o,
    s
  ) {
    (this.dynamicComponents = e),
      (this.initialDesign = t),
      (this.canvas = new L()),
      (this.sidebar = new M(this.canvas)),
      (this.htmlGenerator = new I(this.canvas)),
      (this.jsonStorage = new v()),
      (this.previewPanel = new $()),
      (this.editable = n),
      (this.brandTitle = o),
      (this.showAttributeTab = s),
      this.initializeEventListeners();
  }
  static resetHeaderFlag() {
    H.headerInitialized = !1;
  }
  initializeEventListeners() {
    (this.canvas = new L()),
      (this.sidebar = new M(this.canvas)),
      (this.htmlGenerator = new I(this.canvas)),
      (this.jsonStorage = new v()),
      (this.previewPanel = new $()),
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
            (Array.isArray(t) && t.length <= 0) ||
              (n.prepend(l),
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
              i.appendChild(n));
        }),
        n.appendChild(i);
    })(this.dynamicComponents, this.editable),
      L.init(this.initialDesign, this.editable, this.dynamicComponents.Basic),
      this.sidebar.init(),
      B.init(),
      w.init(
        this.dynamicComponents.Custom,
        this.editable,
        this.dynamicComponents.Basic,
        this.showAttributeTab
      ),
      this.createHeaderIfNeeded();
  }
  createHeaderIfNeeded() {
    if (document.getElementById('page-builder-header'))
      H.headerInitialized = !0;
    else {
      const e = document.getElementById('app');
      if (e && e.parentNode) {
        const t = document.createElement('header');
        (t.id = 'page-builder-header'),
          t.appendChild(
            (function (e, t = 'Page Builder', n) {
              const o = document.createElement('nav');
              o.id = 'preview-navbar';
              const s = {
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
                i = e
                  ? [
                      {
                        id: 'preview-desktop',
                        icon: s.desktop,
                        title: 'Preview in Desktop',
                      },
                      {
                        id: 'preview-tablet',
                        icon: s.tablet,
                        title: 'Preview in Tablet',
                      },
                      {
                        id: 'preview-mobile',
                        icon: s.mobile,
                        title: 'Preview in Mobile',
                      },
                      { id: 'undo-btn', icon: s.undo, title: 'Undo button' },
                      { id: 'redo-btn', icon: s.redo, title: 'Redo button' },
                      {
                        id: 'sidebar-menu',
                        icon: s.sidebarMenu,
                        title: 'Sidebar Menu',
                      },
                    ]
                  : [
                      {
                        id: 'preview-desktop',
                        icon: s.desktop,
                        title: 'Preview in Desktop',
                      },
                      {
                        id: 'preview-tablet',
                        icon: s.tablet,
                        title: 'Preview in Tablet',
                      },
                      {
                        id: 'preview-mobile',
                        icon: s.mobile,
                        title: 'Preview in Mobile',
                      },
                    ],
                l =
                  !0 === e || null === e
                    ? [
                        { id: 'view-btn', icon: s.view, title: 'View' },
                        { id: 'save-btn', icon: s.save, title: 'Save Layout' },
                        { id: 'reset-btn', icon: s.reset, title: 'Reset' },
                        { id: 'export-btn', icon: s.export, title: 'Export' },
                        {
                          id: 'menu-btn',
                          icon: s.menu,
                          title: 'Customization Menu',
                        },
                      ]
                    : !1 === e && !0 === n
                      ? [
                          { id: 'view-btn', icon: s.view, title: 'View' },
                          { id: 'export-btn', icon: s.export, title: 'Export' },
                          {
                            id: 'menu-btn',
                            icon: s.menu,
                            title: 'Customization Menu',
                          },
                        ]
                      : [
                          { id: 'view-btn', icon: s.view, title: 'View' },
                          { id: 'export-btn', icon: s.export, title: 'Export' },
                        ],
                a = document.createElement('div');
              a.classList.add('left-buttons'),
                i.forEach(({ id: e, icon: t, title: n }) => {
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
                    a.appendChild(o);
                });
              const r = document.createElement('div');
              r.classList.add('center-text'), (r.textContent = t);
              const d = document.createElement('div');
              return (
                d.classList.add('right-buttons'),
                l.forEach(({ id: e, icon: t, title: n }) => {
                  const o = document.createElement('button');
                  (o.id = e),
                    o.classList.add('preview-btn'),
                    (o.title = n),
                    (o.style.color = '#000'),
                    (o.innerHTML = t);
                  const s = o.querySelector('svg');
                  s && s.classList.add('nav-icon'),
                    d.appendChild(o),
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
                o.appendChild(a),
                o.appendChild(r),
                o.appendChild(d),
                o
              );
            })(this.editable, this.brandTitle, this.showAttributeTab)
          ),
          e.parentNode.insertBefore(t, e),
          (H.headerInitialized = !0);
      } else console.error('Error: #app not found in the DOM');
    }
  }
  setupSaveButton() {
    const e = document.getElementById('save-btn');
    e &&
      e.addEventListener('click', () => {
        const e = L.getState();
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
              L.clearCanvas(),
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
        const e = new I(new L()),
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
        const e = new I(new L()),
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
        const n = A([
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
        L.historyManager.undo();
      }),
      t &&
        t.addEventListener('click', () => {
          L.historyManager.redo();
        });
  }
}
H.headerInitialized = !1;
const T = new H();
(exports.PageBuilder = H), (exports.PageBuilderCore = T);

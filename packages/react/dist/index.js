'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod
  )
);
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  PageBuilderWrapper: () => PageBuilderWrapper,
});
module.exports = __toCommonJS(src_exports);

// src/components/PageBuilder.tsx
var import_react = __toESM(require('react'));
var import_PageBuilder = require('@mindfiredigital/page-builder-core/dist/PageBuilder.js');
var PageBuilderWrapper = ({ onInitialize }) => {
  const pageBuilderRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const pageBuilder = new import_PageBuilder.PageBuilder();
    pageBuilderRef.current = pageBuilder;
    if (onInitialize) {
      onInitialize(pageBuilder);
    }
    return () => {
      pageBuilderRef.current = null;
    };
  }, [onInitialize]);
  return /* @__PURE__ */ import_react.default.createElement(
    'div',
    { style: { margin: 'auto', width: '100%', height: '100%' } },
    /* @__PURE__ */ import_react.default.createElement(
      'header',
      null,
      /* @__PURE__ */ import_react.default.createElement('nav', {
        id: 'preview-navbar',
      })
    ),
    /* @__PURE__ */ import_react.default.createElement(
      'div',
      { id: 'app' },
      /* @__PURE__ */ import_react.default.createElement('div', {
        id: 'sidebar',
      }),
      /* @__PURE__ */ import_react.default.createElement('div', {
        id: 'canvas',
        className: 'canvas',
      }),
      /* @__PURE__ */ import_react.default.createElement(
        'div',
        { id: 'customization' },
        /* @__PURE__ */ import_react.default.createElement(
          'h4',
          { id: 'component-name' },
          'Component: None'
        ),
        /* @__PURE__ */ import_react.default.createElement('div', {
          id: 'controls',
        }),
        /* @__PURE__ */ import_react.default.createElement('div', {
          id: 'layers-view',
          className: 'hidden',
        })
      ),
      /* @__PURE__ */ import_react.default.createElement('div', {
        id: 'notification',
        className: 'notification hidden',
      }),
      /* @__PURE__ */ import_react.default.createElement(
        'div',
        { id: 'dialog', className: 'dialog hidden' },
        /* @__PURE__ */ import_react.default.createElement(
          'div',
          { className: 'dialog-content' },
          /* @__PURE__ */ import_react.default.createElement('p', {
            id: 'dialog-message',
          }),
          /* @__PURE__ */ import_react.default.createElement(
            'button',
            { id: 'dialog-yes', className: 'dialog-btn' },
            'Yes'
          ),
          /* @__PURE__ */ import_react.default.createElement(
            'button',
            { id: 'dialog-no', className: 'dialog-btn' },
            'No'
          )
        )
      )
    )
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    PageBuilderWrapper,
  });
//# sourceMappingURL=index.js.map

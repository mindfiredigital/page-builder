'use strict';

var React = require('react');
var Canvas_js = require('@mindfiredigital/page-builder-core/dist/canvas/Canvas.js');
var ConfigSidebar_js = require('@mindfiredigital/page-builder-core/dist/sidebar/ConfigSidebar.js');
var CustomizationSidebar_js = require('@mindfiredigital/page-builder-core/dist/sidebar/CustomizationSidebar.js');
var CreateSidebar_js = require('@mindfiredigital/page-builder-core/dist/sidebar/CreateSidebar.js');
var CreateNavbar_js = require('@mindfiredigital/page-builder-core/dist/navbar/CreateNavbar.js');
var HTMLGenerator_js = require('@mindfiredigital/page-builder-core/dist/services/HTMLGenerator.js');
var JSONStorage_js = require('@mindfiredigital/page-builder-core/dist/services/JSONStorage.js');
var ShortcutManager_js = require('@mindfiredigital/page-builder-core/dist/services/ShortcutManager.js');
var PreviewPanel_js = require('@mindfiredigital/page-builder-core/dist/canvas/PreviewPanel.js');
var utilityFunctions_js = require('@mindfiredigital/page-builder-core/dist/utils/utilityFunctions.js');
var zipGenerator_js = require('@mindfiredigital/page-builder-core/dist/utils/zipGenerator.js');
require('@mindfiredigital/page-builder-core/dist/styles/main.css');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var PageBuilder = ({
  className,
  initialContent,
  onSave,
  onReset,
  onExport,
  onStateChange,
  onError
}) => {
  const containerRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const sidebarRef = React.useRef(null);
  const previewPanelRef = React.useRef(null);
  const htmlGeneratorRef = React.useRef(null);
  const jsonStorageRef = React.useRef(null);
  React.useEffect(() => {
    try {
      if (!containerRef.current)
        return;
      canvasRef.current = new Canvas_js.Canvas();
      const canvas = canvasRef.current;
      sidebarRef.current = new ConfigSidebar_js.Sidebar(canvas);
      previewPanelRef.current = new PreviewPanel_js.PreviewPanel();
      htmlGeneratorRef.current = new HTMLGenerator_js.HTMLGenerator(canvas);
      jsonStorageRef.current = new JSONStorage_js.JSONStorage();
      CreateSidebar_js.createSidebar();
      Canvas_js.Canvas.init();
      sidebarRef.current.init();
      ShortcutManager_js.ShortcutManager.init();
      CustomizationSidebar_js.CustomizationSidebar.init();
      const header = document.createElement("header");
      header.appendChild(CreateNavbar_js.createNavbar());
      containerRef.current.insertBefore(header, containerRef.current.firstChild);
      if (initialContent) {
        jsonStorageRef.current.save(JSON.parse(initialContent));
      }
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
    return () => {
      try {
        canvasRef.current = null;
        sidebarRef.current = null;
        previewPanelRef.current = null;
        htmlGeneratorRef.current = null;
        jsonStorageRef.current = null;
      } catch (error) {
        onError == null ? void 0 : onError(error);
      }
    };
  }, [initialContent, onStateChange, onError]);
  const handleSave = React.useCallback(() => {
    var _a;
    try {
      const layoutJSON = Canvas_js.Canvas.getState();
      (_a = jsonStorageRef.current) == null ? void 0 : _a.save(layoutJSON);
      utilityFunctions_js.showNotification("Saving progress...");
      onSave == null ? void 0 : onSave(layoutJSON);
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onSave, onError]);
  const handleReset = React.useCallback(() => {
    utilityFunctions_js.showDialogBox(
      "Are you sure you want to reset the layout?",
      () => {
        var _a;
        try {
          (_a = jsonStorageRef.current) == null ? void 0 : _a.remove();
          Canvas_js.Canvas.clearCanvas();
          utilityFunctions_js.showNotification("The saved layout has been successfully reset.");
          onReset == null ? void 0 : onReset();
        } catch (error) {
          onError == null ? void 0 : onError(error);
        }
      },
      () => {
        console.log("Layout reset canceled.");
      }
    );
  }, [onReset, onError]);
  const handleExport = React.useCallback(() => {
    try {
      if (!htmlGeneratorRef.current)
        return;
      const html = htmlGeneratorRef.current.generateHTML();
      const css = htmlGeneratorRef.current.generateCSS();
      const zipFile = zipGenerator_js.createZipFile([
        { name: "index.html", content: html },
        { name: "styles.css", content: css }
      ]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipFile);
      link.download = "exported-files.zip";
      link.click();
      URL.revokeObjectURL(link.href);
      onExport == null ? void 0 : onExport(html, css);
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onExport, onError]);
  const setPreviewMode = React.useCallback((mode) => {
    var _a;
    try {
      (_a = previewPanelRef.current) == null ? void 0 : _a.setPreviewMode(mode);
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onError]);
  const handleUndo = React.useCallback(() => {
    try {
      Canvas_js.Canvas.historyManager.undo();
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onError]);
  const handleRedo = React.useCallback(() => {
    try {
      Canvas_js.Canvas.historyManager.redo();
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onError]);
  return /* @__PURE__ */ React__default.default.createElement("div", { className: `page-builder-wrapper ${className || ""}`, ref: containerRef }, /* @__PURE__ */ React__default.default.createElement("div", { className: "page-builder-toolbar" }, /* @__PURE__ */ React__default.default.createElement("button", { onClick: handleSave, id: "save-btn" }, "Save"), /* @__PURE__ */ React__default.default.createElement("button", { onClick: handleReset, id: "reset-btn" }, "Reset"), /* @__PURE__ */ React__default.default.createElement("button", { onClick: handleExport, id: "export-html-btn" }, "Export"), /* @__PURE__ */ React__default.default.createElement("div", { className: "history-controls" }, /* @__PURE__ */ React__default.default.createElement("button", { onClick: handleUndo, id: "undo-btn" }, "Undo"), /* @__PURE__ */ React__default.default.createElement("button", { onClick: handleRedo, id: "redo-btn" }, "Redo")), /* @__PURE__ */ React__default.default.createElement("div", { className: "preview-controls" }, /* @__PURE__ */ React__default.default.createElement("button", { onClick: () => setPreviewMode("desktop"), id: "preview-desktop" }, "Desktop"), /* @__PURE__ */ React__default.default.createElement("button", { onClick: () => setPreviewMode("tablet"), id: "preview-tablet" }, "Tablet"), /* @__PURE__ */ React__default.default.createElement("button", { onClick: () => setPreviewMode("mobile"), id: "preview-mobile" }, "Mobile"))), /* @__PURE__ */ React__default.default.createElement("div", { id: "app" }));
};

exports.PageBuilder = PageBuilder;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map
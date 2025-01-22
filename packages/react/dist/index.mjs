import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@mindfiredigital/page-builder-core/dist/canvas/Canvas.js';
import { Sidebar } from '@mindfiredigital/page-builder-core/dist/sidebar/ConfigSidebar.js';
import { CustomizationSidebar } from '@mindfiredigital/page-builder-core/dist/sidebar/CustomizationSidebar.js';
import { createSidebar } from '@mindfiredigital/page-builder-core/dist/sidebar/CreateSidebar.js';
import { createNavbar } from '@mindfiredigital/page-builder-core/dist/navbar/CreateNavbar.js';
import { HTMLGenerator } from '@mindfiredigital/page-builder-core/dist/services/HTMLGenerator.js';
import { JSONStorage } from '@mindfiredigital/page-builder-core/dist/services/JSONStorage.js';
import { ShortcutManager } from '@mindfiredigital/page-builder-core/dist/services/ShortcutManager.js';
import { PreviewPanel } from '@mindfiredigital/page-builder-core/dist/canvas/PreviewPanel.js';
import { showNotification, showDialogBox } from '@mindfiredigital/page-builder-core/dist/utils/utilityFunctions.js';
import { createZipFile } from '@mindfiredigital/page-builder-core/dist/utils/zipGenerator.js';
import '@mindfiredigital/page-builder-core/dist/styles/main.css';

var PageBuilder = ({
  className,
  initialContent,
  onSave,
  onReset,
  onExport,
  onStateChange,
  onError
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sidebarRef = useRef(null);
  const previewPanelRef = useRef(null);
  const htmlGeneratorRef = useRef(null);
  const jsonStorageRef = useRef(null);
  useEffect(() => {
    try {
      if (!containerRef.current)
        return;
      canvasRef.current = new Canvas();
      const canvas = canvasRef.current;
      sidebarRef.current = new Sidebar(canvas);
      previewPanelRef.current = new PreviewPanel();
      htmlGeneratorRef.current = new HTMLGenerator(canvas);
      jsonStorageRef.current = new JSONStorage();
      createSidebar();
      Canvas.init();
      sidebarRef.current.init();
      ShortcutManager.init();
      CustomizationSidebar.init();
      const header = document.createElement("header");
      header.appendChild(createNavbar());
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
  const handleSave = useCallback(() => {
    var _a;
    try {
      const layoutJSON = Canvas.getState();
      (_a = jsonStorageRef.current) == null ? void 0 : _a.save(layoutJSON);
      showNotification("Saving progress...");
      onSave == null ? void 0 : onSave(layoutJSON);
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onSave, onError]);
  const handleReset = useCallback(() => {
    showDialogBox(
      "Are you sure you want to reset the layout?",
      () => {
        var _a;
        try {
          (_a = jsonStorageRef.current) == null ? void 0 : _a.remove();
          Canvas.clearCanvas();
          showNotification("The saved layout has been successfully reset.");
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
  const handleExport = useCallback(() => {
    try {
      if (!htmlGeneratorRef.current)
        return;
      const html = htmlGeneratorRef.current.generateHTML();
      const css = htmlGeneratorRef.current.generateCSS();
      const zipFile = createZipFile([
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
  const setPreviewMode = useCallback((mode) => {
    var _a;
    try {
      (_a = previewPanelRef.current) == null ? void 0 : _a.setPreviewMode(mode);
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onError]);
  const handleUndo = useCallback(() => {
    try {
      Canvas.historyManager.undo();
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onError]);
  const handleRedo = useCallback(() => {
    try {
      Canvas.historyManager.redo();
    } catch (error) {
      onError == null ? void 0 : onError(error);
    }
  }, [onError]);
  return /* @__PURE__ */ React.createElement("div", { className: `page-builder-wrapper ${className || ""}`, ref: containerRef }, /* @__PURE__ */ React.createElement("div", { className: "page-builder-toolbar" }, /* @__PURE__ */ React.createElement("button", { onClick: handleSave, id: "save-btn" }, "Save"), /* @__PURE__ */ React.createElement("button", { onClick: handleReset, id: "reset-btn" }, "Reset"), /* @__PURE__ */ React.createElement("button", { onClick: handleExport, id: "export-html-btn" }, "Export"), /* @__PURE__ */ React.createElement("div", { className: "history-controls" }, /* @__PURE__ */ React.createElement("button", { onClick: handleUndo, id: "undo-btn" }, "Undo"), /* @__PURE__ */ React.createElement("button", { onClick: handleRedo, id: "redo-btn" }, "Redo")), /* @__PURE__ */ React.createElement("div", { className: "preview-controls" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPreviewMode("desktop"), id: "preview-desktop" }, "Desktop"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPreviewMode("tablet"), id: "preview-tablet" }, "Tablet"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPreviewMode("mobile"), id: "preview-mobile" }, "Mobile"))), /* @__PURE__ */ React.createElement("div", { id: "app" }));
};

export { PageBuilder };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.mjs.map
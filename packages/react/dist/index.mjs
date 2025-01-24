// src/components/PageBuilder.tsx
import React, { useEffect, useRef } from "react";
import { PageBuilder } from "@mindfiredigital/page-builder-core/dist/PageBuilder.js";
var PageBuilderWrapper = ({
  onInitialize
}) => {
  const pageBuilderRef = useRef(null);
  useEffect(() => {
    const pageBuilder = new PageBuilder();
    pageBuilderRef.current = pageBuilder;
    if (onInitialize) {
      onInitialize(pageBuilder);
    }
    return () => {
      pageBuilderRef.current = null;
    };
  }, [onInitialize]);
  return /* @__PURE__ */ React.createElement("div", { style: { margin: "auto", width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("nav", { id: "preview-navbar" })), /* @__PURE__ */ React.createElement("div", { id: "app" }, /* @__PURE__ */ React.createElement("div", { id: "sidebar" }), /* @__PURE__ */ React.createElement("div", { id: "canvas", className: "canvas" }), /* @__PURE__ */ React.createElement("div", { id: "customization" }, /* @__PURE__ */ React.createElement("h4", { id: "component-name" }, "Component: None"), /* @__PURE__ */ React.createElement("div", { id: "controls" }), /* @__PURE__ */ React.createElement("div", { id: "layers-view", className: "hidden" })), /* @__PURE__ */ React.createElement("div", { id: "notification", className: "notification hidden" }), /* @__PURE__ */ React.createElement("div", { id: "dialog", className: "dialog hidden" }, /* @__PURE__ */ React.createElement("div", { className: "dialog-content" }, /* @__PURE__ */ React.createElement("p", { id: "dialog-message" }), /* @__PURE__ */ React.createElement("button", { id: "dialog-yes", className: "dialog-btn" }, "Yes"), /* @__PURE__ */ React.createElement("button", { id: "dialog-no", className: "dialog-btn" }, "No")))));
};
export {
  PageBuilderWrapper
};
//# sourceMappingURL=index.mjs.map
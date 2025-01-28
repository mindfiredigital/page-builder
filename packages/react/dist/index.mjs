// src/components/PageBuilder.tsx
import React, { useEffect, useRef } from "react";
import { PageBuilder } from "@mindfiredigital/page-builder-core/dist/PageBuilder.js";
var PageBuilderWrapper = ({
  onInitialize,
  customStyles = {}
}) => {
  const pageBuilderRef = useRef(null);
  const wrapperRef = useRef(null);
  useEffect(() => {
    const setupDOMStructure = () => {
      if (!wrapperRef.current)
        return;
      wrapperRef.current.innerHTML = "";
      const appDiv = document.createElement("div");
      appDiv.id = "app";
      appDiv.innerHTML = `
        <div id="sidebar"></div>
        <div id="canvas" class="canvas"></div>
        <div id="customization">
          <h4 id="component-name">Component: None</h4>
          <div id="controls"></div>
          <div id="layers-view" class="hidden"></div>
        </div>
        <div id="notification" class="notification hidden"></div>
        <div id="dialog" class="dialog hidden">
          <div class="dialog-content">
            <p id="dialog-message"></p>
            <button id="dialog-yes" class="dialog-btn">Yes</button>
            <button id="dialog-no" class="dialog-btn">No</button>
          </div>
        </div>`;
      wrapperRef.current.appendChild(appDiv);
    };
    const initializePageBuilder = () => {
      try {
        if (!pageBuilderRef.current) {
          setupDOMStructure();
          const pageBuilder = new PageBuilder();
          pageBuilderRef.current = pageBuilder;
          if (onInitialize) {
            onInitialize(pageBuilder);
          }
          const event = new Event("DOMContentLoaded");
          document.dispatchEvent(event);
        }
      } catch (error) {
        console.error("Error initializing PageBuilder:", error);
      }
    };
    setTimeout(initializePageBuilder, 0);
    return () => {
      pageBuilderRef.current = null;
    };
  }, [onInitialize]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: wrapperRef,
      style: {
        margin: "auto",
        width: "100%",
        height: "100%",
        ...customStyles.wrapper
      }
    }
  );
};
export {
  PageBuilderWrapper
};
//# sourceMappingURL=index.mjs.map
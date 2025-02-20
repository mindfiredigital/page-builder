// src/components/PageBuilder.tsx
import React, { useEffect } from "react";
var PageBuilderReact = () => {
  useEffect(() => {
    import("@mindfiredigital/page-builder-web-component");
  }, []);
  return /* @__PURE__ */ React.createElement("page-builder", { style: { width: "100vw", height: "100vh" } });
};
export {
  PageBuilderReact
};
//# sourceMappingURL=index.mjs.map
import React, { useEffect } from "react";

export const PageBuilderReact: React.FC = () => {
  useEffect(() => {
    import("@mindfiredigital/page-builder-web-component");
  }, []);

  return <page-builder style={{ width: "100vw", height: "100vh" }} />;
};


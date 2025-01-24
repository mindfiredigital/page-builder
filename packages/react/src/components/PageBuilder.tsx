import React, { useEffect, useRef } from 'react';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

export interface PageBuilderWrapperProps {
  onInitialize?: (pageBuilder: PageBuilder) => void;
}

export const PageBuilderWrapper: React.FC<PageBuilderWrapperProps> = ({ 
  onInitialize 
}) => {
  const pageBuilderRef = useRef<PageBuilder | null>(null);

  useEffect(() => {
    // Create PageBuilder instance when component mounts
    const pageBuilder = new PageBuilder();
    pageBuilderRef.current = pageBuilder;

    if (onInitialize) {
      onInitialize(pageBuilder);
    }

    // Cleanup function
    return () => {
      pageBuilderRef.current = null;
    };
  }, [onInitialize]);

  return (
    <div style={{ margin: 'auto', width: '100%', height: '100%' }}>
      <header>
        <nav id="preview-navbar"></nav>
      </header>
      <div id="app">
        <div id="sidebar"></div>
        <div id="canvas" className="canvas"></div>
        <div id="customization">
          <h4 id="component-name">Component: None</h4>
          <div id="controls"></div>
          <div id="layers-view" className="hidden"></div>
        </div>
  
        {/* Notification for saving */}
        <div id="notification" className="notification hidden"></div>
  
        {/* Dialog for reset */}
        <div id="dialog" className="dialog hidden">
          <div className="dialog-content">
            <p id="dialog-message"></p>
            <button id="dialog-yes" className="dialog-btn">Yes</button>
            <button id="dialog-no" className="dialog-btn">No</button>
          </div>
        </div>
      </div>
    </div>
  );
}  

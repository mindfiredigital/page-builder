import React, { useEffect, useRef } from 'react';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

export interface PageBuilderReactProps {
  onInitialize?: (pageBuilder: PageBuilder) => void;
  customStyles?: {
    wrapper?: React.CSSProperties;
    sidebar?: React.CSSProperties;
    canvas?: React.CSSProperties;
    customization?: React.CSSProperties;
  };
}

//react wrapper for page builder
export const PageBuilderReact: React.FC<PageBuilderReactProps> = ({ 
  onInitialize,
  customStyles = {}
}) => {
  const pageBuilderRef = useRef<PageBuilder | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to set up the DOM structure
    const setupDOMStructure = () => {
      if (!wrapperRef.current) return;

      // Clear existing content
      wrapperRef.current.innerHTML = '';

      // Create the main app container
      const appDiv = document.createElement('div');
      appDiv.id = 'app';

      // Create required inner elements
      appDiv.innerHTML = 
      `
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
        </div>`
      ;

      wrapperRef.current.appendChild(appDiv);
    };

    // Initialize PageBuilder after DOM setup
    const initializePageBuilder = () => {
      try {
        if (!pageBuilderRef.current) {
          setupDOMStructure();

          // Create new PageBuilder instance
          const pageBuilder = new PageBuilder();
          pageBuilderRef.current = pageBuilder;

          if (onInitialize) {
            onInitialize(pageBuilder);
          }

          // Trigger DOMContentLoaded to initialize PageBuilder
          const event = new Event('DOMContentLoaded');
          document.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Error initializing PageBuilder:', error);
      }
    };

    // Small delay to ensure React has finished rendering
    setTimeout(initializePageBuilder, 0);

    return () => {
      pageBuilderRef.current = null;
    };
  }, [onInitialize]);

  return (
    <div 
      ref={wrapperRef}
      style={{ 
        margin: 'auto', 
        width: '100%', 
        height: '100%',
        ...customStyles.wrapper 
      }}
    />
  );
}
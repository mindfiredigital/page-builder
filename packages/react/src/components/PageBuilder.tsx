import React, { useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@mindfiredigital/page-builder-core/dist/canvas/Canvas.js';
import { Sidebar } from '@mindfiredigital/page-builder-core/dist/sidebar/ConfigSidebar.js';
import { CustomizationSidebar } from '@mindfiredigital/page-builder-core/dist/sidebar/CustomizationSidebar.js';
import { createSidebar } from '@mindfiredigital/page-builder-core/dist/sidebar/CreateSidebar.js';
import { createNavbar } from '@mindfiredigital/page-builder-core/dist/navbar/CreateNavbar.js';
import { HTMLGenerator } from '@mindfiredigital/page-builder-core/dist/services/HTMLGenerator.js';
import { JSONStorage } from '@mindfiredigital/page-builder-core/dist/services/JSONStorage.js';
import { ShortcutManager } from '@mindfiredigital/page-builder-core/dist/services/ShortcutManager.js';
import { PreviewPanel } from '@mindfiredigital/page-builder-core/dist/canvas/PreviewPanel.js';
import {
  showDialogBox,
  showNotification,
} from '@mindfiredigital/page-builder-core/dist/utils/utilityFunctions.js';
import { createZipFile } from '@mindfiredigital/page-builder-core/dist/utils/zipGenerator.js';
import '@mindfiredigital/page-builder-core/dist/styles/main.css';

export interface PageBuilderProps {
  className?: string;
  initialContent?: string;
  onSave?: (layoutJSON: any) => void;
  onReset?: () => void;
  onExport?: (html: string, css: string) => void;
  onStateChange?: (state: any) => void;
  onError?: (error: Error) => void;
}

export const PageBuilder: React.FC<PageBuilderProps> = ({
  className,
  initialContent,
  onSave,
  onReset,
  onExport,
  onStateChange,
  onError
}) => {
  // Refs for core instances
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<Canvas | null>(null);
  const sidebarRef = useRef<Sidebar | null>(null);
  const previewPanelRef = useRef<PreviewPanel | null>(null);
  const htmlGeneratorRef = useRef<HTMLGenerator | null>(null);
  const jsonStorageRef = useRef<JSONStorage | null>(null);

  // Initialize the page builder
  useEffect(() => {
    try {
      if (!containerRef.current) return;

      // Initialize core components
      canvasRef.current = new Canvas();
      const canvas = canvasRef.current;
      
      sidebarRef.current = new Sidebar(canvas);
      previewPanelRef.current = new PreviewPanel();
      htmlGeneratorRef.current = new HTMLGenerator(canvas);
      jsonStorageRef.current = new JSONStorage();

      // Initialize required elements
      createSidebar();
      Canvas.init();
      sidebarRef.current.init();
      ShortcutManager.init();
      CustomizationSidebar.init();

      // Create and append navbar
      const header = document.createElement('header');
      header.appendChild(createNavbar());
      containerRef.current.insertBefore(header, containerRef.current.firstChild);

      // Set initial content if provided
      if (initialContent) {
        jsonStorageRef.current.save(JSON.parse(initialContent));
      }

      // Set up state change listener
      // if (onStateChange) {
      //   // eslint-disable-next-line no-unused-vars
      //   const stateObserver = () => {
      //     const state = Canvas.getState();
      //     onStateChange(state);
      //   };
      //   // Add your state change listener here
      //   // You might need to modify your core to support this
      // }

    } catch (error) {
      onError?.(error as Error);
    }

    // Cleanup function
    return () => {
      try {
        // ShortcutManager.destroy?.();
        canvasRef.current = null;
        sidebarRef.current = null;
        previewPanelRef.current = null;
        htmlGeneratorRef.current = null;
        jsonStorageRef.current = null;
      } catch (error) {
        onError?.(error as Error);
      }
    };
  }, [initialContent, onStateChange, onError]);

  // Save handler
  const handleSave = useCallback(() => {
    try {
      const layoutJSON = Canvas.getState();
      jsonStorageRef.current?.save(layoutJSON);
      showNotification('Saving progress...');
      onSave?.(layoutJSON);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onSave, onError]);

  // Reset handler
  const handleReset = useCallback(() => {
    showDialogBox(
      'Are you sure you want to reset the layout?',
      () => {
        try {
          jsonStorageRef.current?.remove();
          Canvas.clearCanvas();
          showNotification('The saved layout has been successfully reset.');
          onReset?.();
        } catch (error) {
          onError?.(error as Error);
        }
      },
      () => {
        console.log('Layout reset canceled.');
      }
    );
  }, [onReset, onError]);

  // Export handler
  const handleExport = useCallback(() => {
    try {
      if (!htmlGeneratorRef.current) return;

      const html = htmlGeneratorRef.current.generateHTML();
      const css = htmlGeneratorRef.current.generateCSS();

      const zipFile = createZipFile([
        { name: 'index.html', content: html },
        { name: 'styles.css', content: css }
      ]);

      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipFile);
      link.download = 'exported-files.zip';
      link.click();
      URL.revokeObjectURL(link.href);

      onExport?.(html, css);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onExport, onError]);

  // Preview mode handlers
  const setPreviewMode = useCallback((mode: 'desktop' | 'tablet' | 'mobile') => {
    try {
      previewPanelRef.current?.setPreviewMode(mode);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onError]);

  // History handlers
  const handleUndo = useCallback(() => {
    try {
      Canvas.historyManager.undo();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onError]);

  const handleRedo = useCallback(() => {
    try {
      Canvas.historyManager.redo();
    } catch (error) {
      onError?.(error as Error);
    }
  }, [onError]);

  return (
    <div className={`page-builder-wrapper ${className || ''}`} ref={containerRef}>
      <div className="page-builder-toolbar">
        <button onClick={handleSave} id="save-btn">Save</button>
        <button onClick={handleReset} id="reset-btn">Reset</button>
        <button onClick={handleExport} id="export-html-btn">Export</button>
        <div className="history-controls">
          <button onClick={handleUndo} id="undo-btn">Undo</button>
          <button onClick={handleRedo} id="redo-btn">Redo</button>
        </div>
        <div className="preview-controls">
          <button onClick={() => setPreviewMode('desktop')} id="preview-desktop">Desktop</button>
          <button onClick={() => setPreviewMode('tablet')} id="preview-tablet">Tablet</button>
          <button onClick={() => setPreviewMode('mobile')} id="preview-mobile">Mobile</button>
        </div>
      </div>
      <div id="app"></div>
    </div>
  );
};

export default PageBuilder;
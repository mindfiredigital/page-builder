import React from 'react';

interface PageBuilderProps {
  className?: string;
  initialContent?: string;
  onSave?: (layoutJSON: any) => void;
  onReset?: () => void;
  onExport?: (html: string, css: string) => void;
  onStateChange?: (state: any) => void;
  onError?: (error: Error) => void;
}
declare const PageBuilder: React.FC<PageBuilderProps>;

export { PageBuilder };

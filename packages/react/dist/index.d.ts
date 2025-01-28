import React from 'react';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

interface PageBuilderReactProps {
  onInitialize?: (pageBuilder: PageBuilder) => void;
  customStyles?: {
    wrapper?: React.CSSProperties;
    sidebar?: React.CSSProperties;
    canvas?: React.CSSProperties;
    customization?: React.CSSProperties;
  };
}
declare const PageBuilderReact: React.FC<PageBuilderReactProps>;

export { PageBuilderReact, PageBuilderReactProps };

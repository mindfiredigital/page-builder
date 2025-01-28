import React from 'react';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

interface PageBuilderWrapperProps {
  onInitialize?: (pageBuilder: PageBuilder) => void;
  customStyles?: {
    wrapper?: React.CSSProperties;
    sidebar?: React.CSSProperties;
    canvas?: React.CSSProperties;
    customization?: React.CSSProperties;
  };
}
declare const PageBuilderWrapper: React.FC<PageBuilderWrapperProps>;

export { PageBuilderWrapper, PageBuilderWrapperProps };

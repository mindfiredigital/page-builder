import React from 'react';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

interface PageBuilderWrapperProps {
  onInitialize?: (pageBuilder: PageBuilder) => void;
}
declare const PageBuilderWrapper: React.FC<PageBuilderWrapperProps>;

export { PageBuilderWrapper, PageBuilderWrapperProps };

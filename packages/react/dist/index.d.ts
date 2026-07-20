import React$1 from 'react';
import { BasicComponent, PageBuilderDesign } from '@mindfiredigital/page-builder-web-component';
export { BasicComponent, ComponentAttribute, PageBuilderDesign } from '@mindfiredigital/page-builder-web-component';

/* ComponentAttribute, BasicComponent, and PageBuilderDesign are defined once
   in core (packages/core/src/types/types.d.ts) and re-exported through
   web-component — imported here rather than redeclared so this package can't
   silently drift from what core/web-component actually accept. Only shapes
   that are genuinely React-specific (because they carry React component
   references, not the post-bridging string/tag-name form core deals with)
   are declared locally below. */


interface DynamicComponents {
  Basic: BasicComponent[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}
interface CustomComponentConfig {
  component: React.ComponentType<any> | string;
  svg?: string;
  title?: string;
  settingsComponent?: React.ComponentType<any> | string;
  customizeComponent?: React.ComponentType<{ targetComponentId: string }>;
  defaultWidth?: string;
  defaultHeight?: string;
}

interface PageBuilderReactProps {
  config: DynamicComponents;
  customComponents?: Record<string, CustomComponentConfig>;
  initialDesign?: PageBuilderDesign;
  onChange?: (newDesign: PageBuilderDesign) => void;
  editable?: boolean;
  brandTitle?: string;
  showAttributeTab?: boolean;
  layoutMode?: 'absolute' | 'grid';
}

declare const PageBuilderReact: React$1.FC<PageBuilderReactProps>;

export { CustomComponentConfig, DynamicComponents, PageBuilderReact };

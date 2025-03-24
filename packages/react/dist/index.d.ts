import React from 'react';

interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom: Record<string, CustomComponentConfig>;
}
interface CustomComponentConfig {
  component: React.FC<any>;
  svg?: string;
  title?: string;
}
interface PageBuilderReactProps {
  config: DynamicComponents;
}
declare const PageBuilderReact: React.FC<PageBuilderReactProps>;

export { PageBuilderReact };

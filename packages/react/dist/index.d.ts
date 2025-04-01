import React from 'react';

interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}
interface CustomComponentConfig {
  component: React.ComponentType<any> | string;
  svg?: string;
  title?: string;
}
interface PageBuilderReactProps {
  config: DynamicComponents;
  customComponents?: Record<string, CustomComponentConfig>;
}
declare const PageBuilderReact: React.FC<PageBuilderReactProps>;

export { PageBuilderReact };

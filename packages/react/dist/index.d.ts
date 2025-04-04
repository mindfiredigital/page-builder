import React from 'react';

interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom: string[];
}
interface PageBuilderReactProps {
  config: DynamicComponents;
}
declare const PageBuilderReact: React.FC<PageBuilderReactProps>;

export { PageBuilderReact };

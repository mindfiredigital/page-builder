import React$1 from 'react';

interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}

interface PageBuilderDesign {
  pages?: Array<{
    id: string;
    components: Array<{
      type: string;
      id: string;
      props: Record<string, any>;
    }>;
  }>;
  [key: string]: any;
}
interface CustomComponentConfig {
  component: React.ComponentType<any> | string;
  svg?: string;
  title?: string;
  settingsComponent?: React.ComponentType<any> | string;
}

interface PageBuilderReactProps {
  config: DynamicComponents;
  customComponents?: Record<string, CustomComponentConfig>;

  /**
   * Optional initial design data to load into the Page Builder.
   * If provided, this design will override any existing design in localStorage
   * upon component initialization.
   */
  initialDesign?: PageBuilderDesign;

  /**
   * Callback function that is called whenever the Page Builder's design changes.
   * Receives the updated design metadata as an argument.
   */
  onChange?: (newDesign: PageBuilderDesign) => void;
  editable?: boolean;
}

declare const PageBuilderReact: React$1.FC<PageBuilderReactProps>;

export { DynamicComponents, PageBuilderDesign, PageBuilderReact };

import React$1 from 'react';

interface DynamicComponents {
  Basic: BasicComponent[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}

interface ComponentAttribute {
  id: string;
  type: 'Constant' | 'Formula' | 'Input' | 'Image';
  input_type?: 'text' | 'number' | 'checkbox';
  title: string;
  key: string;
  value: string | number | boolean;
  execute_order: number;
  editable?: boolean;
  default_value?: string | number | boolean | null;
}

interface BasicComponent {
  name: string;
  attributes?: ComponentAttribute[];
  globalExecuteFunction?: Function;
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
  initialDesign?: PageBuilderDesign;
  onChange?: (newDesign: PageBuilderDesign) => void;
  editable?: boolean;
  brandTitle?: string;
  showAttributeTab?: boolean;
  layoutMode?: 'absolute' | 'grid';
}

declare const PageBuilderReact: React$1.FC<PageBuilderReactProps>;

export {
  ComponentAttribute,
  DynamicComponents,
  PageBuilderDesign,
  PageBuilderReact,
};

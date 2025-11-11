export interface DynamicComponents {
  Basic: BasicComponent[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}

export interface ComponentAttribute {
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

export interface BasicComponent {
  name: string;
  attributes?: ComponentAttribute[];
  globalExecuteFunction?: Function;
}

export interface PageBuilderDesign {
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

export interface PageBuilderElement extends HTMLElement {
  configData: any;
  editable: boolean;
  initialDesign?: PageBuilderDesign | null;
  getDebugInfo?: any;
  brandTitle?: string;
  showAttributeTab?: boolean;
  layoutMode?: 'absolute' | 'grid';
}
export interface CustomComponentConfig {
  component: React.ComponentType<any> | string;
  svg?: string;
  title?: string;
  settingsComponent?: React.ComponentType<any> | string;
}

export interface PageBuilderReactProps {
  config: DynamicComponents;
  customComponents?: Record<string, CustomComponentConfig>;
  initialDesign?: PageBuilderDesign;
  onChange?: (newDesign: PageBuilderDesign) => void;
  editable?: boolean;
  brandTitle?: string;
  showAttributeTab?: boolean;
  layoutMode?: 'absolute' | 'grid';
}

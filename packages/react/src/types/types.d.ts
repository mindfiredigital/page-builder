export interface DynamicComponents {
  Basic: BasicComponent;
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}

export interface ComponentAttribute {
  id: string;
  type: 'Constant' | 'Formula' | 'Input' | 'Image';
  input_type: 'text' | 'number' | 'checkbox';
  title: string;
  value: string | number | boolean;
  key: string;
  execute_order: number;
  editable?: boolean;
}

export interface BasicComponent {
  components: {
    name: string;
    attributes?: ComponentAttribute[];
    globalExecuteFunction?: Function;
  }[];
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
  brandTitle?: string;
  showAttributeTab?: boolean;
}

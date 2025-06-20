export interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
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
  initialDesign?: PageBuilderDesign | null;
}
export interface CustomComponentConfig {
  component: React.ComponentType<any> | string;
  svg?: string;
  title?: string;
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
}

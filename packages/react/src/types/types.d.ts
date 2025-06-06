export interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}

export interface CustomComponentConfig {
  component: React.ComponentType<any> | string;
  svg?: string;
  title?: string;
}

export interface PageBuilderReactProps {
  config: DynamicComponents;
  customComponents?: Record<string, CustomComponentConfig>;
}

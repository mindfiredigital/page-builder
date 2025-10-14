declare global {
  // Define a type for component configuration options
  interface ComponentConfig {
    type: string;
    id: string;
    content?: string;
    styles?: ComponentStyles;
  }

  // Define a type for styles to apply on components
  interface ComponentStyles {
    color?: string;
    fontSize?: string;
    padding?: string;
    margin?: string;
    [key: string]: any;
  }

  // Define an interface for components stored on the canvas
  interface CanvasComponent {
    element: HTMLElement;
    config: ComponentConfig;
  }

  // Define types for drag and drop events
  interface DragEventHandlers {
    onDragStart: (event: DragEvent, componentId: string) => void;
    onDrop: (event: DragEvent) => void;
    onDragOver: (event: DragEvent) => void;
  }

  interface PageComponent {
    id: string;
    type: string;
    content: string;
    position: { x: number; y: number };
    dimensions: { width: number; height: number };
    style: { [key: string]: string };
    inlineStyle: string;
    classes: string[];
    dataAttributes: { [key: string]: string };
    imageSrc?: string | null;
    videoSrc?: string | null;
    props?: Record<string, any>;
  }

  // Define type for JSON data format for saving/loading
  interface LayoutData {
    components: ComponentConfig[];
  }

  // Assuming your PageBuilderDesign type looks something like this:
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
  // Define interface for Dynamic components
  interface DynamicComponents {
    Basic: BasicComponent[];
    Extra: string[];
    Custom: CustomComponentConfig;
  }

  // New interface for custom component settings
  interface CustomComponentSetting {
    name: string;
    functionName: string;
  }

  interface CustomComponentConfig {
    [key: string]: {
      component: string;
      svg?: string;
      title?: string;
      settingsComponent?: ReactComponentType<{ targetComponentId: string }>;
      settingsComponentTagName?: string;
      props?: Record<string, any>;
    };
  }

  // Define a union type for different device preview modes
  type DevicePreviewMode = 'desktop' | 'tablet' | 'mobile';
}

export {};

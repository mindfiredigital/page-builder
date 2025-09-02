import { Type } from '@angular/core';

export interface CustomStyles {
  wrapper?: { [key: string]: string | number };
  sidebar?: { [key: string]: string | number };
  canvas?: { [key: string]: string | number };
  customization?: { [key: string]: string | number };
}

// Define the interface for the custom components
export interface PageBuilderCustomComponent {
  component: Type<any>;
  svg: string;
  title: string;
  settingsComponent?: Type<any>;
}

// Define the interface for the main page builder config
export interface DynamicComponents {
  Basic: any[];
  Extra: any[];
  Custom: Record<
    string,
    {
      component: string;
      svg: string;
      title: string;
      settingsComponent?: string;
    }
  >;
}

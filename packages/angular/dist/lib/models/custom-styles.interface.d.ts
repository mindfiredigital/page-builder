import { Type } from '@angular/core';
export interface CustomStyles {
  wrapper?: {
    [key: string]: string | number;
  };
  sidebar?: {
    [key: string]: string | number;
  };
  canvas?: {
    [key: string]: string | number;
  };
  customization?: {
    [key: string]: string | number;
  };
}
export interface PageBuilderCustomComponent {
  component: Type<any>;
  svg: string;
  title: string;
  settingsComponent?: Type<any>;
}
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

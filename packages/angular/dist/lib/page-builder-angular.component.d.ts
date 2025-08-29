import {
  AfterViewInit,
  ElementRef,
  Type,
  ApplicationRef,
  Injector,
  EnvironmentInjector,
} from '@angular/core';
import * as i0 from '@angular/core';
export interface PageBuilderCustomComponent {
  component: Type<any>;
  svg: string;
  title: string;
  settingsComponent?: Type<any>;
}
interface DynamicComponents {
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
export declare class PageBuilderComponent implements AfterViewInit {
  private injector;
  private appRef;
  private envInjector;
  config: DynamicComponents;
  customComponents: Record<string, PageBuilderCustomComponent>;
  pageBuilderEl: ElementRef<HTMLElement>;
  constructor(
    injector: Injector,
    appRef: ApplicationRef,
    envInjector: EnvironmentInjector
  );
  ngAfterViewInit(): void;
  private processCustomComponents;
  static ɵfac: i0.ɵɵFactoryDeclaration<PageBuilderComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    PageBuilderComponent,
    'mf-page-builder',
    never,
    {
      config: { alias: 'config'; required: false };
      customComponents: { alias: 'customComponents'; required: false };
    },
    {},
    never,
    never,
    true,
    never
  >;
}
export {};

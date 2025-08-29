import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Type,
  ComponentRef,
  CUSTOM_ELEMENTS_SCHEMA,
  ApplicationRef,
  Injector,
  EnvironmentInjector,
  createComponent,
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Define the interface for the custom components
export interface PageBuilderCustomComponent {
  component: Type<any>;
  svg: string;
  title: string;
  settingsComponent?: Type<any>;
}

// Define the interface for the main page builder config
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

@Component({
  selector: 'mf-page-builder',
  standalone: true,
  imports: [CommonModule],
  template: `<page-builder #pageBuilderEl></page-builder>`,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageBuilderComponent implements AfterViewInit {
  @Input() config!: DynamicComponents;
  @Input() customComponents: Record<string, PageBuilderCustomComponent> = {};

  @ViewChild('pageBuilderEl') pageBuilderEl!: ElementRef<HTMLElement>;

  // Correctly inject dependencies in the constructor
  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private envInjector: EnvironmentInjector
  ) {}

  ngAfterViewInit(): void {
    this.processCustomComponents();
  }

  private processCustomComponents(): void {
    const processedConfig: DynamicComponents = {
      ...this.config,
      Custom: this.config?.Custom || {},
    };

    Object.entries(this.customComponents).forEach(([key, componentConfig]) => {
      const tagName = `ng-component-${key.toLowerCase()}`;

      if (!customElements.get(tagName)) {
        // Capture the injected dependencies from the parent component's scope.
        const injector = this.injector;
        const appRef = this.appRef;
        const envInjector = this.envInjector;

        // The class accesses the captured dependencies via closure
        class AngularHostElement extends HTMLElement {
          private componentRef: ComponentRef<any> | null = null;

          connectedCallback() {
            // Create the component in-place using the captured dependencies
            this.componentRef = createComponent(componentConfig.component, {
              environmentInjector: envInjector,
              elementInjector: injector,
              hostElement: this,
            });

            // Attach change detection
            appRef.attachView(this.componentRef.hostView);

            // Append the component's root node into this custom element
            this.appendChild(this.componentRef.location.nativeElement);
          }

          disconnectedCallback() {
            if (this.componentRef) {
              appRef.detachView(this.componentRef.hostView);
              this.componentRef.destroy();
              this.componentRef = null;
            }
          }
        }

        customElements.define(tagName, AngularHostElement);
      }

      processedConfig.Custom[key] = {
        component: tagName,
        svg: componentConfig.svg,
        title: componentConfig.title,
      };
    });

    this.pageBuilderEl.nativeElement.setAttribute(
      'config-data',
      JSON.stringify(processedConfig)
    );
  }
}

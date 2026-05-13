import { Component, Input, ViewChild, CUSTOM_ELEMENTS_SCHEMA, createComponent, } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as i0 from "@angular/core";
export class PageBuilderComponent {
    injector;
    appRef;
    envInjector;
    config;
    customComponents = {};
    pageBuilderEl;
    // Correctly inject dependencies in the constructor
    constructor(injector, appRef, envInjector) {
        this.injector = injector;
        this.appRef = appRef;
        this.envInjector = envInjector;
    }
    ngAfterViewInit() {
        this.processCustomComponents();
    }
    processCustomComponents() {
        const processedConfig = {
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
                    componentRef = null;
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
        this.pageBuilderEl.nativeElement.setAttribute('config-data', JSON.stringify(processedConfig));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.8", ngImport: i0, type: PageBuilderComponent, deps: [{ token: i0.Injector }, { token: i0.ApplicationRef }, { token: i0.EnvironmentInjector }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.8", type: PageBuilderComponent, isStandalone: true, selector: "mf-page-builder", inputs: { config: "config", customComponents: "customComponents" }, viewQueries: [{ propertyName: "pageBuilderEl", first: true, predicate: ["pageBuilderEl"], descendants: true }], ngImport: i0, template: `<page-builder #pageBuilderEl></page-builder>`, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.8", ngImport: i0, type: PageBuilderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'mf-page-builder',
                    standalone: true,
                    imports: [CommonModule],
                    template: `<page-builder #pageBuilderEl></page-builder>`,
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                }]
        }], ctorParameters: () => [{ type: i0.Injector }, { type: i0.ApplicationRef }, { type: i0.EnvironmentInjector }], propDecorators: { config: [{
                type: Input
            }], customComponents: [{
                type: Input
            }], pageBuilderEl: [{
                type: ViewChild,
                args: ['pageBuilderEl']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1idWlsZGVyLWFuZ3VsYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlLWJ1aWxkZXItYW5ndWxhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBRUwsU0FBUyxFQUdULHNCQUFzQixFQUl0QixlQUFlLEdBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFhL0MsTUFBTSxPQUFPLG9CQUFvQjtJQVFyQjtJQUNBO0lBQ0E7SUFURCxNQUFNLENBQXFCO0lBQzNCLGdCQUFnQixHQUErQyxFQUFFLENBQUM7SUFFL0MsYUFBYSxDQUEyQjtJQUVwRSxtREFBbUQ7SUFDbkQsWUFDVSxRQUFrQixFQUNsQixNQUFzQixFQUN0QixXQUFnQztRQUZoQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFxQjtJQUN2QyxDQUFDO0lBRUosZUFBZTtRQUNiLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsTUFBTSxlQUFlLEdBQXNCO1lBQ3pDLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRTtTQUNsQyxDQUFDO1FBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsRUFBRSxFQUFFO1lBQ3ZFLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUVwRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNqQyx1RUFBdUU7Z0JBQ3ZFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBRXJDLDJEQUEyRDtnQkFDM0QsTUFBTSxrQkFBbUIsU0FBUSxXQUFXO29CQUNsQyxZQUFZLEdBQTZCLElBQUksQ0FBQztvQkFFdEQsaUJBQWlCO3dCQUNmLGdFQUFnRTt3QkFDaEUsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRTs0QkFDN0QsbUJBQW1CLEVBQUUsV0FBVzs0QkFDaEMsZUFBZSxFQUFFLFFBQVE7NEJBQ3pCLFdBQVcsRUFBRSxJQUFJO3lCQUNsQixDQUFDLENBQUM7d0JBRUgsMEJBQTBCO3dCQUMxQixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRTlDLDREQUE0RDt3QkFDNUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDN0QsQ0FBQztvQkFFRCxvQkFBb0I7d0JBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUN0QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQzlDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO3dCQUMzQixDQUFDO29CQUNILENBQUM7aUJBQ0Y7Z0JBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRztnQkFDNUIsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLEdBQUcsRUFBRSxlQUFlLENBQUMsR0FBRztnQkFDeEIsS0FBSyxFQUFFLGVBQWUsQ0FBQyxLQUFLO2FBQzdCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FDM0MsYUFBYSxFQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQ2hDLENBQUM7SUFDSixDQUFDO3VHQTFFVSxvQkFBb0I7MkZBQXBCLG9CQUFvQiwrUEFIckIsOENBQThDLDJEQUQ5QyxZQUFZOzsyRkFJWCxvQkFBb0I7a0JBUGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsUUFBUSxFQUFFLDhDQUE4QztvQkFDeEQsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ2xDOztzQkFFRSxLQUFLOztzQkFDTCxLQUFLOztzQkFFTCxTQUFTO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBJbnB1dCxcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIFZpZXdDaGlsZCxcclxuICBFbGVtZW50UmVmLFxyXG4gIENvbXBvbmVudFJlZixcclxuICBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLFxyXG4gIEFwcGxpY2F0aW9uUmVmLFxyXG4gIEluamVjdG9yLFxyXG4gIEVudmlyb25tZW50SW5qZWN0b3IsXHJcbiAgY3JlYXRlQ29tcG9uZW50LFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge1xyXG4gIER5bmFtaWNDb21wb25lbnRzLFxyXG4gIFBhZ2VCdWlsZGVyQ3VzdG9tQ29tcG9uZW50LFxyXG59IGZyb20gJy4vbW9kZWxzL2N1c3RvbS1zdHlsZXMuaW50ZXJmYWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbWYtcGFnZS1idWlsZGVyJyxcclxuICBzdGFuZGFsb25lOiB0cnVlLFxyXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxyXG4gIHRlbXBsYXRlOiBgPHBhZ2UtYnVpbGRlciAjcGFnZUJ1aWxkZXJFbD48L3BhZ2UtYnVpbGRlcj5gLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFBhZ2VCdWlsZGVyQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgY29uZmlnITogRHluYW1pY0NvbXBvbmVudHM7XHJcbiAgQElucHV0KCkgY3VzdG9tQ29tcG9uZW50czogUmVjb3JkPHN0cmluZywgUGFnZUJ1aWxkZXJDdXN0b21Db21wb25lbnQ+ID0ge307XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ3BhZ2VCdWlsZGVyRWwnKSBwYWdlQnVpbGRlckVsITogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XHJcblxyXG4gIC8vIENvcnJlY3RseSBpbmplY3QgZGVwZW5kZW5jaWVzIGluIHRoZSBjb25zdHJ1Y3RvclxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBpbmplY3RvcjogSW5qZWN0b3IsXHJcbiAgICBwcml2YXRlIGFwcFJlZjogQXBwbGljYXRpb25SZWYsXHJcbiAgICBwcml2YXRlIGVudkluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXHJcbiAgKSB7fVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnByb2Nlc3NDdXN0b21Db21wb25lbnRzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHByb2Nlc3NDdXN0b21Db21wb25lbnRzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgcHJvY2Vzc2VkQ29uZmlnOiBEeW5hbWljQ29tcG9uZW50cyA9IHtcclxuICAgICAgLi4udGhpcy5jb25maWcsXHJcbiAgICAgIEN1c3RvbTogdGhpcy5jb25maWc/LkN1c3RvbSB8fCB7fSxcclxuICAgIH07XHJcblxyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5jdXN0b21Db21wb25lbnRzKS5mb3JFYWNoKChba2V5LCBjb21wb25lbnRDb25maWddKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRhZ05hbWUgPSBgbmctY29tcG9uZW50LSR7a2V5LnRvTG93ZXJDYXNlKCl9YDtcclxuXHJcbiAgICAgIGlmICghY3VzdG9tRWxlbWVudHMuZ2V0KHRhZ05hbWUpKSB7XHJcbiAgICAgICAgLy8gQ2FwdHVyZSB0aGUgaW5qZWN0ZWQgZGVwZW5kZW5jaWVzIGZyb20gdGhlIHBhcmVudCBjb21wb25lbnQncyBzY29wZS5cclxuICAgICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuaW5qZWN0b3I7XHJcbiAgICAgICAgY29uc3QgYXBwUmVmID0gdGhpcy5hcHBSZWY7XHJcbiAgICAgICAgY29uc3QgZW52SW5qZWN0b3IgPSB0aGlzLmVudkluamVjdG9yO1xyXG5cclxuICAgICAgICAvLyBUaGUgY2xhc3MgYWNjZXNzZXMgdGhlIGNhcHR1cmVkIGRlcGVuZGVuY2llcyB2aWEgY2xvc3VyZVxyXG4gICAgICAgIGNsYXNzIEFuZ3VsYXJIb3N0RWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgICAgICAgIHByaXZhdGUgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgICAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbXBvbmVudCBpbi1wbGFjZSB1c2luZyB0aGUgY2FwdHVyZWQgZGVwZW5kZW5jaWVzXHJcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudENvbmZpZy5jb21wb25lbnQsIHtcclxuICAgICAgICAgICAgICBlbnZpcm9ubWVudEluamVjdG9yOiBlbnZJbmplY3RvcixcclxuICAgICAgICAgICAgICBlbGVtZW50SW5qZWN0b3I6IGluamVjdG9yLFxyXG4gICAgICAgICAgICAgIGhvc3RFbGVtZW50OiB0aGlzLFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEF0dGFjaCBjaGFuZ2UgZGV0ZWN0aW9uXHJcbiAgICAgICAgICAgIGFwcFJlZi5hdHRhY2hWaWV3KHRoaXMuY29tcG9uZW50UmVmLmhvc3RWaWV3KTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFwcGVuZCB0aGUgY29tcG9uZW50J3Mgcm9vdCBub2RlIGludG8gdGhpcyBjdXN0b20gZWxlbWVudFxyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcclxuICAgICAgICAgICAgICBhcHBSZWYuZGV0YWNoVmlldyh0aGlzLmNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XHJcbiAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnRSZWYuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VzdG9tRWxlbWVudHMuZGVmaW5lKHRhZ05hbWUsIEFuZ3VsYXJIb3N0RWxlbWVudCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHByb2Nlc3NlZENvbmZpZy5DdXN0b21ba2V5XSA9IHtcclxuICAgICAgICBjb21wb25lbnQ6IHRhZ05hbWUsXHJcbiAgICAgICAgc3ZnOiBjb21wb25lbnRDb25maWcuc3ZnLFxyXG4gICAgICAgIHRpdGxlOiBjb21wb25lbnRDb25maWcudGl0bGUsXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnBhZ2VCdWlsZGVyRWwubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXHJcbiAgICAgICdjb25maWctZGF0YScsXHJcbiAgICAgIEpTT04uc3RyaW5naWZ5KHByb2Nlc3NlZENvbmZpZylcclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
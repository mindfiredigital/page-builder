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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1idWlsZGVyLWFuZ3VsYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlLWJ1aWxkZXItYW5ndWxhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBRUwsU0FBUyxFQUdULHNCQUFzQixFQUl0QixlQUFlLEdBQ2hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFhL0MsTUFBTSxPQUFPLG9CQUFvQjtJQVFyQjtJQUNBO0lBQ0E7SUFURCxNQUFNLENBQXFCO0lBQzNCLGdCQUFnQixHQUErQyxFQUFFLENBQUM7SUFFL0MsYUFBYSxDQUEyQjtJQUVwRSxtREFBbUQ7SUFDbkQsWUFDVSxRQUFrQixFQUNsQixNQUFzQixFQUN0QixXQUFnQztRQUZoQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLGdCQUFXLEdBQVgsV0FBVyxDQUFxQjtJQUN2QyxDQUFDO0lBRUosZUFBZTtRQUNiLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0lBQ2pDLENBQUM7SUFFTyx1QkFBdUI7UUFDN0IsTUFBTSxlQUFlLEdBQXNCO1lBQ3pDLEdBQUcsSUFBSSxDQUFDLE1BQU07WUFDZCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksRUFBRTtTQUNsQyxDQUFDO1FBRUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsRUFBRSxFQUFFO1lBQ3ZFLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUVwRCxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNqQyx1RUFBdUU7Z0JBQ3ZFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzNCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7Z0JBRXJDLDJEQUEyRDtnQkFDM0QsTUFBTSxrQkFBbUIsU0FBUSxXQUFXO29CQUNsQyxZQUFZLEdBQTZCLElBQUksQ0FBQztvQkFFdEQsaUJBQWlCO3dCQUNmLGdFQUFnRTt3QkFDaEUsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRTs0QkFDN0QsbUJBQW1CLEVBQUUsV0FBVzs0QkFDaEMsZUFBZSxFQUFFLFFBQVE7NEJBQ3pCLFdBQVcsRUFBRSxJQUFJO3lCQUNsQixDQUFDLENBQUM7d0JBRUgsMEJBQTBCO3dCQUMxQixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBRTlDLDREQUE0RDt3QkFDNUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDN0QsQ0FBQztvQkFFRCxvQkFBb0I7d0JBQ2xCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOzRCQUN0QixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQzlDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7NEJBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO3dCQUMzQixDQUFDO29CQUNILENBQUM7aUJBQ0Y7Z0JBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUNyRCxDQUFDO1lBRUQsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRztnQkFDNUIsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLEdBQUcsRUFBRSxlQUFlLENBQUMsR0FBRztnQkFDeEIsS0FBSyxFQUFFLGVBQWUsQ0FBQyxLQUFLO2FBQzdCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FDM0MsYUFBYSxFQUNiLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQ2hDLENBQUM7SUFDSixDQUFDO3VHQTFFVSxvQkFBb0I7MkZBQXBCLG9CQUFvQiwrUEFIckIsOENBQThDLDJEQUQ5QyxZQUFZOzsyRkFJWCxvQkFBb0I7a0JBUGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsUUFBUSxFQUFFLDhDQUE4QztvQkFDeEQsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ2xDOztzQkFFRSxLQUFLOztzQkFDTCxLQUFLOztzQkFFTCxTQUFTO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBBZnRlclZpZXdJbml0LFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIENvbXBvbmVudFJlZixcbiAgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSxcbiAgQXBwbGljYXRpb25SZWYsXG4gIEluamVjdG9yLFxuICBFbnZpcm9ubWVudEluamVjdG9yLFxuICBjcmVhdGVDb21wb25lbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIER5bmFtaWNDb21wb25lbnRzLFxuICBQYWdlQnVpbGRlckN1c3RvbUNvbXBvbmVudCxcbn0gZnJvbSAnLi9tb2RlbHMvY3VzdG9tLXN0eWxlcy5pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtZi1wYWdlLWJ1aWxkZXInLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgdGVtcGxhdGU6IGA8cGFnZS1idWlsZGVyICNwYWdlQnVpbGRlckVsPjwvcGFnZS1idWlsZGVyPmAsXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXSxcbn0pXG5leHBvcnQgY2xhc3MgUGFnZUJ1aWxkZXJDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgY29uZmlnITogRHluYW1pY0NvbXBvbmVudHM7XG4gIEBJbnB1dCgpIGN1c3RvbUNvbXBvbmVudHM6IFJlY29yZDxzdHJpbmcsIFBhZ2VCdWlsZGVyQ3VzdG9tQ29tcG9uZW50PiA9IHt9O1xuXG4gIEBWaWV3Q2hpbGQoJ3BhZ2VCdWlsZGVyRWwnKSBwYWdlQnVpbGRlckVsITogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgLy8gQ29ycmVjdGx5IGluamVjdCBkZXBlbmRlbmNpZXMgaW4gdGhlIGNvbnN0cnVjdG9yXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgaW5qZWN0b3I6IEluamVjdG9yLFxuICAgIHByaXZhdGUgYXBwUmVmOiBBcHBsaWNhdGlvblJlZixcbiAgICBwcml2YXRlIGVudkluamVjdG9yOiBFbnZpcm9ubWVudEluamVjdG9yXG4gICkge31cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wcm9jZXNzQ3VzdG9tQ29tcG9uZW50cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzQ3VzdG9tQ29tcG9uZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCBwcm9jZXNzZWRDb25maWc6IER5bmFtaWNDb21wb25lbnRzID0ge1xuICAgICAgLi4udGhpcy5jb25maWcsXG4gICAgICBDdXN0b206IHRoaXMuY29uZmlnPy5DdXN0b20gfHwge30sXG4gICAgfTtcblxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuY3VzdG9tQ29tcG9uZW50cykuZm9yRWFjaCgoW2tleSwgY29tcG9uZW50Q29uZmlnXSkgPT4ge1xuICAgICAgY29uc3QgdGFnTmFtZSA9IGBuZy1jb21wb25lbnQtJHtrZXkudG9Mb3dlckNhc2UoKX1gO1xuXG4gICAgICBpZiAoIWN1c3RvbUVsZW1lbnRzLmdldCh0YWdOYW1lKSkge1xuICAgICAgICAvLyBDYXB0dXJlIHRoZSBpbmplY3RlZCBkZXBlbmRlbmNpZXMgZnJvbSB0aGUgcGFyZW50IGNvbXBvbmVudCdzIHNjb3BlLlxuICAgICAgICBjb25zdCBpbmplY3RvciA9IHRoaXMuaW5qZWN0b3I7XG4gICAgICAgIGNvbnN0IGFwcFJlZiA9IHRoaXMuYXBwUmVmO1xuICAgICAgICBjb25zdCBlbnZJbmplY3RvciA9IHRoaXMuZW52SW5qZWN0b3I7XG5cbiAgICAgICAgLy8gVGhlIGNsYXNzIGFjY2Vzc2VzIHRoZSBjYXB0dXJlZCBkZXBlbmRlbmNpZXMgdmlhIGNsb3N1cmVcbiAgICAgICAgY2xhc3MgQW5ndWxhckhvc3RFbGVtZW50IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICAgICAgICAgIHByaXZhdGUgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuXG4gICAgICAgICAgY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNvbXBvbmVudCBpbi1wbGFjZSB1c2luZyB0aGUgY2FwdHVyZWQgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZiA9IGNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRDb25maWcuY29tcG9uZW50LCB7XG4gICAgICAgICAgICAgIGVudmlyb25tZW50SW5qZWN0b3I6IGVudkluamVjdG9yLFxuICAgICAgICAgICAgICBlbGVtZW50SW5qZWN0b3I6IGluamVjdG9yLFxuICAgICAgICAgICAgICBob3N0RWxlbWVudDogdGhpcyxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBBdHRhY2ggY2hhbmdlIGRldGVjdGlvblxuICAgICAgICAgICAgYXBwUmVmLmF0dGFjaFZpZXcodGhpcy5jb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuXG4gICAgICAgICAgICAvLyBBcHBlbmQgdGhlIGNvbXBvbmVudCdzIHJvb3Qgbm9kZSBpbnRvIHRoaXMgY3VzdG9tIGVsZW1lbnRcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb21wb25lbnRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGlzY29ubmVjdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgICAgICAgICAgYXBwUmVmLmRldGFjaFZpZXcodGhpcy5jb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXN0b21FbGVtZW50cy5kZWZpbmUodGFnTmFtZSwgQW5ndWxhckhvc3RFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgcHJvY2Vzc2VkQ29uZmlnLkN1c3RvbVtrZXldID0ge1xuICAgICAgICBjb21wb25lbnQ6IHRhZ05hbWUsXG4gICAgICAgIHN2ZzogY29tcG9uZW50Q29uZmlnLnN2ZyxcbiAgICAgICAgdGl0bGU6IGNvbXBvbmVudENvbmZpZy50aXRsZSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICB0aGlzLnBhZ2VCdWlsZGVyRWwubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAnY29uZmlnLWRhdGEnLFxuICAgICAgSlNPTi5zdHJpbmdpZnkocHJvY2Vzc2VkQ29uZmlnKVxuICAgICk7XG4gIH1cbn1cbiJdfQ==
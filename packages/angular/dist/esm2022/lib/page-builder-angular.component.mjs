import { Component, Input, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilder } from '@mindfiredigital/page-builder/dist/PageBuilder.js';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class PageBuilderComponent {
    elementRef;
    onInitialize;
    customStyles = {};
    pageBuilder = null;
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    ngOnInit() {
        // Initial setup if needed
    }
    ngAfterViewInit() {
        this.setupPageBuilder();
    }
    ngOnDestroy() {
        this.pageBuilder = null;
    }
    getWrapperStyles() {
        return {
            margin: 'auto',
            width: '100%',
            height: '100%',
            ...this.customStyles.wrapper,
        };
    }
    setupDOMStructure() {
        const wrapper = this.elementRef.nativeElement.querySelector('div');
        if (!wrapper)
            return;
        // Clear existing content
        wrapper.innerHTML = '';
        // Create the main app container
        const appDiv = document.createElement('div');
        appDiv.id = 'app';
        // Create required inner elements
        appDiv.innerHTML = `
      <div id="sidebar"></div>
      <div id="canvas" class="canvas"></div>
      <div id="customization">
        <h4 id="component-name">Component: None</h4>
        <div id="controls"></div>
        <div id="layers-view" class="hidden"></div>
      </div>
      <div id="notification" class="notification hidden"></div>
      <div id="dialog" class="dialog hidden">
        <div class="dialog-content">
          <p id="dialog-message"></p>
          <button id="dialog-yes" class="dialog-btn">Yes</button>
          <button id="dialog-no" class="dialog-btn">No</button>
        </div>
      </div>
    `;
        wrapper.appendChild(appDiv);
    }
    setupPageBuilder() {
        try {
            if (!this.pageBuilder) {
                this.setupDOMStructure();
                // Create new PageBuilder instance
                const pageBuilder = new PageBuilder();
                this.pageBuilder = pageBuilder;
                if (this.onInitialize) {
                    this.onInitialize(pageBuilder);
                }
                // Trigger DOMContentLoaded to initialize PageBuilder
                const event = new Event('DOMContentLoaded');
                document.dispatchEvent(event);
            }
        }
        catch (error) {
            console.error('Error initializing PageBuilder:', error);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.1.0", type: PageBuilderComponent, isStandalone: true, selector: "mf-page-builder", inputs: { onInitialize: "onInitialize", customStyles: "customStyles" }, ngImport: i0, template: ` <div #wrapper [ngStyle]="getWrapperStyles()"></div> `, isInline: true, styles: ["@import\"../../../node_modules/@mindfiredigital/page-builder/dist/styles/main.css\";\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.1.0", ngImport: i0, type: PageBuilderComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mf-page-builder', standalone: true, imports: [CommonModule], template: ` <div #wrapper [ngStyle]="getWrapperStyles()"></div> `, styles: ["@import\"../../../node_modules/@mindfiredigital/page-builder/dist/styles/main.css\";\n"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { onInitialize: [{
                type: Input
            }], customStyles: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1idWlsZGVyLWFuZ3VsYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9wYWdlLWJ1aWxkZXItYW5ndWxhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxLQUFLLEdBRU4sTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtREFBbUQsQ0FBQzs7O0FBVWhGLE1BQU0sT0FBTyxvQkFBb0I7SUFNWDtJQUxYLFlBQVksQ0FBc0M7SUFDbEQsWUFBWSxHQUFpQixFQUFFLENBQUM7SUFFakMsV0FBVyxHQUF1QixJQUFJLENBQUM7SUFFL0MsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtJQUFHLENBQUM7SUFFOUMsUUFBUTtRQUNOLDBCQUEwQjtJQUM1QixDQUFDO0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVNLGdCQUFnQjtRQUNyQixPQUFPO1lBQ0wsTUFBTSxFQUFFLE1BQU07WUFDZCxLQUFLLEVBQUUsTUFBTTtZQUNiLE1BQU0sRUFBRSxNQUFNO1lBQ2QsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU87U0FDN0IsQ0FBQztJQUNKLENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTztRQUVyQix5QkFBeUI7UUFDekIsT0FBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFFdkIsZ0NBQWdDO1FBQ2hDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFFbEIsaUNBQWlDO1FBQ2pDLE1BQU0sQ0FBQyxTQUFTLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQmxCLENBQUM7UUFFRixPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsSUFBSSxDQUFDO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBRXpCLGtDQUFrQztnQkFDbEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7Z0JBRS9CLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUNqQyxDQUFDO2dCQUVELHFEQUFxRDtnQkFDckQsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDNUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxDQUFDO1FBQ0gsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLGlDQUFpQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFELENBQUM7SUFDSCxDQUFDO3VHQWxGVSxvQkFBb0I7MkZBQXBCLG9CQUFvQixtSkFIckIsdURBQXVELCtKQUR2RCxZQUFZOzsyRkFJWCxvQkFBb0I7a0JBUGhDLFNBQVM7K0JBQ0UsaUJBQWlCLGNBQ2YsSUFBSSxXQUNQLENBQUMsWUFBWSxDQUFDLFlBQ2IsdURBQXVEOytFQUl4RCxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUGFnZUJ1aWxkZXIgfSBmcm9tICdAbWluZGZpcmVkaWdpdGFsL3BhZ2UtYnVpbGRlci9kaXN0L1BhZ2VCdWlsZGVyLmpzJztcbmltcG9ydCB7IEN1c3RvbVN0eWxlcyB9IGZyb20gJy4vbW9kZWxzL2N1c3RvbS1zdHlsZXMuaW50ZXJmYWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWYtcGFnZS1idWlsZGVyJyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIHRlbXBsYXRlOiBgIDxkaXYgI3dyYXBwZXIgW25nU3R5bGVdPVwiZ2V0V3JhcHBlclN0eWxlcygpXCI+PC9kaXY+IGAsXG4gIHN0eWxlVXJsczogWycuL3N0eWxlcy9zdHlsZXMuc2NzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBQYWdlQnVpbGRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgb25Jbml0aWFsaXplPzogKHBhZ2VCdWlsZGVyOiBQYWdlQnVpbGRlcikgPT4gdm9pZDtcbiAgQElucHV0KCkgY3VzdG9tU3R5bGVzOiBDdXN0b21TdHlsZXMgPSB7fTtcblxuICBwcml2YXRlIHBhZ2VCdWlsZGVyOiBQYWdlQnVpbGRlciB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBJbml0aWFsIHNldHVwIGlmIG5lZWRlZFxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0dXBQYWdlQnVpbGRlcigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5wYWdlQnVpbGRlciA9IG51bGw7XG4gIH1cblxuICBwdWJsaWMgZ2V0V3JhcHBlclN0eWxlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWFyZ2luOiAnYXV0bycsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAuLi50aGlzLmN1c3RvbVN0eWxlcy53cmFwcGVyLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHNldHVwRE9NU3RydWN0dXJlKCk6IHZvaWQge1xuICAgIGNvbnN0IHdyYXBwZXIgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYnKTtcbiAgICBpZiAoIXdyYXBwZXIpIHJldHVybjtcblxuICAgIC8vIENsZWFyIGV4aXN0aW5nIGNvbnRlbnRcbiAgICB3cmFwcGVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBtYWluIGFwcCBjb250YWluZXJcbiAgICBjb25zdCBhcHBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBhcHBEaXYuaWQgPSAnYXBwJztcblxuICAgIC8vIENyZWF0ZSByZXF1aXJlZCBpbm5lciBlbGVtZW50c1xuICAgIGFwcERpdi5pbm5lckhUTUwgPSBgXG4gICAgICA8ZGl2IGlkPVwic2lkZWJhclwiPjwvZGl2PlxuICAgICAgPGRpdiBpZD1cImNhbnZhc1wiIGNsYXNzPVwiY2FudmFzXCI+PC9kaXY+XG4gICAgICA8ZGl2IGlkPVwiY3VzdG9taXphdGlvblwiPlxuICAgICAgICA8aDQgaWQ9XCJjb21wb25lbnQtbmFtZVwiPkNvbXBvbmVudDogTm9uZTwvaDQ+XG4gICAgICAgIDxkaXYgaWQ9XCJjb250cm9sc1wiPjwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwibGF5ZXJzLXZpZXdcIiBjbGFzcz1cImhpZGRlblwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGlkPVwibm90aWZpY2F0aW9uXCIgY2xhc3M9XCJub3RpZmljYXRpb24gaGlkZGVuXCI+PC9kaXY+XG4gICAgICA8ZGl2IGlkPVwiZGlhbG9nXCIgY2xhc3M9XCJkaWFsb2cgaGlkZGVuXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJkaWFsb2ctY29udGVudFwiPlxuICAgICAgICAgIDxwIGlkPVwiZGlhbG9nLW1lc3NhZ2VcIj48L3A+XG4gICAgICAgICAgPGJ1dHRvbiBpZD1cImRpYWxvZy15ZXNcIiBjbGFzcz1cImRpYWxvZy1idG5cIj5ZZXM8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGlkPVwiZGlhbG9nLW5vXCIgY2xhc3M9XCJkaWFsb2ctYnRuXCI+Tm88L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChhcHBEaXYpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cFBhZ2VCdWlsZGVyKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIXRoaXMucGFnZUJ1aWxkZXIpIHtcbiAgICAgICAgdGhpcy5zZXR1cERPTVN0cnVjdHVyZSgpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgUGFnZUJ1aWxkZXIgaW5zdGFuY2VcbiAgICAgICAgY29uc3QgcGFnZUJ1aWxkZXIgPSBuZXcgUGFnZUJ1aWxkZXIoKTtcbiAgICAgICAgdGhpcy5wYWdlQnVpbGRlciA9IHBhZ2VCdWlsZGVyO1xuXG4gICAgICAgIGlmICh0aGlzLm9uSW5pdGlhbGl6ZSkge1xuICAgICAgICAgIHRoaXMub25Jbml0aWFsaXplKHBhZ2VCdWlsZGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRyaWdnZXIgRE9NQ29udGVudExvYWRlZCB0byBpbml0aWFsaXplIFBhZ2VCdWlsZGVyXG4gICAgICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50KCdET01Db250ZW50TG9hZGVkJyk7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgUGFnZUJ1aWxkZXI6JywgZXJyb3IpO1xuICAgIH1cbiAgfVxufVxuIl19
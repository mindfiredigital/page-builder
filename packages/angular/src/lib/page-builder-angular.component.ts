import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Input,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';
import { CustomStyles } from './models/custom-styles.interface';

@Component({
  selector: 'mf-page-builder',
  standalone: true,
  imports: [CommonModule],
  template: ` <div #wrapper [ngStyle]="getWrapperStyles()"></div> `,
  styleUrls: ['./styles/styles.scss'],
})
export class PageBuilderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() onInitialize?: (pageBuilder: PageBuilder) => void;
  @Input() customStyles: CustomStyles = {};

  private pageBuilder: PageBuilder | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Initial setup if needed
  }

  ngAfterViewInit(): void {
    this.setupPageBuilder();
  }

  ngOnDestroy(): void {
    this.pageBuilder = null;
  }

  public getWrapperStyles() {
    return {
      margin: 'auto',
      width: '100%',
      height: '100%',
      ...this.customStyles.wrapper,
    };
  }

  private setupDOMStructure(): void {
    const wrapper = this.elementRef.nativeElement.querySelector('div');
    if (!wrapper) return;

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

  private setupPageBuilder(): void {
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
    } catch (error) {
      console.error('Error initializing PageBuilder:', error);
    }
  }
}

import { OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';
import { CustomStyles } from './models/custom-styles.interface';
import * as i0 from '@angular/core';
export declare class PageBuilderComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private elementRef;
  onInitialize?: (pageBuilder: PageBuilder) => void;
  customStyles: CustomStyles;
  private pageBuilder;
  constructor(elementRef: ElementRef);
  ngOnInit(): void;
  ngAfterViewInit(): void;
  ngOnDestroy(): void;
  getWrapperStyles(): {
    margin: string;
    width: string;
    height: string;
  };
  private setupDOMStructure;
  private setupPageBuilder;
  static ɵfac: i0.ɵɵFactoryDeclaration<PageBuilderComponent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<
    PageBuilderComponent,
    'mf-page-builder',
    never,
    {
      onInitialize: { alias: 'onInitialize'; required: false };
      customStyles: { alias: 'customStyles'; required: false };
    },
    {},
    never,
    never,
    true,
    never
  >;
}

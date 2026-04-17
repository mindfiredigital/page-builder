import { ModalComponent } from './ModalManager';
export declare class TableComponent {
  static tableAttributeConfig: ComponentAttribute[];
  private modalComponent;
  constructor();
  create(
    rowCount: number,
    columnCount: number,
    isPreview: boolean | undefined,
    tableAttributeConfig: ComponentAttribute[] | undefined | [] | null
  ): HTMLElement;
  evaluateRowVisibility(
    inputValues: Record<string, any>,
    table?: HTMLElement
  ): void;
  seedFormulaValues(values: Record<string, any>): void;
  updateInputValues(values: Record<string, any>): void;
  updateCellContent(cell: HTMLElement, attribute: ComponentAttribute): void;
  addRows(tableWrapper: HTMLElement, tableId: string, count?: number): void;
  setModalComponent(modalComponent: ModalComponent): void;
  static restore(container: HTMLElement, editable: boolean | null): void;
}

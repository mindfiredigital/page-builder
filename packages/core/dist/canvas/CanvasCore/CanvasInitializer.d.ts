import type { LayoutMode } from './CanvasTypes';
export declare class CanvasInitializer {
  private static deleteElementHandler;
  static init(
    initialData: (PageBuilderDesign | null) | undefined,
    editable: boolean | null,
    basicComponentsConfig: BasicComponent[],
    layoutMode: LayoutMode
  ): void;
  private static applyComponentConfigs;
}

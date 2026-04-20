export interface NavButton {
  id: string;
  icon: string;
  title: string;
  isPreview?: boolean;
}
export declare function getLeftButtons(editable: boolean | null): NavButton[];
export declare function getRightButtons(
  editable: boolean | null,
  showAttributeTab?: boolean
): NavButton[];

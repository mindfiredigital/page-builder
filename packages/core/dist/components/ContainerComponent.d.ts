export declare class ContainerComponent {
  private element;
  private resizers;
  constructor();
  create(): HTMLElement;
  static restoreContainer(
    container: HTMLElement,
    editable?: boolean | null
  ): void;
}

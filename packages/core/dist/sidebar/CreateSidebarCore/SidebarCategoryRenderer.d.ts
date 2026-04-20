/** Union of all valid values that can be passed as a category's component list */
type CategoryComponents = BasicComponent[] | string[] | CustomComponentConfig;
export declare function renderCategory(
  category: string,
  components: CategoryComponents,
  templatesMenu: HTMLElement
): void;
export {};

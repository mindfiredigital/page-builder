import { PageBuilder } from './PageBuilder';

// Export the class
export { PageBuilder };

// Export the instance
export const PageBuilderCore = new PageBuilder();

// Shared public types — single source of truth for downstream packages
// (web-component, react) instead of hand-copied redeclarations.
export type {
  PageComponent,
  PageBuilderDesign,
  ComponentAttribute,
  BasicComponent,
  ComponentProps,
} from './types/shared';

/* Minimum pixel size a container can be resized to */
export const MINIMUM_SIZE = 20;

/* Describes a single resizer handle — its CSS class and cursor style */
export interface ResizerPosition {
  class: string;
  cursor: string;
}

/* All four corner resizer handle definitions */
export const RESIZER_POSITIONS: ResizerPosition[] = [
  { class: 'top-left', cursor: 'nwse-resize' },
  { class: 'top-right', cursor: 'nesw-resize' },
  { class: 'bottom-left', cursor: 'nesw-resize' },
  { class: 'bottom-right', cursor: 'nwse-resize' },
];

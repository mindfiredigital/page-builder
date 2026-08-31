/** Function for toggling notification */
export declare function showNotification(message: string): void;
/** Function for handling dialog box, where confirmation and cancellation functions are passed as parameters */
export declare function showDialogBox(message: string, onConfirm: () => void, onCancel: () => void): void;
export declare function syntaxHighlightHTML(html: string): string;
export declare function syntaxHighlightCSS(css: string): string;
/** Generic debounce — the callback type is preserved through the overload */
export declare function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, delay: number): (...args: Parameters<T>) => void;

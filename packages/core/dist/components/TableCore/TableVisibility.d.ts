/** Handles conditional row visibility based on dynamic input values and rules */
/** Evaluates and applies show/hide visibility to all table rows matching the given rules */
export declare function EvaluateRowVisibility(
  inputValues: AttributeValues,
  table?: HTMLElement
): void;
/** Evaluates a single visibility rule against the current input value */
export declare function EvaluateRule(
  inputValue: string,
  operator: string,
  ruleValue: string
): boolean;

// src/store/CtcStore.ts
import { create } from 'zustand';

// Define the interface for a CTC Definition (replicated from your CtcDefinitionManager)
export interface CtcDefinition {
  id?: number;
  template_id: number;
  ctc_definition_type_id: number; // 1: Input, 2: Constant, 3: Formula, 4: Image (as per your constants)
  ctc_value_type_id: number; // e.g., 1: Number, 2: String, 3: Boolean
  is_ctc_attribute: boolean; // Indicates if it's an input field for the user
  key: string; // Unique identifier for the definition (e.g., 'basic-salary', 'hra')
  title: string;
  value: string; // The literal value, formula string, or initial input value
  priority_order_of_evaluation: number; // Lower numbers evaluated first
  component_json_path?: string | null; // JSON path to where this value should be injected in PageBuilder design
  created_at?: string;
  updated_at?: string;
}

// Define the shape of the CTC calculation state
interface CtcState {
  // Array of all CTC definitions, sorted by priority
  definitions: CtcDefinition[];
  // Map to store calculated values (key -> value)
  calculatedValues: Map<string, any>;
  // Map to store user-provided input values for ctc_attributes (key -> value)
  inputAttributeValues: Map<string, any>;
  // Status of calculation
  calculationStatus: 'idle' | 'calculating' | 'completed' | 'error';
  calculationError: string | null;

  // Actions
  setDefinitions: (defs: CtcDefinition[]) => void;
  setInputAttributeValue: (key: string, value: any) => void;
  initializeInputAttributes: (defs: CtcDefinition[]) => void;
  calculateAllCtcValues: () => void;
  getCalculatedValue: (key: string) => any;
}

// Helper function to evaluate a formula string
const evaluateFormula = (formula: string, values: Map<string, any>): any => {
  // Regex to find {key} patterns
  const regex = /{([^}]+)}/g;
  let evaluatedFormula = formula;
  let match;

  // Replace all {key} with their corresponding values
  while ((match = regex.exec(formula)) !== null) {
    const key = match[1]; // The content inside {}
    const value = values.get(key);
    if (value === undefined || value === null) {
      console.warn(
        `CTC Calculation: Key "${key}" not found for formula "${formula}"`
      );
      // Depending on strictness, you might want to throw an error or return NaN/0
      return NaN; // Indicate calculation failure if a dependency is missing
    }
    // Replace all occurrences of the placeholder with the actual value
    evaluatedFormula = evaluatedFormula.split(match[0]).join(String(value));
  }

  try {
    // Use Function constructor for safe evaluation
    // Ensure all values are converted to numbers for arithmetic operations
    // This is a basic evaluator; for complex math, a dedicated math library might be needed
    return new Function('return ' + evaluatedFormula)();
  } catch (error) {
    console.error(
      `CTC Calculation: Error evaluating formula "${formula}":`,
      error
    );
    return NaN; // Return NaN on error
  }
};

export const useCtcStore = create<CtcState>((set, get) => ({
  definitions: [],
  calculatedValues: new Map(),
  inputAttributeValues: new Map(),
  calculationStatus: 'idle',
  calculationError: null,

  setDefinitions: defs => {
    set({ definitions: defs });
    // When definitions are set, re-initialize input attributes and trigger calculation
    get().initializeInputAttributes(defs);
    get().calculateAllCtcValues();
  },

  // Initialize input attributes from definitions, preserving existing user inputs if possible
  initializeInputAttributes: defs => {
    const newInputAttributeValues = new Map<string, any>();
    const currentInputAttributeValues = get().inputAttributeValues;

    defs.forEach(def => {
      if (def.is_ctc_attribute) {
        // If an input value already exists, preserve it. Otherwise, use the default from definition.
        newInputAttributeValues.set(
          def.key,
          currentInputAttributeValues.has(def.key)
            ? currentInputAttributeValues.get(def.key)
            : def.value
        );
      }
    });
    set({ inputAttributeValues: newInputAttributeValues });
  },

  // Set a specific user input attribute value and trigger recalculation
  setInputAttributeValue: (key, value) => {
    set(state => {
      const newMap = new Map(state.inputAttributeValues);
      newMap.set(key, value);
      return { inputAttributeValues: newMap };
    });
    get().calculateAllCtcValues(); // Recalculate after input change
  },

  // Main calculation logic
  calculateAllCtcValues: () => {
    set({ calculationStatus: 'calculating', calculationError: null });
    const { definitions, inputAttributeValues } = get();
    const newCalculatedValues = new Map<string, any>();
    let errorOccurred = false;

    try {
      // Step 1: Initialize calculatedValues with inputs and constants
      definitions.forEach(def => {
        if (def.is_ctc_attribute) {
          // Use user-provided input if available, otherwise the default from definition
          newCalculatedValues.set(
            def.key,
            inputAttributeValues.has(def.key)
              ? inputAttributeValues.get(def.key)
              : def.value
          );
        } else if (def.ctc_definition_type_id === 2) {
          // Constant
          newCalculatedValues.set(def.key, def.value);
        }
        // For formulas (type 3) and images (type 4), initially set to null/undefined or their value string
        // They will be calculated in the next step based on priority
      });

      // Step 2: Sort definitions by priority for formula evaluation
      const sortedDefinitions = [...definitions].sort(
        (a, b) =>
          a.priority_order_of_evaluation - b.priority_order_of_evaluation
      );

      // Step 3: Evaluate formulas based on priority
      sortedDefinitions.forEach(def => {
        if (def.ctc_definition_type_id === 3) {
          // Formula
          try {
            const calculatedValue = evaluateFormula(
              def.value,
              newCalculatedValues
            );
            if (isNaN(calculatedValue) && typeof calculatedValue === 'number') {
              throw new Error(
                `Formula for "${def.key}" evaluated to NaN. Check dependencies.`
              );
            }
            newCalculatedValues.set(def.key, calculatedValue);
          } catch (err: any) {
            console.error(
              `Error calculating formula for key "${def.key}":`,
              err
            );
            newCalculatedValues.set(def.key, `ERROR: ${err.message}`);
            errorOccurred = true;
            set({
              calculationError: `Failed to calculate formula for ${def.key}: ${err.message}`,
            });
          }
        } else if (def.ctc_definition_type_id === 4) {
          // Image or other types that just use their value
          // For image components, the 'value' might be a URL or reference.
          // For now, we'll just set it directly.
          newCalculatedValues.set(def.key, def.value);
        }
      });

      set({
        calculatedValues: newCalculatedValues,
        calculationStatus: errorOccurred ? 'error' : 'completed',
        calculationError: errorOccurred ? get().calculationError : null, // Preserve first error if multiple
      });
    } catch (err: any) {
      console.error('Critical error during CTC calculation:', err);
      set({
        calculatedValues: new Map(),
        calculationStatus: 'error',
        calculationError: `A critical error occurred during calculation: ${err.message}`,
      });
      errorOccurred = true;
    }
  },

  getCalculatedValue: (key: string) => {
    return get().calculatedValues.get(key);
  },
}));

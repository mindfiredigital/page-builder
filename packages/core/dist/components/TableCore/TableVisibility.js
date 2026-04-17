/* Handles conditional row visibility based on dynamic input values and rules */
/* Evaluates and applies show/hide visibility to all table rows matching the given rules */
export function EvaluateRowVisibility(inputValues, table) {
  /* Select rows scoped to a specific table or globally across the document */
  let allRows;
  if (table) {
    allRows = table.querySelectorAll('.table-row');
  } else {
    allRows = document.querySelectorAll('.table-row');
  }
  allRows.forEach(row => {
    const rulesAttribute = row.getAttribute('data-visibility-rules');
    /* Rows with no rules are always visible */
    if (!rulesAttribute) {
      row.style.display = 'grid';
      return;
    }
    try {
      const rules = JSON.parse(rulesAttribute);
      /* Empty rules array means always visible */
      if (rules.length === 0) {
        row.style.display = 'grid';
        return;
      }
      let isVisible = true;
      rules.forEach(rule => {
        const inputValue = inputValues[rule.inputKey];
        if (inputValue) {
          const isConditionMet = EvaluateRule(
            inputValue,
            rule.operator,
            rule.value
          );
          if (isConditionMet) {
            if (rule.action === 'hide') {
              isVisible = false;
            } else if (rule.action === 'show') {
              isVisible = true;
            }
          } else {
            /* When a "show" condition is NOT met the row should be hidden */
            if (rule.action === 'show') {
              isVisible = false;
            }
          }
        }
      });
      row.style.display = isVisible ? 'grid' : 'none';
    } catch (e) {
      console.error('Failed to parse or evaluate visibility rules:', e);
    }
  });
}
/* Evaluates a single visibility rule against the current input value */
export function EvaluateRule(inputValue, operator, ruleValue) {
  const numInputValue = parseFloat(inputValue);
  const numRuleValue = parseFloat(ruleValue);
  const lowerCaseInputValue = inputValue.toLowerCase();
  const lowerCaseRuleValue = ruleValue.toLowerCase();
  switch (operator) {
    case 'equals':
      return lowerCaseInputValue === lowerCaseRuleValue;
    case 'not_equals':
      return lowerCaseInputValue !== lowerCaseRuleValue;
    case 'greater_than':
      return (
        !isNaN(numInputValue) &&
        !isNaN(numRuleValue) &&
        numInputValue > numRuleValue
      );
    case 'less_than':
      return (
        !isNaN(numInputValue) &&
        !isNaN(numRuleValue) &&
        numInputValue < numRuleValue
      );
    case 'contains':
      return lowerCaseInputValue.includes(lowerCaseRuleValue);
    default:
      return false;
  }
}

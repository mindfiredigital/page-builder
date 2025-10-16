/**
 * The global execution function that calculates formula attributes.
 * The keys in the inputValues object are the 'key' properties of the Input attributes.
 * * @param {object} inputValues - An object where keys are the 'key' (e.g., 'input-a-key') of Input attributes.
 * @returns {object} An object containing the calculated results, where keys are the 'title' of the Formula attributes.
 */
export const localExecuteFunction = (inputValues: {
  'input-a-key': string | number | null;
  'input-b-key': string | number | null;
}) => {
  const A = Number(inputValues['input-a-key']) || 0;
  const B = Number(inputValues['input-b-key']) || 0;

  const sumResult = A + B;
  const productResult = A * B;

  return {
    'formula-sum-key': sumResult,
    'formula-product-key': productResult,
  };
};

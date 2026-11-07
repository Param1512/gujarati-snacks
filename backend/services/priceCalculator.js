/**
 * Dynamic Weight-Based Pricing Engine for Gujarati Homemade Snacks
 * 
 * Rules:
 * - All internal inventory is managed in GRAMS.
 * - Weights supported: 250g, 500g, 1000g (1kg), 2000g (2kg).
 * - Exact formula: (pricePerKg * weightGrams) / 1000
 * - Never trust client-submitted prices!
 */

const calculateItemUnitPrice = (pricePerKg, weightGrams) => {
  if (!pricePerKg || !weightGrams) {
    throw new Error('Price per kg and weight in grams are required');
  }
  const rawPrice = (pricePerKg * weightGrams) / 1000;
  return Math.round(rawPrice);
};

const validateWeightOption = (weightGrams) => {
  const allowedWeights = [250, 500, 1000, 2000];
  return allowedWeights.includes(Number(weightGrams));
};

const getWeightLabel = (weightGrams) => {
  const map = {
    250: '250 g',
    500: '500 g',
    1000: '1 kg',
    2000: '2 kg',
  };
  return map[weightGrams] || `${weightGrams} g`;
};

module.exports = {
  calculateItemUnitPrice,
  validateWeightOption,
  getWeightLabel,
};


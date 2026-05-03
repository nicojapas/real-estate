export function calculateAfADeduction(
  propertyValue: number,
  buildingValueRatio: number,
  afaRate: number
): number {
  const buildingValue = propertyValue * buildingValueRatio;
  return buildingValue * (afaRate / 100);
}

export function checkPersonalUseImpact(personalUseMonths: number): {
  deductibilityRatio: number;
  warning: boolean;
} {
  const personalUseRatio = personalUseMonths / 12;

  if (personalUseRatio > 0.1) {
    return {
      deductibilityRatio: 1 - personalUseRatio,
      warning: true,
    };
  }

  return { deductibilityRatio: 1, warning: false };
}

// Simplified German progressive tax calculation
// In reality, the formula is more complex with zones
const TAX_BRACKETS = [
  { threshold: 11604, rate: 0 },
  { threshold: 17005, rate: 0.14 },
  { threshold: 66760, rate: 0.24 },
  { threshold: 277825, rate: 0.42 },
  { threshold: Infinity, rate: 0.45 },
];

export function estimateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  let previousThreshold = 0;

  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= previousThreshold) break;

    const taxableInBracket = Math.min(
      taxableIncome - previousThreshold,
      bracket.threshold - previousThreshold
    );

    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }

    previousThreshold = bracket.threshold;
  }

  return tax;
}

export function calculateTaxableRentalIncome(
  netRentalIncome: number,
  totalCosts: number,
  mortgageInterest: number,
  afaDeduction: number,
  deductibilityRatio: number
): number {
  const deductibleCosts = (totalCosts + mortgageInterest + afaDeduction) * deductibilityRatio;
  return Math.max(0, netRentalIncome - deductibleCosts);
}

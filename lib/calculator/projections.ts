import { PropertyInputs, BerlinDefaults, CalculatedResults, YearlyProjection } from './types';
import { calculatePurchaseCosts } from './purchaseCosts';
import { calculateMonthlyPayment, calculateTotalInterest, generateAmortizationSchedule } from './mortgage';
import { calculateEffectiveRentalIncome, calculateOngoingCosts } from './rental';
import { calculateAfADeduction, checkPersonalUseImpact, calculateTaxableRentalIncome, estimateIncomeTax } from './tax';

export function getPropertyValue(inputs: PropertyInputs): number {
  if (inputs.inputMode === 'total') {
    return inputs.totalValue;
  }
  return inputs.pricePerSqm * inputs.squareMeters;
}

export function getDownPayment(inputs: PropertyInputs, propertyValue: number): number {
  if (inputs.downPaymentMode === 'amount') {
    return inputs.downPaymentAmount;
  }
  return propertyValue * (inputs.downPaymentPercent / 100);
}

export function calculateAll(
  inputs: PropertyInputs,
  defaults: BerlinDefaults
): CalculatedResults {
  const propertyValue = getPropertyValue(inputs);
  const squareMeters = inputs.inputMode === 'total'
    ? inputs.squareMeters
    : inputs.squareMeters;

  const purchaseCosts = calculatePurchaseCosts(propertyValue, defaults, inputs.includeBroker);
  const totalPurchasePrice = propertyValue + purchaseCosts.total;

  const downPayment = getDownPayment(inputs, propertyValue);
  const loanAmount = totalPurchasePrice - downPayment;

  const monthlyPayment = calculateMonthlyPayment(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );
  const totalInterestPaid = calculateTotalInterest(
    loanAmount,
    monthlyPayment,
    inputs.loanTermYears
  );

  const rentalIncome = calculateEffectiveRentalIncome(
    inputs.monthlyRentalIncome,
    inputs.personalUseMonths,
    inputs.occupancyRate
  );

  const ongoingCosts = calculateOngoingCosts(
    squareMeters,
    propertyValue,
    defaults.hausgeldPerSqm,
    defaults.grundsteuerAnnual,
    defaults.insuranceRate
  );

  const afaDeduction = calculateAfADeduction(
    propertyValue,
    defaults.buildingValueRatio,
    defaults.afaRate
  );

  const personalUseImpact = checkPersonalUseImpact(inputs.personalUseMonths);

  // First year interest (approximate)
  const firstYearInterest = loanAmount * (inputs.interestRate / 100);

  const taxableIncome = calculateTaxableRentalIncome(
    rentalIncome.netAnnual,
    ongoingCosts.totalAnnual,
    firstYearInterest,
    afaDeduction,
    personalUseImpact.deductibilityRatio
  );

  const estimatedTax = estimateIncomeTax(taxableIncome);

  const annualCashFlow =
    rentalIncome.netAnnual -
    ongoingCosts.totalAnnual -
    monthlyPayment * 12 -
    estimatedTax;

  const monthlyCashFlow = annualCashFlow / 12;

  const cashOnCashReturn = downPayment > 0
    ? (annualCashFlow / downPayment) * 100
    : 0;

  // Break-even calculation (simplified)
  const breakEvenYears = annualCashFlow > 0
    ? 0
    : annualCashFlow < 0
      ? Math.ceil(Math.abs(downPayment + purchaseCosts.total) / Math.abs(annualCashFlow))
      : Infinity;

  return {
    propertyValue,
    squareMeters,
    purchaseCosts,
    totalPurchasePrice,
    loanAmount,
    downPayment,
    monthlyPayment,
    totalInterestPaid,
    annualHausgeld: ongoingCosts.annualHausgeld,
    annualGrundsteuer: ongoingCosts.annualGrundsteuer,
    annualInsurance: ongoingCosts.annualInsurance,
    totalAnnualCosts: ongoingCosts.totalAnnual,
    grossAnnualRental: rentalIncome.grossAnnual,
    effectiveRentalMonths: rentalIncome.effectiveMonths,
    netAnnualRental: rentalIncome.netAnnual,
    afaDeduction,
    taxableIncome,
    estimatedTax,
    personalUseWarning: personalUseImpact.warning,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCashReturn,
    breakEvenYears,
  };
}

export function generateYearlyProjections(
  inputs: PropertyInputs,
  defaults: BerlinDefaults,
  years: number = 30
): YearlyProjection[] {
  const propertyValue = getPropertyValue(inputs);
  const purchaseCosts = calculatePurchaseCosts(propertyValue, defaults, inputs.includeBroker);
  const totalPurchasePrice = propertyValue + purchaseCosts.total;
  const downPayment = getDownPayment(inputs, propertyValue);
  const loanAmount = totalPurchasePrice - downPayment;

  const amortization = generateAmortizationSchedule(
    loanAmount,
    inputs.interestRate,
    inputs.loanTermYears
  );

  const results = calculateAll(inputs, defaults);
  const annualCashFlow = results.annualCashFlow;

  const projections: YearlyProjection[] = [];
  let cumulativeCashFlow = -downPayment - purchaseCosts.total;

  for (let year = 1; year <= years; year++) {
    const yearEndMonth = Math.min(year * 12, amortization.length);
    const yearEntry = amortization[yearEndMonth - 1];

    const loanBalance = yearEntry ? yearEntry.balance : 0;
    const principalPaid = yearEntry ? yearEntry.cumulativePrincipal : loanAmount;
    const interestPaid = yearEntry ? yearEntry.cumulativeInterest : results.totalInterestPaid;

    const appreciatedValue = propertyValue * Math.pow(1 + inputs.appreciationRate / 100, year);
    const equity = appreciatedValue - loanBalance;

    cumulativeCashFlow += annualCashFlow;

    const totalReturn = equity + cumulativeCashFlow - downPayment;

    projections.push({
      year,
      loanBalance,
      equity,
      cumulativeCashFlow,
      propertyValue: appreciatedValue,
      totalReturn,
      principalPaid,
      interestPaid,
    });
  }

  return projections;
}

import { PropertyInputs, BerlinDefaults, CalculatedResults, YearlyProjection, Conclusions } from './types';
import { calculatePurchaseCosts } from './purchaseCosts';
import { calculateMonthlyPayment, calculateTotalInterest, generateAmortizationSchedule, generateAcceleratedAmortization } from './mortgage';
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

  const results = calculateAll(inputs, defaults);

  // Calculate the monthly cash available for extra payments
  // This is rental income minus costs (excluding mortgage payment)
  const monthlyCashBeforeMortgage =
    (results.netAnnualRental - results.totalAnnualCosts - results.estimatedTax) / 12;

  // For accelerated repayment, use positive cash flow as extra payment
  const extraMonthlyPayment = inputs.acceleratedRepayment && monthlyCashBeforeMortgage > results.monthlyPayment
    ? monthlyCashBeforeMortgage - results.monthlyPayment
    : 0;

  const amortization = inputs.acceleratedRepayment && extraMonthlyPayment > 0
    ? generateAcceleratedAmortization(
        loanAmount,
        inputs.interestRate,
        inputs.loanTermYears,
        extraMonthlyPayment
      ).schedule
    : generateAmortizationSchedule(
        loanAmount,
        inputs.interestRate,
        inputs.loanTermYears
      );

  const projections: YearlyProjection[] = [];

  // Year 0: Initial state at purchase
  const initialEquity = propertyValue - loanAmount;
  const initialCashFlow = -downPayment - purchaseCosts.total;

  projections.push({
    year: 0,
    loanBalance: loanAmount,
    equity: initialEquity,
    cumulativeCashFlow: initialCashFlow,
    propertyValue: propertyValue,
    totalReturn: initialEquity + initialCashFlow - downPayment,
    principalPaid: 0,
    interestPaid: 0,
  });

  let cumulativeCashFlow = initialCashFlow;

  for (let year = 1; year <= years; year++) {
    const yearEndMonth = Math.min(year * 12, amortization.length);
    const yearEntry = amortization[yearEndMonth - 1];

    const loanBalance = yearEntry ? yearEntry.balance : 0;
    const principalPaid = yearEntry ? yearEntry.cumulativePrincipal : loanAmount;
    const interestPaid = yearEntry ? yearEntry.cumulativeInterest : results.totalInterestPaid;

    const appreciatedValue = propertyValue * Math.pow(1 + inputs.appreciationRate / 100, year);
    const equity = appreciatedValue - loanBalance;

    // In accelerated mode with positive cash flow, all cash goes to loan
    // So cumulative cash flow stays flat (we're not accumulating cash)
    if (inputs.acceleratedRepayment && loanBalance > 0 && extraMonthlyPayment > 0) {
      // No cash accumulation while paying down loan
      cumulativeCashFlow = initialCashFlow;
    } else {
      // Normal mode or loan paid off: accumulate cash
      cumulativeCashFlow += results.annualCashFlow;
    }

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

export function calculateConclusions(
  inputs: PropertyInputs,
  defaults: BerlinDefaults,
  projections: YearlyProjection[]
): Conclusions {
  const propertyValue = getPropertyValue(inputs);
  const purchaseCosts = calculatePurchaseCosts(propertyValue, defaults, inputs.includeBroker);
  const totalPurchasePrice = propertyValue + purchaseCosts.total;
  const downPayment = getDownPayment(inputs, propertyValue);
  const loanAmount = totalPurchasePrice - downPayment;
  const results = calculateAll(inputs, defaults);

  // Initial equity vs what was paid
  const initialEquity = projections[0]?.equity ?? 0;
  const equityLostToFees = downPayment - initialEquity;

  // When is the loan paid off?
  const loanPaidOffYear = inputs.loanTermYears;

  // When does cumulative cash flow become positive?
  const cashFlowPositiveYear = projections.find(p => p.cumulativeCashFlow >= 0)?.year ?? null;

  // When is the total investment recovered? (equity + cash flow > initial outlay)
  const totalInvested = downPayment + purchaseCosts.total;
  const investmentRecoveredYear = projections.find(p => {
    const netPosition = p.equity + p.cumulativeCashFlow;
    return netPosition >= totalInvested;
  })?.year ?? null;

  // Calculate accelerated repayment comparison
  const monthlyCashBeforeMortgage =
    (results.netAnnualRental - results.totalAnnualCosts - results.estimatedTax) / 12;
  const extraMonthlyPayment = monthlyCashBeforeMortgage > results.monthlyPayment
    ? monthlyCashBeforeMortgage - results.monthlyPayment
    : 0;

  // Standard amortization totals
  const standardTotalInterest = results.totalInterestPaid;

  // Accelerated repayment if cash flow positive
  let acceleratedPayoffYear: number | null = null;
  let acceleratedTotalInterest = standardTotalInterest;
  let yearsShaved = 0;
  let interestSaved = 0;

  if (extraMonthlyPayment > 0) {
    const accelerated = generateAcceleratedAmortization(
      loanAmount,
      inputs.interestRate,
      inputs.loanTermYears,
      extraMonthlyPayment
    );
    acceleratedPayoffYear = Math.ceil(accelerated.payoffMonths / 12);
    acceleratedTotalInterest = accelerated.totalInterest;
    yearsShaved = loanPaidOffYear - acceleratedPayoffYear;
    interestSaved = standardTotalInterest - acceleratedTotalInterest;
  }

  // Values at milestones
  const year10 = projections.find(p => p.year === 10);
  const year20 = projections.find(p => p.year === 20);

  const equityAt10Years = year10?.equity ?? 0;
  const equityAt20Years = year20?.equity ?? 0;

  // Total profit = equity + cumulative cash flow - initial investment
  const totalProfitAt10Years = year10
    ? year10.equity + year10.cumulativeCashFlow - totalInvested + initialEquity
    : 0;
  const totalProfitAt20Years = year20
    ? year20.equity + year20.cumulativeCashFlow - totalInvested + initialEquity
    : 0;

  const isPositiveCashFlow = results.annualCashFlow >= 0;
  const isGoodInvestment = investmentRecoveredYear !== null && investmentRecoveredYear <= 15;

  return {
    initialEquity,
    equityLostToFees,
    loanPaidOffYear,
    cashFlowPositiveYear,
    investmentRecoveredYear,
    acceleratedPayoffYear,
    yearsShaved,
    interestSaved,
    standardTotalInterest,
    acceleratedTotalInterest,
    equityAt10Years,
    equityAt20Years,
    totalProfitAt10Years,
    totalProfitAt20Years,
    isPositiveCashFlow,
    isGoodInvestment,
  };
}

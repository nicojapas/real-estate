export interface PropertyInputs {
  // Property value mode
  inputMode: 'total' | 'perSqm';
  totalValue: number;
  pricePerSqm: number;
  squareMeters: number;

  // Financing
  downPaymentMode: 'amount' | 'percentage';
  downPaymentAmount: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;

  // Rental
  monthlyRentalIncome: number;
  personalUseMonths: number;
  occupancyRate: number;

  // Cost toggles
  includeBroker: boolean;

  // Appreciation
  appreciationRate: number;

  // Repayment strategy
  acceleratedRepayment: boolean;
}

export interface BerlinDefaults {
  propertyTransferTax: number;
  notaryFees: number;
  landRegistryFees: number;
  brokerFees: number;
  hausgeldPerSqm: number;
  grundsteuerAnnual: number;
  insuranceRate: number;
  afaRate: number;
  buildingValueRatio: number;
}

export interface PurchaseCosts {
  propertyTransferTax: number;
  notaryFees: number;
  landRegistryFees: number;
  brokerFees: number;
  total: number;
}

export interface CalculatedResults {
  // Property
  propertyValue: number;
  squareMeters: number;

  // Purchase costs
  purchaseCosts: PurchaseCosts;
  totalPurchasePrice: number;

  // Loan
  loanAmount: number;
  downPayment: number;
  monthlyPayment: number;
  totalInterestPaid: number;

  // Annual costs
  annualHausgeld: number;
  annualGrundsteuer: number;
  annualInsurance: number;
  totalAnnualCosts: number;

  // Rental income
  grossAnnualRental: number;
  effectiveRentalMonths: number;
  netAnnualRental: number;

  // Tax
  afaDeduction: number;
  taxableIncome: number;
  estimatedTax: number;
  personalUseWarning: boolean;

  // Cash flow
  monthlyCashFlow: number;
  annualCashFlow: number;

  // Returns
  cashOnCashReturn: number;
  breakEvenYears: number;
}

export interface YearlyProjection {
  year: number;
  loanBalance: number;
  equity: number;
  cumulativeCashFlow: number;
  propertyValue: number;
  totalReturn: number;
  principalPaid: number;
  interestPaid: number;
}

export interface MarketRanges {
  min: number;
  max: number;
  step: number;
}

export interface Conclusions {
  // Initial state
  initialEquity: number;
  equityLostToFees: number;

  // Timeline milestones
  loanPaidOffYear: number;
  cashFlowPositiveYear: number | null;
  investmentRecoveredYear: number | null;

  // Accelerated repayment comparison
  acceleratedPayoffYear: number | null;
  yearsShaved: number;
  interestSaved: number;
  standardTotalInterest: number;
  acceleratedTotalInterest: number;

  // Long-term projections
  equityAt10Years: number;
  equityAt20Years: number;
  totalProfitAt10Years: number;
  totalProfitAt20Years: number;

  // Summary flags
  isPositiveCashFlow: boolean;
  isGoodInvestment: boolean;
}

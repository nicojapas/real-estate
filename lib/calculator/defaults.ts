import { BerlinDefaults, PropertyInputs, MarketRanges } from './types';

export const BERLIN_DEFAULTS: BerlinDefaults = {
  // Purchase costs (Kaufnebenkosten)
  propertyTransferTax: 6.0,
  notaryFees: 1.5,
  landRegistryFees: 0.5,
  brokerFees: 3.57,

  // Ongoing costs
  hausgeldPerSqm: 3.5,
  grundsteuerAnnual: 400,
  insuranceRate: 0.1,

  // Tax parameters
  afaRate: 2.0,
  buildingValueRatio: 0.8,
};

export const INITIAL_INPUTS: PropertyInputs = {
  inputMode: 'total',
  totalValue: 350000,
  pricePerSqm: 5000,
  squareMeters: 70,

  downPaymentMode: 'percentage',
  downPaymentAmount: 70000,
  downPaymentPercent: 20,
  interestRate: 3.75,
  loanTermYears: 25,

  monthlyRentalIncome: 2500,
  personalUseMonths: 2,
  occupancyRate: 80,

  includeBroker: false,
  appreciationRate: 2,
  acceleratedRepayment: false,
};

export const MARKET_RANGES: Record<string, MarketRanges> = {
  totalValue: { min: 100000, max: 1000000, step: 10000 },
  pricePerSqm: { min: 3000, max: 10000, step: 100 },
  squareMeters: { min: 20, max: 200, step: 5 },
  downPaymentPercent: { min: 10, max: 50, step: 5 },
  downPaymentAmount: { min: 10000, max: 500000, step: 5000 },
  interestRate: { min: 2, max: 6, step: 0.05 },
  loanTermYears: { min: 10, max: 35, step: 1 },
  monthlyRentalIncome: { min: 500, max: 6000, step: 100 },
  personalUseMonths: { min: 0, max: 6, step: 1 },
  occupancyRate: { min: 50, max: 100, step: 5 },
  appreciationRate: { min: 0, max: 5, step: 0.5 },
};

export interface RentalIncome {
  grossAnnual: number;
  effectiveMonths: number;
  netAnnual: number;
}

export function calculateEffectiveRentalIncome(
  monthlyRent: number,
  personalUseMonths: number,
  occupancyRate: number
): RentalIncome {
  const availableMonths = 12 - personalUseMonths;
  const effectiveMonths = availableMonths * (occupancyRate / 100);
  const grossAnnual = monthlyRent * 12;
  const netAnnual = monthlyRent * effectiveMonths;

  return { grossAnnual, effectiveMonths, netAnnual };
}

export function calculateOngoingCosts(
  squareMeters: number,
  propertyValue: number,
  hausgeldPerSqm: number,
  grundsteuerAnnual: number,
  insuranceRate: number
): {
  annualHausgeld: number;
  annualGrundsteuer: number;
  annualInsurance: number;
  totalAnnual: number;
} {
  const annualHausgeld = squareMeters * hausgeldPerSqm * 12;
  const annualGrundsteuer = grundsteuerAnnual;
  const annualInsurance = propertyValue * (insuranceRate / 100);

  return {
    annualHausgeld,
    annualGrundsteuer,
    annualInsurance,
    totalAnnual: annualHausgeld + annualGrundsteuer + annualInsurance,
  };
}

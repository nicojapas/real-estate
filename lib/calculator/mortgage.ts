export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) {
    return principal / numPayments;
  }

  return (
    principal *
    ((monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1))
  );
}

export function calculateTotalInterest(
  principal: number,
  monthlyPayment: number,
  termYears: number
): number {
  return monthlyPayment * termYears * 12 - principal;
}

export interface AmortizationEntry {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termYears: number
): AmortizationEntry[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  const schedule: AmortizationEntry[] = [];

  for (let month = 1; month <= termYears * 12; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    cumulativePrincipal += principalPayment;
    cumulativeInterest += interestPayment;

    schedule.push({
      month,
      year: Math.ceil(month / 12),
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
      cumulativePrincipal,
      cumulativeInterest,
    });
  }

  return schedule;
}

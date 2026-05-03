'use client';

import { CalculatedResults } from '@/lib/calculator/types';
import { formatEur, formatPercent } from '@/lib/calculator/format';
import { Card } from '@/components/ui/Card';

interface ResultsSectionProps {
  results: CalculatedResults;
}

function ResultRow({
  label,
  value,
  highlight,
  warning,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-gray-600">{label}</span>
      <span
        className={`font-medium ${
          warning
            ? 'text-amber-600'
            : highlight
              ? 'text-blue-600'
              : 'text-gray-900'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-gray-200 my-2" />;
}

export function ResultsSection({ results }: ResultsSectionProps) {
  const isPositiveCashFlow = results.annualCashFlow >= 0;

  return (
    <div className="space-y-4">
      <Card title="Purchase Summary">
        <div className="text-sm space-y-1">
          <ResultRow label="Property Value" value={formatEur(results.propertyValue)} />
          <ResultRow
            label="Purchase Costs (Kaufnebenkosten)"
            value={formatEur(results.purchaseCosts.total)}
          />
          <div className="pl-4 text-xs text-gray-500 space-y-0.5">
            <ResultRow
              label="Grunderwerbsteuer (6%)"
              value={formatEur(results.purchaseCosts.propertyTransferTax)}
            />
            <ResultRow
              label="Notar (1.5%)"
              value={formatEur(results.purchaseCosts.notaryFees)}
            />
            <ResultRow
              label="Grundbuch (0.5%)"
              value={formatEur(results.purchaseCosts.landRegistryFees)}
            />
            {results.purchaseCosts.brokerFees > 0 && (
              <ResultRow
                label="Makler (3.57%)"
                value={formatEur(results.purchaseCosts.brokerFees)}
              />
            )}
          </div>
          <Divider />
          <ResultRow
            label="Total Purchase Price"
            value={formatEur(results.totalPurchasePrice)}
            highlight
          />
        </div>
      </Card>

      <Card title="Loan Details">
        <div className="text-sm space-y-1">
          <ResultRow label="Down Payment" value={formatEur(results.downPayment)} />
          <ResultRow label="Loan Amount" value={formatEur(results.loanAmount)} />
          <Divider />
          <ResultRow
            label="Monthly Payment"
            value={formatEur(results.monthlyPayment)}
            highlight
          />
          <ResultRow
            label="Total Interest (over term)"
            value={formatEur(results.totalInterestPaid)}
          />
        </div>
      </Card>

      <Card title="Annual Costs">
        <div className="text-sm space-y-1">
          <ResultRow label="Hausgeld" value={formatEur(results.annualHausgeld)} />
          <ResultRow label="Grundsteuer" value={formatEur(results.annualGrundsteuer)} />
          <ResultRow label="Insurance" value={formatEur(results.annualInsurance)} />
          <Divider />
          <ResultRow
            label="Total Annual Costs"
            value={formatEur(results.totalAnnualCosts)}
            highlight
          />
        </div>
      </Card>

      <Card title="Rental Income">
        <div className="text-sm space-y-1">
          <ResultRow
            label="Gross Annual (12 months)"
            value={formatEur(results.grossAnnualRental)}
          />
          <ResultRow
            label="Effective Rental Months"
            value={`${results.effectiveRentalMonths.toFixed(1)} mo`}
          />
          <Divider />
          <ResultRow
            label="Net Annual Income"
            value={formatEur(results.netAnnualRental)}
            highlight
          />
          {results.personalUseWarning && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
              Personal use exceeds 10% — expenses only partially deductible
            </div>
          )}
        </div>
      </Card>

      <Card title="Cash Flow">
        <div className="text-sm space-y-1">
          <ResultRow
            label="Monthly Cash Flow"
            value={formatEur(results.monthlyCashFlow)}
            highlight
            warning={!isPositiveCashFlow}
          />
          <ResultRow
            label="Annual Cash Flow"
            value={formatEur(results.annualCashFlow)}
            highlight
            warning={!isPositiveCashFlow}
          />
          <Divider />
          <ResultRow
            label="Cash-on-Cash Return"
            value={formatPercent(results.cashOnCashReturn)}
            highlight
            warning={results.cashOnCashReturn < 0}
          />
          {results.breakEvenYears > 0 && results.breakEvenYears < Infinity && (
            <ResultRow
              label="Break-even"
              value={`~${results.breakEvenYears} years`}
            />
          )}
        </div>
      </Card>

      <Card title="Tax Estimates">
        <div className="text-sm space-y-1">
          <ResultRow
            label="AfA Deduction (2%/yr)"
            value={formatEur(results.afaDeduction)}
          />
          <ResultRow
            label="Taxable Rental Income"
            value={formatEur(results.taxableIncome)}
          />
          <ResultRow
            label="Estimated Income Tax"
            value={formatEur(results.estimatedTax)}
          />
        </div>
      </Card>
    </div>
  );
}

'use client';

import { Conclusions, CalculatedResults } from '@/lib/calculator/types';
import { formatEur } from '@/lib/calculator/format';
import { Card } from '@/components/ui/Card';

interface ConclusionsSectionProps {
  conclusions: Conclusions;
  results: CalculatedResults;
}

function Insight({
  icon,
  title,
  value,
  description,
  positive,
}: {
  icon: string;
  title: string;
  value: string;
  description?: string;
  positive?: boolean;
}) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span
            className={`font-semibold ${
              positive === true
                ? 'text-green-600'
                : positive === false
                  ? 'text-red-600'
                  : 'text-gray-900'
            }`}
          >
            {value}
          </span>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

export function ConclusionsSection({ conclusions, results }: ConclusionsSectionProps) {
  return (
    <Card title="Key Insights">
      <div className="space-y-3">
        <Insight
          icon="🏠"
          title="Initial Equity"
          value={formatEur(conclusions.initialEquity)}
          description={`${formatEur(conclusions.equityLostToFees)} went to purchase fees (taxes, notary)`}
        />

        <Insight
          icon="💰"
          title="Monthly Cash Flow"
          value={formatEur(results.monthlyCashFlow)}
          description={
            results.monthlyCashFlow >= 0
              ? 'Property generates positive cash flow'
              : 'You pay this amount monthly beyond rental income'
          }
          positive={results.monthlyCashFlow >= 0}
        />

        <Insight
          icon="📅"
          title="Loan Paid Off"
          value={`Year ${conclusions.loanPaidOffYear}`}
          description="When mortgage is fully repaid"
        />

        <Insight
          icon="📈"
          title="Cash Flow Break-Even"
          value={
            conclusions.cashFlowPositiveYear !== null
              ? `Year ${conclusions.cashFlowPositiveYear}`
              : 'N/A'
          }
          description="When cumulative cash flow turns positive"
          positive={conclusions.cashFlowPositiveYear !== null && conclusions.cashFlowPositiveYear <= 15}
        />

        <Insight
          icon="🎯"
          title="Investment Recovered"
          value={
            conclusions.investmentRecoveredYear !== null
              ? `Year ${conclusions.investmentRecoveredYear}`
              : '30+ years'
          }
          description="When equity + cash flow exceeds initial outlay"
          positive={conclusions.investmentRecoveredYear !== null && conclusions.investmentRecoveredYear <= 15}
        />

        <div className="border-t border-gray-200 pt-3 mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Long-term Projections</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-xs text-blue-600">Equity at Year 10</div>
              <div className="font-semibold text-blue-900">{formatEur(conclusions.equityAt10Years)}</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="text-xs text-blue-600">Equity at Year 20</div>
              <div className="font-semibold text-blue-900">{formatEur(conclusions.equityAt20Years)}</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="text-xs text-green-600">Total Profit Year 10</div>
              <div className={`font-semibold ${conclusions.totalProfitAt10Years >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {formatEur(conclusions.totalProfitAt10Years)}
              </div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="text-xs text-green-600">Total Profit Year 20</div>
              <div className={`font-semibold ${conclusions.totalProfitAt20Years >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {formatEur(conclusions.totalProfitAt20Years)}
              </div>
            </div>
          </div>
        </div>

        {!conclusions.isPositiveCashFlow && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex gap-2">
              <span>⚠️</span>
              <div className="text-sm text-amber-800">
                <strong>Negative cash flow:</strong> You&apos;ll need to cover{' '}
                {formatEur(Math.abs(results.monthlyCashFlow))}/month from other income.
                This is common for Berlin properties where appreciation is the main return.
              </div>
            </div>
          </div>
        )}

        {conclusions.isGoodInvestment && conclusions.isPositiveCashFlow && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex gap-2">
              <span>✅</span>
              <div className="text-sm text-green-800">
                <strong>Strong investment:</strong> Positive cash flow with investment
                recovery within 15 years.
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

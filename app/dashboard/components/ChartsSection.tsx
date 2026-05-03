'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { YearlyProjection, CalculatedResults } from '@/lib/calculator/types';
import { formatCompact } from '@/lib/calculator/format';
import { Card } from '@/components/ui/Card';

interface ChartsSectionProps {
  projections: YearlyProjection[];
  results: CalculatedResults;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tooltipFormatter = (value: any) => {
  if (typeof value === 'number') {
    return formatCompact(value);
  }
  return String(value ?? '');
};

export function ChartsSection({ projections }: ChartsSectionProps) {
  return (
    <div className="space-y-4">
      <Card title="Equity vs Loan Balance">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `Y${v}`}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatCompact(v)}
              />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="equity"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
                name="Equity"
              />
              <Area
                type="monotone"
                dataKey="loanBalance"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.6}
                name="Loan Balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Cumulative Cash Flow">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `Y${v}`}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatCompact(v)}
              />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={(label) => `Year ${label}`}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="cumulativeCashFlow"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Cumulative Cash Flow"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Property Value & Total Return">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `Y${v}`}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatCompact(v)}
              />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="propertyValue"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
                name="Property Value"
              />
              <Line
                type="monotone"
                dataKey="totalReturn"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Total Return"
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

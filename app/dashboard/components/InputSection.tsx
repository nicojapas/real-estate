'use client';

import { PropertyInputs } from '@/lib/calculator/types';
import { MARKET_RANGES } from '@/lib/calculator/defaults';
import { formatEur } from '@/lib/calculator/format';
import { Slider } from '@/components/ui/Slider';
import { Toggle, SegmentedToggle } from '@/components/ui/Toggle';
import { Card } from '@/components/ui/Card';

interface InputSectionProps {
  inputs: PropertyInputs;
  onUpdate: (field: keyof PropertyInputs, value: number | boolean | string) => void;
  onReset: () => void;
}

export function InputSection({ inputs, onUpdate, onReset }: InputSectionProps) {
  return (
    <div className="space-y-4">
      <Card title="Property">
        <div className="space-y-4">
          <SegmentedToggle
            value={inputs.inputMode}
            options={[
              { value: 'total', label: 'Total Price' },
              { value: 'perSqm', label: 'Price/sqm' },
            ]}
            onChange={(v) => onUpdate('inputMode', v)}
          />

          {inputs.inputMode === 'total' ? (
            <Slider
              label="Property Value"
              value={inputs.totalValue}
              min={MARKET_RANGES.totalValue.min}
              max={MARKET_RANGES.totalValue.max}
              step={MARKET_RANGES.totalValue.step}
              onChange={(v) => onUpdate('totalValue', v)}
              formatValue={formatEur}
            />
          ) : (
            <Slider
              label="Price per sqm"
              value={inputs.pricePerSqm}
              min={MARKET_RANGES.pricePerSqm.min}
              max={MARKET_RANGES.pricePerSqm.max}
              step={MARKET_RANGES.pricePerSqm.step}
              onChange={(v) => onUpdate('pricePerSqm', v)}
              formatValue={(v) => `${formatEur(v)}/sqm`}
            />
          )}

          <Slider
            label="Square Meters"
            value={inputs.squareMeters}
            min={MARKET_RANGES.squareMeters.min}
            max={MARKET_RANGES.squareMeters.max}
            step={MARKET_RANGES.squareMeters.step}
            onChange={(v) => onUpdate('squareMeters', v)}
            unit=" sqm"
          />

          <Toggle
            label="Include Broker Fee"
            description="Adds 3.57% to purchase costs"
            checked={inputs.includeBroker}
            onChange={(v) => onUpdate('includeBroker', v)}
          />
        </div>
      </Card>

      <Card title="Financing">
        <div className="space-y-4">
          <SegmentedToggle
            value={inputs.downPaymentMode}
            options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'amount', label: 'Amount' },
            ]}
            onChange={(v) => onUpdate('downPaymentMode', v)}
          />

          {inputs.downPaymentMode === 'percentage' ? (
            <Slider
              label="Down Payment"
              value={inputs.downPaymentPercent}
              min={MARKET_RANGES.downPaymentPercent.min}
              max={MARKET_RANGES.downPaymentPercent.max}
              step={MARKET_RANGES.downPaymentPercent.step}
              onChange={(v) => onUpdate('downPaymentPercent', v)}
              formatValue={(v) => `${v}% (${formatEur(inputs.downPaymentAmount)})`}
            />
          ) : (
            <Slider
              label="Down Payment"
              value={inputs.downPaymentAmount}
              min={MARKET_RANGES.downPaymentAmount.min}
              max={MARKET_RANGES.downPaymentAmount.max}
              step={MARKET_RANGES.downPaymentAmount.step}
              onChange={(v) => onUpdate('downPaymentAmount', v)}
              formatValue={formatEur}
            />
          )}

          <Slider
            label="Interest Rate"
            value={inputs.interestRate}
            min={MARKET_RANGES.interestRate.min}
            max={MARKET_RANGES.interestRate.max}
            step={MARKET_RANGES.interestRate.step}
            onChange={(v) => onUpdate('interestRate', v)}
            formatValue={(v) => `${v.toFixed(2)}%`}
          />

          <Slider
            label="Loan Term"
            value={inputs.loanTermYears}
            min={MARKET_RANGES.loanTermYears.min}
            max={MARKET_RANGES.loanTermYears.max}
            step={MARKET_RANGES.loanTermYears.step}
            onChange={(v) => onUpdate('loanTermYears', v)}
            unit=" years"
          />

          <Toggle
            label="Accelerated Repayment"
            description="Use all cash flow to pay down loan faster"
            checked={inputs.acceleratedRepayment}
            onChange={(v) => onUpdate('acceleratedRepayment', v)}
          />
        </div>
      </Card>

      <Card title="Rental Income">
        <div className="space-y-4">
          <Slider
            label="Monthly Rental Income"
            value={inputs.monthlyRentalIncome}
            min={MARKET_RANGES.monthlyRentalIncome.min}
            max={MARKET_RANGES.monthlyRentalIncome.max}
            step={MARKET_RANGES.monthlyRentalIncome.step}
            onChange={(v) => onUpdate('monthlyRentalIncome', v)}
            formatValue={(v) => `${formatEur(v)}/mo`}
          />

          <Slider
            label="Personal Use"
            value={inputs.personalUseMonths}
            min={MARKET_RANGES.personalUseMonths.min}
            max={MARKET_RANGES.personalUseMonths.max}
            step={MARKET_RANGES.personalUseMonths.step}
            onChange={(v) => onUpdate('personalUseMonths', v)}
            unit=" months/year"
          />

          <Slider
            label="Occupancy Rate"
            value={inputs.occupancyRate}
            min={MARKET_RANGES.occupancyRate.min}
            max={MARKET_RANGES.occupancyRate.max}
            step={MARKET_RANGES.occupancyRate.step}
            onChange={(v) => onUpdate('occupancyRate', v)}
            formatValue={(v) => `${v}%`}
          />
        </div>
      </Card>

      <Card title="Appreciation">
        <Slider
          label="Annual Appreciation"
          value={inputs.appreciationRate}
          min={MARKET_RANGES.appreciationRate.min}
          max={MARKET_RANGES.appreciationRate.max}
          step={MARKET_RANGES.appreciationRate.step}
          onChange={(v) => onUpdate('appreciationRate', v)}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
      </Card>

      <button
        onClick={onReset}
        className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
}

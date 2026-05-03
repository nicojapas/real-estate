'use client';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  formatValue,
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : `${value}${unit || ''}`;
  const minDisplay = formatValue ? formatValue(min) : `${min}${unit || ''}`;
  const maxDisplay = formatValue ? formatValue(max) : `${max}${unit || ''}`;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <label className="font-medium text-gray-700">{label}</label>
        <span className="text-gray-900 font-semibold">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{minDisplay}</span>
        <span>{maxDisplay}</span>
      </div>
    </div>
  );
}

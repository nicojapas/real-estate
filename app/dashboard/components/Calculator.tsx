'use client';

import { useCalculator } from '@/lib/hooks/useCalculator';
import { InputSection } from './InputSection';
import { ResultsSection } from './ResultsSection';
import { ChartsSection } from './ChartsSection';

export function Calculator() {
  const { inputs, results, projections, updateInput, reset } = useCalculator();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <InputSection inputs={inputs} onUpdate={updateInput} onReset={reset} />
      </div>

      <div className="lg:col-span-1">
        <ResultsSection results={results} />
      </div>

      <div className="lg:col-span-1">
        <ChartsSection projections={projections} results={results} />
      </div>
    </div>
  );
}

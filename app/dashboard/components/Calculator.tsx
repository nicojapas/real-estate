'use client';

import { useCalculator } from '@/lib/hooks/useCalculator';
import { useSavedConfigurations } from '@/lib/hooks/useSavedConfigurations';
import { InputSection } from './InputSection';
import { ResultsSection } from './ResultsSection';
import { ChartsSection } from './ChartsSection';
import { ConclusionsSection } from './ConclusionsSection';
import { SavedConfigurationsPanel } from './SavedConfigurationsPanel';

export function Calculator() {
  const { inputs, results, projections, conclusions, updateInput, reset, loadInputs } = useCalculator();
  const {
    configurations,
    activeConfigId,
    isLoaded,
    saveConfiguration,
    updateConfiguration,
    renameConfiguration,
    deleteConfiguration,
    loadConfiguration,
  } = useSavedConfigurations();

  const handleLoadConfiguration = (id: string) => {
    const savedInputs = loadConfiguration(id);
    if (savedInputs) {
      loadInputs(savedInputs);
    }
  };

  return (
    <div className="space-y-6">
      {/* Conclusions at the top for visibility */}
      <ConclusionsSection conclusions={conclusions} results={results} />

      {/* Main calculator grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {isLoaded && (
            <SavedConfigurationsPanel
              currentInputs={inputs}
              configurations={configurations}
              activeConfigId={activeConfigId}
              onSave={saveConfiguration}
              onLoad={handleLoadConfiguration}
              onRename={renameConfiguration}
              onDelete={deleteConfiguration}
              onUpdate={updateConfiguration}
            />
          )}
          <InputSection inputs={inputs} onUpdate={updateInput} onReset={reset} />
        </div>

        <div className="lg:col-span-1">
          <ResultsSection results={results} />
        </div>

        <div className="lg:col-span-1">
          <ChartsSection projections={projections} results={results} />
        </div>
      </div>
    </div>
  );
}

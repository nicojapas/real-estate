import { useReducer, useMemo, useCallback } from 'react';
import { PropertyInputs, CalculatedResults, YearlyProjection, Conclusions } from '../calculator/types';
import { BERLIN_DEFAULTS, INITIAL_INPUTS } from '../calculator/defaults';
import { calculateAll, generateYearlyProjections, calculateConclusions } from '../calculator/projections';

type Action =
  | { type: 'SET_INPUT'; field: keyof PropertyInputs; value: number | boolean | string }
  | { type: 'RESET' };

function reducer(state: PropertyInputs, action: Action): PropertyInputs {
  switch (action.type) {
    case 'SET_INPUT': {
      const newState = { ...state, [action.field]: action.value };

      // Sync related values
      if (action.field === 'totalValue' && state.inputMode === 'total') {
        newState.pricePerSqm = Math.round(newState.totalValue / state.squareMeters);
        if (state.downPaymentMode === 'percentage') {
          newState.downPaymentAmount = Math.round(
            newState.totalValue * (state.downPaymentPercent / 100)
          );
        }
      }

      if (action.field === 'pricePerSqm' && state.inputMode === 'perSqm') {
        newState.totalValue = newState.pricePerSqm * state.squareMeters;
        if (state.downPaymentMode === 'percentage') {
          newState.downPaymentAmount = Math.round(
            newState.totalValue * (state.downPaymentPercent / 100)
          );
        }
      }

      if (action.field === 'squareMeters') {
        if (state.inputMode === 'perSqm') {
          newState.totalValue = state.pricePerSqm * (action.value as number);
        } else {
          newState.pricePerSqm = Math.round(state.totalValue / (action.value as number));
        }
      }

      if (action.field === 'downPaymentPercent') {
        const propValue = state.inputMode === 'total'
          ? state.totalValue
          : state.pricePerSqm * state.squareMeters;
        newState.downPaymentAmount = Math.round(propValue * ((action.value as number) / 100));
      }

      if (action.field === 'downPaymentAmount') {
        const propValue = state.inputMode === 'total'
          ? state.totalValue
          : state.pricePerSqm * state.squareMeters;
        newState.downPaymentPercent = Math.round(((action.value as number) / propValue) * 100);
      }

      return newState;
    }
    case 'RESET':
      return INITIAL_INPUTS;
    default:
      return state;
  }
}

export function useCalculator() {
  const [inputs, dispatch] = useReducer(reducer, INITIAL_INPUTS);

  const results = useMemo<CalculatedResults>(
    () => calculateAll(inputs, BERLIN_DEFAULTS),
    [inputs]
  );

  const projections = useMemo<YearlyProjection[]>(
    () => generateYearlyProjections(inputs, BERLIN_DEFAULTS, 30),
    [inputs]
  );

  const conclusions = useMemo<Conclusions>(
    () => calculateConclusions(inputs, BERLIN_DEFAULTS, projections),
    [inputs, projections]
  );

  const updateInput = useCallback(
    (field: keyof PropertyInputs, value: number | boolean | string) => {
      dispatch({ type: 'SET_INPUT', field, value });
    },
    []
  );

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return { inputs, results, projections, conclusions, updateInput, reset };
}

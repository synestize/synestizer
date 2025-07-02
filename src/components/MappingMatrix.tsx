import React from 'react';
import { useAppStore, type ParameterName, type SignalName } from '../store/useAppStore';

// Expand this array to include all new signals
const signals: SignalName[] = [
  'brightness', 'red', 'blue',
  'brightness_delta', 'red_delta', 'blue_delta',
  'brightness_power', 'red_power', 'blue_power'
];
// Expand the list of parameters to include both voices
const parameters: ParameterName[] = [
  'voice1_frequency',
  'voice1_filterCutoff',
  'voice2_frequency',
  'voice2_filterCutoff'
];

// Map internal parameter names to user-friendly labels
const parameterLabels: Record<ParameterName, string> = {
  voice1_frequency: 'Voice 1 Pitch',
  voice1_filterCutoff: 'Voice 1 Filter',
  voice2_frequency: 'Voice 2 Pitch',
  voice2_filterCutoff: 'Voice 2 Filter',
};

// A single cell in our matrix
function MappingCell({ parameter, signal }: { parameter: ParameterName; signal: SignalName }) {
  const { mappings, setMappingValue } = useAppStore();
  const mapping = mappings[parameter]?.[signal] || { scale: 0, bias: 0 };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMappingValue(parameter, signal, { scale: parseFloat(e.target.value) });
  };

  const handleBiasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMappingValue(parameter, signal, { bias: parseFloat(e.target.value) });
  };

  return (
    <div className="bg-gray-800 p-2 rounded">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={`${parameter}-${signal}-scale`}>Scale</label>
        <span className="font-mono">{mapping.scale.toFixed(2)}</span>
      </div>
      <input
        type="range"
        id={`${parameter}-${signal}-scale`}
        min="-1"
        max="1"
        step="0.05"
        value={mapping.scale}
        onChange={handleScaleChange}
        className="w-full h-1"
      />
      <div className="flex items-center justify-between text-xs mt-2">
        <label htmlFor={`${parameter}-${signal}-bias`}>Bias</label>
        <span className="font-mono">{mapping.bias.toFixed(2)}</span>
      </div>
      <input
        type="range"
        id={`${parameter}-${signal}-bias`}
        min="-1"
        max="1"
        step="0.05"
        value={mapping.bias}
        onChange={handleBiasChange}
        className="w-full h-1"
      />
    </div>
  );
}

export function MappingMatrix() {
  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner w-full max-w-6xl">
      <h3 className="text-lg font-semibold mb-3 text-center">Mapping Matrix</h3>
      {/* Update grid columns to accommodate the new signals */}
      <div className="grid grid-cols-10 gap-2 text-center items-center">
        <div /> {/* Empty corner */}
        {signals.map(s => (
          <div key={s} className="text-xs font-bold text-gray-300 transform -rotate-45 whitespace-nowrap">
            {s.replace('_', ' ')}
          </div>
        ))}

        {parameters.map(p => (
          <React.Fragment key={p}>
            <div className="capitalize font-bold text-gray-300 text-right pr-2">
              {parameterLabels[p]}
            </div>
            {signals.map(s => <MappingCell key={`${p}-${s}`} parameter={p} signal={s} />)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
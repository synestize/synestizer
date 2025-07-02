import React from 'react';
import { useAppStore, type ParameterName, type SignalName } from '../store/useAppStore';

const signals: SignalName[] = [
  'brightness', 'chroma_blue', 'chroma_red',
  'brightness_variance', 'chroma_blue_variance', 'chroma_red_variance',
  'x_brightness', 'y_brightness', 'brightness_blue_corr',
  'brightness_delta', 'chroma_blue_delta', 'chroma_red_delta',
  'brightness_variance_delta', 'chroma_blue_variance_delta', 'chroma_red_variance_delta',
  'x_brightness_delta', 'y_brightness_delta', 'brightness_blue_corr_delta'
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
    <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner w-full max-w-7xl overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3 text-center">Mapping Matrix</h3>
      <div
        className="grid gap-2 text-center items-center"
        style={{ gridTemplateColumns: `auto repeat(${signals.length}, 1fr)` }}
      >
        <div /> {/* Empty corner */}
        {signals.map(s => (
          <div key={s} className="h-24 flex items-end justify-center">
            <span className="text-xs font-bold text-gray-300 transform -rotate-65 whitespace-nowrap origin-bottom-left">
              {s.replace(/_/g, ' ')}
            </span>
          </div>
        ))}

        {parameters.map(p => (
          <React.Fragment key={p}>
            <div className="capitalize font-bold text-gray-300 text-right pr-2 whitespace-nowrap">
              {parameterLabels[p]}
            </div>
            {signals.map(s => <MappingCell key={`${p}-${s}`} parameter={p} signal={s} />)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
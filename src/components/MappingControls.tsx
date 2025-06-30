import { useAppStore } from '../store/useAppStore';

type SignalName = 'brightness' | 'red' | 'blue';
type ParameterName = 'frequency' | 'filterCutoff';

const signals: SignalName[] = ['brightness', 'red', 'blue'];
const parameters: ParameterName[] = ['frequency', 'filterCutoff'];

export function MappingControls() {
  const { mappings, setMapping } = useAppStore();

  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-2 text-center">Signal Mappings</h3>
      <div className="grid grid-cols-2 gap-4">
        {parameters.map((param) => (
          <div key={param} className="flex flex-col items-center">
            <label htmlFor={param} className="capitalize text-sm mb-1 text-gray-300">
              {param === 'frequency' ? 'Pitch' : 'Filter'}
            </label>
            <select
              id={param}
              value={mappings[param]}
              onChange={(e) => setMapping(param, e.target.value as SignalName)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              {signals.map((signal) => (
                <option key={signal} value={signal} className="capitalize">
                  {signal}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
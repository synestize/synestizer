import type { SignalName, ParameterName, MappingValue } from '../store/useAppStore';

type Mappings = Partial<Record<ParameterName, Partial<Record<SignalName, MappingValue>>>>;

/** Core camera→audio formula. tanh keeps output in −1…1 regardless of signal scale. */
export function calculateTotalInfluence(
  parameter: ParameterName,
  signals: Record<SignalName, number>,
  mappings: Mappings
): number {
  const paramMappings = mappings[parameter] || {};
  let totalScaled = 0, totalBias = 0;
  for (const sig in paramMappings) {
    const m = paramMappings[sig as SignalName];
    if (!m) continue;
    totalScaled += (signals[sig as SignalName] || 0) * m.scale;
    totalBias   += m.bias;
  }
  return Math.tanh(totalScaled + totalBias);
}

/** Normalise −1…1 → 0…1 */
export const norm = (v: number) => (v + 1) / 2;

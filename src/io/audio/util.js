import { astroSigns } from '../../lib/names'

export function audioSinkStreamName(i) {
  return ['audio-'+ pad4(i), astroSigns[i]]
}

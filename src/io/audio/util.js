import { greekLetters } from '../../lib/names'
import { pad4 } from '../../lib/string'

export function audioSinkStreamName(i) {
  return ['audio-'+ pad4(i), greekLetters[i]]
}

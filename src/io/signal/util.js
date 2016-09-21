import { greekLetters } from '../../lib/names'
import { pad4 } from '../../lib/string'

export function genericSignalName(i) {
  return ['generic-'+ pad4(i), greekLetters[i]]
}

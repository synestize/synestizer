import { pad4 } from '../../lib/string'

export function midiStreamName(cc) {
  return ['midi-cc-'+ pad4(cc), 'CC ' + cc]
}

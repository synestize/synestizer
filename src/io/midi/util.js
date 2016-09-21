import { pad4 } from '../../lib/string'

export function midiInStreamName(cc) {
  return ['midi-in-cc-'+ pad4(cc), 'In CC ' + cc]
}
export function midiOutStreamName(cc) {
  return ['midi-out-cc-'+ pad4(cc), 'Out CC ' + cc]
}

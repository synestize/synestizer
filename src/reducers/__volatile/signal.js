import { combineReducers } from 'redux'
import { union, difference, intersection } from '../../lib/collections'
import {
  addSourceSignal,
  removeSourceSignal,
  setSourceSignalValue,
  setAllSourceSignalValues,
  addSinkSignal,
  removeSinkSignal,
  setSinkSignalValue,
  setAllSinkSignalValues,
  setSinkBias
} from '../../features/signal/signalSlice'
import { midiInStreamName, midiOutStreamName} from '../../io/midi/util'
import {
  addMidiSourceCC,
  removeMidiSourceCC,
  addMidiSinkCC,
  removeMidiSinkCC
} from '../../features/midi/midiSlice'

export function sourceSignalValues(state={}, {type, payload}) {
  switch (type) {
    case addSourceSignal.type:
      {
        state = {...state}
        state[payload.key] = 0.0
        return state
      }
    case addMidiSourceCC.type:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case removeSourceSignal.type:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case removeMidiSourceCC.type:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case setSourceSignalValue.type:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case setAllSourceSignalValues.type:
      return { ...state, ...payload };
    default:
      return state
  }
}

export function sinkSignalValues(state={}, {type, payload}) {
  switch (type) {
    case addSourceSignal.type:
      {
        state = {...state}
        state[payload.key] = 0.0
        return state
      }
    case addMidiSourceCC.type:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case removeSourceSignal.type:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case removeMidiSourceCC.type:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case setSourceSignalValue.type:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case setAllSinkSignalValues.type:
      return { ...state, ...payload };
    default:
      return state
  }
}

export function comboSignalValues(state={}, {type, payload}) {
  switch (type) {
    case addSourceSignal.type:
      {
        state = {...state}
        state[payload.key] = 0.0
        return state
      }
    case addMidiSourceCC.type:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case removeSourceSignal.type:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case removeMidiSourceCC.type:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case setSourceSignalValue.type:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case setAllSourceSignalValues.type:
      return { ...state, ...payload };
    case setAllSinkSignalValues.type:
      return { ...state, ...payload };
    default:
      return state
  }
}


const stream = combineReducers({
   sourceSignalValues,
   sinkSignalValues,
   comboSignalValues,
})

export default stream

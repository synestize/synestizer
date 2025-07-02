import { createSlice } from '@reduxjs/toolkit';
import { union, difference } from '../../lib/collections';
import { midiInStreamName, midiOutStreamName } from '../../io/midi/util';

const initialState = {
  sourceDevice: "",
  sourceChannel: 0,
  sourceCCs: [1, 2, 3, 4, 5],
  sourceCCMap: {
    "midi-in-cc-0001": 1,
    "midi-in-cc-0002": 2,
    "midi-in-cc-0003": 3,
    "midi-in-cc-0004": 4,
    "midi-in-cc-0005": 5,
  },
  sinkDevice: "",
  sinkChannel: 1,
  sinkCCs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  sinkCCMap: {
    "midi-out-cc-0001": 1, "midi-out-cc-0002": 2, "midi-out-cc-0003": 3,
    "midi-out-cc-0004": 4, "midi-out-cc-0005": 5, "midi-out-cc-0006": 6,
    "midi-out-cc-0007": 7, "midi-out-cc-0008": 8, "midi-out-cc-0009": 9,
    "midi-out-cc-0010": 10, "midi-out-cc-0011": 11, "midi-out-cc-0012": 12,
    "midi-out-cc-0013": 13, "midi-out-cc-0014": 14, "midi-out-cc-0015": 15,
  },
  sinkSoloCC: -1,
};

const midiSlice = createSlice({
  name: 'midi',
  initialState,
  reducers: {
    // Source Reducers
    setMidiSourceDevice: (state, action) => {
      state.sourceDevice = action.payload ?? state.sourceDevice;
    },
    setMidiSourceChannel: (state, action) => {
      state.sourceChannel = parseInt(action.payload);
    },
    addMidiSourceCC: (state, action) => {
      const cc = parseInt(action.payload);
      state.sourceCCs = union(state.sourceCCs, [cc]);
      const [key] = midiInStreamName(cc);
      state.sourceCCMap[key] = cc;
    },
    removeMidiSourceCC: (state, action) => {
      const cc = parseInt(action.payload);
      state.sourceCCs = difference(state.sourceCCs, [cc]);
      const [key] = midiInStreamName(cc);
      delete state.sourceCCMap[key];
    },

    // Sink Reducers
    setMidiSinkDevice: (state, action) => {
      state.sinkDevice = action.payload ?? state.sinkDevice;
    },
    setMidiSinkChannel: (state, action) => {
      state.sinkChannel = parseInt(action.payload);
    },
    addMidiSinkCC: (state, action) => {
      const cc = parseInt(action.payload);
      state.sinkCCs = union(state.sinkCCs, [cc]);
      const [key] = midiOutStreamName(cc);
      state.sinkCCMap[key] = cc;
    },
    removeMidiSinkCC: (state, action) => {
      const cc = parseInt(action.payload);
      state.sinkCCs = difference(state.sinkCCs, [cc]);
      const [key] = midiOutStreamName(cc);
      delete state.sinkCCMap[key];
    },
    toggleSoloMidiSinkCC: (state, action) => {
      const newsolo = parseInt(action.payload);
      state.sinkSoloCC = (newsolo === state.sinkSoloCC) ? -1 : newsolo;
    },
    // Actions that were previously thunks but now have direct logic
    addUnknownMidiSourceCC: (state) => {
        const nextCC = Math.max(-1, ...state.sourceCCs) + 1;
        if (nextCC < 128 && !state.sourceCCs.includes(nextCC)) {
            state.sourceCCs.push(nextCC);
            const [key] = midiInStreamName(nextCC);
            state.sourceCCMap[key] = nextCC;
        }
    },
    addUnknownMidiSinkCC: (state) => {
        const nextCC = Math.max(-1, ...state.sinkCCs) + 1;
        if (nextCC < 128 && !state.sinkCCs.includes(nextCC)) {
            state.sinkCCs.push(nextCC);
            const [key] = midiOutStreamName(nextCC);
            state.sinkCCMap[key] = nextCC;
        }
    },

    // Actions for volatile state management (used by IO layer)
    setValidMidiSourceDevice: (state, action) => {
      // This will be handled by volatile reducers
    },
    setAllMidiSourceDevices: (state, action) => {
      // This will be handled by volatile reducers  
    },
    setValidMidiSinkDevice: (state, action) => {
      // This will be handled by volatile reducers
    },
    setAllMidiSinkDevices: (state, action) => {
      // This will be handled by volatile reducers
    }
  }
});

export const {
  setMidiSourceDevice, setMidiSourceChannel, addMidiSourceCC, removeMidiSourceCC,
  setMidiSinkDevice, setMidiSinkChannel, addMidiSinkCC, removeMidiSinkCC,
  toggleSoloMidiSinkCC, addUnknownMidiSourceCC, addUnknownMidiSinkCC,
  // Volatile state actions
  setValidMidiSourceDevice, setAllMidiSourceDevices,
  setValidMidiSinkDevice, setAllMidiSinkDevices
} = midiSlice.actions;

export default midiSlice.reducer;
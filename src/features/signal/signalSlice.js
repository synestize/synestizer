import { createSlice } from '@reduxjs/toolkit';
import { RANDOMIZE } from '../../actions/app';
import { midiInStreamName, midiOutStreamName } from '../../io/midi/util';
import { genericSinkSignalName } from '../../io/signal/util';
import { addMidiSourceCC, removeMidiSourceCC, addMidiSinkCC, removeMidiSinkCC } from '../midi/midiSlice';

const initialState = {
  sourceSignalMeta: {},
  sinkSignalMeta: {},
  comboSignalMeta: {},
  sourceSinkScale: {},
  nGenericSinkSignals: 1,
  genericSinkSignals: {}
};

const signalSlice = createSlice({
  name: 'signal',
  initialState,
  reducers: {
    // Source signal management
    addSourceSignal: (state, action) => {
      const { key, ...meta } = action.payload;
      state.sourceSignalMeta[key] = action.payload;
      state.comboSignalMeta[key] = action.payload;
    },
    removeSourceSignal: (state, action) => {
      const key = action.payload;
      delete state.sourceSignalMeta[key];
      delete state.comboSignalMeta[key];
      
      // Remove from sourceSinkScale
      Object.keys(state.sourceSinkScale).forEach(scaleKey => {
        const [sourceKey] = scaleKey.split('/');
        if (sourceKey === key) {
          delete state.sourceSinkScale[scaleKey];
        }
      });
    },
    setSourceSignalValue: (state, action) => {
      const [key, value] = action.payload;
      // This would be handled by the IO layer in practice
    },
    setAllSourceSignalValues: (state, action) => {
      // This would be handled by the IO layer in practice
    },

    // Sink signal management
    addSinkSignal: (state, action) => {
      const { key, ...meta } = action.payload;
      state.sinkSignalMeta[key] = action.payload;
      state.comboSignalMeta[key] = action.payload;
    },
    removeSinkSignal: (state, action) => {
      const key = action.payload;
      delete state.sinkSignalMeta[key];
      delete state.comboSignalMeta[key];
      
      // Remove from sourceSinkScale
      Object.keys(state.sourceSinkScale).forEach(scaleKey => {
        const [, sinkKey] = scaleKey.split('/');
        if (sinkKey === key) {
          delete state.sourceSinkScale[scaleKey];
        }
      });
    },
    setSinkSignalValue: (state, action) => {
      const [key, value] = action.payload;
      // This would be handled by the IO layer in practice
    },
    setAllSinkSignalValues: (state, action) => {
      // This would be handled by the IO layer in practice
    },

    // Source-sink scaling
    setSourceSinkScale: (state, action) => {
      const [sourceKey, sinkKey, scale] = action.payload;
      const mapkey = sourceKey + '/' + sinkKey;
      if (scale === 0) {
        delete state.sourceSinkScale[mapkey];
      } else {
        state.sourceSinkScale[mapkey] = scale;
      }
    },
    setSinkBias: (state, action) => {
      const [key, val] = action.payload;
      // This would be handled by the IO layer in practice
    },

    // Generic sink signals
    addGenericSinkSignal: (state, action) => {
      const [key, name] = genericSinkSignalName(action.payload);
      state.sinkSignalMeta[key] = { name, owner: "Signal" };
      state.comboSignalMeta[key] = { name, owner: "Signal" };
      state.genericSinkSignals[key] = name;
    },
    removeGenericSinkSignal: (state, action) => {
      const [key, name] = genericSinkSignalName(action.payload);
      delete state.sinkSignalMeta[key];
      delete state.comboSignalMeta[key];
      delete state.genericSinkSignals[key];
      
      // Remove from sourceSinkScale
      Object.keys(state.sourceSinkScale).forEach(scaleKey => {
        const [, sinkKey] = scaleKey.split('/');
        if (sinkKey === key) {
          delete state.sourceSinkScale[scaleKey];
        }
      });
    },
    setMaxNGenericSinkSignals: (state, action) => {
      state.nGenericSinkSignals = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMidiSourceCC, (state, action) => {
        const [key, name] = midiInStreamName(action.payload);
        state.sourceSignalMeta[key] = { name, owner: "MIDI" };
        state.comboSignalMeta[key] = { name, owner: "MIDI" };
      })
      .addCase(removeMidiSourceCC, (state, action) => {
        const [key] = midiInStreamName(action.payload);
        delete state.sourceSignalMeta[key];
        delete state.comboSignalMeta[key];
        
        // Remove from sourceSinkScale
        Object.keys(state.sourceSinkScale).forEach(scaleKey => {
          const [sourceKey] = scaleKey.split('/');
          if (sourceKey === key) {
            delete state.sourceSinkScale[scaleKey];
          }
        });
      })
      .addCase(addMidiSinkCC, (state, action) => {
        const [key, name] = midiOutStreamName(action.payload);
        state.sinkSignalMeta[key] = { name, owner: "MIDI" };
        state.comboSignalMeta[key] = { name, owner: "MIDI" };
      })
      .addCase(removeMidiSinkCC, (state, action) => {
        const [key] = midiOutStreamName(action.payload);
        delete state.sinkSignalMeta[key];
        delete state.comboSignalMeta[key];
        
        // Remove from sourceSinkScale
        Object.keys(state.sourceSinkScale).forEach(scaleKey => {
          const [, sinkKey] = scaleKey.split('/');
          if (sinkKey === key) {
            delete state.sourceSinkScale[scaleKey];
          }
        });
      })
      .addCase(RANDOMIZE, (state, action) => {
        const sourceKeys = Object.keys(state.sourceSignalMeta).sort();
        const sinkKeys = Object.keys(state.sinkSignalMeta).sort();
        state.sourceSinkScale = {};
        let i = 0;
        for (let sinkKey of sinkKeys) {
          let sourceKey = sourceKeys[i];
          let mapkey = (sourceKey + '/' + sinkKey);
          state.sourceSinkScale[mapkey] = 0.5;
          i = (i + 1) % (sourceKeys.length);
        }
      });
  }
});

export const {
  addSourceSignal, removeSourceSignal, setSourceSignalValue, setAllSourceSignalValues,
  addSinkSignal, removeSinkSignal, setSinkSignalValue, setAllSinkSignalValues,
  setSourceSinkScale, setSinkBias,
  addGenericSinkSignal, removeGenericSinkSignal, setMaxNGenericSinkSignals
} = signalSlice.actions;

export default signalSlice.reducer;
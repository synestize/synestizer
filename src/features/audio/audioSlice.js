import { createSlice } from '@reduxjs/toolkit';
import { RANDOMIZE } from '../../actions/app';
import { pad4 } from '../../lib/string';

const initialState = {
  sourceDevice: "default",
  sinkDevice: "default",
  sinkControls: {},
  sampleBank: {},
  master: {
    gain: -10,
    mute: false,
    tempo: 100
  },
  bubbleChamber: {
    voice1: {
      mute: false,
      sample: 'panflute'
    },
    voice2: {
      mute: false,
      sample: 'angklung'
    },
    voice3: {
      mute: false
    },
    bass: {
      mute: true
    }
  }
};

function randomSinkControl(state = {
  scale: 0.0,
  bias: 0.0,
}) {
  state.signal = 'video-moment-' + pad4(Math.floor(Math.random() * 15))
  if (Math.random() > 0.5) {
    state.scale = Math.random() - 0.5
  }
  if (Math.random() > 0.5) {
    state.bias = Math.random() - 0.5
  }
  return state
}

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    // Device settings
    setAudioSourceDevice: (state, action) => {
      state.sourceDevice = action.payload;
    },
    setAudioSinkDevice: (state, action) => {
      state.sinkDevice = action.payload;
    },

    // Sink controls
    addAudioSinkControl: (state, action) => {
      const { key, ...controlData } = action.payload;
      if (!key) {
        console.warn('Unknown signal key', state, action);
        return;
      }
      if (!state.sinkControls[key]) {
        state.sinkControls[key] = randomSinkControl();
      }
      Object.assign(state.sinkControls[key], controlData);
    },
    removeAudioSinkControl: (state, action) => {
      delete state.sinkControls[action.payload];
    },
    setAudioSinkControlBias: (state, action) => {
      const { key, val } = action.payload;
      if (state.sinkControls[key]) {
        state.sinkControls[key].bias = val;
      }
    },
    setAudioSinkControlScale: (state, action) => {
      const { key, val } = action.payload;
      if (state.sinkControls[key]) {
        state.sinkControls[key].scale = val;
      }
    },
    setAudioSinkControlSignal: (state, action) => {
      const { key, val } = action.payload;
      if (state.sinkControls[key]) {
        state.sinkControls[key].signal = val;
      }
    },

    // Master controls
    setMasterGain: (state, action) => {
      state.master.gain = action.payload;
    },
    setMasterMute: (state, action) => {
      state.master.mute = action.payload;
    },
    toggleMasterMute: (state) => {
      state.master.mute = !state.master.mute;
    },
    setMasterTempo: (state, action) => {
      state.master.tempo = action.payload;
    },

    // Sample bank
    addSample: (state, action) => {
      const { key, name, root, path } = action.payload;
      state.sampleBank[key] = { name, root, path };
    },

    // Bubble Chamber controls
    toggleBubbleChamberVoice1Mute: (state) => {
      state.bubbleChamber.voice1.mute = !state.bubbleChamber.voice1.mute;
    },
    toggleBubbleChamberVoice2Mute: (state) => {
      state.bubbleChamber.voice2.mute = !state.bubbleChamber.voice2.mute;
    },
    toggleBubbleChamberVoice3Mute: (state) => {
      state.bubbleChamber.voice3.mute = !state.bubbleChamber.voice3.mute;
    },
    toggleBubbleChamberBassMute: (state) => {
      state.bubbleChamber.bass.mute = !state.bubbleChamber.bass.mute;
    },
    setBubbleChamberVoice1Sample: (state, action) => {
      if (action.payload !== undefined) {
        state.bubbleChamber.voice1.sample = action.payload;
      }
    },
    setBubbleChamberVoice2Sample: (state, action) => {
      state.bubbleChamber.voice2.sample = action.payload;
    },
    setBubbleChamberVoice3Sample: (state, action) => {
      state.bubbleChamber.voice3.sample = action.payload;
    },

    // Handle signal removal (from signal slice)
    removeGenericSinkSignal: (state, action) => {
      const signalToRemove = action.payload;
      Object.keys(state.sinkControls).forEach(key => {
        if (state.sinkControls[key].signal === signalToRemove) {
          state.sinkControls[key].signal = undefined;
        }
      });
    },

    // Actions for volatile state management (used by IO layer)
    setValidAudioSourceDevice: (state, action) => {
      // This will be handled by volatile reducers
    },
    setAllAudioSourceDevices: (state, action) => {
      // This will be handled by volatile reducers  
    },
    setValidAudioSinkDevice: (state, action) => {
      // This will be handled by volatile reducers
    },
    setAllAudioSinkDevices: (state, action) => {
      // This will be handled by volatile reducers
    },
    setAllAudioSinkControlActualValues: (state, action) => {
      // This will be handled by volatile reducers
    },
    setAudioReady: (state, action) => {
      // This will be handled by volatile reducers
    }
  },
  extraReducers: (builder) => {
    builder.addCase(RANDOMIZE, (state, action) => {
      // Randomize all sink controls
      Object.keys(state.sinkControls).forEach(controlKey => {
        state.sinkControls[controlKey] = randomSinkControl(state.sinkControls[controlKey]);
      });
    });
  }
});

export const {
  setAudioSourceDevice, setAudioSinkDevice,
  addAudioSinkControl, removeAudioSinkControl,
  setAudioSinkControlBias, setAudioSinkControlScale, setAudioSinkControlSignal,
  setMasterGain, setMasterMute, toggleMasterMute, setMasterTempo,
  addSample,
  toggleBubbleChamberVoice1Mute, toggleBubbleChamberVoice2Mute,
  toggleBubbleChamberVoice3Mute, toggleBubbleChamberBassMute,
  setBubbleChamberVoice1Sample, setBubbleChamberVoice2Sample, setBubbleChamberVoice3Sample,
  removeGenericSinkSignal,
  // Volatile state actions
  setValidAudioSourceDevice, setAllAudioSourceDevices,
  setValidAudioSinkDevice, setAllAudioSinkDevices,
  setAllAudioSinkControlActualValues, setAudioReady
} = audioSlice.actions;

export default audioSlice.reducer;
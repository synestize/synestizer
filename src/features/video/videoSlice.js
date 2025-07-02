import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  source: ""
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setAllVideoSources: (state, action) => {
      // This will be handled by volatile reducers
    },
    setCurrentVideoSource: (state, action) => {
      state.source = action.payload;
    },
    setValidVideoSource: (state, action) => {
      // This will be handled by volatile reducers
    }
  }
});

export const {
  setAllVideoSources,
  setCurrentVideoSource,
  setValidVideoSource
} = videoSlice.actions;

export default videoSlice.reducer;
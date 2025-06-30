import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visiblePane: 'sound',
};

const guiSlice = createSlice({
  name: 'gui',
  initialState,
  reducers: {
    setVisiblePane(state, action) {
      state.visiblePane = action.payload;
    },
  },
});

export const { setVisiblePane } = guiSlice.actions;
export default guiSlice.reducer;

### **Stage 2 (Continued): Complete the Redux Toolkit Migration**

**Goal:** Refactor all remaining legacy Redux logic (`actions`/`reducers` directories) into modern Redux Toolkit slices. This will centralize state logic and eliminate the need for separate action type constants.

**Task 2.4: Create the MIDI Slice**

*   **Context:** The MIDI state is currently managed across `src/actions/midi.js` and `src/reducers/midi.js`. We will consolidate this into a single `midiSlice.js` file.
*   **Action:**
    1.  Create a new file: `src/features/midi/midiSlice.js`.
    2.  Add the following code to the new file. This code directly translates the logic from the old files into the modern slice pattern.

    ```javascript
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
        }
      }
    });

    export const {
      setMidiSourceDevice, setMidiSourceChannel, addMidiSourceCC, removeMidiSourceCC,
      setMidiSinkDevice, setMidiSinkChannel, addMidiSinkCC, removeMidiSinkCC,
      toggleSoloMidiSinkCC, addUnknownMidiSourceCC, addUnknownMidiSinkCC
    } = midiSlice.actions;

    export default midiSlice.reducer;
    ```

**Task 2.5: Repeat for All Remaining Slices**
*   **Context:** We need to apply the same slice pattern to `audio`, `video`, and `signal` state.
*   **Action:** Systematically create slice files for each of the remaining state domains.
    1.  `src/features/audio/audioSlice.js`
    2.  `src/features/video/videoSlice.js`
    3.  `src/features/signal/signalSlice.js`
*   For each slice, move all the related reducer logic from the `src/reducers/` subdirectories. Combine the action constants and action creators into the `reducers` object within `createSlice`.
*   **Important:** The `RANDOMIZE` action in `reducers/audio.js` and `reducers/signal.js` is an "extra reducer" because it's defined in another slice (`app`). You'll need to use the `extraReducers` builder syntax in your new slices to handle it.

    **Example for `signalSlice.js`:**
    ```javascript
    import { createSlice } from '@reduxjs/toolkit';
    import { RANDOMIZE } from '../../actions/app'; // This action comes from outside the slice

    // ... initialState ...

    const signalSlice = createSlice({
        name: 'signal',
        initialState,
        reducers: {
            // ... all your normal signal reducers (addSourceSignal, etc.)
        },
        extraReducers: (builder) => {
            builder.addCase(RANDOMIZE, (state, action) => {
                // ... logic for randomizing the signal state ...
                // This replaces the 'case RANDOMIZE:' from the old reducer.
            });
        }
    });

    // ... exports ...
    ```

**Task 2.6: Update the Root Reducer and Clean Up**
*   **Context:** Once all slices are created, we need to assemble them in the store configuration and delete the old, now-redundant files.
*   **Action:**
    1.  In `src/index.js`, import all the new slice reducers.
    2.  Update the `rootReducer` object in your `configureStore` call to include all the new reducers. It will look something like this:
        ```javascript
        const rootReducer = {
            gui: guiReducer,
            midi: midiReducer,
            audio: audioReducer,
            video: videoReducer,
            signal: signalReducer,
            __volatile, // Keep the legacy volatile reducer for now
        };
        ```
    3.  Delete the entire `src/actions` directory.
    4.  Delete the entire `src/reducers` directory (except for `__volatile.js` and its sub-directory, which we are keeping for now).
    5.  Delete the top-level `src/reducers.js` file. Your `createRootReducer` in `index.js` has replaced it.

**Task 2.7: Update Component Imports**
*   **Context:** Components that previously dispatched actions will need to be updated to import the new action creators from the slice files.
*   **Action:** Go through all files in `src/containers` (and later, `src/components`).
    *   Find any line like `import { someAction } from '../actions/someFile'`.
    *   Replace it with the import from the corresponding slice file, e.g., `import { someAction } from '../features/someFeature/someFeatureSlice'`.
    *   For example, in `src/containers/SelectTabLink.js`, the import `import { setVisiblePane } from '../actions/gui';` will become `import { setVisiblePane } from '../features/gui/guiSlice';`.

**Verification for Stage 2 (Continued):**
*   Run `npm run dev`. The application should compile and run without errors.
*   The `src/actions` and `src/reducers` directories (except `__volatile`) should be gone.
*   Test the application's functionality. Clicking tabs, changing MIDI CCs, and adjusting audio parameters should all work correctly. The Redux DevTools should now show actions from all the new slices (e.g., `midi/addMidiSourceCC`, `audio/setMasterGain`).

This completes the most significant part of the refactor. Once this is done, the state management will be centralized and much easier to work with, setting a solid foundation for the final stages.
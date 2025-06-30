
### **General Instructions for the AI Assistant**

**Your Role:** You are an expert AI software engineer tasked with modernizing a legacy JavaScript application.
**Our Goal:** To update the "Synestizer" app's tooling, libraries, and code patterns to modern standards, making it easy to install, run, and contribute to.
**Coding Style:**
*   Use modern JavaScript (ES6+ features like `const`, `let`, arrow functions).
*   Prefer functional components with React Hooks over class components.
*   Keep code clean, readable, and well-commented where complex logic exists.
*   We are not concerned with backward compatibility. The priority is a clean, modern, and working codebase.

---

### **Stage 1: Stabilize the Development Environment**

**Goal:** Get the project to compile and run a local development server without errors. We will not change application logic in this stage, only the build system.

**Task 1.1: Update `package.json` Dependencies**
*   **Context:** The current `package.json` has outdated and incompatible packages for Babel, Webpack, and RxJS. We need to replace them with their modern equivalents.
*   **Action:** Modify the `devDependencies` in `package.json`.
    1.  Remove all `babel-*`, `webpack-*`, `serviceworker-webpack-plugin`, `assets-webpack-plugin`, and `rxjs` packages.
    2.  Add the following modern packages:
        ```json
        "devDependencies": {
          "@babel/cli": "^7.21.0",
          "@babel/core": "^7.21.4",
          "@babel/plugin-proposal-class-properties": "^7.18.6",
          "@babel/plugin-proposal-object-rest-spread": "^7.20.7",
          "@babel/preset-env": "^7.21.4",
          "@babel/preset-react": "^7.18.6",
          "babel-loader": "^9.1.2",
          "file-loader": "^6.2.0",
          "html-webpack-plugin": "^5.5.0",
          "localforage": "1.4.3",
          "node-static": "0.7.9",
          "react": "^18.2.0",
          "react-addons-perf": "15.4.1",
          "react-dom": "^18.2.0",
          "react-redux": "^8.0.5",
          "redux": "^4.2.1",
          "redux-logger": "2.7.4",
          "redux-persist": "3.5.0",
          "redux-thunk": "2.1.0",
          "reselect": "2.5.4",
          "rxjs": "^7.8.0",
          "script-loader": "0.7.0",
          "source-map-loader": "0.1.5",
          "tone": "git+https://github.com/Tonejs/Tone.js.git",
          "webpack": "^5.78.0",
          "webpack-cli": "^5.0.1",
          "webpack-dev-server": "^4.13.2",
          "webrtc-adapter": "1.4.0",
          "worker-loader": "3.0.8"
        }
        ```
*   **Action:** Delete the `node_modules` directory and the `package-lock.json` file. Then run `npm install` to install the new packages and generate a fresh `package-lock.json`.

**Task 1.2: Create a Modern Babel Configuration**
*   **Context:** The old Babel configuration lived inside the Webpack file. The modern standard is a dedicated `babel.config.js` file.
*   **Action:** Create a new file in the project root named `babel.config.js` and add the following content:
    ```javascript
    module.exports = {
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { "runtime": "automatic" }]
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-object-rest-spread"
      ]
    };
    ```

**Task 1.3: Update the Webpack Configuration**
*   **Context:** The existing Webpack config files use a deprecated syntax. We need to consolidate them and update to Webpack 5 syntax.
*   **Action:** Overwrite the contents of `webpack.config.js` with the following modern configuration. This will replace the multiple `webpack-*.config.js` files for now.
    ```javascript
    const path = require('path');
    const webpack = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = (env, argv) => {
      const isProduction = argv.mode === 'production';
      const isGallery = env.gallery === true;

      return {
        entry: './src/index.js',
        output: {
          path: path.resolve(__dirname, 'dist'),
          filename: 'bundle.js',
          publicPath: '/',
        },
        devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
        module: {
          rules: [
            {
              test: /\.worker\.js$/,
              loader: 'worker-loader'
            },
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: 'babel-loader',
            },
            {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
            },
          ],
        },
        resolve: {
          modules: [path.resolve(__dirname, 'src'), 'node_modules'],
          extensions: ['.js', '.jsx'],
        },
        plugins: [
          new HtmlWebpackPlugin({
            template: 'index.html',
          }),
          new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(isProduction),
            GALLERY: JSON.stringify(isGallery),
            EDITION: JSON.stringify('Blue'),
            VERSION: JSON.stringify('0.5.0-modern'),
            SIGNAL_PERIOD_MS: JSON.stringify(40),
            UI_PERIOD_MS: JSON.stringify(100),
          }),
        ],
        devServer: {
          static: {
            directory: path.join(__dirname, '/'),
          },
          compress: true,
          port: 8080,
          hot: true,
        },
      };
    };
    ```

**Task 1.4: Update `package.json` Scripts**
*   **Context:** The old scripts are incompatible with the new Webpack versions.
*   **Action:** Replace the `scripts` section in `package.json` with the following:
    ```json
    "scripts": {
      "clean": "rm -rf dist",
      "dev": "webpack-dev-server --mode development",
      "build": "npm run clean && webpack --mode production",
      "build:gallery": "npm run clean && webpack --mode production --env gallery"
    },
    ```

**Task 1.5: Fix RxJS Breaking Changes**
*   **Context:** RxJS v7 uses pipeable operators. The old import style (`.map()`) must be replaced with the `.pipe(map())` syntax. This is the biggest code change in this stage.
*   **Action:** Go through the files in `src/io/`.
    *   Find any line that looks like `import 'rxjs/add/operator/...'`. Remove these lines.
    *   Find any line that looks like `import 'rxjs/add/observable/...'`. Remove these lines.
    *   At the top of each file that uses RxJS, add the necessary imports, for example: `import { Observable, Subject, BehaviorSubject } from 'rxjs';` and `import { map, filter, distinctUntilChanged, pluck, share, sampleTime, scan } from 'rxjs/operators';`.
    *   Find every instance of chained operators, like `myObservable.pluck(...).map(...).subscribe(...)`.
    *   Rewrite them using the `pipe()` method: `myObservable.pipe(pluck(...), map(...)).subscribe(...)`.
    *   Pay close attention to `src/io/audio.js`, `src/io/midi.js`, `src/io/video.js`, and `src/io/signal.js`.

**Verification for Stage 1:**
*   Run `npm run dev`.
*   The project should compile successfully without any errors in the terminal.
*   Open your browser to `http://localhost:8080`. The application should load, although it may have runtime errors in the browser console. The goal is a successful compile.

---

### **Stage 2: Modernize Core Libraries**

**Goal:** Refactor the application to use modern React and Redux patterns. This will significantly simplify the codebase.

**Task 2.1: Update React Root API**
*   **Context:** React 18 introduced a new root rendering API.
*   **Action:** In `src/index.js`, modify the final rendering block.
    *   **Find:** The `import { render } from 'react-dom'` and the final `render(...)` call.
    *   **Replace with:**
        ```javascript
        import { createRoot } from 'react-dom/client';
        // ... inside the getStoredState callback
        const container = document.getElementById('synapp');
        const root = createRoot(container);
        root.render(
          <Provider store={store}>
            <App />
          </Provider>
        );
        ```

**Task 2.2: Refactor Redux with Redux Toolkit**
*   **Context:** Classic Redux requires a lot of boilerplate (actions, reducers, constants). Redux Toolkit simplifies this with "slices".
*   **Action: Install Redux Toolkit.** Run `npm install @reduxjs/toolkit`.
*   **Action: Create the first slice.**
    1.  Create a new directory: `src/features/gui/`.
    2.  Create a file `src/features/gui/guiSlice.js`.
    3.  Add the following content. This replaces `src/actions/gui.js` and `src/reducers/gui.js`.
        ```javascript
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
        ```
*   **Action: Update the store configuration.**
    1.  In `src/index.js`, import `configureStore` from `@reduxjs/toolkit` and your new `guiSlice`.
    2.  Replace the `createStore` call.
        ```javascript
        // Before:
        // import { createStore, applyMiddleware } from 'redux'
        // import rootReducer from './reducers'
        // store = createStore(rootReducer, restoredState, enhancers)

        // After:
        import { configureStore } from '@reduxjs/toolkit';
        import guiReducer from './features/gui/guiSlice'; // path will vary
        // ... and other slice reducers

        // This replaces the rootReducer file entirely
        const rootReducer = {
            gui: guiReducer,
            // ... other reducers will go here
        };

        store = configureStore({
          reducer: rootReducer,
          preloadedState: restoredState,
          middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunkMiddleware), // keep thunk for now
        });
        ```
*   **Action: Repeat for all other reducers.**
    *   Systematically create slice files for `audio`, `midi`, `video`, and `signal`. Move the logic from the old `actions` and `reducers` directories into these new slices.
    *   Update the `rootReducer` in `src/index.js` to include each new slice reducer.
    *   You can delete the old `src/actions` and `src/reducers` directories once all logic is migrated.

**Task 2.3: Convert Container Components to use React-Redux Hooks**
*   **Context:** The `connect()` Higher-Order Component is the legacy way to connect React to Redux. The modern way is with `useSelector` and `useDispatch` hooks.
*   **Action:**
    1.  Pick a simple container, like `src/containers/SelectTabLink.js`.
    2.  Rewrite it to be a functional component using hooks.
        ```javascript
        // Before (in SelectTabLink.js)
        // ... mapStateToProps and mapDispatchToProps ...
        // connect(...)(Link)

        // After (can be in a new file, e.g., src/features/gui/SelectTabLink.jsx)
        import { useSelector, useDispatch } from 'react-redux';
        import { setVisiblePane } from './guiSlice';
        import Link from '../../components/Link';

        export const SelectTabLink = ({ paneId, children }) => {
          const dispatch = useDispatch();
          const active = useSelector((state) => state.gui.visiblePane === paneId);

          const handleClick = () => {
            dispatch(setVisiblePane(paneId));
          };

          return (
            <Link active={active} onClick={handleClick}>
              {children}
            </Link>
          );
        };
        ```
    3.  Repeat this process for all components in `src/containers/`. You can merge the container and component logic into single functional component files. Delete the `src/containers` directory when done.

**Verification for Stage 2:**
*   Run `npm run dev`.
*   The application should load and be fully functional.
*   Clicking tabs and interacting with controls should update the application state as before.
*   The Redux DevTools extension (if installed) should show the new Redux Toolkit action types (e.g., `gui/setVisiblePane`).

---

### **Stage 3: Documentation and Final Polish**

**Goal:** Make the project understandable and easy for others to use.

**Task 3.1: Create a Comprehensive `README.md`**
*   **Context:** The project has no instructions for new developers.
*   **Action:** Overwrite the existing `README.md` with the following template:
    ````markdown
    # Synestizer

    Synestizer ("Listen to Colors") is a web application that creates sound from the color and movement detected by your webcam. It is an open-ended experiment in synesthetic interaction.

    This is a modernized version of the original project, updated with modern web development tools and practices.

    ## Features

    - **Video Analysis:** Uses your webcam to analyze real-time video for color, brightness, and motion.
    - **Generative Audio:** Translates video data into musical patterns and soundscapes using the Web Audio API (via Tone.js).
    - **MIDI Control:** Can both receive and send MIDI CC messages to interact with other music software and hardware.
    - **Flexible Mapping:** A patch matrix allows you to flexibly map any video signal to any audio or MIDI parameter.

    ## Getting Started

    ### Prerequisites

    - [Node.js](https://nodejs.org/) (v18.x or later recommended)
    - [npm](https://www.npmjs.com/) (comes with Node.js)

    ### Installation

    1.  Clone the repository:
        ```bash
        git clone https://github.com/synestize/synestizer.git
        cd synestizer
        ```

    2.  Install the dependencies:
        ```bash
        npm install
        ```

    ### Running the Development Server

    To run the app locally with hot-reloading:

    ```bash
    npm run dev
    ```

    Open your browser to `http://localhost:8080`. Your browser will ask for permission to use your webcam and microphone.

    ### Building for Production

    To create an optimized production build:

    ```bash
    npm run build
    ```

    The output will be in the `dist/` directory. You can serve this directory with any static file server.

    ## Project Structure

    -   `/dist`: Production build output.
    -   `/public`: Static assets like sounds and fonts (you may need to create this and move `css`, `fonts`, `presets`, `sound`).
    -   `/src`: The main application source code.
        -   `/components`: Reusable, "presentational" React components.
        -   `/features`: Feature-based directories containing Redux slices and connected React components.
        -   `/io`: The core logic for interacting with browser APIs (Web Audio, MIDI, Video). This is where the "magic" happens.
        -   `/lib`: Utility functions and libraries.
        -   `index.js`: The main application entry point.

    ## License

    This project is licensed under the GNU General Public License v2.0. See the [LICENSE](LICENSE) file for details.
    ````
*   **Action:** Create a `/public` directory in the root and move the `css`, `fonts`, `presets`, and `sound` folders into it. Update the `webpack.config.js` `devServer` static directory to point to `/public`.

**Task 3.2: Final Cleanup**
*   **Action:** Delete the old, unused webpack config files: `webpack-base.config.js`, `webpack-gallery.config.js`, `webpack-production.config.js`.
*   **Action:** Delete the now-empty `src/actions`, `src/reducers`, and `src/containers` directories.

**Verification for Stage 3:**
*   The `README.md` file is updated and accurate.
*   The project structure is cleaner.
*   `npm run dev` and `npm run build` both work correctly, serving all static assets. The application is fully functional.

This completes the modernization process. The Synestizer app will now have a stable foundation for future development and will be much easier for new contributors to understand and work with.
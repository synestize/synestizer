
1.  **Finalizing the UI Layer Refactor (Stage 2 Continued):**
    *   The legacy React `connect()` pattern and the `src/containers` directory still exist. The next logical step is to replace `connect()` with React-Redux hooks (`useSelector`, `useDispatch`) and merge the "container" logic into the "presentational" components.
    *   The `PropTypes` dependency (`react-addons-perf`) is still in `package.json` but is obsolete. We should remove it and the `PropTypes` usage in components.

2.  **Documentation & Cleanup (Stage 3):**
    *   The `README.md` file still contains the old project description and no setup instructions.
    *   The old webpack config files (`webpack-base.config.js`, etc.) are still in the root directory.
    *   There is no `/public` directory yet for static assets like `css`, `fonts`, and `presets`.

---

### Next Work List for Your AI Assistant

Let's proceed with **Stage 2 (Continued)**. The goal is to fully eliminate the legacy `connect()` pattern and the `src/containers` directory, making the UI layer truly modern.

**Goal:** Convert all remaining "container" components to use modern React-Redux hooks (`useSelector` and `useDispatch`) and merge them with their corresponding presentational components.

**Task 2.8: Convert a Simple Container Component to use Hooks**

*   **Context:** The `SelectTabLink` container is a perfect first candidate. It connects a `Link` component to the Redux store. We will merge them into a single, modern functional component.
*   **Action:**
    1.  Delete the file `src/containers/SelectTabLink.js`.
    2.  Open `src/components/TabNav.js` and modify it to use a new, self-contained `SelectTabLink` component that uses hooks directly.
    3.  Overwrite `src/components/TabNav.js` with the following code:
        ```javascript
        import React from 'react';
        import { useSelector, useDispatch } from 'react-redux';
        import { setVisiblePane } from '../features/gui/guiSlice';
        import Link from './Link'; // Assuming Link.js is still used

        // This is the new, hook-based component that was previously a container.
        const SelectTabLink = ({ paneId, children }) => {
          const dispatch = useDispatch();
          // Use `useSelector` to get data from the Redux store.
          const active = useSelector((state) => state.gui.visiblePane === paneId);

          const handleClick = () => {
            // Use `useDispatch` to dispatch actions.
            dispatch(setVisiblePane(paneId));
          };

          return (
            <Link active={active} onClick={handleClick}>
              {children}
            </Link>
          );
        };

        // The TabNav component now uses the new hook-based SelectTabLink.
        const TabNav = () => {
          return (<nav className="tabnav"><ul className="tabs">
            <li>
              <SelectTabLink paneId="welcome" >
                About
              </SelectTabLink>
            </li>
            <li>
              <SelectTabLink paneId="io" >
                Settings
              </SelectTabLink>
            </li>
            <li>
              <SelectTabLink paneId="sound">
                Sound
              </SelectTabLink>
            </li>
            <li>
              <SelectTabLink paneId="performance">
                Performance
              </SelectTabLink>
            </li>
          </ul></nav>)
        }
        export default TabNav;
        ```
    4.  **Note:** You can now remove the `PropTypes` from `src/components/Link.js` as they are legacy.

**Task 2.9: Convert All Remaining Container Components**
*   **Context:** We will now apply the same pattern to every file in the `src/containers` directory. For each container, we will create a new functional component that uses hooks and replace the old one.
*   **Action (Repeat this process for each file in `src/containers/`):**
    1.  **Identify** a container file, for example, `src/containers/MasterAudioGain.js`. It connects to the `AudioGainFader` component.
    2.  **Create a new functional component**, for example, in `src/features/audio/MasterAudioGain.js`.
    3.  In this new file, **re-implement the logic from both the container and the component** using `useSelector` for `mapStateToProps` logic and `useDispatch` for `mapDispatchToProps` logic.
    4.  **Delete** the original container (`src/containers/MasterAudioGain.js`) and the original presentational component (`src/components/AudioGainFader.js`).
    5.  **Update** any component that was importing the old container (e.g., `AudioMasterControls.js`) to import the new functional component from its new location in `src/features/`.
    6.  **Remove `PropTypes`** from the component as you refactor it.

**Task 2.10: Clean Up `PropTypes` and `react-addons-perf`**
*   **Context:** As we refactor all components, `PropTypes` will become fully obsolete.
*   **Action:**
    1.  Once all components in `src/components` and `src/containers` have been refactored into functional components inside `src/features`, the `PropTypes` import and usage can be removed from all files.
    2.  In `package.json`, remove the `react-addons-perf` dependency.
    3.  Delete the `src/containers` directory entirely.

**Verification for Stage 2 (Completion):**
*   The `src/containers` directory is completely gone.
*   The `src/components` directory now only contains simple, reusable, "dumb" components that don't connect to Redux (like `Icon.js`, `SVG.js`, `SubPane.js`). All components with Redux logic now live in `src/features/`.
*   Run `npm run dev`. The application must compile and run flawlessly.
*   All UI interactions (changing tabs, adjusting sliders, mapping signals) should work as expected.

Once this stage is complete, the application's entire UI and state management layer will be fully modernized. The final step will be the documentation and cleanup from Stage 3.
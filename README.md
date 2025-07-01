# Synestizer Indigo

Synestizer Indigo is a web-based application that creates sound from live video input, creating a synesthetic experience for the user. This project is a modern, green-field rewrite of an older application, built with a focus on performance, maintainability, and a better developer experience.

## MVP Feature Set

The goal for the Minimum Viable Product (MVP) is to deliver the core synesthesia experience with minimal complexity.

1.  **Video Capture:** Display a live video stream from the user's webcam.
2.  **Basic Feature Extraction:** Analyze the video in real-time to extract a single, simple feature: the overall brightness of the video frame.
3.  **Simple Synthesizer:** Generate a basic synthesized tone.
4.  **Direct Mapping:** Modulate a parameter of the synthesizer (e.g., its frequency) based on the extracted brightness value.
5.  **Core Controls:** A simple UI with a button to start and stop the audio-visual experience.

## Technology Stack

*   **Build Tool:** Vite
*   **Frontend Framework:** React (with Hooks)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **Audio Synthesis:** Tone.js
*   **Video Processing:** Offloaded to a Web Worker to ensure a non-blocking UI.
*   **Package Manager:** pnpm

## Performance Architecture

To avoid UI stuttering and performance degradation from high-frequency video analysis, this application adheres to the following principles:

1.  **Processing Off-Thread:** All intensive video frame analysis is performed in a dedicated Web Worker to prevent blocking the main UI thread.

2.  **State Decoupling:** We strictly separate two types of state:
    *   **Control State:** Low-frequency user interactions (e.g., Start/Stop button). Managed in Zustand for global access.
    *   **Data State:** High-frequency data from video analysis (e.g., brightness). This is intentionally **kept out of Zustand** to prevent application-wide re-renders.

3.  **Update Throttling:** The data sent from the Web Worker to the main thread is throttled to a rate that ensures UI responsiveness without overwhelming the event loop (e.g., 15 updates per second).

4.  **Direct Service Communication:** High-frequency data is passed directly from the worker message handler to the relevant services (like the `audioService`) where possible, completely bypassing the React render cycle. Data is only stored in a React component's local state if it is necessary for rendering a UI element.

## Development Best Practices & Error Prevention

This project implements several strategies to prevent silent failures and improve development experience:

### Error Handling
- **Error Boundary:** React error boundary component (`ErrorBoundary.tsx`) catches JavaScript runtime errors and displays helpful error messages instead of blank white pages
- **Graceful Degradation:** Components fail safely with clear error states rather than breaking the entire application

### TypeScript Best Practices
- **Type Safety:** All imports/exports are properly typed to catch compilation errors early
- **Local Type Definitions:** When module resolution issues occur, types are defined locally to avoid runtime import failures
- **Strict Compilation:** Use `npx tsc --noEmit` to check for TypeScript errors before runtime

### Development Workflow
1. **Always Check Console:** Monitor browser DevTools Console for errors after any changes
2. **Pre-commit Validation:** Run TypeScript compilation checks before deploying changes
3. **Module Resolution:** Be careful with TypeScript type exports - prefer local type definitions when imports fail
4. **Network Tab Monitoring:** Check DevTools Network tab for failed module loads

### Common Pitfalls & Solutions
- **Blank White Page:** Usually indicates a JavaScript error - check console immediately
- **Module Import Errors:** TypeScript type imports can fail at runtime - define types locally as fallback
- **Silent Audio Failures:** Audio context requires user interaction - always call `Tone.start()` after user action
- **Worker Loading Issues:** Ensure Web Worker files are accessible via URL constructor with proper module type

### Debugging Steps
1. Open browser DevTools Console
2. Look for red error messages
3. Check Network tab for 404s or failed loads
4. Verify TypeScript compilation with `npx tsc --noEmit`
5. Test in multiple browsers if issues persist

### Future Improvements
- Consider adding ESLint with strict rules for additional compile-time checking
- Implement automated testing to catch regressions
- Add performance monitoring for Web Worker communication
- Consider adding runtime type checking for critical data flows
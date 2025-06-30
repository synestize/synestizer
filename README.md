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
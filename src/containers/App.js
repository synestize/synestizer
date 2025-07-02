'use strict';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as Tone from 'tone';
import TabNav from '../components/TabNav';
import CurrentPane from '../components/CurrentPane';

const App = () => {
  const visiblePane = useSelector(state => state.gui.visiblePane);
  const [started, setStarted] = useState(false);

  const handleStart = async () => {
    try {
      await Tone.start();
      console.log('Audio context started');
      setStarted(true);
    } catch (error) {
      console.error('Failed to start audio context:', error);
    }
  };

  if (!started) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)', color: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ marginBottom: '20px', fontSize: '3em', textAlign: 'center' }}>
          🎵 Synestizer
        </h1>
        <p style={{ marginBottom: '30px', fontSize: '1.2em', textAlign: 'center', maxWidth: '600px' }}>
          Transform colors and movement into sound. This application uses your webcam and creates audio from visual input.
        </p>
        <button 
          onClick={handleStart} 
          style={{
            fontSize: '1.5em', 
            padding: '20px 40px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
        >
          🚀 Start Synestizer
        </button>
        <p style={{ marginTop: '20px', fontSize: '0.9em', opacity: 0.7, textAlign: 'center' }}>
          Click to enable audio and begin the experience
        </p>
      </div>
    );
  }

  return (
    <div>
      <TabNav />
      <CurrentPane visiblePane={visiblePane} />
    </div>
  );
};

export default App;

import React, { Component, PropTypes } from 'react';
import Video, { Component, PropTypes } from 'react';

  <section id="video-display">
    <canvas id="video-canvas"></canvas>
    <video id="video-video" muted autoplay></video>
    <h1 id="logo">SYNESTIZER</h1>
  </section>
  <section id="controlpanels">
    <nav>
      <ul class="tabs">
        <li><a class="tabs-link tabs-link-active" href="#info-tab">About</a></li>
        <li><a class="tabs-link" href="#input-tab">Inputs</a></li>
        <li><a class="tabs-link" href="#output-tab">Outputs</a></li>
        <li><a class="tabs-link" href="#iomatrix-tab">I/O matrix</a></li>
        <li><a class="tabs-link" href="#audio-tab">Synths</a></li>
      </ul>
    </nav>
    <section id="info-tab" class="tab-content">
      <h2>
        Welcome to Synestizer.
      </h2>
      <p>
        Please enable your webcam in the browser and activate your loudspeakers.<br />
        This app requires an updated version of <a href="http://www.google.com/chrome/">chrome</a>.<br />
        <a href="http://synestize.github.io/synestizer/">More info.</a>
      </p>
      <p>&copy; 2016 by <a href="http://www.kasparkoenig.com/">kaspar</a>,
      <a href="https://danmackinlay.name">dan</a> &amp;
      <a href="http://www.stahlnow.com">stahl</a>.
      This work is licensed under a <a rel="license"
      href="http://www.gnu.org/licenses/licenses.en.html">GNU General Public License version 2.0 or later</a>.</p>
    </section>
    <section id="input-tab" class="tab-content controls">
      <section id="video-input"></section>
      <section id="midi-input"></section>
    </section>
    <section id="output-tab" class="tab-content controls">
      <section id="midi-output"></section>
    </section>
    <section id="iomatrix-tab" class="tab-content controls">
      <h2>
        IO matrix
      </h2>
    </section>
    <section id="audio-tab" class="tab-content controls">
      <section id="audio-master" class="controls"></section>
      <section id="audio-justsawtooth" class="controls"></section>
    </section>
  </section>
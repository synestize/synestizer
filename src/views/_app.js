"use strict";
import { Component, PropTypes } from 'react';


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
      <p>
        If you like this project you can donate to it:
      </p>
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
        ">
        <input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online.">
        <img alt="" border="0" src="https://www.paypalobjects.com/nl_NL/i/scr/pixel.gif" width="1" height="1">
      </form>
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

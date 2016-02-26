---
title: TODO
---

# TODO

* UI improvements
  * default to active MIDI
  * MIDI out solo button
* Go to single app object to update all state.
  * make all panels aspects of the same App state for easier rendering.
* video should use webrtc so that it can handle non-local video sources.
* https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_textures_in_WebGL
* workflow
  * http://www.jonathan-petitcolas.com/2015/05/15/howto-setup-webpack-on-es6-react-application-with-sass.html
  * http://humaan.com/getting-started-with-webpack-and-react-es6-style/
  * http://survivejs.com/webpack_react/introduction/
  * https://christianalfoni.github.io/react-webpack-cookbook/
  * https://github.com/petehunt/webpack-howto
  * to get SSL, maybe by creating a caddy deploy workflow to some host
  * We need to get UglifyJS2 minimizing the bloated JS, but it [doesn't seem to support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
  * [build docs site automatically?](http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/)

* A *patch* should map between

    * input params
    
        * Video analysis
        * [Fiducial tracking](https://github.com/mkalten/reacTIVision/tree/master/ext/libfidtrack)
        * GUI widgets
        * Audio analysis
        * device sensors
        * other sensors?
          * [Leap Control](https://developer.leapmotion.com/getting-started/javascript)
        * General websockets?
        * OpenSoundControl?
    
    * output params
    
      * audio ensemble parameters
      * MIDI CC out
      * OpenSoundControl?
      * General websockets?

    * Patches could have a separate mapping GUI for constructing the mapping
    * Copula-function-based covariance
      
      * tanh and erf copulae

* Meta

    * automatic letsencrypt SSL
    * better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

* prettier docs website

* speed improvements

  * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

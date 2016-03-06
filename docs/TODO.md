---
title: TODO
---

# TODO

* UI improvements
  * default to active MIDI
  * MIDI out solo button
* video should use webrtc so that it can handle non-local video sources.
* https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Animating_textures_in_WebGL
* workflow
* https://docs.npmjs.com/misc/config
  * http://www.jonathan-petitcolas.com/2015/05/15/howto-setup-webpack-on-es6-react-application-with-sass.html
  * http://humaan.com/getting-started-with-webpack-and-react-es6-style/
  * http://survivejs.com/webpack_react/introduction/
  * https://christianalfoni.github.io/react-webpack-cookbook/
  * https://github.com/petehunt/webpack-howto
  * to get SSL, maybe by creating a caddy deploy workflow to some host
  * We need to get UglifyJS2 minimizing the bloated JS, but it [doesn't seem to support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
    * However, there is [babel-plugin-uglify](https://www.npmjs.com/package/babel-plugin-uglify) which does it at the babel layer, so we could compile to ES5 and uglify?
  
  * [build docs site automatically?](http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/)
* App improvements
  * Go to single app object to update all state.
    * make all panels aspects of the same App state for easier rendering.
  * The current approach is a little bit ad hoc. Princpled people use Cycle.js, but I don't want to write my own MIDI/Video support for them
  * [redux](http://redux.js.org/index.html) is a simple alternative to flux that helps a little bit
  * [alt](https://github.com/goatslacker/alt) is a slightly more advanced react.
  * [react-webpack-node](https://github.com/choonkending/react-webpack-node) is an example of how these simplify things

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
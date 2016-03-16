---
title: TODO
---

# TODO


* currently:

  * implement audio model
    * Probably each ensemble should just be a mini-app, with its own view logic etc
  
  * audio input: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
  * MIDI outputs are not being correctly disposed.
  * save/load

* UI improvements
  * desaturation should treat +/-1 less "extremely" so that it captures a control.
  * default to active MIDI
  * friendlier stream names
  * animate transitions and updates
  * set "central" value of param
    
    * This could be as simple as setting a default mapping from synth slider to output value, by cooperating between streampatch and synth (might need refactor)
    * or letting each output parameter have a "center" parameter and also display perturbation, augmenting the output stream model
  * switch param mappers to be higher order/factory functions, currying appropriately

* improve help if you have

  * the wrong browser
  * the wrong version of the right browser
  * some other camera-app stealing access to the camera
* workflow
  * http://www.jonathan-petitcolas.com/2015/05/15/howto-setup-webpack-on-es6-react-application-with-sass.html
  * http://humaan.com/getting-started-with-webpack-and-react-es6-style/
  * http://survivejs.com/webpack_react/introduction/
  * https://christianalfoni.github.io/react-webpack-cookbook/
  * https://github.com/petehunt/webpack-howto
  * to get SSL, maybe by creating a caddy deploy workflow to some host

  * We need to get UglifyJS2 minimizing the bloated JS, but it [doesn't support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
    * However, there is [babel-plugin-uglify](https://www.npmjs.com/package/babel-plugin-uglify) which does it at the babel layer, so we could compile to ES5 and uglify?
  
  * [build docs site automatically?](http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/)
* App improvements
  * Go to single app object to update all state.
    * make all panels aspects of the same App state for easier rendering.
  * The current approach is a little bit ad hoc. Principled people use Cycle.js, but I don't want to write my own MIDI/Video support for them
  * [redux](http://redux.js.org/index.html) is a simple alternative to flux that helps a little bit
  * [alt](https://github.com/goatslacker/alt) is a slightly more advanced react.
  * [react-webpack-node](https://github.com/choonkending/react-webpack-node) is an example of how these simplify things

* A *patch* should map between

    * input params
    
        * Video analysis [done]
        * MIDI CC in [done]
        * GUI widgets
        * central baseline values
        * [Fiducial tracking](https://github.com/mkalten/reacTIVision/tree/master/ext/libfidtrack)
        * Audio analysis
        * device sensors
        * other sensors?
          * [Leap Control](https://developer.leapmotion.com/getting-started/javascript)
        * General websockets?
        * OpenSoundControl?
    
    * output params
    
      * audio ensemble parameters
      * MIDI CC out [done]
      * OpenSoundControl?
      * General websockets?

    * Patches could have a separate mapping GUI for constructing the mapping
    * Copula-function-based covariance
      
      * tanh [done]
      * erf copulae 

* video should use webrtc so that it can handle non-local video sources.
* Meta

    * automatic letsencrypt SSL
    * better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

* prettier docs website

* speed improvements

  * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

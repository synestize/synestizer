---
title: TODO
---

# TODO

* Go to single app object to update all state.
  * make all panels aspects of the same App state for easier rendering.
* go to ES6 module definitions
* workflow
  * http://www.jonathan-petitcolas.com/2015/05/15/howto-setup-webpack-on-es6-react-application-with-sass.html
  * http://humaan.com/getting-started-with-webpack-and-react-es6-style/
  * http://survivejs.com/webpack_react/introduction/
  * https://christianalfoni.github.io/react-webpack-cookbook/
  * https://github.com/petehunt/webpack-howto
  * to get SSL, probably best to create a caddy deploy workflow to some host
  * [build docs site automatically?](http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/)

* A *patch* should map between

    * input params
    
        * Video analysis  
        * MIDI CC in [DONE]
        * GUI widgets
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
    * web workers
        * [web worker background](http://www.html5rocks.com/en/tutorials/workers/basics/)
        * [you can pass arrays to web workers]( http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
        * [you can pass canvas to web workers](          http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#transferCanvasProxy)
    * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

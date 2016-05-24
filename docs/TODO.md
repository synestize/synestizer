---
title: TODO
---

# TODO

* currently:

  * switch param mappers to be higher order/factory functions,
    [currying](https://web.archive.org/web/20140714014530/http://hughfdjackson.com/javascript/why-curry-helps) [appropriately](http://ramdajs.com/docs/#expand)
    * include inversion where exists?
  * refactoring presentation because of craziness.
    * [smart and dumb](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.1ib9ws3ub)
    * [react+redux](http://redux.js.org/docs/basics/UsageWithReact.html)
    * [thinking in react](https://facebook.github.io/react/docs/thinking-in-react.html)
    * [react context](https://facebook.github.io/react/docs/context.html)
    * [react connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
  * implement audio model
  * Get Christoph's help moving the yellow.listentocolors.net
  * randomisation of synth median point on load
  * random sparse mapping on load
  * speed of controllers changes when in the background
  * Better solo UI (What does "off" mean?)
  * Mute-all UI
  * example Ableton set
  * Default MIDI mapping
  * instructions when camera is not found
  * MIDI outputs/sinks are not being correctly disposed.
  * Need to show perturbation and final value of synth values
  * switch param mappers to be higher order/factory functions,
    [currying](https://web.archive.org/web/20140714014530/http://hughfdjackson.com/javascript/why-curry-helps) [appropriately](http://ramdajs.com/docs/#expand)
    * include inversion where exists?
  * need to generate MIDI note sequences as well so that we don't need arpeggiators for output.
  * audio input: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaStreamSource
  * save/load

    * this will be hard without an app model refactor. See below.
  
  * optional CSS filters on video

* UI improvements
  * desaturation should treat +/-1 less "extremely" so that it captures a control.
    * this is probably simplest to achieve by clipping inputs to [-0.999, 0.999], which is not fancy but probably fine.
  * default to active MIDI
  * friendlier stream labels
  * animate transitions and updates
  * set "central" value of param by letting each output parameter have a "center" parameter and also display perturbation, augmenting the output stream model

* improve help if you have

  * the wrong browser
  * the wrong version of the right browser
  * some other camera-app stealing access to the camera
  * CPU overload

* workflow

  * to get SSL, maybe by creating a caddy deploy workflow to some host
  * We need to get UglifyJS2 minimizing the bloated JS, but it [doesn't support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
    * However, there is [babel-plugin-uglify](https://www.npmjs.com/package/babel-plugin-uglify) which does it at the babel layer, so we could compile to ES5 and uglify?

  * [build docs site automatically?](http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/)
* App improvements
  * The current approach is a little bit ad hoc. Principled people use Cycle.js, but I don't want to write my own MIDI/Video support for Cycle.js
  * Go to single app object to update all state.
    * make all panels aspects of the same App state for easier rendering, e.g. using [react-tabs](https://github.com/reactjs/react-tabs)
    * possibly should [switch to redux for this](http://redux.js.org/docs/basics/UsageWithReact.html).  ([see also](https://www.gitbook.com/book/tonyhb/redux-without-profanity/details))
    * or use rx with a redux pattern [A](https://github.com/jas-chen/rx-redux), [B](https://github.com/jas-chen/redux-core), or [C](https://github.com/acdlite/redux-rx). It's recommended to [not even bother with redux in that case](http://redux.js.org/docs/introduction/PriorArt.html#rx)
    * [alt](https://github.com/goatslacker/alt) is a slightly more advanced react.
    * Allow configuring app from the URL, e.g. with [react-router](https://github.com/reactjs/react-router)
  * Memoize derived state, e.g. with [reselect](https://github.com/reactjs/reselect) ([example in action](http://redux.js.org/docs/recipes/ComputingDerivedData.html))
  * state management could be better. [react-ui](https://github.com/tonyhb/redux-ui)?
  * Immutable state [1](https://facebook.github.io/react/docs/advanced-performance.html) [2](https://blog.risingstack.com/the-react-js-way-flux-architecture-with-immutable-js/)

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

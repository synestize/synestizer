# TODO

* currently:
  * Go to single app object to update all state.
    * save/load
    * [react context](https://facebook.github.io/react/docs/context.html)
    * [react connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
    * [redux middleware](http://redux.js.org/docs/advanced/Middleware.html)
    * [redux asynchrony middleware](http://redux.js.org/docs/advanced/AsyncActions.html)
    * [react asynchrony made simple](https://reactjsnews.com/redux-middleware)
    * make all panels aspects of the same App state for easier rendering, e.g. using [react-tabs](https://github.com/reactjs/react-tabs)
  * Get Christoph's help moving the yellow.listentocolors.net
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
  * implement audio model
  * Get Christoph's help moving the yellow.listentocolors.net
  * randomisation of synth median point on load
  * random sparse mapping on load
  * need to generate MIDI note sequences as well so that we don't need arpeggiators for output.
  * audio input
  * optional CSS filters on video

* UI improvements
  * more natural frequency mapping, such as
    * [sones](http://www.icad.org/Proceedings/2006/FergusonCabrera2006.pdf)
  * desaturation should treat +/-1 less "extremely" so that it captures a control.
    * this is probably simplest to achieve by clipping inputs to [-0.999, 0.999], which is not fancy but probably fine.
  * default to active MIDI
  * friendlier stream labels
  * animate transitions and updates
  * set "central" value of param by letting each output parameter have a "center" parameter and also display perturbation, augmenting the output stream model
  * Svg widgets? http://stackoverflow.com/a/30579774

* improve help message if you have

  * the wrong browser
  * the wrong version of the right browser
  * some other camera-app stealing access to the camera
  * CPU overload

* workflow

  * We need to get UglifyJS2 minimizing the bloated JS, but it [doesn't support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
    * However, there is [babel-plugin-uglify](https://www.npmjs.com/package/babel-plugin-uglify) which does it at the babel layer, so we could compile to ES5 and uglify?

* App improvements
  * Allow configuring app from the URL, e.g. with [react-router](https://github.com/reactjs/react-router)
  * Memoize derived state, e.g. with [reselect](https://github.com/reactjs/reselect) ([example in action](http://redux.js.org/docs/recipes/ComputingDerivedData.html))
  * Consistently use Map or Object or Immutableverywhere.

    * If we want to use Object, remember, ``Object.keys(thing).length`` will get the size of ``thing``.
    * Immutable state? [1](https://facebook.github.io/react/docs/advanced-performance.html) [2](https://blog.risingstack.com/the-react-js-way-flux-architecture-with-immutable-js/)

* Go to [rxjs 5.0](https://github.com/ReactiveX/RxJS)
* A *patch* should map between

    * input params

        * Video analysis [done]
        * MIDI CC in [done]
        * GUI widgets
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

    * better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

* speed improvements

  * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

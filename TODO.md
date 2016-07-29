# TODO

* currently:
  * Get Christoph's help moving the yellow.listentocolors.net
  * speed of controllers changes when in the background
  * example Ableton set
  * Need to show perturbation and final value of synth values
  * implement audio model
  * Get Christoph's help moving the yellow.listentocolors.net
  * randomisation of synth median point on load
  * random sparse mapping on load
  * need to generate MIDI note sequences as well so that we don't need arpeggiators for output.
  * audio input
  * optional CSS filters on video

* UI improvements
  * save/load UI (preset names etc)
  * desaturation should treat +/-1 less "extremely" so that it captures a control.
    * this is probably simplest to achieve by clipping inputs to [-0.999, 0.999], which is not fancy but probably fine.
  * animate transitions and updates
  * set "central" value of param by letting each output parameter have a "center" parameter and also display perturbation, augmenting the output stream model
  * Svg widgets? http://stackoverflow.com/a/30579774
  * [materialui widgets](http://www.material-ui.com/#/components/slider)?

* improve help message if you have

  * the wrong browser
  * the wrong version of the right browser
  * some other camera-app stealing access to the camera
  * CPU overload

* workflow

  * We need to get UglifyJS2 minimizing the bloated JS, but it [doesn't support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
    * However, there is [babel-plugin-uglify](https://www.npmjs.com/package/babel-plugin-uglify) which does it at the babel layer, so we could compile to ES5 and uglify?
    * there is an alternative competitor [escompress](https://github.com/escompress/escompress), which [integrates to Babel es6](https://github.com/escompress/babel-preset-escompress).

* App improvements
  * Allow configuring app from the URL, e.g. with [react-router](https://github.com/reactjs/react-router)
  * Memoize derived state, e.g. with [reselect](https://github.com/reactjs/reselect) ([example in action](http://redux.js.org/docs/recipes/ComputingDerivedData.html))
  * Consistently use Object or Immutableverywhere.

    * If we want to use Object, remember, ``Object.keys(thing).length`` will get the size of ``thing``.
    * Immutable state? [1](https://facebook.github.io/react/docs/advanced-performance.html) [2](https://blog.risingstack.com/the-react-js-way-flux-architecture-with-immutable-js/)

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

* video should handle non-local video sources.
* audio
  * more natural frequency/amplitude mapping, such as
    * [sone, mels or erbs](http://www.icad.org/Proceedings/2006/FergusonCabrera2006.pdf),
* Meta

    * better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

* speed improvements

  * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)
  * Do partial imports of RxJs
    ```
    import {Observable} from 'rxjs/Observable';
    import {map} from 'rxjs/operator/map';

    Observable.of(1,2,3)::map(x => x + '!!!'); // etc
    ```
  * ditch ramda; it's enormous and we barely use it

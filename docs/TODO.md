# TODO

## currently

* audio manages all UI/signal wrangling for ensembles
* stop speed of controllers changing when in the background
* midi channel numbers should match Ableton convention
* Need to show perturbation and final value of synth values
* implement audio model
* Get Christoph's help moving the yellow.listentocolors.net
* random sparse mapping button
* generate MIDI note sequences as well so that
  we don't need arpeggiators for output.
* audio input
* optional CSS filters on video
* remove JSX from the CurrentPane and go to firect React invocation
* Do partial imports of RxJs as in videoworker.js

## UI improvements

* UI for save/load (preset names etc)
* animate transitions and updates
* set "central" value of param by letting each output parameter have a
  "bias" parameter
* Svg widgets? http://stackoverflow.com/a/30579774
* [materialui widgets](http://www.material-ui.com/#/components/slider)?
* improve help message if you have
  * the wrong browser
  * the wrong version of the right browser
  * some other camera-app stealing access to the camera
  * CPU overload

## developer workflow

* We need to get UglifyJS2 minimizing the bloated JS, but it [doesn't support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
  * However, there is [babel-plugin-uglify](https://www.npmjs.com/package/babel-plugin-uglify) which does it at the babel layer, so we could compile to ES5 and uglify?
  * there is an alternative competitor [escompress](https://github.com/escompress/escompress), which [integrates to Babel es6](https://github.com/escompress/babel-preset-escompress).
* Immutable state? [1](https://facebook.github.io/react/docs/advanced-performance.html) [2](https://blog.risingstack.com/the-react-js-way-flux-architecture-with-immutable-js/)
* better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

## User workflow

* Allow configuring app from the URL, e.g. with [react-router](https://github.com/reactjs/react-router)
* Memoize derived state, e.g. with [reselect](https://github.com/reactjs/reselect) ([example in action](http://redux.js.org/docs/recipes/ComputingDerivedData.html))
* video should handle non-local video sources.
* audio
  * more natural frequency/amplitude mapping, such as
    * [sone, mels or erbs](http://www.icad.org/Proceedings/2006/FergusonCabrera2006.pdf),

### new input params

* GUI widgets?
* [Fiducial tracking](https://github.com/mkalten/reacTIVision/tree/master/ext/libfidtrack)?
* Audio analysis?
* device sensors?
* other sensors?
  * [Leap Control](https://developer.leapmotion.com/getting-started/javascript)
* General websockets?
* OpenSoundControl?

### new output params

* OpenSoundControl?
* General websockets?

## speed improvements

* [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

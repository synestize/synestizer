# TODO

## currently

* audio manages all UI/signal wrangling for ensembles
* audio publishes a certain number of signal buses and maps individual controllers to each
* video, midi and audio all publish signals slightly differently; should make this consistent
* stop speed of controllers changing when in the background
* midi channel numbers should match Ableton convention
* Need to show perturbation and final value of synth values
* implement audio model
* audio input
* Get Christoph's help moving the yellow.listentocolors.net
* random sparse mapping button
* generate MIDI note sequences as well so that
  we don't need arpeggiators for output.
* optional CSS filters on video
* remove JSX from the CurrentPane and go to direct React invocation

## UI improvements

* UI for save/load (preset names etc)
* compress down bias/scale widgets when not in use
* scale widgets should be attached to signal select widgets in audio stuff
* show level of attachable signals
* animate transitions and updates
* Svg widgets? http://stackoverflow.com/a/30579774
* [materialui widgets](http://www.material-ui.com/#/components/slider)?
* improve help message if you have
  * the wrong browser
  * the wrong version of the right browser
  * some other camera-app stealing access to the camera
  * CPU overload

## developer workflow

* move update rate into app settings
* Immutable state? [1](https://facebook.github.io/react/docs/advanced-performance.html) [2](https://blog.risingstack.com/the-react-js-way-flux-architecture-with-immutable-js/)
* better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

## User workflow

* Allow configuring app from the URL, e.g. with [react-router](https://github.com/reactjs/react-router)
* video should handle non-local video sources.
* audio
  * more natural frequency/amplitude mapping, such as
    * [sone, mels or erbs](http://www.icad.org/Proceedings/2006/FergusonCabrera2006.pdf),

### new input signals

* GUI widgets?
* [Fiducial tracking](https://github.com/mkalten/reacTIVision/tree/master/ext/libfidtrack)?
* Audio analysis?
* device sensors?
* other sensors?
  * [Leap Control](https://developer.leapmotion.com/getting-started/javascript)
* General websockets?
* OpenSoundControl?

### new output signals

* OpenSoundControl?
* General websockets?

## speed improvements

* [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)
* Memoize derived state, e.g. with [reselect](https://github.com/reactjs/reselect) ([example in action](http://redux.js.org/docs/recipes/ComputingDerivedData.html))

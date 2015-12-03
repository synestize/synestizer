---
title: Notes
---

# Notes

Notes auditioning for a place in the documentation

## TODO

* Revised patching system

  * accept synth parameters in URL fragments (esp to set master output volume!)
  * A *patch* should map between
    * audio ensemble parameters
    * and input data 
      * Video analysis
      * MIDI CC
      * GUI widgets
  * The mapping could be One-To-One or Many-To-Many, or whatever.
  * Param values could be modulated around a "central" value, and have a "Sensitivity" of modulation, or it could be all-or-nothing.
  * Patches could have a separate mapping GUI for constructing the mapping
  * Always set up a master gain and master compressor

* Meta

  * smoother workflow to host live on github
  * Move to modular architecture in the AMD style,
    e.g. using [require.js](http://requirejs.org/) --
    [see explanation](http://eloquentjavascript.net/10_modules.html)
  * [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)
  * build docs site? http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/

* MIDI *mapping* (right now it is hard coded)

* Video analysis improvements

  * Only operate on a square grid of pixels (64x64)
  * web workers
      * [web worker background](http://www.html5rocks.com/en/tutorials/workers/basics/)
      * [you can pass arrays to web workers:]( http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
      * [you can pass canvas to web workers](          http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#transferCanvasProxy)
  * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

## javascript tips

* how to instantiate a WAC from javascript:

      // live-inserts a knob.
      function test() {
          var y = document.createElement("webaudio-knob");
          y.setAttribute("src", "img/LittlePhatty.png");
          y.sprites=100;
          y.ready();
          document.body.appendChild(y);
          return y;
      }
      
* Switch to chainable API style
* Jquery is too big. Alternatives:

  * [Qwuery](https://github.com/ded/qwery) + [bonzo](https://github.com/ded/bonzo)
  * [zepto](http://zeptojs.com/)
  * [But do we really need jquery](http://youmightnotneedjquery.com/), especially since we don't care about old browsers?

## linear algebra options

Ranked in descending order of viability:

* [linear-algebra](https://github.com/hiddentao/linear-algebra) ([blog post](http://www.hiddentao.com/archives/2014/07/23/linear-algebra-in-javascript/))

  Efficient, high-performance linear algebra library for node.js and browsers.

  This is a low-level algebra library which supports basic vector and matrix
  operations, and has been designed with machine learning algorithms in mind.

  Features:

  Simple, expressive, chainable API.
  Array implementation with performance optimizations.
  Enhanced floating point precision if needed.
  Comprehensive unit tests.
  Works in node.js and browsers.
  Small: ~1 KB minified and gzipped.    
* [sylvester](http://sylvester.jcoglan.com/) the original, but predates much modern optimisation such as native arrays and asm.js
* [jStat](https://github.com/jstat/jstat) is a statistical library written in JavaScript that allows you to perform advanced statistical operations without the need of a dedicated statistical language (e.g. MATLAB or R).
  Includes a tidy linear algebra library, but could be better optimised.
* [lmfit](https://github.com/jvail/lmfit.js)

  JavaScript (emscripten) port of lmfit library:

  "a self-contained C library for Levenberg-Marquardt least-squares
  minimization and curve fitting" 

  Currently only linear curve fitting is implemented.
* [linalg](https://github.com/ben-ng/linalg)
  uses native arrays because of their speed.
  
  “I needed a performance focused linear algebra module for visualizing data
  in 10+ dimensions, and implementing machine learning algorithms. I quickly
  learned that naive solutions to linear algebra operations can produce
  numerical errors so significant they are utterly useless for anything other
  than casual playtime. After that, I prioritized correctness over
  performance.”
  
  Untouched since released and small community, which is sad
  because the code looks solid.  
* [glmatrix](http://glmatrix.net/) is WebGL (therefore VERY fast),
  but 4-vector oriented, which is too small for us
* [numeric](http://numericjs.com/wordpress/) looks polished
  but has been untouched for 2 years

### User interface improvements

* low-complexity sliders: [fd-slider](https://github.com/metaflop/fd-slider)
* more natural frequency mapping, such as
    * [sones](http://www.icad.org/Proceedings/2006/FergusonCabrera2006.pdf)
* patchcords vis [jsPlumbum](https://jsplumbtoolkit.com/demo/flowchart/dom.html)!
* User interface library possibilities

  * [WAAX's MUI](https://hoch.github.io/WAAX/waax/examples/mui/)
  * [Google MDC](http://www.getmdl.io/index.html)
  * [WebAudioComponents]()

## Workflow options

### building app

Build tools:

* [gulp](http://gulpjs.com/) ---
  here's how to [deploy to github using gulp-gh-pages](https://www.npmjs.com/package/gulp-git-pages/)
* [grunt](http://gruntjs.com/) ---
  here's how to
  [deploy to github using grunt-build-control](https://blog.5apps.com/2014/05/29/deploying-static-apps-with-grunt-build-control-on-5apps-deploy.html)
* [webpack](https://github.com/webpack/webpack) seems popular with e.g. rxvision

complete workflow tools:

* [yeoman](http://yeoman.io/) - there is, e.g. [a workflow for polymer](https://github.com/yeoman/generator-polymer)
* [lineman](http://linemanjs.com/)
* [metalsmith](http://www.metalsmith.io/)
* [roll your own with grunt](http://www.codebelt.com/javascript/single-page-javascript-application-workflow/)

Partial workflow tools:

* d3.js uses “smash.js”, a minimal JS build tool.
* [webpack](https://webpack.github.io/)
  webpack is a module bundler
  This means webpack takes modules with dependencies
  and emits static assets representing those modules.
* [browserify](http://browserify.org/) on the command line can budle up all dependencies..

### online editing code

* [runnable](http://runnable.com/U51EjgiOZqRA3HoV/basic-reveal-js-example-for-node-javascript-and-presentations) allows you to edit the whole site in situ.


###  editing documentation

* [readthedocs for github](http://docs.readthedocs.org/en/latest/webhooks.html)
* [mkdocs](http://www.mkdocs.org/)
* [macdown](http://macdown.uranusjr.com/)
* [cactus](http://cactusformac.com/docs/) for OSX seems to do a lot of what we want.
* [prose](http://prose.io)
* [gitbook](https://www.gitbook.com/) looks reasonably pretty and sells the output as a book on Amazon at the end

## Remote operation

* [tokbox](https://tokbox.com/)
* [webRTC](http://www.webrtc.org/)
* [binaryjs](https://github.com/binaryjs/binaryjs)
* [connecting spaces](http://tunnel.connectingspaces.hk) -s a Hong-Kong Zürich collaboration
* [shiftr](https://shiftr.io/)

## Video analysis

### Ideas for analyses

* Compressive-sensing-style hacks, such as sparse random projections
* image descriptors
* covariance

  * Are the covariance estimates incoherent?
    Recall the [James-Stein shrinkage problem](http://strimmerlab.org/software/corpcor/) here.

* PCA
* Haar cascade.
* random IIR filters
* cascaded IIR lowpass filters at successively lower resolution

  * You know what could lower the dimension further?
    reporting only the extremest n extrema 
    of the filtered fields, and the coordinates thereof.
  * Also arbitrary differences between layers
  * would the color coordinates interact at all?
  * could even takes squared difference features to extract localised frequency
  
* something like a convolution layer from machine vision?
* autocorrelation
* Kalman filters
* particle filters

  * with a loss fn to do with low-variance estimates of next timestep value in IJYUV space
  
* FFT features (or something else translation/phase-invariant?)
* exponentially weighted moments
* inner-product with desired eigen-features
* Features based on correlation with eigenfeatures (even fourier ones?)
* MCMC updating
* Gaussian mixture models
* other clustering, say, spectral?
* [motion detection](http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html) 
* [various sweet segmenations hacks](https://stackoverflow.com/questions/31071781/html5-canvas-image-segmentation)
* neural networks?

  * We can [train them online](https://cs.stanford.edu/people/karpathy/convnetjs/)
  * or use a high-performance pre-trained JS prediction models via [neocortex.js](https://github.com/scienceai/neocortex)?
    Note this woudl also get us features for free even if we ignore the model.
  * can we do *recursive* NN for realtime stuff this way?

### Machine vision libraries

* [tracking.js]http://trackingjs.com/) does cool stuff already
* so does [jsfeat](https://inspirit.github.io/jsfeat/) including some by EPFL and an entire linear algebra library
* [js-objectdetect](https://github.com/mtschirs/js-objectdetect/) also looks decent and fast
* [opencvjs](https://github.com/blittle/opencvjs) looks abandoned
* [blob detection](http://blog.acipo.com/blob-detection-js/)
* [segmentation engine](http://vision.akshaybhat.com/)
* [graphcut](http://www.jscuts.com/graphcuts/)

### WebGL optimisation

* notes about webgl support - e.g.
* FFT options for mobile.

  * [webgl fft paper](http://www.wuhao.co/uploads/2/6/0/1/26012804/paper_final.pdf)
  * [webgl fft demo](https://github.com/wuhao1117/WebGL-Ocean-FFT). No open-source, sadly.
  * [MDC animates textures in webgl ](https://developer.mozilla.org/en-US/docs/Web/WebGL/Animating_textures_in_WebGL)

* video+WebGL:

  * [live video in webgl](http://learningthreejs.com/blog/2012/02/07/live-video-in-webgl/)
  * [three.js and video](http://threejs.org/examples/#canvas_materials_video)
  
* [how to do WebGL-optimized image processing](http://learningwebgl.com/blog/?p=1786)
* [good plain intro](http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/)
* [webgl transforms](http://games.greggman.com/game/webgl-2d-matrices/)
  
* CSS filters to shunt to GPU? blur+invert+opacity gives us a cheap edge detection

### Colour handling

* [colorspaces](https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/)
* [colormaps](http://www.sandia.gov/~kmorel/documents/ColorMaps/ColorMapsExpanded.pdf)
* [excellent series on color](http://earthobservatory.nasa.gov/blogs/elegantfigures/2013/08/05/subtleties-of-color-part-1-of-6/)

### Sequencing

* streams

  * [highland.js](http://highlandjs.org/#)

  * [Rx.js](http://reactivex.io/) -  [here is a HOWTO guide](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
    Most important RX.js documentation links:
    * [basic howto](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
    * [Operators by Categories](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/categories.md)
    * [Creation Operators](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-static.md)
    * [Observable Methods](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md#rxobservableprototypetimestampscheduler)
    * [backpressure](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/backpressure.md)
    * [querying](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/querying.md)
  * [Both these compared](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/mapping/highland/whyrx.md) Summary: Highland.js is easier to understand, but not as well designed.
  * There are other options - kefir.js and bacon.js - but my brain is full.
<<<<<<< HEAD:docs/Notes.md
  
  
=======

>>>>>>> 8ca8d40... more accidental thoughts about potential features:website/site-static/docs/Notes.md
* stream debuggers

    * [percussion](https://github.com/grisendo/Percussion)
    * [rxvision](http://jaredforsyth.com/rxvision/) - I can't work out how this one works or how to use it, and the documentation doesn't explain basic stuff like how to install it, so I'm ignoring it for now.

* Transducers (a library of stream processors)

  * [intro](http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data) to [Transducers.js](https://github.com/cognitect-labs/transducers-js)
  
    * [extra intro](http://phuu.net/2014/08/31/csp-and-transducers.html)
    * [intro to pipelines](http://simplectic.com/blog/2014/transducers-explained-pipelines/)
    * [so much intro wow](http://simplectic.com/blog/2014/transducers-explained-1/)
  * [underarm](http://simplectic.com/projects/underarm/) provides transducers for underscore and is based upon [transduce.js](https://github.com/transduce/transduce)

* alternatively, one can use DSP as a sequencer, as with [tone.js](https://github.com/Tonejs/Tone.js)

## Audio

### Webaudio information

There are too many resources online to list. [Start here](http://notes.livingthing.org/javascript_audio.html)

We use one helper library for now, [WAAX](https://hoch.github.io/WAAX/get-started)

### Alternatives to WebAudio

* phonegap/appcelerator + libpd?
  * [phonegap-libpd](https://github.com/alesaccoia/phonegap-libpd)
  * [Create Digital Music's guide](http://createdigitalmusic.com/2012/03/how-to-make-a-music-app-for-ios-free-with-libpd-exclusive-book-excerpt/)
  * [libpd](http://libpd.cc/documentation/)
  * [libpd wiki](https://github.com/libpd/libpd/wiki)

## iOS version

http://matt.might.net/articles/how-to-native-iphone-ipad-apps-in-javascript/

## Desktop JS app options:

* [coccoonjs](https://www.ludei.com/cocoonjs/)
* [electron](http://electron.atom.io/)
* [node-webkit](http://nwjs.io/)
* [chrome app](https://developer.chrome.com/apps/about_appshttp://maps.apple.com/?q=-7.871582,110.353221&sspn=0.530353,0.771325&sll=-7.685342,110.421326)

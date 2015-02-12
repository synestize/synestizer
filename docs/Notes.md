
## TODO

The *immediate* things we need to do:

*   Meta
    
    * smoother workflow to host live on github
    * Move to modular architecture in the AMD style,
      e.g. using [require.js](http://requirejs.org/)

* Video analysis
    * normalize statistics
    * speed up clustering analysis
    * move to [requestAnimationFrame](https://docs.webplatform.org/wiki/dom/Window/requestAnimationFrame) -
      see also the
      [tutorial](http://www.html5rocks.com/en/tutorials/speed/rendering/)
    * switch to YSV for correlation structures
    * partial correlations? http://stats.stackexchange.com/a/10873
    * Are the correlation estimates incoherent?
      Recall the [James-Stein shrinkage problem](http://strimmerlab.org/software/corpcor/) here.
* speed improvements
    * web workers
        * [web worker background](http://www.html5rocks.com/en/tutorials/workers/basics/)
        * [you can pass arrays to web workers:]( http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
        * [you can pass canvas to web workers](          http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#transferCanvasProxy)

## Online publishing

* Via github
* [codepen](http://codepen.io/pen/) - has a "collaborative" pro mode, gist integration (export only)
* [jsbin](http://jsbin.com/) - 2-way gist integration, some colaboration feature, and open source
* [jsfiddle](http://jsfiddle.net/) has amazing collaboration but weak library support
* [liveweave](http://liveweave.com/) also has nice collaborative features, although less JS influence.

## javascript tips

* Jquery too big. Alternatives:

  * [Qwuery](https://github.com/ded/qwery) + [bonzo](https://github.com/ded/bonzo)
  * [zepto](http://zeptojs.com/)
  * but anyway [you might not need jquery](http://youmightnotneedjquery.com/)

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
  minimization and curve fitting" (quote
  http://apps.jcns.fz-juelich.de/doku/sc/lmfit)

  Currently only curve fitting is implemented.
  Some examples:
  http://jvail.github.io/dairy.js/,
  https://m0ose.github.io/lmfit.js/test2.html
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

### User interface improvments

* more natural frequency mapping, such as
    * [sones](http://www.icad.org/Proceedings/2006/FergusonCabrera2006.pdf)
      or exponential mapping for freq 
* More natural widget construction
* [Flux](https://facebook.github.io/flux/docs/overview.html)
* [React](https://facebook.github.io/react/docs/interactivity-and-dynamic-uis.html)
* patchcords vis [jsPlumbum](https://jsplumbtoolkit.com/demo/flowchart/dom.html)!

## Workflow options

### building app

Build tools:

* [gulp](http://gulpjs.com/) ---
  here's how to [deploy to github using gulp-gh-pages](https://www.npmjs.com/package/gulp-git-pages/)
* [grunt](http://gruntjs.com/) ---
  here's how to
  [deploy to github using grunt-build-control](https://blog.5apps.com/2014/05/29/deploying-static-apps-with-grunt-build-control-on-5apps-deploy.html)

complete workflow tools:
* [yeoman](http://yeoman.io/) - there is, e.g. [a workflow for polymer](https://github.com/yeoman/generator-polymer)
* [lineman](http://linemanjs.com/)
* [metalsmith](http://www.metalsmith.io/)
* [roll your own with grunt](http://www.codebelt.com/javascript/single-page-javascript-application-workflow/)

### Documentation

* [readthedocs for github](http://docs.readthedocs.org/en/latest/webhooks.html)
* [mkdocs](http://www.mkdocs.org/)
* [macdown](http://macdown.uranusjr.com/)

## Video analysis

### Ideas for analyses

* Compressive-sensing-style hacks?

    * sparse random projections
    * random kernels http://www.robots.ox.ac.uk/~vgg/rg/papers/randomfeatures.pdf

* feature construction
* pca
* rate of flux
* Haar cascade.
* autocorrelation
* kalman filters
* particle filters
* exponentially weighted moments

### General machine vision libraries

* https://github.com/blittle/opencvjs
* http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside

### WebGL optimisation

* notes about webgl support - e.g.
* FFT options for mobile. Webgl?

  * http://www.wuhao.co/uploads/2/6/0/1/26012804/paper_final.pdf
  * https://github.com/wuhao1117/WebGL-Ocean-FFT

* http://learningthreejs.com/blog/2012/02/07/live-video-in-webgl/
* how to do WebGL-optimized image processssng http://learningwebgl.com/blog/?p=1786
* very good plain intro http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
* transform explanation http://games.greggman.com/game/webgl-2d-matrices/
* high-perf matrix op http://glmatrix.net/
* combining with video

  * http://threejs.org/examples/#canvas_materials_video
  * http://learningthreejs.com/blog/2012/02/07/live-video-in-webgl/
  * https://developer.mozilla.org/en-US/docs/Web/WebGL/Animating_textures_in_WebGL
  * https://stackoverflow.com/questions/18383470/using-video-as-texture-with-three-js
  * https://escobar5.github.io/asciicam/
  * motion detection http://www.adobe.com/devnet/html5/articles/javascript-motion-detection.html
  
* css filters to shunt to GPU?

  * http://www.html5rocks.com/en/tutorials/speed/html5/
  * http://docs.webplatform.org/wiki/tutorials/css_filters
  * http://caniuse.com/#feat=css-filters
  * http://jsfiddle.net/SvH6w/6/

### Colour handling

* https://github.com/ahacking/chromatist
* https://github.com/gka/chroma.js
* colorspaces: https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/
* https://en.wikipedia.org/wiki/Color_difference
* http://color.psych.upenn.edu/brainard/papers/specification.pdf
* foveation
* JND

### Sequencing

* Transducers?

  * http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data
  * https://github.com/cognitect-labs/transducers-js
  * http://phuu.net/2014/08/31/csp-and-transducers.html
  * http://simplectic.com/projects/underarm/
  * http://simplectic.com/projects/underscore-transducer/
  * http://simplectic.com/blog/2014/transducers-explained-pipelines/
  * http://simplectic.com/blog/2014/transducers-explained-1/

## Audio

### Webaudio information

* [MDN guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
* [W3C specification](https://webaudio.github.io/web-audio-api/)
* the [tuna library](https://github.com/Dinahmoe/tuna) has DSP examples
* [Dubstep](http://www.mazbox.com/synths/dubstep/)
* [webaudioapi.com](http://webaudioapi.com/samples/)
* [Boris Smus's tutorial](http://www.html5rocks.com/en/tutorials/webaudio/intro/) is top-notch.
* [scheduling is fiddly](http://www.html5rocks.com/en/tutorials/audio/scheduling/)
* [tips for mobile audio](http://pupunzi.open-lab.com/2013/03/13/making-html5-audio-actually-work-on-mobile/)
* [JSAudio nodes](http://noisehack.com/custom-audio-effects-javascript-web-audio-api/)

### Alternative Audio options

* phonegap/appcelerator + libpd?
  * [phonegap-libpd](https://github.com/alesaccoia/phonegap-libpd)
  * [Create Digital Music's guide](http://createdigitalmusic.com/2012/03/how-to-make-a-music-app-for-ios-free-with-libpd-exclusive-book-excerpt/)
  * [libpd](http://libpd.cc/documentation/)
  * [libpd wiki](https://github.com/libpd/libpd/wiki)

## Meta

* [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)
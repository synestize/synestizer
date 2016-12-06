# Javascript video analysis

## Mathematics

Ranked in descending order of viability:

* [linear-algebra](https://github.com/hiddentao/linear-algebra) ([blog post](http://www.hiddentao.com/archives/2014/07/23/linear-algebra-in-javascript/))

    > Efficient, high-performance linear algebra library for node.js and browsers.

    > This is a low-level algebra library which supports basic vector and matrix
  operations, and has been designed with machine learning algorithms in mind.

    > Features:

    > Simple, expressive, chainable API.
    > Array implementation with performance optimizations.
    > Enhanced floating point precision if needed.
    > Comprehensive unit tests.
    > Works in node.js and browsers.
    > Small: ~1 KB minified and gzipped.    

* [sylvester](http://sylvester.jcoglan.com/) the original, but predates much modern optimisation such as native arrays and asm.js
* [jStat](https://github.com/jstat/jstat) is a statistical library written in JavaScript that allows you to perform advanced statistical operations without the need of a dedicated statistical language (e.g. MATLAB or R).
  Includes a tidy linear algebra library, but could be better optimized.
* [lmfit](https://github.com/jvail/lmfit.js)

    JavaScript (emscripten) port of lmfit library:

    "a self-contained C library for Levenberg-Marquardt least-squares
    minimization and curve fitting"

    Currently only linear curve fitting is implemented.
* [linalg](https://github.com/ben-ng/linalg) uses native arrays because of their speed.

    > I needed a performance focused linear algebra module for visualizing data
    > in 10+ dimensions, and implementing machine learning algorithms. I quickly
    > learned that naive solutions to linear algebra operations can produce
    > numerical errors so significant they are utterly useless for anything other
    > than casual playtime. After that, I prioritized correctness over
    > performance.”

    Untouched since released and small community, which is sad
  because the code looks solid.

* [glmatrix](http://glmatrix.net/) is WebGL (therefore VERY fast),
  but 4-vector oriented, which is too small for us
* [numeric](http://numericjs.com/wordpress/) looks polished
  but has been untouched for 2 years
* [jmat](https://github.com/lvandeve/jmat) is an actively developed complex matrix library, but we would probably prefer speed to complex number support.
* random variables can be simulated very easily using the [probability distributions library](https://github.com/Mattasher/probability-distributions)

## Machine vision libraries
Top pics, maybe useful

* [tracking.js](http://trackingjs.com/) does cool stuff already
* so does [jsfeat](https://inspirit.github.io/jsfeat/) including some by EPFL and an entire linear algebra library

Suspected non-useful or abandoned

* [js-objectdetect](https://github.com/mtschirs/js-objectdetect/) also looks decent and fast
* [opencvjs](https://github.com/blittle/opencvjs) partial transcompile/port of OpenCV
* [blob detection](http://blog.acipo.com/blob-detection-js/)
* [segmentation engine](http://vision.akshaybhat.com/)
* [graphcut](http://www.jscuts.com/graphcuts/)

## WebGL optimisation

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

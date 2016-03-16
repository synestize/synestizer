---
title: Notes
---

# Notes

Notes auditioning for a place in the documentation


## linear algebra options

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
  Includes a tidy linear algebra library, but could be better optimised.
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

Partial workflow tools:

* d3.js uses “smash.js”, a minimal JS build tool.
* [webpack](https://webpack.github.io/)
  webpack is a module bundler
  This means webpack takes modules with dependencies
  and emits static assets representing those modules.
  Popular with, e.g. rxvision.
* [browserify](http://browserify.org/) browser-side require() the node.js way

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
* [connecting spaces](http://tunnel.connectingspaces.hk)
* [shiftr](https://shiftr.io/)

## Streams

* libraries

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


* stream debuggers

    * [percussion](https://github.com/grisendo/Percussion)
    * [rxvision](http://jaredforsyth.com/rxvision/) - I can't work out how this one works or how to use it, and the documentation doesn't explain basic stuff like how to install it, so I'm ignoring it for now.

* Transducers (a library of stream processors)

    * [intro](http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data) to [Transducers.js](https://github.com/cognitect-labs/transducers-js)
  
    * [extra intro](http://phuu.net/2014/08/31/csp-and-transducers.html)
    * [intro to pipelines](http://simplectic.com/blog/2014/transducers-explained-pipelines/)
    * [so much intro wow](http://simplectic.com/blog/2014/transducers-explained-1/)
    * [underarm](http://simplectic.com/projects/underarm/) provides transducers for underscore and is based upon [transduce.js](https://github.com/transduce/transduce)


## iOS version

... (is viable)[http://matt.might.net/articles/how-to-native-iphone-ipad-apps-in-javascript/] but we won't start just yet.

## Desktop JS app options:

* [coccoonjs](https://www.ludei.com/cocoonjs/)
* [electron](http://electron.atom.io/)
* [node-webkit](http://nwjs.io/)
* [chrome app](https://developer.chrome.com/apps/about_apps)

## Android tablet version

Cheapest is amazon kindle, which supports
[native html5 web apps](https://developer.amazon.com/public/solutions/platforms/webapps),
[decent hardware](https://developer.amazon.com/public/solutions/devices/fire-tablets/specifications/01-device-and-feature-specifications), but uses a
[special app store](https://developer.amazon.com/public/solutions/devices/fire-tablets).
Could we possibly get our app on that?
Would the browser APIs be modern enough?

## Multitouch

[workaround for multitouch from desktop](http://smus.com/multi-touch-browser-patch/)

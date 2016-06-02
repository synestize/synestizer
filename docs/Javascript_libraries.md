---
title: Javascript libraries
---

# JS libraries

This app is set up as a classic React application.

Javascript is in Ecmascript 2015, a.k.a. ES6, the latest version of Javascript.

## React

## Redux

http://redux.js.org/docs/advanced/AsyncActions.html

## Webpack

[webpack](https://webpack.github.io/)
webpack is a module bundler
This means webpack takes modules with dependencies
and emits static assets representing those modules.
Popular with, e.g. rxvision.

## Rx.js

* [Rx.js](http://reactivex.io/) -  [here is a HOWTO guide](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)

* stream debuggers

    * [percussion](https://github.com/grisendo/Percussion)
    * [rxvision](http://jaredforsyth.com/rxvision/) - I can't work out how this one works or how to use it, and the documentation doesn't explain basic stuff like how to install it, so I'm ignoring it for now.

* Transducers (a library of stream processors)

    * [intro](http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data) to [Transducers.js](https://github.com/cognitect-labs/transducers-js)

    * [extra intro](http://phuu.net/2014/08/31/csp-and-transducers.html)
    * [intro to pipelines](http://simplectic.com/blog/2014/transducers-explained-pipelines/)
    * [so much intro wow](http://simplectic.com/blog/2014/transducers-explained-1/)
    * [underarm](http://simplectic.com/projects/underarm/) provides transducers for underscore and is based upon [transduce.js](https://github.com/transduce/transduce)

## Mathematics

## javascript mathematics

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
* random variables can be simulated very easily using the [probability distributions library](https://github.com/Mattasher/probability-distributions)


## Alternative build tools

### building app

Is webpack alone enough?
We might want to use a more complete one later, if necessary.

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

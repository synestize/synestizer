---
title: Javascript libraries
---

# JS libraries

This app is set up as a classic React application.

Javascript is in Ecmascript 2015, a.k.a. ES6, the latest version of Javascript.

## React

How do I persist DOM nodes? Perhaps [using key](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children) and then [relying on a ref](https://facebook.github.io/react/docs/more-about-refs.html)

How do i communicate across branches of Componenets?
[Methods?](https://facebook.github.io/react/tips/expose-component-functions.html)

## Redux

* [Components and Super-Components](https://medium.com/@rajaraodv/the-anatomy-of-a-react-redux-app-759282368c5a#.ozt83zza6)
* [what in blazes are all these "components"?](http://redux.js.org/docs/basics/UsageWithReact.html)
* [asynchronicity](http://redux.js.org/docs/advanced/AsyncActions.html)
* [memoization/caching](http://redux.js.org/docs/recipes/ComputingDerivedData.html)
* How can we batch updates? [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) or [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) are recommended in the redux docs

## Webpack

[webpack](https://webpack.github.io/)
webpack is a module bundler
This means webpack takes modules with dependencies
and emits static assets representing those modules.
Popular with, e.g. rxvision.

## Rx.js

* [Rx.js](http://reactivex.io/)
  * [here is a HOWTO guide](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
  * [Rx marbles](http://rxmarbles.com/) visualises Rx streams
  * [xgrommx's Rx book](https://xgrommx.github.io/rx-book/) is the messy but readable reference
  * [Rx.js official documenation](https://github.com/Reactive-Extensions/RxJS/tree/master/doc) is not always the bst for explaining their verbose and yet uninformative names, but it does have some useful pages, especially
    * [Which operator use: creation operators](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-static.md) is the guide to constructors
    * [Which operator use: instance operators](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/gettingstarted/which-instance.md) is the guide to instance methods

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

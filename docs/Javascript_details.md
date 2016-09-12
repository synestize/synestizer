# JS /HTML5 Style and libraries

This app is set up as a React/Redux/Rx application.
That's 3 different libraries with coincidentally similar names. Sorry.

Javascript is in Ecmascript 2015 application, a.k.a. ES6, the latest version of Javascript.

## ES6

Module support in ES6 looks different than the older standards.

* [ES6 module syntax](http://www.2ality.com/2014/09/es6-modules-final.html)
* [Axel Rauschmayer explains](http://exploringjs.com/es6/ch_modules.html)
* [Jason Orendorff explains](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/)
* [module importing can be a complicated standards battle](http://www.jbrantly.com/es6-modules-with-typescript-and-webpack/)

### Tips

If we want to use Object, remember, ``Object.keys(thing).length`` will get the size of ``thing``.

## HTML5 Multimedia

not technically a "library", but a "set of things to know"

* To have a stable API to access audio and video we use webrtc-adapter.
* [HackTimer](https://github.com/turuslan/HackTimer) stops the browser timing from getting throttled when the tab is in the background
* [Audio synthesis](Audio_synthesis.md)
* [SVG](https://biesnecker.com/2014/10/22/using-reactjs-to-draw-dynamic-svgs/)

  * [practical example 1](https://github.com/getguesstimate/guesstimate-app/blob/master/src/components/lib/FlowGrid/edges.js)
  * [practical example 2](https://github.com/getguesstimate/guesstimate-app/blob/master/src/components/lib/FlowGrid/edge.js)
  * [paths explained](https://github.com/jxnblk/paths) [2](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)

Icons are provided through [fontawesome](http://fontawesome.io/icons/)


See Also

[stying sliders](http://www.quirksmode.org/blog/archives/2015/11/styling_and_scr.html)

[more styling sliders](https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/)


## React

The rendering system for all UI components is React.

* For debugging the user interface, we recommend [React developer tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

### If I need to get to DOM nodes...

e.g. for accessing video.
How do I persist DOM nodes? Perhaps [using keys](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children) and then [relying on a ref](https://facebook.github.io/react/docs/more-about-refs.html)
How do i communicate across branches of Components?
[Methods?](https://facebook.github.io/react/tips/expose-component-functions.html)

But I think  I can avoid this by separating DOM streams and React components as two separates types of App both of which talk to the Redux store.

### If I need to dynamically not render half the app

[9 things every React.js beginner should know](https://camjackson.net/post/9-things-every-reactjs-beginner-should-know)

### If i want easy graphing
* for people using react.js, [Victory](https://formidable.com/open-source/victory/)

## Redux

We use Redux to organise the app state.

Could also use Rx with a redux pattern [A](https://github.com/jas-chen/rx-redux), [B](https://github.com/jas-chen/redux-core), or [C](https://github.com/acdlite/redux-rx).
It's recommended to [not even bother with redux in that case](http://redux.js.org/docs/introduction/PriorArt.html#rx).
However I will start that way because otherwise it's too complicated

### Introductions to Redux

* [Components and Super-Components](https://medium.com/@rajaraodv/the-anatomy-of-a-react-redux-app-759282368c5a#.ozt83zza6)
* [what in blazes are all these "components"?](http://redux.js.org/docs/basics/UsageWithReact.html)
* [asynchronicity](http://redux.js.org/docs/advanced/AsyncActions.html)
* [memoization/ caching](http://redux.js.org/docs/recipes/ComputingDerivedData.html)
* How can we batch updates? [redux-batched-subscribe](https://github.com/tappleby/redux-batched-subscribe) or [redux-batched-actions](https://github.com/tshelburne/redux-batched-actions) are recommended in the redux docs.
* [smart and dumb](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.1ib9ws3ub)
* [react+redux](http://redux.js.org/docs/basics/UsageWithReact.html)
* [thinking in react](https://facebook.github.io/react/docs/thinking-in-react.html)

### Persistence

We are currently using [redux-persist](https://www.npmjs.com/package/redux-persist).
It imports a LOT of code in dependencies though...
We could instead use [redux-storage](https://www.npmjs.com/package/redux-storage)

The storage engine is [localForage](https://github.com/mozilla/localForage) but we could use cookies or localStorage.
redux-storage supports [many backends](https://www.npmjs.com/browse/keyword/redux-storage-engine).

## Building

We mostly use [webpack](https://webpack.github.io/), which is built on [npm](https://npmjs.org/).
webpack is a module bundler.
This means webpack takes modules spread across multiple files with dependencies
and a smaller number of files which include the functionality..
It's the dominant build system right now for web apps, at least for community-supported react-based ones.

Webpack works by magic, as far as I can tell, and it has
fearsomely complicated and poorly explained configuration.
Nonetheless, everyone uses it and so we ignore it and just GO here.

`webpack.config.js` has the actual configuration, which does various things.
`package.json` lists the various libraries ("dependencies") that are assembled together by webpack.

* Compiles JSX to JS, to support React
* compresses the javascript in development mode
  * there is an alternative competitor [escompress](https://github.com/escompress/escompress), which [integrates to Babel es6](https://github.com/escompress/babel-preset-escompress).
  * I recommend using just one plugin, [https://www.npmjs.com/package/babel-plugin-transform-dead-code-elimination], which somewhat reduced the JS size (but not as well as uglifyjs!)
  *  NB: Usually you see this with UglifyJS2, but it [doesn't support ES6](https://github.com/mishoo/UglifyJS2/issues/448) booooring
  * However if we really wanted to use that, there is [babel-plugin-uglify](https://www.npmjs.com/package/babel-plugin-uglify) which does it at the babel layer, so we could compile to ES5 and uglify?
* If you want to update dependencies, the command looks omsething like this:

```
npm install --save-dev --upgrade \
  babel-cli \
  babel-core \
  babel-loader \
  babel-plugin-system-import-transformer \
  babel-plugin-transform-dead-code-elimination\
  babel-plugin-transform-function-bind \
  babel-plugin-transform-object-rest-spread \
  babel-preset-es2015 \
  babel-preset-react \
  localforage \
  react \
  react-dom \
  react-redux \
  redux \
  redux-logger \
  redux-persist \
  redux-thunk \
  rxjs \
  source-map-loader \
  tone \
  webpack \
  webrtc-adapter \
  worker-loader \
```

## Rx.js

We use Rx.js version 5.0, because even though it is less common that Rx.js 4.0, the documentation is less autistic.

* [Rx.js](http://reactivex.io/rxjs/)
  * [Rx.js 4.0 vs 5.0](https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md)
  * [we use the CJS installation](http://reactivex.io/rxjs/manual/installation.html#commonjs-via-npm) although
    * [we could do ES6 native but its fiddly and there are bugs](https://github.com/ReactiveX/rxjs/issues/1575)
  * [here is a HOWTO guide](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
  * [Rx marbles](http://rxmarbles.com/) visualises Rx streams
  * [Rx.js official documenation](http://reactivex.io/rxjs/manual/overview.html)

* Interoperation
  * we could, but not not yet use [redux-rx](https://github.com/acdlite/redux-rx)

* stream debuggers

    * [percussion](https://github.com/grisendo/Percussion)
    * [rxvision](http://jaredforsyth.com/rxvision/) - I can't work out how this one works or how to use it, and the documentation doesn't explain basic stuff like how to install it, so I'm ignoring it for now.

* Transducers (a library of stream processors)

    * [intro](http://jlongster.com/Transducers.js--A-JavaScript-Library-for-Transformation-of-Data) to [Transducers.js](https://github.com/cognitect-labs/transducers-js)

    * [extra intro](http://phuu.net/2014/08/31/csp-and-transducers.html)
    * [intro to pipelines](http://simplectic.com/blog/2014/transducers-explained-pipelines/)
    * [so much intro wow](http://simplectic.com/blog/2014/transducers-explained-1/)

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

Let's avoid it for now.

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

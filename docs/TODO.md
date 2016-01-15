---
title: TODO
---

# TODO

* Revised simpler UI

    * MIDI mapping GUI rather than hardcoded controllers

* Purge jquery.
* Purge foundation
* Purge WAAX
* Revised patching system

    * accept synth parameters in URL fragments (esp to set master output volume!)
    * update URL fragments with synth parameters
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
    * Copula-function-based covariance

* Meta

    * smoother workflow to host live on github
    * Move to modular architecture in the AMD style,
    e.g. using [require.js](http://requirejs.org/)
    using [some kind of template](https://github.com/volojs/create-template)
    * better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

* Better documentation workflow 

    * [build docs site automatically?](http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/)

* prettier docs website
* speed improvements
    * web workers
        * [web worker background](http://www.html5rocks.com/en/tutorials/workers/basics/)
        * [you can pass arrays to web workers]( http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
        * [you can pass canvas to web workers](          http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#transferCanvasProxy)
    * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

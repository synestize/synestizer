---
title: TODO
---

# TODO

* Revised simpler UI

    * MIDI mapping GUI rather than hardcoded controllers

* Purge jquery
* Purge foundation
* Purge WAAX

    * accept synth parameters in URL fragments (esp to set master output volume)
    * update URL fragments with synth parameters

* A *patch* should map between

    * input params
    
        * Video analysis  
        * MIDI CC in
        * GUI widgets
        * device sensors
    
    * output params
    
      * audio ensemble parameters
      * MIDI CC out
      
    * Patches could have a separate mapping GUI for constructing the mapping
    * Copula-function-based covariance
      
      * tanh and erf copulae

* Meta

    * smoother workflow to host live on github
    * Move to modular architecture in the AMD style,
    e.g. using [require.js](http://requirejs.org/)
    using [some kind of template](https://github.com/volojs/create-template)
    * better [git workflows](http://www.toptal.com/git/git-workflows-for-pros-a-good-git-guide)

* Better documentation workflow 

    * [build docs site automatically?](http://blog.mwaysolutions.com/2014/04/10/static-website-generator-with-grunt-js/)
    * faq.html should be merged into docs directory as a markdown file then included in the built site

* prettier docs website
* speed improvements
    * web workers
        * [web worker background](http://www.html5rocks.com/en/tutorials/workers/basics/)
        * [you can pass arrays to web workers]( http://updates.html5rocks.com/2011/12/Transferable-Objects-Lightning-Fast)
        * [you can pass canvas to web workers](          http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#transferCanvasProxy)
    * [asm.js](http://www.slideshare.net/fitc_slideshare/leveraging-asmjsclientside)

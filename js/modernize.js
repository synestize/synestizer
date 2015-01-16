(function( global ) {
    'use strict';
    
    // shim the requestAnimationFrame API, with a setTimeout fallback
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    // shim getUserMedia ;
    //making it a local method doesn't work without tedious "this" wrangling.
    global.navigator.getUserMedia = (global.navigator.getUserMedia ||
        global.navigator.webkitGetUserMedia ||
        global.navigator.mozGetUserMedia ||
        global.navigator.msGetUserMedia);
    
    // Make webkit browsers use the prefix-free version of AudioContext.
    global.AudioContext = global.AudioContext || global.webkitAudioContext;

})( this, window );

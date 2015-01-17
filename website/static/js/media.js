(function( global ) {
    'use strict';
    var getStream;
    global.media = {
        stream: undefined,
    };
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
    if (!navigator.cancelAnimationFrame)
        navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;

    // shim getUserMedia ;
    //making it a local method doesn't work without tedious "this" wrangling.
    global.navigator.getUserMedia = (global.navigator.getUserMedia ||
        global.navigator.webkitGetUserMedia ||
        global.navigator.mozGetUserMedia ||
        global.navigator.msGetUserMedia);

    // Make webkit browsers use the prefix-free version of AudioContext.
    global.AudioContext = global.AudioContext || global.webkitAudioContext;

    getStream = function(success) {
        //we have already called this!
        if (typeof global.media.stream !== 'undefined') {
            success(global.media.stream);
        };
        //otherwise, call it now.
        global.navigator.getUserMedia(
            {
                "video": true,
                "audio": true,
            }, function(stream) {
                global.media.stream = stream;
                success(stream);
            }, function(e) {
                alert('Error getting audio or video');
                console.log(e);
            }
        );
    };
    global.media.getStream = getStream;
})( this );

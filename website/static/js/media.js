(function( global ) {
    'use strict';
    var getStream;
    //namespace:
    var media = {
        stream: undefined,
    };
    //attach namespace to global object
    global.media = media;
    
    // shim the requestAnimationFrame API, with a setTimeout fallback
    global.requestAnimFrame = (function(){
        return global.requestAnimationFrame ||
        global.webkitRequestAnimationFrame ||
        global.mozRequestAnimationFrame ||
        global.oRequestAnimationFrame ||
        global.msRequestAnimationFrame ||
        function( callback ){
            global.setTimeout(callback, 1000 / 60);
        };
    })();
    if (!global.cancelAnimationFrame)
        global.cancelAnimationFrame = global.webkitCancelAnimationFrame || global.mozCancelAnimationFrame;

    // shim getUserMedia ;
    //making it a local method doesn't work without tedious "this" wrangling.
    global.navigator.getUserMedia = (global.navigator.getUserMedia ||
        global.navigator.webkitGetUserMedia ||
        global.navigator.mozGetUserMedia ||
        global.navigator.msGetUserMedia);

    // Make webkit browsers use the prefix-free version of AudioContext.
    global.AudioContext = global.AudioContext || global.webkitAudioContext;

    //Utility function to return the media stream ONLY ONCE
    getStream = function(success) {
        //we have already called this!
        if (typeof media.stream !== 'undefined') {
            success(media.stream);
        };
        //otherwise, call it now.
        global.navigator.getUserMedia(
            {
                "video": true,
                "audio": true,
            }, function(stream) {
                media.stream = stream;
                success(stream);
            }, function(e) {
                alert('Error getting audio or video');
                console.log(e);
            }
        );
    };
    media.getStream = getStream;
})( this );

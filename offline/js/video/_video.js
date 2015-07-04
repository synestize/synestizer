// Video Analyzer
// pumps pixels in to statistics functions, pumps them out later
(function( global, _, Rx ) {
    'use strict';
    var video; 
    window.video = video = window.video || {};

    function StatsStreamer(pixelStreamer, stats){
        // should probably make this stats array be serializable if I want to 
        // do it in another thread.
        var lastTime, thisTime;
        var statsStream;
        var statsWorkers;
        statsStream = new Rx.BehaviorSubject(1);
        
        var self = {
            statsStream: statsStream
        };
        lastTime = Date.now();
        thisTime = Date.now();

        return self;
    };

    // expose our module to the global object
    global.video.StatsStreamer = StatsStreamer;
})( this, _, Rx );
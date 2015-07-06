// Video Analyzer
// pumps pixels in to statistics functions, pumps them out later
//TODO: reinstate delta stats
(function( global, _, Rx ) {
    'use strict';
    var videoanalysis; 
    window.videoanalysis = videoanalysis = window.videoanalysis || {};

    function StatsStreamer(pixelPump, stats){
        // should probably make this stats array be serializable if I want to 
        // do it in a webworker.
        var lastTime, thisTime;
        var outboxStream;//outgoing analyses
        var statsWorkers;
        var statsState = {};
        console.debug("ss", pixelPump, stats);

        //this bit should be in a WebWorker:
        outboxStream = pixelPump.pixelStream.map(function (pixels) {
            var rez = _.mapObject(
                stats,
                function(stat, statName){return stat(pixels)}
            );
            console.debug("statres", pixels, rez);
            return rez;
        });
        //update state dict with stats for debugging
        outboxStream.subscribe(function(x){
            _.mapObject(
                x,
                function(statval, statName){statsState[statval]=statName}
            );
        });
        var self = {
            statsStream: outboxStream,
            statsState: statsState
        };
        lastTime = Date.now();
        thisTime = Date.now();
        return self;
    };

    // expose our module to the global object
    global.videoanalysis.StatsStreamer = StatsStreamer;
})( this, _, Rx );
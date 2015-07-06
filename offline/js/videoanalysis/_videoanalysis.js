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
        var inboxStream; //incoming pixels
        var outboxStream;//outgoing analyses
        var statsWorkers;
        var statsState = {};
        console.debug("ss", pixelPump, stats);
        inboxStream = new Rx.Subject();
        //this bit should be in a WebWorker:
        outboxStream = inboxStream.map(function (pixels) {
            var rez = _.mapObject(
                stats,
                function(stat, statName){return stat(pixels)}
            );
            console.debug("statres", pixels, rez);
            return rez;
        });
        outboxStream.debounce(25).subscribe(function(stats) {
            console.debug("pumping req", stats);
            pixelPump.pump(function(pixels){
                console.debug("pumping", pixels);
                inboxStream.onNext(pixels);
            });
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
        //prime pixel pump
        pixelPump.pump(function(pixels){inboxStream.onNext(pixels)});
        return self;
    };

    // expose our module to the global object
    global.videoanalysis.StatsStreamer = StatsStreamer;
})( this, _, Rx );
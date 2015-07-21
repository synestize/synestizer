// Video Analyzer
// pumps pixels in to statistics functions, pumps them out later
//TODO: reinstate delta stats
(function( global, _, Rx ) {
    'use strict';
    var videoanalysis; 
    global.videoanalysis = videoanalysis = global.videoanalysis || {};

    function StatsStreamer(pixelPump, stats){
        // should probably make this stats array be serializable if I want to 
        // do it in a webworker.
        var lastTime, thisTime;
        var outboxStream;//outgoing analyses
        var inboxStream;//incoming pixels
        var statsWorkers;
        var statsState = {};
        outboxStream = new Rx.Subject();
        

        //Things get crazy here because we don't know how long statistics take
        //So we roll our own backpressure using a tail call
        //TODO: there is a recursive scheduler built in to the system already.
        // Rx.Scheduler.immediate.scheduleRecursiveWithState
        function calcStats(pixels){
            var rez;
            //this bit should be in a WebWorker
            rez = _.mapObject(
                stats,
                function(stat, statName){return stat(pixels)}
            );
            return rez;
        };
        //This tail call should recalculate each new batch of statistics
        //25ms after the last one finished
        function statsAndMoreStats(pixels){
            outboxStream.onNext(calcStats(pixels));
            global.setTimeout(function(){
                pixelPump.pixelStream.take(1).subscribe(statsAndMoreStats)
            }, 25);
        };
        //start the tail call
        pixelPump.pixelStream.take(1).subscribe(
            statsAndMoreStats);
        
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
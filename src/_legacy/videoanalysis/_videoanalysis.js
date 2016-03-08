// Video Analyzer
// pumps pixels in to statistics functions, pumps them out later
//TODO: reinstate delta stats
(function( global, _, Rx ) {
    'use strict';
    var videoanalysis; 
    global.videoanalysis = videoanalysis = global.videoanalysis || {};

    function StatsStreamer(pixelPump, stats){
        var outboxStream;//outgoing analyses
        var inboxStream;//incoming pixels
        var statState = {};
        outboxStream = new Rx.Subject();
        
        var worker = new Worker('./js/videoanalysis/statworker.js');
        console.debug("worker", typeof worker, worker);

        // Create observer to handle sending messages
        var observer = Rx.Observer.create(
            function (data) {
                console.debug("statsparent obs got", data);
                worker.postMessage(data);
            });

        // Create observable to handle the messages
        var observable = Rx.Observable.create(function (obs) {
            worker.onmessage = function (data) {
                obs.onNext(data);
            };

            worker.onerror = function (err) {
                obs.onError(err);
            };

            return function () {
                console.debug("disposing of stats worker")
                if (typeof worker === "object"){
                    worker.close()
                } else {
                    console.debug("tried to kill worker but it is missing", typeof worker, worker)
                }
            };
        });

        var statWorkerSubject = Rx.Subject.create(observer, observable);

        var subscription = statWorkerSubject.subscribe(
            function (x) {
                console.log('Statsparent Next:', x);
            },
            function (err) {
                console.log('Statsparent Error:',  err);
            },
            function () {
                console.log('Completed');
            });

        statWorkerSubject.onNext(525);
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
                function(statval, statName){statState[statval]=statName}
            );
        });
        var self = {
            statsStream: outboxStream,
            statState: statState,
            worker: worker,
        };
        return self;
    };

    // expose our module to the global object
    global.videoanalysis.StatsStreamer = StatsStreamer;
})( this, _, Rx );
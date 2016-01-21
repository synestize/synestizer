/*
// This Worker provides a clock thread.
// Although, since the audio stuff is still run in the main thread
// it is not clear what the benefit of this is.
// You might want to experiment with the BeatSequencer object in clock.js.

var timerID=null;
var interval=100;

self.onmessage=function(e){
    if (e.data=="start") {
        console.log("starting");
        timerID=setInterval(function(){postMessage("tick");},interval)
    }
    else if (e.data.interval) {
        console.log("setting interval");
        interval=e.data.interval;
        console.log("interval="+interval);
        if (timerID) {
            clearInterval(timerID);
            timerID=setInterval(function(){postMessage("tick");},interval)
        }
    }
    else if (e.data=="stop") {
        console.log("stopping");
        clearInterval(timerID);
        timerID=null;
    }
};

postMessage('sequencer worker');
*/
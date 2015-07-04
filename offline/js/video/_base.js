//Video Analyzer
// pumps pixels in to statistics functions, pumps them out later
(function( global, _, Rx) ) {
    'use strict';

    function StreamStats(pixelStream, stats){
        var lastTime, thisTime;
        var self = {
            
        };
        
        self.vidElem = params.vidElem;
        self.canvElem = params.canvElem;
        self.stream = params.stream;
        self.statistics = typeof params.statistics !== 'undefined' ? params.statistics : [];
        self.success = typeof params.success !== 'undefined' ? params.success : function(){};
        self.lastAnalysisTime = Date.now();
        self.thisFrameTime = Date.now();
        self.meanAnalysisDur = 33; //initial time is a guess
        self.meanFrameDur = 33;
        self.lastFrameDur = 33;
        self.ctx = self.canvElem.getContext('2d');
        self.cw = self.canvElem.width;
        self.ch = self.canvElem.height;
        self.pixelCount = self.cw * self.ch;
        self.timerID = null;
        self.pixels = [];

        for (var i = 0; i < self.statistics.length; i++) {
            self.statistics[i].attach(self);
        }
        self.vidElem.src = url ? url.createObjectURL(self.stream) : params.stream;
        self.vidElem.play();

        self.startAnalysis = function() {
            if (self.timerID!==null){
                global.cancelAnimationFrame(self.timerID);
            };
            self.timerID = global.requestAnimationFrame(self.analyzeFrame);
        };
        self.stopAnalysis = function() {
            if (self.timerID!==null){
                global.cancelAnimationFrame(self.timerID);
            }
        };
        //do and reschedule video analysis
        self.analyzeFrame = function () {
            var endTime, startTime = Date.now();
            //we need to know how often we are being called:
            self.lastFrameDur = startTime - self.lastFrameTime;
            //just for seeing how expensive this is:
            self.calcTime = endTime - startTime;
            
            var pixels="dummy";
            var cw=self.cw, ch=self.ch;
            //Only run one timer per instance:
            global.cancelAnimationFrame(self.timerID);
            // evaluate statistics
            // The first few frames get lost in Firefox, raising exceptions
            // We make sure this does not break the whole loop by
            // using a try..catch
            try {
                self.ctx.drawImage(self.vidElem, 0, 0, cw, ch);
                pixels = self.ctx.getImageData(0, 0, cw, ch).data;
                //Also make available to the outside world:
                self.pixels = pixels;
            } catch (e) {
                console.log("error getting video frame");
                console.debug(e);
            }
            if (pixels.length>0) {
                //Yay! it worked
                for (var i = 0; i < self.statistics.length; i++) {
                    self.statistics[i].analyzeFrame(pixels);
                };
            };
            endTime = Date.now();
            self.lastFrameTime = startTime;
            
            self.thisFrameTime = Date.now();
            self.meanFrameDur = 0.9 * self.meanFrameDur + 0.1 * (
                self.lastFrameDur);
            self.meanAnalysisDur = 0.9 * self.meanAnalysisDur + 0.1 * (
                Date.now() - self.thisFrameTime);
            // reschedule video analysis
            // after 50ms to always get delta
            // you probably still want to smooth it
            self.timerID = global.requestAnimationFrame(self.analyzeFrame);
        }
        self.startAnalysis();
        self.success();
        return self
    };

    // expose our module to the global object
    global.videoanalyzers = {
        VideoAnalyzer: VideoAnalyzer,
    };
})( this, _, Rx );
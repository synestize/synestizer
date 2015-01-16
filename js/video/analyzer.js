//Video Analyzers
(function( global ) {
    'use strict';

    //sneakily monkey patch the getUserMedia thing;
    //making it a local method doesn't work without tedious "this" wrangling.
    global.navigator.getUserMedia = (global.navigator.getUserMedia ||
        global.navigator.webkitGetUserMedia ||
        global.navigator.mozGetUserMedia ||
        global.navigator.msGetUserMedia);

    var VideoAnalyzer = function (params){
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        self.vidElem = params.vidElem;
        self.canvElem = params.canvElem;
        self.pubsub = params.pubsub;
        self.timeStep = typeof params.timeStep !== 'undefined' ? params.timeStep : 50;
        self.statistics = typeof params.statistics !== 'undefined' ? params.statistics : [];
        self.prefix = typeof params.prefix !== 'undefined' ? params.prefix : '/videoanalyzer';

        self.lastFrameTime = Date.now();
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
        self.stream = null;

        for (var i = 0; i < self.statistics.length; i++) {
            self.statistics[i].attach(self);
        }

        if (global.navigator.getUserMedia) {
            global.navigator.getUserMedia(
                {video:true, audio:false},
                function(stream) {
                    var url = global.window.URL || global.window.webkitURL;
                    self.stream = stream;
                    self.vidElem.src = url ? url.createObjectURL(stream) : stream;
                    self.vidElem.play();
                    self.startAnalysis();

                    // hide info layer
                    // TODO move it somewhere else
                    $("#info").removeClass("show").addClass("hide");
                    $("#controls").removeClass("hide").addClass("show");

                },
                function(error) {
                    alert(
                        'Something went wrong. (error code ' +
                        error.code +
                        ')');
                    return;
                }
            );
        }
        else {
            alert('Sorry, I cannot access your camera.');
            return;
        }
        self.startAnalysis = function() {
            if (self.timerID!==null){
                global.window.clearTimeout(self.timerID);
            }
            self.timerID = global.window.setTimeout(self.analyzeFrame, self.timeStep);
        }
        self.stopAnalysis = function() {
            if (self.timerID!==null){
                global.window.clearTimeout(self.timerID);
            }
        }
        //schedule video analysis
        self.analyzeFrame = function () {
            var lastFrameTime;
            var pixels;
            var cw=self.cw, ch=self.ch;
            global.window.clearTimeout(self.timerID);
            lastFrameTime = self.thisFrameTime;
            self.thisFrameTime = Date.now();
            self.meanFrameDur = 0.9 * self.meanFrameDur + 0.1 * (
                self.lastFrameDur);
            // evaluate color
            self.ctx.drawImage(self.vidElem, 0, 0, cw, ch);
            pixels = self.ctx.getImageData(0, 0, cw, ch).data;
            //Also make available to the outside world:
            self.pixels = pixels;
            for (var i = 0; i < self.statistics.length; i++) {
                self.statistics[i].analyzeFrame(pixels);
            }
            self.meanAnalysisDur = 0.9 * self.meanAnalysisDur + 0.1 * (
                Date.now() - self.thisFrameTime);
            // reschedule video analysis
            // after 50ms to always get delta
            // you probably still want to smooth it
            self.timerID = global.window.setTimeout(self.analyzeFrame, self.timeStep);
        }
    };

    // expose our module to the global object
    global.videoanalyzers = {
        VideoAnalyzer: VideoAnalyzer,
    };
})( this );
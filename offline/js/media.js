(function( window, document ) {
    'use strict';
    
    // shim the requestAnimationFrame API, with a setTimeout fallback
    window.requestAnimationFrame = (function(){
        return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;

    // shim getUserMedia ;
    //making it a local method doesn't work without tedious "this" wrangling.
    window.navigator.getUserMedia = (window.navigator.getUserMedia ||
        window.navigator.webkitGetUserMedia ||
        window.navigator.mozGetUserMedia ||
        window.navigator.msGetUserMedia);

    // Make webkit browsers use the prefix-free version of AudioContext.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    if (typeof window.MediaStreamTrack.getSources === 'undefined'){
        console.log('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
    } else {
        window.MediaStreamTrack.getSources(countDevices);
    }

    function countDevices(sourceInfos) {
        for (var i = 0; i !== sourceInfos.length; ++i) {
            var sourceInfo = sourceInfos[i];
            if (sourceInfo.kind === 'video') {
                media.cams.push(sourceInfo.id);
            } else if (sourceInfo.kind === 'audio') {
                media.mics.push(sourceInfo.id);
            }
        }
        /*
        console.log("Found " + media.cams.length + " cam(s).");
        console.log("Found " + media.mics.length + " mic(s).");
        for (var j = 0; j < media.cams.length; ++j) {
            console.log("cam id " + j + ": " + media.cams[j]);
        }
        for (var k = 0; k < media.mics.length; ++k) {
            console.log("mic id " + k + ": " + media.mics[k]);
        }
        */
    };

    //Utility function to return the media stream ONLY ONCE
    function getMedia(opts) {
        var currCam="none", currMic="none", currStream="none", currOpts, success, cam, mic;
        currOpts = {
            "video": true,
            "audio": true,
        };
        opts = opts || currOpts;
        success = opts.success || function() {};
        //we have already called this!
        if (typeof media.stream !== 'undefined') {
            success(media.stream);
        };
        //if nothing has changed, callback with the stream
        if ((currStream !== "none") &&
                (opts.video===currOpts.video) &&
                (opts.audio===currOpts.audio)) {
            success(stream);
        };
        //otherwise, it will depend on what we want.
        if ((currStream === "none") &&
                (opts.video===currOpts.video) &&
                (opts.audio===currOpts.audio)) {
            success(stream);
        };
        //otherwise, call it now.
        window.navigator.getUserMedia(
            currOpts, function(stream) {
                media.stream = stream;
                success(stream);
            }, function(e) {
                alert('Error getting audio or video');
                console.log(e);
            }
        );
    };
    media.initStream = initStream;
    
    function switchCam() {
        media.currentCam = ((media.currentCam || 0 ) + 1) % (media.cams.length);
        var constraints = {
            audio: {
                optional: [{sourceId: media.mics[media.currentMic]}]
            },
            video: {
                optional: [{sourceId: media.cams[media.currentCam]}]
            }
        };

        window.navigator.getUserMedia(
            constraints,
            function(stream) {
                media.stream = stream;
                analyzer = null;
                analyzer = new this.videoanalyzers.VideoAnalyzer({
                    vidElem: document.getElementById('video'),
                    canvElem: document.getElementById('canvas'),
                    statistics: [new this.videostatistics.AverageColor()],
                    pubsub: pubsub,
                    stream: stream
                });

                console.log("Switched to cam with id " + media.cams[media.currentCam]);
            },
            function(e) {
                alert('Please share your cam and mic!');
                console.log(e);
            });
    };
    
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
    
    function attachMediaButton(el) {
        if (typeof window.MediaStreamTrack.getSources === 'undefined'){
            el.addEventListener("click", switchCam);
        } else {console.debug("MediaStreamTrack not supported")}
    };
    media.attachMediaButton = attachMediaButton;
    
    function attachFullscreenButton (el) {
        el.addEventListener("click", function(){
            var goFullScreen = !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement;
            if (goFullscreen) {
                el.classList.remove("fi-arrows-out");
                el.classList.add("fi-arrows-in");
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                el.classList.remove("fi-arrows-in");
                el.classList.add("fi-arrows-out");
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
            
        });
    };
    media.attachFullscreenButton = attachFullscreenButton;
    
})( window, document );

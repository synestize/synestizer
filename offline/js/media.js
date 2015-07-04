(function( window, document ) {
    'use strict';
    
    var media; 
    window.media = media = window.media || {};
    media.mics = [];
    media.cams = [];
    
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
        window.MediaStreamTrack.getSources(function (sourceInfos) {
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
        });
    }

    //Utility singleton to return the media stream only as necessary
    function Media(opts) {
        var currCam="none", currMic="none", mediaStream="none", constraints;
        constraints = {
            "video": true,
            "audio": true,
        };
        
        function getMedia(opts) {
            var newCam, newMic, success, mustUpdate=false;
            newCam = opts.cam || currCam;
            newMic = opts.mic || currMic;
            success = opts.success || function() {};
            if ((newCam !== currCam) && (media.cams.length>0)) {
                constraints.video = {
                    optional: [{sourceId: media.cams[media.currentCam]}]
                };
                mustUpdate = true;
            };
            if ((newMic !== currMic) && (media.mics.length>0)) {
                constraints.audio = {
                    optional: [{sourceId: media.mics[media.currentMic]}]
                };
                mustUpdate = true;
            };
            if ((mediaStream==="none") || mustUpdate) {
                currCam = newCam;
                currMic = newMic;
                window.navigator.getUserMedia(
                    constraints, function(newMediaStream) {
                        mediaStream = newMediaStream;
                        success(newMediaStream);
                    }, function(e) {
                        alert('Error getting audio or video', constraints);
                        console.log(e);
                    }
                );
            } else {
                success(mediaStream)
            }
        }
        getMedia(opts);
        return getMedia
    };
    media.Media = Media;
    
    function VideoPixelStreamer(canvElem, vidElem, pixelStream, mediaStream) {
        var url, gfxCtx, pixels, cw, ch, timer="none";
        function getPixels() {
            return pixels || [];
        }
        getPixels.attachMediaStream = function(newMediaStream) {
            url = window.URL || window.webkitURL;
            mediaStream = newMediaStream;
            vidElem.src = url ? url.createObjectURL(mediaStream) : mediaStream;
            vidElem.play();
            if (timer!=="none") {
                window.clearInterval(timer);
            }
            timer = window.setInterval(pumpPixels, 50);//20 Hz
            return getPixels;
        }
        function pumpPixels(){
            // The first few frames get lost in Firefox, raising exceptions
            // We make sure this does not break the whole loop by
            // using a try..catch
            try {
                gfxCtx.drawImage(vidElem, 0, 0, cw, ch);
                pixels = gfxCtx.getImageData(0, 0, cw, ch).data || [];
            } catch (e) {
                console.log("error getting video frame");
                console.debug(e);
            }
            if (pixels.length>0) {
                //Yay! it worked
                pixelStream.onNext(pixels);
            };
        }
        gfxCtx = canvElem.getContext('2d');
        cw = canvElem.width;
        ch = canvElem.height;
        pixelStream = pixelStream || new Rx.ReplaySubject(1);
        if (typeof mediaStream !== "undefined") {
            getPixels.attachMediaStream(mediaStream)
        }
        getPixels.cw = function () {return cw};
        getPixels.ch = function () {return ch};
        getPixels.stream = function () {return pixelStream};
        return getPixels;
    }
    media.VideoPixelStreamer = VideoPixelStreamer;
    
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

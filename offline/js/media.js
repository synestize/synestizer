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
    
    function VideoPixelPump(canvElem, vidElem, mediaStream, interval, pixelStream) {
        //get pixel arrays from a canvas element
        //TODO: generate own DOM elements if none are supplied.
        var url, gfxCtx, pixels, initObs, pixelStream, timer="none";
        var PIXELDIM=64; //64x64 grid is all we use.
        interval = interval || 50; //20 Hz sampling rate
        function getPixels() {
            return pixels || [];
        };
        pixelStream = pixelStream || new Rx.Subject();
        getPixels.pixelStream = pixelStream;
        getPixels.attachMediaStream = function(newMediaStream) {
            url = window.URL || window.webkitURL;
            if(timer!=="none"){timer.dispose()};
            mediaStream = newMediaStream;
            vidElem.src = url ? url.createObjectURL(mediaStream) : mediaStream;
            initObs = Rx.Observable.fromEvent(
                vidElem, "loadedmetadata"
                ).subscribe(function () {
                    console.debug("video thingy might work!")
                    timer = Rx.Observable.interval(
                        interval
                    ).subscribe(pump)
                });
            vidElem.play();
            return getPixels;
        };
        function pump() {
            var vw, vh, vAspect, cw, ch, cAspect, newCw, newCh;
            var xoffset, yoffset;
            cw = canvElem.width;
            ch = canvElem.height;
            //we do || because .width can be NaN or 0 sometimes.
            cAspect = (cw||64)/(ch||64);
            
            /*
            This should return the size of the *video*,
            not the *video element*,
            although it may also return nonsense for the first few frames.
            since we only do this on the loadedmetadata event,
            that problem might no longer exist?
            */
            vw = vidElem.videoWidth;
            vh = vidElem.videoHeight;
            //so once again we guess!
            vAspect = (vw||64)/(vh||64);
            if (vAspect<1){ //taller than wide
                newCh = Math.ceil(PIXELDIM*vAspect);
                newCw = PIXELDIM;
                xoffset = 0;
                yoffset = Math.floor((newCh-PIXELDIM)/2);
            } else {
                newCh = PIXELDIM;
                newCw = Math.ceil(PIXELDIM*vAspect);
                xoffset = Math.floor((newCw-PIXELDIM)/2);
                yoffset = 0;
            };
            if((cw!==newCw)||(ch!==newCh)){
                //TODO: make sure resize worked. CSS could override.
                //TODO: do i even need the css? it's the drawing surface that counts
                cw = newCw;
                ch = newCh;
                //set visual size (although probably invisible)
                canvElem.style.width=cw+"px";
                canvElem.style.height=ch+"px";
                //set drawing size (essential)
                canvElem.width=cw;
                canvElem.height=ch;
            };
            console.debug("cv", cw, ch, cAspect, vw, vh, vAspect, newCw, newCh, xoffset, yoffset);
            // The first few frames get lost in Firefox, raising exceptions
            // We make sure this does not break the whole loop by
            // using a try..catch
            // TODO: check that this is still true
            // TODO: if the pixels are missing, loop until successful. (retryWhen from Rx can do this)
            try {
                console.debug("cv2", cw, ch, vw, vh);
                
                gfxCtx.drawImage(vidElem, 0, 0, vw, vh, 0, 0, cw, ch);
                //slice a square section out of the video
                pixels = gfxCtx.getImageData(
                    xoffset, yoffset,
                    xoffset+PIXELDIM, yoffset+PIXELDIM).data || [];
            } catch (e) {
                console.log("error getting video frame");
                console.debug(e);
            }
            if (pixels.length>0) {
                //Yay! it worked
                pixelStream.onNext(pixels);
            };
            return getPixels;
        };
        getPixels.pump = pump; //shouldn't really be called from outside?
        gfxCtx = canvElem.getContext('2d');
        if (typeof mediaStream !== "undefined") {
            getPixels.attachMediaStream(mediaStream)
        };
        console.debug("pp", getPixels, getPixels.pixelStream, getPixels.pump, canvElem, vidElem, mediaStream);
        return getPixels;
    }
    media.VideoPixelPump = VideoPixelPump;
    
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

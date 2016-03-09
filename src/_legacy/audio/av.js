(function( global, document, Rx) {
    'use strict';
    
    var media;
    var _ac=false;
    
    global.media = media = global.media || {};
    media.mics = [];
    media.cams = [];
    
    // shim getUserMedia ;
    global.navigator.getUserMedia = (global.navigator.getUserMedia ||
        global.navigator.webkitGetUserMedia ||
        global.navigator.mozGetUserMedia ||
        global.navigator.msGetUserMedia);
    
    if (global.MediaStreamTrack.getSources===undefined){
        console.debug('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
    } else {
        global.MediaStreamTrack.getSources(function (sourceInfos) {
            for (let sourceInfo of sourceInfos) {
                if (sourceInfo.kind === 'video') {
                    media.cams.push(sourceInfo.id);
                } else if (sourceInfo.kind === 'audio') {
                    media.mics.push(sourceInfo.id);
                }
            }
        });
    }
    //singleton audiocontext, for shared master output etc.
    //NB currently not shared with WAAX
    media.AudioContext = function() {
        if (!_ac) {
            _ac = new AudioContext();
        }
        return _ac;
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
                global.navigator.getUserMedia(
                    constraints, function(newMediaStream) {
                        mediaStream = newMediaStream;
                        success(newMediaStream);
                    }, function(e) {
                        alert('Error getting audio or video', constraints);
                        console.debug(e);
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
        canvElem.width = PIXELDIM;
        canvElem.height = PIXELDIM;
        //optional:
        canvElem.style.width=PIXELDIM+"px";
        canvElem.style.height=PIXELDIM+"px";
        
        //pixelStream = pixelStream || new Rx.ReplaySubject(1); //So that we may always sample
        pixelStream = pixelStream || new Rx.Subject();
        getPixels.pixelStream = pixelStream;
        getPixels.attachMediaStream = function(newMediaStream) {
            url = global.URL || global.webkitURL;
            if(timer!=="none"){timer.dispose()};
            mediaStream = newMediaStream;
            vidElem.src = url ? url.createObjectURL(mediaStream) : mediaStream;
            initObs = Rx.Observable.fromEvent(
                vidElem, "loadedmetadata"
                ).subscribe(function () {
                    timer = Rx.Observable.interval(
                        interval
                    ).subscribe(pump)
                });
            vidElem.play();
            return getPixels;
        };
        function pump() {
            var vw, vh, vAspect;
            var xoffset, yoffset, vsize;
            /*
            This should return the size of the *video*,
            not the *video element*,
            although it may also return nonsense for the first few frames.
            so we only do this on the loadedmetadata event,
            */
            vw = vidElem.videoWidth;
            vh = vidElem.videoHeight;
            //so once again we guess!
            vAspect = vw/vh;
            vsize = Math.min(vw, vh);
            if (vAspect<1){ //taller than wide
                xoffset = 0;
                yoffset = Math.floor((vh-vsize)/2);
            } else { //wider than tall
                xoffset = Math.floor((vw-vsize)/2);
                yoffset = 0;
            };
            // console.debug("cv", vw, vh, vAspect, vsize, xoffset, yoffset);
            // The first few frames get lost in Firefox, raising exceptions
            // We make sure this does not break the whole loop by
            // using a try..catch
            // TODO: check that this is still true
            try {
                //slice a square section out of the video
                //looks a bit sqished on my laptop, but whatever.
                gfxCtx.drawImage(
                    vidElem,
                    xoffset, yoffset, xoffset+vsize, yoffset+vsize,
                    0, 0, PIXELDIM, PIXELDIM
                );
                pixels = gfxCtx.getImageData(
                    0, 0,
                    PIXELDIM, PIXELDIM).data || [];
            } catch (e) {
                console.debug("error getting video frame", e);
            }
            if (pixels.length>0) {
                //Yay! it worked
                pixelStream.onNext(pixels);
            };
            return getPixels;
        };
        getPixels.pump = pump; //shouldn't really be called from outside?
        gfxCtx = canvElem.getContext('2d');
        if (mediaStream !== undefined) {
            getPixels.attachMediaStream(mediaStream)
        };
        return getPixels;
    }
    media.VideoPixelPump = VideoPixelPump;
    
    function attachMediaButton(el) {
      el.addEventListener("click", switchCam);
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
})(this, document, Rx, React);
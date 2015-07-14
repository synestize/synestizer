(function( window, document, Rx) {
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
    function Midi(opts, indom, outdom) {
        var indevices=[], outdevices=[];
        var instream, outstream;
        var indevice, outdevice;
        var indevice="none", outdevice="none";
        var deviceinfo="none";
        var indevicestream, outdevicestream;
        var indatastream, outdatastream;
        
        //should this in fact return a higher order observable of midi devices?
        function getMidi(newdeviceinfo){
            deviceinfo = newdeviceinfo;
            getMidi.deviceinfo = newdeviceinfo;
            //these should really be concatenated onto the existing Subjects:
            indevicestream.onNext(newdeviceinfo.inputs);
            outdevicestream.onNext(newdeviceinfo.outputs);
        };
        function setInput(input) {
            delete(indevice.onmidimessage);
            indevice = input;
            indevice.onmidimessage = function(ev){
                //for now this only filters midi CC values
                var midipayload = new Array(2);
                var midievent = {};
                midipayload[0] = ev.data[1];
                midipayload[1] = ev.data[2]/127;
                console.debug(ev.data);
                //177: CC
                //145: Note on
                //129: Note off
                if (ev.data[0]===177) {
                    outdatastream.onNext({c:midipayload});
                    console.debug({c:midipayload});
                    
                }
            }
        }
        getMidi.setInput = setInput;
        
        function setOutput(output) {
            outdevice = output;
        }
        getMidi.setOutput = setOutput;
        
        getMidi.indevicestream = indevicestream = new Rx.Subject();
        getMidi.outdevicestream = outdevicestream = new Rx.Subject();
        getMidi.indatastream = indatastream = new Rx.Subject();
        getMidi.outdatastream = outdatastream = new Rx.Subject();
        
        if (indom) {
            indevicestream.subscribe(function (devices) {
                //Rx.Observable.pairs(devices) doesn't work?
                indom.innerHTML = '';
                indom.disabled = false;
                devices.forEach( function( dev, key) {
                    var opt = document.createElement("option");
                    opt.text = dev.name;
                    opt.value = key;
                    indom.add(opt);
                });
                Rx.Observable.fromEvent(indom, 'change').subscribe(
                    function(ev) {
                        console.debug("ev", ev, devices.get(ev.target.value));
                        setInput(devices.get(ev.target.value))
                    }
                );
            });
        }
        if (outdom) {
            getMidi.indevicestream.subscribe(function(devices){
                outdom.innerHTML = '';
                outdom.disabled=false;
                devices.forEach( function( dev, key) {
                    var opt = document.createElement("option");
                    opt.text = dev.name;
                    outdom.add(opt);
                });
            })
        }

        if (typeof window.navigator.requestMIDIAccess==="function") {
            console.debug("yay midi")
            Rx.Observable.fromPromise(
                window.navigator.requestMIDIAccess()
            ).subscribe(getMidi);
        } else {
            console.debug("no midi", typeof window.navigator.requestMIDIAccess)
        };
        
        getMidi.indevicestream = indevicestream;
        getMidi.outdevicestream = outdevicestream;
        //
        return getMidi;
    };
    media.Midi = Midi;
    
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
            url = window.URL || window.webkitURL;
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
                console.log("error getting video frame", e);
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
        return getPixels;
    }
    media.VideoPixelPump = VideoPixelPump;
    
    function attachMediaButton(el) {
        if (typeof window.MediaStreamTrack.getSources === 'undefined'){
            el.addEventListener("click", switchCam);
        } else {console.log("MediaStreamTrack not supported")}
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
    
    
})( window, document, Rx);

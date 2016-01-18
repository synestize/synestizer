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
            for (var i = 0; i !== sourceInfos.length; ++i) {
                var sourceInfo = sourceInfos[i];
                if (sourceInfo.kind === 'video') {
                    media.cams.push(sourceInfo.id);
                } else if (sourceInfo.kind === 'audio') {
                    media.mics.push(sourceInfo.id);
                }
            }
            /*
            console.debug("Found " + media.cams.length + " cam(s).");
            console.debug("Found " + media.mics.length + " mic(s).");
            for (var j = 0; j < media.cams.length; ++j) {
                console.debug("cam id " + j + ": " + media.cams[j]);
            }
            for (var k = 0; k < media.mics.length; ++k) {
                console.debug("mic id " + k + ": " + media.mics[k]);
            }
            */
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
    
    function Midi(opts) {
        opts = opts || {};
        var indevices = {}, outdevices = {};
        var instream, outstream;
        var indevicename = opts.indevice;
        var outdevicename = opts.outdevice;
        var indevice, outdevice;
        var indevicestream, outdevicestream;
        var indatastream, outdatastream;
        var indom = opts.indom;
        var outdom = opts.outdom;
        var outputhandle;
        var statsnames=[];
        var statsoffsets=[];
        
        setMidi.indevicestream = indevicestream = new Rx.Subject();
        setMidi.outdevicestream = outdevicestream = new Rx.Subject();
        setMidi.indatastream = indatastream = new Rx.Subject();
        setMidi.outdatastream = outdatastream = new Rx.Subject();
        
        function setMidi(newdeviceinfo){
            setMidi.indevices = indevices = newdeviceinfo.inputs;
            setMidi.outdevices = outdevices = newdeviceinfo.outputs;
            // automatically update when the devices change: (Doesn't work)
            // newdeviceinfo.onstatechange = queryMidi;
            indevicestream.onNext(indevices);
            outdevicestream.onNext(outdevices);
        };
        
        function setInput(newindevice) {
            console.debug("setin", newindevice);
            if (indevice) delete(indevice.onmidimessage);
            //set input device if we actually gave a device
            if (newindevice) {
                indevicename = newindevice.name;
                newindevice.onmidimessage = function(ev){
                    //for now this only filters midi CC values
                    //turns [177,15,64]
                    //into ["c",1,16,0.5]
                    var midievent = new Array(4);
                    var cmd = ev.data[0] >> 4;
                    var channel = ev.data[0] & 0x0f;
                    var idx = ev.data[1];
                    var val = ev.data[2]/127;
                    //midievent[0] = cmd;
                    midievent[1] = channel;
                    midievent[2] = idx;
                    midievent[3] = val;
                    
                    //11: CC
                    //9: Note on
                    //8: Note off
                    if (cmd===11) {
                        midievent[0]="c";
                        //console.debug("me", ev.data, midievent);
                        indatastream.onNext(midievent);
                    }
                };
                //update UI if necc
                if (indom && newindevice &&
                        (indevice!==newindevice)) {
                    indom.value = newindevice.id;
                }
                indevice = newindevice;
            }
        }
        setMidi.setInput = setInput;
        
        function setInputByName(inputname) {
            inputname = inputname.toLowerCase();
            Rx.Observable.from(indevices.values()).first(
                function(dev){
                    return dev.name.toLowerCase().indexOf(inputname) != -1
                }
            ).subscribe(function (matched){
                setInput(matched);
            }, function (err) {
                console.debug("no devices matching", inputname, err.stack);
            });
        }
        setMidi.setInputByName = setInputByName;
        
        function setOutput(newoutdevice) {
            console.debug("setout", newoutdevice);
            //get rid of previous handlers
            if (outputhandle) {
                outputhandle.dispose();
            }
            if (newoutdevice){
                outputhandle = outdatastream.subscribe(function(data){
                    var cmd = data[0];
                    var channel = data[1];
                    var idx = data[2];
                    var val = Math.max(Math.min(
                        Math.floor(data[3]*128),
                        127), 0)
                    //turns ["c",1,16,0.5]
                    //into [177,16,64]
                    var midibytes = [
                        176 + channel,
                        idx,
                        val
                    ];
                    if (cmd==="c"){
                        newoutdevice.send(midibytes);
                    }
                });
            };
            if (outdom && newoutdevice &&
                    (outdevice!==newoutdevice)) {
                outdom.value = newoutdevice.id;
            }
            outdevice = newoutdevice;
        }
        setMidi.setOutput = setOutput;
        
        function setOutputByName(outputname) {
            outputname = outputname.toLowerCase();
            Rx.Observable.from(outdevices.values()).first(
                function(dev){
                    return dev.name.toLowerCase().indexOf(outputname) != -1
                }
            ).subscribe(function (matched){
                setOutput(matched);
            }, function (err) {
                console.debug("no devices matching", outputname, err.stack);
            });
        }
        setMidi.setOutputByName = setOutputByName;

        setMidi.indevicestream.subscribe(function(devices){
            if (indom) {
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
                        setInput(devices.get(ev.target.value))
                    }
                );
            }
            if (indevicename) {
                setInputByName(indevicename)
            }
        }, function (err) {
            console.debug(err.stack);
        });
        
        setMidi.outdevicestream.subscribe(function(devices){
            if (outdom) {
                outdom.innerHTML = '';
                outdom.disabled=false;
                devices.forEach( function( dev, key) {
                    var opt = document.createElement("option");
                    opt.text = dev.name;
                    opt.value = key;
                    outdom.add(opt);
                });

                Rx.Observable.fromEvent(outdom, 'change').subscribe(
                    function(ev) {
                        setOutput(devices.get(ev.target.value))
                    }
                );
            }
            if (outdevicename) {
                setOutputByName(outdevicename)
            }
        }, function (err) {
            console.debug(err.stack);
        });

        function queryMidi(event) {
            //event maybe a midi connection event
            Rx.Observable.fromPromise(
                global.navigator.requestMIDIAccess()
            ).subscribe(
                setMidi,
                function (err) {
                    console.debug(err.stack);
                }
            );
        }
        if (typeof global.navigator.requestMIDIAccess==="function") {
            console.debug("yay midi")
            queryMidi();
        } else {
            console.debug("no midi", typeof global.navigator.requestMIDIAccess)
        };
        
        return setMidi;
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
        if (typeof mediaStream !== "undefined") {
            getPixels.attachMediaStream(mediaStream)
        };
        return getPixels;
    }
    media.VideoPixelPump = VideoPixelPump;
    
    function attachMediaButton(el) {
        if (global.MediaStreamTrack.getSources===undefined){
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
    
    
})(this, document, Rx);

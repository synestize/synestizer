(function( window, document ) {
    'use strict';
    //namespace:
    var media = {
        stream: undefined,
        currentCam: 0,
        currentMic: 0,
        cams: [],
        mics: [],
    };
    //attach namespace to window object
    window.media = media;
    
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

    //Utility function to return the media stream ONLY ONCE
    function initStream(success) {
        //we have already called this!
        if (typeof media.stream !== 'undefined') {
            success(media.stream);
        };
        //otherwise, call it now.
        window.navigator.getUserMedia(
            {
                "video": true,
                "audio": true,
            }, function(stream) {
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
        media.currentCam = media.currentCam % media.cams.length;
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

    function attachMediaButton(el) {
        console.log("Media initialized");
        if (typeof window.MediaStreamTrack.getSources === 'undefined'){
            console.log('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
        } else {
            window.MediaStreamTrack.getSources(countDevices);
        }
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
    
})( window, document );

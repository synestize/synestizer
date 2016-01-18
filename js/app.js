(function( global ) {
  "use strict";

//miscellaneous App setup.
//This is the only javascript permitted DOM references

var currPatch;
var videoPixels;
var midi;
var app;
global.app = app = global.app || {};

app.baseUrl = function () {
    var loc = global.location;
    var pathname = loc.pathname;
    var basepathname = pathname.slice(0, pathname.lastIndexOf("/")+1);
    global.baseUrl = loc.protocol + "//" + loc.host + basepathname;
};

app.resize = function() {
    console.log("resize");
    // adapt video size to display
    var vw = global.clientWidth;
    var vh = global.clientHeight;
    var vidElem = document.getElementById("video");
    var iw = 640;
    var ih = 480; // TODO

    if (iw / ih < vw / vh) {
        var d1 = 100 * ((ih * (vw / iw)) / vh);
        vidElem.style.height = d1+"%";
        vidElem.style.width = "100%";
        vidElem.style.top = (100-d1/2+"%");
    } else {
        var d2 = 100 * ((iw * (vh / ih)) / vw);
        vidElem.style.height = "100%";
        vidElem.style.width = d2+"%";
        vidElem.style.left = (100-d2/2+"%");
    }
};

app.init = function () {
    var document = global.document;
    //debug mode:
    Rx.config.longStackSupport = true;
    global.media.Media({
        success: function(mediaStream){
            //set up info div
            document.getElementById("info").classList.remove("show");
            document.getElementById("info").classList.add("hide");
            document.getElementById("controls").classList.remove("hide");
            document.getElementById("controls").classList.add("show");
            
            // call resize for video resizing
            app.resize();
            media.attachMediaButton(
                document.getElementById("switchCam"));
            media.attachFullscreenButton(
                document.getElementById("fullscreen"));
            videoPixels = media.VideoPixelPump(
                document.getElementById("canvas"),
                document.getElementById("video"),
                mediaStream
            );
            midi = global.media.Midi({
                indom: document.getElementById("midiInDevice"),
                outdom: document.getElementById("midiOutDevice"),
                indevice: "slider",
                // outdevice: "iac-driver"
                outdevice: "osculator"
            });
            //patch loading
            function loadpatch(patchname) {
                currPatch = patch.loadPatch(
                    patch.library[patchname],
                    videoPixels,
                    document.getElementById("rightcontrolsidebar"),
                    document.getElementById("analysis-panel"),
                    midi,
                    media.AudioContext()
                );
            }
            // Using hash address for this is not ideal;
            // Doesn't reload gracefully.
            // Also we should update URL if the patch name changes.
            var patchhash = "basic_triad";
            if (global.location.hash.length>0){
                patchhash = global.location.hash.slice(1)
            }
            if (Object.keys(patch.library).indexOf(patchhash)>-1) {
                loadpatch(patchhash);
            } else {
                console.log(
                    "warning. no matching patch for ",
                    patchhash
                );
            }
        }
    });
    global.addEventListener("resize", app.resize);
};

})( this );
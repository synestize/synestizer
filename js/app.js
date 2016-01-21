(function( global ) {
  "use strict";

//miscellaneous App setup.
//This is the only javascript permitted DOM references

var currPatch;
var videoPixels;
var midi;
var app;

global.pureTabs.init('tabs-link', 'tabs-link-active');

global.app = app = global.app || {};


app.init = function () {
    var document = global.document;
    //debug mode:
    Rx.config.longStackSupport = true;
    global.media.Media({
        success: function(mediaStream){            
            midi = global.media.Midi({
                indom: document.getElementById("midiInDevice"),
                outdom: document.getElementById("midiOutDevice"),
                indevice: "slider",
                // outdevice: "iac-driver"
                outdevice: "osculator"
            });
        }
    });
    global.addEventListener("resize", app.resize);
};

})(this, document, Rx, React);

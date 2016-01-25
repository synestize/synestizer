
var app = {};

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

module.exports = app;
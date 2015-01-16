var patches = patches || {};

(function(patches) {
    'use strict';

    patches.Triad = function (preset) {

        var preset = preset || {};
        var triad = WX.Triad();

        triad.setPreset(preset);
        triad.to(WX.Master);

        console.log("Triad patch initialized");

        return {
            run: function() {
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/raw",
                    function(data) {
                        triad.glide1( document.getElementById('triadFreq1Knob').value + ( 0.05 * Math.pow(~~(data[0]*255), 2)) );
                        triad.glide2( document.getElementById('triadFreq2Knob').value + ( 0.05 * Math.pow(~~(data[1]*255), 2)) );
                        triad.glide3( document.getElementById('triadFreq3Knob').value + ( 0.05 * Math.pow(~~(data[2]*255), 2)) );
                    });
            },

            setOutput: function(output) {
                triad.output(output);
            },

            properties: {
                triad: triad,
                preset: preset
            }
        };
    };


})( patches );










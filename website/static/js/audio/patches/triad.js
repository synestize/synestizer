var patches = patches || {};

(function(patches) {
    'use strict';

    patches.Triad = function (preset) {

        var preset = preset || {};
        var triad = WX.Triad();

        triad.setPreset(preset);

        //var p = { lfoRate1: 61, lfoDepth1: 1 };
        //triad.setPreset(p);

        triad.to(WX.Master);

        console.log("Triad patch initialized");

        return {
            run: function() {
                this.setOutput(preset["output"]); // TODO see setOutput
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/raw",
                    function(data) {

                        triad.glide1( document.getElementById('triadFreq1Knob').value + ( 0.01 * Math.pow(~~(data[0]*255), 2)) );
                        triad.glide2( document.getElementById('triadFreq2Knob').value + ( 0.01 * Math.pow(~~(data[1]*255), 2)) );
                        triad.glide3( document.getElementById('triadFreq3Knob').value + ( 0.01 * Math.pow(~~(data[2]*255), 2)) );

                        triad.$lfoRate1(data[0].map(0,1,0,20), WX.now, 0);
                        triad.$lfoRate2(data[1].map(0,1,0,20), WX.now, 0);
                        triad.$lfoRate3(data[2].map(0,1,0,20), WX.now, 0);
                    });
            },

            setOutput: function(output) {
                triad.output(output/2); // TODO set proper volume..
            },

            properties: {
                triad: triad,
                preset: preset
            }
        };
    };


})( patches );










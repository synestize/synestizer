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
                    "/videoanalyzer/averagecolor/val/0",
                    function(data) {
                        triad.glide1( document.getElementById('freq1Knob').value + ( 0.01 * Math.pow(~~(data*255), 2)) );
                        triad.$lfoRate1(data.map(0,1,0,20), WX.now, 0);
                    });
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/val/1",
                    function(data) {
                        triad.glide2( document.getElementById('freq2Knob').value + ( 0.01 * Math.pow(~~(data*255), 2)) );
                        triad.$lfoRate2(data.map(0,1,0,20), WX.now, 0);
                    });
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/val/2",
                    function(data) {

                        triad.glide3( document.getElementById('freq3Knob').value + ( 0.01 * Math.pow(~~(data*255), 2)) );
                        triad.$lfoRate3(data.map(0,1,0,20), WX.now, 0);
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










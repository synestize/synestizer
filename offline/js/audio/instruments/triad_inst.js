/*
Players make sound
*/

(function(window, _, d3, WX){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    instruments.BasicInst = function (name, context) {
        var triad;
        var lfoRateScale, glideScale;
        lfoRateScale = d3.scale.linear().domain([0, 1]).range([0, 20]);
        glideScale = d3.scale.pow().domain([0, 1]).range([0, 650]).exponent(2);

        return {
            name: name,
            setup: function () {
                triad = WX.Triad();
                lfoRateScale = d3.scale.linear().domain([0, 1]).range([0, 20]);
                glideScale = d3.scale.pow().domain([0, 1]).range([0, 650]).exponent(2);
                triad.to(WX.Master);;
            },
            teardown: function () {},
            setControlStream: {},
            controlMeta: {
                gain: {
                    scale: d3.scale.log().range([0.001,1]),
                    units: "",
                    default: 0.7
                },
                pitch: {
                    scale: d3.scale.log().range([200,2000]),
                    units: "Hz",
                    default: 0.0
                },
                lfo1Rate: {
                    scale: lfoRateScale,
                    units: "Hz",
                    default: 0.7
                },
                fmod1: {
                    scale: glideScale,
                    units: "Hz",
                    default: 0.0
                },
            }
        };
    };
})(window, _, d3, WX);

/*
Players make sound
*/

(function(window, _, d3){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    instruments.BasicInst = function (name, context) {
        return {
            name: name,
            setup: function () {},
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
                }
            }
        };
    };
})(window, _, d3);

/*
Metadata about certain synths
*/

(function(window, d3){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    window.instruments.BasicControlMeta  = {
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
    };
})(window, d3);

(function(window){
    'use strict';
    var Basic;
    window.Instruments = window.Instruments || {};
    Basic = function (parms) {
        
    }
    Basic.prototype.controls = {
        gain: {scale: d3.scale.linear(), units: "db"}
    }
    window.Instruments.Basic = Basic;
    
})(window);

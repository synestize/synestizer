// Video Statistics
// Functions that return functions that return dynamically updated estimated 
// qualities of a video stream.
// These will ultimately be run in web workers by Observers
// They will follow mbostock's stateful function pattern http://bost.ocks.org/mike/chart/

(function( global, _, Rx ) {
    'use strict';
    var video; 
    window.video = video = window.video || {};
    function AverageColor(params) {
        cw = params.cw || 86;
        ch = params.ch || 64;
        function calc(pixels) {
            var pixelCount = self.analyzer.cw * self.analyzer.ch;
            var out = new Array(3);
            var red = 0;
            var green = 0;
            var blue = 0;

            for (var i = 0; i < pixelCount; i++) {
                red += pixels[i * 4 + 0]/255;
                green += pixels[i * 4 + 1]/255;
                blue += pixels[i * 4 + 2]/255;
            }

            out[0] = red / pixelCount;
            out[1] = green / pixelCount;
            out[2] = blue / pixelCount;
            return out;
        }
        return calc;
    };

    // expose our module to the global object
    global.video.AverageColor = AverageColor;
})( this, _, Rx );
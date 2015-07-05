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
        var cw, ch, pixelCount;
        params = params || {};
        var out = new Float32Array(3);
        var R=0, G=1, B=2;
        cw = params.cw || 86;
        ch = params.ch || 64;
        pixelCount = cw * ch;
        function calc(pixels) {
            out[R] = 0;
            out[G] = 0;
            out[B] = 0;
            
            for (var i = 0; i < pixelCount; i++) {
                out[R] += pixels[i * 4 + R]/255;
                out[G] += pixels[i * 4 + G]/255;
                out[B] += pixels[i * 4 + B]/255;
            }

            out[R] = out[R] / pixelCount;
            out[G] = out[G] / pixelCount;
            out[B] = out[B] / pixelCount;
            return out;
        }
        calc.nDims = 3;
        return calc;
    };
    // expose our module to the global object
    global.video.AverageColor = AverageColor;
    
    function Covariance(params) {
        var cw, ch, pixelCount;
        var rawSums, centralMoments, cookedMoments, bsvxy;
        
        // I call the YCBCR mapped version "BSV", the spatial coords "XY"
        var B=0, S=1, V=2, XB=4, XS=5, XV=6, YB=7, YS=8, YV=9, BB=10, BS=11, BV=12, SS=13, SV=14, VV=15;
        params = params || {};
        
        rawSums = new Float32Array(16);
        centralMoments = new Float32Array(16);
        cookedMoments = new Float32Array(16);
        bsvxy = new Float32Array(3);
        cw = params.cw || 86;
        ch = params.ch || 64;
        pixelCount = cw * ch;
        
        function calc(pixels) {
            for (var i = 0; i < ch; i++) {
                for (var j = 0; i < cw; j++) {
                    var ij = (cw * i + j) * 4;
                    bsvxy[0] = ( //B
                          0.00117255*pixels[ij]
                        + 0.00230200*pixels[ij+1]
                        + 0.00044706*pixels[ij+2]
                    );
                    bsvxy[1] = 0.5 + ( //S
                        - 0.00066563*pixels[ij] 
                        - 0.00129907*pixels[ij+1]
                        + 0.00196078*pixels[ij+2]
                    );
                    bsvxy[2] = 0.5 + ( //V
                          0.00196078*pixels[ij]
                        - 0.00164191*pixels[ij+1]
                        - 0.00031887*pixels[ij+2]
                    );
                    bsvxy[3] = j/ch; //X
                    bsvxy[4] = i/cw; //Y
                    rawSums[B] += bsvxy[0];
                    rawSums[S] += bsvxy[1];
                    rawSums[V] += bsvxy[2];
                    rawSums[XB] += bsvxy[0]*bsvxy[3];
                    rawSums[XS] += bsvxy[1]*bsvxy[3];
                    rawSums[XV] += bsvxy[2]*bsvxy[3];
                    rawSums[YB] += bsvxy[0]*bsvxy[4];
                    rawSums[YS] += bsvxy[1]*bsvxy[4];
                    rawSums[YV] += bsvxy[2]*bsvxy[4];
                    rawSums[BB] += bsvxy[0]*bsvxy[0];
                    rawSums[BS] += bsvxy[0]*bsvxy[1];
                    rawSums[BV] += bsvxy[0]*bsvxy[2];
                    rawSums[SS] += bsvxy[1]*bsvxy[1];
                    rawSums[SV] += bsvxy[0]*bsvxy[2];
                    rawSums[VV] += bsvxy[2]*bsvxy[2];
                }
            }
            centralMoments[B] = rawSums[B]/pixelCount;
            centralMoments[S] = rawSums[S]/pixelCount;
            centralMoments[V] = rawSums[V]/pixelCount;
            centralMoments[XB] = (0.5 * centralMoments[B] 
                - rawSums[XB]/pixelCount);
            centralMoments[XS] = (0.5 * centralMoments[S] 
                - rawSums[XS]/pixelCount);
            centralMoments[XV] = (0.5 * centralMoments[V] 
                - rawSums[XV]/pixelCount);
            centralMoments[YB] = (0.5 * centralMoments[B] 
                - rawSums[YB]/pixelCount);
            centralMoments[YS] = (0.5 * centralMoments[S] 
                - rawSums[YS]/pixelCount);
            centralMoments[YV] = (0.5 * centralMoments[V] 
                - rawSums[YV]/pixelCount);
            centralMoments[BB] = (centralMoments[B] * centralMoments[B] 
                - rawSums[BB]/pixelCount);
            centralMoments[BS] = (centralMoments[B] * centralMoments[S] 
                - rawSums[BS]/pixelCount);
            centralMoments[BS] = (centralMoments[B] * centralMoments[V] 
                - rawSums[BV]/pixelCount);
            centralMoments[SS] = (centralMoments[S] * centralMoments[S] 
                - rawSums[SS]/pixelCount);
            centralMoments[SV] = (centralMoments[S] * centralMoments[V] 
                - rawSums[SV]/pixelCount);
            centralMoments[VV] = (centralMoments[V] * centralMoments[V] 
                - rawSums[VV]/pixelCount);
            cookedMoments[B] = centralMoments[B];
            cookedMoments[S] = centralMoments[S];
            cookedMoments[V] = centralMoments[V];
            cookedMoments[BB] = centralMoments[BB]*4+0.5;
            cookedMoments[SS] = centralMoments[SS]*4+0.5;
            cookedMoments[VV] = centralMoments[VV]*4+0.5;
            cookedMoments[BS] = centralMoments[BS]/Math.sqrt(
                centralMoments[BB]*centralMoments[SS])*0.5+0.5;
            cookedMoments[BV] = centralMoments[BV]/Math.sqrt(
                centralMoments[BB]*centralMoments[VV])*0.5+0.5;
            cookedMoments[SV] = centralMoments[SV]/Math.sqrt(
                centralMoments[SS]*centralMoments[VV])*0.5+0.5;
            cookedMoments[XB] = centralMoments[XB]/Math.sqrt(
                0.25*centralMoments[BB])*0.5+0.5;
            cookedMoments[XS] = centralMoments[XS]/Math.sqrt(
                0.25*centralMoments[SS])*0.5+0.5;
            cookedMoments[XV] = centralMoments[XV]/Math.sqrt(
                0.25*centralMoments[VV])*0.5+0.5; 
            cookedMoments[YB] = centralMoments[YB]/Math.sqrt(
                0.25*centralMoments[BB])*0.5+0.5;
            cookedMoments[YS] = centralMoments[YS]/Math.sqrt(
                0.25*centralMoments[SS])*0.5+0.5;
            cookedMoments[YV] = centralMoments[YV]/Math.sqrt(
                0.25*centralMoments[VV])*0.5+0.5;
            return cookedMoments;
        }
        calc.nDims = 16;
        return calc;
    };
    // expose our module to the global object
    global.video.Covariance = Covariance;
    
})( this, _, Rx );
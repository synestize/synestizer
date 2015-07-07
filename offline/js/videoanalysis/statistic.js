//// Video Statistics
// Functions that return functions that return dynamically updated estimated 
// qualities of a video stream.
// These will ultimately be run in web workers by Observers
// They will follow mbostock's stateful function pattern http://bost.ocks.org/mike/chart/
// These should not use any external libraries unless absolutely necessary, because importing in webworkers is painful.

(function( global ) {
    'use strict';
    var videoanalysis; 
    window.videoanalysis = videoanalysis = window.videoanalysis || {};
    function AverageColor(params) {
        //1/8 sub-sampled average colour
        var PIXELDIM=64; //64x64 grid is all we use.
        var PIXELCOUNT=PIXELDIM*PIXELDIM;
        params = params || {};
        var out = new Float32Array(3);
        var R=0, G=1, B=2;
        function calc(pixels) {
            out[R] = 0;
            out[G] = 0;
            out[B] = 0;
            
            for (var i = 0; i < PIXELCOUNT; i+=8) {
                out[R] += pixels[i * 4 + R]/255;
                out[G] += pixels[i * 4 + G]/255;
                out[B] += pixels[i * 4 + B]/255;
            }

            out[R] = out[R] / PIXELCOUNT;
            out[G] = out[G] / PIXELCOUNT;
            out[B] = out[B] / PIXELCOUNT;
            return out;
        }
        calc.nDims = 3;
        return calc;
    };
    // expose our module to the global object
    global.videoanalysis.AverageColor = AverageColor;
    
    function PluginMoments(params) {
        // Gives us moment estimates by the plugin method
        // right now, 1st and 2nd central moments
        // a.k.a. mean and covariance
        // TODO: check that all variances are correctly normalised
        var PIXELDIM=64; //64x64 grid is all we use.
        var PIXELCOUNT=PIXELDIM*PIXELDIM;
        var rawSums, centralMoments, cookedMoments, ysvij;
        var nDims=15;
        // I call the YCbCr mapped version "YSV", the spatial coords "IJ"
        var B=0, S=1, V=2;
        var IB=3, IS=4, IV=5;
        var JB=6, JS=7, JV=8;
        var BB=9, BS=10, BV=11, SS=12, SV=13, VV=14;
        params = params || {};
        
        rawSums = new Float32Array(nDims);
        centralMoments = new Float32Array(nDims);
        cookedMoments = new Float32Array(nDims);
        ysvij = new Float32Array(5);
        function calc(pixels) {
            for (var i = 0; i < nDims; i++) {
                rawSums[i]=0.0;
            }            
            for (var j = 0; j < PIXELDIM; j++) {
                for (var i = 0; i < PIXELDIM; i++) {
                    var ij = (PIXELDIM * j + i) * 4;//pixel offset
                    // first we tranform RGB to YSV 
                    // - effectively a PCA of the color vectors
                    // otherwise we are measuring mostly brightness.
                    ysvij[0] = ( //Y
                          0.00117255*pixels[ij]
                        + 0.00230200*pixels[ij+1]
                        + 0.00044706*pixels[ij+2]
                    );
                    ysvij[1] = 0.5 + ( //S
                        - 0.00066563*pixels[ij] 
                        - 0.00129907*pixels[ij+1]
                        + 0.00196078*pixels[ij+2]
                    );
                    ysvij[2] = 0.5 + ( //V
                          0.00196078*pixels[ij]
                        - 0.00164191*pixels[ij+1]
                        - 0.00031887*pixels[ij+2]
                    );
                    ysvij[3] = i/PIXELDIM; //I
                    ysvij[4] = j/PIXELDIM; //J
                    if ((i==16)&&(j==16)) console.debug("t", ysvij);
                    
                    rawSums[B] += ysvij[0];
                    rawSums[S] += ysvij[1];
                    rawSums[V] += ysvij[2];
                    rawSums[IB] += ysvij[0]*ysvij[3];
                    rawSums[IS] += ysvij[1]*ysvij[3];
                    rawSums[IV] += ysvij[2]*ysvij[3];
                    rawSums[JB] += ysvij[0]*ysvij[4];
                    rawSums[JS] += ysvij[1]*ysvij[4];
                    rawSums[JV] += ysvij[2]*ysvij[4];
                    rawSums[BB] += ysvij[0]*ysvij[0];
                    rawSums[BS] += ysvij[0]*ysvij[1];
                    rawSums[BV] += ysvij[0]*ysvij[2];
                    rawSums[SS] += ysvij[1]*ysvij[1];
                    rawSums[SV] += ysvij[1]*ysvij[2];
                    rawSums[VV] += ysvij[2]*ysvij[2];
                }
            }
            console.debug("raw", rawSums);
            centralMoments[B] = rawSums[B]/PIXELCOUNT;
            centralMoments[S] = rawSums[S]/PIXELCOUNT;
            centralMoments[V] = rawSums[V]/PIXELCOUNT;
            console.debug("central", centralMoments);
            centralMoments[BB] = (rawSums[BB]/PIXELCOUNT
                - centralMoments[B] * centralMoments[B]);
            centralMoments[SS] = (rawSums[SS]/PIXELCOUNT
                - centralMoments[S] * centralMoments[S]);
            centralMoments[VV] = (rawSums[VV]/PIXELCOUNT
                - centralMoments[V] * centralMoments[V]);
            centralMoments[IB] = (rawSums[IB]/PIXELCOUNT
                - 0.5 * centralMoments[B]);
            centralMoments[IS] = (rawSums[IS]/PIXELCOUNT
                - 0.5 * centralMoments[S]);
            centralMoments[IV] = (rawSums[IV]/PIXELCOUNT
                - 0.5 * centralMoments[V]);
            centralMoments[JB] = (rawSums[JB]/PIXELCOUNT
                - 0.5 * centralMoments[B]);
            centralMoments[JS] = (rawSums[JS]/PIXELCOUNT
                - 0.5 * centralMoments[S]);
            centralMoments[JV] = (rawSums[JV]/PIXELCOUNT
                - 0.5 * centralMoments[V]);
            centralMoments[BS] = (rawSums[BS]/PIXELCOUNT
                - centralMoments[B] * centralMoments[S]);
            centralMoments[BV] = (rawSums[BV]/PIXELCOUNT
                - centralMoments[B] * centralMoments[V]);
            centralMoments[SV] = (rawSums[SV]/PIXELCOUNT
                - centralMoments[S] * centralMoments[V]);
            cookedMoments[B] = centralMoments[B];
            cookedMoments[S] = centralMoments[S];
            cookedMoments[V] = centralMoments[V];
            //Normalizing the variances is tricky.
            //Technically the maximal variance is 0.25, for a 50/50 B/W image
            //but I think we can assume a uniform distribution is a good
            // extremal point for us, implying a maximal variance of 1/12
            cookedMoments[BB] = centralMoments[BB]*12;
            cookedMoments[SS] = centralMoments[SS]*12;
            cookedMoments[VV] = centralMoments[VV]*12;
            //pure color covariances use the normal formula
            cookedMoments[BS] = centralMoments[BS]/Math.max(0.0001, Math.sqrt(
                centralMoments[BB]*centralMoments[SS]))*0.5+0.5;
            cookedMoments[BV] = centralMoments[BV]/Math.max(0.0001, Math.sqrt(
                centralMoments[BB]*centralMoments[VV]))*0.5+0.5;
            cookedMoments[SV] = centralMoments[SV]/Math.max(0.0001, Math.sqrt(
                centralMoments[SS]*centralMoments[VV]))*0.5+0.5;
            console.debug("cooked", cookedMoments);
            //color versus axis uses
            cookedMoments[IB] = centralMoments[IB]/Math.max(0.0001, Math.sqrt(
                0.08333333333*centralMoments[BB]))*0.5+0.5;
            cookedMoments[IS] = centralMoments[IS]/Math.max(0.0001, Math.sqrt(
                0.08333333333*centralMoments[SS]))*0.5+0.5;
            cookedMoments[IV] = centralMoments[IV]/Math.max(0.0001, Math.sqrt(
                0.08333333333*centralMoments[VV]))*0.5+0.5; 
            cookedMoments[JB] = centralMoments[JB]/Math.max(0.0001, Math.sqrt(
                0.08333333333*centralMoments[BB]))*0.5+0.5;
            cookedMoments[JS] = centralMoments[JS]/Math.max(0.0001, Math.sqrt(
                0.08333333333*centralMoments[SS]))*0.5+0.5;
            cookedMoments[JV] = centralMoments[JV]/Math.max(0.0001, Math.sqrt(
                0.08333333333*centralMoments[VV]))*0.5+0.5;
            return cookedMoments;
        };
        calc.nDims = nDims;
        return calc;
    };
    // expose our module to the global object
    global.videoanalysis.PluginMoments = PluginMoments;
    
})( this );
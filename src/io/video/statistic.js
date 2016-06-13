'use strict';
import transform from '../../lib/transform'

function AvgColor(params) {
    //1/8 sub-sampled average color
    params = params || {};

    var PIXELDIM=params.PIXELDIM || 64; //64x64 grid is all we use.
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

        out[R] = transform.linBipol(0, PIXELCOUNT, out[R]);
        out[G] = transform.linBipol(0, PIXELCOUNT, out[G]);
        out[B] = transform.linBipol(0, PIXELCOUNT, out[B]);
        return out;
    }

    calc.nDims = 3;
    calc.nState = 3;
    return calc;
};
function Moment(params) {
    // Gives us moment estimates by the plugin method
    // right now, 1st and 2nd central moments
    // a.k.a. mean and covariance
    // TODO: check that all variances are correctly normalised
    // Occasionally they seem to be outside of [0,1]
    params = params || {};

    var PIXELDIM=params.PIXELDIM || 64; //64x64 grid is all we use.
    var PIXELCOUNT=PIXELDIM*PIXELDIM;
    var rawSums, centralMoments, cookedMoments, ysvij;
    var nDims=15;
    var nState=15;
    // I call the YCbCr mapped version "YSV", the spatial coords "IJ"
    // This is very confusing.
    var Y=0, S=1, V=2;
    var IY=3, IS=4, IV=5;
    var JY=6, JS=7, JV=8;
    var YY=9, YS=10, YV=11, SS=12, SV=13, VV=14;

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

                rawSums[Y] += ysvij[0];
                rawSums[S] += ysvij[1];
                rawSums[V] += ysvij[2];
                rawSums[IY] += ysvij[0]*ysvij[3];
                rawSums[IS] += ysvij[1]*ysvij[3];
                rawSums[IV] += ysvij[2]*ysvij[3];
                rawSums[JY] += ysvij[0]*ysvij[4];
                rawSums[JS] += ysvij[1]*ysvij[4];
                rawSums[JV] += ysvij[2]*ysvij[4];
                rawSums[YY] += ysvij[0]*ysvij[0];
                rawSums[YS] += ysvij[0]*ysvij[1];
                rawSums[YV] += ysvij[0]*ysvij[2];
                rawSums[SS] += ysvij[1]*ysvij[1];
                rawSums[SV] += ysvij[1]*ysvij[2];
                rawSums[VV] += ysvij[2]*ysvij[2];
            }
        }
        centralMoments[Y] = rawSums[Y]/PIXELCOUNT;
        centralMoments[S] = rawSums[S]/PIXELCOUNT;
        centralMoments[V] = rawSums[V]/PIXELCOUNT;
        centralMoments[YY] = (rawSums[YY]/PIXELCOUNT
            - centralMoments[Y] * centralMoments[Y]);
        centralMoments[SS] = (rawSums[SS]/PIXELCOUNT
            - centralMoments[S] * centralMoments[S]);
        centralMoments[VV] = (rawSums[VV]/PIXELCOUNT
            - centralMoments[V] * centralMoments[V]);
        centralMoments[IY] = (rawSums[IY]/PIXELCOUNT
            - 0.5 * centralMoments[Y]);
        centralMoments[IS] = (rawSums[IS]/PIXELCOUNT
            - 0.5 * centralMoments[S]);
        centralMoments[IV] = (rawSums[IV]/PIXELCOUNT
            - 0.5 * centralMoments[V]);
        centralMoments[JY] = (rawSums[JY]/PIXELCOUNT
            - 0.5 * centralMoments[Y]);
        centralMoments[JS] = (rawSums[JS]/PIXELCOUNT
            - 0.5 * centralMoments[S]);
        centralMoments[JV] = (rawSums[JV]/PIXELCOUNT
            - 0.5 * centralMoments[V]);
        centralMoments[YS] = (rawSums[YS]/PIXELCOUNT
            - centralMoments[Y] * centralMoments[S]);
        centralMoments[YV] = (rawSums[YV]/PIXELCOUNT
            - centralMoments[Y] * centralMoments[V]);
        centralMoments[SV] = (rawSums[SV]/PIXELCOUNT
            - centralMoments[S] * centralMoments[V]);
        //in fact these components do not vary so very much, so we overdrive
        cookedMoments[Y] = transform.linBipol(0.4, 0.6, centralMoments[Y]);
        cookedMoments[S] = transform.linBipol(0.4, 0.6, centralMoments[S]);
        cookedMoments[V] = transform.linBipol(0.4, 0.6, centralMoments[V]);
        //console.debug("mom", centralMoments[Y], centralMoments[S], centralMoments[V], cookedMoments[Y], cookedMoments[S], cookedMoments[V]);
        //Normalizing the (auto)variances is tricky.
        //Technically the maximal variance is 0.25, for a 50/50 B/W image
        //but I think we can assume a uniform distribution is a good
        // extremal point for us, implying a maximal variance of 1/12
        // Even that is conservative, so we make it 1/20
        cookedMoments[YY] = transform.linBipol(-0.05, 0.05, centralMoments[YY]);
        cookedMoments[SS] = transform.linBipol(-0.05, 0.05, centralMoments[SS]);
        cookedMoments[VV] = transform.linBipol(-0.05, 0.05, centralMoments[VV]);
        //pure color covariances are reported as correlations.
        //Occasional weirdness with range outside [-1,1] so I clip for now.
        cookedMoments[YS] = transform.clipBipol(
          centralMoments[YS]/Math.max(0.0001, Math.sqrt(
            centralMoments[YY]*centralMoments[SS])));
        cookedMoments[YV] = transform.clipBipol(
          centralMoments[YV]/Math.max(0.0001, Math.sqrt(
            centralMoments[YY]*centralMoments[VV])));
        cookedMoments[SV] = transform.clipBipol(
          centralMoments[SV]/Math.max(0.0001, Math.sqrt(
            centralMoments[SS]*centralMoments[VV])));
        //color versus axis uses a priori moments for the deterministic axes
        cookedMoments[IY] = transform.clipBipol(
          centralMoments[IY]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[YY])));
        cookedMoments[IS] = transform.clipBipol(
          centralMoments[IS]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[SS])));
        cookedMoments[IV] = transform.clipBipol(
          centralMoments[IV]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[VV])));
        cookedMoments[JY] = transform.clipBipol(
          centralMoments[JY]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[YY])));
        cookedMoments[JS] = transform.clipBipol(
          centralMoments[JS]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[SS])));
        cookedMoments[JV] = transform.clipBipol(
          centralMoments[JV]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[VV])));
        return cookedMoments;
    };
    calc.nDims = nDims;
    calc.nState = nState;
    return calc;
};
module.exports = new Map([
  ["Moment", Moment],
  ["AvgColor", AvgColor]
]);

import *  as transform from '../../lib/transform'

export function RandomFilter({
    PIXELDIM=64,
    LAYER1SIZE=200,
    LAYER2SIZE=15,
  }) {
    const PIXELCOUNT = PIXELDIM*PIXELDIM;
    let nDims = 15;

    const layer1 = new Float32Array(nDims);

    function calc(pixels) {
        for (let i = 0; i < nDims; i++) {
            rawSums[i]=0.0;
        }
        for (let j = 0; j < PIXELDIM; j++) {
            for (let i = 0; i < PIXELDIM; i++) {
                let ij = (PIXELDIM * j + i) * 4;//pixel offset
                // first we tranform RGB to YSV
                // - effectively a PCA of the color vectors
                // otherwise we are measuring mostly brightness.
                ysvij[0] = ( //Y
                      0.00117255*pixels[ij]
                    + 0.00230200*pixels[ij+1]
                    + 0.00044706*pixels[ij+2]
                );
            }
        }

        cookedMoments[Y] = transform.linBipol(0.4, 0.6, centralMoments[Y]);
        return cookedMoments;
    };
    return {
      fn: calc,
      keys: [
        'video-randfilt-1',
      ],
      names: [
        '●',
      ]
    }
};

export function Moment({PIXELDIM=64}) {
    // Gives us moment estimates by the plugin method
    // right now, 1st and 2nd central moments
    // a.k.a. mean and covariance
    // TODO: check that all variances are correctly normalised
    // Occasionally they seem to be outside of [0,1]
    const PIXELCOUNT=PIXELDIM*PIXELDIM;
    let nDims=60;
    // I call the YCbCr mapped version "YSV", the spatial coords "IJ"
    // This is very confusing.
    let Y=0, S=1, V=2;
    let IY=3, IS=4, IV=5;
    let JY=6, JS=7, JV=8;
    let YY=9, YS=10, YV=11, SS=12, SV=13, VV=14;

    const rawSums = new Float32Array(15);
    const centralMoments = new Float32Array(15);
    const cookedMoments = new Float32Array(15);
    const prevCookedMoments = new Float32Array(15);
    const ysvij = new Float32Array(5);
    const cookedDeltaMoments = new Float32Array(60);
    let lastTime = performance.now()
    let thisTime = performance.now()

    function calc(pixels) {
        for (let i = 0; i < 15; i++) {
            rawSums[i]=0.0;
        }
        for (let j = 0; j < PIXELDIM; j++) {
            for (let i = 0; i < PIXELDIM; i++) {
                let ij = (PIXELDIM * j + i) * 4;//pixel offset
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
        cookedMoments[YS] = transform.clip1(
          centralMoments[YS]/Math.max(0.0001, Math.sqrt(
            centralMoments[YY]*centralMoments[SS])));
        cookedMoments[YV] = transform.clip1(
          centralMoments[YV]/Math.max(0.0001, Math.sqrt(
            centralMoments[YY]*centralMoments[VV])));
        cookedMoments[SV] = transform.clip1(
          centralMoments[SV]/Math.max(0.0001, Math.sqrt(
            centralMoments[SS]*centralMoments[VV])));
        //color versus axis uses a priori moments for the deterministic axes
        cookedMoments[IY] = transform.clip1(
          centralMoments[IY]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[YY])));
        cookedMoments[IS] = transform.clip1(
          centralMoments[IS]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[SS])));
        cookedMoments[IV] = transform.clip1(
          centralMoments[IV]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[VV])));
        cookedMoments[JY] = transform.clip1(
          centralMoments[JY]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[YY])));
        cookedMoments[JS] = transform.clip1(
          centralMoments[JS]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[SS])));
        cookedMoments[JV] = transform.clip1(
          centralMoments[JV]/Math.max(0.0001, Math.sqrt(
            0.08333333333*centralMoments[VV])));
        thisTime = performance.now()
        let deltaTimeS = (thisTime - lastTime)/1000;
        for (let i = 0; i < 15; i++) {
            cookedDeltaMoments[i] = cookedMoments[i];
            cookedDeltaMoments[i+15] = transform.clip1(
              0.25 * (
                cookedMoments[i] - prevCookedMoments[i]
              ) / deltaTimeS
            );
            cookedDeltaMoments[i+30] = 2 * Math.pow(
                cookedDeltaMoments[i+15], 2
            ) - 1;
            cookedDeltaMoments[i+45] = transform.saturate(
              cookedDeltaMoments[i+45] +
              cookedMoments[i] * deltaTimeS * 0.0625
            )

        }

        // Reset for next iteration
        lastTime = thisTime;
        for (let i = 0; i < 15; i++) {
            prevCookedMoments[i] = cookedMoments[i];
        }
        return cookedDeltaMoments;
    };

    return {
      fn: calc,
      keys: [
        'video-moment-0001',
        'video-moment-0002',
        'video-moment-0003',
        'video-moment-0010',
        'video-moment-0011',
        'video-moment-0012',
        'video-moment-0013',
        'video-moment-0014',
        'video-moment-0015',
        'video-moment-0004',
        'video-moment-0007',
        'video-moment-0008',
        'video-moment-0005',
        'video-moment-0009',
        'video-moment-0006',
        'video-moment-0016',
        'video-moment-0017',
        'video-moment-0018',
        'video-moment-0025',
        'video-moment-0026',
        'video-moment-0027',
        'video-moment-0028',
        'video-moment-0029',
        'video-moment-0030',
        'video-moment-0019',
        'video-moment-0022',
        'video-moment-0023',
        'video-moment-0020',
        'video-moment-0024',
        'video-moment-0021',
        'video-moment-0031',
        'video-moment-0032',
        'video-moment-0033',
        'video-moment-0040',
        'video-moment-0041',
        'video-moment-0042',
        'video-moment-0043',
        'video-moment-0044',
        'video-moment-0045',
        'video-moment-0034',
        'video-moment-0037',
        'video-moment-0038',
        'video-moment-0035',
        'video-moment-0039',
        'video-moment-0036',
        'video-moment-0046',
        'video-moment-0047',
        'video-moment-0048',
        'video-moment-0055',
        'video-moment-0056',
        'video-moment-0057',
        'video-moment-0058',
        'video-moment-0059',
        'video-moment-0060',
        'video-moment-0049',
        'video-moment-0052',
        'video-moment-0053',
        'video-moment-0050',
        'video-moment-0054',
        'video-moment-0051',
      ],
      // I call the YCbCr mapped version "YSV", the spatial coords "IJ"
      // This is very confusing.
      names: [
        'Bright',
        'Blue',
        'Red',
        'Right⌑Bright',
        'Right⌑Blue',
        'Right⌑Red',
        'Up⌑Bright',
        'Up⌑Blue',
        'Up⌑Red',
        'Bright²',
        'Bright⌑Blue',
        'Bright⌑Red',
        'Blue²',
        'Blue⌑Red',
        'Red²',
        '∆Bright',
        '∆Blue',
        '∆Red',
        '∆Right⌑Bright',
        '∆Right⌑Blue',
        '∆Right⌑Red',
        '∆Up⌑Bright',
        '∆Up⌑Blue',
        '∆Up⌑Red',
        '∆Bright²',
        '∆Bright⌑Blue',
        '∆Bright⌑Red',
        '∆Blue²',
        '∆Blue⌑Red',
        '∆Red²',
        '(∆Bright)²',
        '(∆Blue)²',
        '(∆Red)²',
        '(∆Right⌑Bright)²',
        '(∆Right⌑Blue)²',
        '(∆Right⌑Red)²',
        '(∆Up⌑Bright)²',
        '(∆Up⌑Blue)²',
        '(∆Up⌑Red)²',
        '(∆Bright²)²',
        '(∆Bright⌑Blue)²',
        '(∆Bright⌑Red)²',
        '(∆Blue²)²',
        '(∆Blue⌑Red)²',
        '(∆Red²)²',
        '∫Bright',
        '∫Blue',
        '∫Red',
        '∫Right⌑Bright',
        '∫Right⌑Blue',
        '∫Right⌑Red',
        '∫Up⌑Bright',
        '∫Up⌑Blue',
        '∫Up⌑Red',
        '∫Bright²',
        '∫Bright⌑Blue',
        '∫Bright⌑Red',
        '∫Blue²',
        '∫Blue⌑Red',
        '∫Red²',
      ]
    }
};

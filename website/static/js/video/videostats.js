//Video Statistics
//pump pixels in at regular intervals, and send back pubsub notifications
//This should probably be refactored to run in a webworker.
(function( global ) {
    'use strict';
    var Covariance, Statistic;

    var Statistic = function (params) {
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        self.prefix = self.baseprefix;
        self.pubsub = params.pubsub;
        self.lastFrameTime = Date.now();
        self.lastFrameDur = 1.0;
        self.calcTime = 1.0;
        self.thisFrameTime = Date.now();

        self.attach = function(analyzer) {
            self.analyzer = analyzer;
            self.prefix = analyzer.prefix + '/' + self.baseprefix;
            self.pubsub = analyzer.pubsub;
        }

        self.emitStats = function(prefix, stats) {
            self.pubsub.publish(self.prefix + "/raw", stats);
        }
        self.analyzeFrame = function (pixels) {
            var endTime, startTime = Date.now();
            //we need to know how often we are being called:
            self.lastFrameDur = startTime - self.lastFrameTime;
            self.emitStats("raw", self.doCalcs(pixels));
            endTime = Date.now();
            self.lastFrameTime = startTime;
            //just for seeing how expensive this is:
            self.calcTime = endTime - startTime;
        }
    };
    var Covariance = function (params) {
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        Statistic.call(this, params); //super constructor
        self.baseprefix = typeof params.prefix !== 'undefined' ? params.prefix : "covariance";
        self.mean = [0,0,0];
        self.deltaMean = [0,0,0];
        self.variance = [1,1,1,0,0,0,0,0,0,0,0,0];
        self.deltaVariance = [1,1,1,0,0,0,0,0,0,0,0,0];
        self.corr = [0,0,0,0,0,0,0,0,0];
        self.deltaCorr = [0,0,0,0,0,0,0,0,0];

        self.doCalcs = function (pixels) {
            //calculate variances for all params
            //IDEA: partial variances
            //IDEA: higher moments?
            var cw=self.analyzer.cw, ch=self.analyzer.ch;
            var pixelCount=cw*ch;
            var rsum=0, gsum=0, bsum=0;
            var r2sum=0, g2sum=0, b2sum=0;
            var rgsum=0, gbsum=0, rbsum=0;
            var rxsum=0, gxsum=0, bxsum=0;
            var rysum=0, gysum=0, bysum=0;
            var xsum=pixelCount*0.5;
            var ysum=pixelCount*0.5;
            var x2sum=pixelCount/3;
            var y2sum=pixelCount/3;
            var rmean, gmean, bmean;
            var rvar, gvar, bvar;
            var rgvar, gbvar, rbvar;
            var rxvar, gxvar, bxvar;
            var ryvar, gyvar, byvar;
            var rgcorr, gbcorr, rbcorr;
            var rxcorr, gxcorr, bxcorr;
            var rycorr, gycorr, bycorr;
            var rsd, gsd, bsd, xsd=1/Math.sqrt(12), ysd=1/Math.sqrt(12);
            var lastMean,lastVariance, lastCorr;
            var tmpDeltaVariance=[], tmpDeltaCorr=[];

            for (var i = 0; i < pixelCount; i++) {
                // or sample random pixels:
                // xpix = Math.random() * cw | 0;
                // ypix = Math.random() * ch | 0;
                // i = y * cw + x;
                var r, g, b, offset, x, y;
                offset = i *4;
                x = (i % cw)/(cw-1);
                y = Math.floor(i/cw)/(ch-1);
                r = pixels[offset]/255;
                g = pixels[offset+1]/255;
                b = pixels[offset+2]/255;
                rsum += r;
                gsum += g;
                bsum += b;
                r2sum += r*r;
                g2sum += g*g;
                b2sum += b*b;
                rgsum += r*g;
                gbsum += g*b;
                rbsum += r*b;
                rxsum += r*x;
                rysum += r*y;
                gxsum += g*x;
                gysum += g*y;
                bxsum += b*x;
                bysum += b*y;
            }
            rmean = rsum / pixelCount;
            gmean = gsum / pixelCount;
            bmean = bsum / pixelCount;
            rvar = (r2sum - rsum*rsum/pixelCount)/pixelCount;
            gvar = (g2sum - gsum*gsum/pixelCount)/pixelCount;
            bvar = (b2sum - bsum*bsum/pixelCount)/pixelCount;
            rgvar = (rgsum - rsum*gsum/pixelCount)/pixelCount;
            gbvar = (gbsum - gsum*bsum/pixelCount)/pixelCount;
            rbvar = (rbsum - rsum*bsum/pixelCount)/pixelCount;
            rxvar = (rxsum - rsum*xsum/pixelCount)/pixelCount;
            ryvar = (rysum - rsum*ysum/pixelCount)/pixelCount;
            gxvar = (gxsum - gsum*xsum/pixelCount)/pixelCount;
            gyvar = (gysum - gsum*ysum/pixelCount)/pixelCount;
            bxvar = (bxsum - bsum*xsum/pixelCount)/pixelCount;
            byvar = (bysum - bsum*ysum/pixelCount)/pixelCount;
            rsd = Math.sqrt(rvar);
            gsd = Math.sqrt(gvar);
            bsd = Math.sqrt(bvar);
            rgcorr = rgvar/(rsd*gsd);
            gbcorr = gbvar/(gsd*bsd);
            rbcorr = rbvar/(rsd*bsd);
            rxcorr = rxvar/(rsd*xsd);
            rycorr = ryvar/(rsd*ysd);
            gxcorr = gxvar/(gsd*xsd);
            gycorr = gyvar/(gsd*ysd);
            bxcorr = bxvar/(bsd*xsd);
            bycorr = byvar/(bsd*ysd);

            lastMean = self.mean;
            self.mean = [rmean, gmean, bmean];
            for (var i = 0; i < 3; i++) {
                self.deltaMean[i] = (
                    self.mean[i] - lastMean[i]
                )/self.lastFrameDur * 30000; //arbitrary normalisation const
            }

            lastVariance = self.variance;
            self.variance = [
                rvar, gvar, bvar,
                rgvar, gbvar, rbvar,
                rxvar, ryvar, gxvar, gyvar, bxvar, byvar];
            for (var i = 0; i < 12; i++) {
                tmpDeltaVariance[i] = (
                    self.variance[i] - lastVariance[i]
                )/self.lastFrameDur * 300000; //arbitrary normalisation const
            }
            lastCorr = self.corr;
            self.corr = [
                rgcorr, gbcorr, rbcorr,
                rxcorr, rycorr, gxcorr, gycorr, bxcorr, bycorr];
            for (var i = 0; i < 9; i++) {
                tmpDeltaCorr[i] = (
                    self.corr[i] - lastCorr[i]
                )/self.lastFrameDur * 30000;
            }
            //Hack to stop null deltas when we look at the same frame twice
            if (!tmpDeltaCorr.every(function(i){return i==0})) {
                self.deltaVariance = tmpDeltaVariance;
                self.deltaCorr = tmpDeltaCorr;
            }
            return (self.mean.concat( self.variance, self.deltaVariance));
        }
    };
    // agglomerative hierarchical clustering
    // because I looked at ColorThief which is fast and gives nice results
    // but the API was chaos and buggy
    // NB this algorithm should probably terminate EARLIER
    // and take fewer averages.
    var DominantColor = function (params) {
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        self.nColors = typeof params.nColors !== 'undefined' ? params.nColors : 8;
        self.maxPoints = typeof params.maxPoints !== 'undefined' ? params.maxPoints : 256;
        self.baseprefix = typeof params.prefix !== 'undefined' ? params.prefix : "dominantcolor";
        Statistic.call(this, params); //super constructor
        self.doCalcs = function (pixels) {
            //could possibly optimise this by not reallocating arrays all the time.
            var pixelCount = self.analyzer.cw * self.analyzer.ch;
            var nColors = self.nColors, maxPoints = self.maxPoints;
            var subSample = pixelCount/maxPoints;
            var out = new Array(nColors*4);
            var quantum = 1/maxPoints;
            // could track location and spread of colors also.
            var colorsCounts, pointers, dists;
            colorsCounts = new Array(maxPoints);
            dists = new Array(maxPoints);
            for (var i = 0; i < maxPoints; i++) {
                var offset = Math.floor(i * subSample * 4);
                colorsCounts[i] = [
                    pixels[offset]/255,
                    pixels[offset+1]/255,
                    pixels[offset+2]/255,
                    quantum
                ];
            };
            //initialise dist matrix
            for (var i = 0; i < maxPoints; i++) {
                dists[i] = new Array(maxPoints-1-i);
                for (var j=0; j<i; j++) {
                    var dist = 0;
                    for (var k=0; k<3; k++) {
                        var del = colorsCounts[i][k]-colorsCounts[j][k];
                        dist += del*del;
                    }
                    dists[j][i] = dist;
                }
            }
            for (var l=0; l<maxPoints-nColors;l++) {
                var minI, minJ, smallestDist=1000, newCenter;
                var lastPointer = maxPoints-l-1;
                var countI, countJ, countIJ;
                //find closest two centers:
                for (var i = 1; i < maxPoints-l; i++) {
                    for (var j=0; j<i; j++) {
                        var thisDist = dists[j][i];
                        if (thisDist<smallestDist) {
                            smallestDist = thisDist;
                            minI = i;
                            minJ = j;
                        }
                    }
                };
                newCenter = new Array(4);
                countI = colorsCounts[minI][3];
                countJ = colorsCounts[minJ][3];
                countIJ = countI + countJ;
                newCenter[0] = (
                    countJ * colorsCounts[minJ][0] +
                    countI * colorsCounts[minI][0]
                )/ (countIJ);
                newCenter[1] = (
                    countJ * colorsCounts[minJ][1] +
                    countI * colorsCounts[minI][1]
                )/ (countIJ);
                newCenter[2] = (
                    countJ * colorsCounts[minJ][2] +
                    countI * colorsCounts[minI][2]
                )/ (countIJ);
                newCenter[3] = (
                    countIJ
                );
                colorsCounts[minJ] = newCenter;
                //copy entry in from end of array
                colorsCounts[minI] = colorsCounts[lastPointer];
                // Now we have updated 2 entries,
                // so update all related distances.
                // Could iterate more efficiently here
                for (var i = 1; i < maxPoints-l; i++) {
                    for (var j=0; j<i; j++) {
                        if (i===minI || j===minJ || j===minI || i===minJ){
                            var dist = 0, del;
                            for (var k=0; k<3; k++) {
                                del = colorsCounts[i][k]-colorsCounts[j][k];
                                dist += del*del;
                            };
                            dists[j][i] = dist;
                        };
                    };
                };
            };
            //sort in desc frequency order
            colorsCounts = colorsCounts.slice(0,nColors);
            colorsCounts.sort(function (a, b) { return b[3]-a[3]});
            //if (Math.random()<0.02) console.debug(colorsCounts);

            for (var i=0;i<nColors;i++) {
                var offset = i*4;
                out[offset] = colorsCounts[i][0];
                out[offset+1] = colorsCounts[i][1];
                out[offset+2] = colorsCounts[i][2];
                out[offset+3] = colorsCounts[i][3];
            };
            return out;
        }
    };

    // expose our module to the global object
    global.videostatistics = {
        Statistic: Statistic,
        Covariance: Covariance,
        DominantColor: DominantColor,
    };
})( this );

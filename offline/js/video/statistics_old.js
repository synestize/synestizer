
(function(window, _, Rx) {
    'use strict';
    var Covariance, Statistic, DominantColor, AverageColor;

    Statistic = function (params) {
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        self.prefix = self.baseprefix;
        self.pubsub = params.pubsub;
        //to be overridden in subclasses
        self.nDims = self.rawStats.size;
        
        self.attach = function(analyzer) {
            self.analyzer = analyzer;
            self.prefix = analyzer.prefix + '/' + self.baseprefix;
            self.pubsub = analyzer.pubsub;
        }

        self.emitStats = function(prefix, stats) {
            for (var i = 0; i < self.rawStats.length; i++) {
                self.pubsub.publish(self.prefix + prefix + "/"+i, stats[i]);
            };
            self.pubsub.publish(self.prefix + prefix + "/vec", stats);
        }

        self.analyzeFrame = function (pixels) {
            self.lastRawStats = self.rawStats.slice(); //copy for safety
            self.rawCalcs(pixels);
            self.deltaCalcs();
            self.emitStats("/val", self.rawStats);
            self.emitStats("/delta", self.deltaStats);
        };
    };
    Covariance = function (params) {
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        self.baseprefix = typeof params.prefix !== 'undefined' ? params.prefix : "covariance";
        self.mean = [0,0,0];
        self.variance = [1,1,1,0,0,0,0,0,0,0,0,0];
        self.normCorr = [0,0,0,0,0,0,0,0,0];
        self.rawStats = [0,0,0,0,0,0,0,0,0,0,0,0];
        self.deltaStats = [0,0,0,0,0,0,0,0,0,0,0,0];
        Statistic.call(this, params); //super constructor
        
        self.rawCalcs = function (pixels) {
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
            self.mean = [rmean, gmean, bmean];
            self.variance = [
                rvar, gvar, bvar,
                rgvar, gbvar, rbvar,
                rxvar, ryvar, gxvar, gyvar, bxvar, byvar];
            self.normCorr = [
                rgcorr/2+0.5, gbcorr/2+0.5, rbcorr/2+0.5,
                rxcorr/2+0.5, rycorr/2+0.5, gxcorr/2+0.5,
                gycorr/2+0.5, bxcorr/2+0.5, bycorr/2+0.5];
            self.rawStats = self.mean.concat( self.normCorr);
            return self.rawStats;
        }
    };
    // agglomerative hierarchical clustering
    // because I looked at ColorThief which is fast and gives nice results
    // but the API was chaos and buggy
    // NB this algorithm should probably terminate EARLIER
    // and take fewer averages.
    DominantColor = function (params) {
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        self.nColors = typeof params.nColors !== 'undefined' ? params.nColors : 8;
        self.maxPoints = typeof params.maxPoints !== 'undefined' ? params.maxPoints : 256;
        self.baseprefix = typeof params.prefix !== 'undefined' ? params.prefix : "dominantcolor";
        self.rawStats = new Array(nColors*4);
        self.lastRawStats = new Array(nColors*4);
        self.deltaStats = new Array(nColors*4);
        Statistic.call(this, params); //super constructor
        
        for (var i = 0; i < maxPoints*4; i++) {
            self.rawStats[i] = 0.5;
            self.lastRawStats[i] = 0.5;
            self.deltaStats[i] = 0.5;
        };
        self.rawCalcs = function (pixels) {
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

            for (var i=0;i<nColors;i++) {
                var offset = i*4;
                out[offset] = colorsCounts[i][0];
                out[offset+1] = colorsCounts[i][1];
                out[offset+2] = colorsCounts[i][2];
                out[offset+3] = colorsCounts[i][3];
            };
            self.rawStats = out;
            return out;
        }
    };


    AverageColor = function (params) {
        var self = this;
        params = typeof params !== 'undefined' ? params : {};
        self.baseprefix = typeof params.prefix !== 'undefined' ? params.prefix : "averagecolor";
        self.rawStats = [0.5, 0.5, 0.5];
        self.lastRawStats = [0.5, 0.5, 0.5];
        self.deltaStats = [0.0, 0.0, 0.0];
        
        Statistic.call(this, params); //super constructor
        
        self.rawCalcs = function (pixels) {
            
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

            self.rawStats = out;
            return out;
        }
    };

    // expose our module to the global object
    global.videostatistics = {
        Covariance: Covariance,
        DominantColor: DominantColor,
        AverageColor: AverageColor
    };
})(this, _, Rx);

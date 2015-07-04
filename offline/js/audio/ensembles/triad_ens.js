/*
Players make sound
*/

(function(window, _, d3, WX){
    'use strict';
    var instruments;
    window.ensembles = ensembles = window.ensembles || {};
    ensembles.TriadEnsemble = function (name) {
        var triadSynth;
        var lfoRateScale, freqScale, freqModScale;
        var paramSet, controlStream;
        var controlMeta;
        
        lfoRateScale = d3.scale.linear().domain([0,1]).range([0, 20]);
        freqModScale = d3.scale.pow().domain([0,1]).range([0, 650]).exponent(2);
        //nb we want exp scales instead of log scales, so we invert
        freqScale = d3.scale.log().range([0,1]).domain([200, 2000]).invert;
        
        controlMeta = {
            outputGain: {
                scale: d3.scale.log().domain([0.01,1]).range([0,1]).invert,
                units: "",
                default: 0.5
            },
            lfo1Rate: {
                scale: lfoRateScale,
                units: "Hz",
                default: 0.7
            },
            freq1: {
                scale: freqScale,
                units: "Hz",
                default: 0.0
            },
            freq1Mod: {
                scale: freqModScale,
                units: "Hz",
                default: 0.0
            },
            lfo2Rate: {
                scale: lfoRateScale,
                units: "Hz",
                default: 0.7
            },
            freq2: {
                scale: freqModScale,
                units: "Hz",
                default: 0.0
            },
            freq2Mod: {
                scale: freqScale,
                units: "Hz",
                default: 0.0
            },
            lfo3Rate: {
                scale: lfoRateScale,
                units: "Hz",
                default: 0.7
            },
            freq3: {
                scale: freqScale,
                units: "Hz",
                default: 0.0
            },
            freq3Mod: {
                scale: freqModScale,
                units: "Hz",
                default: 0.0
            },
        };
            
        function setParamSet(newParamSet) {
            paramSet = newParamSet;
            controlStream = paramSet.paramValsStream;
            //keep streams for each param
            paramSet.getMappedStream("freq1").subscribe(function(x){
                triadSynth.$oscFreq1(x+paramSet.getMapped("freq1Mod"), 0.1, 1);
            });
            paramSet.getMappedStream("freq1Mod").subscribe(function(x){
                triadSynth.$oscFreq1(x+paramSet.getMapped("freq1"), 0.1, 1);
            });
            paramSet.getMappedStream("lfo1Rate").subscribe(function(x){
                triadSynth.$lfoRate1(x, 0.1, 1);
            });
            paramSet.getMappedStream("freq2").subscribe(function(x){
                triadSynth.$oscFreq2(x+paramSet.getMapped("freq2Mod"), 0.1, 1);
            });
            paramSet.getMappedStream("freq2Mod").subscribe(function(x){
                triadSynth.$oscFreq2(x+paramSet.getMapped("freq2"), 0.1, 1);
            });
            paramSet.getMappedStream("lfo2Rate").subscribe(function(x){
                triadSynth.$lfoRate2(x, 0.1, 1);
            });
            paramSet.getMappedStream("freq3").subscribe(function(x){
                triadSynth.$oscFreq3(x+paramSet.getMapped("freq3Mod"), 0.1, 1);
            });
            paramSet.getMappedStream("freq3Mod").subscribe(function(x){
                triadSynth.$oscFreq3(x+paramSet.getMapped("freq3"), 0.1, 1);
            });
            paramSet.getMappedStream("lfo3Rate").subscribe(function(x){
                triadSynth.$lfoRate3(x, 0.1, 1);
            });
            paramSet.getMappedStream("outputGain").subscribe(function(x){
                triadSynth.$output(x, 0.1, 1);
            });
        };
        triadSynth = WX.Triad();
        triadSynth.to(WX.Master);
        
        return {
            name: name,
            _debug: function() {return mappedControlStreams},
            controlMeta: controlMeta,
            controlStream: controlStream,
            setParamSet: setParamSet,
            destroy: function () {},
        };
    };
})(window, _, d3, WX);

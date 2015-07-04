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
        var controlStream, mappedControlStreams;
        var controlMeta;
        
        lfoRateScale = d3.scale.linear().domain([0,1]).range([0, 20]);
        freqModScale = d3.scale.pow().domain([0,1]).range([0, 650]).exponent(2);
        //nb we want exp scales instead of log scales, so we invert
        freqScale = d3.scale.log().range([0,1]).domain([200, 2000]).invert;
        
        controlMeta = {
            outputGain: {
                scale: d3.scale.log().domain([0.0001,1]).range([0,1]).invert,
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
            
        function setControlStream (stream) {
            controlStream = stream;
            mappedControlStreams = window.ensembles.mappedStreams(
                controlStream, controlMeta);
            mappedControlStreams.freq1.subscribe(function(x){
                triadSynth.$oscFreq1(x, WX.now + 0.02, 0);
            });
            mappedControlStreams.freq1Mod.subscribe(function(x){
                triadSynth.$oscFreq1Mod(x, WX.now, 0);
            });
            mappedControlStreams.freq1.subscribe(function(x){
                triadSynth.$oscFreq2(x, WX.now + 0.02, 0);
            });
            mappedControlStreams.freq1Mod.subscribe(function(x){
                triadSynth.$oscFreq2Mod(x, WX.now, 0);
            });
            mappedControlStreams.freq1.subscribe(function(x){
                triadSynth.$oscFreq3(x, WX.now + 0.02, 0);
            });
            mappedControlStreams.freq1Mod.subscribe(function(x){
                triadSynth.$oscFreq3Mod(x, WX.now, 0);
            });
            mappedControlStreams.outputGain.subscribe(function(x){
                triadSynth.$output(x, WX.now, 0);
            });
        };
        triadSynth = WX.Triad();
        triadSynth.to(WX.Master);
        
        return {
            name: name,
            _debug: function() {return mappedControlStreams},
            controlMeta: controlMeta,
            controlStream: controlStream,
            setControlStream: setControlStream,
            destroy: function () {},
        };
    };
})(window, _, d3, WX);

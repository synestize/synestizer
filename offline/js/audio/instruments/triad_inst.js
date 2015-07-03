/*
Players make sound
*/

(function(window, _, d3, WX){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    instruments.TriadInst = function (name) {
        var triadSynth;
        var lfoRateScale, freqScale, freqModScale;
        var controlStream, mappedControlStreams;
        var controlMeta;
        
        lfoRateScale = d3.scale.linear().range([0, 20]);
        freqModScale = d3.scale.pow().range([0, 650]).exponent(2);
        freqScale = d3.scale.log().range([200, 2000]);
        
        controlMeta = {
            gain: {
                scale: d3.scale.log().range([0.001,1]),
                units: "",
                default: 0.1
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
            mappedControlStreams = window.instruments.mappedStreams(
                controlStream, controlMeta);
            mappedControlStreams.freq1.subscribe(function(x){
                console.debug('freq1', x);
                triadSynth.$freq1(x, WX.now + 0.02, 0);
            });
            mappedControlStreams.freq1Mod.subscribe(function(x){
                console.debug('freq1Mod', x);
                triadSynth.$freq1mod(x, WX.now, 0);
            });
            mappedControlStreams.freq1.subscribe(function(x){
                console.debug('freq2', x);
                triadSynth.$freq1(x, WX.now + 0.02, 0);
            });
            mappedControlStreams.freq1Mod.subscribe(function(x){
                console.debug('freq2Mod', x);
                triadSynth.$freq1mod(x, WX.now, 0);
            });
            mappedControlStreams.freq1.subscribe(function(x){
                console.debug('freq3', x);
                triadSynth.$freq1(x, WX.now + 0.02, 0);
            });
            mappedControlStreams.freq1Mod.subscribe(function(x){
                console.debug('freq3Mod', x);
                triadSynth.$freq1mod(x, WX.now, 0);
            });
            mappedControlStreams.gain.subscribe(function(x){
                console.debug('gain', x);
                triadSynth.$output(x, WX.now, 0);
            });
        };
        console.debug("synth_1", triadSynth);
        triadSynth = WX.Triad();
        triadSynth.to(WX.Master);
        console.debug("synth_2", triadSynth);
        
        return {
            name: name,
            _debug: triadSynth,
            controlMeta: controlMeta,
            controlStream: controlStream,
            setControlStream: setControlStream,
            destroy: function () {},
        };
    };
})(window, _, d3, WX);

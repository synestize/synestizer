/*
Ensembles make sound
*/

(function(global, _, d3){
    'use strict';
    var ensembles;
    global.ensembles = ensembles = global.ensembles || {};
    ensembles.FMScapeEnsemble = function (name, context) {
        var seq;
        var paramSet, controlStream;
        var controlMeta;
        var lineOut;
        
        lineOut = new WebAudiox.LineOut(context);
        seq = audio.BeatScheduler({}, function(){});
        
        
        controlMeta = {
            outputGain: {
                scale: d3.scale.log().clamp(true).domain([0.0001,0.33]).range([0,1]).invert,
                units: "",
                default: 0.5
            },
            tempo: {
                scale: d3.scale.log().clamp(true).domain([0.5,4]).range([0,1]).invert,
                units: "Hz",
                default: 0.7
            },
        };
            
        function setParamSet(newParamSet) {
            paramSet = newParamSet;
            controlStream = paramSet.paramValsStream;
            //keep streams for each param
            paramSet.getMappedStream("tempo").subscribe(function(x){
                seq.tempo(x);
            });
            paramSet.getMappedStream("outputGain").subscribe(function(x){
                lineOut.volume = x;
            });
        };
        
        return {
            name: name,
            _debug: function() {return mappedControlStreams},
            controlMeta: controlMeta,
            controlStream: controlStream,
            setParamSet: setParamSet,
            destroy: function () {},
            seq: seq,
        };
    };
})(this, _, d3);

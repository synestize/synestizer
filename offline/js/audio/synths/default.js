/*
State models reflect the current state of the model
*/

(function(window, _){
    'use strict';
    var synths;
    window.synths = synths = window.synths || {};
    synths.defaultOptions = {
        sustain: 1,
        pitch: 60,
        tempo: 1,
    }
    synths.Default = function(ctx, startTime, options) {
        var oscnode, envnode, out;
        options = _.extend(synths.defaultOptions, options);
        out = options.out || ctx.destination;
        envnode = cts.createGain();
        envnode.gain.value = 0;
        oscnode = context.createOscillator();
        oscnode.connect(envnode);
        oscnode.type = vco.SINE;
        oscnode.frequency.value = this.frequency;
        oscnode.start(startTime || 0);
        return
    }

})(window, _);

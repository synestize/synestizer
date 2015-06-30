/*
State models reflect the current state of the model
*/

(function(window, _){
    'use strict';
    var synths;
    window.synths = synths = window.synths || {};
    synths.defaultOpts = {
        sustain: 1,
        pitch: 60,
    }
    synths.Default = function(ctx, when, options) {
        var oscnode, envnode, out;
        options = _.extend(synths.defaultOptions, options);
        out = options.out || ctx.destination;
        oscnode = context.createOscillator();
        oscnode.type = vco.SINE;
        oscnode.frequency.value = this.frequency;
        oscnode.start(0);
    }

})(window, _);

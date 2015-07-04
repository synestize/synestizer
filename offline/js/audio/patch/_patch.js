// Patches
// wires up staistics and synthesis using code
// We would ideally like to be able to *save* patches
(function( global, _, Rx ) {
    'use strict';
    var patch; 
    window.patch = patch = window.patch || {};

    function basic(videoPixels, controlSidebar) {
        var triadEnsembleParamSet;
        var triadEnsembleView;
        var triadEnsemble;
        var statsStreamer;
        
        var self = {
        };
        statsStreamer = video.StatsStreamer(videoPixels, {
            avg: video.AverageColor(),
            cov: video.Covariance(),
        });
        triadEnsemble = ensembles.TriadEnsemble("triad1");
        triadEnsembleParamSet = ensembles.EnsembleParamSet(
            triadEnsemble);
        triadEnsembleView = ensembles.EnsembleView(
            triadEnsembleParamSet,
            controlSidebar
        );
        
        return self;
    };

    // expose our module to the global object
    global.patch.basic = basic;
})( this, _, Rx );
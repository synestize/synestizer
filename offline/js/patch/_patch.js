// Patches
// wires up staistics and synthesis using code
// We would ideally like to be able to *save* patches
(function( global, _, Rx ) {
    'use strict';
    var patch; 
    window.patch = patch = window.patch || {};

    function basic_triad(videoPixels, controlSidebar, statsSidebaar) {
        //simple example patch
        var triadEnsembleParamSet;
        var triadEnsembleView;
        var triadEnsemble;
        var statsStreamer;
        var plotStats;
        var self 
        
        statsStreamer = videoanalysis.StatsStreamer(videoPixels, {
            avg: videoanalysis.AverageColor(),
            cov: videoanalysis.PluginMoments(),
        });
        plotStats = videoanalysis.statsPlotter(statsSidebaar);
        statsStreamer.statsStream.subscribe(plotStats);
        statsStreamer.statsStream.pluck("cov").throttleFirst(1000).subscribe(
            function(x){console.debug(x)});
        triadEnsemble = ensembles.TriadEnsemble("triad1");
        triadEnsembleParamSet = ensembles.EnsembleParamSet(
            triadEnsemble);
        triadEnsembleView = ensembles.EnsembleView(
            triadEnsembleParamSet,
            controlSidebar
        );
        self = {
                    statsStreamer: statsStreamer,
                    plotStats: plotStats,
                    triadEnsembleParamSet:triadEnsembleParamSet
                };
        return self;
    };

    // expose our module to the global object
    global.patch.basic_triad = basic_triad;
})( this, _, Rx );
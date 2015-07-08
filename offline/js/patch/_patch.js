// Patches
// wires up staistics and synthesis using code
// We would ideally like to be able to *save* patches
(function( global, _, Rx ) {
    'use strict';
    var patch; 
    window.patch = patch = window.patch || {};

    function loadPatch(patchData, videoPixels, controlSidebar, statsSidebaar) {
        var ensembles;
        var ensembleParamSets;
        var ensembleViews;
        var stats;
        var statsStreamer;
        var plotStats;
        var mappings = [];
        var self;
        var inStream;
        
        //this should load up a statsStreamer, with statistic instantiated from 
        // the string
        // so
        // { avg: ["AverageColor", {}] }
        // becomes
        // {avg: videoanalysis.AverageColor({})}
        statsStreamer = videoanalysis.StatsStreamer(videoPixels, _.mapObject(
            patchData.stats || {},
            function (statMeta, statName) {
                return videoanalysis[statMeta[0]](statMeta[1])
            }
        ));
        
        plotStats = videoanalysis.statsPlotter(statsSidebaar);
        inStream = statsStreamer.statsStream;
        inStream.subscribe(plotStats);
        
        //set up ensembles (DSP systems that know how to talk to paramsets)
        ensembles = _.mapObject(
            patchData.ensembles || {},
            function (ensClass, ensName){
                return global.ensembles[ensClass](ensName)
            }
        );
        // set up paramsets (quasi models that talk to the DSP)
        ensembleParamSets = _.mapObject(
            ensembles,
            function (ens, ensName){
                return global.ensembles.EnsembleParamSet(ens)
            }
        );
        // set up views (creation and updating of HTML to match the paramsets)
        ensembleViews = _.mapObject(
            ensembleParamSets,
            function (ensparam, ensName){
                return global.ensembles.EnsembleView(ensparam, controlSidebar);
            }
        );
        // set default values
        _.mapObject(
            patchData.defaults || {},
            function (ensDefaults, ensName){
                _.mapObject(
                    ensDefaults || {},
                    function (value, paramName){
                        ensembleParamSets[ensName].set(paramName, value)
                    }
                );
            }
        );
        
        // Next part should turn this:
        // [["cov", 1], ["triad1", "freq1"]]
        // into
        // inStream.pluck("cov", 1).subscribe(function(x){
        //      triadEnsembleParamSet.set("freq2", x)});
        _.each(patchData.mappings || [], function (mappingMeta){
            var statPath = mappingMeta[0];
            var paramPath = mappingMeta[1];
            var paramSet = ensembleParamSets[paramPath[0]];
            var paramName = paramPath[1];
            mappingMeta.push(inStream.pluck.apply(inStream, statPath).subscribe(
                function(x){
                    paramSet.set(paramName, x);
                }
            ));
            mappings.push(mappingMeta);
        });
        self = {
            statsStreamer: statsStreamer,
            plotStats: plotStats,
            mappings: mappings,
            ensembles: ensembles,
            ensembleParamSets: ensembleParamSets,
            ensembleViews: ensembleViews,
        };
        return self;
    };

    // expose our module to the global object
    global.patch.loadPatch = loadPatch;
})( this, _, Rx );
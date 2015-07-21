// Patches
// wires up staistics and synthesis using code
// We would ideally like to be able to *save* patches
(function( global, _, Rx ) {
    'use strict';
    var patch; 
    window.patch = patch = window.patch || {};

    function loadPatch(patchData, videoPixels, controlSidebar, statsSidebar, midi) {
        var ensembles;
        var ensembleParamSets;
        var ensembleViews;
        var stats;
        var statsStreamer;
        var plotStats;
        var mappings = [];
        var midiinmappings = [];
        var midioutmappings = [];
        var self;
        var statsStream;
        
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
        
        plotStats = videoanalysis.statsPlotter(statsSidebar);
        statsStream = statsStreamer.statsStream;
        statsStream.subscribe(plotStats);
        
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
                return (
                    ensembles[ensName].viewClass
                    ||global.ensembles.EnsembleView
                )(ensparam, controlSidebar);
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
        // statsStream.pluck("cov", 1).subscribe(function(x){
        //      triadEnsembleParamSet.set("freq2", x)});
        _.each(patchData.mappings || [], function (mappingMeta){
            var statPath = mappingMeta[0];
            var paramPath = mappingMeta[1];
            var paramSet = ensembleParamSets[paramPath[0]];
            var paramName = paramPath[1];
            mappings.push(statsStream.pluck.apply(statsStream, statPath).subscribe(
                function(x){
                    paramSet.set(paramName, x);
                }
            ));
        });
        // Next part should handle this:
        // [["c", 1, 6], ["triad1", "outputGain"]]
        _.each(patchData.midiin || [], function (mappingMeta){
            var midiCmd = mappingMeta[0][0];
            var midiChan = mappingMeta[0][1];
            var midiIdx = mappingMeta[0][2];
            var paramSetName = mappingMeta[1][0];
            var paramName = mappingMeta[1][1];
            var paramSet = ensembleParamSets[paramSetName];
            midiinmappings.push(
                midi.indatastream.where(function(data){
                    return (data[0]===midiCmd &&
                        data[1]===midiChan &&
                        data[2]===midiIdx)
                }).subscribe(
                    function(data){
                        paramSet.set(paramName, data[3]);
                    }
                )
            );
        });
        // Next part should handle this:
        // [["cov", 0], ["c", 1, 6]],
        _.each(patchData.midiout || [], function (mappingMeta){
            var statName = mappingMeta[0][0];
            var statIdx = mappingMeta[0][1];
            var midiCmd = mappingMeta[1][0];
            var midiChan = mappingMeta[1][1];
            var midiIdx = mappingMeta[1][2];
            midioutmappings.push(
                statsStream.pluck(
                    statName, statIdx
                ).subscribe(
                    function(x){
                        midi.outdatastream.onNext([
                            midiCmd, midiChan, midiIdx, x
                        ]);
                    }
                )
            );
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
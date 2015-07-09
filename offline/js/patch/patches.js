// Patches
// wires up staistics and synthesis using code
// We would ideally like to be able to *save* patches
(function( global, _, Rx ) {
    'use strict';
    var patch;
    var library;
    window.patch = patch = window.patch || {};
    patch.library = _.extend(patch.library||{}, {
        basic_triad: { //simple example patch
            stats: {
                avg: ["AverageColor", {}], //The hash is for stats settings
                cov: ["PluginMoments", {}]
            },
            ensembles: {
                triad1: "TriadEnsemble",
            },
            defaults: {
                triad1: {
                    outputGain: 0.0,
                    lfo3Rate: 0.5,
                }
            },
            mappings: [
                [["cov", 0], ["triad1", "freq1"]],
                [["cov", 1], ["triad1", "freq2"]],
                [["cov", 2], ["triad1", "freq3"]],
                [["cov", 3], ["triad1", "lfo1Rate"]],
                [["cov", 4], ["triad1", "lfo2Rate"]],
                [["cov", 5], ["triad1", "lfo3Rate"]],
            ]
        }
    });
})( this, _, Rx );
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
                triad2: "TriadEnsemble",
            },
            defaults: {
                triad1: {
                    outputGain: 0.0,
                    lfo3Rate: 0.5,
                },
            },
            mappings: [
                [["cov", 0], ["triad1", "freq1"]],
                [["cov", 1], ["triad1", "freq2"]],
                [["cov", 2], ["triad1", "freq3"]],
                [["cov", 3], ["triad1", "lfo1Rate"]],
                [["cov", 4], ["triad1", "lfo2Rate"]],
                [["cov", 5], ["triad1", "lfo3Rate"]],
                [["cov", 6], ["triad2", "lfo1Rate"]],
                [["cov", 7], ["triad2", "lfo2Rate"]],
                [["cov", 8], ["triad2", "lfo3Rate"]],
                [["cov", 9], ["triad2", "freq1"]],
                [["cov", 10], ["triad2", "freq2"]],
                [["cov", 11], ["triad2", "freq3"]],
            ],
            midiin: [
                [["c", 1, 6], ["triad1", "outputGain"]]
            ],
            midiout: [
                [["cov", 0], ["c", 0, 0]],
                [["cov", 1], ["c", 0, 1]],
                [["cov", 2], ["c", 0, 2]],
                [["cov", 3], ["c", 0, 3]],
                [["cov", 4], ["c", 0, 4]],
                [["cov", 5], ["c", 0, 5]],
                [["cov", 6], ["c", 0, 6]],
                [["cov", 7], ["c", 0, 7]],
                [["cov", 8], ["c", 0, 8]],
                [["cov", 9], ["c", 0, 9]],
                [["cov", 10], ["c", 0, 10]],
                [["cov", 11], ["c", 0, 11]],
                [["cov", 12], ["c", 0, 12]],
                [["cov", 13], ["c", 0, 13]],
                [["cov", 14], ["c", 0, 14]],
            ]
        }
    });
})( this, _, Rx );
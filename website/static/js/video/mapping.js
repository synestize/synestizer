// General utility functions

(function( global ) {
    'use strict';

    //constrain to [0,1]
    var clip = function(val) {
        return Math.max(0,Math.min(1,val))
    }
    //[-1,1]->[0,1]
    var symtounit = function(val) {
        return clip(0.5*val+0.5)
    }
    //map midi 69 to 440Hz
    var mtof = function (m) {
        return Math.pow(2,(m-69)/12)*440
    }
    //map 440Hz to MIDI 69
    var ftom = function (f) {
        Math.log2(f/440)*12+69
    }
    var dbtoa = function (db) {
        return Math.pow(10,db/20)
    }
    var atodb = function (a) {
        return Math.log10(a)*20
    }
    //Map 0-1 to frequency, exponentially
    var freqMap = function (val, min, max, constrain) {
        min = ftom(typeof min !== 'undefined' ? min : 100);
        max = ftom(typeof max !== 'undefined' ? max : 2000);
        constrain = typeof constrain !== 'undefined' ? constrain : 0;
        val = clip(val);
        var unrounded = val * (max - min) + min;
        //nb could fall *slightly* outside given range
        return mtof((1-constrain)*unrounded + constrain * Math.round(unrounded))
    };
    //Map 0-1 to amplitude, exponentially over 60dB
    var ampMap = function (val) {
        val = clip(val);
        return Math.min(val*100,1) * dbtoa((val-1)*60)
    };
    // expose our module to the global object
    global.mapping = {
        freqMap: freqMap,
        ampMap: ampMap,
        mtof: mtof,
        ftom: ftom,
        dbtoa: dbtoa,
        atodb: atodb,
        clip: clip,
        symtounit: symtounit,
    };
})( this );
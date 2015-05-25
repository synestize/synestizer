/*
param.js
managing synthesis parameters, their ranges and mappings, as collections of floats.
*/
(function( global ) {
    "use strict";
    var param = param || {};
    global.param = param;
    param.LinWarp = function(lo, hi) {
        var self = this;
        self.lo = typeof lo !== 'undefined' ? lo : 0.0;
        self.hi = typeof hi !== 'undefined' ? hi : 1.0;
        self.warp = function(val) { return val * (self.hi-self.lo) + self.lo}
        self.unwarp = function(val) { return (val-self.lo)/(self.hi-self.lo)}
    }
    param.Log2Warp = function(lo, hi) {
        var self = this;
        self.loglo = Math.log2(typeof lo !== 'undefined' ? lo : 0.5);
        self.loghi = Math.log2(typeof hi !== 'undefined' ? hi : 1.0);
        self.warp = function(val) { return Math.pow(
            2,
            val * (self.loghi-self.loglo) + self.loglo)}
        self.unwarp = function(val) { return (
            (Math.log2(val)-self.loglo)/
            (self.loghi-self.loglo)
        )}
    }
    param.Param = function (params) {
        params = typeof params !== 'undefined' ? params : {}
    }
    
})( this );

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
    };
    param.Log2Warp = function(lo, hi) {
        var self = this;
        self.lo = typeof lo !== 'undefined' ? lo : 0.5;
        self.hi = typeof hi !== 'undefined' ? hi : 2.0;
        self.loglo = Math.log2(self.lo);
        self.loghi = Math.log2(self.hi);
        self.warp = function(val) { return Math.pow(
            2,
            val * (self.loghi-self.loglo) + self.loglo)}
        self.unwarp = function(val) { return (
            (Math.log2(val)-self.loglo)/
            (self.loghi-self.loglo)
        )}
    };

    param.Parameter = function (params) {
        var self = this;
        params = params !== 'undefined' ? params : {};
        self.warp = params.warp || new param.LinWarp;
        self.units = params.unit ||  "";
        self.name =  params.name || "";
        self.defaultVal = params.defaultVal || self.warp.lo;
        //update rate?
        //model/member specification?
        //setter/getter for the state here?
        // i.e. is this the controller? or the factory for controllers/views?
        // or something else?
        //fluid style a la jquery?
        param.ParameterSpace.add(self);
    };
})( this );

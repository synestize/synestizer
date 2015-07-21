(function(window, _, d3){
    'use strict';
    var scaling;
    window.scaling = scaling = window.scaling || {};
    scaling.mtof = d3.scale.log(
        ).base(2
        ).range([0, 127]
        ).domain([ 8.1757989156437, 12543.853951416 ]).invert;
    scaling.dbtoa = d3.scale.log(
        ).base(10
        ).range([-40,0]
        ).domain([ 0.01, 1 ]).invert;
})(window, _, d3);

(function(window, _, d3){
    'use strict';
    var scaling;
    window.scaling = scaling = window.scaling || {};
    scaling.mtof = d3.scale.log(
        ).base(2
        ).domain([0, 127]
        ).range([ 8.1757989156437, 12543.853951416 ]);
    scaling.dbtoa = d3.scale.log(
        ).base(10
        ).domain([-40,0]
        ).range([ 0.01, 1 ]);
    
})(window, _, d3);

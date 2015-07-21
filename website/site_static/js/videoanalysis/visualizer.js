(function( global, d3, _) {
    'use strict';
    var videoanalysis; 
    window.videoanalysis = videoanalysis = window.videoanalysis || {};
    function statsPlotter(elem) {
        var childElems = {};
        var lenScale;
        lenScale = d3.scale.linear(
            ).domain([0, 1]
            ).clamp(true
            ).range([0, elem.clientWidth||320]);
        d3.select(elem).style({"padding": 0, "border": "none", });
        function plot(statsdict){
            _.mapObject(statsdict, function (statData, statName) {
                var bars;
                if (!(childElems[statName])) {
                    childElems[statName] = d3.select(elem).append("div");
                };
                //TODO: must be a better way of choosing the scale?
                lenScale.range([0, childElems[statName][0][0].clientWidth-6]);
                
                bars = childElems[statName].selectAll("div").data(statData);
                bars.enter().append("div");
                bars.style("width", function(d) {
                    return lenScale(d) + "px"; });
                bars.exit().remove();
            });
        };
        return plot;
    };
    videoanalysis.statsPlotter = statsPlotter;
})( this, d3, _ );
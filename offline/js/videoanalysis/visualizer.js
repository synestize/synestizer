function plotStatisticsSetup() {
    var averageRawHandle, averageDeltaHandle;
    var covarianceRawHandle, covarianceDeltaHandle;
    var barScale, colorScale;
    var averageRawDom, covarianceRawDom, covarianceDeltaDom, uiDom, logoDom;
    var handle, bars, scale, average, stream;
    
    averageRawDom = d3.select("#average-raw-bars");
    covarianceRawDom = d3.select("#covariance-raw-bars");
    covarianceDeltaDom = d3.select("#covariance-delta-bars");
    logoDom = d3.select("#logo");
    uiDom = d3.selectAll("#controls .content.active");
    barScale = d3.scale.linear().domain([0, 1]).range([0, 300]);
    colorScale = d3.scale.linear().domain([0, 1]).rangeRound([0, 255]);

    averageRawHandle = pubsub.subscribe(
        "/videoanalyzer/averagecolor/val/vec",
        function(data){
            var paramColor, bars;
            // draw param bars
            bars = averageRawDom.selectAll("div").data(data);
            bars.enter().append("div");
            bars.style("width", function(d) {
                return barScale(d) + "px"; });
            bars.style("background-color", function(d, i) {
                if (i == 0)
                    return d3.rgb(255,0,0);
                if (i == 1)
                    return d3.rgb(0,255,0);
                if (i == 2)
                    return d3.rgb(0,0,255);
            });
            bars.exit().remove();
            paramColor = d3.rgb(
                colorScale(data[0]),
                colorScale(data[1]),
                colorScale(data[2])
            );
            // change color of logo and ui
            logoDom.style("color", paramColor);
            uiDom.style("background-color", paramColor);
        }
    );
    covarianceRawHandle = pubsub.subscribe(
        "/videoanalyzer/covariance/val/vec", function(data){
            var paramColor, bars;
            // draw param bars
            bars = covarianceRawDom.selectAll("div").data(data);
            bars.enter().append("div");
            bars.style("width", function(d) {
                return barScale(d) + "px"; });
            bars.exit().remove();
        }
    );
    covarianceDeltaHandle = pubsub.subscribe(
        "/videoanalyzer/covariance/delta/vec", function(data){
            var paramColor, bars;
            // draw param bars
            bars = covarianceDeltaDom.selectAll("div").data(data);
            bars.enter().append("div");
            bars.style("width", function(d) {
                return barScale(d) + "px"; });
            bars.exit().remove();
        }
    );
}

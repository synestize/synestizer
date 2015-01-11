
pubsub.subscribe(
    "/videoanalyzer/averagecolor/raw",
    function(data) {
        triad.glide1( document.getElementById('triadFreq1Knob').value + ( 0.05 * Math.pow(~~(data[0]*255), 2)) );
        triad.glide2( document.getElementById('triadFreq2Knob').value + ( 0.05 * Math.pow(~~(data[1]*255), 2)) );
        triad.glide3( document.getElementById('triadFreq3Knob').value + ( 0.05 * Math.pow(~~(data[2]*255), 2)) );
    });


triad = WX.Triad();
triad.to(WX.Master);




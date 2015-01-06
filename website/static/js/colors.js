function getColorFromImage(pixels, pixelCount) {

    /************************************* dominant */
    /*
     var pa = [];

     for (var i = 0; i < pixelCount; i++) {
     // If pixel is mostly opaque and not white
     if (pixels[i * 4 + 3] >= 125) {
     if (!(pixels[i * 4] > 50 && pixels[i * 4 + 1] > 50 && pixels[i * 4 + 2] > 50)) {
     pa.push([pixels[i * 4], pixels[i * 4 + 1], pixels[i * 4 + 2]]);
     }
     }
     }
     // Send array to quantize function which clusters values
     // using median cut algorithm
     var colormap = MMCQ.quantize(pa, 16);
     var pal = colormap.palette();

     return new chroma(pal[0][0], pal[0][1], pal[0][2]);
     */
     /************************************* average */

     var red = 0;
     var green = 0;
     var blue = 0;

     for (var i = 0; i < pixelCount; i++) {
        red += pixels[i * 4 + 0];
        green += pixels[i * 4 + 1];
        blue += pixels[i * 4 + 2];
    }

    return new chroma.rgb(~~(red / pixelCount), ~~(green / pixelCount), ~~(blue / pixelCount));
}


function cam() {

    var gUM = Modernizr.prefixed('getUserMedia', navigator);
    gUM({video: true}, success, error);

    function success(stream) {

        // hide info layer
        $("#info").removeClass("show").addClass("hide");
        $("#controls").removeClass("hide").addClass("show");

        // start video
        window.stream = stream; // make stream available to console

        var video = $("#camera")[0];
        video.src = window.URL.createObjectURL(stream);
        video.play();


        // evaluate color
        setInterval(function () {
            var canvas = document.querySelector('#canvas');
            var ctx = canvas.getContext('2d');
            var cw = canvas.width;
            var ch = canvas.height;
            var pixelCount = cw * ch;
            ctx.drawImage(video, 0, 0, cw, ch);
            var pixels = ctx.getImageData(0, 0, cw, ch).data;

            c = getColorFromImage(pixels, pixelCount);


            //$("#wrapper").velocity({ backgroundColor: c.hex() }, 30);

            triad.glide1( document.getElementById('triadFreq1Knob').value + ( 0.05 * Math.pow(c.rgb()[0], 2)) );
            triad.glide2( document.getElementById('triadFreq2Knob').value + ( 0.05 * Math.pow(c.rgb()[1], 2)) );
            triad.glide3( document.getElementById('triadFreq3Knob').value + ( 0.05 * Math.pow(c.rgb()[2], 2)) );




        }, 67); // 67 ms => 15 fps


    }

    function error(error) {
        console.log("Modernizr.getusermedia error: ", error);
    }
}


function detectFeatures() {
    has_cam = Modernizr.getusermedia;
    has_webaudio = Modernizr.webaudio;
    has_orientation = Modernizr.deviceorientation;
    has_vibration = Modernizr.vibrate;
}


function start() {
    // setup info div
    $("#info").removeClass("hide").addClass("show");

    if (!!window.stream) {
        video.src = null;
        window.stream.stop();
    }

    detectFeatures();


    if (has_cam) cam(); else console.log("Camera is not supported by your browser!");
    if (has_webaudio) ; else console.log("Web Audio API is not supported by your browser!");
    //if (has_vibration) navigator.vibrate([500, 300, 100]); else $.jGrowl("Vibration is not supported by your device!");


    if (!has_cam || !has_webaudio) {
        $("#info").removeClass("hide").addClass("show");
        $(".info-text").html("Your browser is not supported. Try Firefox/Chrome, please.");
    }


}

var has_cam;
var has_webaudio;
var has_orientation;
var has_vibration;

var c = new chroma();

start();

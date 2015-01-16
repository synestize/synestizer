/*
Audio recording code was taken from Chris Wilson's example at http://webaudiodemos.appspot.com/AudioRecorder/index.html
*/
var patches = patches || {};

(function(patches, window) {
    'use strict';

    patches.Sampler = function (preset) {

        var preset = preset || {};
        var sampler = WX.SP1();

        sampler.setPreset(preset);
        sampler.to(WX.Master);

        var audioInput = null,
        realAudioInput = null,
        inputPoint = null,
        audioRecorder = null;
        var rafID = null;
        var analyserContext = null;
        var canvasWidth, canvasHeight;
        var recIndex = 0;

        var analyserNode;

        initAudio();

        console.log("Sampler patch initialized");

        return {
            run: function() {



            },

            toggleRecording: function(e) {
                if (e.classList.contains("recording")) {
                    // stop recording
                    audioRecorder.stop();
                    e.classList.remove("recording");
                    audioRecorder.getBuffers( gotBuffers );
                } else {
                    // start recording
                    if (!audioRecorder)
                        return;
                    e.classList.add("recording");
                    audioRecorder.clear();
                    audioRecorder.record();
                }
            },


            setOutput: function(output) {
                sampler.output(output);
            },

            properties: {
                sampler: sampler,
                preset: preset
            }
        };

        function initAudio() {
            if (!navigator.getUserMedia)
                navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!navigator.cancelAnimationFrame)
                navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
            if (!navigator.requestAnimationFrame)
                navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

            navigator.getUserMedia(
            {
                "audio": {
                    "mandatory": {
                        "googEchoCancellation": "false",
                        "googAutoGainControl": "false",
                        "googNoiseSuppression": "false",
                        "googHighpassFilter": "false"
                    },
                    "optional": []
                },
            }, gotStream, function(e) {
                alert('Error getting audio');
                console.log(e);
            });
        }


        function gotStream(stream) {
            inputPoint = WX._ctx.createGain();

            // Create an AudioNode from the stream.
            realAudioInput = WX._ctx.createMediaStreamSource(stream); // using analyzer from patch_detail.html
            audioInput = realAudioInput;
            audioInput.connect(inputPoint);

            //    audioInput = convertToMono( input );

            analyserNode = WX._ctx.createAnalyser();
            analyserNode.fftSize = 2048;
            inputPoint.connect( analyserNode );

            audioRecorder = new Recorder( inputPoint );

            var zeroGain = WX._ctx.createGain();
            zeroGain.gain.value = 0.0;
            inputPoint.connect( zeroGain );
            zeroGain.connect( WX._ctx.destination );
            updateAnalysers();
        };

        function updateAnalysers(time) {
            if (!analyserContext) {
                var canvas = document.getElementById("recorderSpectrum");
                canvasWidth = canvas.width;
                canvasHeight = canvas.height;
                analyserContext = canvas.getContext('2d');
            }

            // analyzer draw code here
            {
                var SPACING = 5;
                var BAR_WIDTH = 3;
                var numBars = Math.round(canvasWidth / SPACING);
                var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

                analyserNode.getByteFrequencyData(freqByteData);

                analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
                analyserContext.fillStyle = '#ff00ff';
                analyserContext.lineCap = 'round';
                var multiplier = analyserNode.frequencyBinCount / numBars;

                // Draw rectangle for each frequency bin.
                for (var i = 0; i < numBars; ++i) {
                    var magnitude = 0;
                    var offset = Math.floor( i * multiplier );
                    // gotta sum/average the block, or we miss narrow-bandwidth spikes
                    for (var j = 0; j< multiplier; j++)
                        magnitude += freqByteData[offset + j];
                    magnitude = magnitude / multiplier;
                    var magnitude2 = freqByteData[i * multiplier];
                    analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
                    //console.log(Math.round((i*360)/numBars));
                    analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
                }
            }

            rafID = window.requestAnimationFrame( updateAnalysers );
        };
    };


})( patches, window );

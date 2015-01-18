/*
Audio recording code was taken from Chris Wilson's example at http://webaudiodemos.appspot.com/AudioRecorder/index.html
*/
var patches = patches || {};

(function(patches, window) {
    'use strict';

    patches.Sampler = function (preset) {

        var preset = preset || {};
        var voice1 = WX.SP1();

        voice1.setPreset(preset);
        voice1.to(WX.Master);
        voice1.loadClip({
            name: 'voice 1',
            url: STATIC_URL + 'sound/voice_as4.mp3'
        });

        var audioInput = null,
        realAudioInput = null,
        input = null,
        audioRecorder = null;
        var rafID = null;
        var analyserContext = null;
        var canvasWidth, canvasHeight;
        var recIndex = 0;

        var analyzer;

        input = WX.Gain();

        // Create an AudioNode from the stream.
        realAudioInput = WX._ctx.createMediaStreamSource(window.media.stream);
        audioInput = realAudioInput;
        audioInput.connect(input);

        //    audioInput = convertToMono( input );

        analyzer = WX.Analyzer();
        analyzer.fftSize = 2048;
        input.connect( analyzer );

        audioRecorder = new Recorder( input );

        var zeroGain = WX.Gain();
        zeroGain.gain.value = 0.0;
        input.connect( zeroGain );
        zeroGain.connect( WX._ctx.destination );
        updateAnalysers();
        console.log("Sampler patch initialized");

        return {
            run: function() {

                //sampler.noteOn(60, 127);
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/raw",
                    function(data) {
                        if (voice1.ready) {
                            var p = { tune: data[0].map(0,1,72,48) };
                            voice1.setPreset(p);
                            voice1.noteOn(60, 127, WX.now);
                            voice1.noteOff(60, 127, WX.now+2);
                        }
                        //console.log(sampler.ready);

                        //offsetRed = Math.floor(data[0].map(0,1,0,15));
                        //offsetGreen = Math.floor(data[1].map(0,1,0,15));
                        //offsetBlue = Math.floor(data[2].map(0,1,0,15));
                        //console.log(offsetRed, offsetGreen, offsetBlue);
                    })
            },

            toggleRecording: function(e) {
                if (e.classList.contains("recording")) {
                    // stop recording
                    audioRecorder.stop();
                    e.classList.remove("recording");
                    e.innerHTML = "record";
                    audioRecorder.getBuffers( gotBuffers );
                } else {
                    // start recording
                    if (!audioRecorder)
                        return;
                    e.classList.add("recording");
                    e.innerHTML = "stop";
                    audioRecorder.clear();
                    audioRecorder.record();
                }
            },

            setGain: function(output) {
                voice1.output(output);
            },

            setAttack: function(attack) {
                voice1.setPreset({"ampAttack": attack});
            },

            setDecay: function(decay) {
                voice1.setPreset({"ampDecay": decay});
            },

            setSustain: function(sustain) {
                voice1.setPreset({"ampSustain": sustain});
            },

            setRelease: function(release) {
                voice1.setPreset({"ampRelease": release});
            },

            properties: {
                voice1: voice1,
                preset: preset
            }
        };

        function gotBuffers( buffers ) {

            //var canvas = document.getElementById( "wavedisplay" );
            //drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

            // the ONLY time gotBuffers is called is right after a new recording is completed -
            // so here's where we should set up the download.
            //audioRecorder.exportWAV( doneEncoding );
            //voice1.sampleLength = Math.ceil(buffers[0].length /  WX.srate);
            var frameCount = buffers[0].length;
            var channels = 2;
            var buf = WX._ctx.createBuffer(channels, frameCount, WX.srate);

            for (var channel = 0; channel < channels; channel++) {
                // This gives us the actual ArrayBuffer that contains the data
                var nowBuffering = buf.getChannelData(channel);
                for (var i = 0; i < frameCount; i++) {
                    nowBuffering[i] = buffers[channel][i];
                }
            }

            var clip = {
                name: 'recorded',
                url: 'foo',
                buffer: buf
            };

            voice1.setClip(clip);

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
                var freqByteData = new Uint8Array(analyzer.frequencyBinCount);

                analyzer.getByteFrequencyData(freqByteData);

                analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
                analyserContext.fillStyle = '#ff00ff';
                analyserContext.lineCap = 'round';
                var multiplier = analyzer.frequencyBinCount / numBars;

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

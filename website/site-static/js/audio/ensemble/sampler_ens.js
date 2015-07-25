/*
//Audio recording code was taken from Chris Wilson's example at http://webaudiodemos.appspot.com/AudioRecorder/index.html

var patches = patches || {};

(function(patches, global) {
    'use strict';

    patches.Sampler = function (preset) {

        var preset = preset || {};

        // create audio input node
        var audioInput = null,
        realAudioInput = null,
        input = null;
        //var audioRecorder = null;
        var rafID = null;
        var analyserContext = null;
        var canvasWidth, canvasHeight;
        var recIndex = 0;

        var pitchScale;
        var analyzer;

        input = WX.Gain();

        // Create an AudioNode from the stream.
        realAudioInput = WX._ctx.createMediaStreamSource(global.media.stream);
        audioInput = realAudioInput;
        audioInput.connect(input);

        //    audioInput = convertToMono( input );

        analyzer = WX.Analyzer();
        analyzer.fftSize = 2048;
        input.connect( analyzer );

        // create voices
        var voices = new Array();
        var recorders = new Array();

        // create 3 samplers + recorders
        for (var i = 0; i < 3; ++i) {
            voices.push(WX.SP1());
            voices[i].setPreset(preset);
            voices[i].to(WX.Master);

            recorders.push(new Recorder( input ));
        }

        // load default samples
        voices[0].loadClip({
            name: 'voice 1',
            url: './sound/voice_as4.mp3'
        });
        voices[1].loadClip({
            name: 'voice 2',
            url: './sound/voice_es3.mp3'
        });
        voices[2].loadClip({
            name: 'voice 3',
            url: './sound/voice_c4.mp3'
        });

        // monitor off
        var zeroGain = WX.Gain();
        zeroGain.gain.value = 0.0;
        input.connect( zeroGain );
        zeroGain.connect( WX._ctx.destination );

        // start analyzers
        updateAnalysers();
        console.log("Sampler patch initialized");

        pitchScale = d3.scale.linear().clamp(true).domain([0, 1]).range([72, 48]);;

        return {
            run: function() {
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/val/0",
                    function(data) {
                        if (voices[0].ready) {
                            var p = { tune: pitchScale(data)};
                            voices[0].setPreset(p);
                            voices[0].noteOn(60, 127, WX.now);
                            voices[0].noteOff(60, 127, WX.now+2);
                        }
                    })
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/val/1",
                    function(data) {
                        if (voices[1].ready) {
                            var p = { tune: pitchScale(data)};
                            voices[1].setPreset(p);
                            voices[1].noteOn(60, 127, WX.now);
                            voices[1].noteOff(60, 127, WX.now+2);
                        }
                    })
                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/val/2",
                    function(data) {
                        if (voices[2].ready) {
                            var p = { tune: pitchScale(data)};
                            voices[2].setPreset(p);
                            voices[2].noteOn(60, 127, WX.now);
                            voices[2].noteOff(60, 127, WX.now+2);
                        }
                    })
            },

            toggleRecording: function(e, rec) {
                if (e.classList.contains("fi-stop")) {
                    // stop recording
                    recorders[rec].stop();
                    e.classList.remove("fi-stop");
                    e.classList.add("fi-record");
                    // TODO ...
                    if (rec == 0) {
                        recorders[rec].getBuffers(gotBuffers0);
                    }
                    if (rec == 1) {
                        recorders[rec].getBuffers(gotBuffers1);
                    }
                    if (rec == 2) {
                        recorders[rec].getBuffers(gotBuffers2);
                    }
                } else {
                    // start recording
                    if (!recorders[rec])
                        return;
                    e.classList.remove("fi-record");
                    e.classList.add("fi-stop");
                    recorders[rec].clear();
                    recorders[rec].record();
                }
            },

            setGain: function(output) {
                voices[0].output(output/3);
                voices[1].output(output/3);
                voices[2].output(output/3);
            },

            setAttack: function(attack) {
                voices[0].setPreset({"ampAttack": attack});
                voices[1].setPreset({"ampAttack": attack});
                voices[2].setPreset({"ampAttack": attack});
            },

            setDecay: function(decay) {
                voices[0].setPreset({"ampDecay": decay});
                voices[1].setPreset({"ampDecay": decay});
                voices[2].setPreset({"ampDecay": decay});
            },

            setSustain: function(sustain) {
                voices[0].setPreset({"ampSustain": sustain});
                voices[1].setPreset({"ampSustain": sustain});
                voices[2].setPreset({"ampSustain": sustain});
            },

            setRelease: function(release) {
                voices[0].setPreset({"ampRelease": release});
                voices[1].setPreset({"ampRelease": release});
                voices[2].setPreset({"ampRelease": release});
            },

            properties: {
                voices: voices,
                preset: preset
            }
        };

        function gotBuffers0( buffers ) {
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
            voices[0].setClip(clip);
        };
        function gotBuffers1( buffers ) {
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
            voices[1].setClip(clip);
        };
        function gotBuffers2( buffers ) {
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
            voices[2].setClip(clip);
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

            rafID = global.requestAnimationFrame( updateAnalysers );
        };
    };


})( patches, this );
*/
var patches = patches || {};

(function(patches) {
    'use strict';

    patches.Minimal = function (preset) {

        var preset = preset || {};

        var piano = WX.SP1();
        piano.to(WX.Master);
        //piano.setPreset(_.omit(preset, 'tempo')); // set preset omiting params that the synth does not need. TODO maybe find nicer solution.
        piano.loadClip({
            name: 'piano',
            url: STATIC_URL + 'sound/piano.mp3'
        });

        var panflute = WX.SP1();
        panflute.to(WX.Master);
        //panflute.setPreset(_.omit(preset, 'tempo'));
        panflute.loadClip({
            name: 'panflute',
            url: STATIC_URL + 'sound/panflute.mp3'
        });

        var vibraphone = WX.SP1();
        vibraphone.to(WX.Master);
        //vibraphone.setPreset(_.omit(preset, 'tempo'));
        vibraphone.loadClip({
            name: 'vibraphone',
            url: STATIC_URL + 'sound/vibraphone.mp3'
        });

        var tempo = preset["tempo"] || 160;   // tempo (in beats per minute)

        var startTime;         // The start time of the entire sequence.
        var current16thNote;   // What note is currently last scheduled?
        var lookahead = 25.0;  // How frequently to call scheduling function (in milliseconds)

        /* How far ahead to schedule audio (sec)
        This is calculated from lookahead, and overlaps
        with next interval (in case the timer is late) */
        var scheduleAheadTime = 0.1;

        var nextNoteTime = 0.0;     // when the next note is due.
        var notesInQueue = [];      // the notes that have been put into the web audio, and may or may not have played yet. {note, time}

        var timerWorker = new Worker( STATIC_URL + "js/audio/helpers/sequencer_worker.js");
        timerWorker.onmessage = function (e) {
            if (e.data == "tick") {
                //console.log("tick!");
                scheduler();
            }
            else
                console.log("message: " + e.data);
        };
        timerWorker.postMessage({"interval": lookahead});

        var offsetRed = 0;
        var offsetGreen = 0;
        var offsetBlue = 0;

        var track1 = [
        [69, 127],[50, 127],[-1,0],[62, 127],
        [69, 127],[57, 127],[-1,0],[69, 127],
        [69, 127],[62, 127],[-1,0],[69, 127],
        [69, 127],[64, 127],[-1,0],[69, 127],
        [69, 127],[65, 127],[-1,0],[69, 127],
        [69, 127],[67, 127],[-1,0],[69, 127],
        [69, 127],[69, 127],[-1,0],[69, 127],
        [69, 127],[71, 127],[-1,0],[69, 127],
        [69, 127],[72, 127],[-1,0],[69, 127],
        [69, 127],[74, 127],[-1,0],[69, 127],
        [69, 127],[76, 127],[-1,0],[69, 127],
        [69, 127],[81, 127],[-1,0],[69, 127],
        ];

        var track2 = [
        [74, 127],[-1,0],[55, 127],[67, 127],
        [74, 127],[-1,0],[62, 127],[74, 127],
        [74, 127],[-1,0],[67, 127],[74, 127],
        [74, 127],[-1,0],[69, 127],[74, 127],
        [74, 127],[-1,0],[70, 127],[74, 127],
        [74, 127],[-1,0],[72, 127],[74, 127],
        [74, 127],[-1,0],[74, 127],[74, 127],
        [74, 127],[-1,0],[76, 127],[74, 127],
        [74, 127],[-1,0],[77, 127],[74, 127],
        [74, 127],[-1,0],[79, 127],[74, 127],
        [74, 127],[-1,0],[81, 127],[74, 127],
        [74, 127],[-1,0],[86, 127],[74, 127],
        ];

        var track3 = [
        [64, 127],[45, 127],[57, 127],[-1,0],
        [64, 127],[52, 127],[64, 127],[-1,0],
        [64, 127],[57, 127],[64, 127],[-1,0],
        [64, 127],[59, 127],[64, 127],[-1,0],
        [64, 127],[60, 127],[64, 127],[-1,0],
        [64, 127],[62, 127],[64, 127],[-1,0],
        [64, 127],[64, 127],[64, 127],[-1,0],
        [64, 127],[66, 127],[64, 127],[-1,0],
        [64, 127],[67, 127],[64, 127],[-1,0],
        [64, 127],[69, 127],[64, 127],[-1,0],
        [64, 127],[71, 127],[64, 127],[-1,0],
        [64, 127],[76, 127],[64, 127],[-1,0],
        ];


        console.log("Minimal patch initialized");

        // public functions
        return {

            run: function () {

                this.setOutput(preset["output"]);

                Number.prototype.map = function (in_min, in_max, out_min, out_max) {
                    return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
                }

                pubsub.subscribe(
                    "/videoanalyzer/averagecolor/raw",
                    function(data) {
                        offsetRed = Math.floor(data[0].map(0,1,0,12));
                        offsetGreen = Math.floor(data[1].map(0,1,0,12));
                        offsetBlue = Math.floor(data[2].map(0,1,0,12));
                    })

                // start sequencer
                current16thNote = 0;
                nextNoteTime = WX.now;
                timerWorker.postMessage("start");
            },

            setTempo: function(t) {
                tempo = t;
            },

            getTempo: function() {
                return tempo;
            },

            setOutput: function(output) {
                piano.output(output/(1/0.3));
                panflute.output(output/(1/0.3));
                vibraphone.output(output/(1/0.3));
            },
        };

        // private functions
        function nextNote() {
            // Advance current note and time by a 16th note...
            var secondsPerBeat = 60.0 / tempo * 4;    // current tempo * 4 (for quarter notes)
            nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

            current16thNote+=4;    // Advance the beat number, wrap to zero
            if (current16thNote == 16) {
                current16thNote = 0;
            }
        };

        function scheduleNote(beatNumber, time) {
            // push the note on the queue, even if we're not playing.
            notesInQueue.push({ note: beatNumber, time: time });

            var d = 0.1;

            var note1 = track1[beatNumber/4 + offsetRed*4][0];
            var env1 = track1[beatNumber/4 + offsetRed*4][1];
            if (note1 != -1){
                piano.noteOn(note1, env1, time);
                piano.noteOff(note1, env1, time + d);
            }

            var note2 = track2[beatNumber/4 + offsetGreen*4][0];
            var env2 = track2[beatNumber/4 + offsetGreen*4][1];
            if (note2 != -1){
                panflute.noteOn(note2, env2, time);
                panflute.noteOff(note2, env2, time + d);
            }

            var note3 = track3[beatNumber/4 + offsetBlue*4][0];
            var env3 = track3[beatNumber/4 + offsetBlue*4][1];
            if (note3 != -1){
                vibraphone.noteOn(note3, env3, time);
                vibraphone.noteOff(note3, env3, time + d);
            }

        };

        function scheduler() {
            // while there are notes that will need to play before the next interval,
            // schedule them and advance the pointer.
            while (nextNoteTime < WX.now + scheduleAheadTime) {
                scheduleNote(current16thNote, nextNoteTime);
                nextNote();
            }
        };


    };

})( patches );


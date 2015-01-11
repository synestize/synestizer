var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 160.0/4;          // tempo (in beats per minute)
var lookahead = 25.0; // 25  // How frequently to call scheduling function (in milliseconds)

/* How far ahead to schedule audio (sec)
This is calculated from lookahead, and overlaps
with next interval (in case the timer is late) */
var scheduleAheadTime = 0.1;

var offsetRed = 0;
var offsetGreen = 0;
var offsetBlue = 0;

var piano1 = [
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

var piano2 = [
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

var piano3 = [
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

var panflute = [
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

var vibraphone = [
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

var nextNoteTime = 0.0;     // when the next note is due.
var notesInQueue = [];      // the notes that have been put into the web audio,
// and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages


function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote+=4;    // Advance the beat number, wrap to zero
    if (current16thNote == 16) {
        current16thNote = 0;
    }
}

function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });

    var d = 0.1;

    var note1 = piano1[beatNumber/4 + offsetRed*4][0];
    var env1 = piano1[beatNumber/4 + offsetRed*4][1];
    if (note1 != -1){
        minimal.noteOn(note1, env1, time);
        minimal.noteOff(note1, env1, time + d);
    }

    var note2 = piano2[beatNumber/4 + offsetGreen*4][0];
    var env2 = piano2[beatNumber/4 + offsetGreen*4][1];
    if (note2 != -1){
        minimal.noteOn(note2, env2, time);
        minimal.noteOff(note2, env2, time + d);
    }

    var note3 = piano3[beatNumber/4 + offsetBlue*4][0];
    var env3 = piano3[beatNumber/4 + offsetBlue*4][1];
    if (note3 != -1){
        minimal.noteOn(note3, env3, time);
        minimal.noteOff(note3, env3, time + d);
    }

    //minimal.noteOff(time + 0.0125);


}

function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < WX.now + scheduleAheadTime) {
        scheduleNote(current16thNote, nextNoteTime);
        nextNote();
    }
}

function play() {
    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = WX.now;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}


timerWorker = new Worker( STATIC_URL + "js/audio/helpers/sequencer_worker.js");


timerWorker.onmessage = function (e) {
    if (e.data == "tick") {
        //console.log("tick!");
        scheduler();
    }
    else
        console.log("message: " + e.data);
};


timerWorker.postMessage({"interval": lookahead});

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

minimal = WX.SP1();
minimal.to(WX.Master);

minimal.loadClip({
    name: 'a drum loop',
    url: STATIC_URL + 'sound/piano.mp3'
});


minimal.setTempo = function(t) {
    tempo = t/4;
}

play();

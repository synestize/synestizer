var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 160.0;          // tempo (in beats per minute)
var lookahead = 25.0; // 25  // How frequently to call scheduling function (in milliseconds)

/* How far ahead to schedule audio (sec)
 This is calculated from lookahead, and overlaps
 with next interval (in case the timer is late) */
var scheduleAheadTime = 0.1;


var nextNoteTime = 0.0;     // when the next note is due.
var notesInQueue = [];      // the notes that have been put into the web audio,
// and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages


function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 16) {
        current16thNote = 0;
    }
}

function scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });

    if (beatNumber === 0) {
        minimal.noteOn1(69, 127, time);
        minimal.noteOn2(74, 127, time);
        minimal.noteOn3(64, 100, time);
    }
    else if (beatNumber === 4) {
        minimal.noteOn1(50, 127, time);
        minimal.noteOn3(45, 100, time);
    }
    else if (beatNumber === 8) {
        minimal.noteOn2(55, 127, time);
        minimal.noteOn3(57, 100, time);
    }
    else if (beatNumber === 12) {
        minimal.noteOn1(62, 127, time);
        minimal.noteOn2(67, 127, time);
    }


    //minimal.noteOn1(beatNumber + Math.floor((Math.random() * 20) + 60), 127, time);
    minimal.noteOff(time + 0.25);


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


minimal = WX.Minimal();
minimal.to(WX.Master);
play();

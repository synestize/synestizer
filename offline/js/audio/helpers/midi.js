function midiMessageReceived( ev ) {
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0xf;
  var noteNumber = ev.data[1];
  var velocity = ev.data[2];

  if (channel == 9)
    return
  if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // with MIDI, note on with velocity zero is the same as note off
    // note off
    noteOff( noteNumber );
} else if (cmd == 9) {
    // note on
    noteOn( noteNumber, velocity/127.0);
} else if (cmd == 11) {
    console.log(noteNumber + " " + velocity/127.0);
    var val = velocity/127.0;
    switch(noteNumber) {
        case 2:
        triadGain.setValue(val, true);
        break;
        case 3:
        minimalGain.setValue(val, true);
        break;
        case 4:
        samplerGain.setValue(val, true);
        break;


        case 14:
        freq1Knob.setValue(val*1000);
        $("#freq1Numberbox").val(Math.round(val*1000));
        break;
        case 15:
        freq2Knob.setValue(val*1000);
        $("#freq2Numberbox").val(Math.round(val*1000));
        break;
        case 16:
        freq3Knob.setValue(val*1000);
        $("#freq3Numberbox").val(Math.round(val*1000));
        break;

        case 5:
        minimalTempo.setValue(val*5000+4, true); // min tempo is 4 bpm
        break;
        case 17:
        minimalAttack.setValue(val*2, true);
        break;
        case 18:
        minimalDecay.setValue(val*2, true);
        break;
        case 19:
        minimalSustain.setValue(val*1, true);
        break;
        case 20:
        minimalRelease.setValue(val*4, true);
        break;

        case 8:
        samplerAttack.setValue(val*2, true);
        break;
        case 9:
        samplerDecay.setValue(val*2, true);
        break;
        case 12:
        samplerSustain.setValue(val*1, true);
        break;
        case 13:
        samplerRelease.setValue(val*4, true);
        break;
    }

} else if (cmd == 14) {
    // pitch wheel
    pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
  } else if ( cmd == 10 ) {  // poly aftertouch
    polyPressure(noteNumber,velocity/127)
} else
console.log( "" + ev.data[0] + " " + ev.data[1] + " " + ev.data[2])
}

var selectMIDI = null;
var midiAccess = null;
var midiIn = null;

function selectMIDIIn(ev) {

    var id = ev.target.id;

    if (midiIn)
        midiIn.onmidimessage = null;

    midiIn = midiAccess.inputs.get(id);

    if (midiIn) {
        midiIn.onmidimessage = midiMessageReceived;
        document.getElementById("midiInDevice").innerHTML = midiIn.name;
    }
}

function onMIDIStarted( midi ) {

    console.log("Start MIDI");

    var preferredIndex = 0;

    midiAccess = midi;

    selectMIDI=document.getElementById("midiIn");

    // clear the MIDI inputs
    while (selectMIDI.firstChild) {
        selectMIDI.removeChild(selectMIDI.firstChild);
    }

    inputs = midiAccess.inputs.values();

    for (var input = inputs.next(); input && !input.done; input = inputs.next()){
        input = input.value;
        var str=input.name.toString();
        var preferred = !midiIn && ((str.indexOf("MPK") != -1)||(str.indexOf("Keyboard") != -1)||(str.indexOf("keyboard") != -1)||(str.indexOf("KEYBOARD") != -1));

        var id = input.id;

        var dev = document.createElement("li");
        dev.className = "midi_device";
        dev.innerHTML = "<a href=\"#\" id=\"" + id +"\">" + input.name + "</a>";
        dev.id = id;
        dev.addEventListener("click", selectMIDIIn, false);
        selectMIDI.appendChild(dev);


        if (preferred) {
            midiIn = input;
            midiIn.onmidimessage = midiMessageReceived;
        }
    }


    $(document).foundation();
    $(document).foundation('dropdown', 'reflow');
}

function onMIDISystemError( err ) {
  document.getElementById("synthbox").className = "error";
  console.log( "MIDI not initialized - error encountered:" + err.code );
}

/*
//init: start up MIDI
window.addEventListener('load', function() {


});
*/
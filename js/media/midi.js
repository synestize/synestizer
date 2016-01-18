(function( global, document, Rx) {
    'use strict';
    
    var media;
    
    global.media = media = global.media || {};

    function Midi(opts) {
        opts = opts || {};
        var indevices = {}, outdevices = {};
        var instream, outstream;
        var indevicename = opts.indevice;
        var outdevicename = opts.outdevice;
        var indevice, outdevice;
        var indevicestream, outdevicestream;
        var indatastream, outdatastream;
        var indom = opts.indom;
        var outdom = opts.outdom;
        var outputhandle;
        var statsnames=[];
        var statsoffsets=[];
        
        setMidi.indevicestream = indevicestream = new Rx.Subject();
        setMidi.outdevicestream = outdevicestream = new Rx.Subject();
        setMidi.indatastream = indatastream = new Rx.Subject();
        setMidi.outdatastream = outdatastream = new Rx.Subject();
        
        function setMidi(newdeviceinfo){
            setMidi.indevices = indevices = newdeviceinfo.inputs;
            setMidi.outdevices = outdevices = newdeviceinfo.outputs;
            // automatically update when the devices change: (Doesn't work)
            // newdeviceinfo.onstatechange = queryMidi;
            indevicestream.onNext(indevices);
            outdevicestream.onNext(outdevices);
        };
        
        function setInput(newindevice) {
            console.debug("setin", newindevice);
            if (indevice) delete(indevice.onmidimessage);
            //set input device if we actually gave a device
            if (newindevice) {
                indevicename = newindevice.name;
                newindevice.onmidimessage = function(ev){
                    //for now this only filters midi CC values
                    //turns [177,15,64]
                    //into ["c",1,16,0.5]
                    var midievent = new Array(4);
                    var cmd = ev.data[0] >> 4;
                    var channel = ev.data[0] & 0x0f;
                    var idx = ev.data[1];
                    var val = ev.data[2]/127;
                    //midievent[0] = cmd;
                    midievent[1] = channel;
                    midievent[2] = idx;
                    midievent[3] = val;
                    
                    //11: CC
                    //9: Note on
                    //8: Note off
                    if (cmd===11) {
                        midievent[0]="c";
                        //console.debug("me", ev.data, midievent);
                        indatastream.onNext(midievent);
                    }
                };
                //update UI if necc
                if (indom && newindevice &&
                        (indevice!==newindevice)) {
                    indom.value = newindevice.id;
                }
                indevice = newindevice;
            }
        }
        setMidi.setInput = setInput;
        
        function setInputByName(inputname) {
            inputname = inputname.toLowerCase();
            Rx.Observable.from(indevices.values()).first(
                function(dev){
                    return dev.name.toLowerCase().indexOf(inputname) != -1
                }
            ).subscribe(
              matched => setInput(matched),
              err => console.debug("no devices matching", inputname, err.stack)
            );
        }
        setMidi.setInputByName = setInputByName;
        
        function setOutput(newoutdevice) {
            console.debug("setout", newoutdevice);
            //get rid of previous handlers
            if (outputhandle) {
                outputhandle.dispose();
            }
            if (newoutdevice){
                outputhandle = outdatastream.subscribe(function(data){
                    var cmd = data[0];
                    var channel = data[1];
                    var idx = data[2];
                    var val = Math.max(Math.min(
                        Math.floor(data[3]*128),
                        127), 0)
                    //turns ["c",1,16,0.5]
                    //into [177,16,64]
                    var midibytes = [
                        176 + channel,
                        idx,
                        val
                    ];
                    if (cmd==="c"){
                        newoutdevice.send(midibytes);
                    }
                });
            };
            if (outdom && newoutdevice &&
                    (outdevice!==newoutdevice)) {
                outdom.value = newoutdevice.id;
            }
            outdevice = newoutdevice;
        }
        setMidi.setOutput = setOutput;
        
        function setOutputByName(outputname) {
            outputname = outputname.toLowerCase();
            Rx.Observable.from(outdevices.values()).first(
                function(dev){
                    return dev.name.toLowerCase().indexOf(outputname) != -1
                }
            ).subscribe(function (matched){
                setOutput(matched);
            }, function (err) {
                console.debug("no devices matching", outputname, err.stack);
            });
        }
        setMidi.setOutputByName = setOutputByName;

        setMidi.indevicestream.subscribe(function(devices){
            if (indom) {
                indom.innerHTML = '';
                indom.disabled = false;
                
                devices.forEach( function( dev, key) {
                    var opt = document.createElement("option");
                    opt.text = dev.name;
                    opt.value = key;
                    indom.add(opt);
                });
                Rx.Observable.fromEvent(indom, 'change').subscribe(
                    function(ev) {
                        setInput(devices.get(ev.target.value))
                    }
                );
            }
            if (indevicename) {
                setInputByName(indevicename)
            }
        }, function (err) {
            console.debug(err.stack);
        });
        
        setMidi.outdevicestream.subscribe(function(devices){
            if (outdom) {
                outdom.innerHTML = '';
                outdom.disabled=false;
                devices.forEach( function( dev, key) {
                    var opt = document.createElement("option");
                    opt.text = dev.name;
                    opt.value = key;
                    outdom.add(opt);
                });

                Rx.Observable.fromEvent(outdom, 'change').subscribe(
                    function(ev) {
                        setOutput(devices.get(ev.target.value))
                    }
                );
            }
            if (outdevicename) {
                setOutputByName(outdevicename)
            }
        }, function (err) {
            console.debug(err.stack);
        });

        function queryMidi(event) {
            //event maybe a midi connection event
            Rx.Observable.fromPromise(
                global.navigator.requestMIDIAccess()
            ).subscribe(
                setMidi,
                function (err) {
                    console.debug(err.stack);
                }
            );
        }
        if (typeof global.navigator.requestMIDIAccess==="function") {
            console.debug("yay midi")
            queryMidi();
        } else {
            console.debug("no midi", typeof global.navigator.requestMIDIAccess)
        };
        
        return setMidi;
    };
    media.Midi = Midi;
})(this, document, Rx);

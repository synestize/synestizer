/*
State models reflect the current state of the model
*/

(function(window, _, d3, Rx, t){
    'use strict';
    var ensembles;
    window.ensembles = ensembles = window.ensembles || {};
    
    function makeWidget (paramset, label, elem) {
        /*
        this function makes a slider which communcates with a model over streams
        */
        var incomingStream, outgoingStream, label, controlEl, sliderEl,val;
        val = paramset.get(label);
        controlEl = $("<div></div>"
            ).addClass("control");
        sliderEl = $(
            '<input type="range" min="0.0" max="1.0" step="0.005"></input>'
        );
        controlEl.append(sliderEl);
        sliderEl.val(val).addClass(label);

        controlEl.prepend(
            $("<div></div>"
            ).addClass("label"
            ).text(label)
        );
        $(elem).append(controlEl);
        outgoingStream = Rx.Observable.fromEvent(
            sliderEl, 'input'
        ).subscribe(
            function(ev){
                paramset.set(label, Number(ev.target.value));
            }
        );
        
        // select only values under a particular key, and then only if changed.
        // could also throttle rate here
        incomingStream = paramset.paramValsStream.pluck(label
        ).sample(100).distinctUntilChanged(
        ).subscribe(function(x){
            sliderEl.val(x)
        });
        
        return {
            outgoingStream: outgoingStream,
            incomingStream: incomingStream,
            controlEl: controlEl,
            sliderEl: sliderEl,
        };
    }
    window.ensembles.makeWidget = makeWidget;
    function mappedKeyStream(
            controlStream, key, controlMeta){
        return controlStream.pluck(key
            ).where(function(v){
                return (typeof v !== "undefined") && (!isNaN(v))
            }).distinctUntilChanged(
            ).map(function (x) {
                var scaled = controlMeta[key].scale(x);
                return scaled;
            });
    };
    window.ensembles.mappedKeyStream = mappedKeyStream;
    function keyStream (
            controlStream, key, controlMeta){
        return controlStream.pluck(key
            ).where(function(v){
                return (typeof v !== "undefined") && (!isNaN(v))
            }).distinctUntilChanged();
    };
    window.ensembles.keyStream = keyStream;
    
    ensembles.EnsembleView = function (paramset, elem) {
        var widgets = []; //for debugging
        var wrapper = $(elem).append("<div></div>");
        wrapper.append($("<h3></h3>").text(paramset.ensemble.name));
        wrapper.addClass(paramset.ensemble.name);
        _.each(
            paramset.ensemble.controlMeta,
            function(info, label, controls) {
                widgets.push(ensembles.makeWidget(
                    paramset, label, wrapper
                ));
            },
            this
        );
        return{
            widgets: widgets,
            destroy: function() {},
        }
    };
    
    //This guy emits state changes for a canonical state
    //It keeps a collection of streams that you can use to monitor these
    //TODO: should this use Observable.using?
    // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/using.md
    ensembles.EnsembleParamSet = function (ensemble) {
        var paramVals, paramValsStream;
        var controlMeta;
        var data;
        controlMeta = ensemble.controlMeta;
        paramVals = _.mapObject(
            controlMeta,
            function(val, key){return val['default']|| 0.0}
        );
        paramValsStream = new Rx.ReplaySubject(1);
        // paramValsStream.connect();
        data = {
            ensemble: ensemble,
            controlMeta: controlMeta,
            paramValsStream: paramValsStream,
            paramVals: paramVals, //for debugging
            set: function(key, newVal) {
                var oldVal = paramVals[key];
                if (oldVal!=newVal) {
                    paramVals[key]=newVal;
                    paramValsStream.onNext(paramVals);
                }
            },
            get: function(key) {return paramVals[key]},
            getStream: function(key) {
                return keyStream(paramValsStream, key, controlMeta)
            },
            getMapped: function(key) {
                return controlMeta[key].scale(paramVals[key])
            },
            getMappedStream: function(key) {
                return mappedKeyStream(paramValsStream, key, controlMeta)
            }
        }
        paramValsStream.onNext(paramVals);
        ensemble.setParamSet(data);
        return data;
    };
    
})(window, _, d3, Rx, transducers);

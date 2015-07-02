/*
State models reflect the current state of the model
*/

(function(window, _, d3, Rx, t){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    
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
            sliderEl, 'change'
        ).subscribe(
            function(ev){
                paramset.set(label, Number(ev.target.value));
            }
        );
        
        // select only values under a particular key, and then only if changed.
        // could also throttle rate here
        incomingStream = paramset.paramSetStream.map(
            function (e){return e[label]}
        ).distinctUntilChanged(
        ).subscribe(function(x){console.debug('up', x); sliderEl.val(x)});
        
        return {
            outgoingStream: outgoingStream,
            incomingStream: incomingStream,
            controlEl: controlEl,
            sliderEl: sliderEl,
        };
    }
    window.instruments.makeWidget = makeWidget;
    window.instruments.mappedStreams = function(controlStream, controlMeta){
        var mappedStreams = {}
        _.map(controlMeta, function(meta, key){
            mappedStreams[key] = controlStream.map(
                function (e){return e[key]}
            ).distinctUntilChanged(
            ).map(controlMeta[key]["scale"])
        });
        return mappedStreams;
    };
    instruments.InstView = function (paramset, elem) {
        var widgets = []; //for debugging
        var wrapper = $(elem).append("<div></div>");
        wrapper.append($("<h3></h3>").text(paramset.inst.name));
        wrapper.addClass(paramset.inst.name);
        _.each(
            paramset.inst.controlMeta,
            function(info, label, controls) {
                widgets.push(instruments.makeWidget(
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
    instruments.InstParamSet = function (inst) {
        var paramSet, paramSetStream, controlMeta;
        controlMeta = inst.controlMeta;
        paramSet = _.extend(
            _.mapObject(
                controlMeta,
                function(val, key){return val['default']|| 0.0}
            ),
            {}
        );
        paramSetStream = new Rx.Subject();
        inst.setControlStream(paramSetStream);
        paramSetStream.onNext(paramSet);
        return {
            inst: inst,
            controlMeta: controlMeta,
            paramSetStream: paramSetStream,
            paramSet: paramSet, //for debugging
            set: function(key, newVal) {
                var oldVal = paramSet[key];
                if (oldVal!=newVal) {
                    paramSet[key]=newVal;
                    paramSetStream.onNext(paramSet);
                }
            },
            get: function(key) {return paramSet[key]}
        }
    };
    
})(window, _, d3, Rx, transducers);

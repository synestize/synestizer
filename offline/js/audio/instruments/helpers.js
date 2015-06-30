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
        sliderEl = controlEl.append($(
            '<input type="range" min="0.0" max="1.0" step="0.005"></input>'
        ).val(val).addClass(label));
        
        console.debug("sliderel", label, controlEl, sliderEl);
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
        console.debug("sliderel2", label, controlEl, sliderEl);

        // select only values unde ra particular key, and then only if changed.
        incomingStream = paramset.paramSetStream.filter(
            function (e){e[label]}
        ).distinctUntilChanged;
        
        return {
            outgoingStream: outgoingStream,
            incomingStream: incomingStream,
            controlEl: controlEl,
            sliderEl: sliderEl,
        };
    }
    window.instruments.makeWidget = makeWidget;
    
    instruments.InstView = function (paramset, elem) {
        var widgets = []; //for debugging
        var wrapper = $(elem).append("<div></div>");
        wrapper.append($("<h3></h3>").text(paramset.name));
        wrapper.addClass(paramset.name);
        _.each(
            paramset.controlMeta,
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
    instruments.InstParamSet = function (options, controlMeta) {
        var paramSet, paramSetStream, name;
        paramSet = _.extend(
            _.mapObject(
                controlMeta,
                function(val, key){return val['default']|| 0.0}
            ),
            {}
        );
        name = options.name || "inst";
        paramSetStream = new Rx.Subject();
        paramSetStream.onNext(paramSet);
        return {
            name: name,
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

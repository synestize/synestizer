/*
State models reflect the current state of the model
*/

(function(window, _, d3, Rx){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    function makeWidget (paramset, label) {
        var incomingStream, outgoingStream, label, controlEl, sliderEl,val;
        label = paramset.name;
        val = paramSet.get(label);
        controlEl = $("<div></div>"
            ).addClass("control");
        sliderEl = controlEl.append($(
            '<input type="range" min="0.0" max="1.0" step="0.005"></input>'
        ).val(val).addClass(label));
        outgoingStream = Rx.Observable.fromEvent(
            sliderEl, 'change'
        ).subscribe(
            function(el){paramset.set(label, el.value)}
        );
        
        console.debug("sliderel", label, controlEl, sliderEl);
        controlEl.prepend(
            $("<div></div>"
            ).addClass("label"
            ).text(label)
        );
        console.debug("sliderel2", label, controlEl);
        return {
            controlEl: controlEl,
            sliderEl: sliderEl,
        };
    }
    window.instruments.makeWidget = makeWidget;
    instruments.InstView = function (paramset, elem) {
        var keyStreams;
        return {
            render: function () {
                var wrapper = $(elem).append("<div></div>");
                wrapper.append($("<h3></h3>").text(name));
                wrapper.addClass(name);
                _.each(
                    paramset.controlMeta,
                    function(info, label, controls) {
                        wrapper.append(instruments.makeWidget(
                            this.model, label
                        ));
                    },
                    this);
            },
            update: function () {},
            destroy: {},
        }
    };
    
    //This guy emits state changes
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
            paramSetStream: function() {return paramSetStream},
            set: function(key, newVal) {
                oldVal = paramSet[key];
                if (oldVal!=newVal) {
                    paramSet[key]=val;
                    paramSetStream.onNext(paramSet);
                }
            },
            get: function(key) {return paramSet[key]}
        }
    };
    
})(window, _, d3, Rx);

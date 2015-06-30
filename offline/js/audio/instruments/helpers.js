/*
State models reflect the current state of the model
*/

(function(window, _, d3){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};
    function makeWidget (paramset, label) {
        var controlEl = $("<div></div>"
            ).addClass("control");
        controlEl.append($(
            '<input type="range" min="0.0" max="1.0" step="0.005"></input>'
        ).val(model.get(label)).addClass(label));
        console.debug("sliderel", label, controlEl);
        controlEl.prepend(
            $("<div></div>"
            ).addClass("label"
            ).text(label)
        );
        console.debug("sliderel2", label, controlEl);
        return controlEl;
    }
    window.instruments.makeWidget = makeWidget;
    //This guy emits state changes
    instruments.InstParamSet = function (params, controlMeta) {
        var paramSet, paramSetStream, keyStreams;
        function keyEmit(){};
        function paramSetEmit(){};
        
        paramSet = _.extend(
            controlMeta.mapObject(
                function(val, key){return val['default']|| 0.0}
            ),
            params
        );
        return {
            paramSetStream: function() {return paramSetStream},
            keyStream: function(key){return keysStreams(key)},
            set: function(key, val) {
                paramSet[key]=val;
                keyEmit(key, val);
                paramSetEmit()
            },
        }
    };
    
})(window, _, d3);

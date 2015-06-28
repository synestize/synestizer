/*
State models reflect the current state of the model
*/

(function(window, _, Backbone){
    'use strict';
    var instruments;
    window.instruments = instruments = window.instruments || {};  
    instruments.BasicInstState = Backbone.Model.extend({        
        initialize: function(attrs, options) {
            console.debug('basic init', attrs, options);
            // something with this
            self.ctx = options.ctx;
        },
        
        controls: {
            gain: {
                scale: d3.scale.log().range([0.001,1]),
                units: ""},
            pitch: {
                scale: d3.scale.log().range([200,2000]),
                units: "Hz"}
        },
        
        defaults: {
            gain: 0.7,
            pitch: 0.0,
        },
        
        run: function() {
            //starts up sound engine
        }
    });
    
    
    instruments.BasicInstStateView = Backbone.View.extend({
        client: instruments.BasicInstState,
        
        tagName: "div",

        className: 'basicinst',

        events: {},

        initialize: function (options) {
            _.each(
                this.client.controls,
                function(label, info, controls) {
                    this.events["." + label + " change"] = function (evt) {
                        this.set(label, evt.currentTarget.value)
                    },
                this
            })
        },

        render: function () {
            this.$el.append("<h2></h2>").text(this.className);
            _.each(
                this.model.controls,
                function(info, label, controls) {
                    this.$el.append(this.makeWidget(this.model, label));
                },
                this);
            return this;
        },
        
        makeWidget: function (model, label) {
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
    });

    
})(window, _, Backbone);

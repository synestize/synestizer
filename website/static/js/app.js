/*
app.js
loading data and views
*/

var app = app || {};

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}

$(
    function () {
        // The model for patch
        app.Patch = Backbone.Model.extend({
            defaults: {
                color_mode: null,
                synth: null,
                data: null
            },

            url: function () {
                var id = this.id || '';
                return "/api/v1/synth/patch/" + id;
            }
        });

        // The visual representation of a single patch.
        app.PatchView = Backbone.View.extend({
            tagName: "div",
            template: _.template($("#patch_template").html()),


            initialize: function () {
                console.log("PatchView initialized");
                this.listenTo(this.model, "change", this.render);
            },

            render: function () {
                console.log("PatchView rendered");

                this.$el.attr("id", this.model.get("uuid"));
                // Render the template with our model as a JSON object.
                this.$el.html(this.template(this.model.toJSON()));

                // synths and defaults
                var preset = this.model.get("preset");  // the user preset
                var synths = this.model.get("synth");   // the synths

                for (var s in synths) {
                    var synth = synths[s]["preset"];
                    switch (synths[s]["name"]) {
                        case "Triad":
                        new app.TriadView({synth: JSON.parse(synth), preset: JSON.parse(preset)['triad']});
                        break;
                        case "Minimal":
                        new app.MinimalView({synth: JSON.parse(synth), preset: JSON.parse(preset)['minimal']});
                        break;
                    }
                }


                $("#patch").append(this.$el);

                return this;
            }

        });

app.TriadView = Backbone.View.extend({
    tagName: "div",
    template: _.template($("#triad_template").html()),

    initialize: function (options) {
        console.log("TriadView initialized");
        _.extend(this, _.pick(options, "synth", "preset" /* , ... */));
        this.render();
    },

    render: function () {
        console.log("TriadView rendered");

        this.$el.html(this.template({synth: this.synth, preset: this.preset}));
        $("#triad").append(this.$el);

        var p = {
            output: this.preset['output'],
            oscType1: this.preset['oscType1'],
            oscFreq1: this.preset['oscFreq1'],
            oscType2: this.preset['oscType2'],
            oscFreq2: this.preset['oscFreq2'],
            oscType3: this.preset['oscType3'],
            oscFreq3: this.preset['oscFreq3']
        };

        triad.setPreset(p);

        document.getElementById('triadOutputKnob').addEventListener('change', function (e) {
            triad.output(e.target.value);
        });

        document.getElementById('triadFreq1Knob').addEventListener('change', function (e) {
            triad.glide1(e.target.value);
        });
        document.getElementById('triadFreq2Knob').addEventListener('change', function (e) {
            triad.glide2(e.target.value);
        });

        document.getElementById('triadFreq3Knob').addEventListener('change', function (e) {
            triad.glide3(e.target.value);
        });

        return this;
    },
});


app.MinimalView = Backbone.View.extend({
    tagName: "div",
    template: _.template($("#minimal_template").html()),

    initialize: function (options) {
        console.log("MinimalView initialized");
        _.extend(this, _.pick(options, "synth", "preset" /* , ... */));
        this.render();
    },

    render: function () {
        console.log("MinimalView rendered");

        this.$el.html(this.template({synth: this.synth, preset: this.preset}));
        $("#minimal").append(this.$el);

        var p = {
            output: this.preset['output']
        };

        minimal.setPreset(p);
        //minimal.amp(this.preset['output']);

        document.getElementById('minimalOutputKnob').addEventListener('change', function (e) {
            minimal.output(e.target.value);
        });

        return this;
    },
});

// The view for the entire app.
app.AppView = Backbone.View.extend({
    el: "#app",

    initialize: function () {
        // TastyPie requires us to use a ?format=json param, so we'll set that as a default.
        $.ajaxPrefilter(function (options) {
            _.extend(options, {format: "json"});
        });

        // var p = new app.Patch({id: localStorage.getItem('id')});
        var p = new app.Patch({id: ID});
        p.fetch();
        new app.PatchView({model: p});
    }
});

// And we're off.
new app.AppView();

});




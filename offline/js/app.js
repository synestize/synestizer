/*
app.js
loading data and views
*/
var app = app || {};

$(function () {

// The model for patch
app.Patch = Backbone.Model.extend({
    defaults: {
        color_mode: null,
        synth: null,
        preset: null
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
                case "Sampler":
                new app.SamplerView({synth: JSON.parse(synth), preset: JSON.parse(preset)['sampler']});
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

    events: {
        "change #triadGain": function(e) {
            this.triad.setOutput(e.target.value);
        },
        "change #oscType1Sine": function(e) {
            this.triad.properties.triad.$oscType1("sine");
        },
        "change #oscType1Triangle": function(e) {
            this.triad.properties.triad.$oscType1("triangle");
        },
        "change #oscType1Square": function(e) {
            this.triad.properties.triad.$oscType1("square");
        },
        "change #oscType2Sine": function(e) {
            this.triad.properties.triad.$oscType2("sine");
        },
        "change #oscType2Triangle": function(e) {
            this.triad.properties.triad.$oscType2("triangle");
        },
        "change #oscType2Square": function(e) {
            this.triad.properties.triad.$oscType2("square");
        },
        "change #oscType3Sine": function(e) {
            this.triad.properties.triad.$oscType3("sine");
        },
        "change #oscType3Triangle": function(e) {
            this.triad.properties.triad.$oscType3("triangle");
        },
        "change #oscType3Square": function(e) {
            this.triad.properties.triad.$oscType3("square");
        },
        "change #freq1Knob": function(e) {
            this.triad.properties.triad.glide1(e.target.value);
            document.getElementById("freq1Numberbox").value = e.target.value;
        },
        "change #freq1Numberbox": function(e) {
            this.triad.properties.triad.glide1(e.target.value);
            document.getElementById("freq1Knob").setValue(e.target.value, false);
        },
        "change #freq2Knob": function(e) {
            this.triad.properties.triad.glide2(e.target.value);
            document.getElementById("freq2Numberbox").value = e.target.value;
        },
        "change #freq2Numberbox": function(e) {
            this.triad.properties.triad.glide2(e.target.value);
            document.getElementById("freq2Knob").setValue(e.target.value, false);
        },
        "change #freq3Knob": function(e) {
            this.triad.properties.triad.glide3(e.target.value);
            document.getElementById("freq3Numberbox").value = e.target.value;
        },
        "change #freq3Numberbox": function(e) {
            this.triad.properties.triad.glide3(e.target.value);
            document.getElementById("freq3Knob").setValue(e.target.value, false);
        },
    },

    initialize: function (options) {
        console.log("TriadView initialized");
        _.extend(this, _.pick(options, "synth", "preset" /* , ... */));
        this.render();
    },

    render: function () {
        console.log("TriadView rendered");

        this.$el.html(this.template({synth: this.synth, preset: this.preset}));
        $("#triad").append(this.$el);

        this.triad = new patches.Triad(this.preset);
        this.triad.run();

        return this;
    }
});


app.MinimalView = Backbone.View.extend({
    tagName: "div",
    template: _.template($("#minimal_template").html()),

    events: {
        "change #minimalGain": function(e) { this.minimal.setGain(e.target.value); },
        "change #minimalTempo": function(e) { this.minimal.setTempo(e.target.value); },
        "change #minimalAttack": function(e) { this.minimal.setAttack(e.target.value); },
        "change #minimalDecay": function(e) { this.minimal.setDecay(e.target.value); },
        "change #minimalSustain": function(e) { this.minimal.setSustain(e.target.value); },
        "change #minimalRelease": function(e) { this.minimal.setRelease(e.target.value); }
    },

    initialize: function (options) {
        console.log("MinimalView initialized");
        _.extend(this, _.pick(options, "synth", "preset" /* , ... */));
        this.render();
    },

    render: function () {
        console.log("MinimalView rendered");

        this.$el.html(this.template({synth: this.synth, preset: this.preset}));
        $("#minimal").append(this.$el);

        this.minimal = new patches.Minimal(this.preset);
        this.minimal.run();

        return this;
    },
}
);

app.SamplerView = Backbone.View.extend({
    tagName: "div",
    template: _.template($("#sampler_template").html()),

    events: {
        "change #samplerGain": function(e) { this.sampler.setGain(e.target.value); },
        "click #toggleRecording1": function(e) { this.sampler.toggleRecording(e.target, 0); },
        "click #toggleRecording2": function(e) { this.sampler.toggleRecording(e.target, 1); },
        "click #toggleRecording3": function(e) { this.sampler.toggleRecording(e.target, 2); },
        "change #samplerAttack": function(e) { this.sampler.setAttack(e.target.value); },
        "change #samplerDecay": function(e) { this.sampler.setDecay(e.target.value); },
        "change #samplerSustain": function(e) { this.sampler.setSustain(e.target.value); },
        "change #samplerRelease": function(e) { this.sampler.setRelease(e.target.value); }
    },

    initialize: function (options) {
        console.log("SamplerView initialized");
        _.extend(this, _.pick(options, "synth", "preset" /* , ... */));
        this.render();
    },

    render: function () {
        console.log("SamplerView rendered");

        this.$el.html(this.template({synth: this.synth, preset: this.preset}));
        $("#sampler").append(this.$el);

        this.sampler = new patches.Sampler(this.preset);
        this.sampler.run();

        return this;
    },
}
);

// The view for the entire app.
app.AppView = Backbone.View.extend({
    el: "#app",

    initialize: function () {
        var p;
        // TastyPie requires us to use a ?format=json param, so we'll set that as a default.
        $.ajaxPrefilter(function (options) {
            _.extend(options, {format: "json"});
        });

        // var p = new app.Patch({id: localStorage.getItem('id')});
        p = new app.Patch(app.defaultModel);
        app.currentModel = p;
        // Update with data from the internet if available.
        app.currentView = new app.PatchView({model: p});
        //app.currentView.render();
        p.fetch({
            error: function(model, response, options) {
                //server offline. Initialize using defaults and carry on.
                console.debug("Server not found. We are in offline mode.");
                console.debug(model);
                model.trigger("change");
            }
        });
        console.debug("Started patch");
        console.debug(p);
    }
});

});


/**
 * @wapl Triad
 * @author Christoph Stähli (stahl, stahlnow@gmail.com)
 */
 (function(WX) {
    'use strict';

    // REQUIRED: plug-in constructor
    function Triad(preset) {
        // REQUIRED: adding necessary modules
        WX.PlugIn.defineType(this, 'Generator');

        // patching
        this._osc1 = WX.OSC();
        this._amp1 = WX.Gain();
        this._osc1.to(this._amp1).to(this._output);
        this._osc1.start(0);

        this._osc2 = WX.OSC();
        this._amp2 = WX.Gain();
        this._osc2.to(this._amp2).to(this._output);
        this._osc2.start(0);

        this._osc3 = WX.OSC();
        this._amp3 = WX.Gain();
        this._osc3.to(this._amp3).to(this._output);
        this._osc3.start(0);

        this._amp1.gain.value = 0.3;
        this._amp2.gain.value = 0.3;
        this._amp3.gain.value = 0.3;

        // parameter definition
        WX.defineParams(this, {
            oscType1: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'sine', // all code-side representation should be 'value'
                model: WX.WAVEFORMS
            },

            oscFreq1: {
                type: 'Generic',
                name: 'Freq',
                default: WX.mtof(60),
                min: 20.0,
                max: 5000.0,
                unit: 'Hertz'
            },

            oscType2: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'triangle', // all code-side representation should be 'value'
                model: WX.WAVEFORMS
            },

            oscFreq2: {
                type: 'Generic',
                name: 'Freq',
                default: WX.mtof(60),
                min: 20.0,
                max: 5000.0,
                unit: 'Hertz'
            },

            oscType3: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'square', // all code-side representation should be 'value'
                model: WX.WAVEFORMS
            },

            oscFreq3: {
                type: 'Generic',
                name: 'Freq',
                default: WX.mtof(60),
                min: 20.0,
                max: 5000.0,
                unit: 'Hertz'
            }

        });

        // REQUIRED: initializing instance with preset
        WX.PlugIn.initPreset(this, preset);
    }

    /** REQUIRED: plug-in prototype **/
    Triad.prototype = {
        // REQUIRED: plug-in info
        info: {
            name: 'Triad',
            version: '0.0.1',
            api_version: '1.0.0-alpha',
            author: 'Christoph Stähli',
            type: 'Generator',
            description: '3 OSC'
        },

        // REQUIRED: plug-in default preset
        defaultPreset: {
            oscType1: 'sine',
            oscFreq1: WX.mtof(60),
            oscType2: 'triangle',
            oscFreq2: WX.mtof(60),
            oscType3: 'square',
            oscFreq3: WX.mtof(60)
        },

        // REQUIRED: handlers for each parameter
        $oscType1: function(value, time, rampType) {
            this._osc1.type = value;
        },

        $oscFreq1: function(value, time, rampType) {
            this._osc1.frequency.set(value, time, rampType);
        },

        $oscType2: function(value, time, rampType) {
            this._osc2.type = value;
        },

        $oscFreq2: function(value, time, rampType) {
            this._osc2.frequency.set(value, time, rampType);
        },

        $oscType3: function(value, time, rampType) {
            this._osc3.type = value;
        },

        $oscFreq3: function(value, time, rampType) {
            this._osc3.frequency.set(value, time, rampType);
        },

        // realtime event processors
        /*
        amp: function (gain, time) {
            time = (time || WX.now);
            this._amp1.gain.set(gain/3.3, [time, 0.02], 3);
            this._amp2.gain.set(gain/3.3, [time, 0.02], 3);
            this._amp3.gain.set(gain/3.3, [time, 0.02], 3);
        },
        */

        output: function (output, time) {
            time = (time || WX.now);
            this.params.output.set(output, time, 0);
        },

        noteOn1: function(pitch, velocity, time) {
            time = (time || WX.now);
            this._amp1.gain.set(velocity / 127, [time, 0.02], 3);
            this.params.oscFreq1.set(WX.mtof(pitch), time + 0.02, 0);
        },

        noteOn2: function(pitch, velocity, time) {
            time = (time || WX.now);
            this._amp2.gain.set(velocity / 127, [time, 0.02], 3);
            this.params.oscFreq2.set(WX.mtof(pitch), time + 0.02, 0);
        },

        noteOn3: function(pitch, velocity, time) {
            time = (time || WX.now);
            this._amp3.gain.set(velocity / 127, [time, 0.02], 3);
            this.params.oscFreq3.set(WX.mtof(pitch), time + 0.02, 0);
        },

        glide1: function(pitch, time) {
            time = (time || WX.now);
            this.params.oscFreq1.set(pitch, time + 0.02, 0);
        },

        glide2: function(pitch, time) {
            time = (time || WX.now);
            this.params.oscFreq2.set(pitch, time + 0.02, 0);
        },

        glide3: function(pitch, time) {
            time = (time || WX.now);
            this.params.oscFreq3.set(pitch, time + 0.02, 0);
        },

        noteOff: function(time) {
            time = (time || WX.now);
            this._amp1.gain.set(0.0, [time, 0.1], 3);
            this._amp2.gain.set(0.0, [time, 0.1], 3);
            this._amp3.gain.set(0.0, [time, 0.1], 3);
        },

    };

    // REQUIRED: extending plug-in prototype with modules
    WX.PlugIn.extendPrototype(Triad, 'Generator');

    // REQUIRED: registering plug-in into WX ecosystem
    WX.PlugIn.register(Triad);

})(WX);
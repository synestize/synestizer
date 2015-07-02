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
        this._lfo1 = WX.OSC();
        this._lfoGain1 = WX.Gain();
        this._osc1 = WX.OSC();
        this._amp1 = WX.Gain();
        this._osc1.to(this._amp1).to(this._output);
        this._lfo1.to(this._lfoGain1).to(this._amp1.gain);
        this._lfo1.start(0);
        this._osc1.start(0);

        this._lfo2 = WX.OSC();
        this._lfoGain2 = WX.Gain();
        this._osc2 = WX.OSC();
        this._amp2 = WX.Gain();
        this._osc2.to(this._amp2).to(this._output);
        this._lfo2.to(this._lfoGain2).to(this._amp2.gain);
        this._lfo2.start(0);
        this._osc2.start(0);

        this._lfo3 = WX.OSC();
        this._lfoGain3 = WX.Gain();
        this._osc3 = WX.OSC();
        this._amp3 = WX.Gain();
        this._osc3.to(this._amp3).to(this._output);
        this._lfo3.to(this._lfoGain3).to(this._amp3.gain);
        this._lfo3.start(0);
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
            
            oscFreq1Mod: {
                type: 'Generic',
                name: 'FreqMod',
                default: 0,
                min: -2000,
                max: 2000,
                unit: 'Hertz'
            },
            
            lfoType1: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'square',
                model: WX.WAVEFORMS
            },

            lfoRate1: {
                type: 'Generic',
                name: 'Freq',
                default: 10,
                min: 0.0,
                max: 50.0,
                unit: 'Hertz'
            },

            lfoDepth1: {
                type: 'Generic',
                name: 'Depth',
                default: 1.0,
                min: 0.0,
                max: 1.0,
                unit: 'LinearGain'
            },

            oscType2: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'triangle',
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
            
            oscFreq2Mod: {
                type: 'Generic',
                name: 'FreqMod',
                default: 0,
                min: -2000,
                max: 2000,
                unit: 'Hertz'
            },

            lfoType2: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'square',
                model: WX.WAVEFORMS
            },

            lfoRate2: {
                type: 'Generic',
                name: 'Freq',
                default: 10,
                min: 0.0,
                max: 50.0,
                unit: 'Hertz'
            },

            lfoDepth2: {
                type: 'Generic',
                name: 'Depth',
                default: 1.0,
                min: 0.0,
                max: 1.0,
                unit: 'LinearGain'
            },

            oscType3: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'square',
                model: WX.WAVEFORMS
            },

            oscFreq3: {
                type: 'Generic',
                name: 'Freq',
                default: WX.mtof(60),
                min: 20.0,
                max: 5000.0,
                unit: 'Hertz'
            },

            oscFreq3Mod: {
                type: 'Generic',
                name: 'FreqMod',
                default: 0,
                min: -2000,
                max: 2000,
                unit: 'Hertz'
            },
            lfoType3: {
                type: 'Itemized',
                name: 'Waveform',
                default: 'square',
                model: WX.WAVEFORMS
            },

            lfoRate3: {
                type: 'Generic',
                name: 'Freq',
                default: 10,
                min: 0.0,
                max: 50.0,
                unit: 'Hertz'
            },

            lfoDepth3: {
                type: 'Generic',
                name: 'Depth',
                default: 1.0,
                min: 0.0,
                max: 1.0,
                unit: 'LinearGain'
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
            oscFreq1Mod: 0,
            lfoType1: 'sine',
            lfoRate1: 1.0,
            lfoDepth1: 1.0,
            oscType2: 'sine',
            oscFreq2: WX.mtof(60),
            oscFreq2Mod: 0,
            lfoType2: 'sine',
            lfoRate2: 1.0,
            lfoDepth2: 1.0,
            oscType3: 'sine',
            oscFreq3: WX.mtof(60),
            oscFreq3Mod: 0,
            lfoType3: 'sine',
            lfoRate3: 1.0,
            lfoDepth3: 1.0
        },

        // REQUIRED: handlers for each parameter
        $oscType1: function(value, time, rampType) {
            this._osc1.type = value;
        },

        $oscFreq1: function(value, time, rampType) {
            console.debug(value, time, rampType, this.get('oscFreq1Mod'));
            this._osc1.frequency.set(value+this.get('oscFreq1Mod'), time, rampType);
        },

        $oscFreq1Mod: function(value, time, rampType) {
            this._osc1.frequency.set(value+this.get('oscFreq1'), time, rampType);
        },

        $lfoType1: function(value, time, rampType) {
            this._lfo1.type = value;
        },

        $lfoRate1: function (value, time, rampType) {
            this._lfo1.frequency.set(value, time, rampType);
        },

        $lfoDepth1: function (value, time, rampType) {
            this._lfoGain1.gain.set(value, time, rampType);
        },

        $oscType2: function(value, time, rampType) {
            this._osc2.type = value;
        },

        $oscFreq2: function(value, time, rampType) {
            this._osc1.frequency.set(value+this.get('oscFreq2Mod'), time, rampType);
        },

        $oscFreq2Mod: function(value, time, rampType) {
            this._osc1.frequency.set(value+this.get('oscFreq2'), time, rampType);
        },

        $lfoType2: function(value, time, rampType) {
            this._lfo2.type = value;
        },

        $lfoRate2: function (value, time, rampType) {
            this._lfo2.frequency.set(value, time, rampType);
        },

        $lfoDepth2: function (value, time, rampType) {
            this._lfoGain2.gain.set(value, time, rampType);
        },

        $oscFreq3: function(value, time, rampType) {
            this._osc3.frequency.set(value+this.get('oscFreq1Mod'), time, rampType);
        },

        $oscFreq3Mod: function(value, time, rampType) {
            this._osc3.frequency.set(value+this.get('oscFreq3'), time, rampType);
        },

        $lfoType3: function(value, time, rampType) {
            this._lfo3.type = value;
        },

        $lfoRate3: function (value, time, rampType) {
            this._lfo3.frequency.set(value, time, rampType);
        },

        $lfoDepth3: function (value, time, rampType) {
            this._lfoGain3.gain.set(value, time, rampType);
        },

        // realtime event processors
        output: function (output, time) {
            time = (time || WX.now);
            this.params.output.set(output, time, 0);
        },
    };

    // REQUIRED: extending plug-in prototype with modules
    WX.PlugIn.extendPrototype(Triad, 'Generator');

    // REQUIRED: registering plug-in into WX ecosystem
    WX.PlugIn.register(Triad);

})(WX);
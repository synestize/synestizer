/**
 * @wapl CMP1
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */
(function (WX) {

  'use strict';

  /** REQUIRED: plug-in constructor **/
  function CMP1(preset) {

    // REQUIRED: define plug-in type
    WX.PlugIn.defineType(this, 'Processor');

    // node creation and patching
    this._comp = WX.Comp();
    this._makeup = WX.Gain();
    this._input.to(this._comp).to(this._makeup).to(this._output);

    // define parameters
    WX.defineParams(this, {

      threshold: {
        type: 'Generic',
        name: 'Threshold',
        default: -8.0,
        min: -60.0,
        max: 0.0,
        unit: 'Decibels'
      },

      knee: {
        type: 'Generic',
        name: 'Knee',
        default: 20,
        min: 0,
        max: 40,
        unit: 'Decibels'
      },

      ratio: {
        type: 'Generic',
        name: 'Ratio',
        default: 4,
        min: 1,
        max: 20
      },

      attack: {
        type: 'Generic',
        name: 'Attack',
        default: 0.025,
        min: 0,
        max: 1,
        unit: 'Seconds'
      },

      release: {
        type: 'Generic',
        name: 'Release',
        default: 0.25,
        min: 0.0,
        max: 1.0,
        unit: 'Seconds'
      },

      makeup: {
        type: 'Generic',
        name: 'Makeup',
        default: 0.0,
        min: 0.0,
        max: 24.0,
        unit: 'Decibels'
      }

    });

    // REQUIRED: initializing instance with preset
    WX.PlugIn.initPreset(this, preset);
  }

  /** REQUIRED: plug-in prototype **/
  CMP1.prototype = {

    // REQUIRED: plug-in info
    info: {
      name: 'CMP1',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Processor',
      description: 'Basic compressor'
    },

    // REQUIRED: plug-in default preset
    defaultPreset: {
      threshold: -8,
      knee: 20,
      ratio: 4,
      attack: 0.025,
      release: 0.25,
      makeup: 0,
    },

    $threshold: function (value, time, rampType) {
      this._comp.threshold.set(value, time, rampType);
    },

    $knee: function (value, time, rampType) {
      this._comp.knee.set(value, time, rampType);
    },

    $ratio: function (value, time, rampType) {
      this._comp.ratio.set(value, time, rampType);
    },

    $attack: function (value, time, rampType) {
      this._comp.attack.set(value, time, rampType);
    },

    $release: function (value, time, rampType) {
      this._comp.release.set(value, time, rampType);
    },

    $makeup: function (value, time, rampType) {
      this._makeup.gain.set(WX.dbtolin(value), time, rampType);
    }

  };

  // REQUIRED: extending plug-in prototype with modules
  WX.PlugIn.extendPrototype(CMP1, 'Processor');

  // REQUIRED: registering plug-in into WX ecosystem
  WX.PlugIn.register(CMP1);

})(WX);// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

(function (WX) {

  'use strict';

  /**
   * Implements chorus effect by Jon Dattorro.
   * @type {WAPL}
   * @param {Object} preset Parameter preset.
   * @param {Number} preset.rate Chorus rate.
   * @param {Number} preset.depth Chorus depth.
   * @param {Number} preset.intensity Chorus intesity.
   * @param {Number} preset.blend Chorus blend.
   * @param {Number} preset.mix Mix between wet and dry signal.
   */
  function Chorus(preset) {

    WX.PlugIn.defineType(this, 'Processor');

    this._dry = WX.Gain();
    this._wet = WX.Gain();
    var _splitter = WX.Splitter(2);
    var _merger = WX.Merger(2);

    // left stream
    this._LStream = WX.Gain();
    this._LDelayVibrato = WX.Delay();
    this._LDelayFixed = WX.Delay();
    this._LFeedback = WX.Gain();
    this._LFeedforward = WX.Gain();
    this._LBlend = WX.Gain();

    // right stream
    this._RStream = WX.Gain();
    this._RDelayVibrato = WX.Delay();
    this._RDelayFixed = WX.Delay();
    this._RFeedback = WX.Gain();
    this._RFeedforward = WX.Gain();
    this._RBlend = WX.Gain();

    // input
    this._input.to(_splitter, this._dry);

    // left connection
    _splitter.connect(this._LStream, 0, 0);
    this._LStream.to(this._LDelayVibrato);
    this._LStream.to(this._LDelayFixed);
    this._LDelayVibrato.to(this._LFeedforward);
    this._LDelayVibrato.connect(_merger, 0, 0);
    this._LDelayFixed.to(this._LFeedback);
    this._LFeedback.to(this._LStream);
    this._LBlend.connect(_merger, 0, 0);

    // right connection
    _splitter.connect(this._RStream, 1, 0);
    this._RStream.to(this._RDelayVibrato);
    this._RStream.to(this._RDelayFixed);
    this._RDelayVibrato.to(this._RFeedforward);
    this._RDelayVibrato.connect(_merger, 0, 1);
    this._RDelayFixed.to(this._RFeedback);
    this._RFeedback.to(this._RStream);
    this._RBlend.connect(_merger, 0, 1);

    // output
    _merger.to(this._wet);
    this._dry.to(this._output);
    this._wet.to(this._output);

    // LFO modulation
    this._lfo = WX.OSC();
    this._LDepth = WX.Gain();
    this._RDepth = WX.Gain();
    this._lfo.to(this._LDepth, this._RDepth);
    this._LDepth.to(this._LDelayVibrato.delayTime);
    this._RDepth.to(this._RDelayVibrato.delayTime);
    this._lfo.start(0);

    // unexposed initial settings
    this._lfo.type = 'sine';
    this._lfo.frequency.value = 0.15;

    // dtime setting
    this._LDepth.gain.value = 0.013;
    this._RDepth.gain.value = -0.017;
    this._LDelayVibrato.delayTime.value = 0.013;
    this._LDelayFixed.delayTime.value = 0.005;
    this._RDelayVibrato.delayTime.value = 0.017;
    this._RDelayFixed.delayTime.value = 0.007;

    // define parameters
    WX.defineParams(this, {

      rate: {
        type: 'Generic',
        name: 'Rate',
        default: 0.1,
        min: 0.1,
        max: 1.0,
        unit: 'Hertz'
      },

      intensity: {
        type: 'Generic',
        name: 'Intensity',
        default: 0.1,
        min: 0.01,
        max: 1.0
      },

      mix: {
        type: 'Generic',
        name: 'Mix',
        default: 0.6,
        min: 0.0,
        max: 1.0,
      }

    });

    WX.PlugIn.initPreset(this, preset);
  }

  Chorus.prototype = {

    info: {
      name: 'Chorus',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Processor',
      description: 'Basic chorus effect'
    },

    defaultPreset: {
      rate: 0.5,
      intensity: 0.0,
      mix: 0.75
    },

    $rate: function (value, time, rampType) {
      value = WX.clamp(value, 0.0, 1.0) * 0.29 + 0.01;
      this._lfo.frequency.set(value, time, rampType);
    },

    $intensity: function (value, time, rampType) {
      value = WX.clamp(value, 0.0, 1.0);
      var blend = 1.0 - (value * 0.2929);
      var feedforward = value * 0.2929 + 0.7071;
      var feedback = value * 0.7071;
      this._LBlend.gain.set(blend, time, rampType);
      this._RBlend.gain.set(blend, time, rampType);
      this._LFeedforward.gain.set(feedforward, time, rampType);
      this._RFeedforward.gain.set(feedforward, time, rampType);
      this._LFeedback.gain.set(feedback, time, rampType);
      this._RFeedback.gain.set(feedback, time, rampType);
    },

    $mix: function (value, time, rampType) {
      this._dry.gain.set(1.0 - value, time, rampType);
      this._dry.gain.set(value, time, rampType);
    }

  };

  WX.PlugIn.extendPrototype(Chorus, 'Processor');
  WX.PlugIn.register(Chorus);

})(WX);/**
 * @wapl ConVerb
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */
(function (WX) {

  'use strict';

  /** REQUIRED: plug-in constructor **/
  function ConVerb(preset) {

    // REQUIRED: define plug-in type
    WX.PlugIn.defineType(this, 'Processor');

    // any flags or instance variables
    this.ready = false;
    this.clip = null;

    // node creation and patching
    this._dry = WX.Gain();
    this._wet = WX.Gain();
    this._convolver = WX.Convolver();
    this._input.to(this._dry, this._convolver);
    this._convolver.to(this._wet);
    this._dry.to(this._output);
    this._wet.to(this._output);

    // define parameters
    WX.defineParams(this, {

      mix: {
        type: 'Generic',
        name: 'Mix',
        default: 0.2,
        min: 0.0,
        max: 1.0
      }

    });

    // REQUIRED: initializing instance with preset
    WX.PlugIn.initPreset(this, preset);
  }

  /** REQUIRED: plug-in prototype **/
  ConVerb.prototype = {

    // REQUIRED: plug-in info
    info: {
      name: 'ConVerb',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Processor',
      description: 'Convolution Reverb'
    },

    // REQUIRED: plug-in default preset
    defaultPreset: {
      mix: 0.2
    },

    /** handlers **/
    $mix: function (value, time, rampType) {
      this._dry.gain.set(1.0 - value, time, rampType);
      this._wet.gain.set(value, time, rampType);
    },

    _onprogress: function (event, clip) {

    },

    _onloaded: function (clip) {
      this.setClip(clip);
    },

    isReady: function () {
      return this.ready;
    },

    setClip: function (clip) {
      this.clip = clip;
      this._convolver.buffer = this.clip.buffer;
      this.ready = true;
    },

    loadClip: function (clip) {
      WX.loadClip(
        clip,
        this._onloaded.bind(this),
        this._onprogress.bind(this)
      );
    }
  };

  // REQUIRED: extending plug-in prototype with modules
  WX.PlugIn.extendPrototype(ConVerb, 'Processor');

  // REQUIRED: registering plug-in into WX ecosystem
  WX.PlugIn.register(ConVerb);

})(WX);// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

(function (WX) {

  'use strict';

  // Internal unit biqual filter
  function UnitFilter(filterType, frequency) {
    this._input = WX.Gain();
    this._bypass = WX.Gain();
    this._biquad = WX.Filter();
    this._input.to(this._biquad);
    this._bypass.gain.value = 0.0;
    this._biquad.type = filterType;
    this._biquad.frequency.value = frequency;
    this._active = true;
  }

  UnitFilter.prototype = {

    setInput: function (inputNode) {
      inputNode.to(this._input, this._bypass);
    },

    setOutput: function (outputNode) {
      this._biquad.to(outputNode);
      this._bypass.to(outputNode);
    },

    cascade: function (unitFilter) {
      this._biquad.to(unitFilter._input, unitFilter._bypass);
      this._bypass.to(unitFilter._input, unitFilter._bypass);
    },

    toggle: function (bool) {
      this._active = bool;
      if (this._active) {
        this._input.gain.value = 1.0;
        this._bypass.gain.value = 0.0;
      } else {
        this._input.gain.value = 0.0;
        this._bypass.gain.value = 1.0;
      }
    },

    setFilterType: function (filterType) {
      this._biquad.type = filterType;
    },

    setAll: function (freq, Q, gain, time, rampType) {
      this._biquad.frequency.set(freq, time, rampType);
      this._biquad.Q.set(Q, time, rampType);
      this._biquad.gain.set(gain, time, rampType);
    },

    setFrequency: function (value, time, rampType) {
      this._biquad.frequency.set(value, time, rampType);
    },

    setQ: function (value, time, rampType) {
      this._biquad.Q.set(value, time, rampType);
    },

    setGain: function (value, time, rampType) {
      this._biquad.gain.set(value, time, rampType);
    },

    // TO FIX: for filter graph drawing.
    getFrequencyResponse: function (canvasWidth, numOctaves) {
      var frequencyHz = new Float32Array(canvasWidth);
      var magResponse = new Float32Array(canvasWidth);
      var phaseResponse = new Float32Array(canvasWidth);
      var nyquist = 0.5 * WX.srate;
      for (var i = 0; i < width; ++i) {
        // Convert to log frequency scale (octaves).
        frequencyHz[i] = nyquist * Math.pow(2.0, noctaves * (i / width - 1.0));
      }
      filter.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);

      return {
        freq: frequencyHz,
        mag: magResponse
      };
    }

  };


  /**
   * Implements a standard 4-band parametric equalizer.
   * @type {WAPL}
   * @param {Object} preset Parameter preset.
   * @param {Boolean} preset.band1Active Band 1 active switch.
   * @param {Itemized} preset.band1Type Band 1 filter type.
   * @param {Number} preset.band1Freq Band 1 frequency.
   * @param {Number} preset.band1Q Band 1 Q.
   * @param {Number} preset.band1Gain Band 1 gain (decibels).
   * @param {Boolean} preset.band2Active Band 2 active switch.
   * @param {Itemized} preset.band2Type Band 2 filter type.
   * @param {Number} preset.band2Freq Band 2 frequency.
   * @param {Number} preset.band2Q Band 2 Q.
   * @param {Number} preset.band2Gain Band 2 gain (decibels).
   * @param {Boolean} preset.band3Active Band 3 active switch.
   * @param {Itemized} preset.band3Type Band 3 filter type.
   * @param {Number} preset.band3Freq Band 3 frequency.
   * @param {Number} preset.band3Q Band 3 Q.
   * @param {Number} preset.band3Gain Band 3 gain (decibels).
   * @param {Boolean} preset.band4Active Band 4 active switch.
   * @param {Itemized} preset.band4Type Band 4 filter type.
   * @param {Number} preset.band4Freq Band 4 frequency.
   * @param {Number} preset.band4Q Band 4 Q.
   * @param {Number} preset.band4Gain Band 4 gain (decibels).
   */
  function EQ4(preset) {

    WX.PlugIn.defineType(this, 'Processor');

    this._band1 = new UnitFilter('lowshelf', 80);
    this._band2 = new UnitFilter('peaking', 500);
    this._band3 = new UnitFilter('peaking', 3500);
    this._band4 = new UnitFilter('highshelf', 10000);

    this._band1.setInput(this._input);
    this._band1.cascade(this._band2);
    this._band2.cascade(this._band3);
    this._band3.cascade(this._band4);
    this._band4.setOutput(this._output);

    // define parameters
    WX.defineParams(this, {

      band1Active: {
        type: 'Boolean',
        name: 'On 1',
        default: true
      },

      band1Type: {
        type: 'Itemized',
        name: 'Type 1',
        default: 'lowshelf',
        model: WX.FILTER_TYPES
      },

      band1Freq: {
        type: 'Generic',
        name: 'Freq 1',
        default: 80,
        min: 10,
        max: WX.srate * 0.5,
        unit: 'Hertz'
      },

      band1Q: {
        type: 'Generic',
        name: 'Q 1',
        default: 0.0,
        min: 0.01,
        max: 1000
      },

      band1Gain: {
        type: 'Generic',
        name: 'Gain 1',
        default: 0.0,
        min: -40,
        max: 40,
        unit: 'Decibels'
      },

      band2Active: {
        type: 'Boolean',
        name: 'On 2',
        default: true
      },

      band2Type: {
        type: 'Itemized',
        name: 'Type 2',
        default: 'peaking',
        model: WX.FILTER_TYPES
      },

      band2Freq: {
        type: 'Generic',
        name: 'Freq 2',
        default: 500,
        min: 10,
        max: WX.srate * 0.5,
        unit: 'Hertz'
      },

      band2Q: {
        type: 'Generic',
        name: 'Q 2',
        default: 0.0,
        min: 0.01,
        max: 1000
      },

      band2Gain: {
        type: 'Generic',
        name: 'Gain 2',
        default: 0.0,
        min: -40,
        max: 40,
        unit: 'Decibels'
      },

      band3Active: {
        type: 'Boolean',
        name: 'On 3',
        default: true
      },

      band3Type: {
        type: 'Itemized',
        name: 'Type 3',
        default: 'peaking',
        model: WX.FILTER_TYPES
      },

      band3Freq: {
        type: 'Generic',
        name: 'Freq 3',
        default: 3500,
        min: 10,
        max: WX.srate * 0.5,
        unit: 'Hertz'
      },

      band3Q: {
        type: 'Generic',
        name: 'Q 3',
        default: 0.0,
        min: 0.01,
        max: 1000
      },

      band3Gain: {
        type: 'Generic',
        name: 'Gain 3',
        default: 0.0,
        min: -40,
        max: 40,
        unit: 'Decibels'
      },

      band4Active: {
        type: 'Boolean',
        name: 'On 4',
        default: true
      },

      band4Type: {
        type: 'Itemized',
        name: 'Type 4',
        default: 'highshelf',
        model: WX.FILTER_TYPES
      },

      band4Freq: {
        type: 'Generic',
        name: 'Freq 4',
        default: 12000,
        min: 10,
        max: WX.srate * 0.5,
        unit: 'Hertz'
      },

      band4Q: {
        type: 'Generic',
        name: 'Q 4',
        default: 0.0,
        min: 0.01,
        max: 1000
      },

      band4Gain: {
        type: 'Generic',
        name: 'Gain 4',
        default: 0.0,
        min: -40,
        max: 40,
        unit: 'Decibels'
      }

    });

    WX.PlugIn.initPreset(this, preset);
  }

  EQ4.prototype = {

    info: {
      name: 'EQ4',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Processor',
      description: '4-band Parametric Equalizer'
    },

    defaultPreset: {
      band1Active: true,
      band1Type: 'lowshelf',
      band1Freq: 80,
      band1Q: 0.0,
      band1Gain: 0.0,
      band2Active: true,
      band2Type: 'peaking',
      band2Freq: 500,
      band2Q: 0.0,
      band2Gain: 0.0,
      band3Active: true,
      band3Type: 'peaking',
      band3Freq: 3500,
      band3Q: 0.0,
      band3Gain: 0.0,
      band4Active: true,
      band4Type: 'highshelf',
      band4Freq: 12000,
      band4Q: 0.0,
      band4Gain: 0.0
    },

    $band1Active: function (value, time, rampType) {
      this._band1.toggle(value);
    },

    $band1Type: function (value, time, rampType) {
      this._band1.setFilterType(value);
    },

    $band1Freq: function (value, time, rampType) {
      this._band1.setFrequency(value, time, rampType);
    },

    $band1Q: function (value, time, rampType) {
      this._band1.setQ(value, time, rampType);
    },

    $band1Gain: function (value, time, rampType) {
      this._band1.setGain(value, time, rampType);
    },

    $band2Active: function (value, time, rampType) {
      this._band2.toggle(value);
    },

    $band2Type: function (value, time, rampType) {
      this._band2.setFilterType(value);
    },

    $band2Freq: function (value, time, rampType) {
      this._band2.setFrequency(value, time, rampType);
    },

    $band2Q: function (value, time, rampType) {
      this._band2.setQ(value, time, rampType);
    },

    $band2Gain: function (value, time, rampType) {
      this._band2.setGain(value, time, rampType);
    },

    $band3Active: function (value, time, rampType) {
      this._band3.toggle(value);
    },

    $band3Type: function (value, time, rampType) {
      this._band3.setFilterType(value);
    },

    $band3Freq: function (value, time, rampType) {
      this._band3.setFrequency(value, time, rampType);
    },

    $band3Q: function (value, time, rampType) {
      this._band3.setQ(value, time, rampType);
    },

    $band3Gain: function (value, time, rampType) {
      this._band3.setGain(value, time, rampType);
    },

    $band4Active: function (value, time, rampType) {
      this._band4.toggle(value);
    },

    $band4Type: function (value, time, rampType) {
      this._band4.setFilterType(value);
    },

    $band4Freq: function (value, time, rampType) {
      this._band4.setFrequency(value, time, rampType);
    },

    $band4Q: function (value, time, rampType) {
      this._band4.setQ(value, time, rampType);
    },

    $band4Gain: function (value, time, rampType) {
      this._band4.setGain(value, time, rampType);
    }

  };

  WX.PlugIn.extendPrototype(EQ4, 'Processor');
  WX.PlugIn.register(EQ4);

})(WX);/**
 * @wapl FMK1
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */

(function (WX) {

  'use strict';

  /**
   * FMOperator class.
   * @param {[type]} outputNode [description]
   */
  function FMVoice(synth) {
    this.parent = synth;
    this.params = synth.params;
    this.voiceKey = null;
    this._minDur = null;

    this._mod = WX.OSC();
    this._modGain = WX.Gain();
    this._car = WX.OSC();
    this._carGain = WX.Gain();
    this._mod.to(this._modGain);
    this._modGain.connect(this._car.frequency);
    this._car.to(this._carGain).to(this.parent._filter);

    this._mod2 = WX.OSC();
    this._modGain2 = WX.Gain();
    this._car2 = WX.OSC();
    this._carGain2 = WX.Gain();
    this._mod2.to(this._modGain2);
    this._modGain2.connect(this._car2.frequency);
    this._car2.to(this._carGain2).to(this.parent._filter);
  }

  FMVoice.prototype = {

    noteOn: function (pitch, velocity, time) {
      var p = this.params,
          freq = WX.mtof(pitch),
          hr = p.harmonicRatio.get(),
          mi = p.modulationIndex.get(),
          att = p.attack.get(),
          dec = p.decay.get(),
          sus = p.sustain.get(),
          bal = p.balance.get(),
          scale = WX.veltoamp(velocity);
      // 1: start generation
      this._mod.start(time);
      this._car.start(time);
      // set fm parameters: freq, hr, mi-attack, mi-decay
      this._car.frequency.set(freq, time, 0);
      this._mod.frequency.set(freq * hr, time, 0);
      this._modGain.gain.set(freq * hr * mi, time, 0);
      this._modGain.gain.set(0.1, time + 1.5, 2);
      // envelope: ads
      this._carGain.gain.set(0.0, time, 0);
      this._carGain.gain.set(scale * bal, time + att, 1);
      this._carGain.gain.set(sus * scale * bal, [time + att, dec], 3);
      // 2: start generation
      this._mod2.start(time);
      this._car2.start(time);
      // set fm parameters: freq, hr, mi-attack, mi-decay
      this._car2.frequency.set(freq * 2, time, 0);
      this._mod2.frequency.set(freq * hr, time, 0);
      this._modGain2.gain.set(freq * hr * mi * 0.5, time, 0);
      this._modGain2.gain.set(0.5, time + 1.5, 2);
      // envelope: ads
      this._carGain2.gain.set(0.0, time, 0);
      this._carGain2.gain.set(scale * (1 - bal), time + att, 1);
      this._carGain2.gain.set(sus * scale * (1 - bal), [time + att, dec], 3);
      // get minDur
      this.minDur = time + att + dec;
    },

    noteOff: function (pitch, velocity, time) {
      if (this.minDur) {
        time = time < WX.now ? WX.now : time;
        var p = this.params,
            rel = p.release.get();
        this.voiceKey = pitch;
        this._mod.stop(this.minDur + rel + 2.0);
        this._car.stop(this.minDur + rel + 2.0);
        this._mod2.stop(this.minDur + rel + 2.0);
        this._car2.stop(this.minDur + rel + 2.0);
        if (time < this.minDur) {
          this._carGain.gain.cancel(this.minDur);
          this._carGain.gain.set(0.0, [this.minDur, rel], 3);
          this._carGain2.gain.cancel(this.minDur);
          this._carGain2.gain.set(0.0, [this.minDur, rel], 3);
        } else {
          this._carGain.gain.set(0.0, [time, rel], 3);
          this._carGain2.gain.set(0.0, [time, rel], 3);
        }
      }
    }

  };

  // REQUIRED: plug-in constructor
  function FMK1(preset) {

    // REQUIRED: adding necessary modules
    WX.PlugIn.defineType(this, 'Generator');

    this.numVoice = 0;
    // naive voice management
    this.voices = [];
    for (var i = 0; i < 128; i++) {
      this.voices[i] = [];
    }

    // patching
    this._filter = WX.Filter();
    this._filter.to(this._output);

    // parameter definition
    WX.defineParams(this, {

      harmonicRatio: {
        type: 'Generic',
        name: 'HRatio',
        default: 4,
        min: 1,
        max: 60
      },

      modulationIndex: {
        type: 'Generic',
        name: 'ModIdx',
        default: 1,
        min: 0.0,
        max: 2.0
      },

      attack: {
        type: 'Generic',
        name: 'Att',
        default: 0.005,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      decay: {
        type: 'Generic',
        name: 'Dec',
        default: 0.04,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      sustain: {
        type: 'Generic',
        name: 'Sus',
        default: 0.25,
        min: 0.0,
        max: 1.0
      },

      release: {
        type: 'Generic',
        name: 'Rel',
        default: 0.2,
        min: 0.0,
        max: 10.0,
        unit: 'Seconds'
      },

      balance: {
        type: 'Generic',
        name: 'Balance',
        default: 0.5,
        min: 0.0,
        max: 1.0
      },

      filterType: {
        type: 'Itemized',
        name: 'FiltType',
        default: 'highshelf',
        model: WX.FILTER_TYPES
      },

      filterFrequency: {
        type: 'Generic',
        name: 'FiltFreq',
        default: 2500,
        min: 20,
        max: 20000,
        unit: 'Hertz'
      },

      filterQ: {
        type: 'Generic',
        name: 'FiltQ',
        default: 0.0,
        min: 0.0,
        max: 40.0
      },

      filterGain: {
        type: 'Generic',
        name: 'FiltGain',
        default: 0.0,
        min: -40.0,
        max: 40.0,
        unit: 'Decibels'
      }

    });

    // REQUIRED: initializing instance with preset
    WX.PlugIn.initPreset(this, preset);
  }

  /** REQUIRED: plug-in prototype **/
  FMK1.prototype = {

    // REQUIRED: plug-in info
    info: {
      name: 'FMK1',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Generator',
      description: 'FM Bell-based Keys'
    },

    // REQUIRED: plug-in default preset
    defaultPreset: {
      harmonicRatio: 10,
      modulationIndex: 1.8,
      attack: 0.002,
      decay: 0.03,
      sustain: 0.65,
      release: 0.55,
      balance: 0.7165,
      filterType: 'highshelf',
      filterFrequency: 7000,
      filterQ: 0.0,
      filterGain: -3.0,
      output: 0.3
    },

    // REQUIRED: handlers for each parameter
    $balance: function (value, time, rampType) {

    },

    $filterType: function (value, time, rampType) {
      this._filter.type = value;
    },

    $filterFrequency: function (value, time, rampType) {
      this._filter.frequency.set(value, time, rampType);
    },

    $filterQ: function (value, time, rampType) {
      this._filter.Q.set(value, time, rampType);
    },

    $filterGain: function (value, time, rampType) {
      this._filter.gain.set(value, time, rampType);
    },

    noteOn: function (pitch, velocity, time) {
      time = (time || WX.now);
      var voice = new FMVoice(this);
      this.voices[pitch].push(voice);
      this.numVoice++;
      voice.noteOn(pitch, velocity, time);
    },

    noteOff: function (pitch, velocity, time) {
      time = (time || WX.now);
      var playing = this.voices[pitch];
      for (var i = 0; i < playing.length; i++) {
        playing[i].noteOff(pitch, velocity, time);
        this.numVoice--;
      }
      // TODO: is this performant enough?
      this.voices[pitch] = [];
    },

    onData: function (action, data) {
      switch (action) {
        case 'noteon':
          this.noteOn(data.pitch, data.velocity);
          break;
        case 'noteoff':
          this.noteOff(data.pitch, data.velocity);
          break;
      }
    }

  };

  // REQUIRED: extending plug-in prototype with modules
  WX.PlugIn.extendPrototype(FMK1, 'Generator');

  // REQUIRED: registering plug-in into WX ecosystem
  WX.PlugIn.register(FMK1);

})(WX);/**
 * @wapl Fader
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */
(function (WX) {

  function Fader(preset) {
    // adding modules
    WX.PlugIn.defineType(this, 'Processor');

    // node creation and patching
    // this._panner = WX.Panner();
    // this._input.to(this._panner).to(this._output);
    
    this._input.to(this._output);

    // this._panner.panningModel = 'equalpower';

    WX.defineParams(this, {

      output: {
        type: 'Generic',
        name: 'Output',
        default: 1.0,
        min: 0.0,
        max: 3.9810717055349722,
        unit: 'LinearGain'
      },

      mute: {
        type: 'Boolean',
        name: 'Mute',
        default: false
      },

      // pan: {
      //   type: 'Generic',
      //   name: 'Pan',
      //   default: 0.0,
      //   min: -1.0,
      //   max: 1.0
      // },

      dB: {
        type: 'Generic',
        name: 'dB',
        default: 0.0,
        min: -60,
        max: 12.0,
        unit: 'Decibels'
      }

    });

    // initialize preset
    WX.PlugIn.initPreset(this, preset);
  }

  Fader.prototype = {

    info: {
      name: 'Fader',
      version: '0.0.3',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Processor',
      description: 'Channel Fader'
    },

    defaultPreset: {
      mute: false,
      // pan: 0.0,
      dB: 0.0
    },

    $mute: function (value, time, rampType) {
      if (value) {
        this._outlet.gain.set(0.0, WX.now, 0);
      } else {
        this._outlet.gain.set(1.0, WX.now, 0);
      }
    },

    // $pan: function (value, time, rampType) {
    //   // TODO: compensate pan model attenuation (z=0.5)
    //   this._panner.setPosition(value, 0, 0.5);
    // },

    $dB: function (value, time, rampType) {
      this.params.output.set(WX.dbtolin(value), time, rampType);
      // console.log(this);
      // this._output.gain.set(WX.dbtolin(value), WX.now + 0.02, 1);
    }

  };

  WX.PlugIn.extendPrototype(Fader, 'Processor');
  WX.PlugIn.register(Fader);

  // NOTE: built in master output fader
  WX.Master = WX.Fader();
  WX.Master.to(WX._ctx.destination);

})(WX);// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

(function (WX) {

  'use strict';

  // Pre-defined scales: ionian, lydian, aeolian, and mixolydian.
  var SCALES = [
    { key: 'Ionian', value: 'ionian' },
    { key: 'Lydian', value: 'lydian' },
    { key: 'Mixolydian', value: 'mixolydian' },
    { key: 'Aeolian', value: 'aeolian' }
  ];

  // Pitch class for scales.
  var PITCHES = {
    'ionian': [0, 7, 14, 21, 28, 35, 43, 48],
    'lydian': [0, 6, 16, 21, 26, 35, 42, 48],
    'mixolydian': [0, 5, 16, 23, 26, 33, 41, 48],
    'aeolian': [0, 7, 15, 22, 26, 34, 39, 48]
  };

  // Number of bands. A band is consist of cascaded two bandpass filters.
  var NUM_BANDS = 8;

  /**
   * Implements harmonized 8-band filterbank.
   * @type {WAPL}
   * @param {Object} preset Parameter preset.
   * @param {Number} preset.pitch
   * @param {Number} preset.scale
   * @param {Number} preset.slope
   * @param {Number} preset.width
   * @param {Number} preset.detune
   */
  function FilterBank(preset) {

    WX.PlugIn.defineType(this, 'Processor');

    // Cascading 2 filters (serial connection) for sharp resonance.
    this._filters1 = [];
    this._filters2 = [];
    this._gains = [];
    this._summing = WX.Gain();
    for (var i = 0; i < NUM_BANDS; ++i) {
      this._filters1[i] = WX.Filter();
      this._filters2[i] = WX.Filter();
      this._gains[i] = WX.Gain();
      this._filters1[i].type = 'bandpass';
      this._filters2[i].type = 'bandpass';
      this._input.to(this._filters1[i]);
      this._filters1[i].to(this._filters2[i]).to(this._gains[i]);
      this._gains[i].to(this._summing);
    }
    this._summing.to(this._output);

    // Gain compensation. The resulting loudness of filterbank is fairly small.
    this._summing.gain.value = 35.0;

    // Parameter definition
    WX.defineParams(this, {

      pitch: {
        type: 'Generic',
        name: 'Pitch',
        default: 24,
        min: 12,
        max: 48
      },

      scale: {
        type: 'Itemized',
        name: 'Scale',
        default: 'lydian',
        model: SCALES
      },

      slope: {
        type: 'Generic',
        name: 'Harmonics',
        default: 0.26,
        min: 0.1,
        max: 0.75
      },

      width: {
        type: 'Generic',
        name: 'Width',
        default: 0.49,
        min: 0.0,
        max: 1.0
      },

      detune: {
        type: 'Generic',
        name: 'Detune',
        default: 0.0,
        min: 0.0,
        max: 1.0
      }

    });

    WX.PlugIn.initPreset(this, preset);
  }

  FilterBank.prototype = {

    info: {
      name: 'FilterBank',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Processor',
      description: 'Harmonized 8-band filterbank'
    },

    defaultPreset: {
      pitch: 34,
      scale: 'lydian',
      slope: 0.65,
      width: 0.15,
      detune: 0.0
    },

    // Change frequency of filters
    $pitch: function (value, time, rampType) {
      var f0 = WX.mtof(value);
      for (var i = 0; i < NUM_BANDS; i++) {
        this._filters1[i].frequency.set(f0, time, rampType);
        this._filters2[i].frequency.set(f0, time, rampType);
      }
    },

    // Change detune of filters. (Note that this is in cents.)
    $scale: function (value, time, rampType) {
      time = (WX.now || time);
      var pitches = PITCHES[value];
      for (var i = 1; i < NUM_BANDS; i++) {
        this._filters1[i].detune.set(pitches[i] * 100, time, rampType);
        this._filters2[i].detune.set(pitches[i] * 100, time, rampType);
      }
    },

    $slope: function (value, time, rampType) {
      for (var i = 0; i < NUM_BANDS; i++) {
        // Gain balancing formula.
        var gain = 1.0 + Math.sin(Math.PI + (Math.PI/2 * (value + i/NUM_BANDS)));
        this._gains[i].gain.set(gain, time, rampType);
      }
    },

    $width: function (value, time, rampType) {
      for (var i = 1; i < NUM_BANDS; i++) {
        // Q formula.
        var q = 2 + 90 * Math.pow((1 - i / NUM_BANDS), value);
        this._filters1[i].Q.set(q, time, rampType);
        this._filters2[i].Q.set(q, time, rampType);
      }
    },

    // TO FIX: detune handler
    $detune: function (value, time, rampType) {

    },

    getScaleModel: function () {
      return SCALES.slice(0);
    }

    // TO FIX: noteon, noteoff. Interactive features.

  };

  WX.PlugIn.extendPrototype(FilterBank, 'Processor');
  WX.PlugIn.register(FilterBank);

})(WX);/**
 * @wapl Impulse
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */
(function (WX) {

  'use strict';

  // pre-generation of impulse data
  // NOTE: static data for all Impulse instances
  var binSize = 2048,
      mag = new Float32Array(binSize),
      phase = new Float32Array(binSize);
  for (var i = 0; i < binSize; ++i) {
    mag[i] = 1.0;
    phase[i] = 0.0;
  }
  var DATA = WX.PeriodicWave(mag, phase);

  /** REQUIRED: plug-in constructor **/
  function Impulse(preset) {

    // REQUIRED: adding necessary modules
    WX.PlugIn.defineType(this, 'Generator');

    this._impulse = WX.OSC();
    this._impulse.to(this._output);
    this._impulse.start(0);

    this._impulse.setPeriodicWave(DATA);

    WX.defineParams(this, {

      freq: {
        type: 'Generic',
        name: 'Freq',
        default: 1.0,
        min: 0.1,
        max: 60.0,
        unit: 'Hertz'
      }

    });

    // REQUIRED: initializing instance with preset
    WX.PlugIn.initPreset(this, preset);
  }

  /** REQUIRED: plug-in prototype **/
  Impulse.prototype = {

    // REQUIRED: plug-in info
    info: {
      name: 'Impulse',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Generator',
      description: 'Impulse (train) Generator'
    },

    // REQUIRED: plug-in default preset
    defaultPreset: {
      freq: 1.0
    },

    // REQUIRED: if you have a parameter,
    //           corresponding handler is required.
    $freq: function (value, time, rampType) {
      this._impulse.frequency.set(value, time, rampType);
    }

  };

  // REQUIRED: extending plug-in prototype with modules
  WX.PlugIn.extendPrototype(Impulse, 'Generator');

  // REQUIRED: registering plug-in into WX ecosystem
  WX.PlugIn.register(Impulse);

})(WX);/**
 * @wapl Noise
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */
(function (WX) {

  'use strict';

  // const noise type
  var NOISETYPE = [
    { key: 'White', value: 'white' },
    { key: 'Pink', value: 'pink' }
  ];

  // pre-generation of gaussian white noise
  // http://www.musicdsp.org/showone.php?id=113
  function createGaussian(duration) {
    var length = Math.floor(WX.srate * duration);
    var noiseFloat32 = new Float32Array(length);
    for (var i = 0; i < length; i++) {
      var r1 = Math.log(Math.random()), r2 = Math.PI * Math.random();
      noiseFloat32[i] = Math.sqrt(-2.0 * r1) * Math.cos(2.0 * r2) * 0.5;
    }
    var noiseBuffer = WX.Buffer(2, length, WX.srate);
    noiseBuffer.getChannelData(0).set(noiseFloat32, 0);
    noiseBuffer.getChannelData(1).set(noiseFloat32, 0);
    return noiseBuffer;
  }

  // NEEDS TO BE TESTED
  // pre-generation of pink noise
  // http://home.earthlink.net/~ltrammell/tech/pinkalg.htm
  // http://home.earthlink.net/~ltrammell/tech/pinkgen.c
  function createPink(duration) {
    var length = Math.floor(WX.srate * duration);
    var noiseFloat32 = new Float32Array(length);
    // pink noise specific
    var pA = [3.8024, 2.9694, 2.5970, 3.0870, 3.4006],
        pSum = [0.00198, 0.01478, 0.06378, 0.23378, 0.91578],
        pASum = 15.8564,
        sample = 0,
        contrib = [0.0, 0.0, 0.0, 0.0, 0.0];
    for (var i = 0; i < length; i++) {
      var ur1 = Math.random(), ur2 = Math.random();
      for (var j = 0; j < 5; j++) {
        if (ur1 <= pSum[j]) {
          sample -= contrib[j];
          contrib[j] = 2 * (ur2 - 0.5) * pA[j];
          sample += contrib[j];
          break;
        }
      }
      noiseFloat32[i] = sample / pASum;
    }
    // console.log(noiseFloat32); // debug
    var noiseBuffer = WX.Buffer(2, length, WX.srate);
    noiseBuffer.getChannelData(0).set(noiseFloat32, 0);
    noiseBuffer.getChannelData(1).set(noiseFloat32, 0);
    return noiseBuffer;
  }

  var _baseBufferGaus = createGaussian(10.0),
      _baseBufferPink = createPink(10.0);


  /**
   * [Noise description]
   * @param {[type]} preset [description]
   */
  function Noise(preset) {

    // REQUIRED: adding necessary modules
    WX.PlugIn.defineType(this, 'Generator');

    this._bufferGaus = createGaussian(9.73);
    this._bufferPink = createPink(9.73);

    this._src1 = WX.Source();
    this._src2 = WX.Source();
    this._src1.to(this._output);
    this._src2.to(this._output);
    this._src1.loop = true;
    this._src2.loop = true;
    this._src1.start(0);
    this._src2.start(0);

    WX.defineParams(this, {

      type: {
        type: 'Itemized',
        name: 'Type',
        default: 'white',
        model: NOISETYPE
      }

    });

    // REQUIRED: initializing instance with preset
    WX.PlugIn.initPreset(this, preset);
  }

  /** REQUIRED: plug-in prototype **/
  Noise.prototype = {

    // REQUIRED: plug-in info
    info: {
      name: 'Noise',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Generator',
      description: 'White and Pink Noise Generator'
    },

    // REQUIRED: plug-in default preset
    defaultPreset: {
      type: 'white'
    },

    $type: function (value, time, rampType) {
      switch (value) {
        case 'white':
          this._src1.buffer = _baseBufferGaus;
          this._src2.buffer = this._bufferGaus;
          this._src1.loopStart = Math.random() * 10.0;
          break;
        case 'pink':
          this._src1.buffer = _baseBufferPink;
          this._src2.buffer = this._bufferPink;
          this._src1.loopStart = Math.random() * 10.0;
          break;
      }
    }

  };

  // REQUIRED: extending plug-in prototype with modules
  WX.PlugIn.extendPrototype(Noise, 'Generator');

  // REQUIRED: registering plug-in into WX ecosystem
  WX.PlugIn.register(Noise);

})(WX);/**
 * @wapl SP1
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */

// TODO
// - filter? mod?
// -

(function (WX) {

  'use strict';

  // internal abstraction for polyphony impl
  function SP1Voice(sampler) {

    this.parent = sampler;
    this.params = sampler.params;
    this.voiceKey = null;
    this.minDur = null;

    this._src = WX.Source();
    this._srcGain = WX.Gain();
    this._src.to(this._srcGain).to(this.parent._filter);
    this._src.loop = true;
    this._src.buffer = this.parent.clip.buffer;
    // this._src.onended = function () {
    //   // DO SOMETHING
    // }.bind(this);

  }

  SP1Voice.prototype = {

    noteOn: function (pitch, velocity, time) {
      var p = this.params,
          basePitch = p.tune.get(),
          att = p.ampAttack.get(),
          dec = p.ampDecay.get(),
          sus = p.ampSustain.get(),
          scale = p.velocityMod.get() ? WX.veltoamp(velocity) : 1.0;
      if (p.pitchMod.get()) {
        this._src.playbackRate.value = Math.pow(2, (pitch - basePitch) / 12);
      }
      this._src.start(time);
      this._srcGain.gain.set(0.0, time, 0);
      this._srcGain.gain.set(scale, time + att, 1);
      this._srcGain.gain.set(sus * scale, [time + att, dec], 3);
      // calculate minimum duration
      // if noteOff comes after minDur, cancel AParam is not needed
      this.minDur = time + att + dec;
    },

    noteOff: function (pitch, velocity, time) {
      if (this.minDur) {
        time = time < WX.now ? WX.now : time;
        var p = this.params,
            rel = p.ampRelease.get();
        this.voiceKey = pitch;
        this._src.stop(this.minDur + rel + 1.0);
        // if noteOff happens before minDur
        // : cancel scheduled ADS envelope and then start releasing
        if (time < this.minDur) {
          this._srcGain.gain.cancel(this.minDur);
          this._srcGain.gain.set(0.0, [this.minDur, rel], 3);
        } else {
          this._srcGain.gain.set(0.0, [time, rel], 3);
        }
      }
    }

  };


  /** REQUIRED: plug-in constructor **/
  function SP1(preset) {

    // REQUIRED: adding necessary modules
    WX.PlugIn.defineType(this, 'Generator');

    this.ready = false;
    this.clip = null;
    this.numVoice = 0;

    // naive voice management
    this.voices = [];
    for (var i = 0; i < 128; i++) {
      this.voices[i] = [];
    }

    // patching
    this._filter = WX.Filter();
    this._filter.to(this._output);

    // parameter definition
    WX.defineParams(this, {

      tune: {
        type: 'Generic',
        name: 'Tune',
        default: 48,
        min: 0,
        max: 127,
        unit: 'Semitone'
      },

      pitchMod: {
        type: 'Boolean',
        name: 'PitchMod',
        default: true
      },

      velocityMod: {
        type: 'Boolean',
        name: 'VeloMod',
        default: true
      },

      ampAttack: {
        type: 'Generic',
        name: 'Att',
        default: 0.02,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      ampDecay: {
        type: 'Generic',
        name: 'Dec',
        default: 0.04,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      ampSustain: {
        type: 'Generic',
        name: 'Sus',
        default: 0.25,
        min: 0.0,
        max: 1.0,
        unit: 'LinearGain'
      },

      ampRelease: {
        type: 'Generic',
        name: 'Rel',
        default: 0.2,
        min: 0.0,
        max: 10.0,
        unit: 'Seconds'
      },

      filterType: {
        type: 'Itemized',
        name: 'FiltType',
        default: 'lowpass',
        model: WX.FILTER_TYPES
      },

      filterFrequency: {
        type: 'Generic',
        name: 'FiltFreq',
        default: 2500,
        min: 20,
        max: 20000,
        unit: 'Hertz'
      },

      filterQ: {
        type: 'Generic',
        name: 'FiltQ',
        default: 0.0,
        min: 0.0,
        max: 40.0
      },

      filterGain: {
        type: 'Generic',
        name: 'FiltGain',
        default: 0.0,
        min: -40.0,
        max: 40.0,
        unit: 'LinearGain'
      }

    });

    // REQUIRED: initializing instance with preset
    WX.PlugIn.initPreset(this, preset);
  }

  /** REQUIRED: plug-in prototype **/
  SP1.prototype = {

    // REQUIRED: plug-in info
    info: {
      name: 'SP1',
      version: '0.0.1',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Generator',
      description: 'Versatile Single-Zone Sampler'
    },

    // REQUIRED: plug-in default preset
    defaultPreset: {
      tune: 60,
      pitchMod: true,
      velocityMod: true,
      ampAttack: 0.01,
      ampDecay: 0.44,
      ampSustain: 0.06,
      ampRelease: 0.06,
      filterType: 'LP',
      filterFrequency: 5000,
      filterQ: 0.0,
      filterGain: 0.0,
      output: 1.0
    },

    // REQUIRED: if you have a parameter,
    //           corresponding handler is required.
    $filterType: function (value, time, rampType) {
      this._filter.type = value;
    },

    $filterFrequency: function (value, time, rampType) {
      this._filter.frequency.set(value, time, rampType);
    },

    $filterQ: function (value, time, rampType) {
      this._filter.Q.set(value, time, rampType);
    },

    $filterGain: function (value, time, rampType) {
      this._filter.gain.set(value, time, rampType);
    },

    noteOn: function (pitch, velocity, time) {
      time = (time || WX.now);
      var voice = new SP1Voice(this);
      this.voices[pitch].push(voice);
      this.numVoice++;
      voice.noteOn(pitch, velocity, time);
    },

    noteOff: function (pitch, velocity, time) {
      time = (time || WX.now);
      var playing = this.voices[pitch];
      for (var i = 0; i < playing.length; i++) {
        playing[i].noteOff(pitch, velocity, time);
        this.numVoice--;
      }
      // TODO: is this performant enough?
      this.voices[pitch] = [];
    },

    // realtime input data responder (Ktrl responder)
    onData: function (action, data) {
      switch (action) {
        case 'noteon':
          this.noteOn(data.pitch, data.velocity);
          break;
        case 'noteoff':
          this.noteOff(data.pitch, data.velocity);
          break;
      }
    },

    _onprogress: function (event, clip) {
      // TODO
    },

    _onloaded: function (clip) {
      this.setClip(clip);
      WX.Log.info('Clip loaded:', clip.name);
    },

    onReady: null,

    isReady: function () {
      return this.ready;
    },

    setClip: function (clip) {
      this.clip = clip;
      this.ready = true;
      if (this.onReady) {
        this.onReady();
      }
    },

    loadClip: function (clip) {
      WX.loadClip(
        clip,
        this._onloaded.bind(this),
        this._onprogress.bind(this)
      );
    }
  };

  // REQUIRED: extending plug-in prototype with modules
  WX.PlugIn.extendPrototype(SP1, 'Generator');

  // REQUIRED: registering plug-in into WX ecosystem
  WX.PlugIn.register(SP1);

})(WX);// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

(function (WX) {

  'use strict';

  /**
   * Implements SimpleOsc insturment.
   * @type {WAPL}
   * @name SimpleOsc
   * @class
   * @memberOf WX
   * @param {Object} preset Parameter preset.
   * @param {GenericParam} preset.oscType Oscillator type.
   * @param {GenericParam} preset.oscFreq Oscillator frequency.
   * @param {ItermizedParam} preset.lfoType LFO type.
   * @param {GenericParam} preset.lfoRate LFO rate.
   * @param {GenericParam} preset.lfoDepth LFO depth.
   */
  function SimpleOsc(preset) {

    // REQUIRED: adding necessary modules
    WX.PlugIn.defineType(this, 'Generator');

    // patching, lfo frequency modulation
    this._lfo = WX.OSC();
    this._lfoGain = WX.Gain();
    this._osc = WX.OSC();
    this._amp = WX.Gain();
    this._osc.to(this._amp).to(this._output);
    this._lfo.to(this._lfoGain).to(this._osc.detune);
    this._lfo.start(0);
    this._osc.start(0);

    this._amp.gain.value = 0.0;

    // parameter definition
    WX.defineParams(this, {

      oscType: {
        type: 'Itemized',
        name: 'Waveform',
        default: 'sine', // all code-side representation should be 'value'
        model: WX.WAVEFORMS
      },

      oscFreq: {
        type: 'Generic',
        name: 'Freq',
        default: WX.mtof(60),
        min: 20.0,
        max: 5000.0,
        unit: 'Hertz'
      },

      lfoType: {
        type: 'Itemized',
        name: 'LFO Type',
        default: 'sine',
        model: WX.WAVEFORMS
      },

      lfoRate: {
        type: 'Generic',
        name: 'Rate',
        default: 1.0,
        min: 0.0,
        max: 20.0,
        unit: 'Hertz'
      },

      lfoDepth: {
        type: 'Generic',
        name: 'Depth',
        default: 1.0,
        min: 0.0,
        max: 500.0,
        unit: 'LinearGain'
      }

    });

    WX.PlugIn.initPreset(this, preset);
  }

  SimpleOsc.prototype = {

    info: {
      name: 'SimpleOsc',
      version: '0.0.2',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Generator',
      description: '1 OSC with LFO'
    },

    defaultPreset: {
      oscType: 'sine',
      oscFreq: WX.mtof(60),
      lfoType: 'sine',
      lfoRate: 1.0,
      lfoDepth: 1.0
    },

    $oscType: function (value, time, rampType) {
      this._osc.type = value;
    },

    $oscFreq: function (value, time, rampType) {
      this._osc.frequency.set(value, time, rampType);
    },

    $lfoType: function (value, time, rampType) {
      this._lfo.type = value;
    },

    $lfoRate: function (value, time, rampType) {
      this._lfo.frequency.set(value, time, rampType);
    },

    $lfoDepth: function (value, time, rampType) {
      this._lfoGain.gain.set(value, time, rampType);
    },

    /**
     * Start a note with pitch, velocity at time in seconds.
     * @param  {Number} pitch    MIDI pitch
     * @param  {Number} velocity MIDI velocity.
     * @param  {Number} time     Time in seconds.
     */
    noteOn: function (pitch, velocity, time) {
      time = (time || WX.now);
      this._amp.gain.set(velocity / 127, [time, 0.02], 3);
      this.params.oscFreq.set(WX.mtof(pitch), time + 0.02, 0);
      // this.$oscFreq(WX.mtof(pitch), time + 0.02, 0);
    },

    /**
     * Stop a note at time in seconds.
     * @param  {Number} time     Time in seconds.
     */
    noteOff: function (time) {
      time = (time || WX.now);
      this._amp.gain.set(0.0, [time, 0.2], 3);
    },

    /**
     * Route incoming event data from other WAAX input devices.
     * @param  {String} action Action type: ['noteon', 'noteoff']
     * @param  {Object} data   Event data.
     * @param  {Object} data.pitch   MIDI Pitch
     * @param  {Object} data.velocity   MIDI Velocity.
     */
    onData: function (action, data) {
      switch (action) {
        case 'noteon':
          this.noteOn(data.pitch, data.velocity);
          break;
        case 'noteoff':
          this.noteOff();
          break;
      }
    }
  };

  WX.PlugIn.extendPrototype(SimpleOsc, 'Generator');
  WX.PlugIn.register(SimpleOsc);

})(WX);/**
 * @wapl StereoDelay
 * @author Hongchan Choi (hoch, hongchan.choi@gmail.com)
 */
(function (WX) {

  'use strict';

  /** REQUIRED: plug-in constructor **/
  function StereoDelay(preset) {

    // REQUIRED: adding necessary modules
    WX.PlugIn.defineType(this, 'Processor');

    // patching
    this._lDelay = WX.Delay();
    this._rDelay = WX.Delay();
    this._lFeedback = WX.Gain();
    this._rFeedback = WX.Gain();
    this._lXtalk = WX.Gain();
    this._rXtalk = WX.Gain();
    this._dry = WX.Gain();
    this._wet = WX.Gain();
    var _splitter = WX.Splitter(2);
    var _merger = WX.Merger(2);
    // source distribution
    this._input.to(_splitter, this._dry);
    // left channel
    _splitter.connect(this._lDelay, 0);
    this._lDelay.to(this._lFeedback);
    this._lFeedback.to(this._lDelay, this._rXtalk);
    this._lXtalk.to(this._lDelay);
    this._lDelay.connect(_merger, 0, 0);
    // right channel
    // NOTE: splitter only uses left channel feed.
    // (to be revisited)
    _splitter.connect(this._rDelay, 0);
    this._rDelay.to(this._rFeedback);
    this._rFeedback.to(this._rDelay, this._lXtalk);
    this._rXtalk.to(this._rDelay);
    this._rDelay.connect(_merger, 0, 1);
    // summing
    _merger.to(this._wet);
    this._dry.to(this._output);
    this._wet.to(this._output);

    // parameters
    WX.defineParams(this, {

      delayTimeLeft: {
        type: 'Generic',
        name: 'L Delay',
        default: 0.125,
        min: 0.025,
        max: 5,
        unit: 'Seconds'
      },

      delayTimeRight: {
        type: 'Generic',
        name: 'R Delay',
        default: 0.25,
        min: 0.025,
        max: 5,
        unit: 'Seconds'
      },

      feedbackLeft: {
        type: 'Generic',
        name: 'L FB',
        default: 0.25,
        min: 0.0,
        max: 1.0
      },

      feedbackRight: {
        type: 'Generic',
        name: 'R FB',
        default: 0.125,
        min: 0.0,
        max: 1.0
      },

      crosstalk: {
        type: 'Generic',
        name: 'Crosstalk',
        default: 0.1,
        min: 0.0,
        max: 1.0
      },

      mix: {
        type: 'Generic',
        name: 'Mix',
        default: 0.2,
        min: 0.0,
        max: 1.0
      }

    });

    // REQUIRED: initializing instance with preset
    WX.PlugIn.initPreset(this, preset);
  }

  /** REQUIRED: plug-in prototype **/
  StereoDelay.prototype = {

    // REQUIRED: plug-in info
    info: {
      name: 'StereoDelay',
      version: '0.0.3',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Processor',
      description: 'Pingpong Delay with Feedback Control'
    },

    // REQUIRED: plug-in default preset
    defaultPreset: {
      delayTimeLeft: 0.125,
      delayTimeRight: 0.250,
      feedbackLeft: 0.250,
      feedbackRight: 0.125,
      crosstalk: 0.1,
      mix: 0.2
    },

    $delayTimeLeft: function (value, time, rampType) {
      this._lDelay.delayTime.set(value, time, rampType);
    },

    $delayTimeRight: function (value, time, rampType) {
      this._rDelay.delayTime.set(value, time, rampType);
    },

    $feedbackLeft: function (value, time, rampType) {
      this._lFeedback.gain.set(value, time, rampType);
    },

    $feedbackRight: function (value, time, rampType) {
      this._rFeedback.gain.set(value, time, rampType);
    },

    $crosstalk: function (value, time, rampType) {
      this._lXtalk.gain.set(value, time, rampType);
      this._rXtalk.gain.set(value, time, rampType);
    },

    $mix: function (value, time, rampType) {
      this._dry.gain.set(1.0 - value, time, rampType);
      this._wet.gain.set(value, time, rampType);
    }

  };

  // REQUIRED: extending plug-in prototype with modules
  WX.PlugIn.extendPrototype(StereoDelay, 'Processor');

  // REQUIRED: registering plug-in into WX ecosystem
  WX.PlugIn.register(StereoDelay);

})(WX);// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

(function (WX) {

  'use strict';

  /**
   * Implements monophonic subtractive synthsizer.
   * @type {WAPL}
   * @param {Object} preset Parameter preset.
   * @param {Number} preset.osc1type Oscillator 1 waveform type.
   * @param {Number} preset.osc1octave Oscillator 1 octave.
   * @param {Number} preset.osc1gain Oscillator 1 gain.
   * @param {Number} preset.osc2type Oscillator 2 waveform type.
   * @param {Number} preset.osc2detune Oscillator 2 detune.
   * @param {Number} preset.osc2gain Oscillator 2 gain.
   * @param {Number} preset.glide Pitch glide time in seconds.
   * @param {Number} preset.cutoff LPF cutoff frequency.
   * @param {Number} preset.reso LPF resonance.
   * @param {Number} preset.filterMod Filter modulation amount.
   * @param {Number} preset.filterAttack Filter envelope attack.
   * @param {Number} preset.filterDecay Filter envelope decay.
   * @param {Number} preset.filterSustain Filter envelope sustain.
   * @param {Number} preset.filterRelease Filter envelope release.
   * @param {Number} preset.ampAttack Amplitude envelope attack.
   * @param {Number} preset.ampDecay Amplitude envelope decay.
   * @param {Number} preset.ampSustain Amplitude envelope sustain.
   * @param {Number} preset.ampRelease Amplitude envelope release.
   * @param {Number} preset.output Plug-in output gain.
   */
  function WXS1(preset) {

    WX.PlugIn.defineType(this, 'Generator');

    this._osc1 = WX.OSC();
    this._osc2 = WX.OSC();
    this._osc1gain = WX.Gain();
    this._osc2gain = WX.Gain();
    this._lowpass = WX.Filter();
    this._amp = WX.Gain();

    this._osc1.to(this._osc1gain).to(this._lowpass);
    this._osc2.to(this._osc2gain).to(this._lowpass);
    this._lowpass.to(this._amp);
    this._amp.to(this._output);

    this._osc1.start(0);
    this._osc2.start(0);

    // close envelope by default
    this._amp.gain.value = 0.0;

    // for monophonic behaviour
    this._pitchTimeStamps = {};

    // parameter definition
    WX.defineParams(this, {

      osc1type: {
        type: 'Itemized',
        name: 'Waveform',
        default: 'square',
        model: WX.WAVEFORMS
      },

      osc1octave: {
        type: 'Generic',
        name: 'Octave',
        default: 0,
        min: -5,
        max: 5,
        unit: 'Octave'
      },

      osc1gain: {
        type: 'Generic',
        name: 'Gain',
        default: 0.5,
        min: 0.0,
        max: 1.0,
        unit: 'LinearGain'
      },

      osc2type: {
        type: 'Itemized',
        name: 'Waveform',
        default: 'square',
        model: WX.WAVEFORMS
      },

      osc2detune: {
        type: 'Generic',
        name: 'Semitone',
        default: 0,
        min: -60,
        max: 60,
        unit: 'Semitone'
      },

      osc2gain: {
        type: 'Generic',
        name: 'Gain',
        default: 0.5,
        min: 0.0,
        max: 1.0,
        unit: 'LinearGain'
      },

      glide: {
        type: 'Generic',
        name: 'Glide',
        default: 0.02,
        min: 0.006,
        max: 1.0,
        unit: 'Seconds'
      },

      cutoff: {
        type: 'Generic',
        name: 'Cutoff',
        default: 1000,
        min: 20,
        max: 5000,
        unit: 'Hertz'
      },

      reso: {
        type: 'Generic',
        name: 'Reso',
        default: 0.0,
        min: 0.0,
        max: 20.0,
        unit: ''
      },

      filterMod: {
        type: 'Generic',
        name: 'FiltMod',
        default: 1.0,
        min: 0.25,
        max: 8.0,
        unit: ''
      },

      filterAttack: {
        type: 'Generic',
        name: 'FiltAtt',
        default: 0.02,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      filterDecay: {
        type: 'Generic',
        name: 'FiltDec',
        default: 0.04,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      filterSustain: {
        type: 'Generic',
        name: 'FiltSus',
        default: 0.25,
        min: 0.0,
        max: 1.0
      },

      filterRelease: {
        type: 'Generic',
        name: 'FiltRel',
        default: 0.2,
        min: 0.0,
        max: 10.0,
        unit: 'Seconds'
      },

      ampAttack: {
        type: 'Generic',
        name: 'Att',
        default: 0.02,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      ampDecay: {
        type: 'Generic',
        name: 'Dec',
        default: 0.04,
        min: 0.0,
        max: 5.0,
        unit: 'Seconds'
      },

      ampSustain: {
        type: 'Generic',
        name: 'Sus',
        default: 0.25,
        min: 0.0,
        max: 1.0
      },

      ampRelease: {
        type: 'Generic',
        name: 'Rel',
        default: 0.2,
        min: 0.0,
        max: 10.0,
        unit: 'Seconds'
      }
    });

    WX.PlugIn.initPreset(this, preset);
  }

  WXS1.prototype = {

    info: {
      name: 'WXS1',
      version: '0.0.3',
      api_version: '1.0.0-alpha',
      author: 'Hongchan Choi',
      type: 'Generator',
      description: '2 OSC Monophonic Subtractive Synth'
    },

    defaultPreset: {
      osc1type: 'square',
      osc1octave: -1,
      osc1gain: 0.4,
      osc2type: 'square',
      osc2detune: 7.0,
      osc2gain: 0.4,
      glide: 0.02,
      cutoff: 140,
      reso: 18.0,
      filterMod: 7,
      filterAttack: 0.01,
      filterDecay: 0.07,
      filterSustain: 0.5,
      filterRelease: 0.03,
      ampAttack: 0.01,
      ampDecay: 0.44,
      ampSustain: 0.2,
      ampRelease: 0.06,
      output: 0.8
    },

    $osc1type: function (value, time, rampType) {
      this._osc1.type = value;
    },

    $osc1octave: function (value, time, rampType) {
      this._osc1.detune.set(value * 1200, time, rampType);
    },

    $osc1gain: function (value, time, rampType) {
      this._osc1gain.gain.set(value, time, rampType);
    },

    $osc2type: function (value, time, rampType) {
      this._osc2.type = value;
    },

    $osc2detune: function (value, time, rampType) {
      this._osc2.detune.set(value * 100, time, rampType);
    },

    $osc2gain: function (value, time, rampType) {
      this._osc2gain.gain.set(value, time, rampType);
    },

    $cutoff: function (value, time, rampType) {
      this._lowpass.frequency.set(value, time, rampType);
    },

    $reso: function (value, time, rampType) {
      this._lowpass.Q.set(value, time, rampType);
    },

    // Returns a key index with the most recent pitch in the map. If all keys
    // are off, returns null.
    _getCurrentPitch: function () {
      var latestPitch = null,
          latestTimeStamp = 0;
      for (var pitch in this._pitchTimeStamps) {
        var timeStamp = this._pitchTimeStamps[pitch];
        if (timeStamp > latestTimeStamp) {
          latestTimeStamp = timeStamp;
          latestPitch = pitch;
        }
      }
      return latestPitch;
    },

    _changePitch: function (pitch, time) {
      time = (time || WX.now) + this.params.glide.get();
      var freq = WX.mtof(pitch);
      this._osc1.frequency.set(freq, time, 1);
      this._osc2.frequency.set(freq, time, 1);
    },

    _startEnvelope: function (time) {
      time = (time || WX.now);
      var p = this.params,
          aAtt = p.ampAttack.get(),
          aDec = p.ampDecay.get(),
          fAmt = p.filterMod.get() * 1200,
          fAtt = p.filterAttack.get(),
          fDec = p.filterDecay.get(),
          fSus = p.filterSustain.get();
      // attack
      this._amp.gain.set(1.0, [time, aAtt], 3);
      this._lowpass.detune.set(fAmt, [time, fAtt], 3);
      // decay
      this._amp.gain.set(fSus, [time + aAtt, aDec], 3);
      this._lowpass.detune.set(fAmt * fSus, [time + fAtt, fDec], 3);
    },

    _releaseEnvelope: function (time) {
      time = (time || WX.now);
      var p = this.params;
      // cancel pre-programmed envelope data points
      this._amp.gain.cancel(time);
      this._lowpass.detune.cancel(time);
      // release
      this._amp.gain.set(0.0, [time, p.ampRelease.get()], 3);
      this._lowpass.detune.set(0.0, [time, p.filterRelease.get()], 3);
    },

    onData: function (action, data) {
      switch (action) {
        case 'noteon':
          this._pitchTimeStamps[data.pitch] = data.time;
          var pitch = this._getCurrentPitch();
          // The first key will start envelopes.
          if (Object.keys(this._pitchTimeStamps).length === 1) {
            this._changePitch(pitch, data.time);
            this._startEnvelope(data.time);
          } else {
            this._changePitch(pitch, data.time);
          }
          break;
        case 'noteoff':
          if (this._pitchTimeStamps.hasOwnProperty(data.pitch)) {
            delete this._pitchTimeStamps[data.pitch];
          }
          var pitch = this._getCurrentPitch();
          // There is no key pressed. Release envelope.
          if (pitch === null) {
            this._releaseEnvelope(data.time);
          } else {
            this._changePitch(pitch, data.time);
          }
          break;
      }
    }
  };

  WX.PlugIn.extendPrototype(WXS1, 'Generator');
  WX.PlugIn.register(WXS1);

})(WX);
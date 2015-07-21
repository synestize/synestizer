// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

/**
 * @namespace WX
 */
window.WX = {
  _VERSION: '1.0.0-alpha3'
};

// Monkey patching and feature detection.
var _webkitAC = window.hasOwnProperty('webkitAudioContext');
var _AC = window.hasOwnProperty('AudioContext');

if (!_webkitAC && !_AC) {
  throw new Error('Error: Web Audio API is not supported on your browser.');
} else {
  if (_webkitAC && !_AC) {
    window.AudioContext = window.webkitAudioContext;
  }
}

// Create AudioContext.
WX._ctx = new AudioContext();

// Checking the minimum dependency.
var _dependency = [
  // 'createStereoPanner',
];

for (var i = 0; i < _dependency.length; i++) {
  if (typeof WX._ctx[_dependency[i]] === 'undefined') {
    var message = 'Error: "' + _dependency + '" is not supported in AudioContext.';
    throw new Error(message);
  }
}

/**
 * @typedef WAPL
 * @description Web Audio API Plug-in Object.
 * @type {Object}
 */

/**
 * @typedef WXModel
 * @description Contains a model for data binding.
 * @type {Array}
 * @example
 * var model = [
 *   { key:'Sine', value:'sine' },
 *   { key:'Sawtooth', value:'sawtooth' }
 *   ...
 * ];
 */

/**
 * @typedef WXClip
 * @description WAAX abstraction of sample and meta data.
 * @type {Object}
 * @property {String} name User-defined name of sample.
 * @property {String} url URL of audio file.
 * @property {Object} buffer A placeholder for ArrayBuffer object.
 * @example
 * var clip = {
 *   name: 'Cool Sample',
 *   url: 'http://mystaticdata.com/samples/coolsample.wav',
 *   buffer: null
 * };
 */

/**
 * @typedef WXSampleZone
 * @description WAAX abstraction of sampler instrument data.
 * @type {Object}
 * @property {WXClip} clip WXClip object.
 * @property {Number} basePitch Original sample pitch.
 * @property {Boolean} loop Looping flag.
 * @property {Number} loopStart Loop start point in seconds.
 * @property {Number} loopEnd Loop end point in seconds.
 * @property {Number} pitchLow Low pitch bound.
 * @property {Number} pitchHigh High pitch bound.
 * @property {Number} velocityLow Low velocity bound.
 * @property {Number} velocityHigh High velocity bound.
 * @property {Boolean} pitchModulation Switch for pitch sensitivity modulation.
 * @property {Boolean} velocityModulatio Switch for velocity sensitivity modulation.
 * @example
 * var sampleZone = {
 *   clip: WXClip
 *   basePitch: 60            // samples original pitch
 *   loop: true,
 *   loopStart: 0.1,
 *   loopEnd: 0.5,
 *   pitchLow: 12,            // pitch low bound
 *   pitchHigh: 96,           // pitch high bound
 *   velocityLow: 12,         // velocity lower bound
 *   velocityHigh: 127,       // velocity high bound
 *   pitchModulation: true,   // use pitch modulation
 *   velocityModulatio: true  // use velocity moduation
 * };
 */// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

/**
 * Injects into window.AudioNode
 * @namespace AudioNode
 */

/**
 * Connects a WA node to the other WA nodes. Note that this method is
 *   injected to AudioNode.prototype. Supports multiple outgoing
 *   connections. (fanning out) Returns the first WA node to enable method
 *   chaining.
 * @memberOf AudioNode
 * @param {...AudioNode} nodes WA nodes.
 * @return {AudioNode} The first target WA node.
 */
AudioNode.prototype.to = function () {
  for (var i = 0; i < arguments.length; i++) {
    this.connect(arguments[i]);
  }
  return arguments[0];
};

/**
 * Disconnects outgoing connection of a WA node. Note that this method is
 *   injected to AudioNode.prototype.
 * @memberOf AudioNode
 */
AudioNode.prototype.cut = function () {
  this.disconnect();
};

/**
 * Injects into window.AudioParam
 * @namespace AudioParam
 */

/**
 * Equivalent of AudioParam.cancelScheduledValues. Cancels scheduled value
 *   after a given starting time.
 * @memberOf AudioParam
 * @method
 * @see  http://www.w3.org/TR/webaudio/#dfn-cancelScheduledValues
 */
AudioParam.prototype.cancel = AudioParam.prototype.cancelScheduledValues;

/**
 * Manipulates AudioParam dynamically.
 * @memberOf AudioParam
 * @param {Number} value Target parameter value
 * @param {Number|Array} time Automation start time. With rampType 3, this
 *   argument must be an array specifying [start time, time constant].
 * @param {Number} rampType Automation ramp type. 0 = step, 1 = linear,
 *   2 = exponential, 3 = target value [start, time constant].
 * @see  http://www.w3.org/TR/webaudio/#methodsandparams-AudioParam-section
 */
AudioParam.prototype.set = function (value, time, rampType) {
  var now = WX.now;
  switch (rampType) {
    case 0:
    case undefined:
      time = (time < now) ? now : time;
      this.setValueAtTime(value, time);
      // TO FIX: when node is not connected, automation will not work
      // this hack handles the error
      if (time <= now && value !== this.value) {
        this.value = value;
      }
      break;
    case 1:
      time = (time < now) ? now : time;
      this.linearRampToValueAtTime(value, time);
      break;
    case 2:
      time = (time < now) ? now : time;
      value = value <= 0.0 ? 0.00001 : value;
      this.exponentialRampToValueAtTime(value, time);
      break;
    case 3:
      time[0] = (time[0] < now) ? now : time[0];
      value = value <= 0.0 ? 0.00001 : value;
      this.setTargetAtTime(value, time[0], time[1]);
      break;
  }
};

// ECMA Script 5 getter for current time and srate.
Object.defineProperties(WX, {

  /**
   * Returns current audio context time. (ECMA Script 5 Getter)
   * @memberOf WX
   * @return {Number} Current audio context time in seconds.
   */
  now: {
    get: function () {
      return WX._ctx.currentTime;
    }
  },

  /**
   * Returns current audio device sample rate. (ECMA Script 5 Getter)
   * @memberOf WX
   * @return {Number} Current sample rate.
   */
  srate: {
    get: function () {
      return WX._ctx.sampleRate;
    },
  }
});

/**
 * Creates an instance of WA Gain node.
 * @return {AudioNode} WA Gain node.
 * @see  http://www.w3.org/TR/webaudio/#GainNode
 */
WX.Gain = function() {
  return WX._ctx.createGain();
};

/**
 * Creates an instance of WA Oscillator node.
 * @return {AudioNode} WA Oscillator node.
 * @see  http://www.w3.org/TR/webaudio/#OscillatorNode
 */
WX.OSC = function() {
  return WX._ctx.createOscillator();
};

/**
 * Creates an instance of WA Delay node.
 * @return {AudioNode} WA Delay node.
 * @see  http://www.w3.org/TR/webaudio/#DelayNode
 */
WX.Delay = function() {
  return WX._ctx.createDelay();
};

/**
 * Creates an instance of WA BiquadFilter node.
 * @return {AudioNode} WA BiquadFilter node.
 * @see  http://www.w3.org/TR/webaudio/#BiquadFilterNode
 */
WX.Filter = function() {
  return WX._ctx.createBiquadFilter();
};

/**
 * Creates an instance of WA DynamicCompressor node.
 * @return {AudioNode} WA DynamicsCompressor node.
 * @see  http://www.w3.org/TR/webaudio/#DynamicsCompressorNode
 */
WX.Comp = function() {
  return WX._ctx.createDynamicsCompressor();
};

/**
 * Creates an instance of WA Convolver node.
 * @return {AudioNode} WA Convolver node.
 * @see  http://www.w3.org/TR/webaudio/#ConvolverNode
 */
WX.Convolver = function() {
  return WX._ctx.createConvolver();
};

/**
 * Creates an instance of WA WaveShaper node.
 * @return {AudioNode} WA WaveShaper node.
 * @see  http://www.w3.org/TR/webaudio/#WaveShaperNode
 */
WX.WaveShaper = function() {
  return WX._ctx.createWaveShaper();
};

/**
 * Creates an instance of WA BufferSource node.
 * @return {AudioNode} WA BufferSource node.
 * @see  http://www.w3.org/TR/webaudio/#BufferSourceNode
 */
WX.Source = function() {
  return WX._ctx.createBufferSource();
};

/**
 * Creates an instance of WA Analyzer node.
 * @return {AudioNode} WA Analyzer node.
 * @see  http://www.w3.org/TR/webaudio/#AnalyzerNode
 */
WX.Analyzer = function() {
  return WX._ctx.createAnalyser();
};

/**
 * Creates an instance of WA Panner node.
 * @return {AudioNode} WA Panner node.
 * @see  http://www.w3.org/TR/webaudio/#PannerNode
 */
WX.Panner = function() {
  return WX._ctx.createPanner();
};

/**
 * Creates an instance of WA PerodicWave object.
 * @return {AudioNode} WA PeriodicWave object.
 * @see  http://www.w3.org/TR/webaudio/#PeriodicWave
 */
WX.PeriodicWave = function () {
  return WX._ctx.createPeriodicWave.apply(WX._ctx, arguments);
};

/**
 * Creates an instance of WA Splitter node.
 * @return {AudioNode} WA Splitter node.
 * @see  http://www.w3.org/TR/webaudio/#SplitterNode
 */
WX.Splitter = function () {
  return WX._ctx.createChannelSplitter.apply(WX._ctx, arguments);
};

/**
 * Creates an instance of WA Merger node.
 * @return {AudioNode} WA Merger node.
 * @see  http://www.w3.org/TR/webaudio/#MergerNode
 */
WX.Merger = function () {
  return WX._ctx.createChannelMerger.apply(WX._ctx, arguments);
};

/**
 * Creates an instance of WA Buffer object.
 * @return {AudioNode} WA Buffer object.
 * @see  http://www.w3.org/TR/webaudio/#Buffer
 */
WX.Buffer = function () {
  return WX._ctx.createBuffer.apply(WX._ctx, arguments);
};

WX.WAVEFORMS = [
  { key: 'Sine', value: 'sine' },
  { key: 'Square', value: 'square' },
  { key: 'Sawtooth', value: 'sawtooth' },
  { key: 'Triangle', value: 'triangle' }
];

WX.FILTER_TYPES = [
  { key:'LP' , value: 'lowpass' },
  { key:'HP' , value: 'highpass' },
  { key:'BP' , value: 'bandpass' },
  { key:'LS' , value: 'lowshelf' },
  { key:'HS' , value: 'highshelf' },
  { key:'PK' , value: 'peaking' },
  { key:'BR' , value: 'notch' },
  { key:'AP' , value: 'allpass' }
];// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

/**
 * Features system-wide logging utilities.
 * @namespace WX.Log
 */
WX.Log = {
  // log level. (1: info, 2: warn, 3: error)
  _LEVEL: 1
};

/**
 * Sets logging level.
 * @param {Number} level logging level { 1: info, 2: warn, 3: error }
 */
WX.Log.setLevel = function (level) {
  this._LEVEL = level;
};

/**
 * Prints an informative message on console.
 * @param {...String} message messages to be printed
 */
WX.Log.info = function () {
  if (this._LEVEL > 1) return;
  var args = Array.prototype.slice.call(arguments);
  args.unshift('[WX:info]');
  window.console.log.apply(window.console, args);
};

/**
 * Prints a warning message on console.
 * @param {...String} message messages to be printed.
 */
WX.Log.warn = function () {
  if (this._LEVEL > 2) return;
  var args = Array.prototype.slice.call(arguments);
  args.unshift('[WX:warn]');
  window.console.log.apply(window.console, args);
};

/**
 * Prints an error message on console and throws an error.
 * @param {...String} message messages to be printed.
 */
WX.Log.error = function () {
  var args = Array.prototype.slice.call(arguments);
  args.unshift('[WX:error]');
  window.console.log.apply(window.console, args);
  throw new Error('[WX:error]');
};

/**
 * Returns WAAX API version number. (semantic version)
 * @returns {Number} WAAX API version number
 * @see http://semver.org/
 */
WX.getVersion = function () {
  return this._VERSION;
};

// Object manipulation and music math.
// : Features utilities for object manipulation, music math and more.
//   Note that all utility methods are under WX namespace.
// References
// : http://underscorejs.org/docs/underscore.html
// : https://github.com/libpd/libpd/blob/master/pure-data/src/x_acoustics.c

/**
 * Checks if an argument is a JS object.
 * @returns {Boolean}
 */
WX.isObject = function (obj) {
  return obj === Object(obj);
};

/**
 * Checks if an argument is a JS function.
 * @returns {Boolean}
 */
WX.isFunction = function (fn) {
  return (typeof fn) === 'function';
};

/**
 * Checks if an argument is a JS array.
 * TODO: be less of a total hack.
 * @returns {Boolean}
 */
WX.isArray = function (arr) {
  return ('slice' in arr);
};

/**
 * Checks if the type of an argument is Number.
 * @returns {Boolean}
 */
WX.isNumber = function (num) {
  return (typeof num) === 'number';
};

/**
 * Checks if the type of an argument is Boolean.
 * @returns {Boolean}
 */
WX.isBoolean = function (bool) {
  return (typeof bool) ===  'boolean';
};

/**
 * Checks if a WAAX plug-in has a parameter
 * @param {String} param Parameter name
 * @returns {Boolean}
 */
WX.hasParam = function(plugin, param) {
  return hasOwnProperty.call(plugin.params, param);
};

/**
 * Extends target object with the source object. If two objects have
 *   duplicates, properties in target object will be overwritten.
 * @param  {Object} target Object to be extended
 * @param  {Object} source Object to be injected
 * @returns {Object} A merged object.
 */
WX.extend = function (target, source) {
  for (var prop in source) {
    target[prop] = source[prop];
  }
  return target;
};

/**
 * Retunrs a clone of JS object. This returns shallow copy.
 * @param  {Object} source Object to be cloned
 * @returns {Object} Cloned object
 */
WX.clone = function (source) {
  var obj = {};
  for (var prop in source) {
    obj[prop] = source[prop];
  }
  return obj;
};

/**
 * Validates a WAAX model. This verifies if all the keys in the
 * model is unique. WAAX model is a collection of key-value pairs
 * that is useful for data binding or templating.
 * @param  {Array} model WAAX model
 * @returns {Boolean}
 * @example
 * // Example WAAX model for waveform types
 * var model = [
 *   { key:'Sine', value:'sine' },
 *   { key:'Sawtooth', value:'sawtooth' }
 *   ...
 * ];
 */
WX.validateModel = function (model) {
  if (model.length === 0) {
    return false;
  }
  var keys = [];
  for (var i = 0; i < model.length; i++) {
    if (keys.indexOf(model[i].key) > -1) {
      return false;
    } else {
      keys.push(model[i].key);
    }
  }
  return true;
};

/**
 * Finds a key from a model by a value.
 * @param  {Array} model WAAX model
 * @param  {*} value Value in model
 * @returns {String|null} Key or null when not found.
 * @see {@link WX.Model} for WAAX model specification.
 */
WX.findKeyByValue = function (model, value) {
  for (var i = 0; i < model.length; i++) {
    if (model[i].value === value) {
      return model[i].key;
    }
  }
  return null;
};

/**
 * Finds a value from a model by a key.
 * @param  {Array} model WAAX model
 * @param  {String} key Key in model
 * @returns {*|null} Value or null when not found.
 * @see {@link WX.validateModel} for WAAX model specification.
 */
WX.findValueByKey = function (model, key) {
  for (var i = 0; i < model.length; i++) {
    if (model[i].key === key) {
      return model[i].value;
    }
  }
  return null;
};

/**
 * Clamps a number into a range specified by min and max.
 * @param  {Number} value Value to be clamped
 * @param  {Number} min   Range minimum
 * @param  {Number} max   Range maximum
 * @return {Number}       Clamped value
 */
WX.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generates a floating point random number between min and max.
 * @param  {Number} min Range minimum
 * @param  {Number} max Range maximum
 * @return {Number}     A floating point random number
 */
WX.random2f = function (min, max) {
  return min + Math.random() * (max - min);
};

/**
 * Generates an integer random number between min and max.
 * @param  {Number} min Range minimum
 * @param  {Number} max Range maximum
 * @return {Number}     An integer random number
 */
WX.random2 = function (min, max) {
  return Math.round(min + Math.random() * (max - min));
};

/**
 * Converts a MIDI pitch number to frequency.
 * @param  {Number} midi MIDI pitch (0 ~ 127)
 * @return {Number}      Frequency (Hz)
 */
WX.mtof = function (midi) {
  if (midi <= -1500) return 0;
  else if (midi > 1499) return 3.282417553401589e+38;
  else return 440.0 * Math.pow(2, (Math.floor(midi) - 69) / 12.0);
};

/**
 * Converts frequency to MIDI pitch.
 * @param  {Number} freq Frequency
 * @return {Number}      MIDI pitch
 */
WX.ftom = function (freq) {
  return Math.floor(
    freq > 0 ?
    Math.log(freq/440.0) / Math.LN2 * 12 + 69 : -1500
  );
};

/**
 * Converts power to decibel. Note that it is off by 100dB to make it
 *   easy to use MIDI velocity to change volume. This is the same
 *   convention that PureData uses. This behaviour might change in the
 *   future.
 * @param  {Number} power Power
 * @return {Number}       Decibel
 */
WX.powtodb = function (power) {
  if (power <= 0) return 0;
  else {
    var db = 100 + 10.0 / Math.LN10 * Math.log(power);
    return db < 0 ? 0 : db;
  }
};

/**
 * Converts decibel to power. Note that it is off by 100dB to make it
 *   easy to use MIDI velocity to change volume. This is the same
 *   convention that PureData uses. This behaviour might change in the
 *   future.
 * @param  {Number} db Decibel
 * @return {Number}    Power
 */
WX.dbtopow = function (db) {
  if (db <= 0) return 0;
  else {
    // TODO: what is 870?
    if (db > 870) db = 870;
    return Math.exp(Math.LN10 * 0.1 * (db - 100.0));
  }
};

/**
 * Converts RMS(root-mean-square) to decibel.
 * @param  {Number} rms RMS value
 * @return {Number}     Decibel
 */
WX.rmstodb = function (rms) {
  if (rms <= 0) return 0;
  else {
    var db = 100 + 20.0 / Math.LN10 * Math.log(rms);
    return db < 0 ? 0 : db;
  }
};

/**
 * Converts decibel to RMS(root-mean-square).
 * @param  {Number} db  Decibel
 * @return {Number}     RMS value
 */
WX.dbtorms = function (db) {
  if (db <= 0) return 0;
  else {
    // TO FIX: what is 485?
    if (db > 485) db = 485;
    return Math.exp(Math.LN10 * 0.05 * (db - 100.0));
  }
};

/**
 * Converts linear amplitude to decibel.
 * @param  {Number} lin Linear amplitude
 * @return {Number}     Decibel
 */
WX.lintodb = function (lin) {
  // if below -100dB, set to -100dB to prevent taking log of zero
  return 20.0 * (lin > 0.00001 ? (Math.log(lin) / Math.LN10) : -5.0);
};

/**
 * Converts decibel to linear amplitude. Useful for dBFS conversion.
 * @param  {Number} db  Decibel
 * @return {Number}     Linear amplitude
 */
WX.dbtolin = function (db) {
  return Math.pow(10.0, db / 20.0);
};

/**
 * Converts MIDI velocity to linear amplitude.
 * @param  {Number} velocity MIDI velocity
 * @return {Number}     Linear amplitude
 */
WX.veltoamp = function (velocity) {
  // TODO: velocity curve here?
  return velocity / 127;
};

/**
 * Loads WAAX clip by XHR loading
 * @param  {Object} clip WAAX Clip
 * @param  {callback_loadClip_oncomplete} oncomplete Function called when
 *   completed.
 * @param  {callback_loadClip_onprogress} onprogress <i>Optional.</i>
 *   Callback for progress report.
 * @example
 * // Creates a WAAX clip on the fly.
 * var clip = {
 *   name: 'Cool Sample',
 *   url: 'http://mystaticdata.com/samples/coolsample.wav',
 *   buffer: null
 * };
 * // Loads the clip and assign the buffer to a sampler plug-in.
 * WX.loadClip(clip, function (clip) {
 *   mySampler.setBuffer(clip.buffer);
 * });
 */
WX.loadClip = function (clip, oncomplete, onprogress) {
  if (!oncomplete) {
    WX.Log.error('Specify `oncomplete` action.');
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', clip.url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onprogress = function (event) {
    if (onprogress) {
      onprogress(event, clip);
    }
  };
  xhr.onload = function (event) {
    try {
      WX._ctx.decodeAudioData(
        xhr.response,
        function (buffer) {
          clip.buffer = buffer;
          oncomplete(clip);
        }
      );
    } catch (error) {
      WX.Log.error('Loading clip failed. (XHR failure)', error.message, clip.url);
    }
  };
  xhr.send();
};

/**
 * Callback for clip loading completion. Called by {@link WX.loadClip}.
 * @callback callback_loadclip_oncomplete
 * @param {Object} clip WAAX clip
 * @see WX.loadClip
 */

/**
 * Callback for clip loading progress report. called by {@link WX.loadClip}.
 * @callback callback_loadclip_onprogress
 * @param {Object} event XHR progress event object
 * @param {Object} clip WAAX clip
 * @see WX.loadClip
 * @see https://dvcs.w3.org/hg/progress/raw-file/tip/Overview.html
 */// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

//
// Parameter Abstractions
//

// parameter types for internal reference
var PARAM_TYPES = [
  'Generic',
  'Itemized',
  'Boolean'
];

// units for paramter
var PARAM_UNITS = [
  '',
  'Octave',
  'Semitone',
  'Seconds',
  'Milliseconds',
  'Samples',
  'Hertz',
  'Cents',
  'Decibels',
  'LinearGain',
  'Percent',
  'BPM'
];

// utility: check if the param arg is numeric
function wxparam_checkNumeric(arg, defaultValue) {
  if (WX.isNumber(arg)) {
    return arg;
  } else if (arg === undefined) {
    return defaultValue;
  } else {
    WX.Log.error('Invalid parameter configuration:', arg);
  }
}

// Parameter factory. Creates an instance of paramter class.
function wxparam_create(options) {
  if (PARAM_TYPES.indexOf(options.type) < 0) {
    WX.Log.error('Invalid Parameter Type.');
  }
  switch (options.type) {
    case 'Generic':
      return new GenericParam(options);
    case 'Itemized':
      return new ItemizedParam(options);
    case 'Boolean':
      return new BooleanParam(options);
  }
}


/**
 * Generic parameter(numerical and ranged) abstraction. Usually called by
 *   {@link WX.defineParams} method.
 * @name GenericParam
 * @class
 * @param {Object} options Parameter configruation.
 * @param {String} options.name User-defined parameter name.
 * @param {String} options.unit Parameter unit.
 * @param {Number} options.default Default value.
 * @param {Number} options.value Parameter value.
 * @param {Number} options.min Minimum value.
 * @param {Number} options.max Maximum value.
 * @param {Object} options._parent Reference to associated Plug-in.
 */
function GenericParam(options) {
  this.init(options);
}

GenericParam.prototype = {

  /**
   * Initializes instance with options.
   * @memberOf GenericParam
   * @param  {Object} options Paramter configuration.
   */
  init: function (options) {
    this.type = 'Generic';
    this.name = (options.name || 'Parameter');
    this.unit = (options.unit || '');
    this.value = this.default = wxparam_checkNumeric(options.default, 0.0);
    this.min = wxparam_checkNumeric(options.min, 0.0);
    this.max = wxparam_checkNumeric(options.max, 1.0);
    // parent, reference to the plug-in
    this._parent = options._parent;
    // handler callback
    this.$callback = options._parent['$' + options._paramId];
  },

  /**
   * Sets parameter value with time and ramp type. Calls back
   *   a corresponding handler.
   * @memberOf GenericParam
   * @param {Number} value Parameter target value
   * @param {Number|Array} time time or array of [start time, time constant]
   * @param {Number} rampType WAAX ramp type
   */
  set: function (value, time, rampType) {
    // set value in this parameter instance
    this.value = WX.clamp(value, this.min, this.max);
    // then call hander if it's defined
    if (this.$callback) {
      this.$callback.call(this._parent, this.value, time, rampType);
    }
  },

  /**
   * Returns the paramter value. Note that this is not a computed value
   *   of WA AudioParam instance.
   * @memberOf GenericParam
   * @return {Number} Latest paramter value.
   */
  get: function () {
    return this.value;
  }

};

/**
 * Itemized parameter abstraction. Usually called by {@link WX.defineParams}
 *   method.
 * @name ItemizedParam
 * @class
 * @param {Object} options Parameter configruation.
 * @param {String} options.name User-defined parameter name.
 * @param {String} options.model Option items.
 * @param {Number} options.default Default item.
 * @param {Number} options.value Current item.
 * @param {Object} options._parent Reference to associated Plug-in.
 */
function ItemizedParam(options) {
  this.init(options);
}

ItemizedParam.prototype = {

  /**
   * Initializes instance with options.
   * @memberOf ItemizedParam
   * @param  {Object} options Paramter configuration.
   */
  init: function (options) {
    // assertion
    if (!WX.isArray(options.model)) {
      Log.error('Model is missing.');
    }
    if (!WX.validateModel(options.model)) {
      Log.error('Invalid Model.');
    }
    // initialization
    this.type = 'Itemized';
    this.name = (options.name || 'Select');
    this.model = options.model;
    this.default = (options.default || this.model[0].value);
    this.value = this.default;
    // caching parent
    this._parent = options._parent;
    // handler callback assignment
    this.$callback = options._parent['$' + options._paramId];
  },

  /**
   * Sets parameter value with time and ramp type. Calls back
   *   a corresponding handler.
   * @memberOf ItemizedParam
   * @param {Number} value Parameter target value
   * @param {Number|Array} time time or array of
   *   <code>[start time, time constant]</code>
   * @param {Number} rampType WAAX ramp type
   */
  set: function (value, time, rampType) {
    // check if value is valid 
    if (WX.findKeyByValue(this.model, value)) {
      this.value = value;
      if (this.$callback) {
        this.$callback.call(this._parent, this.value, time, rampType);
      }
    } else {
      WX.Log.warn('Invalid value (value not found in model).');
    }
  },

  /**
   * Returns the paramter value. Note that this is not a computed value
   *   of WA AudioParam instance.
   * @memberOf ItemizedParam
   * @return {Number} Latest paramter value.
   */
  get: function () {
    return this.value;
  },

  /**
   * Returns the reference of items (WAAX model).
   * @memberOf ItemizedParam
   * @return {Array} WAAX model associated with the parameter.
   */
  getModel: function () {
    return this.model;
  }

};

/**
 * Boolean parameter abstraction. Usually called by {@link WX.defineParams}
 *   method.
 * @name BooleanParam
 * @class
 * @param {Object} options Parameter configruation.
 * @param {String} options.name User-defined parameter name.
 * @param {Number} options.default Default value.
 * @param {Number} options.value Current value.
 * @param {Object} options._parent Reference to associated Plug-in.
 */
function BooleanParam(options) {
  this.init(options);
}

BooleanParam.prototype = {

  /**
   * Initializes instance with options.
   * @memberOf BooleanParam
   * @param {Object} options Paramter configuration.
   */
  init: function (options) {
    if (!WX.isBoolean(options.default)) {
      Log.error('Invalid value for Boolean Parameter.');
    }
    this.type = 'Boolean';
    this.name = (options.name || 'Toggle');
    this.value = this.default = options.default;
    this._parent = options._parent;
    // handler callback assignment
    this.$callback = options._parent['$' + options._paramId];
  },

  /**
   * Sets parameter value with time and ramp type. Calls back
   *   a corresponding handler.
   * @memberOf BooleanParam
   * @param {Number} value Parameter target value
   * @param {Number|Array} time time or array of
   *   <code>[start time, time constant]</code>
   * @param {Number} rampType WAAX ramp type
   */
  set: function (value, time, rampType) {
    if (WX.isBoolean(value)) {
      this.value = value;
      if (this.$callback) {
        this.$callback.call(this._parent, this.value, time, rampType);
      }
    }
  },

  /**
   * Returns the paramter value. Note that this is not a computed value
   *   of WA AudioParam instance.
   * @memberOf BooleanParam
   * @return {Number} Latest paramter value.
   */
  get: function () {
    return this.value;
  }

};

/**
 * Defines parameters by specified options.
 * @memberOf WX
 * @param {Object} plugin WAAX Plug-in
 * @param {Object} paramOptions A collection of parameter option objects
 *   . See {@link GenericParam}, {@link ItemizedParam} and
 *   {@link BooleanParam} for available parameter options.
 * @example
 * WX.defineParams(this, {
 *   oscFreq: {
 *     type: 'Generic',
 *     name: 'Freq',
 *     default: WX.mtof(60),
 *     min: 20.0,
 *     max: 5000.0,
 *     unit: 'Hertz'
 *   },
 *   ...
 * };
 */
WX.defineParams = function (plugin, paramOptions) {
  for (var key in paramOptions) {
    paramOptions[key]._parent = plugin;
    paramOptions[key]._paramId = key;
    plugin.params[key] = wxparam_create(paramOptions[key]);
  }
};


/**
 * Create an envelope generator function for WA audioParam.
 * @param {...Array} array Data points of
 *   <code>[value, offset time, ramp type]<code>
 * @returns {Function} Envelope generator function.
 *   <code>function(start time, scale factor)</code>
 * @example
 * // build an envelope generator with relative data points
 * var env = WX.Envelope([0.0, 0.0], [0.8, 0.01, 1], [0.0, 0.3, 2]);
 * // changes gain with an envelope starts at 2.0 sec with 1.2
 *   amplification.
 * synth.set('gain', env(2.0, 1.2));
 */
WX.Envelope = function () {
  var args = arguments;
  return function (startTime, amplifier) {
    var env = [];
    startTime = (startTime || 0);
    amplifier = (amplifier || 1.0);
    for (var i = 0; i < args.length; i++) {
      var val = args[i][0], time;
      // when time argument is array, branch to setTargetAtValue
      if (WX.isArray(args[i][1])) {
        time = [startTime + args[i][1][0], startTime + args[i][1][1]];
        env.push([val * amplifier, time, 3]);
      }
      // otherwise use step, linear or exponential ramp
      else {
        time = startTime + args[i][1];
        env.push([val * amplifier, time, (args[i][2] || 0)]);
      }
    }
    return env;
  };
};


//
// Plug-in Abstractions
//

// plug-in types
var PLUGIN_TYPES = [
  'Generator',
  'Processor',
  'Analyzer'
];

// registered plug-ins
var registered = {
  Generator: [],
  Processor: [],
  Analyzer: []
};

/**
 * Plug-In base class.
 * @name PlugInAbstract
 * @class
 */
function PlugInAbstract () {
  this.params = {};
}

PlugInAbstract.prototype = {

  /**
   * Connects a plug-in output to the other plug-in's input or a WA node.
   *   Note that this does not support multiple outgoing connection.
   *   (fanning-out)
   * @memberOf PlugInAbstract
   * @param {WAPL|AudioNode} target WAPL(Web Audio Plug-In)
   *   compatible plug-in or WA node.
   * @returns {WAPL|AudioNode}
   */
  to: function (target) {
    // when the target is a plug-in with inlet.
    if (target._inlet) {
      this._outlet.to(target._inlet);
      return target;
    }
    // or it might simply be a WA node.
    else {
      try {
        this._outlet.to(target);
        return target;
      } catch (error) {
        WX.Log.error('Connection failed. Invalid patching.');
      }
    }
  },

  /**
   * Disconnects all outgoing connections fomr plug-in.
   * @memberOf PlugInAbstract
   */
  cut: function () {
    this._outlet.cut();
  },

  /**
   * Sets a plug-in parameter. Supports dynamic parameter assignment.
   * @memberOf PlugInAbstract
   * @param {String} param Parameter name.
   * @param {Array|Number} arg An array of data points or a single value.
   * @return {WAPL} Self-reference for method chaining.
   * @example
   * // setting parameter with an array
   * myeffect.set('gain', [[0.0], [1.0, 0.01, 1], [0.0, 0.5, 2]]);
   * // setting parameter with a value (immediate change)
   * myeffect.set('gain', 0.0);
   */
  set: function (param, arg) {
    if (WX.hasParam(this, param)) {
      // check if arg is a value or array
      if (WX.isArray(arg)) {
        // if env is an array, iterate envelope data
        // where array is arg_i = [value, time, rampType]
        for (var i = 0; i < arg.length; i++) {
          this.params[param].set.apply(this, arg[i]);
        }
      } else {
        // otherwise change the value immediately
        this.params[param].set(arg, WX.now, 0);
      }
    }
    return this;
  },

  /**
   * Gets a paramter value.
   * @memberOf PlugInAbstract
   * @param {String} param Parameter name.
   * @return {*} Paramter value. Returns null when a paramter not found.
   */
  get: function (param) {
    if (WX.hasParam(this, param)) {
      return this.params[param].get();
    } else {
      return null;
    }
  },

  /**
   * Sets plug-in preset, which is a collection of parameters. Note that
   *   setting a preset changes all the associated parameters immediatley.
   * @memberOf PlugInAbstract
   * @param {Object} preset A collection of paramters.
   */
  setPreset: function (preset) {
    for (var param in preset) {
      this.params[param].set(preset[param], WX.now, 0);
    }
  },

  /**
   * Gets a current plug-in paramters as a collection. Note that the
   *   collection is created on the fly. It is a clone of current parameter
   *   values.
   * @memberOf PlugInAbstract
   * @return {Object} Preset.
   */
  getPreset: function () {
    var preset = {};
    for (var param in this.params) {
      preset[param] = this.params[param].get();
    }
    return preset;
  }

};


/**
 * Generator plug-in class. No audio inlet.
 * @name Generator
 * @class
 * @extends PlugInAbstract
 * @param {Object} params
 * @param {Number} params.output Plug-in output gain.
 */
function Generator() {

  // extends PlugInAbstract
  PlugInAbstract.call(this);

  // creating essential WA nodes
  this._output = WX.Gain();
  this._outlet = WX.Gain();
  // and patching
  this._output.to(this._outlet);

  // paramter definition
  WX.defineParams(this, {

    output: {
      type: 'Generic',
      name: 'Output',
      default: 1.0,
      min: 0.0,
      max: 1.0,
      unit: 'LinearGain'
    }

  });

}

Generator.prototype = {

  /**
   * Parameter handler for <code>params.output</code>
   * @memberOf Generator
   * @private
   */
  $output: function (value, time, rampType) {
    this._output.gain.set(value, time, rampType);
  }

};

// extends prototype with PlugInAbstract
WX.extend(Generator.prototype, PlugInAbstract.prototype);


/**
 * Processor plug-in class. Features both inlet and outlet.
 * @name Processor
 * @class
 * @extends PlugInAbstract
 * @param {Object} params
 * @param {Generic} params.input Input gain.
 * @param {Generic} params.output Output gain.
 * @param {Boolean} params.bypass Bypass switch.
 */
function Processor() {

  // extends PlugInAbstract
  PlugInAbstract.call(this);

  // WA nodes
  this._inlet = WX.Gain();
  this._input = WX.Gain();
  this._output = WX.Gain();
  this._active = WX.Gain();
  this._bypass = WX.Gain();
  this._outlet = WX.Gain();
  // patching
  this._inlet.to(this._input, this._bypass);
  this._output.to(this._active).to(this._outlet);
  this._bypass.to(this._outlet);

  // initialization for bypass
  this._active.gain.value = 1.0;
  this._bypass.gain.value = 0.0;

  WX.defineParams(this, {

    input: {
      type: 'Generic',
      name: 'Input',
      default: 1.0,
      min: 0.0,
      max: 1.0,
      unit: 'LinearGain'
    },

    output: {
      type: 'Generic',
      name: 'Output',
      default: 1.0,
      min: 0.0,
      max: 1.0,
      unit: 'LinearGain'
    },

    bypass: {
      type: 'Boolean',
      name: 'Bypass',
      default: false
    }

  });

}

Processor.prototype = {

  /**
   * Parameter handler for <code>params.input</code>
   * @memberOf Processor
   * @private
   */
  $input: function (value, time, rampType) {
    this._input.gain.set(value, time, rampType);
  },

  /**
   * Parameter handler for <code>params.output</code>
   * @memberOf Processor
   * @private
   */
  $output: function (value, time, rampType) {
    this._output.gain.set(value, time, rampType);
  },

  /**
   * Parameter handler for <code>params.bypass</code>
   * @memberOf Processor
   * @private
   */
  $bypass: function(value, time, rampType) {
    time = (time || WX.now);
    if (value) {
      this._active.gain.set(0.0, time, 0);
      this._bypass.gain.set(1.0, time, 0);
    } else {
      this._active.gain.set(1.0, time, 0);
      this._bypass.gain.set(0.0, time, 0);
    }
  }

};

// extends PlugInAbstract
WX.extend(Processor.prototype, Generator.prototype);


/**
 * Analyzer plug-in class. Features both inlet, outlet and analyzer.
 * @name Analyzer
 * @class
 * @extends PlugInAbstract
 * @param {Object} params
 * @param {Generic} params.input Input gain.
 */
function Analyzer() {

  PlugInAbstract.call(this);

  this._inlet = WX.Gain();
  this._input = WX.Gain();
  this._analyzer = WX.Analyzer();
  this._outlet = WX.Gain();

  this._inlet.to(this._input).to(this._analyzer);
  this._inlet.to(this._outlet);

  WX.defineParams(this, {

    input: {
      type: 'Generic',
      name: 'Input',
      default: 1.0,
      min: 0.0,
      max: 1.0,
      unit: 'LinearGain'
    }

  });

}

Analyzer.prototype = {

  /**
   * Parameter handler for <code>params.input</code>
   * @private
   * @memberOf Analyzer
   */
  $input: function (value, time, xtype) {
    this._input.gain.set(value, time, xtype);
  }

};

// extends PlugInAbstract
WX.extend(Analyzer.prototype, PlugInAbstract.prototype);


//
// Plug-in utilities
//

/**
 * @namespace WX.PlugIn
 */
WX.PlugIn = {};

/**
 * Defines type of a plug-in. Required in plug-in definition.
 * @param {WAPL} plugin Target plug-in.
 * @param {String} type Plug-in type. <code>['Generator', 'Processor',
 *   'Analyzer']</code>
 */
WX.PlugIn.defineType = function (plugin, type) {
  // check: length should be less than 3
  if (PLUGIN_TYPES.indexOf(type) < 0) {
    WX.Log.error('Invalid Plug-in type.');
  }
  // branch on plug-in type
  switch (type) {
    case 'Generator':
      Generator.call(plugin);
      break;
    case 'Processor':
      Processor.call(plugin);
      break;
    case 'Analyzer':
      Analyzer.call(plugin);
      break;
  }
};

/**
 * Initializes plug-in preset. Merges default preset with user-defined
 *   preset. Required in plug-in definition.
 * @param {WAPL} plugin Target plug-in.
 * @param {Object} preset Preset.
 */
WX.PlugIn.initPreset = function (plugin, preset) {
  var merged = WX.clone(plugin.defaultPreset);
  WX.extend(merged, preset);
  plugin.setPreset(merged);
};

/**
 * Extends plug-in prototype according to the type. Required in plug-in
 *   definition.
 * @param {WAPL} plugin Target plug-in.
 * @param {String} type Plug-in type. <code>['Generator', 'Processor',
 *   'Analyzer']</code>
 */
WX.PlugIn.extendPrototype = function (plugin, type) {
  // check: length should be less than 3
  if (PLUGIN_TYPES.indexOf(type) < 0) {
    WX.Log.error('Invalid Plug-in type.');
  }
  // branch on plug-in type
  switch (type) {
    case 'Generator':
      WX.extend(plugin.prototype, Generator.prototype);
      break;
    case 'Processor':
      WX.extend(plugin.prototype, Processor.prototype);
      break;
    case 'Analyzer':
      WX.extend(plugin.prototype, Analyzer.prototype);
      break;
  }
};

/**
 * Registers the plug-in prototype to WX namespace. Required in plug-in
 *   definition.
 * @param {Function} PlugInClass Class reference (function name) of
 *   plug-in.
 */
WX.PlugIn.register = function (PlugInClass) {
  var info = PlugInClass.prototype.info;
  // hard check version info
  if (WX.getVersion() < info.api_version) {
    // FATAL: PlugInClass is incompatible with WX Core.
    WX.Log.error(PlugInClass.name, ': FATAL. incompatible WAAX version.');
  }
  // register PlugInClass in WX namespace
  registered[info.type].push(PlugInClass.name);
  WX[PlugInClass.name] = function (preset) {
    return new PlugInClass(preset);
  };
};

/**
 * Returns a list of regsitered plug-ins of a certain type.
 * @param {String} type Plug-in Type.
 * @return {Array} A list of plug-ins.
 */
WX.PlugIn.getRegistered = function (type) {
  var plugins = null;
  if (PLUGIN_TYPES.indexOf(type) > -1) {
    switch (type) {
      case undefined:
        plugins = registered.Generator.slice(0);
        plugins = plugins.concat(registered.Processor.slice(0));
        plugins = plugins.concat(registered.Analyzer.slice(0));
        break;
      case 'Generator':
        plugins = registered.Generator.slice(0);
        break;
      case 'Processor':
        plugins = registered.Processor.slice(0);
        break;
      case 'Analyzer':
        plugins = registered.Analyzer.slice(0);
        break;
    }
  }
  return plugins;
};

// WAAX is ready to serve!
WX.Log.info('WAAX', WX.getVersion(), '(' + WX.srate + 'Hz)');// Copyright 2011-2014 Hongchan Choi. All rights reserved.
// Use of this source code is governed by MIT license that can be found in the
// LICENSE file.

/**
 * @typedef MBST
 * @description Measure, beat, sixteenth, tick aka musical timebase.
 * @type {Object}
 * @property {Number} measure Measure.
 * @property {Number} beat Beat.
 * @property {Number} sixteenth Sixteenth.
 * @property {Number} tick Tick.
 */

// MBT - measure, beat, sixteenth, tick aka musical timebase.
// Tick - atomic unit for musical timebase.
// Second - unit for linear timebase.
var _TICKS_PER_BEAT = 480,
    _TICKS_PER_MEASURE = _TICKS_PER_BEAT * 4,
    _TICKS_PER_SIXTEENTH = _TICKS_PER_BEAT * 0.25;

// internal: unique ID for notes/events (4 bytes uid generator)
// see: http://stackoverflow.com/a/8809472/4155261
function generate_uid4(){
  var t = Date.now();
  var id = 'xxxx'.replace(/[x]/g, function(c) {
    var r = (t + Math.random() * 16) % 16 | 0;
    t = Math.floor(t / 16);
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
  return id;
}

/**
 * Note abstraction. Instantiated by {@link WX.Note}.
 * @name Note
 * @class
 * @param {Number} pitch MIDI pitch.
 * @param {Number} velocity MIDI velocity.
 * @param {Number} start Start time in tick.
 * @param {Number} duration Note durtion in tick.
 */
function Note(pitch, velocity, start, duration) {
  this.pitch = (pitch || 60);
  this.velocity = (velocity || 100);
  this.start = (start || 0);
  this.duration = (duration || 120);
}

Note.prototype = {

  /**
   * Changes note duration by delta.
   * @memberOf Note
   * @param  {Number} delta Duration.
   */
  changeDuration: function (delta) {
    this.duration += ~~(delta);
    this.duration = Math.max(this.duration, 1);
  },

  /**
   * Returns the note end time in tick.
   * @memberOf Note
   * @return {Number}
   */
  getEnd: function () {
    return this.start + this.duration;
  },

  /**
   * Sets note properties from a note.
   * @memberOf Note
   * @param {Note} note
   */
  setNote: function (note) {
    for (var prop in note) {
      this[prop] = note[prop];
    }
  },

  /**
   * Moves note pitch by delta.
   * @memberOf Note
   * @param  {Number} delta Pitch displacement.
   */
  translatePitch: function (delta) {
    this.pitch += ~~(delta);
    this.pitch = WX.clamp(this.pitch, 0, 127);
  },

  /**
   * Moves note pitch by delta.
   * @memberOf Note
   * @param  {Number} delta Pitch displacement.
   */
  translateStart: function (delta) {
    this.start += ~~(delta);
    this.start = Math.max(this.start, 0);
  },

  /**
   * Returns current properties in a string.
   * @memberOf Note
   * @return {String}
   */
  toString: function () {
    return this.pitch + ',' + this.velocity + ',' +
      this.start + ',' + this.duration;
  },

  /**
   * Returns start time for numeric operation.
   * @memberOf Note
   * @return {Number}
   */
  valueOf: function () {
    return this.start;
  }

};


/**
 * NoteClip abstraction. A collection of Note objects. Instantiated by 
 *   WX.NoteClip.
 * @name NoteClip
 * @class
 */
function NoteClip() {
  this._init();
}

NoteClip.prototype = {

  // Initializes or resets note clip.
  _init: function () {
    this.notes = {};
    this.start = 0;
    this.end = 0;
    this.size = 0;
  },

  /**
   * Deletes and returns a note from clip. Returns null when not found.
   * @memberOf NoteClip
   * @param  {String} id Note ID.
   * @return {Note | null}
   */
  delete: function (id) {
    if (this.notes.hasOwnProperty(id)) {
      var note = this.notes[id];
      delete this.notes[id];
      this.size--;
      return note;
    }
    return null;
  },

  /**
   * Flush out noteclip content.
   * @memberOf NoteClip
   */
  empty: function () {
    this.notes = {};
    this.size = 0;
  },

  /**
   * Find a note that contains a point specified by pitch and tick. Then
   *   returns note ID. Returns null when not found.
   *   Note that this impl might produce an undesirable result since it
   *   simply catches the first note detected in the iteration. There is no
   *   perfect solution over this problem, so I chose to make it robust
   *   instead.
   * @memberOf NoteClip
   * @param  {Number} pitch MIDI pitch
   * @param  {Number} tick Position in tick.
   * @return {String | null}
   */
  findNoteIdAtPosition: function (pitch, tick) {
    for (var id in this.notes) {
      var note = this.notes[id];
      if (note && note.pitch === pitch) {
        if (note.start <= tick && tick <= note.getEnd()) {
          return id;
        }
      }
    }
    return null;
  },

  /**
   * Find notes in a area specified by pitch and tick. Then returns an array
   *   of notes. Returns null when nothing in target area.
   *   Note that this method only care for start time of note. If a note
   *   starts before than the area, it will not be included in the selection.
   * @memberOf NoteClip
   * @param  {Number} minPitch Lower bound pitch.
   * @param  {Number} maxPitch Upper bound pitch.
   * @param  {Number} startTick Start time in tick.
   * @param  {Number} endTick End time in tick.
   * @return {Array | null}
   */
  findNotesIdInArea: function (minPitch, maxPitch, startTick, endTick) {
    var bucket = [];
    for (var id in this.notes) {
      var note = this.notes[id];
      if (note) {
        if (minPitch <= note.pitch && note.pitch <= maxPitch) {
          if (startTick <= note.start && note.start <= endTick) {
            bucket.push(id);
          }
        }
      }
    }
    return (bucket.length > 0) ? bucket : null;
  },

  /**
   * Returns note from clip with id.
   * @memberOf NoteClip
   * @param  {String} id Note ID.
   * @return {Object}
   */
  get: function (id) {
    if (this.hasId(id)) {
      return this.notes[id];
    }
    return null;
  },

  /**
   * Retunrs an array with all the ID of notes.
   * @memberOf NoteClip
   * @return {Array}
   */
  getAllId: function () {
    return Object.keys(this.notes);
  },

  /**
   * Returns clip size.
   * @memberOf NoteClip
   * @return {Number}
   */
  getSize: function () {
    return this.size;
  },

  /**
   * Probes clip with note id.
   * @memberOf NoteClip
   * @param  {String} id Note id.
   * @return {Boolean} True if clip contains the note.
   */
  hasId: function (id) {
    return this.notes.hasOwnProperty(id);
  },

  /**
   * Iterates all the notes with callback function.
   * @memberOf NoteClip
   * @param  {callback_noteclip_iterate} callback Process for iteration.
   */
  iterate: function (callback) {
    var index = 0;
    for (var id in this.notes) {
      callback(id, this.notes[id], index++);
    }
  },

  /**
   * Callback for note clip interation. Called by NoteClip.iterate.
   * @callback callback_noteclip_iterate
   * @param {String} id Note ID.
   * @param {Note} Note object.
   * @param {Number} index Iteration index.
   * @see NoteClip.iterate
   */

  /**
   * Pushes a new note into clip. Returns ID of the new note.
   * @memberOf NoteClip
   * @param  {Note} note
   * @return {String} Note ID.
   */
  push: function (note) {
    var id;
    do {
      id = generate_uid4();
    } while (this.hasId(id));
    this.notes[id] = note;
    this.size++;
    return id;
  },

  /**
   * Set a note with a specific ID. If the same ID found, update properties
   *   of the note. Otherwise, create a new note with a specified ID. Usually
   *   this method is used in the collaborative context.
   * @memberOf NoteClip
   * @param {String} id Note ID.
   * @param {Note} note Note object.
   */
  set: function (id, note) {
    if (this.hasId(id)) {
      this.notes[id].setNote(note);
    } else {
      this.notes[id] = note;
    }
  },

  /**
   * Returns an array of notes within a timespan. Returns null when not found.
   *   Note that this method actually returns Note objects, not IDs.
   * @memberOf NoteClip
   * @param  {Number} start Start time in tick.
   * @param  {Number} end End time in tick.
   * @return {Array | null}
   */
  scanNotesInTimeSpan: function (start, end) {
    var bucket = [];
    for (var id in this.notes) {
      var note = this.notes[id];
      if (note) {
        if (start <= note.start && note.start <= end) {
          bucket.push(note);
        }
      }
    }
    return (bucket.length > 0) ? bucket : null;
  }
};


//
// Router class should be here.
//


// NOTES:
// absolute time: time in audioContext
// sec: linear time in seconds
// tick: musical time, atomic unit of MBT timebase (varies on BPM)
// * if not specified in method signature, it is handled as tick
//   all the internal calculation should be in seconds

/**
 * Transport abstraction. Singleton and instantiated by default.
 * @name Transport
 * @class
 * @param {Number} BPM Beat per minute.
 */
function Transport(BPM) {
  this._init(BPM || 120);
}

Transport.prototype = {
  // TEMPORARY
  _flushPlaybackQueue: function () {
    this._playbackQueue.length = 0;
  },

  // Sets current playhead position by seconds (audioContext).
  _setPlayheadPosition: function (second) {
    this._now = second;
    this._absOrigin = WX.now - this._now;
  },

  // Scans notes in current scan range.
  _scheduleNotesInScanRange: function () {
    if (this._needsScan) {
      var notes = null;
      if (this._source) {
        notes = this._source.scanNotesInTimeSpan(
          this.sec2tick(this._scanStart),
          this.sec2tick(this._scanEnd)
        );
      }
      // push notes into playbackQueue
      if (notes) {
        for (var i = 0; i < notes.length; i++) {
          if (this._playbackQueue.indexOf(notes[i]) < 0) {
            this._playbackQueue.push(notes[i]);
          }
        }
      }
      this._needsScan = false;
    }
    // send queued notes to target plug-ins
    if (this._playbackQueue.length > 0) {
      for (var i = 0; i < this._playbackQueue.length; i++) {
        var note = this._playbackQueue[i],
            start = this._absOrigin + this.tick2sec(note.start),
            end = start + this.tick2sec(note.dur);
        // schedule notes by onData method
        // this.targets[0].onData('noteon', {
        //   pitch: note.pitch,
        //   velocity: note.velocity,
        //   time: start
        // });
        // this.targets[0].onData('noteoff', {
        //   pitch: note.pitch,
        //   velocity: 0,
        //   time :end
        // });
      }
    }
  },

  // Move the scan range of scan forward by runner.
  _advanceScanRange: function () {
    // Advances the scan range to the next block, if the scan end point is
    // close enough (< 16.7ms) to playhead.
    if (this._scanEnd - this._now < 0.0167) {
      this._scanStart = this._scanEnd;
      this._scanEnd = this._scanStart + this._lookAhead;
      this._needsScan = true;
    }
  },

  // Reset the scan range based on current playhead position.
  _resetScanRange: function () {
    this._scanStart = this._now;
    this._scanEnd =  this._scanStart + this._lookahead;
    this._needsScan = true;
  },

  // Update assigned transport MUI element. update data:
  // MBST format of now_t, loopEnd, loopStart, BPM
  _updateView: function () {

  },

  // Runs the transport (update every 16.7ms)
  _run: function () {
    // console.log(this._now);
    if (this._RUNNING) {
      // add time elapsed to now_t by checking now_ac
      var absNow = WX.now;
      this._now += (absNow - this._absLastNow);
      this._absLastNow = absNow;
      // scan notes in range
      this._scheduleNotesInScanRange();
      // advance when transport is running
      this._advanceScanRange();
      // update transport view
      this._updateView();
      // flush played notes
      this._flushPlaybackQueue();
      // check loop flag
      if (this._LOOP) {
        if (this._loopEnd - (this._now + this._lookAhead) < 0) {
          this._setPlayheadPosition(this._loopStart - (this._loopEnd - this._now));
        }
      }

      // TODO
      // Transport should have a router (note clips > in-out > plug-in)
      // 0. iterate through the router entries
      // 1. note clip entry in router -> get target plug-in
      // 2. scan note clips
      // 3. send data to plug-in
      //
      // if there is any registered plug-in for metronome
      // schedule metronome as well

      // TODO: pulse metronome
      // if (this.USE_METRONOME && this.metronome) {
      //   // if nextPulse is in lookahead range, schedule it
      //   this.metronome.play(this.now, this.lookahead);
      // }

      // ORIGINAL CODE:
      // var tick = mtime2tick(this.nextClick);
      // if (this.getLinearTime(tick) < this.ltime_now + this.lookahead) {
      //   var accent = (this.nextClick.beat % 4 === 0) ? true : false;
      //   this.metronome.play(this.getAbsoluteTime(tick), accent);
      //   this.nextClick.beat += 1;
      // }
      
    }
    // schedule next step
    requestAnimationFrame(this._run.bind(this));
  },

  // initializing transport with BPM
  _init: function (BPM) {
    // origin in absolute time and 'now' reference
    this._BPM = BPM;
    this._lastBPM = BPM;

    // beats/ticks in seconds
    this._BIS = 0.0;
    this._TIS = 0.0;

    // origin by audio context time
    // it is '0' position of playhead in linear time
    this._absOrigin = 0.0;
    this._absLastNow = 0.0;

    // now, loop, lookAhead by transport time
    this._now = 0.0;
    this._loopStart = 0.0;
    this._loopEnd = 0.0;
    this._lookAhead = 0.0;

    // playback scan range and dirty flag
    this._scanStart = 0.0;
    this._scanEnd = this._lookAhead;
    this._needsScan = true;

    // transport view element
    this._transportView = null;

    // TEMPORARY
    this._playbackQueue = [];
    this._source = null; // noteclip
    this._target = null; // plug-in

    // switches
    this._RUNNING = false;
    this._LOOP = false;
    this._USE_METRONOME = false;

    // set BPM and initiate runner
    this.setBPM(BPM);
    this._run();
  },


  // Transport Public Methods
  //
  // NOTE: the max integer in JavaScript is 9007199254740992.
  // With this number as ticks, the maximum offset of a note is
  // { measure: 1145324612, beat: 1, sixteenth: 0, tick: 32 }
  // It is about 38177487 minutes in BPM of 120. (~636291 hours, ~26512 days)
  // So, this number is good enough to cover general music making.
  //
  // Having separated notation like { measure, beat, sixteenth, tick } is
  // not really necessary. It is easy to translate both way when it's needed.
  // (i.e. displaying timing data on UI.)

  /**
   * Converts tick to second based on transport tempo.
   * @memberOf Transport
   * @param  {Number} tick Tick (atomic musical time unit)
   * @return {Number}
   */
  tick2sec: function (tick) {
    return tick * this._TIS;
  },

  /**
   * Converts second to tick based on transport tempo.
   * @memberOf Transport
   * @param  {Number} sec Second
   * @return {Number}
   */
  sec2tick: function (sec) {
    return sec / this._TIS;
  },

  /**
   * Starts playback.
   * @memberOf Transport
   */
  start: function () {
    // Arrange time references.
    var absNow = WX.now;
    this._absOrigin = absNow - this._now;
    this._absLastNow = absNow;
    // Reset scan range.
    this._resetScanRange();
    // Transport is running.
    this._RUNNING = true;
  },

  /**
   * Pauses current playback.
   * @memberOf Transport
   */
  pause: function () {
    this._RUNNING = false;
    this._flushPlaybackQueue();
  },

  /**
   * Sets playhead position by tick.
   * @memberOf Transport
   * @param {Number} tick Playhead position in ticks.
   */
  setNow: function (tick) {
    this._setPlayheadPosition(this.tick2sec(tick));
    this._resetScanRange();
  },

  /**
   * Returns playhead position by tick.
   * @memberOf Transport
   * @return {Number}
   */
  getNow: function () {
    return this.sec2tick(this._now);
  },

  /**
   * Rewinds playhead to the beginning.
   * @memberOf Transport
   */
  rewind: function () {
    this._setPlayheadPosition(0.0);
  },

  /**
   * Sets loop start position by tick.
   * @memberOf Transport
   * @param {Number} tick Loop start in tick.
   */
  setLoopStart: function (tick) {
    this._loopStart = this.tick2sec(tick);
  },

  /**
   * Sets loop end position by tick.
   * @memberOf Transport
   * @param {Number} tick Loop end in tick.
   */
  setLoopEnd: function (tick) {
    this._loopEnd = this.tick2sec(tick);
  },

  /**
   * Returns loop start by tick.
   * @memberOf Transport
   * @return {Number}
   */
  getLoopStart: function () {
    return this.sec2tick(this._loopStart);
  },

  /**
   * Returns loop end by tick.
   * @memberOf Transport
   * @return {Number}
   */
  getLoopEnd: function () {
    return this.sec2tick(this._loopEnd);
  },

  /**
   * Toggles or sets loop status.
   * @memberOf Transport
   * @param  {Boolean|undefined} bool Loop state. If undefined, it toggles the current state.
   */
  toggleLoop: function (bool) {
    if (bool === undefined) {
      this._LOOP = !this._LOOP;
    } else {
      if (WX.isBoolean(bool)) {
        this._LOOP = bool;
      } else {
        WX.Log.error('Invalid parameter. Use boolean value.');
      }
    }
  },

  /**
   * Sets transport BPM.
   * @memberOf Transport
   * @param {Number} BPM Beat per minute.
   */
  setBPM: function (BPM) {
    // calculates change factor
    this._BPM = (BPM || 120);
    var factor = this._lastBPM / this._BPM;
    this._lastBPM = this._BPM;
    // recalcualte beat in seconds, tick in seconds
    this._BIS = 60.0 / this._BPM;
    this._TIS = this._BIS / _TICKS_PER_BEAT;
    // lookahead is 16 ticks (1/128th note)
    this._lookAhead = this._TIS * 16;
    // update time references based on tempo change
    this._now *= factor;
    this._loopStart *= factor;
    this._loopEnd *= factor;
    this._absOrigin = WX.now - this._now;
  },

  /**
   * Returns current BPM.
   * @memberOf Transport
   * @return {Number}
   */
  getBPM: function () {
    return this._BPM;
  },

  /**
   * Returns current running status of transport.
   * @memberOf Transport
   * @return {Boolean}
   */
  isRunning: function () {
    return this._RUNNING;
  }

};

/**
 * Converts MBST(measure, beat, sixteenth, tick) format to tick.
 * @memberOf WX
 * @param  {MBST} Musical time in MBST format.
 * @return {Number} Musical time in tick.
 */
WX.mbst2tick = function (mtime) {
  return (mtime.measure || 0) * _TICKS_PER_MEASURE +
    (mtime.beat || 0) * _TICKS_PER_BEAT +
    (mtime.sixteenth || 0) * _TICKS_PER_SIXTEENTH +
    (mtime.tick || 0);
};

/**
 * Converts tick to MBST(measure, beat, sixteenth, tick) format.
 * @memberOf WX
 * @param  {Number} tick Tick.
 * @return {MBST} Musical time in MBST format.
 */
WX.tick2mbst = function (tick) {
  return {
    measure: ~~(tick / _TICKS_PER_MEASURE),
    beat: ~~((tick % _TICKS_PER_MEASURE) / _TICKS_PER_BEAT),
    sixteenth: ~~((tick % _TICKS_PER_BEAT) / _TICKS_PER_SIXTEENTH),
    tick: ~~(tick % _TICKS_PER_SIXTEENTH)
  };
};

/**
 * Creates a Note instance.
 * @memberOf WX
 * @param  {Number} pitch MIDI pitch (0~127)
 * @param  {Number} velocity MIDI velocity (0~127)
 * @param  {Number} start Note start time in tick.
 * @param  {Number} duration Note durtion in tick.
 * @return {Note}
 */
WX.Note = function (pitch, velocity, start, duration) {
  return new Note(pitch, velocity, start, duration);
};

/**
 * Create a NoteClip instance.
 * @memberOf WX
 * @return {NoteClip}
 */
WX.NoteClip = function () {
  return new NoteClip();
};

/**
 * Singleton instance of Transporter.
 * @type {Transport}
 */
WX.Transport = new Transport(120);
// Minimal process polyfill for legacy redux-persist
const process = {
  env: {
    NODE_ENV: 'development'
  },
  browser: true,
  version: '',
  versions: {},
  nextTick: function(callback) {
    setTimeout(callback, 0);
  }
};

if (typeof window !== 'undefined') {
  window.process = process;
}

export default process;
'use strict';
console.debug("startworker", e);

onmessage = function(e) {
  console.debug("worker", e);
  self.postMessage(e.data);
};

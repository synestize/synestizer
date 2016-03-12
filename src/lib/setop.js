'use strict';

// http://www.2ality.com/2015/01/es6-set-operations.html

let union = (a,b) => new Set([...a, ...b]);
let difference = (a,b) => new Set([...a].filter(x => !b.has(x)));
let intersection = (a,b) => new Set([...a].filter(x => b.has(x)));

module.exports = {
  union: union,
  difference: difference,
  intersection: intersection,
};
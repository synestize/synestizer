// http://www.2ality.com/2015/01/es6-set-operations.html

export const union = (a,b) => new Set([...a, ...b]);
export const difference = (a,b) => new Set([...a].filter(x => !b.has(x)));
export const intersection = (a,b) => new Set([...a].filter(x => b.has(x)));

// http://www.2ality.com/2015/01/es6-set-operations.html

export const union = (a,b) => [...a, ...b];
export const difference = (a,b) => [...a].filter(x => b.indexOf(x)<0)
export const intersection = (a,b) => [...a].filter(x => b.indexOf(x)>=0);

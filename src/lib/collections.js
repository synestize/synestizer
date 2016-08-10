// http://www.2ality.com/2015/01/es6-set-operations.html

export const union = (a,b) => [...a, ...b];
export const difference = (a,b) => [...a].filter(x => b.indexOf(x)<0)
export const intersection = (a,b) => [...a].filter(x => b.indexOf(x)>=0);

export const mapAsObj = (map) => {
  if (typeof(map.set)!=="function") {
    //already a plain object
    return map
  }
  const obj = Object.create(null);
  for (const [k,v] of map) {
      obj[k] = v;
  }
  return obj;
}
export const objAsMap = (obj) =>{
  if (typeof(obj.set)==="function") {
    //already a Map
    return obj
  }
  const map = new Map();
  for (const k of Object.keys(obj)) {
      map.set(k, obj[k]);
  }
  return map;
}
export const arrayAsSet = (arr) => {
  if (typeof(arr.add)==="function") {
    //already a plain aarray
    return arr
  }
  return new Set(arr)
}
export const setAsArray = (set) =>{
  if (typeof(set.add)!=="function") {
    //already a Map
    return set
  }
  return [...set]
}

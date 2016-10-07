
export const subSignalObj = (prefix, obj) => {
  const sub = {}
  const prefixLen = prefix.length;
  for (let key in obj) {
    if (key.startsWith(prefix)){
      sub[key.substring(prefixLen)] = obj[key]
    }
  }
  return sub
}

export const subSignal = (prefix) => (obj) => subSignalObj(prefix, obj)

export const getq = (variable) => {
  const query = window.location.search.substring(1);
  for (let assignment of query.split("&")) {
    let [key,val] = assignment.split("=");
    if (key === variable){return val;}
  }
  return(undefined);
}

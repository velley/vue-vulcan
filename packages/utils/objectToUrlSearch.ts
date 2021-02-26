
export function objectToUrlSearch(obj: object) {
  console.log(obj)
  if(!obj) return '';
  let str = '';
  for(let key in obj) {
    str += `${key}=${obj[key]}&`
  }
  return str
}
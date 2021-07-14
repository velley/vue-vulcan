export function pluckObj(obj: object, ...pluckers: string[]) {
  const values = [];
  for(let key of pluckers) {
    const target = values.length ? values.pop() : obj;
    if(target && target[key]) {
      values.push(target[key])
    } else {
      throw new Error(`the key ${key} is not in object`)
    }
    
  }
  return values.pop()
}
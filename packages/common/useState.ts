import { Ref, ref, UnwrapRef } from "vue";

export function useState<T = any>(
  initital: T, 
  // storage?: 'session' | 'local'
): [Ref<UnwrapRef<T>>, (param: UnwrapRef<T>) => void ] {
  
  const state = ref<T>(initital);

  const setState = (val: UnwrapRef<T>) => {
    state.value = val;   
    // setStorage(val); 
  }

  // const setStorage = (val: UnwrapRef<T>) => {
  //   localStorage.
  // }

  return [state, setState]
}
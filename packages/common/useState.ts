import { onMounted, Ref, ref, readonly, UnwrapRef, DeepReadonly } from "vue";
import { useInjector } from "../ioc/useInjector";
import { CustomeStorageFunc } from "./interface";
import { CUSTOME_STORAGE } from "./token";

interface StateOptions {
  reactive?: boolean;
  storage?: 'session' | 'local' | 'custome' | null;
  key?: string;
}

const defaultOpt: StateOptions = {  
  storage: null
}

export function useState<T>(
  initital: T, 
  options = defaultOpt
): [
  DeepReadonly< Ref<UnwrapRef<T>> >, 
  (param: UnwrapRef<T>) => void, 
  (key?: keyof UnwrapRef<T>) => UnwrapRef<T> | UnwrapRef<T>[keyof UnwrapRef<T>]
] {
  
  let state = ref<T>(initital);
  let storage: CustomeStorageFunc<T>; 
  const customeStorage = useInjector<CustomeStorageFunc<T>>(CUSTOME_STORAGE, 'optional');

  onMounted( () => {
    if(!options.storage) return;
    if(!options.key) throw new Error('当指定了storage的值时，你必须同时传入一个key值');

    switch(options.storage) {
      case 'session':
        storage = sessionStorage as unknown as CustomeStorageFunc<T>;
        break;
      case 'local':
        storage = localStorage as unknown as CustomeStorageFunc<T>;
        break;
      case 'custome':
        if(!customeStorage) throw new Error('请在顶层组件通过useProvider提供自定义storage api');
        storage = customeStorage;
        break;    
    }   

    const data = storage.getItem(options.key)
    if(!data) {
      storage.setItem(options.key, data)
    } else {
      state.value = data as UnwrapRef<T>;
    }    
  }) 

  const setState = (val: UnwrapRef<T>) => {
    state.value = val;   
    options.storage && storage.setItem(options.key, val as T)
  }

  const getValue = (key?: keyof UnwrapRef<T>) => {
    if(!key) return state.value;
    return state.value[key]
  }

  return [readonly(state), setState, getValue]
}
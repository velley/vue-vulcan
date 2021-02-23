import { FunctionalStore } from "./interface";
import { inject } from "vue";

type InjectType = 'root' | 'optional';

export function useInjector<T>(input: FunctionalStore<T> | symbol, type?: InjectType) {

  let token: symbol, func: FunctionalStore<T>, root: T, name: string;

  if(typeof input === 'symbol') {
    token = input
  } else {
    func  = input;
    token = input.token;
    root  = input.root;
    name  = input.name;
  }  

  switch(type) {
    default:      
      const res = inject<T>(token)
      if(res) return res;
      if(root) return root;
      throw new Error(`hook函数${name}未在上层组件通过调用useProvider提供`);
    case 'optional':
      return inject<T>(token) || root || null;
    case 'root':
      if(!root) func.root = func();      
      return func.root;
  }  
}
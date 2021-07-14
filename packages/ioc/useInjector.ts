import { FunctionalStore, ProvideComponent } from "./interface";
import { getCurrentInstance, inject } from "vue";

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

  const current = getCurrentInstance() as ProvideComponent;
  const depends = current.provides[token] as T || inject<T>(token);

  switch(type) {
    default:      
      if(depends) return depends;
      if(root) return root;
      throw new Error(`hook函数${name || token.description}未在上层组件通过调用useProvider提供`);
    case 'optional':
      return depends || root || null;
    case 'root':
      if(!root) func.root = func();      
      return func.root;
  }  
}
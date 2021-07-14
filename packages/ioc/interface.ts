import { ComponentInternalInstance } from "vue";

export interface FunctionalStore<T> {
  (): T;
  token?: symbol;
  global?: boolean;
  root?: T;
}

const propKey = Symbol()

export interface ProvideComponent extends ComponentInternalInstance {
  provides?: {
    [propKey]: any;
  }  
}
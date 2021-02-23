import { FunctionalStore } from "./interface";
import { provide } from "vue";

export function useProvider<T extends object>(func: FunctionalStore<T>): T {
  !func.token && (func.token = Symbol('functional hook'));
  const depends = func();
  provide(func.token, depends);
  return depends;
}
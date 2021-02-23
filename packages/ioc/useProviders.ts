import { FunctionalStore } from "./interface";
import { provide } from "vue";

export function useProviders(...funcs: FunctionalStore<any>[]) {
  funcs.forEach( func => {
    !func.token && (func.token = Symbol('functional hook'));
    provide(func.token, func());
  });
}
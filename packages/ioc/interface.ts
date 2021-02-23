export interface FunctionalStore<T> {
  (): T;
  token?: symbol;
  global?: boolean;
  root?: T;
}
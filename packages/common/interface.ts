
export interface CustomeStorageFunc<T> {
	setItem(key: string | symbol, value: T): void;
	getItem(key: string | symbol): T;
	removeItem(key: string): void;
}
export interface StorageItems {
	categories: string[];
}

export interface ExtensionStorage<T> {
	get: () => Promise<Record<string, unknown>>;
	set: <Key extends keyof T>(key: Key, value: T[Key]) => Promise<void>;
	getOrDefault: <Key extends keyof T>(key: Key, defaultValue: T[Key]) => Promise<T[Key]>;
	clearAll: () => Promise<void>;
	delete: (key: keyof T) => Promise<void>;
}

export const Storage: ExtensionStorage<StorageItems> = {
	async getOrDefault(key, defaultValue) {
		const resultObject = await chrome.storage.sync.get(key);
		if (!Object.hasOwn(resultObject, key)) {
			return defaultValue;
		}
		return resultObject[key];
	},
	async get() {
		return chrome.storage.sync.get();
	},
	async set(key, value) {
		return chrome.storage.sync.set({ [`${key}`]: value });
	},
	async clearAll() {
		return chrome.storage.sync.clear();
	},
	async delete(key) {
		return chrome.storage.sync.remove(key);
	},
};

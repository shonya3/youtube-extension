import { Storage } from '../Storage';
import { VideoCategoriesElement } from './wc-video-categories';

declare global {
	interface Document {
		startViewTransition: (callback: () => void) => Promise<unknown>;
	}
}

VideoCategoriesElement.define();

async function main() {
	const element = document.querySelector('wc-video-categories')!;
	element.categories = await Storage.getOrDefault('categories', []);

	element.addEventListener('delete-clicked', async e => {
		const category = (e as CustomEvent<string>).detail;
		const categories = element.categories.filter(cat => cat !== category);
		await Storage.set('categories', categories);
		element.categories = categories;
	});

	element.addEventListener('add-category', async e => {
		const category = (e as CustomEvent<string>).detail;
		const categories = element.categories.concat(category);
		await Storage.set('categories', categories);
		element.categories = categories;
	});

	element.addEventListener('reorder-categories', async e => {
		const categories = (e as CustomEvent<string[]>).detail;
		await Storage.set('categories', categories);

		document.startViewTransition(() => {
			element.categories = categories;
		});
	});
}

main();

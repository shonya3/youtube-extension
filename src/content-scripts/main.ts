import { Storage } from '../Storage';
import { waitForNavigation } from './Navigation';
import { waitFor, waitForChip } from './wait';

async function main() {
	const { pathname } = new URL(window.location.href);
	if (pathname === '/watch') {
		return;
	}

	await Promise.all([updateVidsPerRow(), updateNavigation()]);

	const categories = await Storage.getOrDefault('categories', []);
	const chip = await waitForChip(categories);
	chip?.click();
}

main();

async function updateVidsPerRow() {
	const container = await waitFor('ytd-rich-grid-renderer');
	if (!container) {
		return;
	}

	container.style.setProperty('--ytd-rich-grid-items-per-row', '5');
}

async function updateNavigation() {
	const navigation = await waitForNavigation();

	if (navigation) {
		navigation.shorts().remove();
		navigation.showMore().click();
		navigation.home().after(navigation.liked());
		navigation.showLess().click();
	}
}

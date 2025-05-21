import { Storage } from '../Storage';
import { waitForNavigation } from './Navigation';
import { waitFor, waitForChip } from './wait';

main();

async function main() {
	//@ts-expect-error
	window.navigation.addEventListener('navigate', event => {
		const { pathname } = new URL(event.destination.url);
		if (pathname === '/watch') {
			return;
		}
		updateVidsPerRow();
	});

	const { pathname } = new URL(window.location.href);
	if (pathname === '/watch') {
		return;
	}

	await Promise.all([updateVidsPerRow(), updateNavigation()]);

	const categories = await Storage.getOrDefault('categories', []);
	const chip = await waitForChip(categories);
	chip?.click();
}

async function updateVidsPerRow() {
	const container = await waitFor('ytd-rich-grid-renderer');
	if (!container) {
		return;
	}

	const update = () => {
		container.style.setProperty('--ytd-rich-grid-items-per-row', '5');
	};

	setTimeout(update, 2000);
	update();
}

async function updateNavigation() {
	const navigation = await waitForNavigation();
	if (!navigation) {
		return;
	}

	navigation.shorts().remove();
	navigation.showMore().click();
	navigation.home().after(navigation.liked());
	navigation.showLess().click();
}

import { Storage } from '../extension-storage';
import { waitForNavigation } from './nav';
import { waitFor, waitForChip } from './wait';

main();

async function main() {
	document.addEventListener('yt-navigate-finish', () => {
		if (isWatchPage()) {
			return;
		}
		updateVidsPerRow();
	});

	if (isWatchPage()) {
		return;
	}

	await Promise.all([updateVidsPerRow(), updateNavigation()]);

	const categories = await Storage.getOrDefault('categories', []);
	const chip = await waitForChip(categories);
	chip?.click();
}

function isWatchPage(): boolean {
	return new URL(window.location.href).pathname === '/watch';
}

async function updateVidsPerRow() {
	const container = await waitFor('ytd-rich-grid-renderer');
	if (!container) {
		return;
	}

	const update = () => {
		container.style.setProperty('--ytd-rich-grid-items-per-row', '5');
	};

	setTimeout(update, 300);
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

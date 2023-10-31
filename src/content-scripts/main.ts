import { Storage } from '../Storage';
import { waitForNavigation } from './Navigation';
import { waitForChip } from './wait';

async function main() {
	const { pathname } = new URL(window.location.href);
	if (pathname === '/watch') return;

	const navigation = await waitForNavigation();

	if (navigation !== null) {
		navigation.shorts().remove();
		navigation.showMore().click();
		navigation.home().after(navigation.liked());
		navigation.showLess().click();
	}

	const categories = await Storage.getOrDefault('categories', []);
	const chip = await waitForChip(categories);
	chip?.click();
}

main();

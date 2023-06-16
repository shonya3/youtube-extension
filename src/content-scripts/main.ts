import { $ } from '../$';

async function main() {
	const { pathname } = new URL(window.location.href);
	if (pathname === '/watch') return;

	const result = await $.navigation.ready();
	if (result !== 'ready') return;

	$.navigation.shorts().remove();
	$.navigation.showMore().click();
	$.navigation.home().after($.navigation.liked());
	$.navigation.showLess().click();
}

main();

import { waitFor } from './wait';

export class Navigation {
	ready: Promise<boolean>;
	static NAV_ITEM_SELECTOR = 'ytd-guide-entry-renderer';

	#navEl(title: string) {
		return document.querySelector(`${Navigation.NAV_ITEM_SELECTOR}:has(a[title="${title}"])`) as HTMLElement;
	}

	constructor() {
		this.ready = waitFor(Navigation.NAV_ITEM_SELECTOR).then(navEl => Boolean(navEl));
	}

	items(): HTMLElement {
		return document.querySelector('#sections > ytd-guide-section-renderer:nth-child(1) > #items') as HTMLElement;
	}
	shorts(): HTMLElement {
		return this.#navEl('Shorts');
	}
	home(): HTMLElement {
		return this.#navEl('Home');
	}
	liked(): HTMLElement {
		return this.#navEl('Liked videos');
	}
	showMore(): HTMLElement {
		return this.#navEl('Show more');
	}
	showLess(): HTMLElement {
		return this.#navEl('Show less');
	}
}

export const waitForNavigation = async () => {
	const navigation = new Navigation();
	await navigation.ready;
	if (!navigation.ready) {
		return null;
	}

	return navigation;
};

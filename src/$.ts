const NAV_ITEM_SELECTOR = 'ytd-guide-entry-renderer';
const navEl = (title: string): HTMLElement => {
	return document.querySelector(`${NAV_ITEM_SELECTOR}:has(a[title="${title}"])`) as HTMLElement;
};
export const navigation = {
	items(): HTMLElement {
		return document.querySelector('#sections > ytd-guide-section-renderer:nth-child(1) > #items') as HTMLElement;
	},
	shorts(): HTMLElement {
		return navEl('Shorts');
	},
	home(): HTMLElement {
		return navEl('Home');
	},
	liked(): HTMLElement {
		return navEl('Liked videos');
	},
	showMore(): HTMLElement {
		return navEl('Show more');
	},
	showLess(): HTMLElement {
		return navEl('Show less');
	},

	consts: Object.freeze({
		NAV_ITEM_SELECTOR,
	}),

	async ready(): Promise<'ready' | 'time is out'> {
		let interval: ReturnType<typeof setTimeout> | null = null;
		const ready = new Promise<'ready'>(resolve => {
			interval = setInterval(() => {
				const shorts = document.querySelector(`${NAV_ITEM_SELECTOR}:has(a[title="Shorts"])`) as HTMLElement;
				if (shorts) {
					resolve('ready');
				}
			}, 25);
		});

		const promise = await Promise.race<'ready' | 'time is out'>([
			ready,
			new Promise(resolve => {
				setTimeout(() => resolve('time is out'), 5000);
			}),
		]);

		if (interval) {
			clearInterval(interval);
		}

		return promise;
	},
};

export const $ = {
	navigation,
};

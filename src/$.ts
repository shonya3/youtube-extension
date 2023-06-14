const NAV_ITEM_SELECTOR = 'ytd-guide-entry-renderer';
export const navigation = {
	consts: {
		NAV_ITEM_SELECTOR,
	},
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
	items(): HTMLElement {
		return document.querySelector('#sections > ytd-guide-section-renderer:nth-child(1) > #items') as HTMLElement;
	},
	shorts(): HTMLElement {
		return document.querySelector(`${NAV_ITEM_SELECTOR}:has(a[title="Shorts"])`) as HTMLElement;
	},
	home(): HTMLElement {
		return document.querySelector(`${NAV_ITEM_SELECTOR}:has(a[title="Home"])`) as HTMLElement;
	},
	liked(): HTMLElement {
		return document.querySelector(`${NAV_ITEM_SELECTOR}:has(a[title="Liked videos"])`) as HTMLElement;
	},
	showMore(): HTMLElement {
		return document.querySelector('a[title="Show more"]') as HTMLElement;
	},
	showLess(): HTMLElement {
		return document.querySelector('a[title="Show less"]') as HTMLElement;
	},
};

export const $ = {
	navigation,
};

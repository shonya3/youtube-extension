export const limitTime = <T>(promise: Promise<T>, timeout = 5000): Promise<T | null> => {
	return Promise.race([promise, new Promise<null>(resolve => setTimeout(() => resolve(null), timeout))]);
};

export const waitFor = <T = HTMLElement>(
	selector: string | string[],
	root: Element | Document = document,
	timeout = 5000
): Promise<T | null> => {
	const promise = new Promise<T>(async resolve => {
		const findElement = (selector: string) => {
			const el = root.querySelector(selector);
			if (el instanceof Element) {
				resolve(el as T);
			}
		};

		while (true) {
			Array.isArray(selector) ? selector.forEach(findElement) : findElement(selector);
			await new Promise(r => setTimeout(r, 50));
		}
	});

	return limitTime(promise, timeout);
};

export const waitForChip = async (categories: string[]): Promise<HTMLElement | null> => {
	const chips = await waitFor('#chips');
	if (!chips) return null;
	const selectors = categories.map(category => `[title = "${category}"]`);
	return waitFor(selectors, chips);
};

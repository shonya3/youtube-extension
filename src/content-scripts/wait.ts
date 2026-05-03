export const limitTime = <T>(promise: Promise<T>, timeout = 5000): Promise<T | null> => {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeout)),
  ]);
};

export const waitFor = <T = HTMLElement>(
  selector: string | string[],
  root: Element | Document = document,
  timeout = 5000,
): Promise<T | null> => {
  // oxlint-disable-next-line no-async-promise-executor
  const promise = new Promise<T>(async (resolve) => {
    const findElement = (sel: string) => {
      const el = root.querySelector(sel);
      if (el instanceof Element) {
        resolve(el as T);
      }
    };

    while (true) {
      if (Array.isArray(selector)) {
        selector.forEach(findElement);
      } else {
        findElement(selector);
      }

      await new Promise((r) => setTimeout(r, 50));
    }
  });

  return limitTime(promise, timeout);
};

export const waitForN = (
  selectorAll: string,
  N: number,
  root: HTMLElement | Document = document,
  timeout = 10_000,
): Promise<HTMLElement[] | null> => {
  // oxlint-disable-next-line no-async-promise-executor
  const promise = new Promise<HTMLElement[]>(async (resolve) => {
    const findElements = (sel: string) => {
      const arr = Array.from(root.querySelectorAll<HTMLElement>(sel));
      if (arr.length < N) return;
      if (!(arr[0] instanceof HTMLElement)) return;

      resolve(arr);
    };

    while (true) {
      findElements(selectorAll);

      await new Promise((r) => setTimeout(r, 50));
    }
  });

  return limitTime(promise, timeout);
};

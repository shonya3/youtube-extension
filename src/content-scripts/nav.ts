import { waitForN } from "./wait";

export class MainNav {
  sections: Section[];
  static readonly NAV_SECTION_SELECTOR = "ytd-guide-section-renderer";
  static readonly NAV_ITEM_SELECTOR = "ytd-guide-entry-renderer";

  /**
   * Use MainNav.getMainNav
   */
  private constructor(sections: Section[]) {
    this.sections = sections;
  }

  static async getMainNav(): Promise<MainNav | null> {
    const sections = await waitForN(MainNav.NAV_SECTION_SELECTOR, 5);
    if (!sections) return null;

    return new MainNav(sections.map((sEl) => new Section(sEl)));
  }

  navEl(title: string, root: Element | Document = document) {
    return root.querySelector(
      `${MainNav.NAV_ITEM_SELECTOR}:has(a[title="${title}"])`,
    ) as HTMLElement;
  }

  /**
   * @param nth - starts from 0
   * @returns section el
   */
  nthSection(nth: number): HTMLElement {
    return document.querySelector(
      `#sections > ytd-guide-section-renderer:nth-child(${nth + 1})`,
    ) as HTMLElement;
  }
  // shorts(): HTMLElement {
  //   return this.#navEl("Shorts");
  // }
  // home(): HTMLElement {
  //   return this.#navEl("Home");
  // }
  // liked(): HTMLElement {
  //   return this.#navEl("Liked videos");
  // }
  // showMore(): HTMLElement {
  //   return this.#navEl("Show more");
  // }
  // showLess(): HTMLElement {
  //   return this.#navEl("Show less");
  // }
}

class Section {
  #el: Element;

  constructor(el: Element) {
    this.#el = el;
  }

  navEl(title: string): HTMLElement | null {
    return this.#el.querySelector(`${MainNav.NAV_ITEM_SELECTOR}:has(a[title="${title}"])`);
  }
}

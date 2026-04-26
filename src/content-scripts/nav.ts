import { waitForN } from "./wait";

const NAV_ITEM_SELECTOR = "ytd-guide-entry-renderer";
const NAV_SECTION_SELECTOR = "ytd-guide-section-renderer";

export class MainNav {
  static readonly NAV_SECTION_SELECTOR = "ytd-guide-section-renderer";
  static readonly NAV_ITEM_SELECTOR = NAV_ITEM_SELECTOR;

  /**
   * Use MainNav.ready and static methods
   */
  private constructor() {}

  static async ready(): Promise<void> {
    await waitForN(MainNav.NAV_SECTION_SELECTOR, 5);
  }

  static get sections(): Section[] {
    return Array.from(document.querySelectorAll<HTMLElement>(MainNav.NAV_SECTION_SELECTOR)).map(
      (el) => new Section(el),
    );
  }

  static navEl(title: string, root: Element | Document = document) {
    return root.querySelector(
      `${MainNav.NAV_ITEM_SELECTOR}:has(a[title="${title}"])`,
    ) as HTMLElement;
  }

  /**
   * @param nth - starts from 0
   * @returns section el
   */
  static nthSection(nth: number): HTMLElement {
    return document.querySelector(
      `#sections > ytd-guide-section-renderer:nth-child(${nth + 1})`,
    ) as HTMLElement;
  }

  static get navElements() {
    return MainNav.sections.flatMap((s) => s.navElements);
  }
}

class Section {
  el: HTMLElement;

  static readonly SELECTOR = NAV_SECTION_SELECTOR;

  constructor(el: HTMLElement) {
    this.el = el;
    this.el.setAttribute("data-uuid", crypto.randomUUID());
  }

  get uuid() {
    return this.el.getAttribute("data-uuid");
  }

  get nth(): number {
    console.log(MainNav.sections.map((s) => s.uuid));
    return MainNav.sections.findIndex((s) => s.uuid === this.uuid);
  }

  get heading(): { title: string; href?: string | undefined | null } | null {
    // 1) Check for header entry
    const headingNavEl = this.navElements.find((n) => n.specialKind === "header-entry");
    if (headingNavEl) {
      const { name: title, href } = headingNavEl;

      if (!href) {
        console.warn(`Href is expected but missing: `, headingNavEl);
      }

      return { title, href };
    }

    // 2) Check for h3 with content
    const h3Content = this.el.querySelector("h3")?.textContent.trim();
    if (h3Content && h3Content.length) {
      return { title: h3Content };
    }

    // 3) Nothing
    return null;
  }

  get navElements(): Array<NavEl> {
    return Array.from(this.el.querySelectorAll<HTMLElement>(NAV_ITEM_SELECTOR)).map(
      (el) => new NavEl(el),
    );
  }

  navEl(title: string): HTMLElement | null {
    return this.el.querySelector(`${NAV_ITEM_SELECTOR}:has(a[title="${title}"])`);
  }
}

export class NavEl {
  el: HTMLElement;

  constructor(el: HTMLElement) {
    this.el = el;
  }

  get name() {
    return this.el.textContent.trim();
  }

  get specialKind(): NavElSpecialKind | null {
    for (const kind of NAV_EL_SPECIAL_KINDS) {
      if (this.el.id === kind) {
        return kind;
      }
    }

    return null;
  }

  get href(): string | null {
    const a = this.el.querySelector("a");
    if (a && a.href.length) {
      return a.href;
    }

    return null;
  }

  get section(): Section {
    const sectionEl = this.el.closest(NAV_SECTION_SELECTOR) as HTMLElement;
    return new Section(sectionEl);
  }
}

const NAV_EL_SPECIAL_KINDS = [
  "header-entry",
  "expander-item",
  "collapser-item",
  "expander-item",
  "downloads-entry",
] as const;

type NavElSpecialKind = (typeof NAV_EL_SPECIAL_KINDS)[number];

import { waitForN } from "./wait";

const NAV_ITEM_SELECTOR = "ytd-guide-entry-renderer";
const NAV_SECTION_SELECTOR = "ytd-guide-section-renderer";

export class NavMenu {
  static readonly SELECTOR = "tp-yt-app-drawer#guide";
  static readonly NAV_SECTION_SELECTOR = "ytd-guide-section-renderer";
  static readonly NAV_ITEM_SELECTOR = NAV_ITEM_SELECTOR;

  /**
   * Use NavMenu.ready and static methods
   */
  private constructor() {}

  static findNavEl(name: string): NavEl | null {
    return NavMenu.navElements.find((n) => n.name.includes(name)) ?? null;
  }

  static findSection(name: string): Section | null {
    return NavMenu.sections.find((s) => s.heading?.title.includes(name)) ?? null;
  }

  static async ready(): Promise<void> {
    await waitForN(NavMenu.NAV_SECTION_SELECTOR, 5);
  }

  static get el(): HTMLElement {
    return document.querySelector(NavMenu.SELECTOR)!;
  }

  static get sections(): Section[] {
    return Array.from(document.querySelectorAll<HTMLElement>(NavMenu.NAV_SECTION_SELECTOR)).map(
      (el) => new Section(el),
    );
  }

  static get footer(): HTMLElement {
    return NavMenu.el.querySelector("#footer")!;
  }

  static removeEmptySections() {
    NavMenu.sections.filter((s) => s.navElements.length === 0).forEach((s) => s.el.remove());
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
    return NavMenu.sections.flatMap((s) => s.navElements);
  }
}

export class Section {
  el: HTMLElement;

  showMore() {
    const expander = this.navElements.find((el) => el.specialKind === "expander-item");
    if (expander) {
      expander.el.click();
    }
  }

  findNavEl(name: string): NavEl | null {
    return this.navElements.find((n) => n.name.includes(name)) ?? null;
  }

  static readonly SELECTOR = NAV_SECTION_SELECTOR;

  constructor(el: HTMLElement) {
    this.el = el;
    this.el.setAttribute("data-uuid", crypto.randomUUID());
  }

  get uuid() {
    return this.el.getAttribute("data-uuid");
  }

  get nth(): number {
    console.log(NavMenu.sections.map((s) => s.uuid));
    return NavMenu.sections.findIndex((s) => s.uuid === this.uuid);
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

  wrapInDetails() {
    const details = document.createElement("details");

    const summary = Object.assign(document.createElement("summary"), {
      innerText: this.heading?.title ?? "Summary",
      style: "font-size: 16px;padding-left: 1rem",
    });

    details.append(summary);

    const h3 = this.el.querySelector("h3");
    if (h3) {
      h3.remove();
    }

    const innerContainer = Object.assign(document.createElement("div"), {
      style: "padding-block: 16px;",
    });
    details.append(innerContainer);
    Array.from(this.el.children).forEach((ch) => innerContainer.append(ch));

    this.el.append(details);
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

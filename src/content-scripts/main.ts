import { NavMenu } from "./nav";

await main();
async function main() {
  await NavMenu.ready();
  document.addEventListener("yt-navigate-finish", updateVidsContainer);
  document.dispatchEvent(new CustomEvent("yt-navigate-finish"));

  await updateNavMenu();
}

async function updateVidsContainer() {
  if (isWatchPage()) {
    return;
  }

  const vidsContainer = document.querySelector<HTMLElement>(
    "ytd-two-column-browse-results-renderer #contents",
  )!;

  setStyles(vidsContainer, { maxWidth: "1500px" });
  vidsContainer.style.setProperty("--ytd-rich-grid-items-per-row", "4");
}

function isWatchPage(): boolean {
  return new URL(window.location.href).pathname === "/watch";
}

async function updateNavMenu() {
  await NavMenu.ready();

  const you = NavMenu.findSection("You");
  if (you) {
    NavMenu.sections[0].el.before(you.el);

    you.showMore();
    you.findNavEl("Show less")?.el.remove();

    const music = NavMenu.findNavEl("YouTube Music");
    if (music) you.el.append(music.el);
  }

  ["Downloads", "Shorts", "Movies", "YouTube Kids", "Report history", "Home"]
    .map((t) => NavMenu.findNavEl(t))
    .filter((e) => e !== null)
    .forEach((e) => e.el.remove());
  NavMenu.removeEmptySections();

  ["Explore", "Subscriptions"]
    .map((t) => NavMenu.findSection(t))
    .filter((s) => s !== null)
    .forEach((s) => s.wrapInDetails());

  NavMenu.footer.remove();
}

export function setStyles<K extends keyof CSSStyleDeclaration>(
  el: HTMLElement,
  styles: Record<K, string>,
): void {
  Object.entries(styles).forEach(([k, v]) => {
    //@ts-expect-error
    el.style[k] = v;
  });
}

import { MainNav } from "./nav";

await main();
async function main() {
  await MainNav.ready();
  document.addEventListener("yt-navigate-finish", handlePageNavigation);
  document.dispatchEvent(new CustomEvent("yt-navigate-finish"));

  await updateNavigation();
}

async function handlePageNavigation() {
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

async function updateNavigation() {
  await MainNav.ready();

  const you = MainNav.findSection("You");
  if (you) {
    MainNav.sections[0].el.before(you.el);

    you.showMore();
    you.findNavEl("Show less")?.el.remove();

    const music = MainNav.findNavEl("YouTube Music");
    if (music) you.el.append(music.el);
  }

  ["Downloads", "Shorts", "Movies", "YouTube Kids", "Report history", "Home"]
    .map((t) => MainNav.findNavEl(t))
    .filter((e) => e !== null)
    .forEach((e) => e.el.remove());
  MainNav.removeEmptySections();

  ["Explore", "Subscriptions"]
    .map((t) => MainNav.findSection(t))
    .filter((s) => s !== null)
    .forEach((s) => s.wrapInDetails());

  MainNav.footer.remove();
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

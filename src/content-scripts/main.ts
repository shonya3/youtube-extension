import { Storage } from "../extension-storage";
import { MainNav } from "./nav";
import { waitFor, waitForChip } from "./wait";

void main();

async function main() {
  document.addEventListener("yt-navigate-finish", async () => {
    if (isWatchPage()) {
      return;
    }
    await updateVidsPerRow();
  });

  if (isWatchPage()) {
    return;
  }

  await updateVidsPerRow();
  await updateNavigation();

  const categories = await Storage.getOrDefault("categories", []);
  const chip = await waitForChip(categories);
  chip?.click();
}

function isWatchPage(): boolean {
  return new URL(window.location.href).pathname === "/watch";
}

async function updateVidsPerRow() {
  const container = await waitFor("ytd-rich-grid-renderer");
  if (!container) {
    return;
  }

  const update = () => {
    container.style.setProperty("--ytd-rich-grid-items-per-row", "5");
  };

  setTimeout(update, 300);
  update();
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

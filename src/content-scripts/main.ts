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

  await Promise.all([updateVidsPerRow(), updateNavigation()]);

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
  const n = await MainNav.getMainNav();
  if (!n) return;

  n.navEl("Shorts").remove();

  n.sections[2].navEl("Show more")?.click();

  // n.home().after(n.liked());
  // navigation.showLess().click();
}

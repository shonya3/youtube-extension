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
  await MainNav.ready();

  console.log(MainNav.navElements[20]);

  // const youSection = MainNav.sections[2];
  // console.log(youSection);

  // console.log(youSection.heading);
  // for (const section of MainNav.sections) {
  //   console.log(section.heading);
  // }

  // const header = youSection.navElements.find((n) => n.specialKind === "header-entry");
  // console.log(`Header: `, header, " name: ", header?.name, header?.href);

  // const arr = n.navElements.map((n) => ({ [n.name]: n.el }));
  // console.log(arr);

  // n.sections[2].navElements.forEach((el) => console.log(el.name));

  // n.navEl("Shorts").remove();

  // n.sections[2].navEl("Show more")?.click();

  // const navEls = n
  //   .navElements()
  //   .map((el) => el.el)
  //   .map((el) => new NavEl(el));
  // navEls.forEach((el) => console.log(el.el, el.specialKind));

  // console.log("Here");

  // n.home().after(n.liked());
  // navigation.showLess().click();
}

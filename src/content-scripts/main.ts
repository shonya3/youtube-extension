import { NavMenu } from "./nav";
import "./styles.css";

await main();
async function main() {
  await pageReady();

  await updateNavMenu();
}

async function pageReady() {
  await NavMenu.ready();
}

async function updateNavMenu() {
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

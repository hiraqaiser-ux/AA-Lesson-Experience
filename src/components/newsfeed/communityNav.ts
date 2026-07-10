/**
 * Shared primary-nav wiring for the community screens (Home = newsfeed,
 * Courses = the Explore Courses page). Both screens render the same
 * Home / Courses / Blogs links; only the active item differs.
 */
import type { NavLink } from "../NavBar";

/** Navigate to a community screen via the ?screen param, preserving the path. */
export function goToScreen(screen: "newsfeed" | "courses" | "school") {
  const url = new URL(window.location.href);
  url.searchParams.set("screen", screen);
  window.location.assign(url.toString());
}

const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

/** Build the Home / Courses / Blogs links with the given section marked active. */
export function communityNavLinks(active: "home" | "courses"): NavLink[] {
  return [
    {
      label: "Home",
      active: active === "home",
      onClick: () => (active === "home" ? scrollTop() : goToScreen("newsfeed")),
    },
    {
      label: "Courses",
      active: active === "courses",
      onClick: () => (active === "courses" ? scrollTop() : goToScreen("courses")),
    },
    { label: "Blogs", href: "#" },
  ];
}

export function initDoodles() {
  const doodles = Array.from(document.querySelectorAll(".doodle-peek"));
  if (!doodles.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smallScreen = window.matchMedia("(max-width: 1024px)").matches;

  // Keep doodles static on smaller screens and reduced-motion mode to avoid extra paint work.
  if (reduceMotion || smallScreen) {
    doodles.forEach((doodle) => {
      doodle.style.setProperty("--drift", "0px");
      doodle.classList.add("is-visible");
    });
    return;
  }

  document.documentElement.classList.add("js-doodles");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else if (!reduceMotion) {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "-8% 0px -8% 0px",
    }
  );

  doodles.forEach((doodle) => revealObserver.observe(doodle));
}

export function initReveal() {
  document.documentElement.classList.add("js-reveal");

  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.02,
      rootMargin: "18% 0px 18% 0px",
    }
  );

  items.forEach((item) => observer.observe(item));
}

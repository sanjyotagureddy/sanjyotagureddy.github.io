export function initExperienceTimeline() {
  const timeline = document.querySelector("#experience-timeline");
  if (!timeline) return;

  const railItems = Array.from(timeline.querySelectorAll(".rail-item"));
  const sentinels = Array.from(timeline.querySelectorAll(".exp-sentinel"));
  const dataItems = Array.from(timeline.querySelectorAll(".experience-data [data-exp]"));
  const dataByKey = new Map(dataItems.map((item) => [item.dataset.exp, item]));

  const focusLogo = document.querySelector("#exp-focus-logo");
  const focusCompany = document.querySelector("#exp-focus-company");
  const focusPeriod = document.querySelector("#exp-focus-period");
  const focusRoles = document.querySelector("#exp-focus-roles");
  const focusHighlights = document.querySelector("#exp-focus-highlights");

  if (!railItems.length || !focusLogo || !focusCompany || !focusPeriod || !focusRoles || !focusHighlights) {
    return;
  }

  function setActive(expKey) {
    const data = dataByKey.get(expKey);
    if (!data) return;

    railItems.forEach((item) => {
      const isActive = item.dataset.exp === expKey;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-current", isActive ? "true" : "false");
    });

    focusLogo.src = data.dataset.logo || "";
    focusLogo.alt = `${data.dataset.company || "Company"} logo`;
    focusCompany.textContent = data.dataset.company || "";
    focusPeriod.textContent = data.dataset.period || "";

    const roles = data.querySelector(".role-list");
    const highlights = data.querySelector(".detail-list");
    if (roles) focusRoles.innerHTML = roles.innerHTML;
    if (highlights) focusHighlights.innerHTML = highlights.innerHTML;
  }

  railItems.forEach((item) => {
    item.addEventListener("click", () => {
      const expKey = item.dataset.exp;
      if (!expKey) return;
      setActive(expKey);

      const target = timeline.querySelector(`.exp-sentinel[data-exp="${expKey}"]`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        const expKey = visible[0].target.getAttribute("data-exp");
        if (expKey) setActive(expKey);
      }
    },
    {
      root: null,
      threshold: [0.45, 0.65],
      rootMargin: "-20% 0px -30% 0px",
    }
  );

  sentinels.forEach((item) => observer.observe(item));
  setActive("jpmc");
}

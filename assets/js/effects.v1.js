/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — VISUAL ENHANCEMENTS
   Progressive enhancement only. Core navigation and reveal behaviour
   remain in script.v2.js.
========================================================= */

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const heroParallaxLayer = document.querySelector("[data-parallax-layer]");
  const featureRows = Array.from(document.querySelectorAll("[data-feature-row]"));

  /**
   * Adds the active accent state to each major platform row as it enters view.
   */
  const initializeFeatureRows = () => {
    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      featureRows.forEach((row) => row.classList.add("is-in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-in-view");
          activeObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.12,
      }
    );

    featureRows.forEach((row) => observer.observe(row));
  };

  /**
   * Applies a restrained parallax shift to the hero image on capable devices.
   * The effect is intentionally disabled for reduced-motion users.
   */
  const initializeHeroParallax = () => {
    if (!heroParallaxLayer || reducedMotion.matches) return;

    let frameRequested = false;

    const updateParallax = () => {
      const heroHeight = heroParallaxLayer.parentElement?.offsetHeight ?? 0;
      const progress = heroHeight > 0 ? Math.min(window.scrollY / heroHeight, 1) : 0;
      const shift = progress * 24;

      heroParallaxLayer.style.setProperty("--hero-shift", `${shift}px`);
      frameRequested = false;
    };

    const requestUpdate = () => {
      if (frameRequested) return;

      frameRequested = true;
      window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  initializeFeatureRows();
  initializeHeroParallax();
})();

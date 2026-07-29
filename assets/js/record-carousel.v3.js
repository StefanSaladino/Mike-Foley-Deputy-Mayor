/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — COMMUNITY RECORD CAROUSEL
   Accessible manual carousel with buttons, dots, keyboard controls,
   touch swiping, and synchronized ARIA state.
========================================================= */

(() => {
  "use strict";

  const carousels = document.querySelectorAll("[data-record-carousel]");

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll("[data-record-slide]"));
    const stage = carousel.querySelector("[data-record-stage]");
    const previousButton = carousel.querySelector("[data-record-previous]");
    const nextButton = carousel.querySelector("[data-record-next]");
    const dotsContainer = carousel.querySelector("[data-record-dots]");
    const status = carousel.querySelector("[data-record-status]");

    if (!(stage instanceof HTMLElement) || !(dotsContainer instanceof HTMLElement) || slides.length === 0) {
      return;
    }

    let currentIndex = Math.max(slides.findIndex((slide) => !slide.hidden), 0);
    let touchStartX = null;
    let touchStartY = null;
    const dots = [];

    /** Wrap an index to the available slide range. */
    const normalizeIndex = (index) => (index + slides.length) % slides.length;

    /** Show exactly one slide and synchronize controls, dots, and announcements. */
    const showSlide = (requestedIndex, { focusStage = false } = {}) => {
      currentIndex = normalizeIndex(requestedIndex);

      slides.forEach((slide, slideIndex) => {
        const isCurrent = slideIndex === currentIndex;
        slide.hidden = !isCurrent;
        slide.setAttribute("aria-hidden", String(!isCurrent));
        slide.toggleAttribute("inert", !isCurrent);
      });

      dots.forEach((dot, dotIndex) => {
        const isCurrent = dotIndex === currentIndex;
        dot.setAttribute("aria-current", String(isCurrent));
        dot.tabIndex = isCurrent ? 0 : -1;
      });

      if (status) {
        status.textContent = `Story ${currentIndex + 1} of ${slides.length}`;
      }

      if (focusStage) {
        stage.focus({ preventScroll: true });
      }
    };

    /** Move relative to the currently displayed slide. */
    const move = (distance, options = {}) => showSlide(currentIndex + distance, options);

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "record-carousel__dot";
      dot.setAttribute("aria-label", `Show community story ${index + 1} of ${slides.length}`);
      dot.addEventListener("click", () => showSlide(index));
      dotsContainer.append(dot);
      dots.push(dot);
    });

    previousButton?.addEventListener("click", () => move(-1));
    nextButton?.addEventListener("click", () => move(1));

    stage.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          move(-1);
          break;
        case "ArrowRight":
          event.preventDefault();
          move(1);
          break;
        case "Home":
          event.preventDefault();
          showSlide(0);
          break;
        case "End":
          event.preventDefault();
          showSlide(slides.length - 1);
          break;
        default:
          break;
      }
    });

    // Keep vertical page scrolling natural while recognizing deliberate horizontal swipes.
    stage.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch?.clientX ?? null;
        touchStartY = touch?.clientY ?? null;
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchend",
      (event) => {
        if (touchStartX === null || touchStartY === null) return;

        const touch = event.changedTouches[0];
        const endX = touch?.clientX ?? touchStartX;
        const endY = touch?.clientY ?? touchStartY;
        const horizontalDistance = endX - touchStartX;
        const verticalDistance = endY - touchStartY;

        touchStartX = null;
        touchStartY = null;

        if (Math.abs(horizontalDistance) < 50 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) {
          return;
        }

        move(horizontalDistance < 0 ? 1 : -1);
      },
      { passive: true }
    );

    const hasMultipleSlides = slides.length > 1;
    if (previousButton instanceof HTMLButtonElement) previousButton.hidden = !hasMultipleSlides;
    if (nextButton instanceof HTMLButtonElement) nextButton.hidden = !hasMultipleSlides;
    dotsContainer.hidden = !hasMultipleSlides;

    showSlide(currentIndex);
  });
})();

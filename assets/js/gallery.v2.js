/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — SCHOOL GALLERY
   Provides an accessible dialog gallery with arrows, dots, and keyboard input.
========================================================= */

(() => {
  "use strict";

  const items = Array.from(document.querySelectorAll("[data-gallery-item]"));
  const dialog = document.querySelector("[data-gallery-dialog]");

  if (!(dialog instanceof HTMLDialogElement) || items.length === 0) return;

  const image = dialog.querySelector("[data-gallery-image]");
  const caption = dialog.querySelector("[data-gallery-caption]");
  const previousButton = dialog.querySelector("[data-gallery-previous]");
  const nextButton = dialog.querySelector("[data-gallery-next]");
  const closeButton = dialog.querySelector("[data-gallery-close]");
  const dotsContainer = dialog.querySelector("[data-gallery-dots]");

  if (!(image instanceof HTMLImageElement) || !dotsContainer) return;

  let currentIndex = 0;
  let opener = null;
  const dots = [];

  /** Normalize an index so previous/next navigation wraps around. */
  const normalizeIndex = (index) => (index + items.length) % items.length;

  /** Render one gallery item in the dialog. */
  const showItem = (index) => {
    currentIndex = normalizeIndex(index);
    const item = items[currentIndex];
    const sourceImage = item.querySelector("img");

    // Prefer the image already rendered in the page. This also respects any
    // future responsive `srcset` choice before falling back to the data value.
    image.src =
      sourceImage?.currentSrc ||
      sourceImage?.src ||
      item.dataset.gallerySrc ||
      "";
    image.alt =
      item.dataset.galleryAlt ||
      sourceImage?.alt ||
      "Campaign gallery image";

    if (caption) {
      caption.textContent = item.dataset.galleryCaption || `Image ${currentIndex + 1}`;
    }

    dots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === currentIndex;
      dot.setAttribute("aria-current", String(isCurrent));
      dot.setAttribute("aria-label", `Show image ${dotIndex + 1} of ${items.length}`);
    });
  };

  /** Open at the selected image. */
  const openGallery = (index, button) => {
    opener = button;
    showItem(index);
    document.body.classList.add("gallery-modal-open");

    if (!dialog.open) dialog.showModal();
    closeButton?.focus();
  };

  /** Close the dialog through its native API. */
  const closeGallery = () => {
    if (dialog.open) dialog.close();
  };

  items.forEach((item, index) => {
    item.addEventListener("click", () => openGallery(index, item));
  });

  items.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.addEventListener("click", () => showItem(index));
    dotsContainer.append(dot);
    dots.push(dot);
  });

  previousButton?.addEventListener("click", () => showItem(currentIndex - 1));
  nextButton?.addEventListener("click", () => showItem(currentIndex + 1));
  closeButton?.addEventListener("click", closeGallery);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeGallery();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showItem(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showItem(currentIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      showItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      showItem(items.length - 1);
    }
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("gallery-modal-open");
    image.removeAttribute("src");

    if (opener instanceof HTMLElement) opener.focus();
  });

  const hasMultipleImages = items.length > 1;
  if (previousButton instanceof HTMLButtonElement) {
    previousButton.hidden = !hasMultipleImages;
  }
  if (nextButton instanceof HTMLButtonElement) {
    nextButton.hidden = !hasMultipleImages;
  }
  dotsContainer.hidden = !hasMultipleImages;
})();

/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — VOLUNTEER DIALOG
   Opens the Netlify volunteer form, records its source, and restores focus.
========================================================= */

(() => {
  "use strict";

  const dialog = document.querySelector("[data-volunteer-dialog]");
  const openButtons = Array.from(
    document.querySelectorAll("[data-volunteer-open]")
  );
  const closeButton = dialog?.querySelector("[data-volunteer-close]");
  const sourceField = dialog?.querySelector("[data-volunteer-source-field]");

  if (!(dialog instanceof HTMLDialogElement) || openButtons.length === 0) {
    return;
  }

  let opener = null;

  /** Open the form and preserve which call-to-action launched it. */
  const openDialog = (button) => {
    opener = button;

    if (sourceField instanceof HTMLInputElement) {
      sourceField.value = button.dataset.volunteerSource || "website";
    }

    document.body.classList.add("volunteer-modal-open");

    if (!dialog.open) {
      dialog.showModal();
    }

    window.requestAnimationFrame(() => {
      const firstInput = dialog.querySelector(
        'input:not([type="hidden"]):not([name="bot-field"]), select, textarea'
      );
      firstInput?.focus();
    });
  };

  /** Close the form and return focus to the button that opened it. */
  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => openDialog(button));
  });

  closeButton?.addEventListener("click", closeDialog);

  // Clicking the native dialog backdrop closes the form.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("volunteer-modal-open");

    if (opener instanceof HTMLElement) {
      opener.focus();
    }
  });
})();

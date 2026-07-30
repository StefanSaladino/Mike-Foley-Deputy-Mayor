/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — LAWN SIGN REQUEST DIALOG
   Opens the Netlify sign-request form, records the source CTA,
   timestamps express consent, and restores focus after closing.
========================================================= */

(() => {
  "use strict";

  const dialog = document.querySelector("[data-sign-dialog]");
  const openButtons = Array.from(document.querySelectorAll("[data-sign-open]"));

  if (!(dialog instanceof HTMLDialogElement) || openButtons.length === 0) {
    return;
  }

  const closeButton = dialog.querySelector("[data-sign-close]");
  const sourceField = dialog.querySelector("[data-sign-source-field]");
  const consentTimestamp = dialog.querySelector("[data-consent-timestamp]");
  const form = dialog.querySelector("form");
  let opener = null;

  const openDialog = (button) => {
    opener = button;

    if (sourceField instanceof HTMLInputElement) {
      sourceField.value = button.dataset.signSource || "website";
    }

    document.body.classList.add("volunteer-modal-open");

    if (!dialog.open) {
      dialog.showModal();
    }

    window.requestAnimationFrame(() => {
      dialog
        .querySelector('input:not([type="hidden"]):not([name="bot-field"])')
        ?.focus();
    });
  };

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => openDialog(button));
  });

  closeButton?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("volunteer-modal-open");
    if (opener instanceof HTMLElement) opener.focus();
  });

  form?.addEventListener("submit", () => {
    if (consentTimestamp instanceof HTMLInputElement) {
      consentTimestamp.value = new Date().toISOString();
    }
  });
})();

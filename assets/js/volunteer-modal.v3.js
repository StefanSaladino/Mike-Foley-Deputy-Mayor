/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — VOLUNTEER / SIGN DIALOG
   Opens the Netlify form, configures lawn-sign requests, records
   the source call-to-action, and restores focus after closing.
========================================================= */

(() => {
  "use strict";

  const dialog = document.querySelector("[data-volunteer-dialog]");
  const openButtons = Array.from(document.querySelectorAll("[data-volunteer-open]"));

  if (!(dialog instanceof HTMLDialogElement) || openButtons.length === 0) {
    return;
  }

  const closeButton = dialog.querySelector("[data-volunteer-close]");
  const sourceField = dialog.querySelector("[data-volunteer-source-field]");
  const interestField = dialog.querySelector("[data-volunteer-interest-field]");
  const signFields = dialog.querySelector("[data-sign-fields]");
  const signRequiredFields = Array.from(dialog.querySelectorAll("[data-sign-required]"));
  const title = dialog.querySelector("[data-volunteer-title]");
  const description = dialog.querySelector("[data-volunteer-description]");
  const submitButton = dialog.querySelector("[data-volunteer-submit]");

  const volunteerCopy = {
    title: "Volunteer with Mike Foley",
    description: "Tell us how you would like to help. A campaign team member will follow up.",
    submit: "Join the campaign",
  };

  const signCopy = {
    title: "Request a Free Lawn Sign",
    description: "Tell us where the campaign can deliver your sign, and a team member will follow up.",
    submit: "Request my sign",
  };

  let opener = null;

  /** Show or hide delivery fields and keep native validation in sync. */
  const setSignMode = (enabled) => {
    if (signFields instanceof HTMLElement) {
      signFields.hidden = !enabled;
    }

    signRequiredFields.forEach((field) => {
      if (field instanceof HTMLInputElement) {
        field.required = enabled;
      }
    });

    const copy = enabled ? signCopy : volunteerCopy;
    if (title instanceof HTMLElement) title.textContent = copy.title;
    if (description instanceof HTMLElement) description.textContent = copy.description;
    if (submitButton instanceof HTMLButtonElement) submitButton.textContent = copy.submit;
  };

  /** Configure the form for the call-to-action that opened it. */
  const configureDialog = (button) => {
    const requestedInterest = button.dataset.volunteerInterest || "";

    if (sourceField instanceof HTMLInputElement) {
      sourceField.value = button.dataset.volunteerSource || "website";
    }

    if (interestField instanceof HTMLSelectElement) {
      interestField.value = requestedInterest;
    }

    setSignMode(requestedInterest === "lawn-sign");
  };

  /** Open the form and preserve which call-to-action launched it. */
  const openDialog = (button) => {
    opener = button;
    configureDialog(button);
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

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", () => openDialog(button));
  });

  interestField?.addEventListener("change", () => {
    if (interestField instanceof HTMLSelectElement) {
      setSignMode(interestField.value === "lawn-sign");
    }
  });

  closeButton?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("volunteer-modal-open");
    if (opener instanceof HTMLElement) opener.focus();
  });
})();

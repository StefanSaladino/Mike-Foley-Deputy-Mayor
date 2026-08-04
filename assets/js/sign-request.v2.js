/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — LAWN SIGN / VOLUNTEER DIALOG
   Opens the Netlify support form, records the source CTA,
   validates the selected support options, conditionally requires
   sign-delivery details, timestamps consent, and restores focus.
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

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  const supportOptions = Array.from(
    form.querySelectorAll('input[name="support-options"][type="checkbox"]')
  );
  const signOption = form.querySelector(
    'input[name="support-options"][value="accept-a-sign"]'
  );
  const streetAddress = form.querySelector('input[name="street-address"]');
  const postalCode = form.querySelector('input[name="postal-code"]');
  const signQuantity = form.querySelector('select[name="sign-quantity"]');
  const propertyAuthorization = form.querySelector(
    'input[name="property-authorization"]'
  );

  let opener = null;

  /** Require at least one lawn-sign or volunteer option. */
  const updateSupportOptionValidity = () => {
    const hasSelection = supportOptions.some((option) => option.checked);
    const firstOption = supportOptions[0];

    if (firstOption instanceof HTMLInputElement) {
      firstOption.setCustomValidity(
        hasSelection ? "" : "Select at least one way you would like to help."
      );
    }
  };

  /** Require delivery details only when the visitor requests a lawn sign. */
  const updateSignRequirements = () => {
    const requiresSignDetails =
      signOption instanceof HTMLInputElement && signOption.checked;

    [streetAddress, postalCode, signQuantity, propertyAuthorization].forEach(
      (field) => {
        if (
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement
        ) {
          field.required = requiresSignDetails;

          if (!requiresSignDetails) {
            field.setCustomValidity("");
          }
        }
      }
    );
  };

  const validateSupportForm = () => {
    updateSupportOptionValidity();
    updateSignRequirements();
  };

  const openDialog = (button) => {
    opener = button;

    if (sourceField instanceof HTMLInputElement) {
      sourceField.value = button.dataset.signSource || "website";
    }

    validateSupportForm();
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

  supportOptions.forEach((option) => {
    option.addEventListener("change", validateSupportForm);
  });

  form.addEventListener("submit", (event) => {
    validateSupportForm();

    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      return;
    }

    if (consentTimestamp instanceof HTMLInputElement) {
      consentTimestamp.value = new Date().toISOString();
    }
  });

  validateSupportForm();
})();

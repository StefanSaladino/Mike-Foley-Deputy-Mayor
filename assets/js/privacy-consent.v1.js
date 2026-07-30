/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — PRIVACY NOTICE
   Remembers acceptance only when the visitor chooses to save
   the preference. The alternative lasts for the current tab.
========================================================= */

(() => {
  "use strict";

  const notice = document.querySelector("[data-privacy-consent]");
  if (!(notice instanceof HTMLElement)) return;

  const acceptButton = notice.querySelector("[data-privacy-accept]");
  const sessionButton = notice.querySelector("[data-privacy-session]");
  const persistentKey = "mike-foley-privacy-choice-v1";
  const sessionKey = "mike-foley-privacy-seen-v1";

  const safelyRead = (storage, key) => {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  };

  const safelyWrite = (storage, key, value) => {
    try {
      storage.setItem(key, value);
    } catch {
      // Storage can be unavailable in private browsing or strict modes.
    }
  };

  const hideNotice = () => {
    notice.hidden = true;
  };

  const hasPersistentChoice = safelyRead(window.localStorage, persistentKey) === "accepted";
  const hasSessionChoice = safelyRead(window.sessionStorage, sessionKey) === "seen";

  if (!hasPersistentChoice && !hasSessionChoice) {
    notice.hidden = false;
  }

  acceptButton?.addEventListener("click", () => {
    safelyWrite(window.localStorage, persistentKey, "accepted");
    safelyWrite(window.sessionStorage, sessionKey, "seen");
    hideNotice();
  });

  sessionButton?.addEventListener("click", () => {
    safelyWrite(window.sessionStorage, sessionKey, "seen");
    hideNotice();
  });
})();

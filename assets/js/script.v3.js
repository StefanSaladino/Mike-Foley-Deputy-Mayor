/* =========================================================
   MIKE FOLEY CAMPAIGN WEBSITE — CORE INTERACTIONS
   Handles navigation, scroll state, active sections, reveal effects,
   scroll progress, and the dynamic copyright year.
========================================================= */

(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("[data-site-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menuClose = document.querySelector("[data-menu-close]");
  const menuBackdrop = document.querySelector("[data-menu-backdrop]");
  const navigation = document.querySelector("[data-navigation]");
  const navigationLinks = Array.from(
    document.querySelectorAll('[data-navigation] a[href^="#"]')
  );
  const progressBar = document.querySelector("[data-scroll-progress]");
  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  const currentYearItems = document.querySelectorAll("[data-current-year]");
  const desktopNavigation = window.matchMedia("(min-width: 64rem)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let lastFocusedElement = null;

  /** Return focusable elements currently available inside the mobile drawer. */
  const getFocusableNavigationItems = () => {
    if (!navigation) return [];

    return Array.from(
      navigation.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => !element.hasAttribute("hidden"));
  };

  /** Open the off-canvas navigation and move keyboard focus into it. */
  const openNavigation = () => {
    if (!navigation || !menuToggle || desktopNavigation.matches) return;

    lastFocusedElement = document.activeElement;
    body.classList.add("menu-open");
    navigation.classList.add("is-open");
    menuBackdrop?.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    navigation.setAttribute("aria-hidden", "false");
    navigation.removeAttribute("inert");

    window.requestAnimationFrame(() => {
      const firstFocusable = getFocusableNavigationItems()[0];
      firstFocusable?.focus();
    });
  };

  /** Close the off-canvas navigation and restore focus when appropriate. */
  const closeNavigation = ({ restoreFocus = true } = {}) => {
    if (!navigation || !menuToggle) return;

    body.classList.remove("menu-open");
    navigation.classList.remove("is-open");
    menuBackdrop?.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.setAttribute(
      "aria-hidden",
      desktopNavigation.matches ? "false" : "true"
    );
    navigation.toggleAttribute("inert", !desktopNavigation.matches);

    if (restoreFocus && lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  /** Keep keyboard focus inside the open mobile drawer. */
  const trapNavigationFocus = (event) => {
    if (
      event.key !== "Tab" ||
      !body.classList.contains("menu-open") ||
      desktopNavigation.matches
    ) {
      return;
    }

    const focusableItems = getFocusableNavigationItems();
    if (focusableItems.length === 0) return;

    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
      event.preventDefault();
      lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
      event.preventDefault();
      firstItem.focus();
    }
  };

  /** Synchronize navigation accessibility state when the viewport changes. */
  const synchronizeNavigationMode = () => {
    if (!navigation || !menuToggle) return;

    if (desktopNavigation.matches) {
      closeNavigation({ restoreFocus: false });
      navigation.setAttribute("aria-hidden", "false");
      navigation.removeAttribute("inert");
      menuToggle.setAttribute("aria-expanded", "false");
    } else if (!navigation.classList.contains("is-open")) {
      navigation.setAttribute("aria-hidden", "true");
      navigation.setAttribute("inert", "");
    }
  };

  /** Update the fixed header and page progress indicator efficiently. */
  const updateScrollUI = () => {
    const scrollTop = Math.max(window.scrollY, 0);
    header?.classList.toggle("is-scrolled", scrollTop > 24);

    if (progressBar) {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight > 0
          ? Math.min(Math.max(scrollTop / scrollableHeight, 0), 1)
          : 0;

      progressBar.style.transform = `scaleX(${progress})`;
    }
  };

  /** Reveal content once it enters the viewport; show everything immediately otherwise. */
  const initializeRevealEffects = () => {
    revealItems.forEach((item) => {
      const delay = Number.parseInt(item.dataset.delay ?? "0", 10);
      item.style.setProperty(
        "--reveal-delay",
        `${Number.isFinite(delay) ? delay : 0}ms`
      );
    });

    if (
      reducedMotion.matches ||
      !("IntersectionObserver" in window) ||
      revealItems.length === 0
    ) {
      revealItems.forEach((item) => item.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-revealed");
          activeObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  /** Highlight the navigation link belonging to the section closest to view. */
  const initializeActiveNavigation = () => {
    if (!("IntersectionObserver" in window) || navigationLinks.length === 0) {
      return;
    }

    const sections = navigationLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter((section) => section instanceof HTMLElement);

    if (sections.length === 0) return;

    const linkById = new Map(
      navigationLinks.map((link) => [link.getAttribute("href")?.slice(1), link])
    );

    const setActiveLink = (sectionId) => {
      navigationLinks.forEach((link) => {
        const isActive = link === linkById.get(sectionId);
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const activeSection = visibleEntries[0]?.target;
        if (activeSection?.id) setActiveLink(activeSection.id);
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.01, 0.15, 0.35],
      }
    );

    sections.forEach((section) => observer.observe(section));
    setActiveLink(window.location.hash.slice(1) || "home");
  };

  /** Apply the current year anywhere the footer requests it. */
  const initializeCurrentYear = () => {
    const currentYear = String(new Date().getFullYear());
    currentYearItems.forEach((item) => {
      item.textContent = currentYear;
    });
  };

  menuToggle?.addEventListener("click", openNavigation);
  menuClose?.addEventListener("click", () => closeNavigation());
  menuBackdrop?.addEventListener("click", () => closeNavigation());

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!desktopNavigation.matches) {
        closeNavigation({ restoreFocus: false });
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeNavigation();
      return;
    }

    trapNavigationFocus(event);
  });

  desktopNavigation.addEventListener?.("change", synchronizeNavigationMode);
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI);

  synchronizeNavigationMode();
  updateScrollUI();
  initializeRevealEffects();
  initializeActiveNavigation();
  initializeCurrentYear();
})();

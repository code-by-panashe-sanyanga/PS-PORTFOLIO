// Contact form (FormSubmit), project gallery lightbox slideshow, footer year.

const CONTACT_ENDPOINT =
  "https://formsubmit.co/ajax/panashe.sanyanga@hotmail.com";

/**
 * Posts the contact form to FormSubmit so the message reaches inbox email
 * without needing a local mail client. Shows success/error on the page.
 */
function handleContactForm() {
  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) return;

  let status = contactForm.querySelector(".contact-form-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "contact-form-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    contactForm.appendChild(status);
  }

  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    if (!formData.get("_subject")) {
      formData.set("_subject", formData.get("subject") || "Portfolio contact");
    }
    formData.set("_template", "table");
    formData.set("_captcha", "false");

    status.textContent = "Sending…";
    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Send failed");
      }
      status.textContent =
        "Message sent. If this is the first submit from this form, check hotmail for a FormSubmit activation email and confirm it.";
      contactForm.reset();
    } catch (err) {
      status.textContent =
        "Could not send right now. Email panashe.sanyanga@hotmail.com directly.";
      console.error(err);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function setFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

const LIGHTBOX_INTERVAL_MS = 4000;

/**
 * Reduced motion: kept as a live-updating flag (not just a one-time check)
 * because a user can toggle the OS setting while the page is already open.
 */
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let prefersReducedMotion = reducedMotionQuery.matches;

/**
 * Project galleries: keep the thumbnail grid, wrap each image in a button,
 * click to expand into a lightbox slideshow (prev/next, dots, keyboard, autoplay).
 *
 * Accessibility notes (audited and fixed here):
 * - Focus moves into the lightbox on open and is trapped there with Tab /
 *   Shift+Tab, so keyboard users can't tab out to the page behind it.
 * - Focus returns to the thumbnail that opened the lightbox on close.
 * - Left/Right arrows and Escape work from anywhere while it's open.
 * - Autoplay is skipped entirely if the OS is set to prefers-reduced-motion,
 *   and stops immediately if that setting changes while open.
 */
function setupProjectGalleries() {
  const galleries = document.querySelectorAll(".project-gallery");
  if (!galleries.length) return;

  // Shared lightbox (one per page)
  let lightbox = document.querySelector(".gallery-lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Screenshot viewer");
    lightbox.tabIndex = -1;
    lightbox.innerHTML =
      '<button type="button" class="gallery-lightbox-close" aria-label="Close">×</button>' +
      '<button type="button" class="gallery-lightbox-nav prev" aria-label="Previous image">‹</button>' +
      '<div class="gallery-lightbox-stage">' +
      '<img alt="" />' +
      '<div class="gallery-lightbox-dots" role="group" aria-label="Choose screenshot"></div>' +
      "</div>" +
      '<button type="button" class="gallery-lightbox-nav next" aria-label="Next image">›</button>';
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector(".gallery-lightbox-stage img");
  const lightboxDots = lightbox.querySelector(".gallery-lightbox-dots");
  const lightboxClose = lightbox.querySelector(".gallery-lightbox-close");
  const lightboxPrev = lightbox.querySelector(".gallery-lightbox-nav.prev");
  const lightboxNext = lightbox.querySelector(".gallery-lightbox-nav.next");

  let slides = [];
  let index = 0;
  let timer = null;
  let triggerEl = null;

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    stopTimer();
    if (prefersReducedMotion) return;
    if (slides.length < 2) return;
    timer = window.setInterval(() => {
      index = (index + 1) % slides.length;
      paintLightbox();
    }, LIGHTBOX_INTERVAL_MS);
  }

  reducedMotionQuery.addEventListener("change", (e) => {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) stopTimer();
  });

  function paintLightbox() {
    if (!slides.length || !lightboxImg || !lightboxDots) return;
    const slide = slides[index];
    lightboxImg.src = slide.src;
    lightboxImg.alt = slide.alt;
    lightboxDots.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot" + (i === index ? " active" : "");
      dot.setAttribute("aria-current", i === index ? "true" : "false");
      dot.setAttribute("aria-label", "Show screenshot " + (i + 1) + " of " + slides.length);
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        index = i;
        paintLightbox();
        startTimer();
      });
      lightboxDots.appendChild(dot);
    });
  }

  function getFocusableElements() {
    return Array.from(
      lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null && !el.disabled);
  }

  function openLightbox(startIndex, gallerySlides, openerEl) {
    triggerEl = openerEl || document.activeElement;
    slides = gallerySlides.slice();
    index = startIndex;
    paintLightbox();
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    startTimer();
    // Move focus into the dialog so screen readers announce it and Tab stays inside.
    lightboxClose.focus();
  }

  function closeLightbox() {
    stopTimer();
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    slides = [];
    if (triggerEl && typeof triggerEl.focus === "function") {
      triggerEl.focus();
    }
    triggerEl = null;
  }

  function next() {
    if (!slides.length) return;
    index = (index + 1) % slides.length;
    paintLightbox();
    startTimer();
  }

  function prev() {
    if (!slides.length) return;
    index = (index - 1 + slides.length) % slides.length;
    paintLightbox();
    startTimer();
  }

  function trapTabKey(e) {
    if (e.key !== "Tab") return;
    const focusable = getFocusableElements();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!lightbox.dataset.bound) {
    lightbox.dataset.bound = "1";
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    lightboxPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      prev();
    });
    lightboxNext.addEventListener("click", (e) => {
      e.stopPropagation();
      next();
    });
    lightboxImg.addEventListener("click", (e) => {
      e.stopPropagation();
      next();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab") trapTabKey(e);
    });
  }

  // Expose for debugging / fallback
  window.__openProjectLightbox = openLightbox;

  galleries.forEach((gallery) => {
    if (gallery.dataset.galleryReady === "1") return;

    const images = Array.from(gallery.querySelectorAll("img.project-screenshot"));
    if (!images.length) return;

    const gallerySlides = images.map((img) => ({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "",
    }));

    gallery.classList.add("project-gallery-interactive");
    gallery.innerHTML = "";

    gallerySlides.forEach((slide, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-thumb";
      btn.setAttribute("aria-label", "Expand screenshot " + (i + 1) + ": " + slide.alt);

      const img = document.createElement("img");
      img.src = slide.src;
      img.alt = slide.alt;
      img.className = "project-screenshot";
      img.loading = "lazy";

      btn.appendChild(img);
      btn.addEventListener("click", () => openLightbox(i, gallerySlides, btn));
      gallery.appendChild(btn);
    });

    gallery.dataset.galleryReady = "1";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setFooterYear();
  handleContactForm();
  setupProjectGalleries();
});

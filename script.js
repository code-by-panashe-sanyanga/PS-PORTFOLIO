// Home page featured-project carousel, contact mailto helper, footer year.

const FEATURED_PROJECTS = [
  {
    title: "NovaBank",
    subtitle: "Online banking",
    image: "images/novabank-dashboard.png",
    alt: "NovaBank dashboard preview",
    blurb:
      "Accounts, transfers, savings pots, spending insights, and an admin audit log. Python, FastAPI, PostgreSQL.",
    github: "https://github.com/code-by-panashe-sanyanga/NovaBank",
    githubReady: false,
    live: "https://novabank-client-production.up.railway.app",
  },
  {
    title: "ChatWire",
    subtitle: "Real-time chat",
    image: "images/chatwire-chat.png",
    alt: "ChatWire live chat preview",
    blurb:
      "Communities, channels, DMs, reactions, stories, and WebRTC calls. Flask-SocketIO and SQLite.",
    github: "https://github.com/code-by-panashe-sanyanga/ChatWire",
    githubReady: false,
    live: "https://chatwire-production.up.railway.app",
  },
];

const CAROUSEL_INTERVAL_MS = 7 * 1000; // auto-advance every 7s
const CAROUSEL_FADE_MS = 280; // match CSS fade before swapping slide content

/**
 * Rotating hero for NovaBank / ChatWire on the home page.
 * Pauses on hover/focus so people can read and click the links.
 */
function setupFeaturedCarousel() {
  const root = document.getElementById("featured-carousel");
  const media = document.getElementById("project-hero-media");
  const kicker = document.getElementById("project-hero-kicker");
  const title = document.getElementById("project-hero-title");
  const blurb = document.getElementById("project-hero-blurb");
  const github = document.getElementById("project-hero-github");
  const live = document.getElementById("project-hero-live");
  const dotsEl = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  // Only runs on pages that have the carousel markup
  if (!root || !media || !title || !blurb || !github || !dotsEl || !prevBtn || !nextBtn) return;

  const total = FEATURED_PROJECTS.length;
  let index = 0;
  let timer = null;
  let fadeTimeout = null;

  function updateDots() {
    dotsEl.innerHTML = "";
    FEATURED_PROJECTS.forEach((project, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === index ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show " + project.title);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
      dot.addEventListener("click", () => {
        index = i;
        render();
        restartTimer();
      });
      dotsEl.appendChild(dot);
    });
  }

  function render() {
    const project = FEATURED_PROJECTS[index];
    root.classList.add("is-fading");

    // Cancel any queued fade so rapid clicks don't stack updates
    if (fadeTimeout) window.clearTimeout(fadeTimeout);
    fadeTimeout = window.setTimeout(() => {
      media.style.backgroundImage = 'url("' + project.image + '")';
      media.setAttribute("aria-label", project.alt);
      if (kicker) kicker.textContent = project.subtitle;
      title.textContent = project.title;
      blurb.textContent = project.blurb;
      if (project.githubReady) {
        github.href = project.github;
        github.classList.remove("is-disabled");
        github.removeAttribute("aria-disabled");
        github.title = "";
        github.textContent = "View on GitHub";
      } else {
        github.removeAttribute("href");
        github.classList.add("is-disabled");
        github.setAttribute("aria-disabled", "true");
        github.title = "Repo is still being tidied up, not public yet";
        github.textContent = "GitHub · soon";
      }
      if (live) {
        if (project.live) {
          live.href = project.live;
          live.hidden = false;
        } else {
          live.hidden = true;
        }
      }
      updateDots();
      root.classList.remove("is-fading");
    }, CAROUSEL_FADE_MS);
  }

  function next() {
    index = (index + 1) % total;
    render();
  }

  function prev() {
    index = (index - 1 + total) % total;
    render();
  }

  function restartTimer() {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(next, CAROUSEL_INTERVAL_MS);
  }

  prevBtn.addEventListener("click", () => {
    prev();
    restartTimer();
  });
  nextBtn.addEventListener("click", () => {
    next();
    restartTimer();
  });

  // Pause autoplay while the user is interacting with the carousel
  root.addEventListener("mouseenter", () => {
    if (timer) window.clearInterval(timer);
  });
  root.addEventListener("mouseleave", restartTimer);
  root.addEventListener("focusin", () => {
    if (timer) window.clearInterval(timer);
  });
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) restartTimer();
  });

  // First slide paints immediately (no fade wait)
  const first = FEATURED_PROJECTS[0];
  media.style.backgroundImage = 'url("' + first.image + '")';
  if (kicker) kicker.textContent = first.subtitle;
  title.textContent = first.title;
  blurb.textContent = first.blurb;
  if (first.githubReady) {
    github.href = first.github;
    github.classList.remove("is-disabled");
    github.removeAttribute("aria-disabled");
    github.title = "";
    github.textContent = "View on GitHub";
  } else {
    github.removeAttribute("href");
    github.classList.add("is-disabled");
    github.setAttribute("aria-disabled", "true");
    github.title = "Repo is still being tidied up, not public yet";
    github.textContent = "GitHub · soon";
  }
  if (live) {
    if (first.live) {
      live.href = first.live;
      live.hidden = false;
    } else {
      live.hidden = true;
    }
  }
  updateDots();
  restartTimer();
}

function scrollToSelectedWork() {
  const section =
    document.getElementById("selected-work") ||
    document.getElementById("projects");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Contact form has no backend. Builds a mailto: link with the form fields
 * and opens the visitor's mail client.
 */
function handleContactForm() {
  const contactForm = document.querySelector(".contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject") || "Portfolio contact";
    const message = formData.get("message");

    window.location.href =
      "mailto:panashe.sanyanga@hotmail.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
  });
}

// Avoid hard-coding the year in every HTML footer
function setFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupFeaturedCarousel();
  setFooterYear();

  const ctaButton =
    document.querySelector('.cta[href="#selected-work"]') ||
    document.querySelector('.cta[href="#projects"]');
  if (ctaButton) {
    ctaButton.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToSelectedWork();
    });
  }

  handleContactForm();
});

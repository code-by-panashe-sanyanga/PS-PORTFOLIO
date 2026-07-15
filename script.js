// Investment Dashboard demo - I created this to show interactive charts
// It's a simple bar chart using divs since I wanted to keep it lightweight
function showDashboard() {
  const chartDiv = document.getElementById("dashboard-chart");
  if (!chartDiv) {
    console.error("Dashboard chart element not found. This function is expected on the Projects page.");
    return;
  }

  chartDiv.innerHTML = "";
  const data = [70, 85, 55, 90, 65];
  const labels = ["Revenue", "Profit", "Expenses", "Growth", "Risk"];

  data.forEach((val, i) => {
    const bar = document.createElement("div");
    bar.style.width = val + "%";
    // Use CSS custom properties for consistent styling (from your CSS)
    bar.style.backgroundColor = "var(--accent-color)"; // Ensure this is applied
    bar.style.color = "var(--bg-dark)"; // Ensure this is applied
    bar.style.padding = "2px 5px"; // Match CSS for dashboard bars
    bar.style.margin = "4px 0"; // Match CSS for dashboard bars
    bar.style.borderRadius = "10px"; // Match CSS for dashboard bars
    bar.style.fontWeight = "500";
    bar.style.fontSize = "0.9rem"; // A bit smaller for bars
    bar.textContent = labels[i] + ": " + val + "%";
    chartDiv.appendChild(bar);
  });
}

// Algorithm Visualizer - This was fun to build!
// I wanted to show how algorithms work visually, so I made a simple BFS demo
// It draws on canvas and shows nodes connecting to each other
function runVisualizer() {
  const canvas = document.getElementById("algoCanvas");
  if (!canvas) {
    console.error("Algorithm canvas element not found. This function is expected on the Projects page.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Canvas context not available");
    return;
  }

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set colors using CSS custom properties approach
  // Match colors with your CSS variables for consistency
  const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
  const bgDark = getComputedStyle(document.documentElement).getPropertyValue('--bg-dark').trim();


  ctx.fillStyle = textPrimary; // Light color for nodes
  ctx.strokeStyle = accentColor; // Accent color for edges
  ctx.lineWidth = 2;

  const nodes = [
    { x: 50, y: 70 },
    { x: 130, y: 30 },
    { x: 130, y: 110 },
    { x: 210, y: 70 },
  ];

  // Draw edges
  const edges = [
    [0, 1], // Node 0 to Node 1
    [1, 3], // Node 1 to Node 3
    [0, 2], // Node 0 to Node 2
    [2, 3], // Node 2 to Node 3
  ];

  edges.forEach(([from, to]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[from].x, nodes[from].y);
    ctx.lineTo(nodes[to].x, nodes[to].y);
    ctx.stroke();
  });

  // Draw nodes as circles with labels
  nodes.forEach((node, i) => {
    // Draw circle background
    ctx.beginPath();
    ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
    ctx.fill();

    // Draw text
    ctx.fillStyle = bgDark; // Dark text on light node background
    ctx.font = "12px Roboto, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i + 1, node.x, node.y);

    // Reset fill style for next node
    ctx.fillStyle = textPrimary;
  });
}

// Currency Converter - This one was tricky!
// I wanted to show real-time data fetching, so I built a currency converter
// It fetches live exchange rates from an API (but you need your own API key)
function convertCurrency() {
  const result = document.getElementById("conversion-result");
  if (!result) {
    console.error("Conversion result element not found. This function is expected on the Projects page.");
    return;
  }

  result.textContent = "Fetching exchange rates...";
  result.style.color = "var(--text-secondary)"; // Initial text color

  // Using exchangerate-api.com - it's pretty reliable
  // You need to sign up for a free API key at https://www.exchangerate-api.com/
  // The free tier gives you 1000 requests per month, which is plenty for testing
  const API_KEY = 'YOUR_API_KEY'; // <<< IMPORTANT: Replace with your actual API key
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

  fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.result === 'success' && data.conversion_rates && data.conversion_rates.EUR) {
        const rate = data.conversion_rates.EUR;
        result.textContent = `1 USD = ${rate.toFixed(4)} EUR`;
        result.style.color = "var(--text-primary)"; // Success text color
      } else {
        throw new Error("Invalid API response format or 'fail' result.");
      }
    })
    .catch((error) => {
      console.error("Currency conversion error:", error);
      result.textContent = "Error: Unable to fetch rates. Check console.";
      result.style.color = "red"; // Indicate error clearly
    });
}

// Featured project hero on the home page  -  one spotlight, rotates every 2 minutes
const FEATURED_PROJECTS = [
  {
    title: "NovaBank",
    subtitle: "Online banking app",
    image: "images/novabank-dashboard.png",
    alt: "NovaBank dashboard preview",
    blurb: "Accounts, transfers, card freezing, spending chart, and an admin panel with an audit log.",
    github: "https://github.com/code-by-panashe-sanyanga/NovaBank",
  },
  {
    title: "LuckyReels",
    subtitle: "Online casino",
    image: "images/luckyreels-lobby.png",
    alt: "LuckyReels casino lobby preview",
    blurb: "Slots, hi-lo, and lucky wheel decided on the server, plus a cashier with withdrawals and deposit limits.",
    github: "https://github.com/code-by-panashe-sanyanga/LuckyReels",
  },
  {
    title: "ChatWire",
    subtitle: "Real-time chat",
    image: "images/chatwire-chat.png",
    alt: "ChatWire live chat preview",
    blurb: "Room chat with Flask-SocketIO: join, send messages, live updates across tabs.",
    github: "https://github.com/code-by-panashe-sanyanga/ChatWire",
  },
  {
    title: "ShopSphere",
    subtitle: "Online shop",
    image: "images/shopsphere-home.png",
    alt: "ShopSphere catalogue preview",
    blurb: "Flask shop with product images, session cart, search, and checkout stored on the server.",
    github: "https://github.com/code-by-panashe-sanyanga/ShopSphere",
  },
  {
    title: "StreamFlix",
    subtitle: "Movie streaming app",
    image: "images/streamflix-home.png",
    alt: "StreamFlix homepage preview",
    blurb: "Movie browser with search, register/login, and a watchlist. Node.js API with JWT auth.",
    github: "https://github.com/code-by-panashe-sanyanga/StreamFlix",
  },
  {
    title: "WaveBox",
    subtitle: "Music player",
    image: "images/wavebox-library.png",
    alt: "WaveBox library preview",
    blurb: "FastAPI backend serving track JSON, with a plain HTML/CSS/JS player and playback controls.",
    github: "https://github.com/code-by-panashe-sanyanga/WaveBox",
  },
];

const CAROUSEL_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

function setupFeaturedCarousel() {
  const root = document.getElementById("featured-carousel");
  const media = document.getElementById("project-hero-media");
  const kicker = document.getElementById("project-hero-kicker");
  const title = document.getElementById("project-hero-title");
  const blurb = document.getElementById("project-hero-blurb");
  const github = document.getElementById("project-hero-github");
  const dotsEl = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  if (!root || !media || !title || !blurb || !github || !dotsEl || !prevBtn || !nextBtn) return;

  const total = FEATURED_PROJECTS.length;
  let index = 0;
  let timer = null;

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

    window.setTimeout(() => {
      media.style.backgroundImage = 'url("' + project.image + '")';
      media.setAttribute("aria-label", project.alt);
      if (kicker) kicker.textContent = project.subtitle;
      title.textContent = project.title;
      blurb.textContent = project.blurb;
      github.href = project.github;
      updateDots();
      root.classList.remove("is-fading");
    }, 280);
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

  // First paint without waiting on the fade delay
  const first = FEATURED_PROJECTS[0];
  media.style.backgroundImage = 'url("' + first.image + '")';
  if (kicker) kicker.textContent = first.subtitle;
  title.textContent = first.title;
  blurb.textContent = first.blurb;
  github.href = first.github;
  updateDots();
  restartTimer();
}

// Setup horizontal slider controls for projects
function setupProjectSlider() {
  const slider = document.querySelector(".slider-wrapper");
  const prevBtn = document.querySelector(".slide-btn.prev");
  const nextBtn = document.querySelector(".slide-btn.next");

  // Only proceed if all elements are found (i.e., we are on the page with the slider)
  if (!slider || !prevBtn || !nextBtn) {
    // console.warn("Slider elements not found - slider functionality disabled for this page.");
    return; // Exit if not on the relevant page
  }

  // Adjust scrollAmount to match your project card width + gap for better sliding
  // Example: if card is 320px and gap is 1.5rem (24px at 16px base font size)
  const cardWidth = 320; // from .project-card flex-basis
  const gap = 24; // from .slider-wrapper gap (1.5rem * 16px)
  const scrollAmount = cardWidth + gap;

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    slider.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    slider.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  // Add keyboard navigation
  slider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevBtn.click();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextBtn.click();
    }
  });

  // Make slider focusable for keyboard navigation
  slider.setAttribute("tabindex", "0");
}

// Smooth scroll to projects section when "See My Projects" CTA is clicked
function scrollToProjects() {
  const projectsSection = document.getElementById("projects");
  if (projectsSection) {
    projectsSection.scrollIntoView({
      behavior: "smooth",
      block: "start" // Scrolls to the top of the element
    });
  }
}

// Button handler - This was actually harder than I thought!
// I had to debug why buttons weren't working and found out it was a z-index issue
// The floating card effects were covering the buttons - classic CSS problem!
function handleAllButtons() {
  console.log('=== BUTTON SETUP STARTED ===');
  
  // First, let's test if we can find ANY buttons
  // I learned this the hard way - always check if elements exist before trying to use them
  const allButtons = document.querySelectorAll('a.button-link');
  console.log('ALL buttons found:', allButtons.length);
  
  if (allButtons.length === 0) {
    console.log('ERROR: No buttons found! Check HTML structure.');
    return;
  }
  
  // Handle all project buttons
  const projectButtons = document.querySelectorAll('.project-links .button-link');
  console.log('Project buttons found:', projectButtons.length);
  
  projectButtons.forEach((btn, i) => {
    console.log(`Setting up project button ${i+1}: ${btn.href}`);
    
    // Make sure button is clickable
    btn.style.cursor = 'pointer';
    btn.style.pointerEvents = 'auto';
    
    // Add click event
    btn.onclick = function(e) {
      console.log('PROJECT BUTTON CLICKED:', this.href);
      
      // Visual feedback
      this.style.transform = 'scale(0.95)';
      this.style.opacity = '0.8';
      setTimeout(() => {
        this.style.transform = '';
        this.style.opacity = '';
      }, 150);
      
      // Let browser handle the link (target="_blank" will open in new tab)
      return true;
    };
  });

  console.log('=== BUTTON SETUP COMPLETE ===');
}

// Contact form handler - I kept this simple but effective
// Instead of a complex backend, I just open the user's email client
// It's not fancy, but it works and doesn't need a server!
function handleContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data - FormData is pretty cool for this
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject') || 'Portfolio Contact Form';
      const message = formData.get('message');
      
      // Create mailto link - this is a neat trick!
      // It opens the user's default email client with everything pre-filled
      const mailtoLink = `mailto:panashe.sanyanga@hotmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      
      // Open email client - much simpler than setting up a backend!
      window.location.href = mailtoLink;
      
      // Show success message
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Email Client Opened!';
      submitButton.style.backgroundColor = '#28a745';
      
      // Reset button after 3 seconds
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.style.backgroundColor = '';
        contactForm.reset();
      }, 3000);
    });
  }
}

// Initialize functions on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("=== JAVASCRIPT LOADED ===");
  
  // Setup project slider only if the elements exist on the current page
  setupProjectSlider();
  setupFeaturedCarousel();

  // Add event listener for CTA button on the Home page
  const ctaButton = document.querySelector(".cta");
  if (ctaButton && ctaButton.getAttribute("href") === "#projects") {
    ctaButton.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToProjects();
    });
  }
  
  // Handle all buttons (GitHub, Live Demo, Read Article)
  handleAllButtons();
  
  // Handle contact form
  handleContactForm();
  
  console.log("=== ALL FUNCTIONS INITIALIZED ===");
});
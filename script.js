const loadingScreen = document.getElementById("loadingScreen");
const bootStart = performance.now();
const MIN_LOADING_TIME = 1600;
const MAX_LOADING_TIME = 2800;
let hasHiddenLoading = false;
const loadingMessageEl = loadingScreen?.querySelector(".loading-message");
const loadingBarEl = loadingScreen?.querySelector(".loading-bar");
const loadingProgressEl = loadingScreen?.querySelector(".loading-progress");
const loadingPercentageEl = loadingScreen?.querySelector(".loading-percentage");
let progressIntervalId;
let progress = 0;

if (loadingBarEl) {
  loadingBarEl.setAttribute("aria-valuemin", "0");
  loadingBarEl.setAttribute("aria-valuemax", "100");
  loadingBarEl.setAttribute("aria-valuenow", "0");
}

const setProgress = (value) => {
  const clamped = Math.max(0, Math.min(100, value));
  progress = clamped;

  if (loadingProgressEl) {
    loadingProgressEl.style.width = `${clamped}%`;
  }

  if (loadingBarEl) {
    loadingBarEl.setAttribute("aria-valuenow", `${Math.round(clamped)}`);
  }

  if (loadingPercentageEl) {
    loadingPercentageEl.textContent = `${Math.round(clamped)}%`;
  }
};

setProgress(0);

if (loadingScreen) {
  if (loadingMessageEl) {
    loadingMessageEl.textContent = "Chargement du Portfolio";
  }

  setProgress(5);

  progressIntervalId = setInterval(() => {
    if (hasHiddenLoading) {
      clearInterval(progressIntervalId);
      progressIntervalId = undefined;
      return;
    }

    const increment = Math.random() * 2 + 1;
    const nextValue = Math.min(progress + increment, 96);
    setProgress(nextValue);

    if (nextValue >= 96) {
      clearInterval(progressIntervalId);
      progressIntervalId = undefined;
    }
  }, 130);
}

// Ensure the simulated boot finishes cleanly before removing the overlay.
const completeLoadingSequence = () => {
  if (progressIntervalId) {
    clearInterval(progressIntervalId);
    progressIntervalId = undefined;
  }

  setProgress(100);
};

const hideLoadingScreen = () => {
  if (hasHiddenLoading || !loadingScreen) {
    return;
  }

  hasHiddenLoading = true;
  loadingScreen.style.pointerEvents = "none";
  completeLoadingSequence();

  loadingScreen.addEventListener(
    "transitionend",
    () => {
      loadingScreen.remove();
    },
    { once: true }
  );

  setTimeout(() => {
    loadingScreen.classList.add("fade-out");
  }, 420);
};

setTimeout(hideLoadingScreen, MAX_LOADING_TIME);

window.addEventListener("load", () => {
  const elapsed = performance.now() - bootStart;
  const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);
  setTimeout(hideLoadingScreen, remaining);
});

// Matrix-style animated background
const matrixCanvas = document.getElementById("matrixBackground");

if (matrixCanvas) {
  const ctx = matrixCanvas.getContext("2d");
  const glyphs = "01<>[]{}#$%&IMADCYBER".split("");
  const fontSize = 16;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let columns = 0;
  let drops = [];
  let glyphGradient;

  const resizeMatrix = () => {
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    matrixCanvas.width = width * dpr;
    matrixCanvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    columns = Math.floor(width / fontSize);
    drops = Array.from(
      { length: columns },
      () => Math.random() * (height / fontSize)
    );
    glyphGradient = ctx.createLinearGradient(0, 0, width, height);
    glyphGradient.addColorStop(0, "rgba(0, 255, 0, 0.85)");
    glyphGradient.addColorStop(0.5, "rgba(0, 212, 255, 0.6)");
    glyphGradient.addColorStop(1, "rgba(0, 255, 0, 0.85)");
  };

  const drawMatrix = () => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(5, 12, 32, 0.2)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = glyphGradient;
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.shadowColor = "rgba(0, 255, 0, 0.35)";
    ctx.shadowBlur = 12;

    drops.forEach((drop, index) => {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = index * fontSize;
      const y = drop * fontSize;
      ctx.fillText(char, x, y);

      if (y > height + 100 && Math.random() > 0.965) {
        drops[index] = 0;
      } else {
        drops[index] = drop + (Math.random() * 0.6 + 0.9);
      }
    });

    requestAnimationFrame(drawMatrix);
  };

  resizeMatrix();
  window.addEventListener("resize", resizeMatrix);
  requestAnimationFrame(drawMatrix);
}

// Mobile menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
}

// Smooth scroll and active nav
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Update active nav link on scroll
window.addEventListener("scroll", () => {
  let current = "";
  const sections = document.querySelectorAll("section[id]");

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".competence-category, .project-card, .cert-card, .timeline-content, .contact-card"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// Parallax effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const floatingIcons = document.querySelectorAll(".floating-icon");
  floatingIcons.forEach((icon, index) => {
    const speed = (index + 1) * 0.5;
    icon.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
  });
});

// Glitch effect on hover
document.querySelectorAll(".glitch").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    el.style.animation = "glitch 0.3s ease-in-out";
  });
  el.addEventListener("animationend", () => {
    el.style.animation = "";
  });
});

// Add active state styling
const style = document.createElement("style");
style.textContent = `
    .nav-link.active {
        color: var(--accent-green);
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
    }
`;
document.head.appendChild(style);

console.log("✓ Portfolio chargé !");

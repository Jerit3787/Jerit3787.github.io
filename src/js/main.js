/* ============================================================
   Portfolio interactions — vanilla JS, no framework dependencies
   ============================================================ */

/* ----- Typewriter effect ----- */
function TxtType(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.isDeleting = false;
  this.tick();
}

TxtType.prototype.tick = function () {
  const i = this.loopNum % this.toRotate.length;
  const fullTxt = this.toRotate[i];

  this.txt = this.isDeleting
    ? fullTxt.substring(0, this.txt.length - 1)
    : fullTxt.substring(0, this.txt.length + 1);

  const wrap = document.createElement("span");
  wrap.classList.add("wrap");
  wrap.textContent = this.txt;
  this.el.innerHTML = "";
  this.el.appendChild(wrap);

  let delta = 100 + Math.floor(Math.random() * 60) - 30;
  if (this.isDeleting) delta /= 2;

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(() => this.tick(), delta);
};

/* ----- Theme toggle ----- */
function getThemePreference() {
  return localStorage.getItem("theme") || "dark";
}

function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");
  localStorage.setItem("theme", theme);
  document.querySelectorAll("#theme-toggle i, #mobile-theme-toggle i").forEach((icon) => {
    icon.textContent = theme === "light" ? "brightness_3" : "brightness_7";
  });
}

function toggleTheme() {
  applyTheme(getThemePreference() === "dark" ? "light" : "dark");
}

/* ----- Mobile navigation drawer ----- */
function initMobileNav() {
  const drawer = document.getElementById("mobile-nav");
  const overlay = document.getElementById("nav-overlay");
  const openBtn = document.getElementById("nav-toggle");
  const closeBtn = document.getElementById("nav-close");
  if (!drawer || !overlay || !openBtn) return;

  const open = () => {
    drawer.classList.remove("translate-x-full");
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    drawer.classList.add("translate-x-full");
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  closeBtn && closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);
  drawer.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      // Theme toggle button should not close the drawer.
      if (link.id !== "mobile-theme-toggle") close();
    });
  });
}

/* ----- Scroll reveal ----- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const show = (el) => el.classList.add("is-visible");

  if (!("IntersectionObserver" in window)) {
    items.forEach(show);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));

  // Fail-safe: if the observer never reports (rare environments), make sure
  // no content stays hidden.
  setTimeout(() => items.forEach(show), 2500);
}

/* ----- Sticky header shadow ----- */
function initHeaderShadow() {
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("shadow-lg", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ----- Image modal with zoom + pan ----- */
function initImageModal() {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const caption = document.getElementById("imageCaption");
  const closeBtn = document.querySelector(".image-modal-close");
  if (!modal || !modalImg) return;

  let scale = 1, panning = false, transformX = 0, transformY = 0;
  let start = { x: 0, y: 0 };
  let initialDistance = 0, initialScale = 1;

  const updateTransform = () => {
    modalImg.style.transform = `translate(calc(-50% + ${transformX}px), calc(-50% + ${transformY}px)) scale(${scale})`;
  };
  const reset = () => {
    scale = 1; transformX = 0; transformY = 0;
    modalImg.style.transform = "translate(-50%, -50%) scale(1)";
    modalImg.style.cursor = "zoom-in";
  };
  const openModal = (img) => {
    modal.style.display = "block";
    modalImg.src = img.src;
    caption.textContent = img.alt;
    reset();
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    modal.classList.add("closing");
    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove("closing");
      document.body.style.overflow = "";
      reset();
    }, 300);
  };

  document.querySelectorAll(".zoomable").forEach((img) => {
    img.addEventListener("click", () => openModal(img));
  });

  modalImg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = modalImg.getBoundingClientRect();
    const ox = e.clientX - rect.left, oy = e.clientY - rect.top;
    const newScale = Math.min(Math.max(1, scale + (e.deltaY > 0 ? -0.1 : 0.1)), 3);
    if (newScale !== scale) {
      const change = newScale / scale;
      transformX = ox - (ox - transformX) * change;
      transformY = oy - (oy - transformY) * change;
      scale = newScale;
      updateTransform();
      modalImg.style.cursor = scale > 1 ? "grab" : "zoom-in";
    }
  }, { passive: false });

  modalImg.addEventListener("dblclick", (e) => {
    if (scale === 1) {
      const rect = modalImg.getBoundingClientRect();
      const ox = e.clientX - rect.left, oy = e.clientY - rect.top;
      scale = 2; transformX = ox - ox * 2; transformY = oy - oy * 2;
    } else { scale = 1; transformX = 0; transformY = 0; }
    updateTransform();
    modalImg.style.cursor = scale > 1 ? "grab" : "zoom-in";
  });

  modalImg.addEventListener("mousedown", (e) => {
    if (scale > 1) {
      e.preventDefault();
      panning = true;
      start = { x: e.clientX - transformX, y: e.clientY - transformY };
      modalImg.style.cursor = "grabbing";
    }
  });
  document.addEventListener("mousemove", (e) => {
    if (!panning) return;
    transformX = e.clientX - start.x;
    transformY = e.clientY - start.y;
    updateTransform();
  });
  document.addEventListener("mouseup", () => {
    if (panning) { panning = false; modalImg.style.cursor = scale > 1 ? "grab" : "zoom-in"; }
  });

  const dist = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  modalImg.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialDistance = dist(e.touches[0], e.touches[1]);
      initialScale = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      e.preventDefault();
      panning = true;
      start = { x: e.touches[0].clientX - transformX, y: e.touches[0].clientY - transformY };
    }
  }, { passive: false });
  modalImg.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      scale = Math.min(Math.max(1, initialScale * (dist(e.touches[0], e.touches[1]) / initialDistance)), 3);
      updateTransform();
    } else if (e.touches.length === 1 && panning) {
      transformX = e.touches[0].clientX - start.x;
      transformY = e.touches[0].clientY - start.y;
      updateTransform();
    }
  }, { passive: false });
  modalImg.addEventListener("touchend", (e) => { if (e.touches.length === 0) panning = false; });

  closeBtn && closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal && scale === 1) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (modal.style.display !== "block") return;
    if (e.key === "Escape") closeModal();
    if (e.key === "r") reset();
  });
}

/* ----- Boot ----- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".typewrite").forEach((el) => {
    const data = el.getAttribute("data-type");
    if (data) new TxtType(el, JSON.parse(data), el.getAttribute("data-period"));
  });

  applyTheme(getThemePreference());

  document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
  document.getElementById("mobile-theme-toggle")?.addEventListener("click", toggleTheme);

  initMobileNav();
  initReveal();
  initHeaderShadow();
  initImageModal();
});

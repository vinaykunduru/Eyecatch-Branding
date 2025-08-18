console.log("🚀 custom.js loaded");

let swup = new Swup({
  containers: ["#swup"],
});

let ctx = null;
let swiperInstance = null;

// ==============================
// Kill Old GSAP Before Init
// ==============================
function cleanupAnimations() {
  console.log("🧹 cleanupAnimations()");
  ScrollTrigger.getAll().forEach((st) => st.kill());
  gsap.globalTimeline.clear();
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
}

// ==============================
// Init Animations
// ==============================
function initAnimations() {
  console.log("🎬 initAnimations() running on:", window.location.pathname);

  // Always cleanup first
  cleanupAnimations();

  ctx = gsap.context(() => {
    // Split text
    document.querySelectorAll(".reveal-split").forEach((el) => {
      new SplitType(el, { types: "words, chars", tagName: "span" });
    });

    // Headings animation
    gsap.from(".reveal-split .word", {
      y: "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power4.out",
      stagger: 0.05,
      scrollTrigger: {
        trigger: ".reveal-split",
        start: "top 80%",
      },
    });

    // Reveal text
    gsap.utils.toArray(".reveal-text").forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });

    // Reveal images
    gsap.utils.toArray(".reveal-img").forEach((el) => {
      gsap.from(el, {
        y: 60,
        opacity: 0,
        skewY: 4,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });
  }, "#swup");

  console.log("✅ Animations initialized");
}

// ==============================
// Init Swiper
// ==============================
function initSwiper() {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  const swiperEl = document.querySelector(".swiper");
  if (swiperEl) {
    swiperInstance = new Swiper(".swiper", {
      loop: true,
      slidesPerView: 4,
      spaceBetween: 20,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    console.log("🌀 Swiper initialized");
  }
}

// ==============================
// Init Page
// ==============================
function initPage() {
  console.log("🚦 initPage() START:", window.location.pathname);

  initAnimations();
  initSwiper();

  setTimeout(() => {
    ScrollTrigger.refresh();
    console.log("🔄 ScrollTrigger refreshed");
  }, 150);

  console.log("✅ Page fully initialized:", window.location.pathname);
}

// ==============================
// First load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("📥 DOMContentLoaded fired");
  initPage();
});

// ==============================
// SWUP navigation
// ==============================
document.addEventListener("swup:pageView", () => {
  console.log("🔥 swup:pageView fired!");
  initPage();
});

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

  cleanupAnimations();

  ctx = gsap.context(() => {
    // ==============================
    // Reveal Split
    // ==============================
    const splitEls = document.querySelectorAll("#swup .reveal-split");
    if (splitEls.length) {
      splitEls.forEach((el) => {
        new SplitType(el, { types: "words, chars", tagName: "span" });
      });

      gsap.from("#swup .reveal-split .word", {
        y: "100%",
        opacity: 0,
        duration: 0.6,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: "#swup .reveal-split",
          start: "top 80%",
        },
      });
      console.log("✨ reveal-split animation applied");
    } else {
      console.log("ℹ️ No .reveal-split found on this page");
    }

    // ==============================
    // Reveal Text
    // ==============================
    const textEls = document.querySelectorAll("#swup .reveal-text");
    if (textEls.length) {
      gsap.utils.toArray(textEls).forEach((el) => {
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
      console.log("✨ reveal-text animation applied");
    } else {
      console.log("ℹ️ No .reveal-text found on this page");
    }

    // ==============================
    // Reveal Images
    // ==============================
    const imgEls = document.querySelectorAll("#swup .reveal-img");
    if (imgEls.length) {
      gsap.utils.toArray(imgEls).forEach((el) => {
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
      console.log("✨ reveal-img animation applied");
    } else {
      console.log("ℹ️ No .reveal-img found on this page");
    }

    // Page fade-in test
    gsap.from("#swup", {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
    console.log("✨ page fade-in animation applied");
  }, "#swup"); // scope animations to only current page

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

  const swiperEl = document.querySelector("#swup .swiper");
  if (swiperEl) {
    swiperInstance = new Swiper(swiperEl, {
      loop: true,
      slidesPerView: 1,
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
  } else {
    console.log("ℹ️ No swiper found on this page");
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

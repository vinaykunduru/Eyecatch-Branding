/***********************
 * custom.js
 ***********************/
console.log("🚀 custom.js loaded");

let swup = null;
let ctx = null;
let swiperInstance = null;
let splitInstances = [];

/***********************
 * Cleanup
 ***********************/
function cleanupAnimations() {
  console.log("🧹 cleanupAnimations()");
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
  if (window.ScrollTrigger) ScrollTrigger.getAll().forEach((st) => st.kill());
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }
  splitInstances.forEach((inst) => {
    try {
      inst.revert();
    } catch (e) {}
  });
  splitInstances = [];
}

/***********************
 * Animations
 ***********************/
function initAnimations() {
  console.log("🎬 initAnimations() running on:", window.location.pathname);
  cleanupAnimations();

  ctx = gsap.context(() => {
    // Split headings
    document.querySelectorAll("#swup .reveal-split").forEach((el) => {
      const inst = new SplitType(el, {
        types: "words, chars",
        tagName: "span",
      });
      splitInstances.push(inst);
      gsap.from(el.querySelectorAll(".word"), {
        y: "100%",
        opacity: 0,
        duration: 0.6,
        ease: "power4.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });
    console.log("✨ reveal-split applied");

    // Text
    gsap.utils.toArray("#swup .reveal-text").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });
    console.log("✨ reveal-text applied");

    // Images
    gsap.utils.toArray("#swup .reveal-img").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        scale: 1.08,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });
    console.log("✨ reveal-img applied");
  }, "#swup");

  if (window.ScrollTrigger) {
    setTimeout(() => ScrollTrigger.refresh(), 100);
    console.log("🔄 ScrollTrigger refreshed");
  }
}

/***********************
 * Swiper
 ***********************/
function initSwiper() {
  const el = document.querySelector("#swup .swiper");
  if (!el) {
    console.log("ℹ️ No swiper found on this page");
    return;
  }

  swiperInstance = new Swiper(el, {
    loop: true,
    slidesPerView: 4,
    spaceBetween: 20,
    pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
    navigation: {
      nextEl: el.querySelector(".swiper-button-next"),
      prevEl: el.querySelector(".swiper-button-prev"),
    },
  });
  console.log("🌀 Swiper initialized");
}

/***********************
 * Init page
 ***********************/
function initPage() {
  console.log("🚦 initPage() START:", window.location.pathname);
  initAnimations();
  initSwiper();
  console.log("✅ Page fully initialized:", window.location.pathname);
}

/***********************
 * Boot
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("📥 DOMContentLoaded fired");

  swup = new Swup({ containers: ["#swup"] });

  // Use Swup hooks API
  swup.hooks.on("page:view", () => {
    console.log("🔥 swup.hooks page:view fired");
    initPage();
  });

  initPage(); // first load
});

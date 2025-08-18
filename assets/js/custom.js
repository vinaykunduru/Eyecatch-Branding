/***********************
 * custom.js (full)
 ***********************/
console.log("🚀 custom.js loaded");

// Globals
let swup = null;
let ctx = null; // gsap.context for scoping + cleanup
let swiperInstance = null; // Swiper instance
let splitInstances = []; // track SplitType instances to revert on cleanup

/***********************
 * Utilities
 ***********************/
function imagesLoaded(callback) {
  const imgs = document.querySelectorAll("#swup img");
  if (!imgs.length) {
    console.log("📷 no images inside #swup, init immediately");
    callback();
    return;
  }

  let loaded = 0;
  const total = imgs.length;
  const done = () => {
    console.log("🖼️ images loaded:", loaded, "/", total);
    callback();
  };

  imgs.forEach((img) => {
    if (img.complete) {
      loaded++;
      if (loaded === total) done();
    } else {
      const onLoad = () => {
        loaded++;
        if (loaded === total) done();
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };
      const onError = () => {
        loaded++;
        console.warn("⚠️ image failed:", img.src);
        if (loaded === total) done();
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };
      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
    }
  });

  // Safety fallback so we never get stuck
  setTimeout(() => {
    if (loaded < total) {
      console.warn("⏱️ imagesLoaded timeout fallback — proceeding anyway");
      callback();
    }
  }, 1000);
}

function cleanupAnimations() {
  console.log("🧹 cleanupAnimations()");
  // Revert gsap context (kills tweens/triggers created inside it)
  if (ctx) {
    ctx.revert();
    ctx = null;
  }
  // Kill any stray ScrollTriggers
  if (window.ScrollTrigger) {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
  // Clear the global timeline
  if (window.gsap) {
    gsap.globalTimeline.clear();
  }
  // Revert SplitType instances
  if (splitInstances.length) {
    splitInstances.forEach((inst) => {
      try {
        inst.revert();
      } catch (e) {}
    });
    splitInstances = [];
  }
}

/***********************
 * Animations
 ***********************/
function initAnimations() {
  console.log("🎬 initAnimations() running on:", window.location.pathname);

  cleanupAnimations();

  // Scope every GSAP selector to #swup so we always target the fresh DOM
  ctx = gsap.context(() => {
    // SPLIT HEADINGS (word-by-word, on scroll)
    const splitEls = document.querySelectorAll("#swup .reveal-split");
    if (splitEls.length) {
      splitEls.forEach((el) => {
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
      console.log("✨ reveal-split animation applied");
    } else {
      console.log("ℹ️ no .reveal-split on this page");
    }

    // BODY TEXT (fade/slide on scroll)
    const textEls = document.querySelectorAll("#swup .reveal-text");
    if (textEls.length) {
      textEls.forEach((el) => {
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
      console.log("✨ reveal-text animation applied");
    } else {
      console.log("ℹ️ no .reveal-text on this page");
    }

    // IMAGES (fade/scale on scroll)
    const imgEls = document.querySelectorAll("#swup .reveal-img");
    if (imgEls.length) {
      imgEls.forEach((el) => {
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
      console.log("✨ reveal-img animation applied");
    } else {
      console.log("ℹ️ no .reveal-img on this page");
    }

    // OPTIONAL: subtle page fade for every navigation (visual confirmation)
    gsap.from("#swup > *", {
      opacity: 0,
      y: 10,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.03,
    });
    console.log("✨ page fade-in applied");
  }, "#swup");

  console.log("✅ Animations initialized");
}

/***********************
 * Swiper
 ***********************/
function initSwiper() {
  const el = document.querySelector("#swup .swiper");
  if (!el) {
    console.log("ℹ️ no .swiper on this page");
    // Destroy previous instance if you navigated away from a swiper page
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
    return;
  }

  if (swiperInstance) {
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  swiperInstance = new Swiper(el, {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    // remove autoplay if you don't want auto play:
    // autoplay: { delay: 4000 },
    pagination: { el: el.querySelector(".swiper-pagination"), clickable: true },
    navigation: {
      nextEl: el.querySelector(".swiper-button-next"),
      prevEl: el.querySelector(".swiper-button-prev"),
    },
  });
  console.log("🌀 Swiper initialized");
}

/***********************
 * Page bootstrap
 ***********************/
function initPage() {
  console.log("🚦 initPage() START:", window.location.pathname);

  initAnimations();
  initSwiper();

  // Let layout settle, then refresh triggers
  setTimeout(() => {
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
      console.log("🔄 ScrollTrigger refreshed");
    }
  }, 120);

  console.log("✅ Page fully initialized:", window.location.pathname);
}

/***********************
 * Swup wiring
 ***********************/
function attachSwupHandlers() {
  // Called after Swup swaps content in
  document.addEventListener("swup:pageView", () => {
    console.log("🔥 swup:pageView fired — waiting for images…");
    imagesLoaded(() => {
      // tiny delay to ensure paint
      setTimeout(initPage, 40);
    });
  });
}

/***********************
 * First load
 ***********************/
document.addEventListener("DOMContentLoaded", () => {
  console.log("📥 DOMContentLoaded fired");

  // Create Swup once on first load (ensure your HTML has: <div id="swup"> ... </div>)
  swup = new Swup({
    containers: ["#swup"],
    // optional: use if you have transition classes
    // animationSelector: '[class*="transition-"]'
  });

  attachSwupHandlers();

  // First time load: wait for images in current page as well
  imagesLoaded(() => {
    setTimeout(initPage, 40);
  });
});

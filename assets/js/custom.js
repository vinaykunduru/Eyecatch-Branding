const swup = new Swup();
gsap.registerPlugin(ScrollTrigger);

console.log("🚀 custom.js loaded");

// -----------------------------
// INIT ANIMATIONS
// -----------------------------
function initAnimations() {
  console.log("🎬 initAnimations() called");

  // Clean up old triggers
  const triggers = ScrollTrigger.getAll();
  console.log("🗑 Killing old ScrollTriggers:", triggers.length);
  triggers.forEach((st) => st.kill());

  // ---- Headings (clipPath reveal) ----
  gsap.utils.toArray(".reveal-heading").forEach((heading, i) => {
    console.log("✨ Animating .reveal-heading", i, heading.textContent.trim());
    gsap.fromTo(
      heading,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          toggleActions: "restart none none none",
          onEnter: () => console.log("▶️ Enter reveal-heading", i),
        },
      }
    );
  });

  // ---- Paragraph Text ----
  gsap.utils.toArray(".reveal-text").forEach((text, i) => {
    console.log("✨ Animating .reveal-text", i, text.textContent.trim());
    gsap.from(text, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: text,
        start: "top 95%",
        toggleActions: "restart none none none",
        onEnter: () => console.log("▶️ Enter reveal-text", i),
      },
    });
  });

  // ---- Images (skew + fade) ----
  gsap.utils.toArray(".reveal-img").forEach((img, i) => {
    console.log("✨ Animating .reveal-img", i, img.tagName);
    gsap.from(img, {
      y: 80,
      skewY: 5,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: img,
        start: "top 95%",
        toggleActions: "restart none none none",
        onEnter: () => console.log("▶️ Enter reveal-img", i),
      },
    });
  });

  // ---- Split Headings (word-by-word) ----
  document.querySelectorAll(".reveal-split").forEach((el, i) => {
    if (el._split) {
      console.log("🔄 Reverting old SplitType on .reveal-split", i);
      el._split.revert();
      el._split = null;
    }

    console.log(
      "✂️ Splitting text for .reveal-split",
      i,
      el.textContent.trim()
    );
    el._split = new SplitType(el, { types: "words", tagName: "span" });

    gsap.from(el._split.words, {
      y: "100%",
      opacity: 0,
      duration: 0.25,
      ease: "power4.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "restart none none none",
        onEnter: () => console.log("▶️ Enter reveal-split", i),
      },
    });
  });

  // Force recalculation
  ScrollTrigger.refresh();
  console.log("🔄 ScrollTrigger refreshed");
}

// -----------------------------
// INIT SWIPER
// -----------------------------
function initSwiper() {
  console.log("🌀 initSwiper() called");
  if (window.mySwiper) {
    console.log("🗑 Destroying old swiper");
    window.mySwiper.destroy(true, true);
  }
  const swiperEl = document.querySelector(".swiper");
  if (swiperEl) {
    console.log("✅ Initializing Swiper on .swiper element");
    window.mySwiper = new Swiper(".swiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  } else {
    console.log("⚠️ No .swiper element found on this page");
  }
}

// -----------------------------
// INIT FOOTER + MENUS
// -----------------------------
function initFooterAndMenus() {
  console.log("📂 initFooterAndMenus() called");
  document.querySelectorAll(".footer-link").forEach((link, i) => {
    console.log("📌 Binding footer-link", i, link.textContent.trim());
    link.onclick = function () {
      console.log("👉 Clicked footer link", i);
      const targetId = this.getAttribute("data-target");
      const subContent = document.getElementById(targetId);
      const toggleSymbol = this.querySelector(".toggle");

      document.querySelectorAll(".sub-content").forEach((content) => {
        if (content.id !== targetId) content.classList.remove("show");
      });
      document.querySelectorAll(".toggle").forEach((toggle) => {
        if (toggle !== toggleSymbol) {
          toggle.textContent = "+";
          toggle.style.transform = "rotate(0deg)";
        }
      });

      if (subContent.classList.contains("show")) {
        subContent.classList.remove("show");
        toggleSymbol.textContent = "+";
        toggleSymbol.style.transform = "rotate(0deg)";
      } else {
        subContent.classList.add("show");
        toggleSymbol.textContent = "-";
        toggleSymbol.style.transform = "rotate(180deg)";
      }
    };
  });
}

// -----------------------------
// MASTER INIT FUNCTION
// -----------------------------
function initPage() {
  console.log("🚦 initPage() START for:", window.location.pathname);
  initAnimations();
  initSwiper();
  initFooterAndMenus();
  console.log("✅ Page Initialized:", window.location.pathname);
}

// Run on first load
document.addEventListener("DOMContentLoaded", () => {
  console.log("📥 DOMContentLoaded fired");
  initPage();
});

// Run again after Swup navigation
document.addEventListener("swup:contentReplaced", () => {
  console.log("🔁 swup:contentReplaced fired");
  initPage();
});

// Cleanup before page replace
document.addEventListener("swup:willReplaceContent", () => {
  console.log("🧹 swup:willReplaceContent - cleaning triggers");
  ScrollTrigger.getAll().forEach((st) => st.kill());
});

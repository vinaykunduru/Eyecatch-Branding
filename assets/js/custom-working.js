console.log("🚀 custom.js loaded");

let ctx; // GSAP context for cleanup

function cleanupAnimations() {
  console.log("🧹 cleanupAnimations()");
  if (ctx) {
    ctx.revert(); // kill all GSAP in the context
    ctx = null;
  }
  ScrollTrigger.getAll().forEach((st) => st.kill());
  gsap.globalTimeline.clear();
}

function initAnimations() {
  console.log("🎬 initAnimations() running on:", window.location.pathname);

  cleanupAnimations();

  // Scope GSAP to #swup so only active content animates
  ctx = gsap.context(() => {
    // Reveal Split
    const splitEls = document.querySelectorAll(".reveal-split");
    if (splitEls.length) {
      splitEls.forEach((el) => {
        new SplitType(el, { types: "words, chars", tagName: "span" });
      });

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
      console.log("✨ reveal-split animation applied");
    }

    // Reveal Text
    const textEls = document.querySelectorAll(".reveal-text");
    if (textEls.length) {
      gsap.from(textEls, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textEls,
          start: "top 85%",
        },
      });
      console.log("✨ reveal-text animation applied");
    }

    // Reveal Image
    const imgEls = document.querySelectorAll(".reveal-img");
    if (imgEls.length) {
      gsap.from(imgEls, {
        opacity: 0,
        scale: 1.1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imgEls,
          start: "top 90%",
        },
      });
      console.log("✨ reveal-img animation applied");
    }
  }, "#swup");

  console.log("✅ Animations initialized");
}

function initSwiper() {
  const swiperEl = document.querySelector(".swiper");
  if (swiperEl) {
    if (window.mySwiper) {
      window.mySwiper.destroy(true, true);
    }
    window.mySwiper = new Swiper(".swiper", {
      loop: true,
      slidesPerView: 1,
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
      },
      autoplay: { delay: 4000 },
      pagination: { el: ".swiper-pagination", clickable: true },
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

function initPage() {
  console.log("🚦 initPage() START:", window.location.pathname);
  initAnimations();
  initSwiper();
  setTimeout(() => {
    ScrollTrigger.refresh();
    console.log("🔄 ScrollTrigger refreshed");
  }, 100);
  console.log("✅ Page fully initialized:", window.location.pathname);
}

// --- Swup Integration ---
document.addEventListener("DOMContentLoaded", () => {
  console.log("📥 DOMContentLoaded fired");

  // Init on first load
  initPage();

  // Init on Swup page view
  document.addEventListener("swup:pageView", () => {
    console.log("📥 swup:pageView fired");
    setTimeout(() => {
      initPage();
    }, 50); // ensure DOM is painted
  });
});

// Toggle Main Sections
document.querySelectorAll(".footer-link").forEach((link) => {
  link.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const subContent = document.getElementById(targetId);
    const toggleSymbol = this.querySelector(".toggle");

    // Close all open sections
    document.querySelectorAll(".sub-content").forEach((content) => {
      if (content.id !== targetId) {
        content.classList.remove("show");
      }
    });
    document.querySelectorAll(".toggle").forEach((toggle) => {
      if (toggle !== toggleSymbol) {
        toggle.textContent = "+";
        toggle.style.transform = "rotate(0deg)";
      }
      setTimeout(() => {
        window.scrollInstance && window.scrollInstance.update();
      }, 400); // delay to wait for animation
    });

    // Toggle current section
    if (subContent.classList.contains("show")) {
      subContent.classList.remove("show");
      toggleSymbol.textContent = "+";
      toggleSymbol.style.transform = "rotate(0deg)";
    } else {
      subContent.classList.add("show");
      toggleSymbol.textContent = "-";
      toggleSymbol.style.transform = "rotate(180deg)";
    }
  });
});

function toggleSubmenu(el) {
  const parentLi = el.closest("li.has-submenu");
  const icon = el.querySelector(".submenu-icon");

  parentLi.classList.toggle("open");
  if (parentLi.classList.contains("open")) {
    icon.textContent = "−";
  } else {
    icon.textContent = "+";
  }
}

// Toggle Vijayawada Address
function toggleAddressHyd() {
  document.getElementById("hyderabadAddress").style.display = "block";
  document.getElementById("vijayawadaAddress").style.display = "none";
  document.getElementById("tamilnaduAddress").style.display = "none";
}

// Toggle Tamilnadu Address
function toggleAddressTamil() {
  document.getElementById("hyderabadAddress").style.display = "none";
  document.getElementById("vijayawadaAddress").style.display = "none";
  document.getElementById("tamilnaduAddress").style.display = "block";
}

function toggleAddressVijayawada() {
  document.getElementById("hyderabadAddress").style.display = "none";
  document.getElementById("vijayawadaAddress").style.display = "block";
  document.getElementById("tamilnaduAddress").style.display = "none";
}

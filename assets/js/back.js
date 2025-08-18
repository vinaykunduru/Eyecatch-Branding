const swup = new Swup();
gsap.registerPlugin(ScrollTrigger);

// -----------------------------
// INIT ANIMATIONS
// -----------------------------
function initAnimations() {
  ScrollTrigger.getAll().forEach((st) => st.kill());

  gsap.utils.toArray(".reveal-heading").forEach((heading) => {
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
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  gsap.utils.toArray(".reveal-text").forEach((text) => {
    gsap.from(text, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: text,
        start: "top 95%",
        toggleActions: "play none none reverse",
      },
    });
  });

  gsap.utils.toArray(".reveal-img").forEach((img) => {
    gsap.from(img, {
      y: 80,
      skewY: 5,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: img,
        start: "top 95%",
        once: true,
      },
    });
  });

  document.querySelectorAll(".reveal-split").forEach((el) => {
    if (el._split) el._split.revert();
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
        toggleActions: "play none none reverse",
      },
    });
  });

  ScrollTrigger.refresh();
}

// -----------------------------
// INIT SWIPER
// -----------------------------
function initSwiper() {
  if (window.mySwiper) {
    window.mySwiper.destroy(true, true);
  }
  const swiperEl = document.querySelector(".swiper");
  if (swiperEl) {
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
  }
}

// -----------------------------
// INIT FOOTER & MENUS
// -----------------------------
function initFooterAndMenus() {
  document.querySelectorAll(".footer-link").forEach((link) => {
    link.onclick = function () {
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
  initAnimations();
  initSwiper();
  initFooterAndMenus();
}

// Run on first load
document.addEventListener("DOMContentLoaded", initPage);

// Run again on Swup navigation
document.addEventListener("swup:contentReplaced", initPage);

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

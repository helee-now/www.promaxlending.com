(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const nav = document.querySelector(".nav");
  const navLinks = document.getElementById("primary-nav");
  if (!nav || !navLinks) {
    return;
  }

  const navToggle = nav.querySelector(".nav-toggle");
  const loanPurposeItem = nav.querySelector(".nav-item");
  const loanPurposeLink = loanPurposeItem ? loanPurposeItem.querySelector("a") : null;
  const mobileWidth = 980;

  const closeMobileNav = () => {
    navLinks.classList.remove("is-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
    if (loanPurposeItem) {
      loanPurposeItem.classList.remove("open");
    }
  };

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen && loanPurposeItem) {
        loanPurposeItem.classList.remove("open");
      }
    });
  }

  if (loanPurposeItem && loanPurposeLink) {
    loanPurposeLink.addEventListener("click", (event) => {
      if (window.innerWidth > mobileWidth) {
        return;
      }

      const isOpen = loanPurposeItem.classList.contains("open");
      if (!isOpen) {
        event.preventDefault();
        loanPurposeItem.classList.add("open");
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > mobileWidth) {
      navLinks.classList.remove("is-open");
      if (loanPurposeItem) {
        loanPurposeItem.classList.remove("open");
      }
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      closeMobileNav();
    }
  });
})();

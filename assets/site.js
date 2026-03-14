(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const statusEl = contactForm.querySelector("[data-form-status]");
    const getMessage = (key, fallback) => contactForm.dataset[key] || fallback;

    const setStatus = (message, type) => {
      if (!statusEl) {
        return;
      }
      statusEl.textContent = message;
      statusEl.classList.remove("is-success", "is-error");
      if (type) {
        statusEl.classList.add(type);
      }
    };

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setStatus("", null);

      if (!contactForm.reportValidity()) {
        return;
      }

      const endpoint =
        contactForm.getAttribute("data-api-endpoint") ||
        contactForm.getAttribute("action") ||
        "/api/contact";

      const formData = new FormData(contactForm);
      const explicitPageLanguage = contactForm.getAttribute("data-page-language");
      const htmlLanguage = document.documentElement.lang || "";
      const pathLanguage = window.location.pathname.includes("/zh/") ? "zh-CN" : "en";
      const pageLanguage = (explicitPageLanguage || htmlLanguage || pathLanguage || "en").trim() || "en";
      const query = new URLSearchParams(window.location.search);
      const sourcePage = `${window.location.origin}${window.location.pathname}`;
      const payload = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        website: formData.get("website"),
        contact_consent: formData.get("contact_consent") === "on",
        page_language: pageLanguage,
        source_page: sourcePage,
        referrer: document.referrer || "",
        utm_source: (formData.get("utm_source") || query.get("utm_source") || "").trim(),
        utm_medium: (formData.get("utm_medium") || query.get("utm_medium") || "").trim(),
        utm_campaign: (formData.get("utm_campaign") || query.get("utm_campaign") || "").trim(),
        utm_content: (formData.get("utm_content") || query.get("utm_content") || "").trim(),
        utm_term: (formData.get("utm_term") || query.get("utm_term") || "").trim(),
      };

      if (submitButton) {
        submitButton.disabled = true;
      }
      setStatus(getMessage("msgSubmitting", "Submitting your request..."), null);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        let data = {};
        try {
          data = await response.json();
        } catch (_error) {
          data = {};
        }

        if (!response.ok || !data.ok) {
          throw new Error(data.message || getMessage("msgFailure", "Unable to send your request right now."));
        }

        contactForm.reset();
        setStatus(
          getMessage("msgSuccess", "Thank you. Your request has been sent successfully."),
          "is-success"
        );
      } catch (_error) {
        setStatus(
          getMessage(
            "msgFailure",
            "We could not send your request right now. Please call (949) 288-3016 or email info@promaxlending.com."
          ),
          "is-error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  }

  const nav = document.querySelector(".nav");
  const navLinks = document.getElementById("primary-nav");
  if (nav && navLinks) {
    const navToggle = nav.querySelector(".nav-toggle");

    const closeMobileNav = () => {
      navLinks.classList.remove("is-open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
      }
    };

    if (navToggle) {
      navToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) {
        navLinks.classList.remove("is-open");
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
  }
})();

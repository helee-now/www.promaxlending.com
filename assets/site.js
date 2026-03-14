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

  const calculatorRoot = document.querySelector("[data-loan-calculator]");
  if (calculatorRoot) {
    const lang = calculatorRoot.getAttribute("data-lang") === "zh" ? "zh" : "en";
    const monthFormatter = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      year: "numeric",
    });
    const currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

    const labels = {
      amortizationShow: lang === "zh" ? "显示还款明细表" : "Show Amortization Table",
      amortizationHide: lang === "zh" ? "隐藏还款明细表" : "Hide Amortization Table",
      monthlyLabel: lang === "zh" ? "月供结清日期" : "Monthly payoff date",
      biweeklyLabel: lang === "zh" ? "双周供结清日期" : "Bi-weekly payoff date",
    };

    const elements = {
      homeValue: calculatorRoot.querySelector("#lc-home-value"),
      downAmount: calculatorRoot.querySelector("#lc-down-payment-amount"),
      downPercent: calculatorRoot.querySelector("#lc-down-payment-percent"),
      downSlider: calculatorRoot.querySelector("#lc-down-payment-slider"),
      loanAmount: calculatorRoot.querySelector("#lc-loan-amount"),
      interestRate: calculatorRoot.querySelector("#lc-interest-rate"),
      interestSlider: calculatorRoot.querySelector("#lc-interest-slider"),
      loanTerm: calculatorRoot.querySelector("#lc-loan-term"),
      startMonth: calculatorRoot.querySelector("#lc-start-month"),
      startYear: calculatorRoot.querySelector("#lc-start-year"),
      propertyTax: calculatorRoot.querySelector("#lc-property-tax"),
      pmiRate: calculatorRoot.querySelector("#lc-pmi-rate"),
      pmiSlider: calculatorRoot.querySelector("#lc-pmi-slider"),
      homeInsurance: calculatorRoot.querySelector("#lc-home-insurance"),
      monthlyHoa: calculatorRoot.querySelector("#lc-monthly-hoa"),
      monthlyPayment: calculatorRoot.querySelector("#lc-monthly-payment"),
      monthlyTax: calculatorRoot.querySelector("#lc-monthly-tax"),
      monthlyInsurance: calculatorRoot.querySelector("#lc-monthly-insurance"),
      breakdownChart: calculatorRoot.querySelector("#lc-breakdown-chart"),
      breakdownList: calculatorRoot.querySelector("#lc-breakdown-list"),
      detailLoan: calculatorRoot.querySelector("#lc-detail-loan"),
      detailDown: calculatorRoot.querySelector("#lc-detail-down"),
      detailInterest: calculatorRoot.querySelector("#lc-detail-interest"),
      detailTotal: calculatorRoot.querySelector("#lc-detail-total"),
      detailTax: calculatorRoot.querySelector("#lc-detail-tax"),
      detailInsurance: calculatorRoot.querySelector("#lc-detail-insurance"),
      detailPayoff: calculatorRoot.querySelector("#lc-detail-payoff"),
      compareMonthly: calculatorRoot.querySelector("#lc-compare-monthly"),
      compareBiweekly: calculatorRoot.querySelector("#lc-compare-biweekly"),
      compareMonthlyDate: calculatorRoot.querySelector("#lc-compare-monthly-date"),
      compareBiweeklyDate: calculatorRoot.querySelector("#lc-compare-biweekly-date"),
      compareSavings: calculatorRoot.querySelector("#lc-compare-savings"),
      toggleButton: calculatorRoot.querySelector("#lc-toggle-amortization"),
      amortizationContainer: calculatorRoot.querySelector("#lc-amortization-container"),
      amortizationBody: calculatorRoot.querySelector("#lc-amortization-body"),
    };

    const asNumber = (value, fallback = 0) => {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
      return fallback;
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const formatMoney = (value) => currencyFormatter.format(Number.isFinite(value) ? value : 0);

    const addMonths = (date, months) => {
      const next = new Date(date.getTime());
      next.setMonth(next.getMonth() + months);
      return next;
    };

    const syncDownFromPercent = () => {
      const homeValue = clamp(asNumber(elements.homeValue.value, 990000), 50000, 50000000);
      const percent = clamp(asNumber(elements.downPercent.value, 20), 0, 95);
      const downAmount = homeValue * (percent / 100);
      elements.downPercent.value = percent.toFixed(2);
      elements.downSlider.value = percent.toFixed(2);
      elements.downAmount.value = downAmount.toFixed(2);
    };

    const syncDownFromAmount = () => {
      const homeValue = clamp(asNumber(elements.homeValue.value, 990000), 50000, 50000000);
      const rawDownAmount = clamp(asNumber(elements.downAmount.value, 0), 0, homeValue * 0.95);
      const percent = homeValue > 0 ? (rawDownAmount / homeValue) * 100 : 0;
      elements.downAmount.value = rawDownAmount.toFixed(2);
      elements.downPercent.value = percent.toFixed(2);
      elements.downSlider.value = percent.toFixed(2);
    };

    const syncInterest = (source) => {
      const rate = clamp(asNumber(source.value, 5.7), 0.1, 15);
      elements.interestRate.value = rate.toFixed(2);
      elements.interestSlider.value = rate.toFixed(2);
    };

    const syncPmi = (source) => {
      const rate = clamp(asNumber(source.value, 1), 0, 5);
      elements.pmiRate.value = rate.toFixed(2);
      elements.pmiSlider.value = rate.toFixed(2);
    };

    const calculateSchedule = (principal, annualRate, totalMonths, startDate, extraPrincipalPerMonth = 0) => {
      const monthlyRate = annualRate / 12;
      const basePiPayment =
        monthlyRate === 0
          ? principal / totalMonths
          : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

      let balance = principal;
      let totalInterest = 0;
      const rows = [];
      let monthsUsed = 0;

      while (balance > 0.01 && monthsUsed < 1200) {
        const interestPayment = balance * monthlyRate;
        let principalPayment = basePiPayment - interestPayment + extraPrincipalPerMonth;
        if (principalPayment > balance) {
          principalPayment = balance;
        }
        const totalPiPayment = principalPayment + interestPayment;
        balance -= principalPayment;
        totalInterest += interestPayment;
        monthsUsed += 1;
        rows.push({
          number: monthsUsed,
          date: addMonths(startDate, monthsUsed - 1),
          payment: totalPiPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(balance, 0),
        });
      }

      return {
        basePiPayment,
        totalInterest,
        monthsUsed,
        rows,
      };
    };

    const updateBreakdown = (parts) => {
      const colorSet = ["#0f5a45", "#1a7a61", "#5ca68f", "#8ec6b4", "#c9e4dc"];
      const total = parts.reduce((sum, part) => sum + part.value, 0);
      const gradientStops = [];
      let cursor = 0;
      parts.forEach((part, index) => {
        const pct = total > 0 ? (part.value / total) * 100 : 0;
        const start = cursor;
        const end = cursor + pct;
        gradientStops.push(`${colorSet[index]} ${start.toFixed(2)}% ${end.toFixed(2)}%`);
        cursor = end;
      });
      elements.breakdownChart.style.background = `conic-gradient(${gradientStops.join(", ")})`;

      elements.breakdownList.innerHTML = "";
      parts.forEach((part, index) => {
        const li = document.createElement("li");
        const pct = total > 0 ? ((part.value / total) * 100).toFixed(1) : "0.0";
        li.innerHTML = `<span class="dot" style="background:${colorSet[index]}"></span><span>${part.label}</span><strong>${pct}%</strong>`;
        elements.breakdownList.appendChild(li);
      });
    };

    const renderAmortization = (rows, monthlyExtras) => {
      const fragment = document.createDocumentFragment();
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.number}</td>
          <td>${monthFormatter.format(row.date)}</td>
          <td>${formatMoney(row.payment + monthlyExtras)}</td>
          <td>${formatMoney(row.principal)}</td>
          <td>${formatMoney(row.interest)}</td>
          <td>${formatMoney(row.balance)}</td>
        `;
        fragment.appendChild(tr);
      });
      elements.amortizationBody.innerHTML = "";
      elements.amortizationBody.appendChild(fragment);
    };

    const recalculate = () => {
      const homeValue = clamp(asNumber(elements.homeValue.value, 990000), 50000, 50000000);
      const downAmount = clamp(asNumber(elements.downAmount.value, 80000), 0, homeValue * 0.95);
      const loanAmount = Math.max(homeValue - downAmount, 0);
      const annualRate = clamp(asNumber(elements.interestRate.value, 5.7), 0.1, 15) / 100;
      const years = clamp(asNumber(elements.loanTerm.value, 30), 1, 40);
      const totalMonths = Math.round(years * 12);
      const startMonth = clamp(asNumber(elements.startMonth.value, 2), 0, 11);
      const startYear = clamp(asNumber(elements.startYear.value, 2026), 2024, 2100);
      const annualTax = Math.max(asNumber(elements.propertyTax.value, 14850), 0);
      const annualInsurance = Math.max(asNumber(elements.homeInsurance.value, 2000), 0);
      const monthlyHoa = Math.max(asNumber(elements.monthlyHoa.value, 200), 0);
      const pmiRate = clamp(asNumber(elements.pmiRate.value, 1), 0, 5) / 100;

      const monthlyTax = annualTax / 12;
      const monthlyInsurance = annualInsurance / 12;
      const monthlyPmi = (loanAmount * pmiRate) / 12;

      const startDate = new Date(startYear, startMonth, 1);
      const monthlySchedule = calculateSchedule(loanAmount, annualRate, totalMonths, startDate, 0);
      const extraMonthlyPrincipal = monthlySchedule.basePiPayment / 12;
      const biweeklySchedule = calculateSchedule(
        loanAmount,
        annualRate,
        totalMonths,
        startDate,
        extraMonthlyPrincipal
      );

      const monthlyPi = monthlySchedule.basePiPayment;
      const monthlyTotal = monthlyPi + monthlyTax + monthlyInsurance + monthlyHoa + monthlyPmi;
      const biweeklyTotal = (monthlyTotal * 12) / 26;
      const monthlyPayoffDate = addMonths(startDate, monthlySchedule.monthsUsed - 1);
      const biweeklyPayoffDate = addMonths(startDate, biweeklySchedule.monthsUsed - 1);
      const totalTaxPaid = monthlyTax * monthlySchedule.monthsUsed;
      const totalInsurancePaid = monthlyInsurance * monthlySchedule.monthsUsed;
      const totalHoaPaid = monthlyHoa * monthlySchedule.monthsUsed;
      const totalPmiPaid = monthlyPmi * monthlySchedule.monthsUsed;
      const totalPaymentToMaturity =
        loanAmount +
        monthlySchedule.totalInterest +
        totalTaxPaid +
        totalInsurancePaid +
        totalHoaPaid +
        totalPmiPaid;

      elements.loanAmount.value = loanAmount.toFixed(2);
      elements.monthlyPayment.textContent = formatMoney(monthlyTotal);
      elements.monthlyTax.textContent = formatMoney(monthlyTax);
      elements.monthlyInsurance.textContent = formatMoney(monthlyInsurance + monthlyPmi + monthlyHoa);
      elements.detailLoan.textContent = formatMoney(loanAmount);
      elements.detailDown.textContent = `${formatMoney(downAmount)} (${((downAmount / homeValue) * 100).toFixed(2)}%)`;
      elements.detailInterest.textContent = formatMoney(monthlySchedule.totalInterest);
      elements.detailTotal.textContent = formatMoney(totalPaymentToMaturity);
      elements.detailTax.textContent = formatMoney(totalTaxPaid);
      elements.detailInsurance.textContent = formatMoney(totalInsurancePaid + totalHoaPaid + totalPmiPaid);
      elements.detailPayoff.textContent = monthFormatter.format(monthlyPayoffDate);

      elements.compareMonthly.textContent = formatMoney(monthlyTotal);
      elements.compareBiweekly.textContent = formatMoney(biweeklyTotal);
      elements.compareMonthlyDate.textContent = `${labels.monthlyLabel}: ${monthFormatter.format(monthlyPayoffDate)}`;
      elements.compareBiweeklyDate.textContent = `${labels.biweeklyLabel}: ${monthFormatter.format(biweeklyPayoffDate)}`;
      elements.compareSavings.textContent = formatMoney(
        Math.max(monthlySchedule.totalInterest - biweeklySchedule.totalInterest, 0)
      );

      updateBreakdown([
        { label: lang === "zh" ? "本金" : "Principal", value: loanAmount },
        { label: lang === "zh" ? "利息" : "Interest", value: monthlySchedule.totalInterest },
        { label: lang === "zh" ? "房产税" : "Property Tax", value: totalTaxPaid },
        { label: lang === "zh" ? "保险/HOA/PMI" : "Insurance/HOA/PMI", value: totalInsurancePaid + totalHoaPaid + totalPmiPaid },
        { label: lang === "zh" ? "首付" : "Down Payment", value: downAmount },
      ]);

      renderAmortization(monthlySchedule.rows, monthlyTax + monthlyInsurance + monthlyHoa + monthlyPmi);
    };

    const bindRecalc = (element, syncFn) => {
      if (!element) {
        return;
      }
      element.addEventListener("input", () => {
        if (syncFn) {
          syncFn(element);
        }
        recalculate();
      });
      element.addEventListener("change", () => {
        if (syncFn) {
          syncFn(element);
        }
        recalculate();
      });
    };

    bindRecalc(elements.homeValue, () => syncDownFromAmount());
    bindRecalc(elements.downAmount, () => syncDownFromAmount());
    bindRecalc(elements.downPercent, () => syncDownFromPercent());
    bindRecalc(elements.downSlider, () => {
      elements.downPercent.value = elements.downSlider.value;
      syncDownFromPercent();
    });
    bindRecalc(elements.interestRate, syncInterest);
    bindRecalc(elements.interestSlider, syncInterest);
    bindRecalc(elements.loanTerm);
    bindRecalc(elements.startMonth);
    bindRecalc(elements.startYear);
    bindRecalc(elements.propertyTax);
    bindRecalc(elements.pmiRate, syncPmi);
    bindRecalc(elements.pmiSlider, syncPmi);
    bindRecalc(elements.homeInsurance);
    bindRecalc(elements.monthlyHoa);

    if (elements.toggleButton && elements.amortizationContainer) {
      elements.toggleButton.addEventListener("click", () => {
        const isHidden = elements.amortizationContainer.hidden;
        elements.amortizationContainer.hidden = !isHidden;
        elements.toggleButton.textContent = isHidden ? labels.amortizationHide : labels.amortizationShow;
      });
    }

    syncDownFromAmount();
    syncInterest(elements.interestRate);
    syncPmi(elements.pmiRate);
    recalculate();
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

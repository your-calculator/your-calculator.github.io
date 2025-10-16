let amortizationData = [];
const calculatorTitles = {
  "loan-emi": {
    title: "Loan EMI Calculator",
    desc: "Calculate your monthly EMI for various loan types",
  },
  fd: {
    title: "Fixed Deposit Calculator",
    desc: "Calculate returns on your fixed deposit investments",
  },
  rd: {
    title: "Recurring Deposit Calculator",
    desc: "Plan your recurring deposit investments",
  },
  inflation: {
    title: "Inflation Calculator",
    desc: "Understand the impact of inflation on your money",
  },
  "future-value": {
    title: "Future Value Calculator",
    desc: "Calculate the future value of your investments",
  },
  "present-value": {
    title: "Present Value Calculator",
    desc: "Find the present value of future cash flows",
  },
  "simple-interest": {
    title: "Simple Interest Calculator",
    desc: "Calculate simple interest on your investments",
  },
  "compound-interest": {
    title: "Compound Interest Calculator",
    desc: "Calculate compound interest with various frequencies",
  },
  sip: {
    title: "SIP Calculator",
    desc: "Plan your Systematic Investment Plan",
  },
  swp: {
    title: "SWP Calculator",
    desc: "Calculate Systematic Withdrawal Plan",
  },
  lumpsum: {
    title: "Lumpsum Calculator",
    desc: "Calculate returns on lumpsum investments",
  },
  cagr: {
    title: "CAGR Calculator",
    desc: "Calculate Compound Annual Growth Rate",
  },
  "emergency-fund": {
    title: "Emergency Fund Calculator",
    desc: "Plan your emergency fund savings",
  },
  "investment-calculator": {
    title: "Advanced Investment Calculator",
    desc: "Comprehensive investment planning with SIP, SWP, and goals",
  },
  "tax-calculator": {
    title: "Tax Calculator",
    desc: "Calculate Tax Liability, Copmare Regimes and Opt the right regime that suits your needs.",
  },
};

// Toggle mobile menu
function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("active");
  document.querySelector(".overlay").classList.toggle("active");
}

// Close mobile menu
function closeMenu() {
  document.getElementById("sidebar").classList.remove("active");
  document.querySelector(".overlay").classList.remove("active");
}

// Format currency
function formatCurrency(amount) {
  if (!isFinite(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function showResultSection(parentId, resultClass = null, show = true) {
  let container = document.querySelector(
    "#" + parentId + " .results-chart-container"
  );

  let chart = document.querySelector("#" + parentId + " .chart-wrapper");

  if (show) {
    container.classList.remove("one-column");

    container.classList.add("two-column");
    chart.classList.add("active");
  } else {
    container.classList.remove("two-column");
    container.classList.add("one-column");
    chart.classList.remove("active");
  }
}

function debounce(fn, delay = 400) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ---------- Tab switch ----------
function showCalculator(id, navItem) {
  // Hide all calculators
  document
    .querySelectorAll(".calculator")
    .forEach((c) => c.classList.remove("active"));

  document
    .querySelectorAll(".input-error")
    .forEach((el) => el.classList.remove("input-error"));

  // Remove active from nav
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));

  // Show selected
  const calc = document.getElementById(id);
  if (calc) calc.classList.add("active");
  if (navItem) navItem.classList.add("active");

  // Save active tab
  localStorage.setItem("activeCalculator", id);

  // Update page titles - THIS IS THE MISSING PART!
  const titleInfo = calculatorTitles[id];
  if (titleInfo) {
    const pageTitle = document.getElementById("page-title");
    const pageDesc = document.getElementById("page-description");
    const mobileTitle = document.getElementById("mobile-page-title");

    if (pageTitle) pageTitle.textContent = titleInfo.title;
    if (pageDesc) pageDesc.textContent = titleInfo.desc;
    if (mobileTitle) mobileTitle.textContent = titleInfo.title;
  }

  if (window.innerWidth <= 1024) closeMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Auto-calculate after switching tabs
  setTimeout(() => calculateActive(id), 100);

  history.replaceState(null, null, "#" + id);
}

function activateCalculatorFromHash() {
  const hash = window.location.hash.substring(1); // remove '#'
  if (hash && document.getElementById(hash)) {
    const navItem = document.querySelector(`[onclick*="${hash}"]`);
    showCalculator(hash, navItem);
  }
}

// Enforce min/max constraints on all number inputs
function enforceMinMax() {
  const numberInputs = document.querySelectorAll('input[type="number"]');

  numberInputs.forEach((input) => {
    input.addEventListener("input", function () {
      let value = this.value;
      const min = parseFloat(this.min);
      const max = parseFloat(this.max);

      // Remove all minus signs except the first character
      const hasNegative = value.startsWith("-");
      value = value.replace(/-/g, "");
      if (hasNegative) {
        value = "-" + value;
      }

      this.value = value; // Update immediately to clean up input

      const numValue = parseFloat(value);

      if (!isNaN(numValue)) {
        if (!isNaN(min) && numValue < min) {
          this.value = min;
        } else if (!isNaN(max) && numValue > max) {
          this.value = max;
        }
      }
    });
  });
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", enforceMinMax);

// Also run if you dynamically add inputs later
// Just call enforceMinMax() after adding new inputs

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", enforceMinMax);

// Also run if you dynamically add inputs later
// Just call enforceMinMax() after adding new inputs

// ---------- Init ----------
window.addEventListener("DOMContentLoaded", () => {
  // Load saved inputs
  loadInputs();

  // Calculate all calculators with saved values
  calculateAll();

  // Restore active tab
  // Activate calculator from URL hash first, fallback to saved tab
  activateCalculatorFromHash();

  const savedTab = localStorage.getItem("activeCalculator");
  if (!window.location.hash && savedTab && document.getElementById(savedTab)) {
    const navItem = document.querySelector(`[onclick*="${savedTab}"]`);
    showCalculator(savedTab, navItem);
  }

  // Debounced auto-calc on any input change
  const debouncedCalc = debounce(() => {
    saveInputs();
    calculateAll();
  }, 0);

  // Attach to all inputs
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", debouncedCalc);
  });

  initYearDropdown();
  initializeOldApp();
});

// Handle browser back/forward hash changes
window.addEventListener("hashchange", () => {
  activateCalculatorFromHash();
});

document
  .querySelectorAll('input[type="number"], input[type="text"]')
  .forEach((input) => {
    // --- Trim leading zeros live ---
    input.addEventListener("input", () => {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      let value = input.value;

      // Skip if empty or starts with valid 0. / -0.
      if (value !== "" && !/^(-?)0\./.test(value)) {
        const newValue = value.replace(/^(-?)0+(?=\d)/, "$1");
        if (newValue !== value) {
          input.value = newValue;
          const diff = value.length - newValue.length;
          input.setSelectionRange(start - diff, end - diff);
        }
      }
    });

    // --- Normalize on blur ---
    input.addEventListener("blur", () => {
      let value = input.value.trim();
      if (value === "") return;

      // Only normalize if it's a valid numeric string
      const num = Number(value);
      if (!isNaN(num)) {
        // Use parseFloat to remove trailing zeros but keep decimals
        value = parseFloat(num.toString()).toString();

        // If user entered something like "12." → keep the dot (optional)
        if (/\.$/.test(input.value)) {
          input.value = input.value; // leave as is
        } else {
          input.value = value;
        }
      }
    });
  });

document.addEventListener("DOMContentLoaded", enforceMinMax);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
      .catch((err) =>
        console.error("Service Worker registration failed:", err)
      );
  });
}

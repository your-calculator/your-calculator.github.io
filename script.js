let amortizationData = [];
const calculatorTitles = {
  home: {
    title: "Financial Calculator",
    desc: "Calculate your monthly EMI for various loan types",
  },
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
  xirr: {
    title: "XIRR Calculator",
    desc: "Calculate Internal Rate of Return for your investments",
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
  rebalance: {
    title: "Portfolio Rebalance",
    desc: "Automatically rebalance your portfolio based on target allocations",
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

  // Update page titles
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

  // Initialize rebalance calculator with one fund
  if (id === "rebalance") {
    const tbody = document.getElementById("rebalanceFundsTableBody");
    if (tbody && tbody.children.length === 0) {
      addRebalanceFundRow();
    }
  }

  history.replaceState(null, null, "#" + id);

  updateLayoutForTab(id);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function activateCalculatorFromHash() {
  if (!window.location.hash) {
    window.location.hash = "home"; //default hash
  }
  const hash = window.location.hash.substring(1); // remove '#'
  if (hash && document.getElementById(hash)) {
    const navItem = document.querySelector(`[onclick*="${hash}"]`);
    showCalculator(hash, navItem);
  }
}

function setupNumberInputs() {
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);

    input.addEventListener("input", function () {
      let value = input.value;
      const start = input.selectionStart;
      const end = input.selectionEnd;

      // --- Step 1: Allow only one minus at start ---
      const hasNegative = value.startsWith("-");
      value = value.replace(/-/g, "");
      if (hasNegative) value = "-" + value;

      // --- Step 2: Trim leading zeros (but keep "0." and "-0.") ---
      if (value !== "" && !/^(-?)0\./.test(value)) {
        value = value.replace(/^(-?)0+(?=\d)/, "$1");
      }

      // --- Step 3: Enforce min/max if valid ---
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (!isNaN(min) && num < min) value = String(min);
        else if (!isNaN(max) && num > max) value = String(max);
      }

      // --- Step 4: Apply cleaned value + fix cursor ---
      if (value !== input.value) {
        const diff = input.value.length - value.length;
        input.value = value;
        try {
          if (start !== null && end !== null) {
            input.setSelectionRange(start - diff, end - diff);
          }
        } catch (e) {
          // Silently ignore - happens when input type doesn't support selection
        }
      }
    });

    input.addEventListener("blur", () => {
      let value = input.value.trim();
      if (value === "") return;

      const num = Number(value);
      if (!isNaN(num)) {
        // Normalize by removing trailing zeros
        let normalized = parseFloat(num.toString()).toString();

        // Keep "12." if user typed that
        if (!/\.$/.test(input.value)) {
          input.value = normalized;
        }
      }
    });
  });
}

function updateLayoutForTab(id) {
  const tabHeader = document.querySelector(".content-header");
  const homeHeader = document.querySelector(".home-header");
  if (id === "home") {
    tabHeader.classList.add("hidden");
    homeHeader.classList.remove("hidden");
  } else {
    tabHeader.classList.remove("hidden");
    homeHeader.classList.add("hidden");
  }
}

function showTransitionSplash(callback) {
  const app = document.querySelector(".app-container");
  if (!app) {
    callback?.();
    return;
  }

  // Create a temporary splash clone
  const splash = document.createElement("div");
  splash.className = "splash-screen transition-splash";
  splash.innerHTML = `
    <div class="splash-content">
      <img src="icons/icon-192.png" alt="Logo" class="splash-icon" />
      <h1 class="splash-title">Financial Calculator</h1>
      <p class="splash-subtitle">Plan your finances smartly</p>
      <div class="splash-loader">
        <div class="bubble"></div>
        <div class="bubble"></div>
        <div class="bubble"></div>
      </div>
    </div>
  `;

  document.body.appendChild(splash);

  // Force reflow
  splash.offsetHeight;
  splash.classList.add("show");

  // Wait a tick, then update layout underneath
  setTimeout(() => {
    callback?.();
  }, 100);

  // Fade out splash after short delay
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 500);
  }, 600);
}

function showSplashScreen() {
  const splash = document.getElementById("splash-screen");
  setTimeout(function () {
    splash.classList.add("fade-out");
    setTimeout(function () {
      splash.remove();
    }, 500);
  }, 500);
}

// ---------- Init ----------
window.addEventListener("DOMContentLoaded", () => {
  console.clear();
  showSplashScreen();
  initYearDropdown();
  initializeOldApp();
  loadInputs();
  calculateAll();
  activateCalculatorFromHash();

  const savedTab = localStorage.getItem("activeCalculator");
  if (!window.location.hash && savedTab && document.getElementById(savedTab)) {
    const navItem = document.querySelector(`[onclick*="${savedTab}"]`);
    showCalculator(savedTab, navItem);
  }

  const debouncedCalc = debounce(() => {
    saveInputs();
    calculateAll();
  }, 0);

  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", debouncedCalc);
  });

  setupNumberInputs();
});

window.addEventListener("hashchange", () => {
  activateCalculatorFromHash();
});

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

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
};

// ---------- Reset function ----------
function resetAll() {
  // Clear localStorage
  localStorage.clear();

  // Clear all input fields
  document.querySelectorAll("input").forEach((input) => (input.value = ""));

  // Clear charts
  if (window.charts) {
    window.charts.forEach((chart) => chart.destroy());
    window.charts = [];
  }

  location.reload();
}

function resetSection(sectionId) {
  // Clear all visible inputs in this section
  document.querySelectorAll("#" + sectionId + " input").forEach((input) => {
    if (input.offsetParent !== null) {
      input.value = "";
      input.classList.remove("input-error");
    }
  });

  // Clear charts if window.charts exist (optional: filter charts by section)
  if (window.charts) {
    window.charts.forEach((chart) => chart.destroy());
    window.charts = [];
  }
  saveInputs();
  location.reload();
}

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
}

// ---------- Init ----------
window.addEventListener("DOMContentLoaded", () => {
  // Load saved inputs
  loadInputs();

  // Calculate all calculators with saved values
  calculateAll();

  // Restore active tab
  const savedTab = localStorage.getItem("activeCalculator");
  if (savedTab) {
    const navItem = document.querySelector(`[onclick*="${savedTab}"]`);
    if (navItem) showCalculator(savedTab, navItem);
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

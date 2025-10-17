const STORAGE_KEY = "financialCalculatorData";
let goalsAlreadyLoaded = false;

/**
 * Initialize goal counter based on existing goals
 */
function initializeGoalCounter() {
  const goalRows = document.querySelectorAll("#goalWithdrawalRows tr");
  if (goalRows.length > 0) {
    // Set counter to one more than the highest existing index
    goalCounter = goalRows.length + 1;
  } else {
    goalCounter = 1;
  }
}

/**
 * Add a goal row and increment counter
 */
function addGoalRowWithCounter(
  name = `Goal ${goalCounter}`,
  year = getNumericValue(".investmentYear") + 2,
  amount = formatIndianNumberFromData(50000),
  startingYear = getCurrentYear(),
  toast = false
) {
  const table = document.getElementById("goalWithdrawalRows");
  const row = document.createElement("tr");

  const goalIndex = goalCounter;
  row.setAttribute("data-goal-index", goalIndex);

  const yearOptions = [];
  for (let y = startingYear; y <= startingYear + 50; y++) {
    yearOptions.push(
      `<option value="${y}" ${y == year ? "selected" : ""}>${y}</option>`
    );
  }

  row.innerHTML = `
    <td>
        <input type="text" class="goalName" autocomplete="off" value="${name}" oninput="saveInputs()" />
    </td>
    <td>
      <select class="goalYear" oninput="saveInputs()">${yearOptions.join(
        ""
      )}</select>
    </td>
    <td>
        <input type="text" class="goalAmount" oninput="formatIndianNumber(this); saveInputs()"  
               autocomplete="off" 
               value="${amount}" />
    </td>
    <td class="goalActions desktop-only">
      <button type="button" onclick="moveGoalRowUp(this)" title="Move Up">
        <i class="fas fa-chevron-up"></i>
      </button>
      <button type="button" onclick="moveGoalRowDown(this)" title="Move Down">
        <i class="fas fa-chevron-down"></i>
      </button>
      <button type="button" onclick="removeGoalRow(this)" title="Remove">
        <i class="fas fa-minus-circle"></i>
      </button>
    </td>
  `;

  table.appendChild(row);
  goalCounter++; // Increment AFTER adding
  saveInputs(); // Save the updated counter

  if (toast) {
    showToast("Goal added successfully!", "success");
  }
}

/**
 * Remove a goal row and update counter if needed
 */
function removeGoalRowWithCounter(button) {
  const row = button.closest("tr");
  const tbody = document.getElementById("goalWithdrawalRows");

  if (tbody.rows.length <= 1) {
    row.remove();
    document.querySelector(".lumpsumWithdrawalTable").classList.add("hidden");
    setState("lumpsumWithdrawal", false);
    goalCounter = 1; // Reset to 1
    saveInputs();
    return;
  }

  row.remove();
  saveInputs(); // Save after removing
  showToast("Goal removed successfully!", "success");
}

/**
 * Remove all goals and reset counter
 */
async function removeAllGoalsWithCounter() {
  const userConfirmed = await showCustomDialog(
    "Are you sure you want to remove all goals?",
    "warning"
  );

  if (userConfirmed) {
    const tbody = document.getElementById("goalWithdrawalRows");
    tbody.innerHTML = "";
    goalCounter = 1; // Reset counter to 1

    const lumpsumTable = document.querySelector(".lumpsumWithdrawalTable");
    if (lumpsumTable) {
      lumpsumTable.classList.add("hidden");
    }

    setState("lumpsumWithdrawal", false);
    saveInputs(); // Save the reset state
    showToast("All goals removed and counter reset!", "success");
  }
}

/**
 * Reset form and counter
 */
function resetFormWithCounter() {
  // Clear advanced investment specific data from storage
  const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  const keysToRemove = Object.keys(allData).filter((key) => {
    return (
      key.includes("investment") ||
      key.includes("Investment") ||
      key.includes("Interest") ||
      key.includes("inflation") ||
      key.includes("sip") ||
      key.includes("Sip") ||
      key.includes("SIP") ||
      key.includes("swp") ||
      key.includes("Swp") ||
      key.includes("SWP") ||
      key.includes("lumpsum") ||
      key.includes("withdrawal") ||
      key.includes("Withdrawal") ||
      key.includes("stepUp") ||
      key.includes("StepUp") ||
      key.includes("bonus") ||
      key.includes("Bonus") ||
      key.includes("parallel") ||
      key.includes("Parallel") ||
      key === "goalWithdrawals" ||
      key === "goalCounter" || // Include goal counter
      key.includes("compounding") ||
      key.includes("Compounding") ||
      key.includes("interestRate") ||
      key.includes("inflationRate") ||
      key.includes("decreaseInterest") ||
      key.includes("stopSip") ||
      key.includes("toggleSIP") ||
      key.includes("toggleSWP")
    );
  });

  keysToRemove.forEach((key) => delete allData[key]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

  // Clear goals table
  const goalsTbody = document.getElementById("goalWithdrawalRows");
  if (goalsTbody) {
    goalsTbody.innerHTML = "";
  }

  goalCounter = 1; // Reset counter to 1
  goalsAlreadyLoaded = false; // Reset the load flag
  saveInputs(); // Save the reset state

  location.reload();
}

/**
 * Add goal row WITHOUT incrementing counter (for loading from storage)
 */
function addGoalRowFromStorage(name, year, amount, startingYear) {
  const table = document.getElementById("goalWithdrawalRows");
  const row = document.createElement("tr");

  const yearOptions = [];
  for (let y = startingYear; y <= startingYear + 50; y++) {
    yearOptions.push(
      `<option value="${y}" ${y == year ? "selected" : ""}>${y}</option>`
    );
  }

  row.innerHTML = `
    <td>
        <input type="text" class="goalName" autocomplete="off" value="${name}" oninput="saveInputs()" />
    </td>
    <td>
      <select class="goalYear" oninput="saveInputs()">${yearOptions.join(
        ""
      )}</select>
    </td>
    <td>
        <input type="text" class="goalAmount" oninput="formatIndianNumber(this); saveInputs()"  
               autocomplete="off" 
               value="${amount}" />
    </td>
    <td class="goalActions desktop-only">
      <button type="button" onclick="moveGoalRowUp(this)" title="Move Up">
        <i class="fas fa-chevron-up"></i>
      </button>
      <button type="button" onclick="moveGoalRowDown(this)" title="Move Down">
        <i class="fas fa-chevron-down"></i>
      </button>
      <button type="button" onclick="removeGoalRow(this)" title="Remove">
        <i class="fas fa-minus-circle"></i>
      </button>
    </td>
  `;

  table.appendChild(row);
  // NO INCREMENT HERE - counter is handled separately
}

function saveInputs() {
  const data = {};

  // Save all input fields (text, number)
  document
    .querySelectorAll("input[type='text'], input[type='number']")
    .forEach((input) => {
      if (
        input.id === "searchInput" ||
        input.closest(".result-section, .results-chart-container")
      ) {
        return;
      }

      // Save by ID first (preferred)
      if (
        input.id &&
        !input.closest(".result-section, .results-chart-container")
      ) {
        const numValue = getNumericValueFromText(input.value);
        data[input.id] = numValue;
      }

      // Also save by class for legacy fields - store numeric value, not formatted string
      if (input.className && !input.closest("#goalWithdrawalRows")) {
        const mainClass = input.className.split(" ")[0];
        if (mainClass) {
          const numValue = getNumericValueFromText(input.value);
          data[mainClass] = numValue; // ← Store numeric value instead
        }
      }
    });

  // Save all select dropdowns
  document.querySelectorAll("select").forEach((select) => {
    if (select.id) {
      data[select.id] = select.value;
    }
    if (select.className) {
      const mainClass = select.className.split(" ")[0];
      if (mainClass) data[mainClass] = select.value;
    }
  });

  // Save all checkboxes (important for toggles)
  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    if (checkbox.id) {
      data[checkbox.id] = checkbox.checked;
    }
  });

  // Save active calculator tab
  const activeCalc = document.querySelector(".calculator.active");
  if (activeCalc) {
    data.activeCalculator = activeCalc.id;
  }

  // Save goal withdrawals (advanced investment)
  const goalRows = document.querySelectorAll("#goalWithdrawalRows tr");
  if (goalRows.length > 0) {
    const goals = [];
    goalRows.forEach((row) => {
      goals.push({
        name: row.querySelector(".goalName")?.value ?? "",
        year: row.querySelector(".goalYear")?.value ?? "",
        amount: getNumericValueFromText(
          row.querySelector(".goalAmount")?.value ?? ""
        ),
      });
    });
    data.goalWithdrawals = goals;
  }

  // Save goal counter
  if (typeof goalCounter !== "undefined") {
    data.goalCounter = goalCounter;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadInputs() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);

    // Load regular inputs and selects
    Object.entries(data).forEach(([key, value]) => {
      // SKIP goalWithdrawals and goalCounter - handle separately
      if (
        key === "goalWithdrawals" ||
        key === "goalCounter" ||
        key === "activeCalculator"
      ) {
        return;
      }

      const element = document.getElementById(key);
      if (element) {
        if (element.type === "checkbox") {
          element.checked = value;
          element.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (element.type === "number") {
          element.value = value;
        } else if (element.type === "text") {
          if (typeof value === "number" && !isNaN(value)) {
            element.value = formatIndianNumberFromData(value);
          } else {
            element.value = value;
          }
        } else {
          element.value = value;
        }
        return;
      }

      const byClass = document.querySelector(`.${key}`);
      if (byClass && byClass.type !== "checkbox") {
        if (byClass.type === "text" && typeof value === "number") {
          byClass.value = formatIndianNumberFromData(value);
        } else {
          byClass.value = value;
        }
      }
    });

    // Load goals from storage
    if (
      Array.isArray(data.goalWithdrawals) &&
      data.goalWithdrawals.length > 0
    ) {
      const tbody = document.getElementById("goalWithdrawalRows");
      if (tbody) {
        // Always clear all existing goal rows
        tbody.innerHTML = "";

        // Rebuild rows after clearing
        const startingYear =
          getNumericValue(".investmentYear") || getCurrentYear();

        data.goalWithdrawals.forEach((goal) => {
          const formattedAmount = formatIndianNumberFromData(goal.amount || 0);
          addGoalRowFromStorage(
            goal.name,
            goal.year,
            formattedAmount,
            startingYear
          );
        });
      }
    }

    // RESTORE counter AFTER loading goals
    if (typeof data.goalCounter !== "undefined") {
      goalCounter = data.goalCounter;
    }
  } catch (err) {
    console.error("Error loading saved data:", err);
  }
}

/**
 * Clear all localStorage data
 */
function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export current data as JSON file
 */
function exportData() {
  const data = localStorage.getItem(STORAGE_KEY) || "{}";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `financial-calc-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Data exported successfully!", "success");
}

/**
 * Import data from JSON file
 */
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      // Reload the page to apply imported data
      location.reload();
    } catch (err) {
      showToast(
        "Failed to import data. Please check the file format.",
        "error"
      );
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function resetAll() {
  // Clear all localStorage data
  clearStorage();

  // Reset goal-related variables
  if (typeof goalCounter !== "undefined") {
    goalCounter = 1;
  }
  goalsAlreadyLoaded = false;

  // Clear goal rows from DOM
  const goalsTbody = document.getElementById("goalWithdrawalRows");
  if (goalsTbody) {
    goalsTbody.innerHTML = "";
  }

  // Hide lumpsum table
  const lumpsumTable = document.querySelector(".lumpsumWithdrawalTable");
  if (lumpsumTable) {
    lumpsumTable.classList.add("hidden");
  }

  // Reset lumpsum toggle
  const lumpsumToggle = document.getElementById("lumpsumWithdrawal");
  if (lumpsumToggle) {
    lumpsumToggle.checked = false;
  }
  showTransitionSplash(() => {
    // Set hash to home (happens under the splash)
    window.location.hash = "home";

    // Reload after splash is visible
    setTimeout(() => {
      location.reload();
    }, 200);
  });
}

function resetSection(sectionId) {
  // Get current storage data
  const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  // Determine which keys to remove based on section
  const keysToRemove = [];

  if (sectionId === "investment-calculator") {
    // Remove all advanced investment related keys
    Object.keys(allData).forEach((key) => {
      if (
        key.includes("investment") ||
        key.includes("Investment") ||
        key.includes("Interest") ||
        key.includes("inflation") ||
        key.includes("sip") ||
        key.includes("Sip") ||
        key.includes("SIP") ||
        key.includes("swp") ||
        key.includes("Swp") ||
        key.includes("SWP") ||
        key.includes("lumpsum") ||
        key.includes("withdrawal") ||
        key.includes("Withdrawal") ||
        key.includes("stepUp") ||
        key.includes("StepUp") ||
        key.includes("bonus") ||
        key.includes("Bonus") ||
        key.includes("parallel") ||
        key.includes("Parallel") ||
        key === "goalWithdrawals" ||
        key === "goalCounter" ||
        key.includes("years") ||
        key.includes("Years") ||
        key.includes("compounding") ||
        key.includes("Compounding") ||
        key.includes("interestRate") ||
        key.includes("inflationRate") ||
        key.includes("decreaseInterest") ||
        key.includes("stopSip") ||
        key.includes("toggleSIP") ||
        key.includes("toggleSWP")
      ) {
        keysToRemove.push(key);
      }
    });

    // Clear goals table
    const goalsTbody = document.getElementById("goalWithdrawalRows");
    if (goalsTbody) {
      goalsTbody.innerHTML = "";
    }
    if (typeof goalCounter !== "undefined") {
      goalCounter = 1;
    }
  } else {
    // For simple calculators, remove keys with section prefix
    document
      .querySelectorAll(`#${sectionId} input, #${sectionId} select`)
      .forEach((input) => {
        if (input.id) {
          keysToRemove.push(input.id);
        }
      });
  }

  // Remove keys from storage
  keysToRemove.forEach((key) => delete allData[key]);

  // Save updated storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));

  // Clear visible inputs in this section
  document
    .querySelectorAll(`#${sectionId} input, #${sectionId} select`)
    .forEach((input) => {
      if (input.offsetParent !== null) {
        if (input.type === "checkbox") {
          input.checked = false;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          input.value = "";
        }
        input.classList.remove("input-error");
      }
    });

  // Clear charts
  if (window.charts) {
    Object.values(window.charts).forEach((chart) => chart.destroy());
    window.charts = {};
  }

  // For advanced investment, reload to restore defaults
  if (sectionId === "investment-calculator" || sectionId === "tax-calculator") {
    goalsAlreadyLoaded = false;
    location.reload();
  }
}

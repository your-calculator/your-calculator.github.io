let rebalanceFundCounter = 0;

function addRebalanceFundRow(name = "", allocation = "", currentValue = "") {
  const tbody = document.getElementById("rebalanceFundsTableBody");
  const row = document.createElement("tr");
  const id = ++rebalanceFundCounter;

  // Generate placeholder only if name is empty
  const placeholderName = name ? "" : `Fund ${id}`;

  row.innerHTML = `
    <td><input type="text" class="table-input rebalance-fund-name" placeholder="${placeholderName}" value="${name}" oninput="updateRebalanceTotals(); saveInputs()"></td>
    <td><input type="number" class="table-input rebalance-fund-allocation text-right" placeholder="0" value="${allocation}" step="0.1" min="0" max="100" oninput="updateRebalanceTotals(); saveInputs()"></td>
    <td><input type="text" class="table-input rebalance-fund-value text-right" placeholder="0" value="${currentValue}" oninput="formatIndianNumber(this); updateRebalanceTotals(); saveInputs()"></td>
    <td class="text-right rebalance-fund-current-percent">0%</td>
    <td class="text-right rebalance-fund-deviation">0%</td>
    <td class="text-center">
      <button class="btn-secondary" style="padding: 0.5rem;" onclick="removeRebalanceFundRow(this)" title="Remove">✕</button>
    </td>
  `;

  tbody.appendChild(row);
  updateRebalanceTotals();
}

function removeRebalanceFundRow(button) {
  button.closest("tr").remove();
  updateRebalanceTotals();
  saveInputs();
}

function clearAllRebalanceFunds() {
  if (confirm("Are you sure you want to clear all funds?")) {
    document.getElementById("rebalanceFundsTableBody").innerHTML = "";
    rebalanceFundCounter = 0;
    updateRebalanceTotals();
    document.getElementById("rebalanceResultsSection").classList.add("hidden");
    saveInputs();
  }
}

function updateRebalanceTotals() {
  const rows = document.querySelectorAll("#rebalanceFundsTableBody tr");
  let totalAllocation = 0;
  let totalCurrentValue = 0;

  rows.forEach((row) => {
    const allocation =
      parseFloat(row.querySelector(".rebalance-fund-allocation").value) || 0;
    const currentValue = getNumericValueFromText(
      row.querySelector(".rebalance-fund-value").value
    );

    totalAllocation += allocation;
    totalCurrentValue += currentValue;
  });

  rows.forEach((row) => {
    const allocation =
      parseFloat(row.querySelector(".rebalance-fund-allocation").value) || 0;
    const currentValue = getNumericValueFromText(
      row.querySelector(".rebalance-fund-value").value
    );

    const currentPercent =
      totalCurrentValue > 0 ? (currentValue / totalCurrentValue) * 100 : 0;
    const deviation = currentPercent - allocation;

    row.querySelector(".rebalance-fund-current-percent").textContent =
      currentPercent.toFixed(2) + "%";

    const deviationCell = row.querySelector(".rebalance-fund-deviation");
    deviationCell.textContent = deviation.toFixed(2) + "%";

    if (Math.abs(deviation) < 0.5) {
      deviationCell.style.color = "#065f46";
    } else if (Math.abs(deviation) < 2) {
      deviationCell.style.color = "#92400e";
    } else {
      deviationCell.style.color = "#991b1b";
    }
  });

  document.getElementById("rebalanceTotalAllocation").textContent =
    totalAllocation.toFixed(2) + "%";
  document.getElementById("rebalanceTotalCurrentValue").textContent =
    formatCurrency(totalCurrentValue);

  const allocationCell = document.getElementById("rebalanceTotalAllocation");
  if (Math.abs(totalAllocation - 100) > 0.01 && totalAllocation > 0) {
    allocationCell.style.color = "#dc2626";
  } else {
    allocationCell.style.color = "inherit";
  }
}

function calculateRebalancingPlan() {
  const monthlyInvestment = getNumericValueFromText(
    document.getElementById("rebalance-monthly-investment").value
  );
  const rows = document.querySelectorAll("#rebalanceFundsTableBody tr");

  if (!monthlyInvestment || monthlyInvestment <= 0) {
    showCustomDialog("Please enter a valid monthly investment amount", "error");
    return;
  }

  if (rows.length < 2) {
    showCustomDialog("Please add at least two funds for rebalancing", "error");
    return;
  }

  const funds = [];
  let totalCurrentValue = 0;
  let totalAllocation = 0;
  let hasInvalidRow = false;

  rows.forEach((row) => {
    const name = row.querySelector(".rebalance-fund-name").value?.trim();
    const allocation = parseFloat(
      row.querySelector(".rebalance-fund-allocation").value
    );
    const currentValue = getNumericValueFromText(
      row.querySelector(".rebalance-fund-value").value
    );

    if (!name) {
      showCustomDialog("Fund name cannot be empty", "error");
      hasInvalidRow = true;
      return;
    }

    if (isNaN(allocation) || allocation <= 0) {
      showCustomDialog(
        "Each fund must have a valid allocation percentage",
        "error"
      );
      hasInvalidRow = true;
      return;
    }

    funds.push({ name, allocation, currentValue });
    totalCurrentValue += currentValue;
    totalAllocation += allocation;
  });

  if (hasInvalidRow) return;

  if (Math.abs(totalAllocation - 100) > 0.01) {
    showCustomDialog("Total target allocation must be exactly 100%", "error");
    return;
  }

  const TOLERANCE = 0.25;
  const maxDeviation = Math.max(
    ...funds.map((f) => {
      const pct = totalCurrentValue
        ? (f.currentValue / totalCurrentValue) * 100
        : 0;
      return Math.abs(pct - f.allocation);
    })
  );

  if (totalCurrentValue === 0 || maxDeviation <= TOLERANCE) {
    const plan = [
      {
        month: 1,
        allocations: funds.map((f) => ({
          name: f.name,
          amount: (monthlyInvestment * f.allocation) / 100,
        })),
        endingBalances: funds.map((f) => ({
          name: f.name,
          value: f.currentValue + (monthlyInvestment * f.allocation) / 100,
        })),
      },
    ];

    displayRebalanceResults(
      funds,
      plan,
      monthlyInvestment,
      totalCurrentValue,
      false,
      true
    );
    return;
  }

  const { plan, isPartialRebalance } = generateRebalancePlan(
    funds,
    monthlyInvestment
  );
  displayRebalanceResults(
    funds,
    plan,
    monthlyInvestment,
    totalCurrentValue,
    isPartialRebalance,
    false
  );
}

function generateRebalancePlan(funds, monthlyInvestment) {
  const plan = [];
  const TOLERANCE = 0.25;
  let month = 1;
  let isPartialRebalance = false;

  let state = funds.map((f) => ({
    name: f.name,
    allocation: f.allocation,
    value: f.currentValue,
  }));

  while (true) {
    const totalValue = state.reduce((s, f) => s + f.value, 0);
    const gaps = state.map((f) => {
      const currentPercent = totalValue > 0 ? (f.value / totalValue) * 100 : 0;
      return {
        ...f,
        gapPercent: f.allocation - currentPercent,
        gapValue:
          ((totalValue + monthlyInvestment) * f.allocation) / 100 - f.value,
      };
    });

    const allBalanced = gaps.every((g) => Math.abs(g.gapPercent) <= TOLERANCE);
    if (allBalanced) break;

    if (month > 120) {
      isPartialRebalance = true;
      break;
    }

    let remaining = monthlyInvestment;
    gaps.sort((a, b) => b.gapValue - a.gapValue);

    const allocations = state.map((f) => ({ name: f.name, amount: 0 }));

    for (const g of gaps) {
      if (remaining <= 0) break;
      if (g.gapValue <= 0) continue;

      const idx = state.findIndex((s) => s.name === g.name);
      const invest = Math.min(g.gapValue, remaining);

      allocations[idx].amount += invest;
      state[idx].value += invest;
      remaining -= invest;
    }

    if (remaining > 0.01) {
      state.forEach((f, i) => {
        const invest = (remaining * f.allocation) / 100;
        allocations[i].amount += invest;
        f.value += invest;
      });
    }

    plan.push({
      month,
      allocations,
      endingBalances: state.map((f) => ({ name: f.name, value: f.value })),
    });

    month++;
  }

  return { plan, isPartialRebalance };
}

function displayRebalanceResults(
  funds,
  plan,
  monthlyInvestment,
  totalCurrentValue,
  isPartialRebalance,
  isAlreadyBalanced
) {
  document.getElementById("rebalanceSummaryTotal").textContent =
    formatCurrency(totalCurrentValue);
  document.getElementById("rebalanceSummaryMonthly").textContent =
    formatCurrency(monthlyInvestment);

  const statusEl = document.getElementById("rebalanceSummaryStatus");
  const note = document.getElementById("rebalanceStatusNote");
  const planCard = document.getElementById("rebalancePlanCard");
  const postCard = document.getElementById("postRebalanceCard");

  if (isAlreadyBalanced) {
    statusEl.innerHTML =
      '<span class="status-badge status-ok">Well Balanced</span>';
    note.innerHTML =
      "✅ <strong>Portfolio is already well balanced.</strong> Monthly investments will continue as per target allocation.";
    note.style.color = "#065f46";
    planCard.style.display = "block";
    postCard.style.display = "none";

    renderRebalancePlanTable(funds, plan, monthlyInvestment);
    document
      .getElementById("rebalanceResultsSection")
      .classList.remove("hidden");
    return;
  }

  planCard.style.display = "block";
  postCard.style.display = "block";
  statusEl.innerHTML =
    '<span class="status-badge status-error">Needs Rebalancing</span>';

  if (isPartialRebalance) {
    note.innerHTML =
      "⚠ <strong>Partial Rebalancing Done.</strong> Maximum rebalancing period of 10 years reached.";
    note.style.color = "#92400e";
  } else {
    note.innerHTML =
      "✅ <strong>Rebalancing completed successfully</strong> within 0.25% tolerance.";
    note.style.color = "#065f46";
  }

  renderRebalancePlanTable(funds, plan, monthlyInvestment);
  renderPostRebalanceSummary(funds, plan);

  document.getElementById("rebalanceResultsSection").classList.remove("hidden");

  const resultSection = document.getElementById("rebalanceResultsSection");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderRebalancePlanTable(funds, plan, monthlyInvestment) {
  const thead = document.getElementById("rebalancingPlanHeader");
  const tbody = document.getElementById("rebalancingPlanBody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  let headerHtml = "<tr><th>Month</th>";
  funds.forEach((f) => {
    headerHtml += `<th class="text-right">${f.name}</th>`;
  });
  headerHtml += `<th class="text-right">Total Invested</th></tr>`;
  thead.innerHTML = headerHtml;

  plan.forEach((monthData) => {
    let rowHtml = `<tr><td>Month ${monthData.month}</td>`;

    funds.forEach((f) => {
      const alloc = monthData.allocations.find((a) => a.name === f.name);
      const amount = alloc ? alloc.amount : 0;
      rowHtml +=
        amount > 0
          ? `<td class="text-right">${formatCurrency(amount)}</td>`
          : `<td class="text-right" style="color:#9ca3af;">-</td>`;
    });

    rowHtml += `<td class="text-right">${formatCurrency(
      monthlyInvestment
    )}</td></tr>`;
    tbody.innerHTML += rowHtml;
  });
}

function renderPostRebalanceSummary(funds, plan) {
  const last = plan[plan.length - 1];
  const tbody = document.getElementById("postRebalanceSummaryTable");
  tbody.innerHTML = "";

  const total = last.endingBalances.reduce((s, f) => s + f.value, 0);

  last.endingBalances.forEach((b) => {
    const target = funds.find((f) => f.name === b.name).allocation;
    const actual = (b.value / total) * 100;
    const deviation = actual - target;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.name}</td>
      <td class="text-right">${formatCurrency(b.value)}</td>
      <td class="text-right">${actual.toFixed(2)}%</td>
      <td class="text-right">${target.toFixed(2)}%</td>
      <td class="text-right" style="color:${
        Math.abs(deviation) < 0.25 ? "#065f46" : "#991b1b"
      }">
        ${deviation.toFixed(2)}%
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("finalRebalancePortfolioValue").textContent =
    formatCurrency(total);
  document.getElementById(
    "rebalanceCompletionMonths"
  ).textContent = `${plan.length} months`;
}

function initializeRebalanceCalculator() {
  const tbody = document.getElementById("rebalanceFundsTableBody");
  if (tbody && tbody.children.length === 0) {
    addRebalanceFundRow();
  }
}

// Call on calculator switch
window.addEventListener("DOMContentLoaded", () => {
  // Don't auto-add on page load - wait for calculator to be active
});

// --- Indian Number Formatter for display/input (with decimal support) ---
function formatIndianNumber(input) {
  const cursorPosition = input.selectionStart;
  const oldValue = input.value;
  const oldLength = oldValue.length;

  // Remove commas
  let value = input.value.replace(/,/g, "");

  // Allow digits and a single decimal point
  value = value.replace(/[^\d.]/g, "");
  const parts = value.split(".");

  // Handle multiple dots
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("").replace(/\./g, "");
  }

  // --- Allow user to type "." at end ---
  if (value.endsWith(".")) {
    const [integerPartRaw] = value.split(".");
    const integerPart = integerPartRaw.replace(/^0+(?!$)/, "") || "0";
    input.value = formatIndianNumberFromData(integerPart) + ".";
    input.setSelectionRange(cursorPosition, cursorPosition);
    return;
  }

  // Split into integer and decimal parts
  const [integerPartRaw, decimalPart] = value.split(".");

  // Format integer part
  const formattedInt = formatIndianNumberFromData(
    integerPartRaw || "0"
  ).replace(/\.\d+$/, "");

  // Combine integer and decimal
  const formattedValue = decimalPart
    ? `${formattedInt}.${decimalPart}`
    : formattedInt;

  input.value = formattedValue;

  // Adjust cursor position
  const newLength = formattedValue.length;
  const diff = newLength - oldLength;
  let newPosition = cursorPosition + diff;
  if (newPosition < 0) newPosition = 0;
  if (newPosition > newLength) newPosition = newLength;
  input.setSelectionRange(newPosition, newPosition);
}

// --- Indian Number Formatter for static data ---
function formatIndianNumberFromData(data) {
  if (data === null || data === undefined || data === "") return "";
  if (isNaN(data)) return data;

  const numStr = Math.abs(data).toString();
  const [integerPartRaw, decimalPart] = numStr.split(".");

  const integerPart = integerPartRaw.replace(/^0+(?!$)/, "") || "0";

  if (integerPart.length <= 3) {
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  }

  const lastThree = integerPart.slice(-3);
  const remaining = integerPart.slice(0, -3);
  const formattedRemaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  const formatted = formattedRemaining + "," + lastThree;
  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
}

// --- International Number Formatter (with decimal and "." typing support) ---
function formatInternationalNumber(input) {
  const cursorPosition = input.selectionStart;
  const oldValue = input.value;
  const oldLength = oldValue.length;

  // Remove commas
  let value = input.value.replace(/,/g, "");

  // Allow digits and one decimal point
  value = value.replace(/[^\d.]/g, "");
  const parts = value.split(".");

  // Handle multiple dots
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("").replace(/\./g, "");
  }

  // --- Allow user to type "." at end ---
  if (value.endsWith(".")) {
    const [integerPartRaw] = value.split(".");
    const integerPart = integerPartRaw.replace(/^0+(?!$)/, "") || "0";
    input.value = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ".";
    input.setSelectionRange(cursorPosition, cursorPosition);
    return;
  }

  const [integerPartRaw, decimalPart] = value.split(".");
  const integerPart = integerPartRaw.replace(/^0+(?!$)/, "") || "0";
  const formattedInt = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formattedValue = decimalPart
    ? `${formattedInt}.${decimalPart}`
    : formattedInt;

  input.value = formattedValue;

  const newLength = formattedValue.length;
  const diff = newLength - oldLength;
  let newPosition = cursorPosition + diff;
  if (newPosition < 0) newPosition = 0;
  if (newPosition > newLength) newPosition = newLength;
  input.setSelectionRange(newPosition, newPosition);
}

// --- Utility: get numeric value from an input selector ---
function getNumericValue(selector) {
  const el = document.querySelector(selector);
  if (!el) return 0;
  const value = el.value.replace(/,/g, "");
  return parseFloat(value) || 0;
}

// --- Utility: get numeric value from text ---
function getNumericValueFromText(text) {
  if (!text) return 0;
  return parseFloat(text.replace(/,/g, "")) || 0;
}

function validateInputs(inputIds) {
  const inputs = inputIds.map((id) => document.getElementById(id));
  let allValid = true;

  inputs.forEach((input) => {
    // Remove commas before parsing
    const value = getNumericValueFromText(input.value);
    if (!input.value || isNaN(value) || value <= 0) {
      input.classList.add("input-error");
      allValid = false;
    } else {
      input.classList.remove("input-error");
    }
  });

  if (!allValid) {
    const firstInvalid = inputs.find((input) => {
      const value = getNumericValueFromText(input.value);
      return !input.value || isNaN(value) || value <= 0;
    });
    if (firstInvalid) firstInvalid.focus();
    return false;
  }

  return true;
}

// Calculate Loan EMI
function calculateLoanEMI() {
  const allFilled = validateInputs(["loan-amount", "loan-rate", "loan-tenure"]);
  if (!allFilled) return;
  const principal = getNumericValueFromText(
    document.getElementById("loan-amount").value
  );
  const annualRate = parseFloat(document.getElementById("loan-rate").value);
  const tenureType = document.getElementById("loan-tenure-type").value;
  const tenure = parseFloat(document.getElementById("loan-tenure").value);
  const loanType = document.getElementById("loan-type").value;

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureType === "years" ? tenure * 12 : tenure;

  if (loanType === "regular") {
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - principal;
    const interestRatio = (totalInterest / principal) * 100;

    document.getElementById("monthly-payment-label").textContent =
      "Monthly EMI";
    document.getElementById("emi-amount").textContent = formatCurrency(emi);
    document.getElementById("principal-payment-item").classList.add("hide");
    document.getElementById("total-interest").textContent =
      formatCurrency(totalInterest);
    document.getElementById("total-amount").textContent =
      formatCurrency(totalAmount);
    document.getElementById("interest-principal-ratio").textContent =
      interestRatio.toFixed(1) + "%";

    // Generate amortization schedule
    amortizationData = [];
    let balance = principal;

    for (let i = 1; i <= totalMonths; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      amortizationData.push({
        month: i,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    document.getElementById("amortization-toggle").classList.remove("hide");

    // Create pie chart
    createPieChart(
      "loanChart",
      ["Principal Amount", "Total Interest"],
      [principal, totalInterest],
      ["#3b82f6", "#ef4444"]
    );
  } else {
    const monthlyInterest = principal * monthlyRate;
    const totalInterest = monthlyInterest * totalMonths;
    const totalAmount = principal + totalInterest;
    const interestRatio = (totalInterest / principal) * 100;

    document.getElementById("monthly-payment-label").textContent =
      "Monthly Interest Payment";
    document.getElementById("emi-amount").textContent =
      formatCurrency(monthlyInterest);
    document.getElementById("principal-payment-item").classList.remove("hide");
    document.getElementById("principal-payment").textContent =
      formatCurrency(principal);
    document.getElementById("total-interest").textContent =
      formatCurrency(totalInterest);
    document.getElementById("total-amount").textContent =
      formatCurrency(totalAmount);
    document.getElementById("interest-principal-ratio").textContent =
      interestRatio.toFixed(1) + "%";

    document.getElementById("amortization-toggle").classList.add("hide");
    amortizationData = [];

    // Create pie chart
    createPieChart(
      "loanChart",
      ["Principal Amount", "Total Interest"],
      [principal, totalInterest],
      ["#3b82f6", "#ef4444"]
    );
  }

  showResultSection("loan-emi", true);
}

// Toggle amortization schedule
function toggleAmortization() {
  const section = document.getElementById("amortization-section");
  const toggle = document.getElementById("amortization-toggle");

  if (section.classList.contains("hide")) {
    section.classList.remove("hide");
    toggle.textContent = "Hide Amortization Schedule";
    renderAmortizationTable();
  } else {
    section.classList.add("hide");
    toggle.textContent = "Show Amortization Schedule";
  }
}

// Render amortization table
function renderAmortizationTable() {
  const tbody = document.getElementById("amortization-tbody");
  tbody.innerHTML = "";

  amortizationData.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.month}</td>
      <td class="text-right">${formatCurrency(row.emi)}</td>
      <td class="text-right">${formatCurrency(row.principal)}</td>
      <td class="text-right">${formatCurrency(row.interest)}</td>
      <td class="text-right">${formatCurrency(row.balance)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Calculate Fixed Deposit
function calculateFD() {
  const allFilled = validateInputs(["fd-principal", "fd-rate", "fd-years"]);
  if (!allFilled) return;
  const principal = getNumericValueFromText(
    document.getElementById("fd-principal").value
  );
  const rate = parseFloat(document.getElementById("fd-rate").value);
  const years = parseFloat(document.getElementById("fd-years").value);
  const compounding = parseInt(
    document.getElementById("fd-compounding").value,
    10
  );

  const maturityAmount =
    principal * Math.pow(1 + rate / 100 / compounding, compounding * years);
  const interest = maturityAmount - principal;
  const effectiveYield = ((maturityAmount / principal - 1) / years) * 100;

  document.getElementById("fd-maturity").textContent =
    formatCurrency(maturityAmount);
  document.getElementById("fd-interest").textContent = formatCurrency(interest);
  document.getElementById("fd-yield").textContent =
    effectiveYield.toFixed(2) + "%";

  createPieChart(
    "fdChart",
    ["Principal", "Interest Earned"],
    [principal, interest],
    ["#3b82f6", "#10b981"]
  );

  showResultSection("fd", true);
}

// Calculate Recurring Deposit
function calculateRD() {
  const allFilled = validateInputs(["rd-monthly", "rd-rate", "rd-years"]);
  if (!allFilled) return;
  const monthlyDeposit = getNumericValueFromText(
    document.getElementById("rd-monthly").value
  );
  const annualRate = parseFloat(document.getElementById("rd-rate").value);
  const years = parseFloat(document.getElementById("rd-years").value);

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;
  const maturityAmount =
    monthlyDeposit *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
    (1 + monthlyRate);
  const totalDeposits = monthlyDeposit * totalMonths;
  const interest = maturityAmount - totalDeposits;

  document.getElementById("rd-maturity").textContent =
    formatCurrency(maturityAmount);
  document.getElementById("rd-deposits").textContent =
    formatCurrency(totalDeposits);
  document.getElementById("rd-interest").textContent = formatCurrency(interest);

  createPieChart(
    "rdChart",
    ["Total Deposits", "Interest Earned"],
    [totalDeposits, interest],
    ["#3b82f6", "#10b981"]
  );

  showResultSection("rd", true);
}

// Calculate Inflation
function calculateInflation() {
  const allFilled = validateInputs([
    "inflation-amount",
    "inflation-rate",
    "inflation-years",
  ]);
  if (!allFilled) return;
  const amount = getNumericValueFromText(
    document.getElementById("inflation-amount").value
  );
  const rate = parseFloat(document.getElementById("inflation-rate").value);
  const years = parseFloat(document.getElementById("inflation-years").value);

  const futureCost = amount * Math.pow(1 + rate / 100, years);
  const increase = futureCost - amount;
  const purchasingPower = (amount / futureCost) * 100;

  document.getElementById("inflation-future-cost").textContent =
    formatCurrency(futureCost);
  document.getElementById("inflation-increase").textContent =
    formatCurrency(increase);
  document.getElementById("purchasing-power").textContent =
    purchasingPower.toFixed(1) + "%";

  showResultSection("inflation", true);
}

// Calculate Future Value
function calculateFutureValue() {
  const allFilled = validateInputs(["fv-present-value", "fv-rate", "fv-years"]);
  if (!allFilled) return;
  const presentValue = getNumericValueFromText(
    document.getElementById("fv-present-value").value
  );
  const rate = parseFloat(document.getElementById("fv-rate").value);
  const years = parseFloat(document.getElementById("fv-years").value);
  const compounding = parseInt(
    document.getElementById("fv-compounding").value,
    10
  );

  const futureValue =
    presentValue * Math.pow(1 + rate / 100 / compounding, compounding * years);
  const interestEarned = futureValue - presentValue;
  const growthMultiple = futureValue / presentValue;

  document.getElementById("future-value-result").textContent =
    formatCurrency(futureValue);
  document.getElementById("fv-interest-earned").textContent =
    formatCurrency(interestEarned);
  document.getElementById("fv-growth-multiple").textContent =
    growthMultiple.toFixed(2) + "x";

  showResultSection("future-value", true);
}

// Calculate Present Value
function calculatePresentValue() {
  const allFilled = validateInputs(["pv-future-value", "pv-rate", "pv-years"]);
  if (!allFilled) return;
  const futureValue = getNumericValueFromText(
    document.getElementById("pv-future-value").value
  );
  const rate = parseFloat(document.getElementById("pv-rate").value);
  const years = parseFloat(document.getElementById("pv-years").value);

  const presentValue = futureValue / Math.pow(1 + rate / 100, years);
  const discount = futureValue - presentValue;

  document.getElementById("present-value-result").textContent =
    formatCurrency(presentValue);
  document.getElementById("pv-discount").textContent = formatCurrency(discount);

  showResultSection("present-value", true);
}

// Calculate Simple Interest
function calculateSimpleInterest() {
  const allFilled = validateInputs(["si-principal", "si-rate", "si-years"]);
  if (!allFilled) return;
  const principal = getNumericValueFromText(
    document.getElementById("si-principal").value
  );
  const rate = parseFloat(document.getElementById("si-rate").value);
  const years = parseFloat(document.getElementById("si-years").value);

  const simpleInterest = (principal * rate * years) / 100;
  const finalAmount = principal + simpleInterest;
  const totalReturnRate = (simpleInterest / principal) * 100;

  document.getElementById("si-interest").textContent =
    formatCurrency(simpleInterest);
  document.getElementById("si-final").textContent = formatCurrency(finalAmount);
  document.getElementById("si-total-rate").textContent =
    totalReturnRate.toFixed(2) + "%";
  showResultSection("simple-interest", true);
}

// Calculate Compound Interest
function calculateCompoundInterest() {
  const allFilled = validateInputs(["ci-principal", "ci-rate", "ci-years"]);
  if (!allFilled) return;
  const principal = getNumericValueFromText(
    document.getElementById("ci-principal").value
  );
  const rate = parseFloat(document.getElementById("ci-rate").value);
  const years = parseFloat(document.getElementById("ci-years").value);
  const frequency = parseInt(document.getElementById("ci-frequency").value, 10);

  const finalAmount =
    principal * Math.pow(1 + rate / 100 / frequency, frequency * years);
  const compoundInterest = finalAmount - principal;
  const effectiveRate = Math.pow(1 + rate / 100 / frequency, frequency) - 1;

  document.getElementById("ci-interest").textContent =
    formatCurrency(compoundInterest);
  document.getElementById("ci-final").textContent = formatCurrency(finalAmount);
  document.getElementById("ci-effective-rate").textContent =
    (effectiveRate * 100).toFixed(2) + "%";
  showResultSection("compound-interest", true);
}

// Toggle SIP step-up
function toggleSipStepup() {
  const stepupType = document.getElementById("sip-stepup-type").value;
  const group = document.getElementById("sip-stepup-group");
  if (stepupType === "fixed") {
    group.classList.remove("hide");
  } else {
    group.classList.add("hide");
  }
}

// Calculate SIP
function calculateSIP() {
  const allFilled = validateInputs(["sip-amount", "sip-rate", "sip-years"]);
  if (!allFilled) return;

  // Safe reads (handle missing elements)
  const initialEl = document.getElementById("sip-initial");
  const amountEl = document.getElementById("sip-amount");
  const rateEl = document.getElementById("sip-rate");
  const yearsEl = document.getElementById("sip-years");
  const stepupTypeEl = document.getElementById("sip-stepup-type");
  const stepupEl = document.getElementById("sip-stepup");

  // Parse inputs (use 0 defaults where appropriate)
  const initialInvestment = getNumericValueFromText(initialEl.value);
  const monthlyAmount = getNumericValueFromText(amountEl.value);
  const annualRate = parseFloat(rateEl.value);
  const years = parseFloat(yearsEl.value);
  const stepupType = stepupTypeEl.value;
  const stepupRate = stepupEl ? parseFloat(stepupEl.value) || 0 : 0;

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = Math.round(years * 12);

  let maturityAmount = 0;
  let totalInvestment = initialInvestment; // include initial in invested total
  let currentSIP = monthlyAmount;

  // 1) Compound the initial lump-sum for the entire period (if any)
  if (initialInvestment > 0) {
    // If monthlyRate is 0, compound factor is 1
    const initialFuture =
      initialInvestment * Math.pow(1 + monthlyRate, totalMonths);
    maturityAmount += initialFuture;
  }

  // 2) Compute contribution (SIP) future value
  if (monthlyRate === 0) {
    // simple sum when interest is 0
    if (stepupType === "none") {
      maturityAmount += monthlyAmount * totalMonths;
      totalInvestment += monthlyAmount * totalMonths;
    } else {
      // step-up each year but no growth
      for (let month = 1; month <= totalMonths; month++) {
        if (month > 1 && (month - 1) % 12 === 0) {
          currentSIP = currentSIP * (1 + stepupRate / 100);
        }
        maturityAmount += currentSIP;
        totalInvestment += currentSIP;
      }
    }
  } else {
    if (stepupType === "none") {
      // standard future value of series (end-of-period contributions)
      const factor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      // contributions assumed made at the end of each period; multiply by (1+monthlyRate) if contributions grow one extra period
      maturityAmount += monthlyAmount * factor * (1 + monthlyRate);
      totalInvestment += monthlyAmount * totalMonths;
    } else {
      // step-up logic: increase contribution annually and compound each contribution for its remaining months
      currentSIP = monthlyAmount;
      for (let month = 1; month <= totalMonths; month++) {
        if (month > 1 && (month - 1) % 12 === 0) {
          currentSIP = currentSIP * (1 + stepupRate / 100);
        }
        const remainingMonths = totalMonths - month + 1;
        maturityAmount +=
          currentSIP * Math.pow(1 + monthlyRate, remainingMonths);
        totalInvestment += currentSIP;
      }
    }
  }

  const totalReturns = maturityAmount - totalInvestment;

  // Write results
  document.getElementById("sip-maturity").textContent =
    formatCurrency(maturityAmount);
  document.getElementById("sip-invested").textContent =
    formatCurrency(totalInvestment);
  document.getElementById("sip-returns").textContent =
    formatCurrency(totalReturns);

  // Update chart and show result section
  createPieChart(
    "sipChart",
    ["Total Invested", "Returns"],
    [totalInvestment, Math.max(0, totalReturns)],
    ["#3b82f6", "#10b981"]
  );

  showResultSection("sip", true);
}

// Toggle SWP step-up
function toggleSwpStepup() {
  const stepupType = document.getElementById("swp-stepup-type").value;
  const group = document.getElementById("swp-stepup-group");
  if (stepupType === "fixed") {
    group.classList.remove("hide");
  } else {
    group.classList.add("hide");
  }
}

// Calculate SWP
function calculateSWP() {
  const allFilled = validateInputs([
    "swp-initial",
    "swp-withdrawal",
    "swp-rate",
    "swp-years",
  ]);
  if (!allFilled) return;
  const initialAmount = getNumericValueFromText(
    document.getElementById("swp-initial").value
  );
  const monthlyWithdrawal = getNumericValueFromText(
    document.getElementById("swp-withdrawal").value
  );
  const annualRate = parseFloat(document.getElementById("swp-rate").value);
  const years = parseFloat(document.getElementById("swp-years").value);
  const stepupType = document.getElementById("swp-stepup-type").value;
  const stepupRate =
    parseFloat(document.getElementById("swp-stepup").value) || 0;

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;
  let balance = initialAmount;
  let totalWithdrawn = 0;
  let currentWithdrawal = monthlyWithdrawal;

  for (let month = 1; month <= totalMonths; month++) {
    if (stepupType !== "none" && month > 1 && (month - 1) % 12 === 0) {
      currentWithdrawal = currentWithdrawal * (1 + stepupRate / 100);
    }
    balance = balance * (1 + monthlyRate) - currentWithdrawal;
    totalWithdrawn += currentWithdrawal;
    if (balance <= 0) {
      balance = 0;
      break;
    }
  }

  let tempBalance = initialAmount;
  let months = 0;
  let tempWithdrawal = monthlyWithdrawal;
  while (tempBalance > tempWithdrawal && months < 1200) {
    if (stepupType !== "none" && months > 0 && months % 12 === 0) {
      tempWithdrawal = tempWithdrawal * (1 + stepupRate / 100);
    }
    tempBalance = tempBalance * (1 + monthlyRate) - tempWithdrawal;
    months++;
  }

  document.getElementById("swp-balance").textContent = formatCurrency(
    Math.max(0, balance)
  );
  document.getElementById("swp-total-withdrawn").textContent =
    formatCurrency(totalWithdrawn);
  document.getElementById("swp-sustainability").textContent =
    (months / 12).toFixed(0) + " Years";

  createPieChart(
    "swpChart",
    ["Remaining Balance", "Total Withdrawn"],
    [Math.max(0, balance), totalWithdrawn],
    ["#3b82f6", "#ef4444"]
  );

  showResultSection("swp", true);
}

// Calculate Lumpsum
function calculateLumpsum() {
  const allFilled = validateInputs([
    "lumpsum-amount",
    "lumpsum-rate",
    "lumpsum-years",
  ]);
  if (!allFilled) return;
  const amount = getNumericValueFromText(
    document.getElementById("lumpsum-amount").value
  );
  const rate = parseFloat(document.getElementById("lumpsum-rate").value);
  const years = parseFloat(document.getElementById("lumpsum-years").value);

  const maturityValue = amount * Math.pow(1 + rate / 100, years);
  const returns = maturityValue - amount;
  const multiple = maturityValue / amount;

  document.getElementById("lumpsum-maturity").textContent =
    formatCurrency(maturityValue);
  document.getElementById("lumpsum-returns").textContent =
    formatCurrency(returns);
  document.getElementById("lumpsum-multiple").textContent =
    multiple.toFixed(2) + "x";

  createPieChart(
    "lumpsumChart",
    ["Principal Investment", "Returns"],
    [amount, returns],
    ["#3b82f6", "#10b981"]
  );
  showResultSection("lumpsum", true);
}

// Calculate CAGR
function calculateCAGR() {
  const allFilled = validateInputs([
    "cagr-initial",
    "cagr-final",
    "cagr-years",
  ]);
  if (!allFilled) return;

  const initialValue = getNumericValueFromText(
    document.getElementById("cagr-initial").value
  );
  const finalValue = parseFloat(document.getElementById("cagr-final").value);
  const years = parseFloat(document.getElementById("cagr-years").value);

  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  const returns = finalValue - initialValue;
  const multiple = finalValue / initialValue;

  document.getElementById("cagr-rate").textContent = cagr.toFixed(2) + "%";
  document.getElementById("cagr-returns").textContent = formatCurrency(returns);
  document.getElementById("cagr-multiple").textContent =
    multiple.toFixed(2) + "x";

  showResultSection("cagr", true);
}

// Calculate Emergency Fund
function calculateEmergencyFund() {
  const allFilled = validateInputs(["emergency-expense", "emergency-months"]);
  if (!allFilled) return;
  const expense = getNumericValueFromText(
    document.getElementById("emergency-expense").value
  );
  const months = parseFloat(document.getElementById("emergency-months").value);

  const fund = expense * months;

  document.getElementById("emergency-fund-result").textContent =
    formatCurrency(fund);
  document.getElementById(
    "emergency-fund-detail"
  ).textContent = `${months} months of expenses`;
}

function hasValidInputs(ids) {
  return ids.every((id) => {
    const el = document.getElementById(id);
    if (!el || el.value.trim() === "") return false;

    // Remove commas before checking if it's a valid number
    const numValue = getNumericValueFromText(el.value);
    return !isNaN(numValue) && numValue > 0;
  });
}

// ---------- Calculation logic ----------
function calculateAll() {
  // Loan EMI
  if (hasValidInputs(["loan-amount", "loan-rate", "loan-tenure"]))
    calculateLoanEMI();

  // Fixed Deposit
  if (hasValidInputs(["fd-principal", "fd-rate", "fd-years"])) calculateFD();

  // Recurring Deposit
  if (hasValidInputs(["rd-monthly", "rd-rate", "rd-years"])) calculateRD();

  // Inflation
  if (hasValidInputs(["inflation-amount", "inflation-rate", "inflation-years"]))
    calculateInflation();

  // Future Value
  if (hasValidInputs(["fv-present-value", "fv-rate", "fv-years"]))
    calculateFutureValue();

  // Present Value
  if (hasValidInputs(["pv-future-value", "pv-rate", "pv-years"]))
    calculatePresentValue();

  // Simple Interest
  if (hasValidInputs(["si-principal", "si-rate", "si-years"]))
    calculateSimpleInterest();

  // Compound Interest
  if (hasValidInputs(["ci-principal", "ci-rate", "ci-years"]))
    calculateCompoundInterest();

  // SIP
  const sipIds = ["sip-amount", "sip-rate", "sip-years"];
  if (!document.getElementById("sip-stepup-group").classList.contains("hide"))
    sipIds.push("sip-stepup");
  if (hasValidInputs(sipIds)) calculateSIP();

  // SWP
  const swpIds = ["swp-initial", "swp-withdrawal", "swp-rate", "swp-years"];
  if (!document.getElementById("swp-stepup-group").classList.contains("hide"))
    swpIds.push("swp-stepup");
  if (hasValidInputs(swpIds)) calculateSWP();

  // Lumpsum
  if (hasValidInputs(["lumpsum-amount", "lumpsum-rate", "lumpsum-years"]))
    calculateLumpsum();

  // CAGR
  if (hasValidInputs(["cagr-initial", "cagr-final", "cagr-years"]))
    calculateCAGR();

  // Emergency Fund
  if (hasValidInputs(["emergency-expense", "emergency-months"]))
    calculateEmergencyFund();

  if (
    hasValidInputs(["adv-initial-investment", "adv-interest-rate", "adv-years"])
  )
    calculateAdvancedInvestment();
}

// ---------- Calculate only active calculator ----------
function calculateActive(id) {
  switch (id) {
    case "loan-emi":
      if (hasValidInputs(["loan-amount", "loan-rate", "loan-tenure"]))
        calculateLoanEMI();
      break;
    case "fd":
      if (hasValidInputs(["fd-principal", "fd-rate", "fd-years"]))
        calculateFD();
      break;
    case "rd":
      if (hasValidInputs(["rd-monthly", "rd-rate", "rd-years"])) calculateRD();
      break;
    case "inflation":
      if (
        hasValidInputs([
          "inflation-amount",
          "inflation-rate",
          "inflation-years",
        ])
      )
        calculateInflation();
      break;
    case "future-value":
      if (hasValidInputs(["fv-present-value", "fv-rate", "fv-years"]))
        calculateFutureValue();
      break;
    case "present-value":
      if (hasValidInputs(["pv-future-value", "pv-rate", "pv-years"]))
        calculatePresentValue();
      break;
    case "simple-interest":
      if (hasValidInputs(["si-principal", "si-rate", "si-years"]))
        calculateSimpleInterest();
      break;
    case "compound-interest":
      if (hasValidInputs(["ci-principal", "ci-rate", "ci-years"]))
        calculateCompoundInterest();
      break;
    case "sip":
      const sipIds = ["sip-amount", "sip-rate", "sip-years"];
      if (
        !document.getElementById("sip-stepup-group").classList.contains("hide")
      )
        sipIds.push("sip-stepup");
      if (hasValidInputs(sipIds)) calculateSIP();
      break;
    case "swp":
      const swpIds = ["swp-initial", "swp-withdrawal", "swp-rate", "swp-years"];
      if (
        !document.getElementById("swp-stepup-group").classList.contains("hide")
      )
        swpIds.push("swp-stepup");
      if (hasValidInputs(swpIds)) calculateSWP();
      break;
    case "lumpsum":
      if (hasValidInputs(["lumpsum-amount", "lumpsum-rate", "lumpsum-years"]))
        calculateLumpsum();
      break;
    case "cagr":
      if (hasValidInputs(["cagr-initial", "cagr-final", "cagr-years"]))
        calculateCAGR();
      break;
    case "emergency-fund":
      if (hasValidInputs(["emergency-expense", "emergency-months"]))
        calculateEmergencyFund();
      break;
    case "investment-calculator":
      if (
        hasValidInputs([
          "adv-initial-investment",
          "adv-interest-rate",
          "adv-years",
        ])
      )
        calculateAdvancedInvestment();
      break;
    case "tax-calculator":
      if (hasValidInputs(["basic-annual"])) calculateTaxOnSalary();
      break;
  }
}

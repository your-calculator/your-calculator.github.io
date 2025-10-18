// XIRR Calculator Implementation

class XIRRCalculator {
  constructor() {
    this.transactions = [];
    this.xirrResult = null;
  }

  addTransaction(type, date, amount) {
    const normalizedAmount =
      type.toLowerCase() === "buy" ? -Math.abs(amount) : Math.abs(amount);

    this.transactions.push({
      type: type,
      date: new Date(date),
      amount: normalizedAmount,
      displayAmount: amount,
    });

    this.sortTransactions();
  }

  sortTransactions() {
    this.transactions.sort((a, b) => a.date - b.date);
  }

  daysBetween(date1, date2) {
    return (date2 - date1) / (1000 * 60 * 60 * 24);
  }

  parseDate(dateStr) {
    if (!dateStr) return null;

    const dmy = dateStr.match(/(\d{1,2})-([A-Z]{3})-(\d{4})/i);
    if (dmy) {
      const months = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11,
      };
      const day = parseInt(dmy[1]);
      const month = months[dmy[2].toLowerCase()];
      const year = parseInt(dmy[3]);
      return new Date(year, month, day);
    }

    const dmy2 = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{2})/);
    if (dmy2) {
      const day = parseInt(dmy2[1]);
      const month = parseInt(dmy2[2]) - 1;
      let year = parseInt(dmy2[3]);
      year = year < 50 ? 2000 + year : 1900 + year;
      return new Date(year, month, day);
    }

    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }

    return null;
  }

  // Helper: days between two dates
  daysBetween(d1, d2) {
    return (d2 - d1) / (1000 * 60 * 60 * 24);
  }

  // NPV function
  npv(rate) {
    const firstDate = this.transactions[0].date;
    return this.transactions.reduce((sum, t) => {
      const years = this.daysBetween(firstDate, t.date) / 365.25;
      return sum + t.amount / Math.pow(1 + rate, years);
    }, 0);
  }

  // Derivative of NPV w.r.t rate
  dNpv(rate) {
    const firstDate = this.transactions[0].date;
    return this.transactions.reduce((sum, t) => {
      const years = this.daysBetween(firstDate, t.date) / 365.25;
      const factor = Math.pow(1 + rate, years);
      return sum - (years * t.amount) / (factor * (1 + rate));
    }, 0);
  }

  calculateXIRR(guess = 0.1) {
    if (this.transactions.length < 2) {
      throw new Error("At least 2 transactions required");
    }
    const hasPositive = this.transactions.some((t) => t.amount > 0);
    const hasNegative = this.transactions.some((t) => t.amount < 0);
    if (!hasPositive || !hasNegative) {
      throw new Error("Need both positive and negative cash flows");
    }

    const maxIterations = 1000;
    const precision = 1e-7;
    const minRate = -0.9999; // Restrict to -99% minimum (avoid numerical singularity)

    // Step 1: Find initial bracket for bisection
    let low = -0.5; // Start well away from -100%
    let high = 10;
    let npvLow = this.npv(low);
    let npvHigh = this.npv(high);

    // Expand bracket if needed (but never below -99% or above 10000%)
    let bracketFound = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (!isFinite(npvLow) || !isFinite(npvHigh)) break; // Stop if NPV becomes invalid

      if (npvLow * npvHigh < 0) {
        bracketFound = true;
        break;
      }

      if (low > minRate) {
        low = Math.max(low * 2, minRate);
        npvLow = this.npv(low);
      } else {
        high *= 2;
        npvHigh = this.npv(high);
      }

      if (high > 1e27) {
        break; // Stop expanding at extreme limit
      }
    }

    if (!bracketFound) {
      // No valid bracket found, cap at -100% (minimum)
      this.xirrResult = minRate;
      return minRate * 100;
    }

    // Step 2: Bisection only (more stable than Newton-Raphson near boundaries)
    let rate = (low + high) / 2;

    for (let i = 0; i < maxIterations; i++) {
      rate = (low + high) / 2;
      const f = this.npv(rate);

      // Reject invalid NPV values or extreme rates
      if (!isFinite(f) || Math.abs(rate) > 100) {
        if (rate < 0) {
          high = rate; // Shrink from negative side
        } else {
          low = rate; // Shrink from positive side
        }
        continue;
      }

      // Check for convergence
      if (Math.abs(f) < precision) {
        this.xirrResult = rate;
        return rate * 100;
      }

      // Update bracket based on sign
      if (Math.sign(f) === Math.sign(npvLow)) {
        low = rate;
        npvLow = f;
      } else {
        high = rate;
        npvHigh = f;
      }

      // Safety: if bracket is too narrow, we've converged enough
      if (Math.abs(high - low) < 1e-10) {
        this.xirrResult = rate;
        return rate * 100;
      }
    }

    // Fallback: return last rate if not converged, capped to -99% minimum only
    rate = Math.max(rate, minRate);
    this.xirrResult = rate;
    return rate * 100;
  }

  clear() {
    this.transactions = [];
    this.xirrResult = null;
  }
}

// Helper: check if signs differ
function fLowSign(a, b) {
  return a * b < 0;
}

const xirrCalc = new XIRRCalculator();

function updateXIRRTable() {
  const wrapper = document.querySelector(".xirr-table-wrapper");
  const container = document.getElementById("xirrResultTable");

  if (xirrCalc.transactions.length === 0) {
    wrapper.classList.add("hide");
    return;
  }

  wrapper.classList.remove("hide");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.classList.add("amortization-table");

  const thead = document.createElement("thead");
  const headerRow = thead.insertRow();
  const headers = ["#", "Type", "Date", "Amount"];

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  const tbody = document.createElement("tbody");
  xirrCalc.transactions.forEach((transaction, index) => {
    const row = tbody.insertRow();
    row.insertCell().textContent = index + 1;
    row.insertCell().textContent = transaction.type;
    row.insertCell().textContent = transaction.date.toLocaleDateString("en-GB");
    row.insertCell().textContent = formatCurrency(transaction.displayAmount);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}
function calculateXIRR() {
  if (xirrCalc.transactions.length < 2) {
    showToast("At least 2 transactions required", "error");
    return;
  }

  // Check transaction summary
  const buys = xirrCalc.transactions.filter((t) => t.amount < 0);
  const sells = xirrCalc.transactions.filter((t) => t.amount > 0);
  const totalInvested = buys.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalRedeemed = sells.reduce((sum, t) => sum + t.amount, 0);

  console.log(`Buys: ${buys.length}, Sells: ${sells.length}`);
  console.log(`Total invested: ${totalInvested}`);
  console.log(`Total redeemed: ${totalRedeemed}`);

  // Handle unrealized position
  let tempTransaction = null;
  if (totalInvested > totalRedeemed) {
    const diff = totalInvested - totalRedeemed;
    const currentValueInput = document.getElementById("xirr-current-value");
    const currentValue = getNumericValueFromText(currentValueInput.value);
    xirrCalc.addTransaction("Sell", new Date(), currentValue, currentValue);
    tempTransaction = xirrCalc.transactions[xirrCalc.transactions.length - 1];
    currentValueInput.classList.remove("input-error");
  }

  try {
    const xirr = xirrCalc.calculateXIRR();
    console.log(xirr);
    document.getElementById("xirr-result").textContent = xirr.toFixed(2) + "%";
    document.querySelector("#xirr .result-section").classList.remove("hide");

    showToast("XIRR calculated successfully!", "success");
  } catch (error) {
    console.error(error);
    showToast(error.message, "error");
  } finally {
    // Remove temporary transaction
    if (tempTransaction) {
      const index = xirrCalc.transactions.indexOf(tempTransaction);
      if (index > -1) {
        xirrCalc.transactions.splice(index, 1);
      }
    }
  }
}

async function downloadXIRRTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("XIRR Template");

  sheet.columns = [
    { header: "Type", key: "type", width: 15 },
    { header: "Date", key: "date", width: 20 },
    { header: "Amount", key: "amount", width: 20 },
  ];

  sheet.addRow({
    type: "Buy",
    date: "01-JAN-2024",
    amount: 5000,
  });
  sheet.addRow({
    type: "Buy",
    date: "01-APR-2024",
    amount: 5000,
  });
  sheet.addRow({
    type: "Sell",
    date: "01-OCT-2024",
    amount: -11454,
  });
  sheet.addRow({
    type: "Other",
    date: "15-DEC-2024",
    amount: 0,
  });

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "xirr_template.xlsx";
  link.click();
  showToast("Template downloaded!", "success");
}

async function importXIRRTransactions(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const data = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);

    // Get first worksheet (use worksheets array or worksheet name)
    const sheet = workbook.worksheets[0];

    if (!sheet) {
      showToast("No worksheet found in file", "error");
      return;
    }

    // Get headers - ExcelJS row.values has undefined at index 0
    const headerRow = sheet.getRow(1);
    const headers = [];
    headerRow.eachCell((cell, colNumber) => {
      headers.push(cell.value?.toString().trim());
    });

    // Validate required columns
    if (
      !headers.includes("Type") ||
      !headers.includes("Date") ||
      !headers.includes("Amount")
    ) {
      showToast("Invalid file format. Please use the template.", "error");
      return;
    }

    // Find column indices
    const typeCol = headers.indexOf("Type") + 1;
    const dateCol = headers.indexOf("Date") + 1;
    const amountCol = headers.indexOf("Amount") + 1;

    xirrCalc.clear();
    let importedCount = 0;

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const type = row.getCell(typeCol).value?.toString().trim();
      const dateValue = row.getCell(dateCol).value;
      const amount = parseFloat(row.getCell(amountCol).value || 0);

      // Only process Buy/Sell transactions
      if (
        !type ||
        (type.toLowerCase() !== "buy" && type.toLowerCase() !== "sell")
      ) {
        return;
      }

      if (!amount || amount === 0) return;

      let date;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === "string") {
        date = xirrCalc.parseDate(dateValue);
      } else if (typeof dateValue === "number") {
        // Excel serial date
        date = new Date((dateValue - 25569) * 86400 * 1000);
      }

      if (date && !isNaN(date.getTime())) {
        xirrCalc.addTransaction(type, date, Math.abs(amount));
        importedCount++;
      }
    });

    updateXIRRTable();
    showToast(`Imported ${importedCount} transactions!`, "success");
  } catch (err) {
    console.error(err);
    showToast("Failed to import file. Please check the format.", "error");
  } finally {
    event.target.value = "";
  }
}

function clearXIRRTransactions() {
  xirrCalc.clear();
  updateXIRRTable();
  document.querySelector("#xirr .result-section").classList.add("hide");
  document.getElementById("xirr-current-value").value = "";
  document.getElementById("xirr-current-value").classList.remove("input-error");
  showToast("All transactions cleared", "success");
}

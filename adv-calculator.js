const MAX_SAFE_INTEGER = 100000000;
let inflationRate = 6;
let goalCounter = 1;
let shouldShowCompromiseDialog = true;

function initYearDropdown() {
  const years = ["investmentYear", "investmentYearOne", "investmentYearTwo"];
  const currentYear = getCurrentYear();

  years.forEach((el) => {
    const selectElement = document.getElementById(el);
    if (!selectElement) return; // safeguard if element not found

    for (let i = currentYear - 5; i <= currentYear + 50; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.text = i;

      if (i === currentYear) {
        option.selected = true;
      }

      selectElement.appendChild(option);
    }
  });
}

function validateNumericInput(input) {
  let value = input.value.replace(/\D/g, "");
  let formattedValue = Number(value).toLocaleString();
  input.value = formattedValue;
}

function validateNumericInputWithComma(input) {
  let value = input.value.replace(/[^0-9,]/g, "");
  input.value = value;
}

function addNoValueWarning() {
  const initialInvestmentInput = document.querySelector(".initialInvestment");
  initialInvestmentInput.classList.add("input-error");
  document
    .getElementById("toggleSIP")
    .parentElement.classList.add("input-error");
  // Focus the input
  initialInvestmentInput.focus();
}

function removeNoValueWarning() {
  document
    .getElementById("toggleSIP")
    .parentElement.classList.remove("input-error");
  document.querySelector(".initialInvestment").classList.remove("input-error");
}

function toggleSIP(suffix) {
  var rows = document.querySelectorAll(".sip" + suffix + "Rows");

  if (isChecked("toggleSIP" + suffix)) {
    rows.forEach(function (row) {
      removeNoValueWarning();
      row.classList.remove("hidden");
      toggleStepUpSIP(suffix);
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function toggleAdvSWP(suffix) {
  var table = document.querySelector(".swpTable");
  if (isChecked("swpAdv" + suffix)) {
    table.classList.remove("hidden");
  } else {
    table.classList.add("hidden");
  }
}

function toggleLumpsumWithdrawal(suffix) {
  var table = document.querySelector(".lumpsumWithdrawalTable" + suffix);

  if (isChecked("lumpsumWithdrawal" + suffix)) {
    table.classList.remove("hidden");
    if (document.querySelectorAll("#goalWithdrawalRows tr").length === 0) {
      addGoalRow(); // Add default goal row on enable
    }
  } else {
    table.classList.add("hidden");
  }
}

function showHideCombinedPortfolioDetails() {
  const parallelInvestment =
    isChecked("parallelInvestmentOneToggle") ||
    isChecked("parallelInvestmentTwoToggle");
  if (parallelInvestment) {
    showCombinedPortfolio();
  } else {
    hideCombinedPortfolio();
  }
}

function showCombinedPortfolio() {
  var resultOverview = document.querySelector(".combinedInvestmentOverview");
  var resultTable = document.querySelectorAll(".combined-table");
  resultOverview.classList.remove("hidden");
  resultTable.forEach((el) => {
    el.classList.remove("hidden");
  });
}

function hideCombinedPortfolio() {
  var resultOverview = document.querySelector(".combinedInvestmentOverview");
  var resultTable = document.querySelectorAll(".combined-table");
  resultOverview.classList.add("hidden");
  resultTable.forEach((el) => {
    el.classList.add("hidden");
  });
}

function toggleBonusSIP(suffix) {
  var rows = document.querySelectorAll(".bonusSip" + suffix + "Table");

  if (isOpted("bonusSIP" + suffix)) {
    rows.forEach(function (row) {
      row.classList.remove("hidden");
      if (suffix == "") toggleStepUpBonusSIP(suffix);
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function toggleStepUpSIP(suffix) {
  var rows = document.querySelectorAll(".sipStepUp" + suffix + "Rows");

  if (isOpted("stepUpSIP" + suffix)) {
    rows.forEach(function (row) {
      row.classList.remove("hidden");
      if (suffix == "") decreaseStepUp(suffix);
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function decreaseStepUp(suffix) {
  var rows = document.querySelectorAll(".decreaseStepUp" + suffix + "Rows");

  if (isOpted("decreaseStepUp" + suffix)) {
    rows.forEach(function (row) {
      row.classList.remove("hidden");
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function toggleDecreaseInterestRate(suffix) {
  var rows = document.querySelectorAll(".decreaseInterestRateRows" + suffix);

  if (isOpted("decreaseInterestRateToggle" + suffix)) {
    rows.forEach(function (row) {
      row.classList.remove("hidden");
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function toggleStopSip(suffix) {
  var rows = document.querySelectorAll(".stopSip" + suffix + "Rows");
  if (isOpted("stopSIP" + suffix)) {
    rows.forEach(function (row) {
      row.classList.remove("hidden");
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function toggleStepUpBonusSIP(suffix) {
  var rows = document.querySelectorAll(".bonusSipStepUp" + suffix + "Rows");

  if (isOpted("stepUpBonusSIP" + suffix)) {
    rows.forEach(function (row) {
      row.classList.remove("hidden");
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function toggleAdvSWPStepUp(suffix) {
  var rows = document.querySelectorAll(".withdrawalStepUp" + suffix + "Rows");

  if (isOpted("stepUpSWP" + suffix)) {
    rows.forEach(function (row) {
      row.classList.remove("hidden");
    });
  } else {
    rows.forEach(function (row) {
      row.classList.add("hidden");
    });
  }
}

function getSelectedValue(id) {
  var selectElement = document.getElementById(id);
  var selectedValue = Number(selectElement.value);
  return selectedValue;
}

function isChecked(id) {
  return document.getElementById(id).checked;
}

function isOpted(id) {
  const opted = getSelectedValue(id) != "0";
  return opted;
}

function setState(id, state) {
  const cb = document.getElementById(id);

  // force state
  cb.checked = !!state;

  // fire both input + change with bubbling so inline handler runs
  cb.dispatchEvent(new Event("input", { bubbles: true }));
  cb.dispatchEvent(new Event("change", { bubbles: true }));
}

function getYearsArray() {
  var inputElement = document.querySelector(".lumpsumwithdrawalYears");
  var inputValue = inputElement.value.trim();

  if (inputValue === "") {
    return [];
  }

  var yearsArray = inputValue.split(",").map(function (item) {
    return item.trim();
  });

  return yearsArray;
}

function showMonthlyData() {
  document.querySelector(".monthly-data").classList.remove("hidden");
  document.querySelector(".yearly-data").classList.add("hidden");
}

function showYearlyData() {
  document.querySelector(".monthly-data").classList.add("hidden");
  document.querySelector(".yearly-data").classList.remove("hidden");
}

async function downloadGoalTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Goals Template");

  sheet.columns = [
    { header: "Goal Name", key: "name", width: 30 },
    { header: "Year", key: "year", width: 15 },
    { header: "Amount Today", key: "amount", width: 20 },
  ];

  sheet.addRow(["Dream Home", new Date().getFullYear() + 5, 5000000]);
  sheet.addRow(["Car Purchase", new Date().getFullYear() + 2, 1000000]);

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "goals_template.xlsx";
  link.click();
  showToast("Goal Template downloaded!", "success");
}

function calculate(showConfirmation = true, showCompromiseDialog = true) {
  shouldShowCompromiseDialog = showCompromiseDialog; // Set the flag
  inflationRate = document.querySelector(".inflationRate").value;

  const startingYear = getNumericValue(".investmentYear");

  const initialInvestment = getNumericValue(".initialInvestment");

  const annualInterestRate = getNumericValue(".interestRate");

  const compoundingFrequency = getSelectedValue("compoundingFrequency");

  const decreaseInterestRate = isOpted("decreaseInterestRateToggle");

  const decreaseInterestRateAfterYears = getNumericValue(
    ".decreaseInterestRateAfterYears"
  );

  const decreaseInterestRateTo = getNumericValue(".updatedInterestRate");

  const years = getNumericValue(".years");

  const investmentFrequency = getSelectedValue("investmentFrequency");

  const sip = isChecked("toggleSIP");

  const sipAmount = getNumericValue(".sipAmount");

  const stepUpSip = isOpted("stepUpSIP");

  const stepUp = getSelectedValue("stepUpSIP");

  const stepUpIncrease = getNumericValue(".stepUpIncreasePercentage");

  const sipThreshold = getNumericValue(".sipThreshold");

  const decreaseStepUpPercent = isOpted("decreaseStepUp");

  const decreaseStepUpPercentAfterYears = getNumericValue(
    ".decreaseStepUpAfterYears"
  );

  const decreaseStepUpPercentTo = getNumericValue(".updatedStepUpPercentage");

  const stopSipAfterAPeriod = isOpted("stopSIP");

  const stopSipAfterYears = getNumericValue(".stopSipAfterYears");

  const systematicWithdrawalAfterAPeriod = isChecked("swpAdv");

  const systematicWithdrawalAfterYears = getNumericValue(
    ".withdrawalAfterYears"
  );

  const withdrawalPerMonth = getNumericValue(".withdrawalAmount");

  const withdrawalFrequency = getSelectedValue("withdrawalFrequency");

  const stepUpWithdrawal = isOpted("stepUpSWP");

  const stepUpWithdrawalFrequency = getSelectedValue(
    "withdrawalStepUpFrequency"
  );

  const stepUpWithdrawalIncrease = getNumericValue(
    ".withdrawalStepUpPercentage"
  );

  const bonusSip = isOpted("bonusSIP");

  const bonusSipAmount = getNumericValue(".bonusSipAmount");

  const bonusSipFrequency = getSelectedValue("bonusSipFrequency");

  const lumpSumWithdrawals = isChecked("lumpsumWithdrawal");

  const goalWithdrawals = getGoalWithdrawals(startingYear);

  const stepUpBonusSip = isOpted("stepUpBonusSIP");

  const stepUpBonusSipPercent = getNumericValue(".bonusSipStepUpPercentage");

  const stepUpBonusSipFrequency = getSelectedValue("bonusSipStepUpFrequency");

  const parallelInvestmentOne = isChecked("parallelInvestmentOneToggle");

  const startingYearOne = getNumericValue(".investmentYearOne");

  const initialInvestmentOne = getNumericValue(".initialInvestmentOne");

  const annualInterestRateOne = getNumericValue(".interestRateOne");

  const compoundingFrequencyOne = getSelectedValue("compoundingFrequencyOne");

  const decreaseInterestRateOne = isOpted("decreaseInterestRateToggleOne");

  const decreaseInterestRateAfterYearsOne = getNumericValue(
    ".decreaseInterestRateAfterYearsOne"
  );

  const decreaseInterestRateToOne = getNumericValue(".updatedInterestRateOne");

  const investmentOneFrequency = getSelectedValue("investmentOneFrequency");

  const sipOne = isChecked("toggleSIPOne");

  const sipOneAmount = getNumericValue(".sipOneAmount");

  const stepUpSipOne = isOpted("stepUpSIPOne");

  const stepUpOne = getSelectedValue("stepUpSIPOne");

  const stepUpIncreaseOne = getNumericValue(".stepUpOneIncreasePercentage");

  const stopSipOneAfterAPeriod = isOpted("stopSIPOne");

  const stopSipOneAfterYears = getNumericValue(".stopSipOneAfterYears");

  const parallelInvestmentTwo = isChecked("parallelInvestmentTwoToggle");

  const startingYearTwo = getNumericValue(".investmentYearTwo");

  const initialInvestmentTwo = getNumericValue(".initialInvestmentTwo");

  const annualInterestRateTwo = getNumericValue(".interestRateTwo");

  const compoundingFrequencyTwo = getSelectedValue("compoundingFrequencyTwo");

  const decreaseInterestRateTwo = isOpted("decreaseInterestRateToggleTwo");

  const decreaseInterestRateAfterYearsTwo = getNumericValue(
    ".decreaseInterestRateAfterYearsTwo"
  );

  const decreaseInterestRateToTwo = getNumericValue(".updatedInterestRateTwo");

  const investmentTwoFrequency = getSelectedValue("investmentTwoFrequency");

  const sipTwo = isChecked("toggleSIPTwo");

  const sipTwoAmount = getNumericValue(".sipTwoAmount");

  const stepUpSipTwo = isOpted("stepUpSIPTwo");

  const stepUpTwo = getSelectedValue("stepUpSIPTwo");

  const stepUpIncreaseTwo = getNumericValue(".stepUpTwoIncreasePercentage");

  const stopSipTwoAfterAPeriod = isOpted("stopSIPTwo");

  const stopSipTwoAfterYears = getNumericValue(".stopSipTwoAfterYears");

  document
    .querySelectorAll("#goalWithdrawalRows tr.goal-compromised")
    .forEach((row) => row.classList.remove("goal-compromised"));
  sortGoals();

  calculateCompoundInterestAdv(
    startingYear,
    initialInvestment,
    annualInterestRate,
    compoundingFrequency,
    decreaseInterestRate,
    decreaseInterestRateAfterYears,
    decreaseInterestRateTo,
    years,
    sip,
    investmentFrequency,
    sipAmount,
    stepUpSip,
    stepUp,
    stepUpIncrease,
    sipThreshold,
    decreaseStepUpPercent,
    decreaseStepUpPercentAfterYears,
    decreaseStepUpPercentTo,
    stopSipAfterAPeriod,
    stopSipAfterYears,
    systematicWithdrawalAfterAPeriod,
    systematicWithdrawalAfterYears,
    withdrawalPerMonth,
    stepUpWithdrawal,
    stepUpWithdrawalFrequency,
    stepUpWithdrawalIncrease,
    bonusSip,
    bonusSipAmount,
    bonusSipFrequency,
    lumpSumWithdrawals,
    goalWithdrawals,
    stepUpBonusSip,
    stepUpBonusSipPercent,
    stepUpBonusSipFrequency,
    parallelInvestmentOne,
    startingYearOne,
    initialInvestmentOne,
    annualInterestRateOne,
    compoundingFrequencyOne,
    decreaseInterestRateOne,
    decreaseInterestRateAfterYearsOne,
    decreaseInterestRateToOne,
    investmentOneFrequency,
    sipOne,
    sipOneAmount,
    stepUpSipOne,
    stepUpOne,
    stepUpIncreaseOne,
    stopSipOneAfterAPeriod,
    stopSipOneAfterYears,
    parallelInvestmentTwo,
    startingYearTwo,
    initialInvestmentTwo,
    annualInterestRateTwo,
    compoundingFrequencyTwo,
    decreaseInterestRateTwo,
    decreaseInterestRateAfterYearsTwo,
    decreaseInterestRateToTwo,
    investmentTwoFrequency,
    sipTwo,
    sipTwoAmount,
    stepUpSipTwo,
    stepUpTwo,
    stepUpIncreaseTwo,
    stopSipTwoAfterAPeriod,
    stopSipTwoAfterYears
  );

  formatInputFieldValues();
  saveInputs();
  // if (showConfirmation) showToast("Calculations Done. Enjoy!", "success");

  if (showConfirmation) scrollToResultSection();
}

class InvestmentHistory {
  constructor(
    year,
    month,
    sipAmount,
    principalForTheMonth,
    interestForTheMonth,
    totalInterest,
    totalAmount
  ) {
    this.year = year;
    this.month = month;
    this.sipAmount = sipAmount;
    this.principalForTheMonth = principalForTheMonth;
    this.interestForTheMonth = interestForTheMonth;
    this.totalInterest = totalInterest;
    this.totalAmount = totalAmount;
  }
}

const STEP_UP_TYPE = {
  NONE: 0,
  QUARTERLY: 3,
  HALF_YEARLY: 6,
  YEARLY: 12,
};

const INVESTMENT_FREQUENCY = {
  MONTHLY: 1,
  QUARTERLY: 3,
  HALF_YEARLY: 6,
  YEARLY: 12,
};

function getPeriodicRate(annualRate, compoundingPerYear) {
  return annualRate / compoundingPerYear;
}

function calculateEAR(nominalRate, compoundingPerYear) {
  const r = nominalRate / 100;
  return (Math.pow(1 + r / compoundingPerYear, compoundingPerYear) - 1) * 100;
}

function calculateCompoundInterestAdv(
  startingYear,
  initialInvestment,
  annualInterestRate,
  compoundingPerYear,
  decreaseInterestRate,
  decreaseInterestRateAfterYears,
  decreaseInterestRateTo,
  years,
  sip,
  investmentFrequency,
  sipAmount,
  stepUpSip,
  stepUp,
  stepUpIncrease,
  sipThreshold,
  decreaseStepUpPercent,
  decreaseStepUpPercentAfterYears,
  decreaseStepUpPercentTo,
  stopSipAfterAPeriod,
  stopSipAfterYears,
  systematicWithdrawalAfterAPeriod,
  systematicWithdrawalAfterYears,
  withdrawalPerMonth,
  stepUpWithdrawal,
  stepUpWithdrawalFrequency,
  stepUpWithdrawalIncrease,
  bonusSip,
  bonusSipAmount,
  bonusSipFrequency,
  lumpSumWithdrawals,
  goalWithdrawals,
  stepUpBonusSip,
  stepUpBonusSipPercent,
  stepUpBonusSipFrequency,
  parallelInvestmentOne,
  startingYearOne,
  initialInvestmentOne,
  annualInterestRateOne,
  compoundingPerYearOne,
  decreaseInterestRateOne,
  decreaseInterestRateAfterYearsOne,
  decreaseInterestRateToOne,
  investmentOneFrequency,
  sipOne,
  sipOneAmount,
  stepUpSipOne,
  stepUpOne,
  stepUpIncreaseOne,
  stopSipOneAfterAPeriod,
  stopSipOneAfterYears,
  parallelInvestmentTwo,
  startingYearTwo,
  initialInvestmentTwo,
  annualInterestRateTwo,
  compoundingPerYearTwo,
  decreaseInterestRateTwo,
  decreaseInterestRateAfterYearsTwo,
  decreaseInterestRateToTwo,
  investmentTwoFrequency,
  sipTwo,
  sipTwoAmount,
  stepUpSipTwo,
  stepUpTwo,
  stepUpIncreaseTwo,
  stopSipTwoAfterAPeriod,
  stopSipTwoAfterYears
) {
  console.log(
    "************************************************************************************"
  );
  const totalMonths = years * 12;
  stopSipAfterYears = years >= stopSipAfterYears ? stopSipAfterYears : years;
  stopSipOneAfterYears =
    years >= stopSipOneAfterYears ? stopSipOneAfterYears : years;
  stopSipTwoAfterYears =
    years >= stopSipTwoAfterYears ? stopSipTwoAfterYears : years;

  let periodicRate = getPeriodicRate(annualInterestRate, compoundingPerYear);
  let totalDeposits = initialInvestment;
  let totalAmount = initialInvestment;
  let totalInterest = 0;
  let totalWithdrawals = 0;
  let totalSWP = 0;
  let totalSWPYears = 0;
  let netDeposit = 0;
  let currentYear = startingYear;
  let currentYearOne = startingYearOne;
  let currentYearTwo = startingYearTwo;
  let monthCounter = 0;
  let frequencyCounter = 0;
  const sipFrequency = getSipFrequency(investmentFrequency);
  const stopSipAfterMonths = stopSipAfterYears * 12;
  const startWithdrawalAfterMonths = systematicWithdrawalAfterYears * 12;
  let withdrawalFrequencyCounter = 0;
  const withdrawalFrequency = getStepUpFrequency(stepUpWithdrawalFrequency);
  const monthlyInvestmentHistory = [];
  const goalsCount = goalWithdrawals.length;
  let totalGoalBasedWithdrawalAmount = 0;
  let shortfallMessages = [];
  let swpCompromised = false;
  let swpCompromisedMsg = "";

  let decreasedStepUp = false;

  // Secondary investment variables
  let totalDepositsOne = initialInvestmentOne;
  let totalAmountOne = initialInvestmentOne;
  let totalInterestOne = 0;
  let periodicRateOne = getPeriodicRate(
    annualInterestRateOne,
    compoundingPerYearOne
  );
  let monthCounterOne = 0;
  let frequencyCounterOne = 0;
  const sipFrequencyOne = parallelInvestmentOne
    ? getSipFrequency(investmentOneFrequency)
    : 0;
  const stopSipAfterMonthsOne = stopSipOneAfterYears * 12;
  const monthlyInvestmentHistoryOne = []; // Track parallel investment history

  // Terniary investment variables
  let totalDepositsTwo = initialInvestmentTwo;
  let totalAmountTwo = initialInvestmentTwo;
  let totalInterestTwo = 0;
  let periodicRateTwo = getPeriodicRate(
    annualInterestRateTwo,
    compoundingPerYearTwo
  );
  let monthCounterTwo = 0;
  let frequencyCounterTwo = 0;
  const sipFrequencyTwo = parallelInvestmentTwo
    ? getSipFrequency(investmentTwoFrequency)
    : 0;
  const stopSipAfterMonthsTwo = stopSipTwoAfterYears * 12;
  const monthlyInvestmentHistoryTwo = []; // Track parallel investment history

  // Determine the bonus SIP frequency in months
  const bonusSipFreq = getStepUpFrequency(bonusSipFrequency);
  const stepUpBonusSipFreq = getStepUpFrequency(stepUpBonusSipFrequency);

  if (initialInvestment !== 0) {
    monthlyInvestmentHistory.push(
      new InvestmentHistory(
        currentYear - 1,
        0,
        0,
        initialInvestment,
        0,
        0,
        initialInvestment
      )
    );
  }

  if (parallelInvestmentOne && initialInvestmentOne !== 0) {
    monthlyInvestmentHistoryOne.push(
      new InvestmentHistory(
        currentYearOne - 1,
        0,
        0,
        initialInvestmentOne,
        0,
        0,
        initialInvestmentOne
      )
    );
  }

  if (parallelInvestmentTwo && initialInvestmentTwo !== 0) {
    monthlyInvestmentHistoryTwo.push(
      new InvestmentHistory(
        currentYearTwo - 1,
        0,
        0,
        initialInvestmentTwo,
        0,
        0,
        initialInvestmentTwo
      )
    );
  }

  let compoundingCounter = 0;

  for (let i = 1; i <= totalMonths; i++) {
    compoundingCounter++;

    // Decrease interest rate after certain years
    if (
      decreaseInterestRate &&
      currentYear >= startingYear + decreaseInterestRateAfterYears
    ) {
      periodicRate = getPeriodicRate(
        decreaseInterestRateTo,
        compoundingPerYear
      );
    }

    // --- SIP contribution ---
    let sipForThisMonth = 0;
    if (
      sip &&
      frequencyCounter === 0 &&
      (!stopSipAfterAPeriod || i <= stopSipAfterMonths)
    ) {
      sipForThisMonth = sipAmount;
    }

    // --- Bonus SIP contribution ---
    if (
      sip &&
      bonusSip &&
      i % bonusSipFreq === 0 &&
      (!stopSipAfterAPeriod || i <= stopSipAfterMonths)
    ) {
      sipForThisMonth += bonusSipAmount;
    }

    // --- Systematic Withdrawal (SWP) ---

    let withdrawalForThisMonth = 0;
    let swpThisMonth = 0;
    let goalWithdrawalThisMonth = 0;

    // 1. Inflate SWP amount each year until SWP actually starts
    if (systematicWithdrawalAfterAPeriod && i <= startWithdrawalAfterMonths) {
      if (i % 12 === 0) {
        withdrawalPerMonth = Math.round(
          withdrawalPerMonth * (1 + inflationRate / 100)
        );
      }
    }

    // 2. Once SWP starts, begin withdrawals
    if (systematicWithdrawalAfterAPeriod && i > startWithdrawalAfterMonths) {
      const allowedWithdrawal = Math.min(withdrawalPerMonth, totalAmount);

      withdrawalForThisMonth -= allowedWithdrawal;
      swpThisMonth = allowedWithdrawal;

      if (allowedWithdrawal < withdrawalPerMonth) {
        console.warn(
          `Year ${currentYear} - Month ${i % 12 || 12}: ` +
            `Systematic Withdrawal of ₹${withdrawalPerMonth.toLocaleString()} ` +
            `capped to available ₹${totalAmount.toLocaleString()}`
        );

        if (!swpCompromised) {
          swpCompromised = true;
          swpCompromisedMsg =
            `SWP is compromised from Year ${currentYear} - Month ${
              i % 12 || 12
            } onwards.<br>` +
            `Systematic Withdrawal of ₹${withdrawalPerMonth.toLocaleString()} ` +
            `capped to available ₹${totalAmount.toLocaleString()}<br>` +
            `Please increase the investments or reduce the SWPs to meet the SWP goal.`;
        }
      }
    }

    // --- Goal-based withdrawals ---
    let monthlyGoals = goalWithdrawals.filter((goal) => goal.monthIndex === i);
    let lumpSumWithdrawal = monthlyGoals.reduce(
      (sum, goal) => sum + goal.inflatedAmount,
      0
    );

    if (lumpSumWithdrawals && lumpSumWithdrawal > 0) {
      const allowedWithdrawal = Math.min(lumpSumWithdrawal, totalAmount);
      const shortfall = Math.abs(allowedWithdrawal - lumpSumWithdrawal);

      withdrawalForThisMonth -= allowedWithdrawal;
      goalWithdrawalThisMonth = allowedWithdrawal;

      if (allowedWithdrawal < lumpSumWithdrawal) {
        console.warn(
          `Month ${i}: Goal Compromised. Goal withdrawals capped to available ₹${totalAmount}. Details:`
        );
        monthlyGoals.forEach((goal) => {
          console.warn(
            `Goal: "${goal.name}", Requested: ₹${goal.inflatedAmount}, Shortfall: ₹${shortfall}`
          );

          shortfallMessages.push(
            `Year ${currentYear}: Withdrawals capped to available ₹${totalAmount}.`,
            `Goal: "${goal.name}", Requested: ₹${goal.inflatedAmount}, Shortfall: ₹${shortfall}<br/>`
          );

          const row = document.querySelector(
            `#goalWithdrawalRows tr:nth-child(${goal.index + 1})`
          );
          if (row) row.classList.add("goal-compromised");
        });
      }
    }

    // --- Update totals ONCE here ---
    totalSWP += swpThisMonth;
    totalWithdrawals += swpThisMonth + goalWithdrawalThisMonth;

    if (sipThreshold == 0) sipThreshold = MAX_SAFE_INTEGER;
    // --- Apply deposits/withdrawals ---
    sipForThisMonth = Math.round(Math.min(sipThreshold, sipForThisMonth));
    totalDeposits += sipForThisMonth;
    totalAmount += sipForThisMonth + withdrawalForThisMonth;

    // --- Interest calculation ---
    let interestThisStep = 0;
    if (compoundingCounter === 12 / compoundingPerYear) {
      const interestForThePeriod = Math.round(
        (totalAmount * periodicRate) / 100
      );
      totalInterest += interestForThePeriod;
      totalAmount += interestForThePeriod;
      interestThisStep = interestForThePeriod;
      compoundingCounter = 0;
    }

    // --- Record history ---
    monthlyInvestmentHistory.push(
      new InvestmentHistory(
        currentYear,
        i,
        sipForThisMonth + withdrawalForThisMonth,
        totalDeposits,
        interestThisStep,
        totalInterest,
        totalAmount
      )
    );

    // --- Counters ---
    monthCounter++;
    frequencyCounter = (frequencyCounter + 1) % sipFrequency;
    withdrawalFrequencyCounter =
      (withdrawalFrequencyCounter + 1) % withdrawalFrequency;

    if (i % 12 === 0) {
      currentYear++;
    }

    // --- Step-up SIP ---
    if (sip && stepUpSip && stepUp !== STEP_UP_TYPE.NONE) {
      const stepUpFrequency = getStepUpFrequency(stepUp);
      if (monthCounter === stepUpFrequency) {
        if (
          decreaseStepUpPercent &&
          currentYear > startingYear + decreaseStepUpPercentAfterYears &&
          !decreasedStepUp
        ) {
          stepUpIncrease = decreaseStepUpPercentTo;
          decreasedStepUp = true;
        }
        sipAmount += sipAmount * (stepUpIncrease / 100);
        sipAmount = Math.round(sipAmount);
        monthCounter = 0;
      }
    }

    // --- Step-up SWP ---
    if (
      stepUpWithdrawal &&
      systematicWithdrawalAfterAPeriod &&
      withdrawalFrequencyCounter === 0 &&
      i > startWithdrawalAfterMonths
    ) {
      withdrawalPerMonth +=
        withdrawalPerMonth * (stepUpWithdrawalIncrease / 100);
      withdrawalPerMonth = Math.round(withdrawalPerMonth);
    }

    // --- Step-up Bonus SIP ---
    if (
      sip &&
      bonusSip &&
      stepUpBonusSip &&
      i % stepUpBonusSipFreq === 0 &&
      (!stopSipAfterAPeriod || i <= stopSipAfterMonths)
    ) {
      bonusSipAmount += bonusSipAmount * (stepUpBonusSipPercent / 100);
      bonusSipAmount = Math.round(bonusSipAmount);
    }
  }
  let details = "";
  if (shortfallMessages.length > 0) {
    details =
      "<strong>Goals Compromised</strong><br/><br/>" +
      shortfallMessages.join("<br/>");
  }

  if (swpCompromised) {
    details +=
      `<br/>⚠️ <strong>SWP Compromised</strong><br/><br>` + swpCompromisedMsg;
  }

  if (
    (shortfallMessages.length > 0 || swpCompromised) &&
    shouldShowCompromiseDialog
  )
    showCustomDialog(details, "warning");

  // Parallel investment 1 calculations (SIP, Step-up, Stop SIP logic)
  if (parallelInvestmentOne) {
    let compoundingCounterOne = 0;
    for (let i = 1; i <= totalMonths; i++) {
      compoundingCounterOne++;
      if (
        decreaseInterestRateOne &&
        currentYearOne >= startingYearOne + decreaseInterestRateAfterYearsOne
      ) {
        // Switch to the reduced interest rate
        monthlyInterestRateOne = decreaseInterestRateToOne / 12;
      }
      let sipForThisMonthOne = 0;
      if (
        i <= totalMonths &&
        sipOne &&
        frequencyCounterOne === 0 &&
        (!stopSipOneAfterAPeriod || i <= stopSipAfterMonthsOne)
      ) {
        sipForThisMonthOne = sipOneAmount;
      }
      // Apply SIP first
      totalDepositsOne += sipForThisMonthOne;
      totalAmountOne += sipForThisMonthOne;

      let interestThisStepOne = 0;

      // Interest only when compounding period is reached
      if (compoundingCounterOne === 12 / compoundingPerYearOne) {
        const interestForThePeriodOne = Math.round(
          (totalAmountOne * periodicRateOne) / 100
        );
        totalInterestOne += interestForThePeriodOne;
        totalAmountOne += interestForThePeriodOne;
        interestThisStepOne = interestForThePeriodOne; // record interest applied this month
        compoundingCounterOne = 0;
      }

      // Record monthly data for parallel investment
      monthlyInvestmentHistoryOne.push(
        new InvestmentHistory(
          currentYearOne,
          i,
          sipForThisMonthOne,
          totalDepositsOne,
          interestThisStepOne, // ✅ only non-zero on compounding months
          totalInterestOne,
          totalAmountOne
        )
      );

      monthCounterOne++;
      if (i % 12 === 0) {
        currentYearOne++;
      }
      // Step-up logic for parallel investment SIP
      if (sipOne && stepUpSipOne && stepUpOne !== STEP_UP_TYPE.NONE) {
        const stepUpFrequencyOne = getStepUpFrequency(stepUpOne);
        if (monthCounterOne === stepUpFrequencyOne) {
          sipOneAmount += sipOneAmount * (stepUpIncreaseOne / 100);
          sipOneAmount = Math.round(sipOneAmount);
          monthCounterOne = 0;
        }
      }
      frequencyCounterOne = (frequencyCounterOne + 1) % sipFrequencyOne;
    }
  }

  // Parallel investment 2 calculations (SIP, Step-up, Stop SIP logic)
  if (parallelInvestmentTwo) {
    let compoundingCounterTwo = 0;
    for (let i = 1; i <= totalMonths; i++) {
      compoundingCounterTwo++;
      if (
        decreaseInterestRateTwo &&
        currentYearTwo >= startingYearTwo + decreaseInterestRateAfterYearsTwo
      ) {
        // Switch to the reduced interest rate
        monthlyInterestRateTwo = decreaseInterestRateToTwo / 12;
      }
      let sipForThisMonthTwo = 0;
      if (
        i <= totalMonths &&
        sipTwo &&
        frequencyCounterTwo === 0 &&
        (!stopSipTwoAfterAPeriod || i <= stopSipAfterMonthsTwo)
      ) {
        sipForThisMonthTwo = sipTwoAmount;
      }

      // Apply SIP first
      totalDepositsTwo += sipForThisMonthTwo;
      totalAmountTwo += sipForThisMonthTwo;

      let interestThisStepTwo = 0;

      // Interest only when compounding period is reached
      if (compoundingCounterTwo === 12 / compoundingPerYearTwo) {
        const interestForThePeriodTwo = Math.round(
          (totalAmountTwo * periodicRateTwo) / 100
        );
        totalInterestTwo += interestForThePeriodTwo;
        totalAmountTwo += interestForThePeriodTwo;
        interestThisStepTwo = interestForThePeriodTwo; // record interest applied this month
        compoundingCounterTwo = 0;
      }

      // Record monthly data for parallel investment
      monthlyInvestmentHistoryTwo.push(
        new InvestmentHistory(
          currentYearTwo,
          i,
          sipForThisMonthTwo,
          totalDepositsTwo,
          interestThisStepTwo, // ✅ only non-zero on compounding months
          totalInterestTwo,
          totalAmountTwo
        )
      );

      monthCounterTwo++;
      if (i % 12 === 0) {
        currentYearTwo++;
      }
      // Step-up logic for parallel investment SIP
      if (sipTwo && stepUpSipTwo && stepUpTwo !== STEP_UP_TYPE.NONE) {
        const stepUpFrequencyTwo = getStepUpFrequency(stepUpTwo);
        if (monthCounterTwo === stepUpFrequencyTwo) {
          sipTwoAmount += sipTwoAmount * (stepUpIncreaseTwo / 100);
          sipTwoAmount = Math.round(sipTwoAmount);
          monthCounterTwo = 0;
        }
      }
      frequencyCounterTwo = (frequencyCounterTwo + 1) % sipFrequencyTwo;
    }
  }
  logGrowthTable(monthlyInvestmentHistory);

  console.log();

  const yearlyInvestmentHistory = aggregateYearlyInvestmentHistory(
    monthlyInvestmentHistory
  );
  logGrowthTable(yearlyInvestmentHistory);
  let yearlyInvestmentOneHistory = [];
  if (parallelInvestmentOne) {
    yearlyInvestmentOneHistory = aggregateYearlyInvestmentHistory(
      monthlyInvestmentHistoryOne
    );
    logGrowthTable(yearlyInvestmentOneHistory);
  }

  let yearlyInvestmentTwoHistory = [];
  if (parallelInvestmentTwo) {
    yearlyInvestmentTwoHistory = aggregateYearlyInvestmentHistory(
      monthlyInvestmentHistoryTwo
    );
    logGrowthTable(yearlyInvestmentTwoHistory);
  }

  let activeSipYears = 0;
  if (sip) {
    if (stopSipAfterAPeriod) activeSipYears = stopSipAfterYears;
    else activeSipYears = years;
  } else {
    activeSipYears = 0;
  }

  let activeSipYearsOne = 0;
  if (sipOne) {
    if (stopSipOneAfterAPeriod) activeSipYearsOne = stopSipOneAfterYears;
    else activeSipYearsOne = years;
  } else {
    activeSipYearsOne = 0;
  }

  let activeSipYearsTwo = 0;
  if (sipTwo) {
    if (stopSipTwoAfterAPeriod) activeSipYearsTwo = stopSipTwoAfterYears;
    else activeSipYearsTwo = years;
  } else {
    activeSipYearsTwo = 0;
  }

  const presentValueOfFutureMoney = calculatePresentValueOfFutureMoney(
    currentYear - getCurrentYear(),
    totalAmount,
    inflationRate
  );

  netDeposit = totalDeposits - totalWithdrawals;

  // Primary
  const earPrimary = calculateEAR(annualInterestRate, compoundingPerYear);

  // Secondary
  const earSecondary = parallelInvestmentOne
    ? calculateEAR(annualInterestRateOne, compoundingPerYearOne)
    : 0;

  // Tertiary
  const earTertiary = parallelInvestmentTwo
    ? calculateEAR(annualInterestRateTwo, compoundingPerYearTwo)
    : 0;

  // Combined (weighted EAR)
  let earCombined = 0;
  if (parallelInvestmentOne || parallelInvestmentTwo) {
    const totalPrincipal =
      initialInvestment + initialInvestmentOne + initialInvestmentTwo;

    const weightedEar =
      (earPrimary * initialInvestment +
        earSecondary * initialInvestmentOne +
        earTertiary * initialInvestmentTwo) /
      totalPrincipal;

    earCombined = weightedEar;
  }

  console.log();
  console.log(
    "************************************************************************************"
  );
  console.log("Total Deposit: ₹" + totalDeposits);
  console.log("Total Withdrawal: ₹" + totalWithdrawals);
  console.log("Net Deposit: ₹" + netDeposit);
  console.log("Total Interest Earned: ₹" + totalInterest);
  console.log("Future Investment Value: ₹" + totalAmount);
  console.log("Present Value of Future Money: ₹" + presentValueOfFutureMoney);
  console.log("Total No of Years: " + years);
  console.log("Total No of Years with Active SIP: " + activeSipYears);
  console.log(
    "Total No of Years with Active SWP: " +
      (systematicWithdrawalAfterAPeriod
        ? years - systematicWithdrawalAfterYears
        : 0)
  );
  console.log("Total Systematic Withdrawal: ₹" + totalSWP);
  console.log("Total No Lumpsum Withdrawals: " + goalsCount);
  if (goalsCount > 0) {
    goalWithdrawals.forEach((goal, index) => {
      console.log(
        `  ${index + 1}. ${goal.name} - Year: ${goal.year}, Month: ${
          goal.monthIndex
        }, Amount: ₹${goal.inflatedAmount}, Original: ₹${goal.amountToday}`
      );
    });
  }
  console.log(
    "************************************************************************************"
  );

  // currency formatter (reuse your own if you already have one)
  const formatCurrency = (num) =>
    "₹ " + Number(num || 0).toLocaleString("en-IN");

  // future value
  document.querySelector(".futureInvestmentValue").textContent =
    formatCurrency(totalAmount);

  // inflation-adjusted FV
  document.querySelector(".presentValueOfFutureMoney").textContent =
    formatCurrency(presentValueOfFutureMoney);

  // deposits / withdrawals / interest
  document.querySelector(".totalDeposit").textContent =
    formatCurrency(totalDeposits);
  document.querySelector(".totalWithdrawal").textContent =
    formatCurrency(totalWithdrawals);
  document.querySelector(".totalInterest").textContent =
    formatCurrency(totalInterest);

  // effective annual rates
  document.querySelector(".combinedEar").textContent =
    earCombined.toFixed(2) + " %";
  document.querySelector(".ear").textContent = earPrimary.toFixed(2) + " %";

  // inflation labels
  document.querySelectorAll(".inflation").forEach((el) => {
    el.textContent = inflationRate;
  });

  // years
  document.querySelector(".noOfYears").textContent = years;
  document.querySelector(".noOfYearsSip").textContent = activeSipYears;

  // SWP
  totalSWPYears = systematicWithdrawalAfterAPeriod
    ? years - systematicWithdrawalAfterYears
    : 0;
  document.querySelector(".totalSWPAmount").textContent =
    formatCurrency(totalSWP);
  document.querySelector(".noOfYearsSwp").textContent = totalSWPYears;

  // Goal withdrawals
  document.querySelectorAll(".noOfLumpsumWithdrawals").forEach((el) => {
    el.textContent = goalsCount;
  });

  totalGoalBasedWithdrawalAmount = goalWithdrawals.reduce(
    (sum, g) => sum + g.inflatedAmount,
    0
  );
  document.querySelectorAll(".totalLumpsumWithdrawalAmount").forEach((el) => {
    el.textContent = formatCurrency(totalGoalBasedWithdrawalAmount);
  });

  document.querySelector(".earOne").textContent =
    earSecondary.toFixed(2) + " %";
  document.querySelector(".earTwo").textContent = earTertiary.toFixed(2) + " %";
  createMonthlyResultTable(
    monthlyInvestmentHistory,
    "monthlyResultTable",
    "Primary Investment"
  );
  createYearlyResultTable(
    yearlyInvestmentHistory,
    "yearlyResultTable",
    "Primary Investment"
  );

  const parallelInvestment = parallelInvestmentOne || parallelInvestmentTwo;

  hideExtraInfoForPrimaryInvestment(
    sip,
    systematicWithdrawalAfterAPeriod && totalSWPYears > 0,
    lumpSumWithdrawals && totalGoalBasedWithdrawalAmount > 0,
    parallelInvestment
  );

  function logGrowthTable(investMentHistory) {
    for (const investmentDetails of investMentHistory) {
      console.debug(
        `${investmentDetails.year}\t${investmentDetails.sipAmount}\t${investmentDetails.principalForTheMonth}\t${investmentDetails.interestForTheMonth}\t${investmentDetails.totalInterest}\t${investmentDetails.totalAmount}`
      );
    }
  }

  updateInvestmentResults(
    parallelInvestmentOne,
    totalDepositsOne,
    totalInterestOne,
    totalAmountOne,
    years,
    activeSipYearsOne,
    monthlyInvestmentHistoryOne,
    yearlyInvestmentOneHistory,
    "One",
    "Secondary Investment"
  );
  updateInvestmentResults(
    parallelInvestmentTwo,
    totalDepositsTwo,
    totalInterestTwo,
    totalAmountTwo,
    years,
    activeSipYearsTwo,
    monthlyInvestmentHistoryTwo,
    yearlyInvestmentTwoHistory,
    "Two",
    "Secondary Investment"
  );

  const combinedMonthly = [];
  for (let i = 0; i <= totalMonths; i++) {
    const m1 = monthlyInvestmentHistory[i];
    const m2 = monthlyInvestmentHistoryOne[i];
    const m3 = monthlyInvestmentHistoryTwo[i];
    if (m1 || m2 || m3) {
      combinedMonthly.push(
        new InvestmentHistory(
          m1?.year || m2?.year || m3?.year,
          i,
          (m1?.sipAmount || 0) + (m2?.sipAmount || 0) + (m3?.sipAmount || 0),
          (m1?.principalForTheMonth || 0) +
            (m2?.principalForTheMonth || 0) +
            (m3?.principalForTheMonth || 0),
          (m1?.interestForTheMonth || 0) +
            (m2?.interestForTheMonth || 0) +
            (m3?.interestForTheMonth || 0),
          (m1?.totalInterest || 0) +
            (m2?.totalInterest || 0) +
            (m3?.totalInterest || 0),
          (m1?.totalAmount || 0) +
            (m2?.totalAmount || 0) +
            (m3?.totalAmount || 0)
        )
      );
    }
  }
  const combinedYearly = aggregateYearlyInvestmentHistory(combinedMonthly);

  if (parallelInvestment) {
    createMonthlyResultTable(
      combinedMonthly,
      "monthlyResultTableForCombinedView",
      "Combined Investment"
    );
    createYearlyResultTable(
      combinedYearly,
      "yearlyResultTableForCombinedView",
      "Combined Investment"
    );
  }

  updateCombinedPortfolioResults(
    parallelInvestment,
    parallelInvestmentOne,
    parallelInvestmentTwo,
    totalDeposits,
    totalWithdrawals,
    totalSWP,
    totalSWPYears,
    totalDepositsOne,
    totalDepositsTwo,
    totalInterest,
    totalInterestOne,
    totalInterestTwo,
    totalAmount,
    totalAmountOne,
    totalAmountTwo,
    years,
    activeSipYears,
    activeSipYearsOne,
    activeSipYearsTwo
  );

  // document.querySelector(".right-div-container").classList.remove("hidden");
  document.getElementById("yearly-data").classList.add("active");
  document.getElementById("monthly-data").classList.remove("active");
  showYearlyData();
  showHideCombinedPortfolioDetails();
  hideExtraInfoForCombinedInvestment(
    sip ||
      (parallelInvestmentOne && sipOne) ||
      (parallelInvestmentTwo && sipTwo),
    systematicWithdrawalAfterAPeriod,
    lumpSumWithdrawals,
    parallelInvestment
  );
}

function createMonthlyResultTable(
  monthlyInvestmentHistory,
  tableContainerId,
  tableHeader
) {
  createResultTable(
    monthlyInvestmentHistory,
    tableContainerId,
    tableHeader,
    "Month"
  );
}

function createYearlyResultTable(
  yearlyInvestmentHistory,
  tableContainerId,
  tableHeader
) {
  createResultTable(
    yearlyInvestmentHistory,
    tableContainerId,
    tableHeader,
    "Year"
  );
}

function createResultTable(
  investmentHistory,
  tableContainerId,
  tableHeader,
  timeUnit
) {
  const tableContainer = document.getElementById(tableContainerId);

  // Clear previous content
  tableContainer.innerHTML = "";

  // Create and append header
  const headerDiv = document.createElement("div");
  headerDiv.className = "resultHeader";
  headerDiv.textContent = tableHeader;
  tableContainer.appendChild(headerDiv);

  // Create wrapper for table
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "amortization-table-wrapper";

  // Create table
  const table = document.createElement("table");
  table.classList.add("amortization-table");

  // Create table head
  const thead = document.createElement("thead");
  const headerRow = thead.insertRow();
  const headers = [
    { text: timeUnit, class: "" },
    { text: "Deposit", class: "desktop-only" },
    { text: "Total Deposits", class: "" },
    { text: "Interest", class: "desktop-only" },
    { text: "Accrued Interest", class: "" },
    { text: "Balance", class: "" },
  ];

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header.text;
    if (header.class) {
      th.className = header.class;
    }
    headerRow.appendChild(th);
  });

  // Create table body
  const tbody = document.createElement("tbody");
  investmentHistory.forEach((details) => {
    const row = tbody.insertRow();
    if (details.month !== 0 && details.month % 12 === 0) {
      row.classList.add("highlight");
    }
    // Column 1: Year/Month
    row.insertCell().textContent =
      timeUnit === "Month" ? details.month : details.year;
    // Column 2: Deposit (desktop-only)
    appendCellWithHtml(row, details.sipAmount, "desktop-only");
    // Column 3: Total Deposits
    appendCellWithHtml(row, details.principalForTheMonth);
    // Column 4: Interest (desktop-only)
    appendCellWithHtml(row, details.interestForTheMonth, "desktop-only");
    // Column 5: Accrued Interest
    appendCellWithHtml(row, details.totalInterest);
    // Column 6: Balance
    appendCellWithHtml(row, details.totalAmount);
  });

  // Assemble table
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapperDiv.appendChild(table);

  // Render in container
  tableContainer.appendChild(wrapperDiv);
  tableContainer.classList.remove("hidden");
}

function appendCellWithHtml(row, data, className = "") {
  const cell = row.insertCell();
  if (className) {
    cell.className = className;
  }
  if (data !== undefined) {
    const formattedData = formatIndianNumberFromData(data);

    if (data < 0) {
      cell.innerHTML = `
        <div class="resultNumberWrapper red">
          <div>(</div>
          <div class="container">
            <div class="pWrapper"><p>&#8377;</p></div>
          </div>
          <div class="resultNumber">${formattedData}</div>
          <div>)</div>
        </div>
      `;
    } else {
      cell.innerHTML = `
        <div class="resultNumberWrapper green">
          <div class="container">
            <div class="pWrapper"><p>&#8377;</p></div>
          </div>
          <div class="resultNumber">${formattedData}</div>
        </div>
      `;
    }
  }
}

function getStepUpFrequency(stepUp) {
  switch (stepUp) {
    case 3: // Quarterly
      return 3;
    case 6: // Half yearly
      return 6;
    case 12: // Yearly
      return 12;
    default:
      return Number.MAX_SAFE_INTEGER;
  }
}

function getSipFrequency(frequency) {
  switch (frequency) {
    case 3: // Quarterly
      return 3;
    case 6: // Half yearly
      return 6;
    case 12: // Yearly
      return 12;
    default:
      return 1; // Monthly
  }
}

function aggregateYearlyInvestmentHistory(monthlyInvestmentHistory) {
  const yearlyInvestmentMap = new Map();

  for (const monthlyInvestment of monthlyInvestmentHistory) {
    const year = monthlyInvestment.year;
    if (!yearlyInvestmentMap.has(year)) {
      yearlyInvestmentMap.set(
        year,
        new InvestmentHistory(year, 0, 0, 0, 0, 0, 0)
      );
    }

    const yearlyInvestment = yearlyInvestmentMap.get(year);

    yearlyInvestment.sipAmount += monthlyInvestment.sipAmount;
    yearlyInvestment.principalForTheMonth =
      monthlyInvestment.principalForTheMonth;
    yearlyInvestment.interestForTheMonth +=
      monthlyInvestment.interestForTheMonth;
    yearlyInvestment.totalInterest = monthlyInvestment.totalInterest;
    yearlyInvestment.totalAmount = monthlyInvestment.totalAmount;
  }

  return Array.from(yearlyInvestmentMap.values());
}

function formatInputFieldValues() {
  const inputElements = document.querySelectorAll(
    'input[type="text"]:not(.goalName):not(#searchInput)'
  );

  inputElements.forEach((input) => {
    let value = input.value.replace(/[^\d]/g, "");

    if (!value) {
      input.value = "0";
      return;
    }

    // Indian-style formatting
    if (value.length <= 3) {
      input.value = value;
    } else {
      const lastThree = value.slice(-3);
      const remaining = value.slice(0, -3);
      const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
      input.value = formatted + "," + lastThree;
    }
  });
}

function updateInvestmentResults(
  isActive,
  totalDeposits,
  totalInterest,
  totalAmount,
  years,
  activeSipYears,
  monthlyInvestmentHistory,
  yearlyInvestmentHistory,
  suffix,
  header
) {
  if (isActive) {
    createMonthlyResultTable(
      monthlyInvestmentHistory,
      "monthlyResultTableForParallelInvestment" + suffix,
      header
    );
    createYearlyResultTable(
      yearlyInvestmentHistory,
      "yearlyResultTableForParallelInvestment" + suffix,
      header
    );

    const presentValueOfFutureMoney = calculatePresentValueOfFutureMoney(
      years,
      totalAmount,
      inflationRate
    );

    console.log(
      "\n************************************************************************************"
    );
    console.log("Total Parallel Deposit " + suffix + ": ₹" + totalDeposits);
    console.log(
      "Total Interest Earned in Parallel Investment " +
        suffix +
        ": ₹" +
        totalInterest
    );
    console.log(
      "Future Investment Value of Parallel Investment " +
        suffix +
        ": ₹" +
        totalAmount
    );
    console.log(
      "Present Value of Future Money (Parallel Investment " +
        suffix +
        "): ₹" +
        presentValueOfFutureMoney
    );
    console.log(
      "Total No of Years in Parallel Investment " + suffix + ": " + years
    );
    console.log(
      "Total No of Years with Active SIP in Parallel Investment " +
        suffix +
        ": " +
        activeSipYears
    );
    console.log(
      "************************************************************************************"
    );

    // currency formatter (if not already defined globally)
    const formatCurrency = (num) =>
      "₹ " + Number(num || 0).toLocaleString("en-IN");

    // Update deposits / interest
    document.querySelector(".totalDeposit" + suffix).textContent =
      formatCurrency(totalDeposits);
    document.querySelector(".totalInterest" + suffix).textContent =
      formatCurrency(totalInterest);

    // Update future value
    document.querySelector(".futureInvestment" + suffix + "Value").textContent =
      formatCurrency(totalAmount);

    // Inflation-adjusted future value
    document.querySelector(
      ".presentValueOfFutureMoneyParallelInvestment" + suffix + "Value"
    ).textContent = formatCurrency(presentValueOfFutureMoney);

    // Years
    document.querySelector(".noOfYears" + suffix).textContent = years;
    document.querySelector(".noOfYearsSip" + suffix).textContent =
      activeSipYears;

    if (activeSipYears <= 0) {
      document.querySelector(".showSIP" + suffix).classList.add("hidden");
    } else {
      document.querySelector(".showSIP" + suffix).classList.remove("hidden");
    }

    showParallelInvestmentResult(suffix);
  } else {
    hideParallelInvestmentResult(suffix);
  }
}

// Function to update combined portfolio results
function updateCombinedPortfolioResults(
  parallelInvestment,
  parallelInvestmentOne,
  parallelInvestmentTwo,
  totalDeposits,
  totalWithdrawals,
  totalSWP,
  totalSWPYears,
  totalDepositsOne,
  totalDepositsTwo,
  totalInterest,
  totalInterestOne,
  totalInterestTwo,
  totalAmount,
  totalAmountOne,
  totalAmountTwo,
  years,
  activeSipYears,
  activeSipYearsOne,
  activeSipYearsTwo
) {
  if (parallelInvestment) {
    const combinedDeposit = totalDeposits + totalDepositsOne + totalDepositsTwo;
    const totalCombinedInterestEarned =
      totalInterest +
      (parallelInvestmentOne ? totalInterestOne : 0) +
      (parallelInvestmentTwo ? totalInterestTwo : 0);
    const totalFutureInvestmentValue =
      totalAmount +
      (parallelInvestmentOne ? totalAmountOne : 0) +
      (parallelInvestmentTwo ? totalAmountTwo : 0);
    const combinedSipYears = Math.max(
      activeSipYears,
      parallelInvestmentOne ? activeSipYearsOne : 0,
      parallelInvestmentTwo ? activeSipYearsTwo : 0
    );

    const presentValueOfFutureMoney = calculatePresentValueOfFutureMoney(
      years,
      totalFutureInvestmentValue,
      inflationRate
    );

    console.log(
      "\n************************************************************************************"
    );
    console.log("Total Combined Deposit: ₹" + combinedDeposit);
    console.log(
      "Total Combined Interest Earned: ₹" + totalCombinedInterestEarned
    );
    console.log(
      "Combined Future Investment Value: ₹" + totalFutureInvestmentValue
    );
    console.log(
      "Combined Future Investment Value: ₹" + presentValueOfFutureMoney
    );
    console.log("Total Combined No of Years: " + years);
    console.log(
      "Total Combined No of Years with Active SIP: " + combinedSipYears
    );
    console.log(
      "************************************************************************************"
    );

    // currency formatter
    const formatCurrency = (num) =>
      "₹ " + Number(num || 0).toLocaleString("en-IN");

    document.querySelector(".combinedTotalDeposit").textContent =
      formatCurrency(combinedDeposit);
    document.querySelector(".combinedTotalWithdrawal").textContent =
      formatCurrency(totalWithdrawals);
    document.querySelector(".combinedTotalSWPAmount").textContent =
      formatCurrency(totalSWP);
    document.querySelector(".combinedNoOfYearsSwp").textContent = totalSWPYears;
    document.querySelector(".combinedTotalInterest").textContent =
      formatCurrency(totalCombinedInterestEarned);
    document.querySelector(".combinedFutureInvestmentValue").textContent =
      formatCurrency(totalFutureInvestmentValue);
    document.querySelector(".combinedPresentValueOfFutureMoney").textContent =
      formatCurrency(presentValueOfFutureMoney);

    document.querySelector(".combinedNoOfYears").textContent = years;
    document.querySelector(".combinedNoOfYearsSip").textContent =
      combinedSipYears;

    document.querySelectorAll(".individualYears").forEach((el) => {
      el.classList.add("hidden");
    });
  } else {
    document.querySelector(".primaryYears").classList.remove("hidden");
  }
}

function showParallelInvestmentResult(suffix) {
  var resultTable = document.querySelector(
    ".parallelInvestment" + suffix + "Overview"
  );
  resultTable.classList.remove("hidden");
}

function hideParallelInvestmentResult(suffix) {
  var resultTable = document.querySelector(
    ".parallelInvestment" + suffix + "Overview"
  );
  var monthlyResult = document.getElementById(
    "monthlyResultTableForParallelInvestment" + suffix
  );
  var yearlyResult = document.getElementById(
    "yearlyResultTableForParallelInvestment" + suffix
  );
  resultTable.classList.add("hidden");
  monthlyResult.classList.add("hidden");
  yearlyResult.classList.add("hidden");
}

function toggleParallelInvestment(suffix) {
  const toggle = document.getElementById(
    "parallelInvestment" + suffix + "Toggle"
  );
  const table = document.querySelector(
    ".parallelInvestment" + suffix + "Table"
  );

  if (toggle && table) {
    if (toggle.checked) {
      table.classList.remove("hidden");
    } else {
      table.classList.add("hidden");
    }
  }
}

function hideExtraInfoForPrimaryInvestment(
  sip,
  systematicWithdrawalAfterAPeriod,
  lumpSumWithdrawals,
  parallelInvestment
) {
  if (sip) {
    document.getElementById("showNoOfYearsSip").classList.remove("hidden");
  } else {
    document.getElementById("showNoOfYearsSip").classList.add("hidden");
  }

  if (systematicWithdrawalAfterAPeriod) {
    document.querySelector(".showNoOfYearsSwp").classList.remove("hidden");
    document.querySelector(".showIndividualSWP").classList.remove("hidden");
  } else {
    document.querySelector(".showNoOfYearsSwp").classList.add("hidden");
    document.querySelector(".showIndividualSWP").classList.add("hidden");
  }

  if (lumpSumWithdrawals) {
    document.querySelectorAll(".lumpsumOverview").forEach((el) => {
      el.classList.remove("hidden");
    });
  } else {
    document.querySelectorAll(".lumpsumOverview").forEach((el) => {
      el.classList.add("hidden");
    });
  }

  if (lumpSumWithdrawals && systematicWithdrawalAfterAPeriod) {
    document
      .querySelector(".showIndividualWithdrawal")
      .classList.remove("hidden");
  } else {
    document.querySelector(".showIndividualWithdrawal").classList.add("hidden");
  }

  if (parallelInvestment) {
    document.querySelector(".showIndividualWithdrawal").classList.add("hidden");
    document.querySelector(".showNoOfYearsSwp").classList.add("hidden");
    document.querySelector(".showIndividualSWP").classList.add("hidden");
    document.querySelectorAll(".lumpsumOverview").forEach((el) => {
      el.classList.add("hidden");
    });
  }
}

function hideExtraInfoForCombinedInvestment(
  sip,
  systematicWithdrawalAfterAPeriod,
  lumpSumWithdrawals,
  parallelInvestment
) {
  if (sip) {
    document.querySelector(".showCombinedSIPYears").classList.remove("hidden");
  } else {
    document.querySelector(".showCombinedSIPYears").classList.add("hidden");
  }

  if (systematicWithdrawalAfterAPeriod) {
    document
      .querySelector(".showCombinedNoOfYearsSwp")
      .classList.remove("hidden");
    document.querySelector(".showCombinedSWP").classList.remove("hidden");
  } else {
    document.querySelector(".showCombinedNoOfYearsSwp").classList.add("hidden");
    document.querySelector(".showCombinedSWP").classList.add("hidden");
  }

  if (lumpSumWithdrawals) {
    document.querySelectorAll(".combinedLumpsumOverview ").forEach((el) => {
      el.classList.remove("hidden");
    });
  } else {
    document.querySelectorAll(".combinedLumpsumOverview ").forEach((el) => {
      el.classList.add("hidden");
    });
  }

  if (lumpSumWithdrawals && systematicWithdrawalAfterAPeriod) {
    document
      .querySelector(".showCombinedWithdrawal")
      .classList.remove("hidden");
  } else {
    document.querySelector(".showCombinedWithdrawal").classList.add("hidden");
  }

  if (parallelInvestment) {
    document.querySelector(".showIndividualWithdrawal").classList.add("hidden");
    document.querySelector(".showIndividualSWP").classList.add("hidden");
    document.querySelector(".showNoOfYearsSwp").classList.add("hidden");
    document.querySelectorAll(".lumpsumOverview").forEach((el) => {
      el.classList.add("hidden");
    });
  }
}

function calculatePresentValueOfFutureMoney(n, fv, inflationRate) {
  const r = inflationRate / 100;
  const pv = Math.round(fv / (1 + r) ** n);

  console.log("Future Value: " + fv);
  console.log("Inflation Rate: " + inflationRate + "%");
  console.log("Years: " + n);
  console.log("Present Value: " + pv);
  return pv;
}

function getCurrentYear() {
  return new Date().getFullYear();
}
function resetForm() {
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
      key === "goalCounter" ||
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

  const goalsTbody = document.getElementById("goalWithdrawalRows");
  if (goalsTbody) {
    goalsTbody.innerHTML = "";
  }

  goalCounter = 1;
  location.reload();
}

function scrollToResultSection() {
  document.querySelector(".results-section")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function scrollToTop(duration = 400) {
  const start = window.scrollY;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / 0, 1); // clamp 0 → 1

    window.scrollTo(0, start * (1 - progress));

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

function removeGoalRow(button) {
  const row = button.closest("tr");
  const tbody = document.getElementById("goalWithdrawalRows");

  if (tbody.rows.length <= 1) {
    row.remove();
    document.querySelector(".lumpsumWithdrawalTable").classList.add("hidden");
    setState("lumpsumWithdrawal", false);
    goalCounter = 1;
    saveInputs();
    return;
  }

  row.remove();
  showToast("Goal removed successfully!", "success");
  saveInputs();
}

function generateGoalYearOptions(selectedYear) {
  const start = new Date().getFullYear();
  let options = "";
  for (let y = start; y <= start + 50; y++) {
    options += `<option value="${y}" ${
      y == selectedYear ? "selected" : ""
    }>${y}</option>`;
  }
  return options;
}

async function downloadExcelReport() {
  const workbook = new ExcelJS.Workbook();

  // === 1. Portfolio Overview (Merged into One Sheet) ===
  const overviewTables = [
    {
      selector: ".combinedInvestmentOverview",
      label: "Combined Investment Overview",
    },
    { selector: ".investmentOverview", label: "Investment Overview" },
    {
      selector: ".parallelInvestmentOneOverview",
      label: "Secondary Investment Overview",
    },
    {
      selector: ".parallelInvestmentTwoOverview",
      label: "Tertiary Investment Overview",
    },
  ];

  const overviewSheet = workbook.addWorksheet("Portfolio Overview");

  overviewTables.forEach(({ selector, label }) => {
    const el = document.querySelector(selector);
    if (el && !el.classList.contains("hidden")) {
      console.log("Table Not Hidden: " + label);
      const tableRows = extractOverviewTableData(el);

      // Insert section header first (bold)
      const headerRow = overviewSheet.addRow([label]);
      headerRow.font = { bold: true };

      // Then add all rows
      tableRows.forEach((row) => {
        const added = overviewSheet.addRow(row);
        if (row.length > 1) {
          added.getCell(2).alignment = { horizontal: "right" };
        }
      });

      overviewSheet.addRow([]); // spacer
    } else {
      console.log("Table Hidden: " + label);
    }
  });

  autoFitSheetColumns(overviewSheet);

  // === 2. Investment Result Tables (One Sheet Each) ===
  const groupedTables = [
    {
      name: "Combined Investment",
      yearly: "yearlyResultTableForCombinedView",
      monthly: "monthlyResultTableForCombinedView",
    },
    {
      name: "Primary Investment",
      yearly: "yearlyResultTable",
      monthly: "monthlyResultTable",
    },
    {
      name: "Secondary Investment",
      yearly: "yearlyResultTableForParallelInvestmentOne",
      monthly: "monthlyResultTableForParallelInvestmentOne",
      check: ".parallelInvestmentOneOverview",
    },
    {
      name: "Tertiary Investment",
      yearly: "yearlyResultTableForParallelInvestmentTwo",
      monthly: "monthlyResultTableForParallelInvestmentTwo",
      check: ".parallelInvestmentTwoOverview",
    },
  ];

  groupedTables.forEach(({ name, yearly, monthly, check }) => {
    const checkEl = check ? document.querySelector(check) : null;
    if (checkEl && checkEl.classList.contains("hidden")) return;

    const yearlyEl = document.getElementById(yearly);
    const monthlyEl = document.getElementById(monthly);

    if (
      (!yearlyEl || yearlyEl.classList.contains("hidden")) &&
      (!monthlyEl || monthlyEl.classList.contains("hidden"))
    ) {
      return; // skip if both hidden
    }

    const sheet = workbook.addWorksheet(name);

    // --- Yearly first ---
    if (yearlyEl && !yearlyEl.classList.contains("hidden")) {
      const yearlyData = extractResultTableData(yearlyEl);

      // Section header
      const secHeader = sheet.addRow([name + " - Yearly"]);
      secHeader.font = { bold: true };
      sheet.addRow([]); // spacer row before table headers

      // Table headers
      const headers = yearlyData[0].map((c) => c.value);
      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "right" }; // ✅ align all header cells right

      // Data rows
      yearlyData.slice(1).forEach((row) => {
        const added = sheet.addRow(row.map((c) => c.value));
        row.forEach((cellData, index) => {
          const cell = added.getCell(index + 1);
          if (typeof cellData.value === "number") {
            cell.numFmt = "#,##0";
            if (cellData.isNegative) {
              cell.font = { color: { argb: "FFFF0000" } };
            }
          }
          cell.alignment = { horizontal: "right" }; // ✅ data also right aligned
        });
      });
      sheet.addRow([]);
    }

    // --- Monthly next ---
    if (monthlyEl && !monthlyEl.classList.contains("hidden")) {
      const monthlyData = extractResultTableData(monthlyEl);

      const secHeader = sheet.addRow([name + " - Monthly"]);
      secHeader.font = { bold: true };
      sheet.addRow([]);

      const headers = monthlyData[0].map((c) => c.value);
      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: "right" }; // ✅ align headers right

      monthlyData.slice(1).forEach((row) => {
        const added = sheet.addRow(row.map((c) => c.value));
        row.forEach((cellData, index) => {
          const cell = added.getCell(index + 1);
          if (typeof cellData.value === "number") {
            cell.numFmt = "#,##0";
            if (cellData.isNegative) {
              cell.font = { color: { argb: "FFFF0000" } };
            }
          }
          cell.alignment = { horizontal: "right" }; // ✅ align data right
        });
      });
    }

    autoFitSheetColumns(sheet);
  });

  // === 3. Export Workbook ===
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "Investment_Calculations.xlsx");
  showToast("Investment Results exported successfully!", "success");
}

function extractOverviewTableData(container) {
  const rows = [];

  const trs = container.querySelectorAll("tr");
  if (trs.length > 0) {
    // Table-style extraction
    trs.forEach((tr) => {
      const row = [];
      tr.querySelectorAll("th, td").forEach((cell) => {
        const input = cell.querySelector("input");
        if (input) {
          const value = input.value?.trim() || input.placeholder || "";
          const hasSymbol = !!cell
            .querySelector("p")
            ?.textContent?.includes("₹");
          row.push(hasSymbol ? "₹ " + value : value);
        } else {
          const text = cell.innerText.replace(/₹/g, "").trim();
          row.push(text);
        }
      });
      if (row.length > 0) rows.push(row);
    });
  } else {
    // Grid-style extraction (.statCard inside .investmentOverviewGrid)
    const cards = container.querySelectorAll(
      ".investmentOverviewGrid .statCard"
    );
    cards.forEach((card) => {
      const label = card.querySelector(".label")?.innerText.trim() || "";
      const value = card.querySelector(".value")?.innerText.trim() || "";
      if (label || value) rows.push([label, value]);
    });
  }

  return rows;
}

function extractResultTableData(tableEl) {
  const rows = [];
  tableEl.querySelectorAll("tr").forEach((tr) => {
    const row = [];
    tr.querySelectorAll("th, td").forEach((cell) => {
      let value = null;
      let isNegative = false;

      const numberWrapper = cell.querySelector(".resultNumberWrapper");
      if (numberWrapper) {
        const numText =
          numberWrapper.querySelector(".resultNumber")?.innerText || "";
        let clean = numText.replace(/,/g, "").trim();

        if (clean && !isNaN(clean)) {
          isNegative = numberWrapper.classList.contains("red");
          value = isNegative ? -parseFloat(clean) : parseFloat(clean);
        }
      }

      if (value === null) {
        let text = cell.innerText.replace(/₹/g, "").replace(/\s+/g, " ").trim();
        const num = parseFloat(text.replace(/,/g, ""));
        if (!isNaN(num) && text !== "") {
          value = num;
          if (/^\(.*\)$/.test(text)) isNegative = true; // accounting style
        } else {
          value = text; // header/label
        }
      }

      row.push({ value, isNegative });
    });
    if (row.length > 0) rows.push(row);
  });
  return rows;
}

function autoFitSheetColumns(sheet) {
  if (!sheet || !sheet.columns) return;

  sheet.columns.forEach((column) => {
    if (!column) return;
    let maxLength = 10;

    column.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.value != null) {
        const value = cell.value.toString();
        const columnLength = value.length;
        if (columnLength > maxLength) maxLength = columnLength;

        // ✅ If numeric, apply Excel number formatting with commas
        if (typeof cell.value === "number") {
          cell.numFmt = "#,##0"; // adds commas, no decimals
        }
      }
    });

    column.width = maxLength + 2;
  });
}
async function removeAllGoals() {
  const userConfirmed = await showCustomDialog(
    "Are you sure you want to remove all goals?",
    "warning"
  );

  if (userConfirmed) {
    const tbody = document.getElementById("goalWithdrawalRows");
    tbody.innerHTML = "";
    goalCounter = 1;

    const lumpsumTable = document.querySelector(".lumpsumWithdrawalTable");
    if (lumpsumTable) {
      lumpsumTable.classList.add("hidden");
    }

    setState("lumpsumWithdrawal", false);
    saveInputs();
    showToast("All goals removed successfully!", "success");
  }
}

function addGoalRow(
  name = `Goal ${goalCounter}`,
  year = getNumericValue(".investmentYear") + 2,
  amount = 50000,
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
  goalCounter++;
  if (toast) {
    showToast("Goal added successfully!", "success");
  }
}

function moveGoalRowUp(button) {
  const row = button.closest("tr");
  const prev = row.previousElementSibling;
  if (prev) {
    row.parentNode.insertBefore(row, prev);
  }
}

function moveGoalRowDown(button) {
  const row = button.closest("tr");
  const next = row.nextElementSibling;
  if (next) {
    row.parentNode.insertBefore(next, row);
  }
}

function getGoalWithdrawals(startingYear) {
  const rows = document.querySelectorAll("#goalWithdrawalRows tr");
  const goals = [];

  rows.forEach((row, idx) => {
    const nameInput = row.querySelector(".goalName");
    const yearInput = row.querySelector(".goalYear");
    const amountInput = row.querySelector(".goalAmount");

    if (!nameInput || !yearInput || !amountInput) return;
    const name = nameInput.value.trim();
    const year = parseInt(yearInput.value.replace(/,/g, "") || "0", 10);
    const amountToday = parseFloat(amountInput.value.replace(/,/g, "") || "0");

    console.log("Amount Today: " + amountToday);
    if (name && !isNaN(year) && !isNaN(amountToday)) {
      const yearsUntilGoal = year - startingYear + 1;
      console.log("startingYear (type):", startingYear, typeof startingYear);
      console.log("goal year (type):", year, typeof year);
      console.log("Year Until Goal: " + yearsUntilGoal);
      if (yearsUntilGoal >= 0) {
        const inflatedAmount = Math.round(
          amountToday * Math.pow(1 + inflationRate / 100, yearsUntilGoal)
        );
        const monthIndex = yearsUntilGoal * 12;

        goals.push({
          index: idx,
          name,
          year,
          amountToday,
          inflationRate,
          inflatedAmount,
          monthIndex,
        });
      }
    }
  });

  return goals;
}

function sortGoals() {
  const table = document.getElementById("goalWithdrawalRows");
  const rows = Array.from(table.querySelectorAll("tr"));

  // Sort rows based on the value inside input with class goal-year
  rows.sort((a, b) => {
    const selectA =
      a.querySelector(".goalYear select") || a.querySelector(".goalYear");
    const selectB =
      b.querySelector(".goalYear select") || b.querySelector(".goalYear");

    const yearA = parseInt(selectA?.value) || 0;
    const yearB = parseInt(selectB?.value) || 0;
    return yearA - yearB; // ascending order
  });

  // Append rows back in sorted order
  rows.forEach((row) => table.appendChild(row));
}

async function importGoals(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const data = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);
    const sheet = workbook.getWorksheet(1);

    // Validate template headers
    const headers = sheet.getRow(1).values.slice(1);
    if (
      headers[0] !== "Goal Name" ||
      headers[1] !== "Year" ||
      headers[2] !== "Amount Today"
    ) {
      showToast(
        "Invalid file format. Please use the provided template.",
        "error"
      );
      return;
    }

    // Clear current rows
    document.getElementById("goalWithdrawalRows").innerHTML = "";

    // Add rows from file
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const name = row.getCell(1).value;
      const year = row.getCell(2).value;
      const amount = row.getCell(3).value;
      if (name && year && amount) {
        addGoalRow(name, year, amount);
      }
    });

    showToast("Goals imported successfully!", "success");
  } catch (err) {
    console.error(err);
    showToast(
      "Invalid file format. Please use the provided template.",
      "error"
    );
  } finally {
    event.target.value = ""; // reset file input
  }
}

/**
 * ALTERNATIVE: Initialize advanced investment with defaults
 * Add this function to legacy-app.js
 */
function initializeAdvancedInvestmentDefaults() {
  // This runs AFTER loadInputs() in initializeOldApp()

  // Check if it's a fresh reset (no data in storage for advanced investment)
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const hasAdvancedData = Object.keys(data).some(
    (key) => key.includes("investment") || key.includes("inflation")
  );

  // If no advanced data, set defaults
  if (!hasAdvancedData) {
    // Set default values
    const defaults = {
      inflationRate: "6",
      investmentYear: getCurrentYear().toString(),
      initialInvestment: "100000",
      interestRate: "12",
      years: "12",
      compoundingFrequency: "12",
      sipAmount: "25000",
      investmentFrequency: "1",
      stepUpIncreasePercentage: "10",
      stepUpFrequency: "12",
      sipThreshold: "200000",
      bonusSipAmount: "",
      bonusSipFrequency: "12",
      withdrawalAmount: "50000",
      withdrawalFrequency: "1",
      stepUpWithdrawalPercentage: "5",
      withdrawalStepUpFrequency: "12",
      // Secondary investment defaults
      investmentYearOne: getCurrentYear().toString(),
      initialInvestmentOne: "100000",
      interestRateOne: "10",
      compoundingFrequencyOne: "12",
      sipOneAmount: "10000",
      investmentOneFrequency: "1",
      stepUpOneIncreasePercentage: "5",
      stepUpOneFrequency: "12",
      // Tertiary investment defaults
      investmentYearTwo: getCurrentYear().toString(),
      initialInvestmentTwo: "100000",
      interestRateTwo: "8",
      compoundingFrequencyTwo: "4",
      sipTwoAmount: "10000",
      investmentTwoFrequency: "1",
      stepUpTwoIncreasePercentage: "5",
      stepUpTwoFrequency: "12",
    };

    // Apply defaults to inputs
    Object.entries(defaults).forEach(([key, value]) => {
      const element = document.querySelector(`.${key}`);
      if (element) {
        element.value = value;
      }
    });

    // Format the number inputs
    formatInputFieldValues();

    // Run initial calculation with defaults
    setTimeout(() => {
      calculate(false, false); // false = don't show success toast, don't show compromise dialog
    }, 200);
  } else {
    // Has existing data, will be calculated by the auto-calculate in initializeOldApp
  }
}

function validateInitialInvestment(showWarning = false) {
  removeNoValueWarning();

  if (showWarning) {
    // Highlight the problematic input
    addNoValueWarning();

    // Optionally show a dialog
    showCustomDialog(
      "Initial investment is 0 or SIP is not enabled. Please update values.",
      "error"
    );

    return false;
  }

  // Valid input, remove highlight if any
  removeNoValueWarning();
  return true;
}

/**
 * UPDATED: initializeOldApp function
 * Replace the entire function in legacy-app.js
 */
function initializeOldApp() {
  // Disable autocomplete
  document
    .querySelectorAll("#investment-calculator input")
    .forEach(function (input) {
      input.autocomplete = "off";
    });

  // Year-Month toggle button logic
  const buttons = document.querySelectorAll(".yearMonthToggleBtn");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Month to year conversion
  document.querySelectorAll(".months").forEach((monthInput) => {
    monthInput.addEventListener("input", () => {
      let val = parseInt(monthInput.value, 10);
      if (isNaN(val)) return;

      if (val >= 12) {
        const yearInput = monthInput.closest("tr").querySelector(".years");
        if (yearInput) {
          const years = parseInt(yearInput.value, 10) || 0;
          const extraYears = Math.floor(val / 12);
          yearInput.value = years + extraYears;
        }
        monthInput.value = val % 12;
      }
    });
  });

  // Goal table input handler
  const table = document.getElementById("goalWithdrawalRows");
  table.addEventListener("input", (e) => {
    const row = e.target.closest("tr");
    if (row) {
      row.classList.remove("goal-compromised");
    }
  });

  // Goal file import
  document.getElementById("goalFile").addEventListener("change", importGoals);

  // Show results section immediately (before calculation)
  const rightDiv = document.querySelector(".right-div-container");
  if (rightDiv) {
    rightDiv.classList.remove("hidden");
  }

  // Data is already loaded by main app (loadInputs())
  // Set initial UI state based on loaded data
  toggleDecreaseInterestRate("");
  toggleDecreaseInterestRate("One");
  toggleDecreaseInterestRate("Two");
  toggleSIP("");
  toggleSIP("One");
  toggleSIP("Two");
  toggleAdvSWP("");
  toggleLumpsumWithdrawal("");
  toggleParallelInvestment("One");
  toggleParallelInvestment("Two");
  toggleBonusSIP("");
  toggleStepUpSIP("");
  toggleStepUpSIP("One");
  toggleStepUpSIP("Two");
  decreaseStepUp("");
  toggleStopSip("");
  toggleStopSip("One");
  toggleStopSip("Two");
  toggleStepUpBonusSIP("");
  toggleAdvSWPStepUp("");

  // Initialize with defaults if needed (after page reload from reset)
  initializeAdvancedInvestmentDefaults();

  // Auto-calculate on page load if there's data
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const hasAdvancedData = Object.keys(data).some(
    (key) => key.includes("investment") || key.includes("inflation")
  );

  if (hasAdvancedData) {
    // Has data, calculate silently
    setTimeout(() => calculate(false, false), 200);
  }

  document
    .querySelector("#investment-calculator .calculate-button")
    .addEventListener("click", () => {
      const initialInvestment = Number(
        document.querySelector(".initialInvestment").value.replace(/,/g, "") ||
          "0"
      );
      const sip = isChecked("toggleSIP");

      if (!validateInitialInvestment(initialInvestment === 0 && !sip)) {
        return; // stop calculation
      }

      // Add loading state
      const btn = document.querySelector(
        "#investment-calculator .calculate-button"
      );
      btn.classList.add("loading");
      btn.disabled = true;

      saveInputs();

      // Use setTimeout to allow UI to update before heavy calculation
      setTimeout(() => {
        calculate();

        // Remove loading state after calculation
        btn.classList.remove("loading");
        btn.disabled = false;
      }, 500);
    });

  // Download calculations handler
  document
    .getElementById("downloadCalculations")
    .addEventListener("click", downloadExcelReport);

  document.activeElement.blur();
}

// Auto-save on input changes for advanced investment section
document.addEventListener("DOMContentLoaded", () => {
  const advSection = document.getElementById("investment-calculator");
  if (advSection) {
    const debouncedSave = debounce(() => {
      saveInputs();
    }, 500);

    advSection.addEventListener("input", (e) => {
      if (e.target.matches("input, select")) {
        debouncedSave();
      }
    });
  }
});

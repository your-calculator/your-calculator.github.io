function resetTaxForm() {
  resetSection("tax-calculator");
  var resultTable = document.querySelector(".calculations");
  resultTable.classList.add("hidden");
}

function createPayslip(
  basicMonthly,
  hraMonthly,
  otherOneMonthly,
  otherTwoMonthly,
  pfMonthly,
  proTaxMonthly,
  welfareContribution,
  tdsMonthly,
  takeHome
) {
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var currentDate = new Date();
  var currentMonth = months[currentDate.getMonth() + 1];
  var currentYear = currentDate.getFullYear();
  var header = "Payslip for " + currentMonth + " " + currentYear;
  document.getElementById("payslip-header").innerHTML = header;
  document.getElementById("payslip-basic").innerText =
    "₹" + formatIndianNumberFromData(basicMonthly);
  document.getElementById("payslip-hra").innerText =
    "₹" + formatIndianNumberFromData(hraMonthly);
  document.getElementById("payslip-other-1").innerText =
    "₹" + formatIndianNumberFromData(otherOneMonthly);
  document.getElementById("payslip-other-2").innerText =
    "₹" + formatIndianNumberFromData(otherTwoMonthly);
  document.getElementById("payslip-pf").innerText =
    "- ₹" + formatIndianNumberFromData(pfMonthly);
  document.getElementById("payslip-pro-tax").innerText =
    "- ₹" + formatIndianNumberFromData(proTaxMonthly);
  document.getElementById("payslip-welfare-contribution").innerText =
    "- ₹" + formatIndianNumberFromData(welfareContribution);
  document.getElementById("payslip-tds").innerText =
    "- ₹" + formatIndianNumberFromData(tdsMonthly);
  document.getElementById("payslip-total").innerText =
    "₹" + formatIndianNumberFromData(takeHome);
}

function formatIndianNumberAndCalculateTotal(input) {
  formatIndianNumber(input);
  calculateTotal();
}

class TaxBracket {
  constructor(lowerLimit, upperLimit, rate) {
    this.lowerLimit = lowerLimit;
    this.upperLimit = upperLimit;
    this.rate = rate;
  }
}

function calculateTakeHomeSalary(
  showConfirmation = true,
  showCompromiseDialog = true
) {
  const taxBracketsOld = [
    new TaxBracket(0, 250000, 0.0),
    new TaxBracket(250000, 500000, 0.05),
    new TaxBracket(500000, 1000000, 0.2),
    new TaxBracket(1000000, Infinity, 0.3),
  ];

  //Obsolate New Tax Regime from FY 24-25
  // const taxBracketsNew = [
  //     new TaxBracket(0, 300000, 0.0),
  //     new TaxBracket(300000, 600000, 0.05),
  //     new TaxBracket(600000, 900000, 0.10),
  //     new TaxBracket(900000, 1200000, 0.15),
  //     new TaxBracket(1200000, 1500000, 0.20),
  //     new TaxBracket(1500000, Infinity, 0.30)
  // ];

  //Obsolate New Tax Regime from FY 24-25 (Interim Budget)
  //   const taxBracketsNew = [
  //     new TaxBracket(0, 300000, 0.0),
  //     new TaxBracket(300000, 700000, 0.05),
  //     new TaxBracket(700000, 1000000, 0.1),
  //     new TaxBracket(1000000, 1200000, 0.15),
  //     new TaxBracket(1200000, 1500000, 0.2),
  //     new TaxBracket(1500000, Infinity, 0.3),
  //   ];

  //Obsolate New Tax Regime from FY 25-26
  //   const taxBracketsNew = [
  //     new TaxBracket(0, 300000, 0.0),
  //     new TaxBracket(300000, 600000, 0.05),
  //     new TaxBracket(600000, 900000, 0.1),
  //     new TaxBracket(900000, 1200000, 0.15),
  //     new TaxBracket(1200000, 1500000, 0.2),
  //     new TaxBracket(1500000, Infinity, 0.3),
  //   ];

  //New Tax Regime from FY 25-26
  const taxBracketsNew = [
    new TaxBracket(0, 400000, 0.0),
    new TaxBracket(400000, 800000, 0.05),
    new TaxBracket(800000, 1200000, 0.1),
    new TaxBracket(1200000, 1600000, 0.15),
    new TaxBracket(1600000, 2000000, 0.2),
    new TaxBracket(2000000, 2400000, 0.25),
    new TaxBracket(2400000, Infinity, 0.3),
  ];

  hiddenDivs = document.querySelectorAll(".hiddenDiv");

  hiddenDivs.forEach(function (hiddenDiv) {
    hiddenDiv.style.display = "block";
  });

  console.log("******************************************************");
  var totalCtc = Number(
    document.querySelector(".total-taxable-annual").value.replace(/,/g, "")
  );
  var professionalTax = Number(
    document.querySelector(".professional-tax").value.replace(/,/g, "")
  );

  var welfareContribution = Number(
    document.querySelector(".welfare-contribution").value.replace(/,/g, "")
  );
  const standardDeduction = 50000;
  const standardDeductionNew = 75000; //FY 24-25 onwards
  const rebateOldRegime = 12500;
  const rebateNewRegime = 60000;
  const cess = 0.04;

  console.log("Total CTC: " + totalCtc);
  console.log("Professional Tax: " + professionalTax);
  console.log("Welfare Contribution: " + welfareContribution);
  console.log("Standard Deduction: " + standardDeduction);
  console.log("Standard Deduction New: " + standardDeductionNew);
  console.log("Total Rebate on Old Regime: " + rebateOldRegime);
  console.log("Total Rebate on New Regime: " + rebateNewRegime);
  console.log("Health & Education Cess: " + cess * 100 + "%");

  var totalSalaryNew = totalCtc - standardDeductionNew;
  var totalSalary = totalCtc - standardDeduction;

  console.log(
    "Total Taxable Salary as per Old Regime (Before Deductions): " + totalSalary
  );
  console.log("Total Taxable Salary as per New Regime: " + totalSalaryNew);
  console.log("******************************************************");

  //Calculate Deductions for Old Regime
  var mertroCity = isOpted("metro-city");
  var basicSal = Number(
    document.querySelector(".basic-annual").value.replace(/,/g, "")
  );
  if (basicSal == 0) {
    if (showCompromiseDialog) {
      showCustomDialog("Basic Salary is Needed...", "error");
      document.querySelector(".basic-annual").classList.add("input-error");
      document.querySelector(".basic-monthly").classList.add("input-error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  } else {
    document.querySelector(".basic-annual").classList.remove("input-error");
    document.querySelector(".basic-monthly").classList.remove("input-error");
  }
  var hraRecieved = Number(
    document.querySelector(".hra-annual").value.replace(/,/g, "")
  );
  var rentPaid = Number(
    document.querySelector(".rent").value.replace(/,/g, "")
  );

  var hraExemption;

  if (hraRecieved === 0 || rentPaid === 0) {
    hraExemption = 0;
    console.log("No HRA recieved or No rent paid. So, HRA exemption is 0.");
  } else {
    var val1 = rentPaid * 12 - basicSal * 0.1;
    var val2 = mertroCity ? basicSal * 0.4 : basicSal * 0.5;
    var exemption = Math.min(val1, val2, hraRecieved);
    hraExemption = exemption > 0 ? exemption : 0;
  }

  document.querySelector(".hra-exemption").value = formatIndianNumberFromData(
    parseFloat(hraExemption)
  );
  console.log("HRA Deduction: " + hraExemption);
  totalSalary = totalSalary - hraExemption;

  var pf = Number(document.querySelector(".epf").value.replace(/,/g, ""));
  var ppf = Number(document.querySelector(".ppf").value.replace(/,/g, ""));
  var nps = Number(document.querySelector(".nps").value.replace(/,/g, ""));
  var elss = Number(document.querySelector(".elss").value.replace(/,/g, ""));
  var lifeInsurancePremium = Number(
    document.querySelector(".life-insurance-premium").value.replace(/,/g, "")
  );
  var homeLoanPrincipal = Number(
    document.querySelector(".home-loan-principal").value.replace(/,/g, "")
  );

  var eightyC =
    ppf + nps + elss + lifeInsurancePremium + pf + homeLoanPrincipal;
  eightyC = Math.min(eightyC, 150000);

  console.log("80C Deduction: " + eightyC);

  totalSalary = totalSalary - eightyC;

  var helathInsurancePremiumForSelf = Math.min(
    Number(document.querySelector(".health-prem-self").value.replace(/,/g, "")),
    25000
  );
  var helathInsurancePremiumForParents = Math.min(
    Number(
      document.querySelector(".health-prem-parents").value.replace(/,/g, "")
    ),
    25000
  );
  var eightyD =
    helathInsurancePremiumForSelf + helathInsurancePremiumForParents;

  console.log("80D Deduction: " + eightyD);

  totalSalary = totalSalary - eightyD;

  var homeLoanIntestestPayment = Math.min(
    Number(
      document.querySelector(".home-loan-interest").value.replace(/,/g, "")
    ),
    200000
  );

  console.log(
    "Section 24 Deduction (Home Loan Interest Repayment): " +
      homeLoanIntestestPayment
  );

  totalSalary = totalSalary - homeLoanIntestestPayment;

  var homeLoanIntestestPaymentAdditional = Math.min(
    Number(
      document
        .querySelector(".home-loan-interest-additional")
        .value.replace(/,/g, "")
    ),
    150000
  );

  console.log(
    "80EEA Deduction (Home Loan Interest Repayment): " +
      homeLoanIntestestPaymentAdditional
  );

  totalSalary = totalSalary - homeLoanIntestestPaymentAdditional;

  var homeLoanIntestestPaymentAdditionall = Math.min(
    Number(
      document
        .querySelector(".home-loan-interest-additionall")
        .value.replace(/,/g, "")
    ),
    150000
  );

  console.log(
    "80EE Deduction (Home Loan Interest Repayment): " +
      homeLoanIntestestPaymentAdditionall
  );

  totalSalary = totalSalary - homeLoanIntestestPaymentAdditionall;

  var npsSelfContribution = Math.min(
    Number(document.querySelector(".nps-self").value.replace(/,/g, "")),
    50000
  );

  console.log("80CCD(1B) (Self Contribution to NPS): " + npsSelfContribution);

  totalSalary = totalSalary - npsSelfContribution;

  var govtEmployee = isOpted("govt-employee");

  var npsMaxEmployerContribution =
    govtEmployee === "no" ? basicSal * 0.1 : basicSal * 0.14;
  var npsEmployerContribution = Math.min(
    Number(document.querySelector(".nps-employer").value.replace(/,/g, "")),
    npsMaxEmployerContribution
  );

  console.log(
    "80CCD(2) (Employer Contribution to NPS): " + npsEmployerContribution
  );

  totalSalary = totalSalary - npsEmployerContribution;

  var eightyE = Number(
    document.querySelector(".education-loan").value.replace(/,/g, "")
  );

  console.log("80E (Education Loan Interest Payment): " + eightyE);

  totalSalary = totalSalary - eightyE;

  var eightyG = Number(
    document.querySelector(".donations").value.replace(/,/g, "")
  );

  console.log("80G (Donations to Charity): " + eightyG);

  totalSalary = totalSalary - eightyG;

  console.log(
    "Total Taxable Salary as per Old Regime (After Deductions): " + totalSalary
  );
  console.log("******************************************************");

  let taxPerOldRegime = 0.0;
  let taxPerNewRegime = 0.0;

  for (let bracket of taxBracketsOld) {
    if (totalSalary > bracket.lowerLimit) {
      let taxableIncome =
        Math.min(totalSalary, bracket.upperLimit) - bracket.lowerLimit;
      taxPerOldRegime += taxableIncome * bracket.rate;
    } else {
      break;
    }
  }

  for (let bracket of taxBracketsNew) {
    if (totalSalaryNew > bracket.lowerLimit) {
      let taxableIncome =
        Math.min(totalSalaryNew, bracket.upperLimit) - bracket.lowerLimit;
      taxPerNewRegime += taxableIncome * bracket.rate;
    } else {
      break;
    }
  }
  taxPerOldRegime = Math.round(taxPerOldRegime);
  taxPerNewRegime = Math.round(taxPerNewRegime);

  let noTaxOld = false;

  if (rebateOldRegime >= taxPerOldRegime) {
    noTaxOld = true;
    console.log("No Tax on Old Regime...");
  }

  let noTaxNew = false;

  if (rebateNewRegime >= taxPerNewRegime) {
    noTaxNew = true;
    console.log("No tax on New Regime...");
  }

  if (noTaxNew) {
    taxPerNewRegime = 0;
  }

  if (noTaxOld) {
    taxPerOldRegime = 0;
  }

  let cessOld = Math.round(taxPerOldRegime * cess);
  let totalTaxOld = taxPerOldRegime + cessOld;

  let cessNew = Math.round(taxPerNewRegime * cess);
  let totalTaxNew = taxPerNewRegime + cessNew;

  var monthlySalaryOld = Math.round(totalCtc / 12);
  console.log("Salary Per Month as per Old regime: " + monthlySalaryOld);

  var monthlySalaryNew = Math.round(totalCtc / 12);
  console.log("Salary Per Month as per New regime: " + monthlySalaryNew);

  var monthlyPf = Math.round(
    Number(document.querySelector(".epf").value.replace(/,/g, "")) / 12
  );
  console.log("PF Per Month: " + monthlyPf);

  console.log("TDS as per Old regime: " + taxPerOldRegime);
  console.log("Health & Education Cess as per Old regime: " + cessOld);
  console.log("TDS as per New regime: " + taxPerNewRegime);
  console.log("Health & Education Cess as per New regime: " + cessNew);
  document.getElementById("tax-old-regime-annual").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(totalTaxOld));
  document.getElementById("tax-new-regime-annual").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(totalTaxNew));

  var monthlyTdsOld = Math.round(totalTaxOld === 0 ? 0 : totalTaxOld / 12);
  var monthlyTdsNew = Math.round(totalTaxNew === 0 ? 0 : totalTaxNew / 12);

  console.log("TDS Per Month as per Old regime: " + monthlyTdsOld);
  console.log("TDS Per Month as per New regime: " + monthlyTdsNew);
  document.getElementById("tax-old-regime-monthly").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(monthlyTdsOld));
  document.getElementById("tax-new-regime-monthly").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(monthlyTdsNew));

  var takeHomeOld =
    monthlySalaryOld -
    monthlyPf -
    monthlyTdsOld -
    professionalTax -
    welfareContribution;
  var takeHomeNew =
    monthlySalaryNew -
    monthlyPf -
    monthlyTdsNew -
    professionalTax -
    welfareContribution;
  console.log("Monthly Take Home Salary as per Old regime: " + takeHomeOld);
  console.log("Monthly Take Home Salary as per New regime: " + takeHomeNew);

  var takeHomeAnnualOld = takeHomeOld * 12;
  var takeHomeAnnualNew = takeHomeNew * 12;
  console.log(
    "Annual Take Home Salary as per Old regime: " + takeHomeAnnualOld
  );
  console.log(
    "Annual Take Home Salary as per New regime: " + takeHomeAnnualNew
  );

  document.getElementById("take-home-old-regime-annual").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(takeHomeAnnualOld));
  document.getElementById("take-home-old-regime-monthly").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(takeHomeOld));

  document.getElementById("take-home-new-regime-annual").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(takeHomeAnnualNew));
  document.getElementById("take-home-new-regime-monthly").innerText =
    "₹" + formatIndianNumberFromData(parseFloat(takeHomeNew));

  var suggestion = "";
  if (noTaxOld && noTaxNew) {
    suggestion =
      "You can go for ANY TAX REGIME...<br>There is NO TAX difference in both the regimes...";
  } else if (totalTaxNew > totalTaxOld) {
    suggestion =
      "You should opt for OLD TAX REGIME as it will save you ₹" +
      formatIndianNumberFromData(totalTaxNew - totalTaxOld) +
      " rupees.";
  } else {
    suggestion =
      "You should opt for NEW TAX REGIME as it will save you ₹" +
      formatIndianNumberFromData(totalTaxOld - totalTaxNew) +
      " rupees.";
  }

  document.querySelector(".suggestion").innerHTML =
    '<p class="info" id="suggestion">💡' +
    suggestion +
    "<br>Cheers... Below is a possible version of your monthly payslip!</p>";
  console.log("******************************************************");

  createPayslip(
    Number(document.querySelector(".basic-monthly").value.replace(/,/g, "")),
    Number(document.querySelector(".hra-monthly").value.replace(/,/g, "")),
    Number(
      document
        .querySelector(".other-allowances-1-monthly")
        .value.replace(/,/g, "")
    ),
    Number(
      document
        .querySelector(".other-allowances-2-monthly")
        .value.replace(/,/g, "")
    ),
    monthlyPf,
    professionalTax,
    welfareContribution,
    monthlyTdsOld >= monthlyTdsNew ? monthlyTdsNew : monthlyTdsOld,
    monthlyTdsOld >= monthlyTdsNew ? takeHomeNew : takeHomeOld
  );

  var resultTable = document.querySelector(".calculations");
  resultTable.classList.remove("hidden");
  var elementPosition =
    resultTable.getBoundingClientRect().top + window.scrollY;
  var offsetPosition = elementPosition - 30;
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });

  // if (showConfirmation) showToast("Calculation Done. Enjoy!", "success");
}

function updateBasicValues(className) {
  // Extract the first class (the one we care about) if multiple classes exist
  var mainClass = className.split(" ")[0];

  var input = document.querySelector("." + mainClass).value.replace(/,/g, "");
  var classRecieved = mainClass;
  var classNeedToBeUpdated;

  if (mainClass.includes("annual")) {
    classNeedToBeUpdated = classRecieved.replace("annual", "monthly");
    var monthlyValue = Math.round(input / 12);
    var formattedValue = formatIndianNumberFromData(Number(monthlyValue));
    document.querySelector("." + classNeedToBeUpdated).value = formattedValue;
  } else {
    classNeedToBeUpdated = classRecieved.replace("monthly", "annual");
    var annualValue = Math.round(input * 12);
    var formattedValue = formatIndianNumberFromData(Number(annualValue));
    document.querySelector("." + classNeedToBeUpdated).value = formattedValue;
  }
}

function calculateEpf() {
  var basicSal = document
    .querySelector(".basic-annual")
    .value.replace(/,/g, "");
  var epf = Math.round(basicSal * 0.12);
  document.querySelector(".epf").value = formatIndianNumberFromData(epf);
}

// function calculateTotal() {
//   var classes = [
//     "basic",
//     "hra",
//     "other-allowances-1",
//     "other-allowances-2",
//     "employer-pf",
//     "gratuity",
//   ];
//   var total = 0;

//   classes.forEach(function (className) {
//     var elements = document.getElementsByClassName(className + "-annual");

//     for (var i = 0; i < elements.length; i++) {
//       var value = elements[i].value.replace(/,/g, "");

//       if (value.trim() !== "") {
//         total = Number(total) + Number(value);
//       }
//     }
//   });

//   var totalSalInput = document.getElementsByClassName("total-sal-annual")[0];
//   var totalSalMonthlyInput =
//     document.getElementsByClassName("total-sal-monthly")[0];
//   var totalSal = Math.round(total);
//   var totalSalMonthly = Math.round(total / 12);
//   totalSalInput.value = formatIndianNumberFromData(Number(totalSal));
//   totalSalMonthlyInput.value = formatIndianNumberFromData(
//     Number(totalSalMonthly)
//   );

//   var totalTaxableSalInput = document.getElementsByClassName(
//     "total-taxable-annual"
//   )[0];
//   var totalTaxableSalMonthlyInput = document.getElementsByClassName(
//     "total-taxable-monthly"
//   )[0];
//   var employerPfAnnual = document
//     .getElementsByClassName("employer-pf-annual")[0]
//     .value.replace(/,/g, "");
//   var GratuityAnnual = document
//     .getElementsByClassName("gratuity-annual")[0]
//     .value.replace(/,/g, "");
//   var totalTaxableSal = Math.round(
//     Number(totalSal) - Number(employerPfAnnual) - Number(GratuityAnnual)
//   );
//   var totalTaxableSalMonthly = Math.round(totalTaxableSal / 12);
//   totalTaxableSalInput.value = formatIndianNumberFromData(
//     Number(totalTaxableSal)
//   );
//   totalTaxableSalMonthlyInput.value = formatIndianNumberFromData(
//     Number(totalTaxableSalMonthly)
//   );
// }

function calculateTotal() {
  var classes = [
    "basic",
    "hra",
    "other-allowances-1",
    "other-allowances-2",
    "employer-pf",
    "gratuity",
  ];
  var total = 0;

  classes.forEach(function (className) {
    var elements = document.getElementsByClassName(className + "-annual");

    for (var i = 0; i < elements.length; i++) {
      // Use getNumericValueFromText instead of manual parsing
      var numValue = getNumericValueFromText(elements[i].value);
      if (!isNaN(numValue) && numValue > 0) {
        total += numValue;
      }
    }
  });

  var totalSalInput = document.getElementsByClassName("total-sal-annual")[0];
  var totalSalMonthlyInput =
    document.getElementsByClassName("total-sal-monthly")[0];
  var totalSal = Math.round(total);
  var totalSalMonthly = Math.round(total / 12);

  if (totalSalInput) totalSalInput.value = formatIndianNumberFromData(totalSal);
  if (totalSalMonthlyInput)
    totalSalMonthlyInput.value = formatIndianNumberFromData(totalSalMonthly);

  // Safe retrieval with null checks
  var employerPfElement =
    document.getElementsByClassName("employer-pf-annual")[0];
  var gratuityElement = document.getElementsByClassName("gratuity-annual")[0];

  var employerPfAnnual = employerPfElement
    ? getNumericValueFromText(employerPfElement.value)
    : 0;
  var gratuityAnnual = gratuityElement
    ? getNumericValueFromText(gratuityElement.value)
    : 0;

  var totalTaxableSalInput = document.getElementsByClassName(
    "total-taxable-annual"
  )[0];
  var totalTaxableSalMonthlyInput = document.getElementsByClassName(
    "total-taxable-monthly"
  )[0];

  var totalTaxableSal = Math.round(
    totalSal - employerPfAnnual - gratuityAnnual
  );
  var totalTaxableSalMonthly = Math.round(totalTaxableSal / 12);

  if (totalTaxableSalInput)
    totalTaxableSalInput.value = formatIndianNumberFromData(totalTaxableSal);
  if (totalTaxableSalMonthlyInput)
    totalTaxableSalMonthlyInput.value = formatIndianNumberFromData(
      totalTaxableSalMonthly
    );
}

document
  .querySelector("#tax-calculator .calculate-button")
  .addEventListener("click", () => {
    // Add loading state
    const btn = document.querySelector("#tax-calculator .calculate-button");
    btn.classList.add("loading");
    btn.disabled = true;

    saveInputs();

    // Use setTimeout to allow UI to update before heavy calculation
    setTimeout(() => {
      calculateTakeHomeSalary(true, true);

      // Remove loading state after calculation
      btn.classList.remove("loading");
      btn.disabled = false;
    }, 500);
  });

function saveInputs() {
  document.querySelectorAll("input, select").forEach((el) => {
    // Only save user inputs, ignore result sections
    if (
      !el.closest(".result-section") &&
      !el.closest(".results-chart-container")
    ) {
      localStorage.setItem(el.id, el.value);
    }
  });
}

function loadInputs() {
  document.querySelectorAll("input, select").forEach((el) => {
    const saved = localStorage.getItem(el.id);
    if (saved !== null) el.value = saved;
  });
}

// Export data as JSON
function exportData() {
  const data = {
    inputs: JSON.parse(localStorage.getItem("calculatorInputs") || "{}"),
    activeCalculator: localStorage.getItem("activeCalculator"),
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `financial-calc-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Data exported successfully!", "success");
}

// Import data from JSON
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.inputs) {
        localStorage.setItem("calculatorInputs", JSON.stringify(data.inputs));
        loadInputs();
      }
      if (data.activeCalculator) {
        localStorage.setItem("activeCalculator", data.activeCalculator);
        const navItem = document.querySelector(
          `[onclick*="${data.activeCalculator}"]`
        );
        if (navItem) showCalculator(data.activeCalculator, navItem);
      }
      showToast("Data imported successfully!", "success");
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

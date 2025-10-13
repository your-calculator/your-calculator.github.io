let charts = {};

// Destroy chart
function destroyChart(chartId) {
  if (charts[chartId]) {
    charts[chartId].destroy();
    delete charts[chartId];
  }
}

Chart.register(ChartDataLabels);
function createPieChart(canvasId, labels, data, colors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  destroyChart(canvasId);

  charts[canvasId] = new Chart(ctx, {
    type: "doughnut", // ✅ make it a donut chart
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // ✅ makes it auto-resize
      cutout: "50%", // ✅ creates the donut hole
      plugins: {
        legend: {
          position: window.innerWidth <= 768 ? "top" : "bottom",
          align: "center",
          labels: {
            padding: 15,
            font: { size: 12 },
            boxWidth: 15,
            usePointStyle: true,
            pointStyle: "circle",
            generateLabels: function (chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i];
                  const total = data.datasets[0].data.reduce(
                    (a, b) => a + b,
                    0
                  );
                  const percentage = ((value / total) * 100).toFixed(1);
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
          display: true,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": " + formatCurrency(context.parsed);
            },
          },
        },
        datalabels: {
          display: false, // ✅ remove % labels from chart
        },
      },
      layout: {
        padding: { bottom: 10 },
      },
    },
  });
}

// Line chart stays unchanged
function createLineChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  destroyChart(canvasId);

  charts[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 15,
            font: { size: 12 },
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return (
                context.dataset.label + ": " + formatCurrency(context.parsed.y)
              );
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },
    },
  });
}

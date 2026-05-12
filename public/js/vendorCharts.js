const vendorColors = [
  "rgba(255, 99, 132, 0.6)", // Red
  "rgba(54, 162, 235, 0.6)", // Blue
  "rgba(75, 192, 192, 0.6)", // Green
  "rgba(255, 159, 64, 0.6)", // Orange
  "rgba(153, 102, 255, 0.6)", // Purple
];

// Bar Chart showing Vendor Sales
const barChart = new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"],
    datasets: [
      {
        label: "Monthly Sales (in thousands)",
        data: [150, 200, 250, 300, 350],
        backgroundColor: vendorColors,
        borderColor: vendorColors,
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeOutBounce",
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  },
});

// Doughnut Chart showing Vendor Market Share
const doughnutChart = new Chart(document.getElementById("doughnutChart"), {
  type: "doughnut",
  data: {
    labels: ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"],
    datasets: [
      {
        data: [30, 20, 25, 15, 10],
        backgroundColor: vendorColors,
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeOutElastic",
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  },
});

// Line Chart showing Vendor Revenue Growth
const lineChart = new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
    datasets: [
      {
        label: "Vendor Revenue Growth (in millions)",
        data: [100, 150, 200, 250, 300, 400],
        borderColor: "rgba(255, 99, 132, 0.6)", // Red
        fill: false,
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeInOutCubic",
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  },
});

// Polar Area Chart showing Vendor Market Share by Region
const polarChart = new Chart(document.getElementById("polarAreaChart"), {
  type: "polarArea",
  data: {
    labels: ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Vendor E"],
    datasets: [
      {
        label: "Market Share (%)",
        data: [40, 25, 20, 10, 5],
        backgroundColor: vendorColors,
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeInOutBack",
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  },
});

// Radar Chart showing Vendor Performance in Different Areas
const radarChart = new Chart(document.getElementById("radarChart"), {
  type: "radar",
  data: {
    labels: [
      "Quality",
      "Delivery Time",
      "Customer Service",
      "Innovation",
      "Cost Efficiency",
      "Sustainability",
    ],
    datasets: [
      {
        label: "Vendor A Performance",
        data: [90, 80, 85, 70, 60, 75],
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue with transparency
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Vendor B Performance",
        data: [85, 70, 80, 60, 75, 65],
        backgroundColor: "rgba(255, 159, 64, 0.2)", // Orange with transparency
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeInOutCirc",
    },
    scale: {
      ticks: {
        beginAtZero: true,
      },
      grid: {
        color: "rgba(255, 255, 255, 0.2)",
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  },
});

// Scatter Chart showing Vendor Product Performance
const scatterChart = new Chart(document.getElementById("scatterChart"), {
  type: "scatter",
  data: {
    datasets: [
      {
        label: "Vendor Product Performance",
        data: [
          { x: 1, y: 2 }, // Vendor A
          { x: 2, y: 3 }, // Vendor B
          { x: 3, y: 5 }, // Vendor C
          { x: 4, y: 6 }, // Vendor D
          { x: 5, y: 10 }, // Vendor E
        ],
        backgroundColor: vendorColors,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000,
      easing: "easeOutQuad",
    },
    scales: {
      x: {
        min: 0,
        max: 10,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        min: 0,
        max: 20,
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
        },
      },
    },
  },
});

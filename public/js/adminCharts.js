// Bar Chart
const barChart = new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Sales (in thousands)",
        data: [150, 200, 250, 300, 400, 500],
        backgroundColor: "rgba(153, 102, 255, 0.6)", // Blue
        borderColor: "rgba(153, 102, 255, 0.6)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000, // Duration of animation in ms
      easing: "easeOutBounce", // Animation type
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Darker grid lines
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Darker grid lines
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black", // Set legend text to white
        },
      },
    },
  },
});

// Doughnut Chart
const doughnutChart = new Chart(document.getElementById("doughnutChart"), {
  type: "doughnut",
  data: {
    labels: ["Product A", "Product B", "Product C", "Product D"],
    datasets: [
      {
        data: [30, 40, 20, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(255, 159, 64, 0.6)", // Orange
          "rgba(153, 102, 255, 0.6)", // Purple
        ],
        borderWidth: 0, // Removed the border width
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000, // Duration of animation in ms
      easing: "easeOutElastic", // Animation type
    },
    plugins: {
      legend: {
        labels: {
          color: "black", // Set legend text to black
        },
      },
    },
  },
});

// Line Chart
const lineChart = new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue Growth (in millions)",
        data: [100, 120, 140, 200, 300, 500],
        borderColor: "rgba(255, 99, 132, 0.6)", // Red
        fill: false,
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000, // Duration of animation in ms
      easing: "easeInOutCubic", // Animation type
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Darker grid lines
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Darker grid lines
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black", // Set legend text to white
        },
      },
    },
  },
});

// Polar Area Chart
const polarChart = new Chart(document.getElementById("polarAreaChart"), {
  type: "polarArea",
  data: {
    labels: ["Islamabad", "Lahore", "Rawalpindi", "Karachi", "Sialkot"],
    datasets: [
      {
        label: "Market Share (%)",
        data: [50, 20, 15, 10, 5],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(255, 159, 64, 0.6)", // Orange
          "rgba(153, 102, 255, 0.6)", // Purple
        ],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000, // Duration of animation in ms
      easing: "easeInOutBack", // Animation type
    },
    plugins: {
      legend: {
        labels: {
          color: "black", // Set legend text to black
        },
      },
    },
  },
});

// Radar Chart
const radarChart = new Chart(document.getElementById("radarChart"), {
  type: "radar",
  data: {
    labels: ["Marketing", "Sales", "Customer Service", "Finance", "HR", "R&D"],
    datasets: [
      {
        label: "Department Performance",
        data: [90, 80, 85, 70, 60, 75],
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Blue with transparency
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000, // Duration of animation in ms
      easing: "easeInOutCirc", // Animation type
    },
    scale: {
      ticks: {
        beginAtZero: true,
      },
      grid: {
        color: "rgba(255, 255, 255, 0.2)", // Darker grid lines
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black", // Set legend text to white
        },
      },
    },
  },
});

// Scatter Chart
const scatterChart = new Chart(document.getElementById("scatterChart"), {
  type: "scatter",
  data: {
    datasets: [
      {
        label: "Employee Performance",
        data: [
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 5 },
          { x: 4, y: 6 },
          { x: 5, y: 10 },
          { x: 6, y: 15 },
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Red
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      duration: 1000, // Duration of animation in ms
      easing: "easeOutQuad", // Animation type
    },
    scales: {
      x: {
        min: 0,
        max: 10,
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Darker grid lines
        },
      },
      y: {
        min: 0,
        max: 20,
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Darker grid lines
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black", // Set legend text to white
        },
      },
    },
  },
});

// DOM Elements
const temperatureInput = document.getElementById("temperature");
const fromUnitSelect = document.getElementById("from-unit");
const toUnitSelect = document.getElementById("to-unit");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-btn");
const resultElement = document.getElementById("result");
const historyList = document.getElementById("history-list");
const copyBtn = document.getElementById("copy-btn");
const copyNotification = document.getElementById("copy-notification");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeIcon = themeToggleBtn.querySelector("i");
const themeText = themeToggleBtn.querySelector("span");

// Tooltips
const fromUnitTooltip = fromUnitSelect.parentElement.querySelector(".tooltip");
const toUnitTooltip = toUnitSelect.parentElement.querySelector(".tooltip");

// Conversion history array
const conversionHistory = [];
const MAX_HISTORY_ITEMS = 5;

// Temperature conversion formulas
const conversionFormulas = {
  // Celsius to other units
  celsius: {
    fahrenheit: (temp) => (temp * 9) / 5 + 32,
    kelvin: (temp) => temp + 273.15,
    celsius: (temp) => temp,
  },
  // Fahrenheit to other units
  fahrenheit: {
    celsius: (temp) => ((temp - 32) * 5) / 9,
    kelvin: (temp) => ((temp - 32) * 5) / 9 + 273.15,
    fahrenheit: (temp) => temp,
  },
  // Kelvin to other units
  kelvin: {
    celsius: (temp) => temp - 273.15,
    fahrenheit: (temp) => ((temp - 273.15) * 9) / 5 + 32,
    kelvin: (temp) => temp,
  },
};

// Format the result with appropriate unit symbol
function formatResult(value, unit) {
  const symbols = {
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K",
  };

  // Round to 2 decimal places
  const roundedValue = Math.round(value * 100) / 100;
  return `${roundedValue}${symbols[unit]}`;
}

// Convert temperature
function convertTemperature() {
  // Get input values
  const temperature = Number.parseFloat(temperatureInput.value);
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  // Validate input
  if (isNaN(temperature)) {
    resultElement.textContent = "Please enter a valid number";
    return;
  }

  // Perform conversion
  const result = conversionFormulas[fromUnit][toUnit](temperature);

  // Format and display result
  const formattedResult = formatResult(result, toUnit);
  resultElement.textContent = formattedResult;
  resultElement.classList.add("fade-in");

  // Add to history
  addToHistory(temperature, fromUnit, toUnit, result);

  // Remove animation class after animation completes
  setTimeout(() => {
    resultElement.classList.remove("fade-in");
  }, 300);
}

// Add conversion to history
function addToHistory(inputTemp, fromUnit, toUnit, result) {
  // Create history item object
  const historyItem = {
    inputTemp,
    fromUnit,
    toUnit,
    result,
    timestamp: new Date().toISOString(),
  };

  // Add to beginning of array
  conversionHistory.unshift(historyItem);

  // Limit history to MAX_HISTORY_ITEMS
  if (conversionHistory.length > MAX_HISTORY_ITEMS) {
    conversionHistory.pop();
  }

  // Update history display
  updateHistoryDisplay();
}

// Update history display
function updateHistoryDisplay() {
  // Clear current history
  historyList.innerHTML = "";

  // If no history, show empty message
  if (conversionHistory.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No conversion history yet";
    emptyMessage.className = "empty-history";
    historyList.appendChild(emptyMessage);
    return;
  }

  // Add each history item
  conversionHistory.forEach((item, index) => {
    const historyElement = document.createElement("div");
    historyElement.className = "history-item";

    const fromFormatted = formatResult(item.inputTemp, item.fromUnit);
    const toFormatted = formatResult(item.result, item.toUnit);

    historyElement.textContent = `${fromFormatted} → ${toFormatted}`;

    // Add click event to reuse this conversion
    historyElement.addEventListener("click", () => {
      temperatureInput.value = item.inputTemp;
      fromUnitSelect.value = item.fromUnit;
      toUnitSelect.value = item.toUnit;
      convertTemperature();
    });

    historyList.appendChild(historyElement);
  });
}

// Swap units
function swapUnits() {
  const tempFromUnit = fromUnitSelect.value;
  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = tempFromUnit;

  // If there's a value, convert immediately
  if (temperatureInput.value) {
    convertTemperature();
  }
}

// Copy result to clipboard
function copyResultToClipboard() {
  const textToCopy = resultElement.textContent;

  // Check if there's a valid result
  if (
    textToCopy === "Result will appear here" ||
    textToCopy === "Please enter a valid number"
  ) {
    return;
  }

  // Use the Clipboard API
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      // Show notification
      copyNotification.classList.add("show");

      // Hide notification after 2 seconds
      setTimeout(() => {
        copyNotification.classList.remove("show");
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

// Toggle dark/light theme
function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  // Update button icon and text
  if (document.body.classList.contains("dark-mode")) {
    themeIcon.className = "fas fa-sun";
    themeText.textContent = "Light Mode";
  } else {
    themeIcon.className = "fas fa-moon";
    themeText.textContent = "Dark Mode";
  }
}

// Update tooltip content based on selected option
function updateTooltip(select, tooltip) {
  const selectedOption = select.options[select.selectedIndex];
  const description = selectedOption.getAttribute("data-description");
  tooltip.textContent = description;
}

// Event Listeners
// Convert on button click
convertBtn.addEventListener("click", convertTemperature);

// Live conversion as user types
temperatureInput.addEventListener("input", convertTemperature);

// Live conversion when units change
fromUnitSelect.addEventListener("change", convertTemperature);
toUnitSelect.addEventListener("change", convertTemperature);

// Swap units button
swapBtn.addEventListener("click", swapUnits);

// Copy result button
copyBtn.addEventListener("click", copyResultToClipboard);

// Theme toggle
themeToggleBtn.addEventListener("click", toggleTheme);

// Tooltip functionality
fromUnitSelect.addEventListener("mouseover", () => {
  updateTooltip(fromUnitSelect, fromUnitTooltip);
});

toUnitSelect.addEventListener("mouseover", () => {
  updateTooltip(toUnitSelect, toUnitTooltip);
});

// Form validation - prevent form submission on Enter key
document.querySelector(".converter-form").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    convertTemperature();
  }
});

// Initialize tooltips
updateTooltip(fromUnitSelect, fromUnitTooltip);
updateTooltip(toUnitSelect, toUnitTooltip);

// Initialize history display
updateHistoryDisplay();

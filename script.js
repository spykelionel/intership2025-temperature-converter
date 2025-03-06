// DOM Elements
const temperatureInput = document.getElementById("temperature");
const fromUnitSelect = document.getElementById("from-unit");
const toUnitSelect = document.getElementById("to-unit");
const swapButton = document.getElementById("swap-btn");
const resultElement = document.getElementById("result");
const copyButton = document.getElementById("copy-btn");
const historyList = document.getElementById("history-list");
const noHistoryMessage = document.getElementById("no-history");
const themeToggle = document.getElementById("theme-toggle");
const copyNotification = document.getElementById("copy-notification");
const fromTooltip = document.getElementById("from-tooltip");
const toTooltip = document.getElementById("to-tooltip");

// Constants
const MAX_HISTORY_ITEMS = 5;

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  // Load theme preference from localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Load history from localStorage
  loadHistory();

  // Set initial form state
  setInitialState();

  // Perform initial conversion (if input has a value)
  convertTemperature();
});

// Event listeners
temperatureInput.addEventListener("input", convertTemperature);
fromUnitSelect.addEventListener("change", convertTemperature);
toUnitSelect.addEventListener("change", convertTemperature);
swapButton.addEventListener("click", swapUnits);
copyButton.addEventListener("click", copyResult);
themeToggle.addEventListener("click", toggleTheme);

// Setup tooltip functionality
setupTooltips();

// Set initial state
function setInitialState() {
  // Set focus to the temperature input
  temperatureInput.focus();

  // Set default values for dropdowns (if not already set)
  if (!fromUnitSelect.value) fromUnitSelect.value = "celsius";
  if (!toUnitSelect.value) toUnitSelect.value = "fahrenheit";
}

// Temperature conversion formulas
const conversionFormulas = {
  celsiusToFahrenheit: (celsius) => (celsius * 9) / 5 + 32,
  celsiusToKelvin: (celsius) => celsius + 273.15,
  fahrenheitToCelsius: (fahrenheit) => ((fahrenheit - 32) * 5) / 9,
  fahrenheitToKelvin: (fahrenheit) => ((fahrenheit - 32) * 5) / 9 + 273.15,
  kelvinToCelsius: (kelvin) => kelvin - 273.15,
  kelvinToFahrenheit: (kelvin) => ((kelvin - 273.15) * 9) / 5 + 32,
};

// Main conversion function
function convertTemperature() {
  // Get input value and units
  const value = temperatureInput.value;
  const fromUnit = fromUnitSelect.value;
  const toUnit = toUnitSelect.value;

  // Validate input - show placeholder if empty
  if (value === "") {
    resultElement.textContent = "--";
    return;
  }

  // Parse input as a number
  const numValue = parseFloat(value);

  // Perform conversion
  let result;

  if (fromUnit === toUnit) {
    // Same unit, no conversion needed
    result = numValue;
  } else {
    // Determine which conversion to use
    const conversionKey = `${fromUnit}To${capitalizeFirstLetter(toUnit)}`;
    if (conversionFormulas[conversionKey]) {
      result = conversionFormulas[conversionKey](numValue);
    } else {
      resultElement.textContent = "Conversion not supported";
      return;
    }
  }

  // Format the result
  const formattedResult = formatResult(result, toUnit);

  // Show result with fade-in animation
  resultElement.style.opacity = "0";
  setTimeout(() => {
    resultElement.textContent = formattedResult;
    resultElement.style.opacity = "1";
  }, 100);

  // Save to history
  saveToHistory(numValue, fromUnit, result, toUnit);
}

// Format the result with appropriate unit symbol
function formatResult(value, unit) {
  // Round to 2 decimal places
  const roundedValue = Math.round(value * 100) / 100;

  // Add unit symbol
  const unitSymbols = {
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K",
  };

  return `${roundedValue} ${unitSymbols[unit]}`;
}

// History management
function saveToHistory(fromValue, fromUnit, toValue, toUnit) {
  // Only save if we have a valid input
  if (isNaN(fromValue) || isNaN(toValue)) return;

  // Get existing history or initialize new array
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

  // Create new history item
  const newItem = {
    fromValue: fromValue,
    fromUnit: fromUnit,
    toValue: toValue,
    toUnit: toUnit,
    timestamp: new Date().toISOString(),
  };

  // Check if this exact conversion is already in history
  const isDuplicate = history.some(
    (item) =>
      item.fromValue === newItem.fromValue &&
      item.fromUnit === newItem.fromUnit &&
      item.toUnit === newItem.toUnit
  );

  if (!isDuplicate) {
    // Add to beginning of array
    history.unshift(newItem);

    // Limit to max items
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }

    // Save back to localStorage
    localStorage.setItem("conversionHistory", JSON.stringify(history));

    // Update history display
    displayHistory();
  }
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  if (history.length > 0) {
    displayHistory();
  }
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

  // Clear current list
  historyList.innerHTML = "";

  if (history.length === 0) {
    noHistoryMessage.style.display = "block";
    return;
  }

  // Hide "no history" message
  noHistoryMessage.style.display = "none";

  // Create list items for each history entry
  history.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.className = "history-item";

    // Format date for display
    const date = new Date(item.timestamp);
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create content elements
    const itemText = document.createElement("span");
    itemText.className = "history-item-text";
    itemText.textContent = `${item.fromValue} ${getUnitSymbol(
      item.fromUnit
    )} = ${Math.round(item.toValue * 100) / 100} ${getUnitSymbol(item.toUnit)}`;

    const timestamp = document.createElement("span");
    timestamp.className = "history-timestamp";
    timestamp.textContent = timeString;

    // Add elements to list item
    listItem.appendChild(itemText);
    listItem.appendChild(timestamp);

    // Add click event to reuse this conversion
    listItem.addEventListener("click", () => {
      temperatureInput.value = item.fromValue;
      fromUnitSelect.value = item.fromUnit;
      toUnitSelect.value = item.toUnit;
      convertTemperature();
    });

    historyList.appendChild(listItem);
  });
}

// Swap the "from" and "to" units
function swapUnits() {
  const tempUnit = fromUnitSelect.value;
  fromUnitSelect.value = toUnitSelect.value;
  toUnitSelect.value = tempUnit;

  // Animate button
  swapButton.style.transform = "rotate(180deg)";
  setTimeout(() => {
    swapButton.style.transform = "rotate(0deg)";
  }, 300);

  // Perform conversion with new units
  convertTemperature();
}

// Copy result to clipboard
function copyResult() {
  const result = resultElement.textContent;

  // Don't copy placeholder
  if (result === "--") return;

  // Use the Clipboard API
  navigator.clipboard
    .writeText(result)
    .then(() => {
      // Show notification
      copyNotification.classList.add("show");
      setTimeout(() => {
        copyNotification.classList.remove("show");
      }, 2000);
    })
    .catch((err) => {
      console.error("Error copying text: ", err);
    });
}

// Toggle between light and dark themes
function toggleTheme() {
  const isDarkMode = document.body.classList.contains("dark-mode");

  if (isDarkMode) {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem("theme", "dark");
  }
}

// Tooltip functionality
function setupTooltips() {
  // From unit tooltip
  fromUnitSelect.addEventListener("mouseover", () => {
    const selectedOption = fromUnitSelect.options[fromUnitSelect.selectedIndex];
    const tooltipText = selectedOption.getAttribute("data-tooltip");

    if (tooltipText) {
      fromTooltip.textContent = tooltipText;
      fromTooltip.style.opacity = "1";
    }
  });

  fromUnitSelect.addEventListener("mouseout", () => {
    fromTooltip.style.opacity = "0";
  });

  // To unit tooltip
  toUnitSelect.addEventListener("mouseover", () => {
    const selectedOption = toUnitSelect.options[toUnitSelect.selectedIndex];
    const tooltipText = selectedOption.getAttribute("data-tooltip");

    if (tooltipText) {
      toTooltip.textContent = tooltipText;
      toTooltip.style.opacity = "1";
    }
  });

  toUnitSelect.addEventListener("mouseout", () => {
    toTooltip.style.opacity = "0";
  });
}

// Helper functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getUnitSymbol(unit) {
  const symbols = {
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K",
  };
  return symbols[unit] || "";
}

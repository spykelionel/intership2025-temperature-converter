# Advanced Temperature Converter

A feature-rich web application for converting between temperature units (Celsius, Fahrenheit, and Kelvin) with a modern UI and advanced features.

![Temperature Converter Screenshot](https://via.placeholder.com/800x500)

## 🌟 Features

- **Real-time conversion** - Results update as you type
- **Conversion history** - Keeps track of your last 5 conversions
- **Unit swap** - Quickly switch between "from" and "to" units
- **Dark mode** - Toggle between light and dark themes
- **Responsive design** - Works on all devices
- **Tooltips** - Get information about temperature units on hover
- **Copy to clipboard** - Copy results with one click
- **Form validation** - Handles all valid temperature inputs
- **Smooth animations** - Enhanced user experience with subtle transitions

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Variables, Animations)
- JavaScript (ES6+)
- LocalStorage API
- Clipboard API
- Font Awesome icons

## 📋 Usage

1. Enter a temperature value in the input field
2. Select the unit you want to convert from
3. Select the unit you want to convert to
4. The result will be displayed automatically
5. Click the swap button to quickly switch the conversion direction
6. Click any history item to recall a previous conversion
7. Use the copy button to copy the result to your clipboard
8. Toggle dark mode with the moon/sun icon

## 🧮 Conversion Formulas

- **Celsius to Fahrenheit**: (C × 9/5) + 32
- **Celsius to Kelvin**: C + 273.15
- **Fahrenheit to Celsius**: (F - 32) × 5/9
- **Fahrenheit to Kelvin**: (F - 32) × 5/9 + 273.15
- **Kelvin to Celsius**: K - 273.15
- **Kelvin to Fahrenheit**: (K - 273.15) × 9/5 + 32

## 🔍 Code Structure

- **HTML**: Semantic markup with accessibility considerations
- **CSS**: Modular approach using CSS variables for theming
- **JavaScript**:
  - Event-driven architecture
  - Separation of concerns
  - Efficient DOM manipulation
  - Local storage for persistent history

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

The layout adapts to different screen sizes while maintaining full functionality.

## 🚀 Future Enhancements

- Add more temperature units (Rankine, Réaumur)
- Implement user preferences (default units, history size)
- Add unit conversion charts
- Create a Progressive Web App (PWA)
- Add keyboard shortcuts

## 📝 License

MIT License - Feel free to use and modify this project for any purpose.

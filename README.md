# Financial Calculator

A comprehensive, feature-rich financial calculator web application for managing personal finance calculations. Built with pure HTML, CSS, and JavaScript - no frameworks required.

## Features

### 📊 13 Financial Calculators

- **Loan EMI Calculator** - Calculate monthly EMI for regular loans or interest-only loans with amortization schedule
- **Fixed Deposit Calculator** - Calculate FD returns with various compounding frequencies
- **Recurring Deposit Calculator** - Plan your RD investments
- **Inflation Calculator** - Understand inflation's impact on your money
- **Future Value Calculator** - Calculate future value of investments
- **Present Value Calculator** - Find present value of future cash flows
- **Simple Interest Calculator** - Basic interest calculations
- **Compound Interest Calculator** - Advanced compound interest with multiple frequencies
- **SIP Calculator** - Systematic Investment Plan with optional step-up
- **SWP Calculator** - Systematic Withdrawal Plan with sustainability analysis
- **Lumpsum Calculator** - One-time investment returns
- **CAGR Calculator** - Compound Annual Growth Rate
- **Emergency Fund Calculator** - Plan your emergency savings

### 🎯 Key Features

- ✅ **Loan Amortization Table** - Detailed month-by-month breakdown for loans
- ✅ **Chart.js Visualizations** - Pie charts for loan breakdowns, investment distributions
- ✅ **LocalStorage Persistence** - All inputs are automatically saved
- ✅ **JSON Import/Export** - Save and share your calculations
- ✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ✅ **Clean UI** - Minimal black & white theme
- ✅ **External Links** - Quick access to Tax Calculator and Advanced Investment Calculator

## Installation

1. Download all files to a folder:

   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

2. Open `index.html` in your web browser

That's it! No server or build process required.

## Usage

### Basic Calculator Usage

1. Select a calculator from the sidebar
2. Enter your values in the input fields
3. Click the "Calculate" button
4. View results in the results section
5. Charts will automatically generate where applicable

### Loan EMI Calculator

- Choose between Regular EMI or Interest-Only loan types
- Enter loan amount, interest rate, and tenure
- View detailed amortization schedule by clicking "Show Amortization Schedule"
- See visual breakdown with pie chart

### Emergency Fund Calculator

- Enter your monthly expenses
- Use the slider to select months of coverage (3-12 months)
- Results update automatically as you move the slider

### SIP/SWP Calculators

- Support for step-up investments/withdrawals
- Visual charts showing investment vs returns
- Detailed sustainability analysis for SWP

### Data Management

#### Export Data

1. Click "📥 Export" button in the sidebar
2. A JSON file will be downloaded with all your inputs
3. File includes timestamp for reference

#### Import Data

1. Click "📤 Import" button in the sidebar
2. Select a previously exported JSON file
3. All inputs will be restored automatically

## Technical Details

### Technologies Used

- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with CSS Grid, Flexbox, custom properties
- **JavaScript (ES6+)** - Calculations and interactivity
- **Chart.js** - Data visualization via CDN
- **LocalStorage API** - Data persistence

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### File Structure

```
financial-calculator/
├── index.html      # Main HTML structure
├── styles.css      # All styles and responsive design
├── script.js       # All JavaScript functionality
└── README.md       # Documentation
```

## Features in Detail

### LocalStorage Persistence

- All input fields are automatically saved as you type
- Active calculator tab is remembered
- Data persists across browser sessions
- No account or login required

### Responsive Design

- Desktop: Full sidebar with 2-column layout for results + charts
- Tablet: Collapsible sidebar, stacked layout
- Mobile: Hamburger menu, single column layout, touch-optimized

### Chart Visualizations

- **Pie Charts**: Loan breakdown, FD/RD distribution, SIP/SWP allocation
- **Interactive**: Hover for detailed values
- **Formatted**: Currency formatting in tooltips
- **Responsive**: Automatically adjusts to screen size

### Amortization Schedule

- Month-by-month payment breakdown
- Shows EMI, principal, interest, and remaining balance
- Scrollable table for long tenures
- Sticky header for easy reference
- Toggle visibility for cleaner interface

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --primary: #101010; /* Main color */
  --primary-hover: #222222; /* Hover state */
  --primary-light: #eef5ff; /* Light background */
  --text-dark: #1a1a1a; /* Dark text */
  --text-medium: #4a5568; /* Medium text */
  --text-light: #6b7280; /* Light text */
  --border: #e2e8f0; /* Border color */
  --bg: #f8fafc; /* Background */
}
```

### Adding New Calculators

1. Add HTML section in `index.html`
2. Add navigation item in sidebar
3. Add calculator title in `script.js` `calculatorTitles` object
4. Create calculation function in `script.js`
5. Add input field IDs to `saveInputs()` function

## Credits

### External Resources

- **Chart.js**: https://www.chartjs.org/
- **Google Fonts (Inter)**: https://fonts.google.com/

### External Links

- **Tax Calculator**: https://calculate-tax-on-salary.github.io/
- **Advanced Investment Calculator**: https://compound-interest-investment-calculator.github.io/

## License

Free to use for personal and commercial purposes. No attribution required.

## Support

For issues or suggestions:

1. Check that all files are in the same directory
2. Ensure JavaScript is enabled in your browser
3. Clear browser cache if experiencing issues
4. Check browser console for errors (F12)

## Version History

### Version 1.0.0 (Current)

- Initial release
- 13 calculators
- Amortization tables
- Chart.js integration
- LocalStorage persistence
- JSON import/export
- Responsive design
- Emergency fund calculator

## Future Enhancements (Potential)

- PDF export of calculations
- Print-friendly layouts
- More chart types (line charts for year-by-year growth)
- Currency selection
- Multi-language support
- Dark mode toggle
- Calculation history

---

**Built with ❤️ for better financial planning**

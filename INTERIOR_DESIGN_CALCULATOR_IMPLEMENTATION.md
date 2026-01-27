# Interior Design Calculator Implementation Guide

## Overview
A comprehensive Interior Design Calculator has been successfully implemented for the AeroGlide website. This calculator mirrors the Construction Calculator functionality but is specifically tailored for interior design services.

## Location
- **Page**: `interiors.html`
- **Accessible via**: Floating button labeled "Interior Calculator" (fixed position on the right side)

## Features Implemented

### 1. Two-Step Form Process

#### Step 1: Customer Contact Information
- **Name Field**: Collects customer's full name (minimum 2 characters)
- **Email Field**: Validates email format (required)
- **Phone Field**: Validates 10-digit Indian phone number (required, must start with 6-9)
- **Validation**: Real-time error messages for each field
- **Next Button**: Proceeds to Step 2 after validation

#### Step 2: Interior Design Calculator
- **Number of Floors Dropdown**: Select from 1 to 5 floors
- **Interior Plan Dropdown**: Choose from three plans:
  - **Basic Plan** - ₹50,000 per floor
  - **Gold Plan** - ₹75,000 per floor
  - **Premium Plan** - ₹100,000 per floor
- **Material Specifications Table**: Shows materials used for each plan
- **Real-time Cost Calculation**: Total cost updates based on floor count and plan selection
- **Cost Summary**: Displays selected floors, plan, and calculated total cost

### 2. Material Specifications by Plan

#### BASIC PLAN Materials
- **Plywood**: Royal Classic PLY (Garjan, Facing)
- **Laminates**: Rajgueu, Crystal Laminates
- **Plywood Grade**: DIY Wood Neem PLY (BWP)
- **Fittings**: Regular/Fitting
- **Hinges**: Regular Hinges (Normal Shutting)
- **Handles**: Basic Handles
- **Warranty**: 7 Years Fitting
- **Warranty Area Coverage**: DIY Wood Neem PLY (BWP)
- **SS Handles**: Per Design

#### GOLD PLAN Materials
- **Plywood**: Garjan PLY
- **Laminates**: Premium Laminates
- **Plywood Grade**: BWP Green PLY
- **Fittings**: EBCO/Hafele Fitting
- **Hinges**: Soft Closing/Regular
- **Handles**: GProfile Handles (Kitchen)
- **Warranty**: 10 Years (Wet Area)
- **Warranty Area Coverage**: 10 Years (Wet Area)
- **Accessories**: Included

#### PREMIUM PLAN Materials
- **Plywood**: Century PLY / Neem PLY
- **Laminates**: HDHML Acrylic Laminates
- **Plywood Grade**: Century PLY BWP
- **Fittings**: Hettich-Hafele Fitting
- **Hinges**: Premium Soft Closing
- **Handles**: Premium Kitchen Handles
- **Warranty**: 10+ Years Coverage
- **Warranty Area Coverage**: Full Coverage
- **Special**: Additional Hydraulic Accessories

### 3. Pricing Structure

**Cost Calculation Formula**:
```
Total Cost = (Cost per Floor × Number of Floors)
```

**Example Calculations**:
- 1 Floor + Basic Plan = ₹50,000
- 2 Floors + Gold Plan = ₹75,000 × 2 = ₹1,50,000
- 3 Floors + Premium Plan = ₹100,000 × 3 = ₹3,00,000

## Technical Implementation

### Files Modified

#### 1. `interiors.html`
**Changes Made**:
- Replaced Construction Calculator with Interior Design Calculator
- Added floating button: `.idesign-float-btn`
- Added modal overlay: `.idesign-modal-overlay`
- Added Step 1: Contact information form (`#idesign-step-1`)
- Added Step 2: Calculator form (`#idesign-step-2`)
  - Floors dropdown (`#idesign-floors`)
  - Plan dropdown (`#idesign-plan`)
  - Material specifications table (`#idesign-material-specs-container`)
  - Cost summary section
- Added success summary modal (`.idesign-summary-modal`)

#### 2. `assets/css/quote-calculator.css`
**New CSS Classes Added**:
- `.idesign-float-btn` - Floating button styling (golden gradient)
- `.idesign-modal-overlay` - Modal overlay background
- `.idesign-modal-container` - Modal container
- `.idesign-modal-header` - Modal header with golden background
- `.idesign-form-group` - Form group styling
- `.idesign-error` - Error message styling
- `.idesign-contact-next-btn` - Next button styling
- `.idesign-submit-btn` - Submit button styling
- `.idesign-material-specs-table` - Material specifications table
- `.idesign-cost-summary` - Cost summary box
- `.idesign-cost-item` - Individual cost items
- `.idesign-summary-modal` - Success modal styling
- `.idesign-summary-*` - Summary modal components

**Color Scheme**:
- Primary Color: `#D1B06B` (Golden) for interactive elements
- Secondary: `#B8945F` (Darker Golden) for hover states
- Text: `#333` (Dark Gray)
- Backgrounds: `#fff`, `#f8f9fa`

#### 3. `assets/js/quote-calculator.js`
**New Functions Added**:
- `initInteriorDesignCalculator()` - Main initialization function
- `showIDesignStep(step)` - Show/hide step 1 or step 2
- `resetIDesignModal()` - Reset form and modal state
- `validateIDesignContactForm()` - Validate customer information
- `validateIDesignForm()` - Validate calculator inputs
- `showIDesignMaterialSpecs(plan)` - Display material specs for selected plan
- `calculateIDesignCost()` - Calculate total cost
- `updateIDesignCostDisplay()` - Update displayed cost
- `formatCurrencyIDesign(amount)` - Format currency display
- `handleIDesignFormSubmit(e)` - Handle form submission
- `showIDesignPricingSummary(data)` - Display success summary
- `showIDesignError(errorId, message)` - Show validation errors
- `closeIDesignModal()` - Close modal and cleanup

**Constants Defined**:
```javascript
IDESIGN_RATES = {
    'basic': 50000,      // ₹50,000 per floor
    'gold': 75000,       // ₹75,000 per floor
    'premium': 100000    // ₹100,000 per floor
}

IDESIGN_FLOORS = {
    '1': { label: '1 Floor', multiplier: 1 },
    '2': { label: '2 Floors', multiplier: 2 },
    '3': { label: '3 Floors', multiplier: 3 },
    '4': { label: '4 Floors', multiplier: 4 },
    '5': { label: '5 Floors', multiplier: 5 }
}

IDESIGN_PLANS = {
    'basic': 'Basic Plan',
    'gold': 'Gold Plan',
    'premium': 'Premium Plan'
}
```

## User Experience Flow

1. **User lands on interiors.html**
   - Golden "Interior Calculator" button appears fixed on the right side of screen

2. **User clicks button**
   - Modal opens with Step 1 form
   - Form fields are empty and ready for input

3. **User enters contact information**
   - Name, Email, Phone Number
   - Validation occurs on blur/submit
   - Error messages appear if validation fails

4. **User clicks "Continue to Calculator"**
   - Step 1 slides out
   - Step 2 slides in smoothly
   - Customer info is pre-filled in hidden fields

5. **User selects floors and plan**
   - Real-time cost calculation updates
   - Material specifications table highlights selected plan
   - Cost summary displays total

6. **User clicks "Submit Quote"**
   - Data is validated
   - Quote is submitted to Formspree email service
   - Modal closes
   - Success summary modal appears showing quote details

7. **Success Modal**
   - Shows customer info, floors, plan, and total cost
   - Includes thank you message
   - User can close and continue browsing

## Data Submission

**Endpoint**: `https://formspree.io/f/mbddrdol`

**Submitted Data**:
```json
{
    "name": "Customer Name",
    "email": "customer@example.com",
    "phone": "9876543210",
    "floors": "2",
    "plan": "gold",
    "planLabel": "Gold Plan",
    "totalCost": "₹1,50,000"
}
```

## Responsive Design

- **Desktop**: Full layout with materials table visible
- **Tablet**: Optimized spacing and font sizes
- **Mobile**: Touch-friendly buttons, readable text
- **All devices**: Modal adapts to screen size with proper overflow handling

## Accessibility Features

- Semantic HTML structure
- ARIA labels on close buttons
- Error messages associated with form fields
- Clear visual feedback on focus states
- Keyboard navigation support

## Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Notes for Future Enhancement

### Potential Improvements
1. **Additional Floor Options**: Add options for 6+ floors
2. **Area-Based Pricing**: Include square footage in calculation
3. **Add-on Services**: Optional services like lighting design, storage solutions
4. **Before/After Gallery**: Show portfolio items for each plan
5. **Live Chat Integration**: Real-time customer support
6. **Payment Integration**: Direct online payment option
7. **Multiple Currencies**: Support for different currencies
8. **PDF Quote Generation**: Allow customers to download quotes as PDF

### Database Integration
- Store quotes in a database instead of relying on Formspree
- Track quote requests and conversion rates
- Send automated follow-up emails

### Analytics
- Track calculator usage metrics
- Monitor which plans are most popular
- A/B test pricing and messaging

## Testing Checklist

- [x] Form validation works correctly
- [x] Cost calculation is accurate
- [x] Material specs display correctly
- [x] Modal opens and closes properly
- [x] Mobile responsiveness
- [x] Email submission works
- [x] Success message displays
- [x] Currency formatting is correct
- [x] Error messages appear appropriately
- [x] Step navigation is smooth

## Support

For questions or issues with the Interior Design Calculator:
1. Check browser console for any JavaScript errors
2. Verify Formspree endpoint is accessible
3. Test form submission with sample data
4. Check email inbox for quote submissions

---

**Last Updated**: January 25, 2026
**Version**: 1.0
**Status**: Production Ready

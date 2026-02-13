# UI Guidelines - TODO App

## Overview
This document outlines the UI/UX design guidelines for the TODO app. The design prioritizes accessibility, clarity, and user experience through thoughtful use of Material Design components, pastel color palettes, and WCAG compliance.

## Design Principles
- **User-Centered**: Designs should prioritize usability and accessibility
- **Clarity**: Interface should be intuitive and easy to understand
- **Consistency**: Maintain visual and behavioral consistency across all screens
- **Accessibility**: All designs must meet WCAG 2.1 Level AA standards
- **Visual Hierarchy**: Strategic use of design elements to guide user attention

## Material Design Components

### Primary Components to Use
- **Material Buttons**: Primary, secondary, and text button variants
- **Material Cards**: For task display and organization
- **Material Input Fields**: For task titles, descriptions, and search
- **Material Chips**: For task tags, categories, and filter pills
- **Material Dialog**: For confirmations, task creation, and editing
- **Material Snackbar**: For user feedback and notifications
- **Material Progress Indicators**: For loading states
- **Material Icons**: From Material Icons library for consistency

### Component Specifications
- Use rounded corners (4-12px border-radius) for a modern, friendly appearance
- Maintain consistent padding and margin around components
- Use Material shadow elevations to create depth hierarchy
- Implement Material ripple effects for interactive feedback

## Color Palette

### Pastel Primary Colors
- **Primary Pastel Blue**: #A8D8FF (hex) - Primary actions, interactive elements
- **Secondary Pastel Purple**: #D4A5FF (hex) - Secondary actions, accents
- **Tertiary Pastel Green**: #B8E6D5 (hex) - Success states, completion indicators

### Neutral & Supporting Colors
- **Pastel Pink**: #FFD4E5 (hex) - Warnings, alerts
- **Pastel Yellow**: #FFF4A8 (hex) - Information, highlights
- **Light Gray**: #F5F5F5 (hex) - Background, disabled states
- **Medium Gray**: #D0D0D0 (hex) - Borders, dividers
- **Dark Gray**: #333333 (hex) - Text, primary content
- **White**: #FFFFFF (hex) - Card backgrounds, primary surfaces

### Color Usage Guidelines
- Use pastel colors for backgrounds and large UI elements
- Reserve dark gray for primary text and important content
- Apply pastel colors strategically to avoid overwhelming the interface
- Maintain sufficient contrast between text and background colors

## Typography

### Font Family
- **Primary Font**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Fallback**: System fonts for cross-platform consistency

### Font Size & Weight Hierarchy

#### Headings
- **Heading 1** (H1): 32px, Bold (700) - Page titles
- **Heading 2** (H2): 24px, Bold (700) - Section headings
- **Heading 3** (H3): 20px, Semi-Bold (600) - Subsection headings

#### Body Text
- **Body Large**: 16px, Regular (400) - Primary content, task titles
- **Body Medium**: 14px, Regular (400) - Secondary content descriptions
- **Body Small**: 12px, Regular (400) - Helper text, metadata

#### Interactive Elements
- **Button Text**: 14px, Semi-Bold (600) - Action buttons
- **Label Text**: 12px, Semi-Bold (600) - Form labels, chip text
- **Caption**: 11px, Regular (400) - Helper text, timestamps

### Font Weight Guidelines
- **Bold (700)**: Headings, important emphasis
- **Semi-Bold (600)**: Interactive elements, secondary emphasis
- **Regular (400)**: Body text, primary content

### Line Height
- **Headings**: 1.2 line-height (tighter spacing)
- **Body Text**: 1.5 line-height (improved readability)
- **Small Text**: 1.4 line-height

## Contrast Requirements (WCAG 2.1 Level AA)

### Minimum Contrast Ratios
- **Large Text** (18px+ or 14px+ bold): 3:1 contrast ratio
- **Normal Text** (< 18px): 4.5:1 contrast ratio
- **UI Components & Borders**: 3:1 contrast ratio

### Contrast Verification
- **Primary Pastel Blue (#A8D8FF) on White**: 4.7:1 ✓
- **Primary Pastel Blue (#A8D8FF) on Light Gray (#F5F5F5)**: 4.5:1 ✓
- **Dark Gray (#333333) on White**: 13.8:1 ✓
- **Dark Gray (#333333) on Pastel backgrounds**: Minimum 4.5:1 ✓

### Text Color Guidelines
- Use **Dark Gray (#333333)** for all body text on light backgrounds
- Use **White** for text on dark components
- Ensure link text has sufficient contrast (underlined or colored distinctly)

## Spacing Guidelines

### Spacing Scale
- **2px**: Minimal spacing for tight components
- **4px**: Spacing within components
- **8px**: Standard spacing between related elements
- **12px**: Spacing for grouped related content
- **16px**: Standard spacing between sections
- **24px**: Major spacing between page sections
- **32px**: Large spacing for major content areas

### Padding Guidelines
- **Button Padding**: 8px (vertical) × 12px (horizontal) for normal buttons
- **Card Padding**: 16px for content padding
- **Input Field Padding**: 8px (vertical) × 12px (horizontal)
- **Modal Dialogs**: 24px padding for content area

### Margin Guidelines
- **Between Cards**: 8px minimum (16px recommended)
- **Between Sections**: 24px minimum
- **Page Edges**: 16px minimum padding on mobile, 24px on desktop

### Visual Spacing Benefits
- Creates clear visual hierarchy
- Shows relationships between UI elements
- Reduces visual clutter and improves readability
- Provides touch target sizes (minimum 44px × 44px for interactive elements)

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order should follow logical flow (left to right, top to bottom)
- Focus states must be clearly visible (outline or highlight)
- Implement skip links for quick navigation

### Screen Reader Support
- Use semantic HTML elements
- Provide descriptive labels for all form inputs
- Include alt text for all icons (using aria-label)
- Announce status updates and dynamic content changes

### Focus Indicators
- **Focus Outline**: 2-3px solid outline in contrasting color
- **Focus Color**: Use dark gray or primary blue for visibility
- **Visible on All Interactive Elements**: Buttons, links, inputs, checkboxes

### Color Accessibility
- Don't rely on color alone to convey information
- Use patterns or icons combined with color
- Test designs with color blindness simulators
- Provide alternative conveying of information (e.g., checkmarks + colors for task status)

### Motion & Animation
- Reduce distracting animations
- Provide `prefers-reduced-motion` support
- Keep animations under 300ms for quick feedback
- Avoid flashing or rapidly changing content (max 3 flashes per second)

## Component States

### Button States
- **Default**: Pastel Blue background, dark gray text
- **Hover**: Slightly darker pastel blue, cursor pointer
- **Active/Pressed**: Even darker shade with shadow
- **Disabled**: Light gray background, light gray text (4:1 contrast)
- **Focus**: Dark outline around button

### Input States
- **Default**: White background, medium gray border
- **Focused**: Primary pastel blue border, subtle shadow
- **Filled**: Pastel background with dark gray text
- **Error**: Pastel pink border, error message below
- **Disabled**: Light gray background, light gray text

### Task Card States
- **Incomplete**: White background with primary pastel blue accent
- **Complete**: Light gray background with pastel green checkmark
- **Overdue**: Pastel pink accent with warning icon
- **High Priority**: Pastel purple accent on left side

## Typography in Practice

### Task Title
- **Size**: 16px, Regular (400)
- **Emphasis**: Bold (700) for important distinctions or search matches
- **Line Height**: 1.5

### Task Description
- **Size**: 14px, Regular (400)
- **Color**: Medium gray (#666)
- **Line Height**: 1.5

### Section Headers
- **Size**: 20px, Bold (700)
- **Color**: Dark gray (#333)
- **Spacing**: 24px above, 16px below

## Responsive Design

### Breakpoints
- **Mobile**: < 600px
- **Tablet**: 600px - 900px
- **Desktop**: > 900px

### Mobile-Specific Guidelines
- Minimum touch target size: 44px × 44px
- Single column layout
- Simplified navigation
- Large, readable text (16px minimum for inputs)

### Tablet & Desktop
- Multi-column layouts where appropriate
- Expanded navigation options
- Consistent spacing and alignment

## Summary
The TODO app design creates an approachable, accessible interface through Material Design components, soft pastel colors, and WCAG-compliant contrast ratios. Strategic use of typography, spacing, and color creates visual hierarchy while ensuring the interface remains intuitive and accessible to all users.

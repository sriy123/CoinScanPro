# Coin Recognition App - Design Guidelines

## Design Approach
**Selected System:** Material Design with inspiration from Google Lens and modern financial apps
**Justification:** Material Design excels at image-heavy applications with strong visual feedback, perfect for a utility app that needs to clearly present visual results and data.

## Core Design Elements

### A. Typography
- **Primary Font:** Inter via Google Fonts (clean, modern, excellent readability)
- **Headings:** Inter Bold - text-2xl to text-4xl for main titles
- **Body Text:** Inter Regular - text-base for descriptions and details
- **Data Display:** Inter Medium - text-lg for coin values and currency amounts
- **Labels:** Inter Medium - text-sm for form labels and metadata
- **Currency Symbols:** Inter SemiBold - text-xl for prominent value display

### B. Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8, etc.)
- Consistent 4-unit (1rem) rhythm for component spacing
- 8-unit (2rem) spacing between major sections
- 2-unit (0.5rem) for tight groupings within components
- 6-unit (1.5rem) for comfortable internal padding

**Container Strategy:**
- Max-width: max-w-4xl for main content area
- Full-width hero: w-full with centered content
- Card-based layout with consistent border-radius-lg

### C. Component Library

#### Upload Interface
**Hero Section (min-h-[60vh]):**
- Centered upload zone with prominent dashed border
- Large upload icon (w-16 h-16)
- Primary CTA: "Upload Coin Image" button with icon
- Secondary action: "Use Camera" button for mobile
- Drag-and-drop visual feedback with border color change
- Supported formats text: "JPG, PNG, HEIC up to 10MB"

**Upload Zone Design:**
- Dashed border with generous padding (p-8)
- Icon-first layout: upload cloud icon above text
- Two-line instructional text: "Drop your coin image here" / "or click to browse"
- Responsive: Shrinks to p-6 on mobile with smaller icon

#### Results Display Section
**Coin Preview Card:**
- Uploaded image display (max-w-md, rounded-lg with subtle shadow)
- Image positioned on left side on desktop, top on mobile
- Equal visual weight between image and data

**Identification Results Panel:**
- Card layout with border and background contrast
- Structured data presentation:
  - Coin Type: Large heading (text-2xl)
  - Country of Origin: With flag emoji or small country icon
  - Denomination: Prominent display (text-xl)
  - Year: If detected, shown as metadata (text-sm)
  - Confidence Score: Subtle indicator (text-xs with icon)

**Information Hierarchy:**
```
Level 1: Coin name/type (most prominent)
Level 2: Denomination and country
Level 3: Additional metadata (year, material, etc.)
Level 4: Confidence indicators
```

#### Currency Conversion Section
**Conversion Panel:**
- Card with distinct visual separation from identification results
- Two-column layout on desktop (origin currency | target currency)
- Dropdown selector with flag icons for currency selection
- Large display of converted amounts (text-3xl, bold)
- Real-time conversion as currency changes
- "Last updated" timestamp (text-xs)

**Currency Selector:**
- Searchable dropdown with common currencies at top
- Flag icons next to currency codes
- Format: "USD - United States Dollar"
- Popular currencies: USD, EUR, GBP, INR, JPY, CNY, AUD, CAD, CHF

**Conversion Display:**
- From: Original coin value with currency symbol
- Arrow/equals sign separator
- To: Converted value with target currency symbol
- Exchange rate shown below in smaller text

#### Navigation/Header
- Minimal top bar with app name and logo (h-16)
- "New Scan" button always accessible in header
- History icon (if implementing saved scans)
- Clean, unobtrusive design that prioritizes content

#### Action Buttons
**Primary Actions:**
- Upload button: Solid fill with icon + text
- Convert button: Solid fill for primary conversion
- Generous padding: px-6 py-3
- Clear hover states with subtle scale

**Secondary Actions:**
- Reset/Clear button: Outlined style
- Share results: Ghost button with icon

#### Empty States
- Friendly illustration or icon
- Clear call-to-action
- Helpful message: "Upload your first coin image to get started"

#### Loading States
- Skeleton screens for image analysis
- Spinner with progress text: "Analyzing coin..." / "Converting currency..."
- Smooth transitions between states

### D. Animations
**Minimal, Purposeful Motion:**
- Image upload: Gentle fade-in (200ms)
- Results reveal: Slide-up animation (300ms ease-out)
- Currency conversion: Number count-up effect (400ms)
- Loading spinner: Smooth rotation
- NO complex scroll animations or parallax effects

## Images

**Hero Background (Optional Enhancement):**
- Subtle background: Blurred collection of various international coins
- Low opacity overlay to maintain text readability
- Should not distract from upload interface

**Coin Display:**
- User-uploaded coin images shown at appropriate size (max 400px width)
- Maintain aspect ratio with object-fit-contain
- Shadow and border treatment for depth

**Empty State Illustration:**
- Simple line art of coins or camera icon
- Friendly, approachable style
- Size: w-48 h-48 centered

**Flag Icons:**
- Small (w-6 h-6) next to currency codes
- Use emoji flags or SVG flag library via CDN

## Layout Structure

**Single-Page Application Flow:**
1. Hero section with upload interface (centered, prominent)
2. Results section (appears after upload, max-w-4xl centered)
3. Currency conversion panel (below results, full-width card)
4. Simple footer with credits and links

**Responsive Behavior:**
- Desktop (lg): Two-column layout for results + conversion side-by-side
- Tablet (md): Stacked layout with full-width cards
- Mobile: Single column, touch-optimized upload targets

**Visual Hierarchy Through Spacing:**
- Hero to results: py-8 gap
- Between result cards: gap-6
- Within cards: p-6 internal spacing
- Section padding: py-12 on desktop, py-8 on mobile
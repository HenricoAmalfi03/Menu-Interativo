# Design Guidelines: Sistema de Cardápio Digital

## Design Approach
**Selected System:** Material Design with food delivery app influences (iFood, Uber Eats)
**Rationale:** Utility-focused restaurant ordering requires fast browsing, clear product presentation, and efficient checkout. Material Design provides robust patterns for both customer and admin interfaces while maintaining visual appeal for food photography.

## Core Design Principles
1. **Speed First:** Every interaction optimized for quick ordering
2. **Visual Appetite:** Product images drive engagement and decisions
3. **Dual Interface Clarity:** Distinct but cohesive customer and admin experiences
4. **Mobile-Primary:** Optimized for table-side ordering on smartphones

---

## Color Palette

### Customer Interface
- **Primary:** 15 85% 45% (vibrant orange-red - appetite-stimulating)
- **Primary Hover:** 15 85% 40%
- **Background (Light):** 0 0% 98%
- **Background (Dark):** 240 8% 12%
- **Card Background (Dark):** 240 6% 16%
- **Success (Order Sent):** 142 76% 36%

### Admin Interface
- **Primary:** 220 90% 50% (professional blue)
- **Primary Hover:** 220 90% 45%
- **Warning (Promotions):** 38 92% 50%
- **Danger (Delete):** 0 84% 60%

### Neutral Palette (Both)
- **Text Primary (Light):** 0 0% 10%
- **Text Primary (Dark):** 0 0% 95%
- **Text Secondary (Light):** 0 0% 45%
- **Text Secondary (Dark):** 0 0% 65%
- **Border (Light):** 0 0% 88%
- **Border (Dark):** 240 4% 25%

---

## Typography

### Font Families
- **Primary:** 'Inter' via Google Fonts (interface, body text)
- **Display:** 'Poppins' via Google Fonts (product names, headings)

### Scale
- **Hero/Product Names:** text-2xl font-semibold (Poppins)
- **Section Headings:** text-xl font-semibold (Poppins)
- **Body/Descriptions:** text-base font-normal (Inter)
- **Labels:** text-sm font-medium (Inter)
- **Prices:** text-lg font-bold (Poppins)
- **Meta/Helper:** text-xs font-normal (Inter)

---

## Layout System

### Spacing Primitives
Consistent use of Tailwind units: **2, 4, 6, 8, 12, 16**
- Tight spacing: p-2, gap-2
- Component spacing: p-4, gap-4
- Section spacing: p-6, py-8
- Page margins: px-4, py-12

### Grid Structure
- **Product Grid:** grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- **Admin Dashboard:** grid-cols-1 lg:grid-cols-4 (sidebar + content)
- **Forms:** max-w-2xl mx-auto

---

## Component Library

### Customer Interface Components

**1. Product Card**
- Image: aspect-ratio-square, rounded-lg, object-cover
- Overlay gradient for price visibility
- Product name, description (2 lines max, truncate)
- Price badge: absolute bottom-right, rounded-full
- Add to cart button: primary color, rounded-full, shadow
- Promotion tag: absolute top-left, warning color

**2. Shopping Cart (Floating)**
- Fixed bottom or slide-in drawer
- Badge with item count on cart icon
- Mini product list with quantity controls
- Total price prominent
- "Finalizar Pedido" button always visible

**3. Category Navigation**
- Horizontal scroll tabs (mobile)
- Active state: border-bottom-2, primary color
- Sticky header below main nav

**4. Checkout Form**
- Single-column layout, max-w-2xl
- Input fields: border, rounded-lg, p-4, focus:ring
- Waiter selection: grid of cards with photos
- Payment method: radio buttons with icons
- WhatsApp button: success color, w-full, rounded-lg

### Admin Interface Components

**1. Dashboard Cards**
- Statistics: grid-cols-2 md:grid-cols-4
- Icons from Heroicons
- Large numbers, small labels
- Subtle border, hover:shadow transition

**2. Data Tables**
- Striped rows, hover:bg effect
- Action buttons: icon-only, minimal
- Pagination at bottom
- Search/filter bar at top

**3. Form Modals**
- Centered overlay, max-w-3xl
- Close button: absolute top-right
- Form sections with clear labels
- Image URL preview
- Action buttons: right-aligned, gap-2

**4. Sidebar Navigation**
- Fixed left, w-64, border-right
- Logo at top
- Menu items: rounded-lg hover states
- Active: primary background, white text
- Logout at bottom

---

## Interactions & States

### Buttons
- Primary: bg-primary, text-white, rounded-lg, px-6, py-3
- Outline: border-2, border-primary, text-primary, hover:bg-primary/10
- Icon buttons: p-2, rounded-full, hover:bg-gray-100

### Forms
- Focus: ring-2, ring-primary
- Error: border-red-500, text-red-500 helper text
- Disabled: opacity-50, cursor-not-allowed

### Cards
- Default: border, rounded-lg, hover:shadow-lg transition
- Selected: border-primary, border-2

---

## Images

### Product Images
- **Aspect Ratio:** 1:1 (square)
- **Placement:** Top of product cards, full width
- **Treatment:** rounded-t-lg, object-cover, h-48
- **Fallback:** Gray placeholder with utensils icon

### Waiter Photos
- **Aspect Ratio:** 1:1
- **Placement:** Selection grid in checkout
- **Treatment:** rounded-full, w-20, h-20, border-2
- **Fallback:** Avatar icon on primary background

### Admin Preview
- **Size:** max-h-32, auto width
- **Treatment:** rounded-lg, object-contain, border

**Note:** No large hero images needed - this is a utility app focused on product browsing.

---

## Responsive Behavior

### Mobile (< 768px)
- Single column layouts
- Bottom navigation/cart
- Full-width forms
- Stack admin sidebar as hamburger menu

### Tablet (768px - 1024px)
- 2-column product grid
- Side-drawer cart
- Condensed admin sidebar

### Desktop (> 1024px)
- 3-column product grid
- Fixed admin sidebar
- Modal forms centered

---

## Accessibility
- Dark mode support throughout
- ARIA labels on all interactive elements
- Keyboard navigation for forms
- Sufficient color contrast (WCAG AA)
- Focus indicators visible on all focusable elements
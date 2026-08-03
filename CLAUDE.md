# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JavaScript website for FishingVietnam.com - a luxury fly fishing and eco-tourism business in Vietnam. No build process, framework-free, deployed directly to Amplify hosting.

## Working Directory

All development happens in `/source-main/`. This is the root for all HTML pages, assets, and resources.

## Architecture

### Page Structure (7 HTML files)
- `index.html` - Homepage with hero, features, packages
- `about-us.html` - Company story and team
- `our-services.html` - Service packages with pricing
- `booking-now.html` - Booking form with package selection
- `contact-us.html` - Contact form
- `gallery.html` - Full gallery with video/image filtering
- `testimonials.html` - Customer testimonials

### JavaScript Modules (Vanilla JS, No Framework)

**`assets/js/navigate.js`** (51 lines)
- Mobile hamburger menu
- Breakpoint: 768px
- Body scroll lock when menu open
- Auto-close on resize to desktop

**`assets/js/gallery.js`** (170 lines)
- Gallery data array: `{ image, type, size, link, platform }`
- Filter tabs: All, Image, Video
- Lightbox for full-screen view
- Video platforms: YouTube (`/embed/{id}`), Facebook (`/plugins/video.php`)
- Play icon overlay on video thumbnails

**`assets/js/booking.js`** (308 lines)
- **Handles both booking AND contact forms** (shared module)
- Google Forms integration via fetch `mode: 'no-cors'`
- Package selection system with URL params (`?package=basic|platinum|platinum-elite`)
- Form validation: email regex, phone format (10+ chars)
- Toast notifications (4s timeout)
- Entry IDs mapped to Google Form fields:
  ```javascript
  name: 'entry.2005620554'
  email: 'entry.1045781291'
  phone: 'entry.1166974658'
  package: 'entry.1065046570'
  date: 'entry.328235797'
  adults: 'entry.199525734'
  children: 'entry.864399001'
  message: 'entry.839337160'
  ```

**`assets/js/testimonials.js`** (151 lines)
- Testimonials data array: `{ name, date, avatar, quote, link }`
- Dynamic DOM rendering with `document.createElement()`
- Currently 10 testimonials loaded

### CSS Architecture

**Design System:** `assets/css/styleguide.css` (100 lines)
- CSS custom properties (`:root` variables)
- Color scheme:
  - Primary: `--primaryprimary-700` (dark blue #0C2E45)
  - Secondary: `--secondarysecondary-700` (gold #D5AA44)
  - Background: `--background` (#06243E)
- Typography:
  - Headings: Canela Deck (custom serif, local files)
  - Body: Montserrat (Google Fonts)

**Global Styles:** `assets/css/globals.css` (563 lines)
- Font-face declarations for Canela Deck (12 font files)
- Navbar and footer (shared across pages)
- Hamburger menu responsive styles
- Container/grid utilities
- Media queries: 1550px, 1200px, 1023px, 768px

**Page-Specific CSS:** 5 files (440-1,322 lines each)
- Each page has dedicated stylesheet
- BEM-like class naming (`.home .hero-section`, `.about-us .team-grid`)

### Fonts

**Local (Custom):** Canela Deck family in `assets/fonts/`
- 12 OTF files: Thin, Light, Regular, Medium, Bold, Black (+ italics)
- Imported via `@font-face` in `globals.css`

**CDN:** Google Fonts
- Montserrat (weights 100-900, italic variants)
- Roboto (multiple weights)
- Coiny (accent font)

## Key Development Patterns

### Adding Gallery Items
Edit `assets/js/gallery.js`:
```javascript
const galleryData = [
  {
    image: 'assets/images/thumbnail.jpg',  // Preview image
    type: 'image',  // or 'video'
    size: 'normal',  // or 'large' (spans 2 columns)
    link: 'VIDEO_ID',  // YouTube ID only
    platform: 'youtube'  // or 'facebook' (needs full URL for FB)
  }
]
```

### Adding Testimonials
Edit `assets/js/testimonials.js`:
```javascript
const testimonials = [
  {
    name: 'Customer Name',
    date: 'DD/MM/YYYY',
    avatar: 'assets/images/avatar.png',
    quote: 'Review text...',
    link: 'https://facebook.com/share/...'
  }
]
```

### Package Selection Flow
1. User clicks "BOOK NOW" on service card → `booking-now.html?package=platinum`
2. `booking.js` reads URL param via `URLSearchParams`
3. `selectPackageTab()` activates correct tab
4. Updates `.booking-section` class to show package-specific content
5. On submit, includes package label in Google Form

### Form Submission Architecture
Both forms use **same Google Form endpoint** with conditional field population:
- **Booking form:** Fills all 8 fields (name, email, phone, package, date, adults, children, message)
- **Contact form:** Fills 4 fields (name, email, phone, message) + `package: 'Contact Form Inquiry'`
- Empty fields are skipped (not sent) to avoid 400 errors
- Success triggers notification + form reset

### Google Forms Entry ID Mapping
To update form integration:
1. Open Google Form in edit mode
2. Right-click → "View page source"
3. Search for `entry.` to find field IDs
4. Update `GOOGLE_FORM_FIELDS` object in `booking.js`

## Responsive Design

**Breakpoints:**
- Desktop: >768px (full navbar)
- Mobile: ≤768px (hamburger menu)

**Mobile Menu Behavior:**
- Hamburger icon appears at 768px
- Menu slides in from left
- Body scroll disabled when open
- Click outside or on link closes menu

## File Organization

```
source-main/
├── *.html (7 pages)
├── assets/
│   ├── css/
│   │   ├── globals.css (shared: navbar, footer, fonts)
│   │   ├── styleguide.css (design system variables)
│   │   └── [page].css (page-specific styles)
│   ├── js/
│   │   ├── navigate.js (mobile menu)
│   │   ├── gallery.js (gallery + lightbox)
│   │   ├── booking.js (forms + Google integration)
│   │   └── testimonials.js (testimonial rendering)
│   ├── images/ (150+ files: JPG, PNG, SVG)
│   └── fonts/ (12 Canela Deck OTF files)
```

## Deployment

**No build step required.** Files deploy directly to Amplify hosting.

To deploy changes:
1. Edit files in `source-main/`
2. Commit to git
3. Push to repository (Amplify auto-deploys)

## Common Modifications

### Changing Colors
Edit CSS variables in `assets/css/styleguide.css`:
```css
:root {
  --primaryprimary-700: rgba(12, 46, 69, 1);  /* Dark blue */
  --secondarysecondary-700: rgba(213, 174, 68, 1);  /* Gold */
}
```

### Adding New Page
1. Create `new-page.html` in `source-main/`
2. Create `assets/css/new-page.css`
3. Link stylesheets: `globals.css`, `styleguide.css`, `new-page.css`
4. Include scripts: `navigate.js` (for navbar)
5. Add navbar link in all existing pages

### Updating Packages/Pricing
Edit `our-services.html` pricing section and `booking.js` PACKAGE_LABELS:
```javascript
const PACKAGE_LABELS = {
  'basic': 'Kayak Adventures',  // $200
  'platinum': 'Platinum Fishing Experience',  // $300
  'platinum-elite': 'Premium Elite Expedition'  // $500
};
```

## Technical Constraints

- **No npm/build tools** - Pure static files
- **No bundling** - Scripts loaded via `<script src="">`
- **No transpilation** - ES6+ must be supported by target browsers
- **No CSS preprocessors** - Native CSS only
- **CORS workaround** - Google Forms uses `mode: 'no-cors'`
- **Image optimization** - Manual (150+ images, no lazy loading)

## Code Style

- **JavaScript:** ES6+ with DOMContentLoaded wrappers
- **CSS:** BEM-like naming, mobile-first media queries
- **HTML:** Semantic tags, descriptive class names
- **Indentation:** Consistent (appears to be 4 spaces)
- **Comments:** Section headers in JS/CSS with `=====`

# Customization Guide

Learn how to customize Zugzwang to match your brand identity and business needs.

---

## Table of Contents

1. [Brand Colors](#brand-colors)
2. [Logo and Favicon](#logo-and-favicon)
3. [Store Information](#store-information)
4. [Contact Details](#contact-details)
5. [Social Media Links](#social-media-links)
6. [Homepage Customization](#homepage-customization)
7. [Navigation Menus](#navigation-menus)
8. [SEO Configuration](#seo-configuration)
9. [Advanced Customization](#advanced-customization)

---

## Brand Colors

### Method 1: Environment Variables (Recommended)

Add to your `.env.local`:

```env
NEXT_PUBLIC_PRIMARY_COLOR=#2563eb
NEXT_PUBLIC_SECONDARY_COLOR=#7c3aed
```

### Method 2: Tailwind Configuration

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Your primary brand color
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#7c3aed", // Your secondary accent color
          foreground: "#ffffff"
        }
      }
    }
  }
}
```

### Color Recommendations:

- **Primary**: Main brand color (buttons, links, highlights)
- **Secondary**: Accent color (CTAs, special elements)
- Use tools like [Coolors](https://coolors.co/) or [Adobe Color](https://color.adobe.com/) to generate harmonious palettes

---

## Logo and Favicon

### Add Your Logo

1. Place your logo file in `/public/`:
   - `logo.png` or `logo.svg` (recommended SVG for scalability)
   - Recommended size: 200x50px (adjust as needed)

2. Update environment variable:
```env
NEXT_PUBLIC_LOGO_PATH=/logo.svg
```

### Add Your Favicon

1. Place favicon files in `/public/`:
   - `favicon.ico` (32x32px)
   - `apple-touch-icon.png` (180x180px)
   - `favicon-32x32.png`
   - `favicon-16x16.png`

2. These are automatically detected by Next.js

### Generate Favicons

Use [Real Favicon Generator](https://realfavicongenerator.net/) to create all required sizes from a single image.

---

## Store Information

Edit `.env.local`:

```env
# Store Details
NEXT_PUBLIC_STORE_NAME="Your Store Name"
NEXT_PUBLIC_STORE_LEGAL_NAME="Your Company LLC"
NEXT_PUBLIC_STORE_DESCRIPTION="Brief description of your store"

# Business Address
NEXT_PUBLIC_BUSINESS_STREET="123 Main Street"
NEXT_PUBLIC_BUSINESS_CITY="San Francisco"
NEXT_PUBLIC_BUSINESS_STATE="CA"
NEXT_PUBLIC_BUSINESS_ZIP="94102"
NEXT_PUBLIC_BUSINESS_COUNTRY="US"

# Operating Hours
NEXT_PUBLIC_BUSINESS_HOURS="Mon-Fri 9AM-5PM PST"
```

---

## Contact Details

```env
# Email Addresses
NEXT_PUBLIC_SUPPORT_EMAIL=support@yourstore.com
NEXT_PUBLIC_SALES_EMAIL=sales@yourstore.com
NEXT_PUBLIC_GENERAL_EMAIL=hello@yourstore.com

# Phone Numbers
NEXT_PUBLIC_PHONE_MAIN=1-800-555-0100
NEXT_PUBLIC_PHONE_SUPPORT=1-800-555-0101
NEXT_PUBLIC_PHONE_INTL=+1-415-555-0100

# Support Information
NEXT_PUBLIC_SUPPORT_HOURS="24/7 Support Available"
NEXT_PUBLIC_RESPONSE_TIME="We respond within 24 hours"
```

---

## Social Media Links

```env
NEXT_PUBLIC_SOCIAL_FACEBOOK=https://facebook.com/yourstore
NEXT_PUBLIC_SOCIAL_INSTAGRAM=https://instagram.com/yourstore
NEXT_PUBLIC_SOCIAL_TWITTER=https://twitter.com/yourstore
NEXT_PUBLIC_SOCIAL_YOUTUBE=https://youtube.com/@yourstore
NEXT_PUBLIC_SOCIAL_PINTEREST=https://pinterest.com/yourstore
NEXT_PUBLIC_SOCIAL_LINKEDIN=https://linkedin.com/company/yourstore
NEXT_PUBLIC_SOCIAL_TIKTOK=https://tiktok.com/@yourstore
```

---

## Homepage Customization

### Hero Section

Edit `src/lib/config/wadesdesign.config.ts`:

```typescript
export const CONTENT = {
  home: {
    hero: {
      title: "Your Compelling Headline",
      subtitle: "Supporting tagline that explains your value proposition",
      cta: {
        primary: "Shop Now",
        secondary: "Learn More"
      }
    }
  }
}
```

### Featured Products

Set featured products in Shopify:
1. Go to **Products** in Shopify Admin
2. Edit a product
3. Add tag: `featured`
4. Featured products automatically display on homepage

### Collections Showcase

Featured collections are loaded from Shopify automatically. To customize which collections appear:

1. **Method A**: Update in Shopify Admin
   - Tag collections with `featured`

2. **Method B**: Hardcode in config
   ```typescript
   // src/lib/config/wadesdesign.config.ts
   export const FEATURED_COLLECTIONS = [
     'all',
     'new-arrivals',
     'best-sellers',
     'sale'
   ];
   ```

---

## Navigation Menus

### Create Menus in Shopify

1. Go to **Online Store > Navigation** in Shopify Admin
2. Create two menus:
   - **Main Menu** (handle: `main-menu`) - Header navigation
   - **Footer** (handle: `footer`) - Footer links

### Configure Menu Handles

```env
SHOPIFY_MAIN_MENU_HANDLE=main-menu
SHOPIFY_FOOTER_MENU_HANDLE=footer
```

### Recommended Main Menu Structure:

```
Home
Shop
  - All Products
  - Collections
  - New Arrivals
  - Sale
About
Blog
Contact
```

### Recommended Footer Menu Structure:

```
About Us
Contact
Shipping & Returns
Privacy Policy
Terms of Service
```

---

## SEO Configuration

### Basic SEO Settings

```env
# Meta Tags
NEXT_PUBLIC_SEO_TITLE_TEMPLATE="%s | Your Store Name"
NEXT_PUBLIC_SEO_DEFAULT_TITLE="Your Store - Quality Products Online"
NEXT_PUBLIC_SEO_DESCRIPTION="Shop premium products with fast shipping and excellent customer service"

# Keywords (comma-separated)
NEXT_PUBLIC_SEO_KEYWORDS="online store,quality products,fast shipping"
```

### Open Graph Images

1. Create an OG image (1200x630px)
2. Save as `/public/og-image.jpg`
3. Set in environment:
```env
NEXT_PUBLIC_OG_IMAGE=/og-image.jpg
```

### Structured Data

The template automatically generates Schema.org structured data. To customize:

Edit `src/lib/config/wadesdesign.config.ts`:

```typescript
export const BUSINESS = {
  // Business Schema.org data
  type: "Store", // or "OnlineStore", "LocalBusiness", etc.
  priceRange: "$$", // $ = budget, $$ = moderate, $$$ = expensive
  rating: {
    value: 4.8,
    count: 1250
  }
}
```

---

## Advanced Customization

### Typography

Edit `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

Don't forget to import fonts in `src/app/layout.tsx`.

### Layout Customization

Edit template files in:
- `src/components/layout/header/` - Header components
- `src/components/layout/footer.tsx` - Footer component
- `src/app/layout.tsx` - Root layout

### Component Variants

The template uses `shadcn/ui` components. Customize them:

```bash
# Example: Customize button variants
npm run dev
# Edit: src/components/ui/button.tsx
```

### Adding Custom Pages

1. Create file: `src/app/(content)/your-page/page.tsx`
2. Add to navigation menu in Shopify Admin
3. Page auto-loads with proper layout

### Custom Sections

Create reusable sections in:
- `src/components/sections/` - Homepage sections
- `src/components/features/` - Feature-specific components

### Styling Best Practices

1. **Use Tailwind utilities** for consistent spacing and colors
2. **Follow the design system** in `wadesdesign.config.ts`
3. **Maintain responsive design** - test on mobile, tablet, desktop
4. **Keep accessibility** - semantic HTML, ARIA labels, keyboard navigation

---

## Theme Presets

### Minimal Theme
```env
NEXT_PUBLIC_PRIMARY_COLOR=#000000
NEXT_PUBLIC_SECONDARY_COLOR=#666666
```

### Vibrant Theme
```env
NEXT_PUBLIC_PRIMARY_COLOR=#ec4899
NEXT_PUBLIC_SECONDARY_COLOR=#8b5cf6
```

### Professional Theme
```env
NEXT_PUBLIC_PRIMARY_COLOR=#1e40af
NEXT_PUBLIC_SECONDARY_COLOR=#059669
```

---

## Testing Your Customizations

1. **Development Testing**:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

2. **Build Testing**:
   ```bash
   npm run build
   npm run start
   ```

3. **Lint Check**:
   ```bash
   npm run lint
   ```

---

## Need Help?

- **Documentation**: See [CLAUDE.md](CLAUDE.md) for architecture details
- **Issues**: [GitHub Issues](https://github.com/byronwade/Zugzwang/issues)
- **Community**: [GitHub Discussions](https://github.com/byronwade/Zugzwang/discussions)

---

**Pro Tip**: Always test customizations locally before deploying to production. Use version control to track your changes.

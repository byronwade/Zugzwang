# Shopify Bulk Product Seeding & Cleanup

Complete guide for stress testing your Zugzwang storefront with thousands of realistic products using Shopify's Admin GraphQL API bulk operations.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Usage](#usage)
- [What Gets Created](#what-gets-created)
- [Performance](#performance)
- [Cleanup](#cleanup)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

---

## Overview

The Zugzwang seeding system allows you to bulk-create thousands of test products in your Shopify store for stress testing, development, and demos. It uses Shopify's [Bulk Operations API](https://shopify.dev/docs/api/usage/bulk-operations/imports) for efficient, rate-limit-friendly product creation.

### Features

- **Bulk Product Creation**: Create 100 to 10,000+ products efficiently
- **Product Variants**: 1-8 variants per product (size, color, material)
- **Real Images**: Lorem Picsum images with product identification
- **Inventory Tracking**: Random stock levels (0-500 units per variant)
- **Custom Metafields**: Rating, featured status, specifications
- **Smart Collections**: Auto-populate by department/category tags
- **Content Pages**: About, Customer Service, Shipping, Deals, FAQ
- **Navigation Menu**: Nested mega menu linking collections and pages
- **Performance Metrics**: Track timing, memory usage, API calls
- **Easy Cleanup**: Remove all seeded data with one command

### Product Mix

The seeder creates a realistic e-commerce mix across 8 departments:

1. **Electronics** - Audio, Computers, Cameras, Accessories
2. **Fashion & Apparel** - Men's, Women's, Shoes, Accessories
3. **Home & Garden** - Kitchen, Bedroom, Garden, Decor
4. **Sports & Outdoors** - Fitness, Cycling, Camping, Water Sports
5. **Beauty & Personal Care** - Skincare, Makeup, Hair, Fragrance
6. **Books & Media** - Fiction, Non-Fiction, Children's, Ebooks
7. **Toys & Games** - Action Figures, Board Games, Educational, Outdoor
8. **Automotive** - Interior, Exterior, Tools, Electronics

---

## Prerequisites

### 1. Shopify Development Store

You need a Shopify store with [development store](https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores) privileges or a store where you're comfortable creating test data.

### 2. Create a Custom App

You need a **custom app** with Admin API access. Follow these steps:

1. Go to **Shopify Admin** → **Settings** → **Apps and sales channels**
2. Click **Develop apps** (or **App and sales channel settings** → **Develop apps**)
3. Click **Create an app**
4. Name it: `Zugzwang Seeding Tool`
5. Click **Configuration** tab → **Admin API integration**
6. Configure **Admin API access scopes**:

#### Required Scopes

```
✅ write_products          # Create and update products
✅ write_publications      # Publish products to Online Store
✅ write_content           # Create pages
✅ write_online_store_navigation  # Create navigation menus
```

7. Click **Save**
8. Click **Install app** to install it to your store
9. Click **Reveal token once** and copy the **Admin API access token**
10. Save this token securely - you'll need it for `SHOPIFY_ADMIN_ACCESS_TOKEN`

---

## Setup

### 1. Environment Variables

Add the Admin API access token to your `.env.local` file:

```bash
# Required for seeding scripts
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# These should already exist in your .env.local:
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
```

### 2. Verify Installation

Ensure you have Node.js 18+ installed:

```bash
node --version  # Should be v18.0.0 or higher
```

### 3. Test the Setup

Run a small test to verify everything works:

```bash
npm run seed:shopify:small
```

This will create 100 products. If successful, you're ready to stress test!

---

## Usage

### Available Scripts

| Script | Products | Use Case |
|--------|----------|----------|
| `npm run seed:shopify` | 1,000 (default) | Standard testing |
| `npm run seed:shopify:small` | 100 | Quick verification |
| `npm run seed:shopify:medium` | 1,000 | Standard stress test |
| `npm run seed:shopify:large` | 5,000 | Heavy stress test |
| `npm run seed:shopify:xl` | 10,000 | Extreme stress test |
| `npm run cleanup:shopify` | - | Remove all seeded data |

### Basic Usage

#### 1. Seed Products

```bash
# Create 1,000 products with default settings
npm run seed:shopify:medium
```

**What happens:**
1. Creates 40+ smart collections (departments + subcategories)
2. Creates 5 content pages (About, Customer Service, etc.)
3. Generates 1,000 products with variants, images, metafields
4. Stages JSONL upload to Shopify S3
5. Runs bulk productSet mutation
6. Polls until completion (shows progress dots)
7. Bulk publishes products + collections to Online Store
8. Creates navigation menu
9. Outputs performance report

**Expected time:**
- 100 products: ~30 seconds
- 1,000 products: ~2-3 minutes
- 5,000 products: ~8-12 minutes
- 10,000 products: ~15-25 minutes

#### 2. View Seeded Products

1. Go to **Shopify Admin** → **Products**
2. Filter by tag: `seed:test`
3. Browse your test products

#### 3. Set Up Navigation

1. Go to **Shopify Admin** → **Online Store** → **Navigation**
2. Edit your **Header menu**
3. Replace menu items with: **zugzwang-main-nav**
4. Save

Now your storefront will display the nested mega menu with all departments and subcategories.

#### 4. Clean Up

When you're done testing, remove all seeded data:

```bash
npm run cleanup:shopify
```

You'll be prompted to confirm before deletion. Type `yes` to proceed.

---

## What Gets Created

### Products

Each product includes:

- **Title**: Generated from department-specific nouns + adjectives
- **Vendor**: Random brand from realistic brand list
- **Product Type**: Department name (e.g., "Electronics")
- **Description**: HTML description with features
- **Price**: $10 - $460 (random)
- **Compare At Price**: 15% chance of having a compare-at price
- **SKU**: Unique identifier: `SKU-{seed}-{variant-index}`
- **Barcode**: Generated from seed and variant index
- **Tags**:
  - `dept:{department}` (e.g., `dept:electronics`)
  - `cat:{department}:{subcategory}` (e.g., `cat:electronics:audio`)
  - `seed:test` (for easy cleanup)
  - `featured` (20% chance)
  - `sale` (10% chance)
- **Variants**: 1-8 variants per product
  - Size, Color, Material options based on department
  - Individual pricing per variant
  - Random inventory (0-500 units)
  - Unique images per variant
- **Images**: Lorem Picsum with seed-based generation (consistent images)
- **Metafields**:
  - `custom.rating` (number_decimal): 3.0 - 5.0
  - `custom.featured` (boolean): true/false
  - `custom.specifications` (json): weight, dimensions, warranty
- **SEO**:
  - Optimized title and meta description
  - Product-specific keywords

### Collections

**40+ Smart Collections** created:

#### Department Collections (8 total)
- Electronics
- Fashion & Apparel
- Home & Garden
- Sports & Outdoors
- Beauty & Personal Care
- Books & Media
- Toys & Games
- Automotive

#### Subcategory Collections (32 total)
Each department has 4 subcategories. Examples:
- Electronics → Audio, Computers, Cameras, Accessories
- Fashion → Men's, Women's, Shoes, Accessories
- Home → Kitchen, Bedroom, Garden, Decor

**Smart Collection Logic:**
Collections auto-populate using tag-based rules. For example:
- "Electronics" collection includes all products with tag `dept:electronics`
- "Electronics · Audio" includes all products with tag `cat:electronics:audio`

### Pages

**5 Content Pages** created:

1. **About Us** (`/pages/about-us`)
   - Company mission and values

2. **Customer Service** (`/pages/customer-service`)
   - Support contact information
   - Email, phone, live chat details

3. **Shipping & Returns** (`/pages/shipping-returns`)
   - Shipping policies
   - 30-day return policy

4. **Deals & Promotions** (`/pages/deals`)
   - Current offers and sales
   - Newsletter signup CTA

5. **FAQ** (`/pages/faq`)
   - Common customer questions
   - Order tracking, payments, international shipping

### Navigation Menu

**"zugzwang-main-nav"** - Nested mega menu with:

```
Shop by Category (dropdown)
  → Electronics
    → Audio
    → Computers
    → Cameras
    → Accessories
  → Fashion & Apparel
    → Men's Clothing
    → Women's Clothing
    → Shoes
    → Accessories
  → [6 more departments with subcategories]
Deals
Customer Service
Shipping & Returns
FAQ
About
```

---

## Performance

### Seeding Performance

The bulk operations API is highly efficient:

| Products | API Calls | Time | Memory |
|----------|-----------|------|--------|
| 100 | ~15 calls | ~30s | +5MB |
| 1,000 | ~20 calls | ~2-3min | +15MB |
| 5,000 | ~25 calls | ~8-12min | +40MB |
| 10,000 | ~30 calls | ~15-25min | +80MB |

**Why is it so fast?**
- Uses Shopify's bulk mutation API (1 API call for all products)
- JSONL staging on Shopify's S3 infrastructure
- Asynchronous processing by Shopify
- No rate limit concerns (bulk ops have separate limits)

### Cleanup Performance

| Products | Time |
|----------|------|
| 100 | ~20s |
| 1,000 | ~2min |
| 5,000 | ~10min |
| 10,000 | ~20min |

---

## Cleanup

### What Gets Deleted

The cleanup script removes:
- ✅ All products tagged with `seed:test`
- ✅ All collections with seeded handles
- ✅ All pages created by the seeder
- ✅ The navigation menu `zugzwang-main-nav`

### Safety Features

1. **Confirmation Prompt**: You must type `yes` to proceed
2. **Tag-Based Deletion**: Only deletes products with `seed:test` tag
3. **Handle-Based Filtering**: Collections/pages matched by specific handles
4. **Progress Reporting**: Shows deletion progress in real-time

### Manual Cleanup (If Needed)

If the cleanup script fails, you can manually delete:

1. **Products**: Filter by tag `seed:test` → Select all → Delete
2. **Collections**: Search for "Electronics", "Fashion", etc. → Delete individually
3. **Pages**: Look for "about-us", "customer-service", etc. → Delete
4. **Menu**: Navigation → Delete "zugzwang-main-nav"

---

## Troubleshooting

### Issue: "Missing environment variables"

**Error:**
```
❌ Missing environment variables:
   SHOPIFY_ADMIN_ACCESS_TOKEN
```

**Solution:**
1. Verify `SHOPIFY_ADMIN_ACCESS_TOKEN` is in `.env.local`
2. Check that the token starts with `shpat_`
3. Ensure no extra spaces or quotes around the value

---

### Issue: "GraphQL error: Unauthorized"

**Error:**
```
GraphQL error: HTTP 401
```

**Solution:**
1. Verify your Admin API access token is correct
2. Check that your custom app has the required scopes:
   - `write_products`
   - `write_publications`
   - `write_content`
   - `write_online_store_navigation`
3. Ensure the app is installed to your store

---

### Issue: "Bulk operation failed: FAILED"

**Error:**
```
Bulk mutation failed: FAILED ACCESS_DENIED
```

**Solution:**
1. Check that your Shopify plan supports bulk operations (all paid plans do)
2. Verify your API access token has write permissions
3. Ensure you're not running multiple bulk operations simultaneously
4. Wait 30 seconds and try again (Shopify allows 1 bulk mutation at a time)

---

### Issue: "No 'Online Store' publication found"

**Error:**
```
No 'Online Store' publication found.
```

**Solution:**
1. Ensure the Online Store sales channel is enabled:
   - Go to **Shopify Admin** → **Sales channels**
   - Add **Online Store** if not present
2. If using a development store, Online Store should be enabled by default

---

### Issue: Seeding is slow

**Solution:**
1. This is normal for large product counts (10,000+)
2. Monitor progress via dots printed during polling
3. Consider using smaller product counts for faster testing
4. Do not interrupt the script - bulk operations cannot be cancelled

---

### Issue: Cleanup deletes too much

**Prevention:**
The cleanup script is designed to only delete seeded resources. However:

1. **Backup your store** before running cleanup on production
2. Review what will be deleted in the confirmation prompt
3. Use a development store for testing

---

### Issue: Images not loading

**Cause:**
Lorem Picsum URLs are placeholder images and may occasionally be unavailable.

**Solution:**
1. Images are generated with consistent seeds, so they should persist
2. If an image is missing, it's likely a Lorem Picsum service issue
3. For production, replace Lorem Picsum with your own image URLs in `shopify-helpers.mjs`:

```javascript
export function generateProductImage(text, seed, width = 800, height = 800) {
  // Replace with your image CDN
  return `https://your-cdn.com/products/${seed}.jpg`;
}
```

---

### Issue: "Too Many Requests" error

**Cause:**
Rate limiting on the Admin API (non-bulk endpoints).

**Solution:**
1. Bulk operations don't have this issue for product creation
2. For cleanup, the script includes automatic rate limiting (2 calls/second)
3. If you still hit limits, wait 10 seconds and retry

---

## Advanced Configuration

### Custom Product Count

Set any product count via environment variable:

```bash
PRODUCT_COUNT=2500 node scripts/seed-shopify-products.mjs
```

### Customize Product Data

Edit `scripts/utils/shopify-helpers.mjs` to customize:

1. **Product names**: Modify `adjectives` and `nouns` arrays
2. **Price range**: Change `Math.random() * 450 + 10` in `generateProductData()`
3. **Inventory levels**: Modify `randomInt(0, 500)` in `generateVariants()`
4. **Brands**: Edit the `brands` array
5. **Image source**: Replace `generateProductImage()` function

### Add Custom Departments

Edit `DEPARTMENTS` array in `scripts/seed-shopify-products.mjs`:

```javascript
const DEPARTMENTS = [
  {
    title: "Custom Department",
    tag: "dept:custom",
    subcats: [
      { title: "Subcategory 1", tag: "cat:custom:sub1" },
      { title: "Subcategory 2", tag: "cat:custom:sub2" },
    ],
  },
  // ... existing departments
];
```

### Debug Mode

To see full GraphQL responses, edit `scripts/utils/shopify-helpers.mjs`:

```javascript
export async function gql(store, token, query, variables = {}) {
  // ... existing code
  const json = await response.json();

  // Add this line:
  console.log(JSON.stringify(json, null, 2));

  // ... rest of function
}
```

### Save JSONL Files

Product data is automatically saved to:
- `products.jsonl` - All product input data
- `publish.jsonl` - Publishing operations

These files are useful for debugging and can be viewed in any text editor.

---

## API Reference

### Shopify API Version

Scripts use **Admin API 2025-10** by default. Update in `scripts/utils/shopify-helpers.mjs`:

```javascript
const API_VERSION = "2025-10";
```

### GraphQL Mutations Used

1. **productSet** - Batch create/update products
2. **collectionCreate** - Create smart collections
3. **pageCreate** - Create content pages
4. **menuCreate** - Create navigation menus
5. **publishablePublish** - Publish to Online Store
6. **productDelete** - Delete products (cleanup)
7. **collectionDelete** - Delete collections (cleanup)
8. **pageDelete** - Delete pages (cleanup)
9. **menuDelete** - Delete menus (cleanup)

### GraphQL Queries Used

1. **publications** - Get Online Store publication ID
2. **products** - List products by tag (cleanup)
3. **collections** - List collections (cleanup)
4. **pages** - List pages (cleanup)
5. **shop.navigationMenus** - List menus (cleanup)
6. **currentBulkOperation** - Poll bulk operation status

---

## Best Practices

1. **Use Development Stores**: Always test on development stores first
2. **Start Small**: Test with 100 products before creating 10,000
3. **Monitor Performance**: Check script output for timing and memory usage
4. **Clean Up Regularly**: Run cleanup after each test session
5. **Backup Production**: Never run seeding on production without backup
6. **Check Rate Limits**: If hitting limits, increase sleep times in scripts

---

## Resources

- [Shopify Bulk Operations Guide](https://shopify.dev/docs/api/usage/bulk-operations/imports)
- [Admin GraphQL API Reference](https://shopify.dev/docs/api/admin-graphql)
- [Custom App Setup](https://help.shopify.com/en/manual/apps/app-types/custom-apps)
- [Access Scopes](https://shopify.dev/docs/api/usage/access-scopes)

---

## Support

For issues specific to Zugzwang seeding:
1. Check this documentation first
2. Review script logs for error details
3. Open an issue on GitHub

For Shopify API issues:
- [Shopify Developer Forums](https://community.shopify.com/c/shopify-apis-and-sdks/bd-p/shopify-apis-and-technology)
- [Shopify Support](https://help.shopify.com)

---

**Happy stress testing! 🚀**

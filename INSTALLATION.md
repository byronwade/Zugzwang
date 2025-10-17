# Installation Guide

Complete step-by-step guide to set up Zugzwang with your Shopify store.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18.x or later** installed
- **npm**, **pnpm**, or **yarn** package manager
- A **Shopify store** (any plan)
- Basic familiarity with command line operations

---

## Part 1: Clone and Install

### 1. Clone the Repository

```bash
git clone https://github.com/byronwade/Zugzwang.git
cd Zugzwang
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm (faster):
```bash
pnpm install
```

Using yarn:
```bash
yarn install
```

---

## Part 2: Shopify Configuration

### 1. Get Your Storefront Access Token

#### Option A: Create a Custom App (Recommended)

1. Go to your Shopify Admin
2. Navigate to **Settings > Apps and sales channels**
3. Click **Develop apps**
4. Click **Create an app**
5. Name it "Zugzwang Storefront" (or any name you prefer)
6. Click **Create app**

#### Configure API Scopes:

1. Click **Configuration**
2. Under **Storefront API**, click **Configure**
3. Enable these scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
4. Click **Save**

#### Get Your Access Token:

1. Click **API credentials** tab
2. Under **Storefront API access token**, click **Install app**
3. Click **Install** to confirm
4. Copy the **Storefront API access token** (starts with no prefix)
5. **Important**: Save this token securely - you won't be able to see it again

### 2. Get Your Store Domain

Your store domain is: `your-store-name.myshopify.com`

Find it in:
- Shopify Admin > **Settings > Domains**
- Look for the "Primary domain" ending in `.myshopify.com`

---

## Part 3: Authentication Setup (Optional)

If you want customer account features (login, orders, account management), set up Shopify Customer Account OAuth:

### 1. Create a Customer Account App

1. In Shopify Admin, go to **Settings > Customer accounts**
2. Enable **New customer accounts**
3. Go to **Settings > Apps and sales channels > Develop apps**
4. Create a new app or use your existing one
5. Go to **Configuration > Customer Account API**
6. Click **Configure**

### 2. Configure OAuth

1. Add your callback URL:
   ```
   http://localhost:3000/api/auth/callback/shopify
   ```
   (Replace with your production domain when deploying)

2. Copy these credentials:
   - **Shop ID** (numeric ID from URL: `admin.shopify.com/store/YOUR_SHOP_ID`)
   - **Client ID** (starts with `shp_`)
   - **Client Secret** (keep this secret!)

---

## Part 4: Environment Variables

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Configure Required Variables

Edit `.env.local` and add your Shopify credentials:

```env
# ============================================
# REQUIRED: Shopify Store Configuration
# ============================================
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

# ============================================
# REQUIRED: Application URLs
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
```

### 3. Configure Authentication (Optional)

If you completed Part 3, add these:

```env
# ============================================
# OPTIONAL: Customer Account OAuth
# ============================================
SHOPIFY_SHOP_ID=your_numeric_shop_id
NEXT_PUBLIC_SHOPIFY_SHOP_ID=your_numeric_shop_id
SHOPIFY_CLIENT_ID=shp_your_client_id
SHOPIFY_CLIENT_SECRET=your_client_secret

# Generate a secure random string for NEXTAUTH_SECRET:
NEXTAUTH_SECRET=your_secure_random_string_here
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Optional Customization Variables

```env
# ============================================
# OPTIONAL: Branding
# ============================================
NEXT_PUBLIC_STORE_NAME="Your Store Name"
NEXT_PUBLIC_PRIMARY_COLOR="#2563eb"
NEXT_PUBLIC_SECONDARY_COLOR="#7c3aed"

# ============================================
# OPTIONAL: Analytics
# ============================================
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## Part 5: Verify Installation

### 1. Run Development Server

```bash
npm run dev
```

### 2. Test Your Store

Open http://localhost:3000 in your browser and verify:

- ✅ Homepage loads
- ✅ Products display (if you have products in Shopify)
- ✅ Collections work
- ✅ Search functionality
- ✅ Cart operations (add/remove items)

### 3. Troubleshooting

#### "Cannot connect to Shopify"
- Verify your `SHOPIFY_STORE_DOMAIN` is correct
- Ensure your Storefront API token has the required scopes
- Check that your custom app is installed

#### "Products not loading"
- Ensure products are published to "Online Store" sales channel
- Verify collections exist and have products
- Check API scopes include `unauthenticated_read_product_listings`

#### "Authentication not working"
- Verify callback URL matches exactly: `http://localhost:3000/api/auth/callback/shopify`
- Ensure `SHOPIFY_SHOP_ID` is the numeric ID, not the domain
- Check `SHOPIFY_CLIENT_ID` starts with `shp_`
- Verify `NEXTAUTH_SECRET` is set

---

## Part 6: Production Deployment

See [README.md](README.md#deployment) for deployment instructions to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Self-hosted

---

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/byronwade/Zugzwang/issues)
- **Discussions**: [GitHub Discussions](https://github.com/byronwade/Zugzwang/discussions)
- **Email**: byronwade@example.com

---

**Next Steps**: Once installed, see [CUSTOMIZATION.md](CUSTOMIZATION.md) to customize your store's branding and theme.

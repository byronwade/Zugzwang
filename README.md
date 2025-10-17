# Zugzwang

**A modern, production-ready Next.js 16 + Shopify Storefront template** showcasing the latest web technologies and best practices for building high-performance e-commerce experiences.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Shopify](https://img.shields.io/badge/Shopify-Storefront_API-96bf48?logo=shopify)](https://shopify.dev/api/storefront)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### Core Technologies
- **Next.js 16 (Latest)** - App Router, Turbopack, React Compiler, Partial Prerendering
- **React 19** - Server Components, Streaming, Suspense
- **TypeScript 5.9** - Strict mode with comprehensive type safety
- **Tailwind CSS** - Utility-first styling with custom design system
- **shadcn/ui** - Beautiful, accessible components built on Radix UI

### Shopify Integration
- **Storefront API 2024-01** - Complete product, collection, and cart management
- **Customer Account OAuth** - Secure authentication with NextAuth
- **Dynamic Metafields** - Configure content directly from Shopify Admin
- **Real-time Cart** - Server Actions for cart operations
- **Image Optimization** - Automatic CDN optimization for all product images

### Developer Experience
- **Turbopack** - Lightning-fast builds and Hot Module Replacement
- **Biome** - Fast, unified linter and formatter (via Ultracite preset)
- **Strict TypeScript** - Type-safe development with zero `any` types
- **Environment Variables** - Comprehensive configuration system
- **Bundle Analyzer** - Built-in bundle size analysis

### Performance
- **Partial Prerendering (PPR)** - Instant page loads with `cacheComponents`
- **React Compiler** - Automatic memoization and optimization
- **Image Optimization** - AVIF/WebP with responsive sizes
- **ISR Caching** - Intelligent cache strategies with granular revalidation
- **Code Splitting** - Dynamic imports for optimal bundle sizes

### SEO & Accessibility
- **Dynamic Metadata** - Configurable SEO for all pages
- **Structured Data** - Schema.org JSON-LD for rich snippets
- **OpenGraph & Twitter Cards** - Optimized social sharing
- **WCAG AA Compliant** - Semantic HTML, ARIA labels, keyboard navigation
- **Sitemap & Robots.txt** - Dynamic generation from Shopify data

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm, pnpm, or yarn
- A Shopify store with Storefront API access

### 1. Clone the Repository
```bash
git clone https://github.com/byronwade/Zugzwang.git
cd Zugzwang
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your Shopify credentials:

```bash
cp .env.example .env.local
```

**Required variables:**
```env
# Shopify Store Configuration
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token

# Application URLs
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Customer Account OAuth (Optional - for authentication)
SHOPIFY_SHOP_ID=your_shop_id
SHOPIFY_CLIENT_ID=your_client_id
SHOPIFY_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

See **[INSTALLATION.md](INSTALLATION.md)** for detailed setup instructions.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

---

## 📖 Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Detailed setup guide with Shopify configuration
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Theme customization and branding
- **[docs/SHOPIFY_METAFIELD_SETUP.md](docs/SHOPIFY_METAFIELD_SETUP.md)** - Dynamic content configuration
- **[CLAUDE.md](CLAUDE.md)** - Architecture overview and development guidelines

---

## 🎨 Customization

Zugzwang is designed to be easily customizable:

### Brand & Colors
Configure your brand via environment variables:
```env
NEXT_PUBLIC_STORE_NAME="Your Store"
NEXT_PUBLIC_PRIMARY_COLOR="#2563eb"
NEXT_PUBLIC_SECONDARY_COLOR="#7c3aed"
```

### Theme Configuration
All hardcoded content has been moved to `src/lib/config/wadesdesign.config.ts` with environment variable support:
- Business information
- Contact details
- Social media links
- Store features
- SEO metadata

### Dynamic Content
Load content dynamically from Shopify metafields:
- Homepage hero sections
- Product page layouts
- Collection descriptions
- Custom page builders

See **[CUSTOMIZATION.md](CUSTOMIZATION.md)** for complete theming guide.

---

## 🛠️ Commands

```bash
# Development
npm run dev              # Start with Turbopack (port 3000)
npm run dev:legacy       # Start without Turbopack
npm run scan             # Development with React Scan for performance analysis

# Building
npm run build            # Production build with Turbopack
npm run build:legacy     # Production build without Turbopack
npm run build:analyze    # Build with bundle analyzer
npm run start            # Start production server

# Code Quality
npm run lint             # Check code quality with Biome
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Biome
npm run type-check       # TypeScript validation

# Maintenance
npm run clean            # Clean .next and cache directories
```

---

## 📁 Project Structure

```
zugzwang/
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (account)/          # Protected account routes
│   │   ├── (content)/          # Public content (blog, pages)
│   │   ├── (products)/         # E-commerce routes
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── features/           # Feature-specific components
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── providers/          # React Context providers
│   │   ├── sections/           # Page sections
│   │   └── ui/                 # shadcn/ui primitives
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── actions/            # Server Actions
│   │   ├── api/shopify/        # Shopify API integration
│   │   ├── auth/               # Authentication utilities
│   │   ├── config/             # Configuration files
│   │   └── utils/              # Utility functions
│   └── types/                  # TypeScript definitions
├── public/                     # Static assets
├── auth.ts                     # NextAuth configuration
├── middleware.ts               # Route protection & security headers
└── next.config.ts              # Next.js configuration
```

---

## 🔐 Authentication

Zugzwang uses **Shopify Customer Account OAuth** with NextAuth for secure authentication:

1. **Create Shopify App** with Customer Account API scopes
2. **Configure OAuth Callback**: `https://yourdomain.com/api/auth/callback/shopify`
3. **Set Environment Variables**: `SHOPIFY_SHOP_ID`, `SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET`
4. **Protected Routes**: `/account/*` automatically secured by middleware

See **[INSTALLATION.md](INSTALLATION.md)** for detailed authentication setup.

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Other Platforms
Zugzwang works on any platform that supports Next.js 16:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Self-hosted

**Important:** Set all required environment variables on your hosting platform.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style (Biome enforced)
- Add TypeScript types for all new code
- Test changes locally before submitting PR
- Update documentation for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - The React Framework
- [Shopify Storefront API](https://shopify.dev/api/storefront) - E-commerce platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [NextAuth.js](https://next-auth.js.org/) - Authentication solution

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/byronwade/Zugzwang/issues)
- **Discussions**: [GitHub Discussions](https://github.com/byronwade/Zugzwang/discussions)
- **Email**: byronwade@example.com

---

## 🗺️ Roadmap

- [ ] Shopify Hydrogen compatibility layer
- [ ] Multi-language support (i18n)
- [ ] Advanced product filtering
- [ ] Wishlist sync with Shopify
- [ ] Customer reviews integration
- [ ] Advanced analytics dashboard
- [ ] Headless CMS integration options

---

**Made with ❤️ by [Byron Wade](https://github.com/byronwade)**

**Star ⭐ this repo if you find it helpful!**

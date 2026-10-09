# MoStore
E-commerce for every one

A Pinterest-style shopping experience built with Next.js 15, React 19 and Tailwind CSS 4.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's here

- **Masonry feed** (`/`): browse products as pins, filter by category, search from the header
- **Product close-up** (`/product/[id]`): details plus a "More like this" feed
- **Saved** (`/saved`): everything you've hit Save on
- **Cart** (`/cart`): adjust quantities, see subtotal (checkout coming soon)

Product data is a mock catalog in `src/lib/products.ts` with placeholder images from picsum.photos. Saves and cart persist in `localStorage`.

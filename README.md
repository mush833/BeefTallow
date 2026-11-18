# Vallore — TallowCraft Shopify Theme

A complete, 1:1 Shopify theme rebuild of the **TallowCraft / Vallore** base44 site
(`tallow-craft-labs.base44.app`). Every page of the base44 app is rebuilt as native
Shopify Liquid, organized into the standard Shopify theme folder structure so it can be
pushed to GitHub and connected to a Shopify store (Online Store → Themes → Add from GitHub,
or via the Shopify CLI).

Every file begins with a comment block naming **exactly which Shopify page it maps to**.

## Folder structure

```
assets/      theme.css, theme.js  (all styling + all interactivity)
config/      settings_schema.json, settings_data.json  (brand colors, fonts, theme settings)
layout/      theme.liquid (master wrapper), password.liquid (password-page wrapper)
locales/     en.default.json  (translation strings)
sections/    all page sections (home + product long-form + cart/collection/search/blog/etc.)
snippets/    price.liquid, icon-star.liquid  (reusable partials)
templates/   JSON + Liquid templates — one per Shopify page type
```

## Page mapping (template → Shopify page)

| Shopify page (theme nav)        | Template file                     | Section(s) it renders |
|---------------------------------|-----------------------------------|-----------------------|
| **Home page**                   | `templates/index.json`            | home-hero → agitation → solution → angle-stories → ingredients → reviews → final-cta |
| **Products**                    | `templates/product.json`          | product-hero (buy box) → benefit-cards → why-it-works → results → how-to-use → angle-stories → comparison → reviews → guarantee → faq → final-cta |
| **Collections**                 | `templates/collection.json`       | main-collection |
| **Collections list**            | `templates/list-collections.json` | main-list-collections |
| **Gift card**                   | `templates/gift_card.liquid`      | (standalone) |
| **Cart**                        | `templates/cart.json`             | main-cart |
| **Pages** (default)             | `templates/page.json`             | main-page |
| **Our Story**                   | `templates/page.about.json`       | page-about |
| **Contact**                     | `templates/page.contact.json`     | page-contact (Shopify contact form) |
| **FAQ**                         | `templates/page.faq.json`         | product-faq (reused) |
| **Track Order**                 | `templates/page.track.json`       | page-track |
| **Blogs**                       | `templates/blog.json`             | main-blog |
| **Blog posts**                  | `templates/article.json`          | main-article |
| **Search**                      | `templates/search.json`           | main-search |
| **Password**                    | `templates/password.liquid`       | (wrapped by `layout/password.liquid`) |
| **404**                         | `templates/404.json`              | main-404 |

**Checkout & customer accounts:** Checkout is not theme-editable on standard Shopify plans
(it's configured in Settings → Checkout), and customer-account pages use Shopify's built-in
defaults. The base44 site had no custom account pages, so none are overridden here.

## Setup after import

1. Create the product (e.g. *Vallore™ Tallow Face Balm*) with 3 variants: **1 Jar, 2 Jars, 3 Jars**.
2. Open the **Product template** in the theme editor and paste each variant's **Variant ID**
   into the matching bundle tier (Product — Hero / Buy Box → tier blocks).
3. Create Pages and assign the custom templates (About → `page.about`, Contact → `page.contact`,
   FAQ → `page.faq`, Track → `page.track`).
4. Upload product/ingredient/result images in each section's block settings.
5. All copy, pricing, reviews, and the 3 brand angles are pre-filled as section defaults —
   editable from the theme customizer, no code needed.

## Brand system (in `config/settings_schema.json`)

- Cream `#F4ECDF` · White `#FFFFFF` · Light cream `#FBF4E8`
- Dark brown `#20140C` · Gold `#C2863F` / `#D7A463` · CTA `#3A2414` on `#F3E9DB`
- Headings **Fraunces** · Body **Inter** (loaded via Google Fonts in `layout/theme.liquid`)

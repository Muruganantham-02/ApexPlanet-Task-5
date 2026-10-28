# ShopEase — ApexPlanet Task 5

A responsive demo e-commerce website built using HTML, CSS and vanilla JavaScript.

## Features
- Product search
- Category and maximum-price filters
- Sorting by featured order, price, and rating
- Add-to-cart, quantity controls, remove item, and subtotal
- Cart persists in browser localStorage
- Responsive layout for desktop, tablet, and mobile
- Lazy-loaded product images (`loading="lazy"`, `decoding="async"`)
- Accessible labels, keyboard Escape-to-close cart, skip link, reduced-motion support
- Minified CSS and JavaScript are used by `index.html`

## Files
- `index.html` — page structure
- `style.css` — readable source CSS
- `script.js` — readable source JavaScript
- `style.min.css` — minified stylesheet used by the page
- `script.min.js` — minified JavaScript used by the page

## Run in VS Code
1. Extract the ZIP file.
2. Open the extracted `ApexPlanet-Task-5-Ecommerce` folder in VS Code.
3. Optional: install the **Live Server** extension.
4. Right-click `index.html` → **Open with Live Server**.
5. Or double-click `index.html` to open it in Chrome/Edge.

Internet is needed for the product photos because they are loaded from Unsplash. The core UI and sample product data are local.

## Customize
- Edit the `products` array in `script.js` to change products, prices, ratings, categories, and image URLs.
- Edit text/branding in `index.html`.
- Edit design tokens at the top of `style.css`.

## Performance / compatibility checklist
- CSS and JavaScript minified files are linked in HTML.
- Product images use lazy loading and async decoding.
- Image dimensions are set to reduce layout shift.
- No external JavaScript libraries or fonts are required.
- Responsive breakpoints: 1000px, 700px, 390px.
- Test manually in Chrome, Firefox, Safari (if available), Edge, and mobile view.
- In Chrome/Edge DevTools, inspect Console for errors and use Lighthouse / Performance to review loading.
- Test search, filters, sorting, add-to-cart, quantity updates, remove, refresh persistence, and mobile layout.

## Important
This is a front-end demo only. It does not connect to a real product database, user account, payment gateway, or shipping service. Checkout deliberately displays a demo message and does not take payment.
.product {
    color: black;
    margin: 10px;
}
.product{color:black;margin:10px}

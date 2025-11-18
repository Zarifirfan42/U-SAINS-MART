# USM Marketplace (Front-end Prototype)

This project delivers a multi-page marketplace experience for Universiti Sains Malaysia students. It is fully client-side and uses `localStorage` to mock authentication, listings, cart, messaging, and admin workflows.

## Features
- User auth: register, login/logout, role-aware nav, profile editing.
- Seller tools: add/edit/delete listings with image preview, personal listings dashboard.
- Buyer tools: search/filter/sort catalog, product details page, reporting flow, cart + checkout with payment method selector.
- Communication: inbox stream, lightweight chat mock, report handling with admin panel controls.
- Extras: responsive UI, reusable nav/footer, toast notifications, requirements page for easy sharing.

## Tech Stack
- HTML5 multi-page layout
- Vanilla CSS (`styles.css`) with custom theme (primary `#4C1D95`)
- ES modules (`js/` folder) + `localStorage` mock database

## Getting Started
1. Clone or download the repository (suggested name: `usm-marketplace`).
2. Open `index.html` in any modern browser. All pages share the same assets.

Default accounts (seeded in localStorage):
- Admin - `admin@usm.edu` / `admin123`
- Student - `zarifirfan@student.usm.my` / `student123`

## Folder Structure
```
.
|-- assets/placeholder.svg
|-- js/
|   |-- auth.js
|   |-- cart.js
|   |-- main.js
|   |-- messages.js
|   |-- mock-data.js
|   |-- page-handlers.js
|   |-- products.js
|   |-- storage.js
|   `-- ui.js
|-- styles.css
|-- *.html (multi-page views)
`-- README.md
```

## Sharing with Friends / GitHub
- Publish the folder to GitHub (e.g., `github.com/<you>/usm-marketplace`).
- Include `requirements.html` when sharing so teammates know the marking rubric.
- Deploy easily with GitHub Pages: enable Pages -> serve from `main` branch root.

Happy building and iterating!

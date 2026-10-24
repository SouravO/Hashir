# Hashir Usman portfolio

A responsive React portfolio built with Vite, Tailwind CSS v4, DM Sans, and Phosphor icons.

## Run locally

```sh
npm install
npm run dev
```

## Check and build

```sh
npm run lint
npm run build
npm run preview
```

The production site is generated in `dist/` and can be hosted on any static hosting service.

## Project structure

- `src/App.jsx`: four page routes and shared layout.
- `src/components/Navbar.jsx` and `src/components/Footer.jsx`: shared layout components.
- `src/pages/`: Home, About, Ventures, and Contact. Home includes the full Hero.
- `src/index.css`: Tailwind import, design font, and Hero animation keyframes.
- `public/images/`: responsive portrait assets used by the site.

The contact and newsletter forms open prefilled email drafts; they do not submit to a backend. The LinkedIn destination is the general LinkedIn site because a personal profile URL was not present in the project.

Venture wordmarks are typographic recreations. Case study outcomes only include information already documented in the project; unreported metrics are identified as such.

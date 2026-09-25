# Hashir Usman portfolio

A responsive React portfolio based on the supplied visual reference. Built with Vite, native CSS, self-hosted DM Sans, and Phosphor icons.

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

## Content and integrations

- `src/App.jsx`: hero, statistics, navigation, portfolio and service dialogs, and call enquiry form.
- `src/components/PortfolioSections.jsx`: services, venture names, about copy, contact details, and newsletter form.
- `src/App.css` and `src/components/PortfolioSections.css`: desktop and responsive layouts.
- `public/images/hashir-portrait.webp`: optimized transparent portrait reconstructed from the supplied screenshot using the built-in image generation tool. Replace it with the original portrait for exact likeness. The PNG source is retained in `src/assets/hashir-portrait-source.png`.

The site uses the name, role, statistics, brand names, and contact details from the supplied reference, as requested. Venture wordmarks are typographic recreations; original logo files can replace them.

The call and newsletter forms open prefilled email drafts. They do not submit to a backend, schedule an appointment, or save a subscription. Replace the call action with a booking URL and connect a newsletter provider when those details are available. Social marks are explicitly labeled as pending profile URLs; they do not point to guessed accounts. Venture dialogs offer enquiries rather than invented case studies.

## Portrait asset provenance

Tool: built-in ImageGen. Prompt: recreate only the reference screenshot’s seated man and green armchair as a photorealistic transparent cutout, preserve the green bomber jacket, dark clothing, sunglasses, hair and relaxed pose, complete areas hidden by the metrics strip, remove all website text/background/UI, and frame from head to below the crossed knees. Output was copied into this repository and optimized to WebP with its transparency preserved.

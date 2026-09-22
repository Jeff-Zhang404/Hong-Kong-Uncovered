# Hong Kong Uncovered

Hong Kong Uncovered is a responsive React web application for exploring Hong Kong attractions, local food, and cultural information. It was built as a front-end and interaction design project with an emphasis on clear information architecture, useful filtering, and lightweight client-side persistence.

**Live demo:** [Hong Kong Uncovered](https://jeff-zhang404.github.io/Hong-Kong-Uncovered/)

## Features

- Browse 8 tourist attractions and filter them by region, interest, and recommendation status.
- Explore 11 local food items by classification and recommendation status, with price-based sorting.
- Open detailed views with image carousels, descriptions, highlights, and estimated costs.
- Save attractions and food to a combined bookmark collection backed by browser `localStorage`.
- Keep bookmarks synchronized across browser tabs and refine saved items by category.
- Receive non-blocking toast feedback when items are saved or removed.
- Recover from data-loading failures through clear error states and retry controls.
- Navigate a responsive interface built for desktop and mobile screens.

## Technology

- React 19
- React Router with hash-based routing for GitHub Pages
- React Bootstrap and Bootstrap 5
- Vite
- ESLint
- Browser `localStorage`
- Static JSON datasets

## Data and Privacy

This project uses a small demonstration dataset stored in [`public/data`](public/data). It does not use a production travel API or collect personal information. Bookmarks remain in the user's browser through `localStorage` and are not sent to a server.

Attraction details, recommendations, and estimated food costs are included for demonstration purposes and may not reflect current real-world information.

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
git clone https://github.com/Jeff-Zhang404/Hong-Kong-Uncovered.git
cd Hong-Kong-Uncovered
npm install
```

### Local Development

```bash
npm run dev
```

Open the local URL shown in the terminal.

### Quality Checks

```bash
npm run lint
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
Hong-Kong-Uncovered/
├── public/
│   ├── data/                 # Demonstration JSON datasets
│   └── images/               # Attraction and food images
├── src/
│   ├── components/
│   │   ├── nav/              # Navigation, routing, and page components
│   │   ├── DataContext.jsx   # Shared data loading and retry state
│   │   └── SavedCompositeContext.jsx
│   └── main.jsx
├── docs/                     # GitHub Pages production build
└── vite.config.js
```

## Deployment

The production site is served from the `docs` directory on the `main` branch through GitHub Pages. Vite's base path is configured as `/Hong-Kong-Uncovered/` so static assets resolve correctly under the repository URL.

## Credits

Created by Xuantao (Jeff) Zhang as a front-end and HCI project.

Photography by Xuantao Zhang, with contributed photos from Muze Xiang and Haoxuan Li. Some visual assets were generated with ChatGPT.

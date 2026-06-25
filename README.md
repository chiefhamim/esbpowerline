# ⚡ ESB PowerLine — Bangladesh Energy & Power News Portal

A premium, modern news portal covering Bangladesh's energy and power sector. Built with pure HTML, CSS, and JavaScript for maximum performance and zero dependencies.

## Features

### 🎨 Design
- **Dark/Light Mode** with smooth transitions and system preference detection
- **Glassmorphism** effects with backdrop blur
- **Premium typography** using Space Grotesk, Inter, and JetBrains Mono
- **Responsive design** that works beautifully on mobile, tablet, and desktop
- **Micro-animations** and hover effects for engaging interactions
- **CSS Grid** based layouts with flexible components

### 🕒 Humanized Formats & Localization
- **Relative Timestamps** (e.g., `"Just now"`, `"15 min ago"`, `"2h ago"`) for quick contextual recency across article lists and feeds
- **Enhanced Hover Tooltips** (e.g., `"Thursday at 11:20 AM (2 hours ago)"`) showing full weekday details, exact time, and relative duration on hover
- **Subcontinental Numbering** (e.g., `15,000` or `13,40,606` using `en-IN` format) for localized energy generation stats and page views
- **Flexible clock formatting** (supporting both 12-hour and 24-hour options)

### 📰 News Portal
- **22 realistic articles** covering 10 energy sector categories
- **Hero section** with featured articles and image overlays
- **Breaking news ticker** with auto-scrolling animation
- **Category filtering** with animated pills
- **Sort** by latest, most viewed, or most relevant
- **Grid/List view** toggle
- **Load more** pagination
- **Trending sidebar** with ranked articles

### 🔍 Search
- **Full-screen search overlay** with blur background
- **Real-time filtering** across titles, excerpts, and tags
- **Debounced input** for performance
- **Recent searches** saved in localStorage
- **Trending topic** tags for quick access

### 📊 Live Energy Dashboard
- **Total Generation Capacity** (MW)
- **Current Demand** (MW)
- **Renewable Share** (%)
- **System Loss** (%)
- **Animated counters** with easeOutCubic easing
- **Auto-refresh** every 30 seconds with simulated fluctuations

### ⚙️ Customization
- **Theme**: Dark / Light / System
- **Font Size**: Small / Medium / Large
- **Layout**: Grid / List
- **Animations**: Toggle on/off
- **Auto-refresh**: Toggle dashboard updates
- All settings **persisted in localStorage**

### ⌨️ Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `S` or `/` | Open search |
| `D` | Toggle dark/light mode |
| `Escape` | Close modals/overlays |
| `←` `→` | Navigate articles in reader |

### 📱 Device Friendly
- Mobile-first responsive design
- Touch-friendly tap targets (min 44px)
- Hamburger menu for mobile navigation
- Optimized layouts for all breakpoints (480px, 768px, 1024px, 1280px)

## Tech Stack

- **HTML5** — Semantic markup with SEO best practices
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — ES6+ with modular architecture
- **Lucide Icons** — Beautiful, consistent icon set
- **Google Fonts** — Space Grotesk, Inter, JetBrains Mono

## Getting Started

Simply open `index.html` in your browser, or serve with any static server:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

## Project Structure

```
esbpowerline/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Complete design system (2,700+ lines)
├── js/
│   └── app.js          # Application logic (1,500+ lines)
└── README.md
```

## Categories Covered

1. Power Generation
2. Renewable Energy
3. LNG & Gas
4. Nuclear Energy
5. Grid & Transmission
6. Energy Policy
7. Rural Electrification
8. Energy Efficiency
9. International
10. Market & Finance

## License

© 2026 ESB PowerLine. All rights reserved.

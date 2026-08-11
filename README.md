# Lynkr — Shorten. Track. Understand.

A modern, minimal, dark-first SaaS application for "Lynkr" - a URL Shortening Platform. 

## Design System

- **Theme**: Dark-first, near-black background (`#09090B`), pure white text, neutral gray borders (`#27272A`), controlled vibrant blue accents (`#2563EB` / `#3B82F6`).
- **Typography**: Inter font, highly readable, spacious padding, clean and uncluttered.

## Features & Pages

1. **Main Navbar**: Logo, Navigation links (Home, My Links, Analytics), and Auth status (Login / Register / User Menu).
2. **Home Page (`/`)**: Hero section, URL Shortener tool with custom alias & expiration options, core benefits, feature breakdown, and analytics preview.
3. **Auth Pages (`/login` & `/register`)**: Authentication forms for user accounts.
4. **My Links Page (`/links`)**: Dashboard table listing active/expired links, search filter, click stats, and management actions.
5. **Analytics (`/analytics`)**: Detailed link analytics with total clicks, unique visitors, device breakdown, and traffic metrics.

## Development

```sh
bun install # or npm install
bun dev     # or npm run dev
```

## Repository

Repository: [https://github.com/lokeshsoni1/lynkr-frontend.git](https://github.com/lokeshsoni1/lynkr-frontend.git)


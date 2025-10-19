# Midnight Auction

![GitHub last commit](https://img.shields.io/github/last-commit/tomive01888/MidnightAuction)
![GitHub repo size](https://img.shields.io/github/repo-size/tomive01888/MidnightAuction)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A modern, high-energy mock auction house built on the Noroff API v2. This project is a single-page application developed with a professional, feature-rich, and mobile-first approach, showcasing a futuristic "Midnight Drive" theme.

## Demo

<!--
  A screenshot of the live application will be added here.
  ![Midnight Auction Screenshot](link-to-your-screenshot.png)
-->

## About The Project

Midnight Auction is a dynamic platform where users can browse, bid on, and create listings for various items. The user experience is tailored to different roles, providing a seamless browsing experience for visitors and a full suite of features for authenticated users.

### User Experience

#### As a Visitor:

- Browse a responsive grid of all active auction listings.
- Sort listings by what's new, what's ending soon, or what's most active.
- Utilize a full-screen, live search to find items by title or description.
- View the detailed page for any listing, including its full image gallery and complete bid history.

#### As a Registered User:

- All visitor features are available.
- Register for a new account and receive **1000 starting credits** to begin bidding.
- Log in and out securely.
- Create new auction listings with multiple images and a set duration.
- Place bids on other users' active listings.
- Manage your own profile, including updating your avatar and bio.
- View your personal dashboard with a history of your listings, bids, and wins.
- Manage your active listings with options to edit or delete them.

## Tech Stack

This project is built with a modern, professional tech stack focused on performance, type safety, and a superior user experience.

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [Material-UI (MUI)](https://mui.com/)
- **Data Fetching & Caching:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **API Communication:** [Axios](https://axios-http.com/)
- **Date Management:** [date-fns](https://date-fns.org/)
- **Security:** [DOMPurify](https://github.com/cure53/DOMPurify) for sanitizing user inputs.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/tomive01888/MidnightAuction.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd MidnightAuction
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Set up your environment variables:**
    Create a new file named `.env.local` in the root of the project and add the necessary variables. See the section below for details.

5.  **Run the development server:**
    ```sh
    npm run dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

To run this project, you need to set up your own environment variables. Create a `.env.local` file in the project root by copying the example file:

```sh
cp .env.example .env.local
```

Then, fill in the values in `.env.local`. **Do not commit this file to version control.**

```env
# Get your personal API key by registering at Noroff
NEXT_PUBLIC_NOROFF_API_KEY=<your-api-key-here>

# The base URL for the Noroff Auction API v2
NEXT_PUBLIC_NOROFF_BASE_URL=https://v2.api.noroff.dev
```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements & Contact

- This project is powered by the [Noroff API](https://docs.noroff.dev/docs/v2).
- AI Assistance for development provided by Google's Gemini.
- **Tom Andre Iversen** - Lead Developer & Architect - [tomive01888](https://github.com/tomive01888)

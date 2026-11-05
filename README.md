# StudioSpace

**Peer-to-peer marketplace for creative studios.** Photographers, filmmakers, podcasters, musicians and artists discover, filter and book studio spaces by the hour, while hosts list rooms and approve every request.

[![Live Demo](https://img.shields.io/badge/Live_Demo-StudioSpace-D4FF00?style=for-the-badge&logo=vercel&logoColor=black)](https://studiospace-client-drab.vercel.app/)
[![Live API](https://img.shields.io/badge/Live_API-StudioSpace-D4FF00?style=for-the-badge&logo=vercel&logoColor=black)](https://studiospace-server-ivory.vercel.app/)

## Examiner test credentials

| Role                                         | Email                   | Password    |
| -------------------------------------------- | ----------------------- | ----------- |
| Host + Guest (has 10 seeded studios)         | `nisha@studiospace.dev` | `Studio123` |
| Second guest (register once to test booking) | `guest@studiospace.dev` | `Studio123` |

Tip: log in as the examiner (host), then book a studio from a second account and confirm it from **Dashboard** to see the double-booking protection.

## Key features

- **Interactive hero slider** (Swiper) with three slides, plus six featured studios fetched live from MongoDB with `.limit(6)`.
- **Explore Studios** with debounced search, category pre-selection from the home page, price slider, sorting and pagination.
- **Full studio CRUD:** add, update and delete listings (private routes) with imgbb image upload, amenity tags and read-only host details.
- **Booking system:** live availability, price breakdown, "Pending" requests, host Confirm / Decline / Complete, guest cancel for pending slots.
- **Challenge 1, JWT security:** BetterAuth session is exchanged for a signed JWT stored in an **HTTPOnly cookie**; the Express API answers `401 Unauthorized` on every mutation without it.
- **Challenge 2, double-booking prevention:** time overlap is checked against Confirmed bookings both when requesting and when confirming (`409` with a clear message).
- **Challenge 3, theme toggle:** full light / dark switch across the whole system, remembered between visits.
- **Optional extras:** PDF booking invoice, saved-studios wishlist, reviews and ratings, host dashboard.
- Sonner-style **toasts** (react-hot-toast) and **custom modals** everywhere, skeleton loaders, empty states, custom 404 page, no `alert()`.
- Reload-safe: refreshing any route (including private ones) keeps you signed in.

## Tech stack

| Layer    | Technology                                                                               |
| -------- | ---------------------------------------------------------------------------------------- |
| Frontend | Next.js (App Router), Tailwind CSS, DaisyUI, Swiper, react-hot-toast, react-icons, jsPDF |
| Auth     | BetterAuth (MongoDB adapter, email + password, Google) and JWT in an HTTPOnly cookie     |
| Backend  | Express.js, MongoDB (native driver), JSON Web Tokens                                     |
| Hosting  | Vercel (client and server)                                                               |

## Run locally

1. Clone this repo and the server repo, then install dependencies in each (`npm install`).
2. Client: copy `.env.example` to `.env.local` and fill in the values (MongoDB URI, `BETTER_AUTH_SECRET`, `JWT_SECRET`, optional Google keys and imgbb key). `API_URL` should be `http://localhost:5000`.
3. Server: copy `.env.example` to `.env`, use the **same** `MONGODB_URI` and `JWT_SECRET`.
4. Start the API: `npm run dev` inside the server folder (port 5000).
5. Optional demo data: register `examiner@studiospace.dev` in the app, then run `npm run seed` in the server folder.
6. Start the client: `npm run dev` (port 3000) and open http://localhost:3000.

## 📁 Project Structure

```text
StudioSpace/
├── 📂 app/                  # Application routes and pages
│   ├── home/                # Landing page
│   ├── studios/             # Studio discovery and details
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── bookings/             # Booking management
│   ├── listings/            # Studio listings
│   └── ...
│
├── 📂 components/            # Reusable UI components
│   ├── Navbar                # Navigation bar
│   ├── Footer                # Site footer
│   ├── StudioCard            # Studio preview card
│   ├── BookingModal          # Booking interface
│   ├── StudioForm            # Studio creation and editing
│   ├── Modals/               # Reusable modal components
│   └── ...
│
└── 📂 lib/                   # Utilities and configurations
│   ├── API Helper            # API request utilities
│   ├── Better Auth Config    # Authentication setup
│   ├── Constants             # Shared application constants
│   ├── PDF Invoice           # Invoice generation utilities
│   └── ...
```

# Law Call

Law Call is a premium investor-demo MVP for free roadside legal protection. Drivers can start a protected journey, activate Law Call Active during an eligible roadside incident, preserve an Incident Packet, and request access to participating attorneys where available.

The product promise is: document, alert, connect, guide, preserve.

## Features

- Landing page that explains the product in under 60 seconds
- Demo login for driver, family, and attorney roles
- Driver dashboard with Journey Mode, Law Call Active, ticket upload, and attorney flow
- Journey Mode with mocked car Bluetooth auto-start positioning
- Ad-free Law Call Active emergency mode
- Attorney Connected screen with Initial Consultation Included badge
- Incident Packet legal dossier with timeline, location, documents, and follow-up actions
- Family Protection dashboard with protected drivers and alerts
- Attorney Network dashboard with paid listing model, consultation requests, and representation offers
- Attorney-focused pricing page with a $0 driver card
- Account/settings with trusted contacts, vehicles, documents, Bluetooth auto-start, privacy, and legal notices
- localStorage persistence for users, journeys, incidents, family members, attorney availability, and offers

## Tech Stack

- React
- Vite
- React Router
- lucide-react icons
- Plain CSS
- localStorage mock persistence

## Run Locally

```bash
npm install
npm run dev
```

The local dev server will print a URL such as `http://localhost:5173`.

## Build

```bash
npm run build
```

## GitHub Pages

This app uses hash routing so it can run on GitHub Pages without server rewrites.

For a project page at `https://BeatViral.github.io/Law-Call/`, build with:

```bash
GITHUB_PAGES=true npm run build
```

On Windows PowerShell:

```powershell
$env:GITHUB_PAGES='true'; npm run build
```

Then deploy the `dist` folder using your preferred GitHub Pages flow.

## Demo Login Accounts

- Demo Driver: `maya@lawcall.demo`
- Demo Family Account: `family@lawcall.demo`
- Demo Attorney: `sarah@mitchellroadside.com`

Use the buttons on the demo login screen to create the mock account in localStorage.

## MVP Limitations

- No real backend
- No real authentication
- No real payments
- No real e-signature
- No real attorney network
- No real SMS alerts
- No real audio/video calling
- No real recording
- No legal advice is provided
- Attorney availability and consultation flow are simulated

## Business Model

The consumer app is free:

Free to download. Free to start a protected journey. No upfront cost to connect with a participating attorney for an initial consultation, where available.

Revenue is modeled around attorney listings, local coverage, lead tools, sponsored placement on non-emergency screens, and future transaction tools.

Attorney listings are paid advertising/listing placements. Law Call does not recommend or rank attorneys as best. Users choose whether to contact or hire a participating attorney. Follow-up representation requires a separate attorney-client agreement.

## Future Backend Roadmap

- Supabase or Firebase authentication
- Stripe attorney billing and transaction tooling
- Twilio SMS trusted-contact alerts
- Twilio, Daily, or Agora calling
- Browser/mobile recording APIs
- Cloud storage for incident recordings
- Real attorney verification
- Attorney licensing and jurisdiction logic
- Native iOS and Android apps
- Car Bluetooth, CarPlay, and Android Auto Journey Mode
- Insurance, fleet, university, travel, elder-care, and legal-access partnerships

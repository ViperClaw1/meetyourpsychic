# My Psychic Connection

Context: I am building a frontend-only mock prototype for "MeetYourPsychic" (MYP), a marketplace web app connecting users with psychic advisors.

CRITICAL DESIGN RULES (DO NOT IGNORE):

DO NOT use your standard boilerplate UI. Absolutely no bubbly "pill" buttons or generic startup templates.

Use a bespoke, modern, highly professional design.

Color Palette: Clean white backgrounds, crisp borders, subtle/soft drop shadows for elevation, and a vibrant primary purple (#6B46C1 or similar) for primary actions. Text should be sharp and highly readable.

Use standard, slightly rounded corners (e.g., rounded-md or rounded-lg), NOT fully rounded pills.

Tasks for this step:

Initialize react-router-dom with a global layout.

Build the Landing Page: Include a professional hero section ("Talk To One Of The Best Psychics Today!"), a trust-badge section (No Hidden Charges, Screened Advisors, Satisfaction Guarantee), and a top Navbar.

Build the Login/Register Page: Include a mock UI for Email/Password and OAuth (Google/Apple). Include a mock "Fingerprint Pro" scanning visual state.

Mock Auth Routing State: On the Login page, build 3 distinct "Dev Override" buttons: "Login as Client", "Login as Psychic", and "Login as Super Admin".

Wire the routing so that clicking one of those mock buttons sets a global auth state and redirects to /client-dashboard, /psychic-dashboard, or /admin-dashboard respectively.

## Workflow

This project can be developed either in its AI-assisted web editor or locally.

- **Ship faster**: describe what you want to build and the editor generates the code.
- **Stay in sync**: every change made in the editor is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into the editor, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

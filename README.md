# Real Estate Investment Calculator

A Next.js application for calculating real estate investment returns, net equity projections, and other property investment metrics. Built with authentication for personal use and automatic deployment to Cloudflare Pages.

## Features

- Simple password-based authentication
- Protected dashboard
- Automatic deployment via GitHub Actions
- Built with Next.js, TypeScript, and Tailwind CSS

## Local Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd real-estate
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and set your values:
```env
JWT_SECRET=your-secure-random-string-here
ADMIN_PASSWORD=your-password-here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) and login with your password.

## Deployment to Cloudflare Pages

### Setup GitHub Secrets

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

1. `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token with Pages permissions
   - Go to Cloudflare Dashboard > My Profile > API Tokens
   - Create a token with "Cloudflare Pages" permissions

2. `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
   - Found in Cloudflare Dashboard > Overview

3. `JWT_SECRET` - A secure random string for JWT signing
   - Generate with: `openssl rand -base64 32`

4. `ADMIN_PASSWORD` - Your login password

### Automatic Deployment

Every push to the `main` branch will automatically deploy to Cloudflare Pages via GitHub Actions.

### Manual Deployment

You can also deploy manually through the Cloudflare Pages dashboard:

1. Go to Cloudflare Dashboard > Pages
2. Create a new project
3. Connect your GitHub repository
4. Set build settings:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `.next`
5. Add environment variables in Cloudflare Pages settings

## Project Structure

```
real-estate/
├── app/
│   ├── api/auth/          # Authentication API routes
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   └── page.tsx          # Home page (redirects to dashboard)
├── lib/
│   └── auth.ts           # Authentication utilities
├── middleware.ts         # Route protection middleware
└── .github/workflows/    # GitHub Actions
```

## Authentication

The app uses JWT-based authentication with HTTP-only cookies. Only one user (you) can access the application using the password set in environment variables.

Default password for development: `admin123` (Change this in production!)

## Tech Stack

- Next.js 15+ (App Router)
- TypeScript
- Tailwind CSS
- JWT (jose library)
- Cloudflare Pages

## License

MIT

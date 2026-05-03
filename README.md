# Real Estate Investment Calculator

A Next.js application for calculating real estate investment returns, net equity projections, and other property investment metrics. Built with authentication for personal use and automatic deployment to Cloudflare Pages.

## Features

- Simple password-based authentication
- Protected dashboard
- Automatic deployment via Cloudflare Pages
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

### Initial Setup

1. Go to Cloudflare Dashboard → **Workers & Pages**
2. Click **Create** → **Pages** tab → **Connect to Git**
3. Select your GitHub repository: **real-estate**
4. Configure build settings:
   - **Production branch**: `main`
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
5. Click **Save and Deploy**

### Environment Variables

After creating the project, add environment variables:

1. Go to your project → **Settings** → **Environment variables**
2. Add for **Production** (and optionally **Preview**):
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `ADMIN_PASSWORD` - Your login password
3. Go to **Settings** → **Functions** → **Compatibility flags**
4. Add `nodejs_compat` to both Production and Preview
5. Save and redeploy

### Automatic Deployment

Every push to the `main` branch automatically triggers a new deployment on Cloudflare Pages.

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
└── middleware.ts         # Route protection middleware
```

## Authentication

The app uses JWT-based authentication with HTTP-only cookies. Only one user (you) can access the application using the password set in environment variables.

Default password for development: `admin123` (Change this in production!)

## Tech Stack

- Next.js 15.5.2 (App Router with Edge Runtime)
- TypeScript
- Tailwind CSS
- JWT authentication (jose library)
- Cloudflare Pages with `@cloudflare/next-on-pages`

## License

MIT

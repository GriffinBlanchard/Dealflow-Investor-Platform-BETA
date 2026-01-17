# Dealflow Platform - Overcrest Realty

Real estate investor platform for discovering off-market deals, managing portfolios, and partnering with other investors.

## Features

- ✅ User authentication (Login/Register)
- ✅ Property portfolio management
- ✅ Deal marketplace with filters
- ✅ Investor verification system (4 methods)
- ✅ Property flagging & info requests
- ✅ Responsive design
- ✅ Overcrest Realty branding

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

### Option 1: Via Bitbucket (Recommended)

1. **Push to Bitbucket:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-bitbucket-url>
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from Bitbucket
   - Select this repository
   - Framework: Vite
   - Click "Deploy"

### Option 2: Direct Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Project Structure

```
dealflow-deploy/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── .gitignore         # Git ignore rules
└── src/
    ├── main.jsx       # React entry point
    ├── App.jsx        # Main application
    └── index.css      # Global styles
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Lucide React** - Icon library
- **CSS** - Styling (no framework needed)

## Environment Variables

None required for current version. Add later for:
- API endpoints
- Verification service keys
- Payment processing

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Private - Overcrest Realty

## Support

For issues or questions, contact the development team.

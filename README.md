# LearnHub - Online Learning Platform

LearnHub is a comprehensive online learning platform built with Next.js 15 that allows users to browse, purchase, and take courses on various topics. The platform supports both students and instructors, with features like course creation, payment processing, progress tracking, and more.

## 🎥 Platform Overview

For a complete overview of the platform features, watch our [website overview video](https://drive.google.com/file/d/1argF_Othq1w10Wk0HKcn2j7naJWNFoY2/view?usp=sharing).

## 🚀 Technologies Used

### Frontend
- **Next.js 15.4.6** with App Router
- **React 19.1.0** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Radix UI** components

### Backend & Authentication
- **NextAuth.js** for authentication
- **Drizzle ORM** for database operations
- **MySQL2** for database connectivity

### Payment Processing
- **Stripe** for payment processing
- **@stripe/react-stripe-js** and **@stripe/stripe-js** for frontend integration

### Media & Storage
- **Mux** for video streaming
- **@mux/mux-node** for server-side integration
- **@vercel/blob** for file storage
- **Google Cloud Storage** for additional storage options

### AI Features
- **Gemini AI** for AI personality chat features

### Additional Libraries
- **Zustand** for state management
- **bcryptjs** for password hashing
- **hls.js** for HLS video playback
- **react-player** for video components

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (version specified in package.json)
- MySQL database
- Stripe account for payment processing
- Mux account for video streaming
- Google Cloud Storage account

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd courses-website
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Copy the `.env.example` file to `.env.local` and fill in the required values:
   ```bash
   cp .env.example .env.local
   ```

4. **Database setup:**
   - Create a MySQL database
   - Update the `DATABASE_URL` in your `.env.local` file
   - Run database migrations (if applicable)

5. **Run the development server:**
   ```bash
   yarn dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## 🤖 AI Personalities Feature

LearnHub includes an AI personalities feature powered by Gemini AI, offering specialized chat experiences with different AI personas:

- **Legal Advisor AI** - Expert in legal consultation and contract analysis
- **Medical Consultant AI** - Specialized in medical information and health guidance
- **Education Tutor AI** - Dedicated to teaching and learning support
- **Tech Developer AI** - Full-stack development expert
- **Wellness Therapist AI** - Supportive mental health companion
- **Business Consultant AI** - Strategic business advisor

To enable this feature, configure your Gemini API key in the environment variables.

## 🔐 Environment Variables

The following environment variables are required for the application to function properly:

```env
# NextAuth secret
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database URL
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# Blob storage
BLOB_READ_WRITE_TOKEN=your_blob_rw_token_here

# Mux
MUX_TOKEN_ID=your_mux_token_id_here
MUX_TOKEN_SECRET=your_mux_token_secret_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here  # Stored in environment variable STRIPE_SECRET_KEY
STRIPE_PRO_PLAN_KEY=your_stripe_pro_plan_key_here  # Stored in environment variable STRIPE_PRO_PLAN_KEY
STRIPE_TEAM_PLAN_KEY=your_stripe_team_plan_key_here  # Stored in environment variable STRIPE_TEAM_PLAN_KEY
STRIPE_WEBHOOK_KEY=your_stripe_webhook_key_here  # Stored in environment variable STRIPE_WEBHOOK_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here  # Stored in environment variable NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# App URL
NEXT_APP_URL=http://localhost:3000
```

## ▶️ Available Scripts

- `yarn dev` - Runs the app in development mode
- `yarn build` - Builds the app for production
- `yarn start` - Runs the built app in production mode
- `yarn lint` - Runs ESLint to check for code issues

## 📁 Project Structure

```
courses-website/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/             # API routes
│   │   ├── components/      # React components
│   │   ├── dashboard/       # User dashboards
│   │   └── ...              # Other pages
│   ├── lib/                 # Utility functions and database setup
│   ├── styles/              # Global styles and Tailwind config
│   └── context/             # React context providers
├── public/                  # Static assets
├── .env.example             # Environment variable template
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
└── package.json             # Project dependencies and scripts
```

## 🚀 Deployment

The application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or a custom Node.js server.

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set up the environment variables in the Vercel dashboard
3. Deploy the application

### Custom Server Deployment
1. Build the application:
   ```bash
   yarn build
   ```
2. Start the production server:
   ```bash
   yarn start
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

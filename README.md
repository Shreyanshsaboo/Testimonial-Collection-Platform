# Testimonial Collection Platform

A seamless platform for collecting, managing, and embedding testimonials on your website. Built with Next.js, MongoDB, and Cloudinary.

## 🎯 Project Overview

Build a seamless platform for:
1. Collecting testimonials through a shareable one-click form
2. Managing testimonials via a centralized dashboard (approve, edit, organize)
3. Auto-generating embeddable testimonial widgets (carousel, grid, card layouts)
4. Brand customization with easy styling options
5. Simple copy-paste script integration for websites

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, JavaScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Storage**: Cloudinary (for images/videos)
- **API**: Next.js API Routes

## 📋 Features

### Core Features
- ✅ **One-click testimonial collection form** (text + optional media)
- ✅ **User authentication** (login/signup with NextAuth.js)
- ✅ **Dashboard for testimonial management** (approve, reject, edit)
- ✅ **Auto-generated widgets** (carousel, grid, card layouts)
- ✅ **Simple embed code generator** (JavaScript snippet)
- ✅ **Brand customization** (colors, fonts, layouts)
- ✅ **Responsive design** (mobile & web)

### Technical Features
- ✅ MongoDB database with Mongoose schemas
- ✅ Cloudinary integration for media uploads
- ✅ Rating system with star ratings
- ✅ Form spam protection
- ✅ Real-time widget preview
- ✅ API routes with Zod validation
- ✅ Server and Client Components

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- MongoDB (local or MongoDB Atlas account)
- Cloudinary account ([Sign up](https://cloudinary.com))

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up MongoDB:**
   - **Option A - Local:** Install MongoDB locally
   - **Option B - Cloud:** Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string

3. **Set up Cloudinary:**
   - Create free account at [Cloudinary](https://cloudinary.com)
   - Get your Cloud Name, API Key, and API Secret from dashboard

4. **Configure environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/testimonial-platform
# Or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/testimonial-platform

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here  # Generate: openssl rand -base64 32

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
   - Visit [http://localhost:3000](http://localhost:3000)
   - Sign up for an account
   - Create your first project
   - Start collecting testimonials!

📚 **For detailed documentation, see [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)**

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/                # Authentication endpoints
│   │   │   ├── [...nextauth]/  # NextAuth.js handler
│   │   │   └── signup/          # User registration
│   │   ├── projects/            # Project management
│   │   │   └── [id]/testimonials/ # Testimonial endpoints
│   │   └── submit/[shareId]/   # Public testimonial submission
│   ├── auth/                    # Auth pages (signin, signup)
│   ├── dashboard/               # Protected dashboard
│   ├── layout.js                # Root layout with AuthProvider
│   ├── page.js                  # Landing page
│   └── globals.css              # Global styles
├── components/                   # React Components
│   ├── ui/                      # UI components (Button, Input, Card)
│   ├── AuthProvider.js          # NextAuth session provider
│   └── FileUpload.js            # File upload component
├── lib/                         # Utilities & Configuration
│   ├── mongodb.js               # MongoDB connection
│   ├── storage/                 # Cloudinary integration
│   ├── validations/             # Zod schemas
│   └── utils.js                 # Helper functions
├── models/                       # Mongoose Models
│   ├── User.js                  # User schema
│   ├── Project.js               # Project schema
│   └── Testimonial.js           # Testimonial schema
├── docs/                        # Documentation
│   └── PROJECT_OVERVIEW.md      # Complete project docs
└── middleware.js                # NextAuth middleware
```

📖 **See [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) for detailed architecture**

## 🗄️ Database Setup

MongoDB is required for this project. Choose one option:

### Option A: MongoDB Atlas (Recommended for production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster (M0 Sandbox)
3. Create database user (Database Access)
4. Whitelist IP address (Network Access) - use `0.0.0.0/0` for development
5. Get connection string from "Connect" button
6. Add to `.env.local` as `MONGODB_URI`

### Option B: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/testimonial-platform`

The application will automatically create collections when you first use them.

## ☁️ Storage Setup

### Cloudinary (for images and videos)

1. Create account at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard to find:
   - Cloud name
   - API Key  
   - API Secret
3. Add credentials to `.env.local`

Cloudinary provides a free tier with:
- 25 GB storage
- 25 GB bandwidth per month
- Image and video transformations

## 🔐 Authentication

This project uses NextAuth.js for authentication:
- **Email/Password** authentication
- **JWT sessions** (no database sessions)
- **Protected routes** via middleware
- **Bcrypt** password hashing

You can easily extend it to support:
- OAuth providers (Google, GitHub, etc.)
- Magic link authentication
- Two-factor authentication

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - Cloudinary credentials
4. Deploy

### MongoDB Atlas
- Ensure your MongoDB Atlas cluster is accessible
- Add Vercel IP ranges to Network Access (or use `0.0.0.0/0`)
- Use connection string with proper credentials

### Environment Variables
Make sure all production environment variables are set in your hosting platform.

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

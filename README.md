# Testimonial Collection Platform

A modern, sleek platform for collecting, managing, and analyzing testimonials with a beautiful dark-themed dashboard. Built with Next.js 14, MongoDB, and advanced analytics.

## 🎯 Project Overview

A comprehensive testimonial management platform featuring:
1. **One-click testimonial collection** through shareable forms
2. **Advanced dashboard** with real-time stats and management
3. **Analytics & Insights** with interactive charts and graphs
4. **Auto-generated embeddable widgets** (carousel, grid, card layouts)
5. **User settings & preferences** with complete account management
6. **Brand customization** with modern dark UI
7. **Simple copy-paste integration** for any website

## 🚀 Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, JavaScript
- **Styling**: Tailwind CSS with custom dark theme
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with JWT sessions
- **Storage**: Cloudinary (for images/videos)
- **API**: RESTful API with Next.js API Routes
- **Charts**: Custom SVG-based data visualizations

## 📋 Features

### Core Features
- ✅ **Beautiful Dark Dashboard** - Modern, card-based UI with gradient effects
- ✅ **One-click Testimonial Forms** - Shareable links with custom branding
- ✅ **Testimonial Management** - Approve, reject, edit, and organize
- ✅ **Analytics Dashboard** - Interactive charts, graphs, and insights
  - Line charts for submission timeline
  - Donut charts for status distribution
  - Rating distribution bars
  - Project performance tracking
  - Time-range filtering (7/30/90/365 days)
  - Growth metrics and trends
- ✅ **All Testimonials View** - Centralized management with advanced filtering
  - Search by name, company, or text
  - Filter by status and project
  - Real-time status updates
  - Bulk actions support
- ✅ **User Settings** - Complete account management
  - Profile editing (name, email)
  - Password change with security
  - Notification preferences (email settings)
  - Account deletion with safeguards
- ✅ **Auto-generated Widgets** - Embeddable testimonial displays
- ✅ **Project Management** - Create and customize multiple projects
- ✅ **Widget Embed Codes** - Simple JavaScript snippets
- ✅ **Responsive Design** - Mobile and desktop optimized

### Design Features
- 🎨 **Deep Black Theme** (#0a0a0a background)
- 🎨 **Gradient Cards** (from #1a1a1a to #0f0f0f)
- 🎨 **Subtle Borders** with white opacity overlays
- 🎨 **Smooth Animations** and hover effects
- 🎨 **Shadow Glows** for depth and visual hierarchy
- 🎨 **Icon Integration** with Lucide React
- 🎨 **Bold Typography** with tight tracking

### Technical Features
- ✅ MongoDB database with Mongoose schemas
- ✅ Cloudinary integration for media uploads
- ✅ Rating system with 5-star ratings
- ✅ Form validation and spam protection
- ✅ Real-time widget preview
- ✅ API routes with proper error handling
- ✅ Server and Client Components optimization
- ✅ Session management with NextAuth.js
- ✅ Secure password hashing with bcrypt
- ✅ Protected routes with middleware

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
│   │   │   └── [id]/            # Project-specific routes
│   │   │       └── testimonials/ # Testimonial CRUD
│   │   ├── submit/[shareId]/   # Public testimonial submission
│   │   └── user/                # User settings APIs
│   │       ├── profile/         # Update profile
│   │       ├── password/        # Change password
│   │       ├── notifications/   # Notification preferences
│   │       └── account/         # Delete account
│   ├── auth/                    # Auth pages (signin, signup)
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/               # Protected dashboard
│   │   ├── page.js              # Main dashboard with stats
│   │   ├── analytics/           # Analytics with charts
│   │   ├── testimonials/        # All testimonials view
│   │   ├── settings/            # User settings
│   │   └── projects/            # Project management
│   │       ├── new/             # Create project
│   │       └── [id]/            # Project detail pages
│   │           ├── page.js      # Testimonial management
│   │           ├── settings/    # Project settings
│   │           └── embed/       # Widget embed codes
│   ├── submit/[shareId]/        # Public submission form
│   ├── layout.js                # Root layout with AuthProvider
│   ├── page.js                  # Landing page
│   └── globals.css              # Global styles & dark theme
├── components/                   # React Components
│   ├── ui/                      # UI components (Button, Input, Card)
│   └── AuthProvider.js          # NextAuth session provider
├── lib/                         # Utilities & Configuration
│   ├── mongodb.js               # MongoDB connection
│   ├── validations/             # Zod schemas
│   └── utils.js                 # Helper functions
├── models/                       # Mongoose Models
│   ├── User.js                  # User schema with notifications
│   ├── Project.js               # Project schema
│   └── Testimonial.js           # Testimonial schema
├── docs/                        # Documentation
│   ├── PROJECT_OVERVIEW.md      # Complete project docs
│   └── ARCHITECTURE.md          # System architecture
└── middleware.js                # NextAuth middleware
```

📖 **See [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) for detailed architecture**

## 🎨 Dashboard Pages

### 📊 Main Dashboard
- Project overview cards with stats
- Quick actions (Create Project)
- Recent testimonials preview
- Performance metrics
- Sidebar navigation

### 📈 Analytics Dashboard
- **Submissions Timeline** - Line chart showing daily submissions
- **Status Distribution** - Donut chart (approved/pending/rejected)
- **Rating Distribution** - Horizontal bar chart for 1-5 stars
- **Project Performance** - Progress bars comparing projects
- **Key Metrics** - Total testimonials, approval rate, avg rating, pending count
- **Time Range Filter** - View data for 7/30/90/365 days
- **Growth Tracking** - Percentage change vs previous period

### 💬 Testimonials Page
- View all testimonials across all projects
- **Search** - By name, testimonial text, or company
- **Filter** - By status (all/pending/approved/rejected)
- **Filter** - By project (dropdown selector)
- **Actions** - Approve, reject, or delete testimonials
- **Stats** - Total, pending, approved, rejected counts
- Real-time updates without page refresh

### ⚙️ Settings Page
- **Profile Tab** - Update name and email
- **Password Tab** - Change password securely
- **Notifications Tab** - Email preferences with toggles
  - New testimonial notifications
  - Approval notifications
  - Weekly reports
  - Monthly reports
- **Security Tab** - Account info and deletion

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
- **Email/Password** authentication with secure bcrypt hashing
- **JWT sessions** (stateless, no database sessions)
- **Protected routes** via middleware
- **Session management** with automatic token refresh
- **Password requirements** - Minimum 6 characters
- **Email validation** - Unique email enforcement

Security features:
- Passwords hashed with bcrypt (10 rounds)
- Session tokens stored in HTTP-only cookies
- Protected API routes with server-side validation
- Middleware-based route protection

You can easily extend it to support:
- OAuth providers (Google, GitHub, etc.)
- Magic link authentication
- Two-factor authentication
- Social login integration

## 🎨 Design System

### Color Palette
- **Background**: `#0a0a0a` (Deep black)
- **Cards**: Gradient from `#1a1a1a` to `#0f0f0f`
- **Borders**: `white/5` to `white/20` (opacity-based)
- **Text**: White primary, slate-400 secondary
- **Accents**: White for primary actions
- **Status Colors**:
  - Green (#4ade80) - Approved/Success
  - Orange (#fb923c) - Pending
  - Red (#f87171) - Rejected/Error
  - Yellow (#fbbf24) - Ratings

### Typography
- **Headings**: Font-black (900 weight), tight tracking
- **Body**: Font-medium to font-semibold
- **Sizes**: text-4xl for main titles, text-2xl for sections

### Components
- **Buttons**: White bg with black text, rounded-xl
- **Cards**: Gradient backgrounds with shadow-2xl
- **Inputs**: Black/40 bg with white/10 borders
- **Hover Effects**: Scale transforms, shadow glows
- **Transitions**: duration-300 for smooth animations

## 📝 Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎯 Key Pages & Routes

### Public Routes
- `/` - Landing page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/submit/[shareId]` - Public testimonial submission form

### Protected Routes (Requires Authentication)
- `/dashboard` - Main dashboard with overview
- `/dashboard/analytics` - Analytics with interactive charts
- `/dashboard/testimonials` - All testimonials management
- `/dashboard/settings` - User settings and preferences
- `/dashboard/projects/new` - Create new project
- `/dashboard/projects/[id]` - Project detail and testimonials
- `/dashboard/projects/[id]/settings` - Project configuration
- `/dashboard/projects/[id]/embed` - Widget embed codes

### API Routes
- `POST /api/auth/signup` - User registration
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/[id]/testimonials` - Get testimonials
- `POST /api/submit/[shareId]` - Submit testimonial
- `PATCH /api/user/profile` - Update user profile
- `PATCH /api/user/password` - Change password
- `GET/PATCH /api/user/notifications` - Notification settings
- `DELETE /api/user/account` - Delete account

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  notificationSettings: {
    emailOnNewTestimonial: Boolean,
    emailOnApproval: Boolean,
    emailWeeklyReport: Boolean,
    emailMonthlyReport: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String (required),
  description: String,
  shareId: String (unique),
  formSettings: {
    collectEmail: Boolean,
    collectCompany: Boolean,
    collectPosition: Boolean,
    allowPhoto: Boolean,
    requireApproval: Boolean
  },
  widgetSettings: {
    theme: String,
    layout: String,
    colors: Object
  },
  createdAt: Date
}
```

### Testimonial Model
```javascript
{
  projectId: ObjectId (ref: Project),
  name: String (required),
  email: String,
  company: String,
  position: String,
  rating: Number (1-5),
  testimonial: String (required),
  status: String (pending/approved/rejected),
  featured: Boolean,
  createdAt: Date
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push code to GitHub**
2. **Import project in [Vercel](https://vercel.com)**
3. **Add environment variables:**
   - `MONGODB_URI` - Your MongoDB connection string
   - `NEXTAUTH_URL` - Your production URL (e.g., https://yourdomain.com)
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Same as cloud name (public)
4. **Deploy** - Vercel will automatically build and deploy

### MongoDB Atlas Setup for Production
- Ensure your MongoDB Atlas cluster is accessible
- Add `0.0.0.0/0` to Network Access for development (restrict in production)
- Or add specific Vercel IP ranges for better security
- Use strong database credentials
- Enable connection string with SRV format

### Post-Deployment Checklist
- ✅ Test authentication (signup/signin)
- ✅ Create a test project
- ✅ Submit a test testimonial
- ✅ Check analytics dashboard
- ✅ Verify email settings work
- ✅ Test widget embed codes
- ✅ Check mobile responsiveness

## 🔧 Configuration

### Environment Variables Explained

**Required:**
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_URL` - Your app's URL
- `NEXTAUTH_SECRET` - Secret for JWT encryption

**Optional but Recommended:**
- Cloudinary credentials - For image/video uploads
- Email service credentials - For notification emails

### Customization

**Colors:** Edit `app/globals.css` and Tailwind config
**Typography:** Modify font families in `tailwind.config.js`
**Branding:** Update logo and app name in components
**Features:** Enable/disable features via project settings

## 🎓 Learning Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [MongoDB & Mongoose](https://mongoosejs.com/docs/guide.html)
- [NextAuth.js Guide](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudinary](https://cloudinary.com/documentation)

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Check `MONGODB_URI` is correct
- Ensure IP whitelist includes your IP in MongoDB Atlas
- Verify database user has correct permissions

**NextAuth Session Error:**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

**Cloudinary Upload Fails:**
- Verify all Cloudinary credentials are correct
- Check file size limits
- Ensure cloud name matches in both regular and public env vars

**Build Errors:**
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild
- Check Node.js version (18+ required)

## 🌟 Features Roadmap

- [ ] OAuth providers (Google, GitHub)
- [ ] Email notifications with templates
- [ ] Video testimonials
- [ ] Advanced widget customization
- [ ] Export testimonials (CSV, PDF)
- [ ] Public testimonial walls
- [ ] Integration with popular platforms
- [ ] Advanced analytics (conversion tracking)
- [ ] A/B testing for forms
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed
- Keep PRs focused on a single feature/fix

## �‍💻 Author

**Shreyansh Saboo**
- GitHub: [@Shreyanshsaboo](https://github.com/Shreyanshsaboo)
- Repository: [Testimonial-Collection-Platform](https://github.com/Shreyanshsaboo/Testimonial-Collection-Platform)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the robust database solution
- Tailwind CSS for the utility-first styling
- NextAuth.js for authentication
- Lucide React for the beautiful icons
- Cloudinary for media management

## �📄 License

MIT License - feel free to use this project for learning or building your own testimonial platform!

---

**Built with ❤️ using Next.js 14, MongoDB, and modern web technologies**

For questions or support, please open an issue on GitHub.

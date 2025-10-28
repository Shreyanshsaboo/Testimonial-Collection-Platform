# Testimonial Platform - Project Documentation

## 📚 Complete Project Overview

This is a comprehensive testimonial collection and management platform built with Next.js 14, MongoDB, and Cloudinary.

## 🎯 Core Features

### 1. Testimonial Collection
- **One-click shareable forms** - Unique URLs for each project
- **Rich content support** - Text, ratings (1-5 stars), photos, videos
- **Customizable fields** - Collect name, email, company, position
- **Spam protection** - IP tracking and user agent logging

### 2. Management Dashboard
- **User authentication** - Secure login with NextAuth.js
- **Project management** - Create and organize multiple projects
- **Testimonial moderation** - Approve, reject, or edit submissions
- **Status tracking** - Pending, approved, rejected states
- **Featured testimonials** - Highlight your best reviews

### 3. Widget Generation
- **Multiple layouts** - Carousel, grid, cards, list views
- **Brand customization** - Colors, fonts, styling options
- **Responsive design** - Mobile and desktop optimized
- **Simple embed** - Copy-paste JavaScript snippet

### 4. API Endpoints
- **RESTful API** - Well-structured endpoints
- **Validation** - Zod schema validation
- **Authentication** - Protected routes with NextAuth
- **Public submission** - Open API for form submissions

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  company: String,
  website: String,
  avatar: String,
  plan: 'free' | 'pro' | 'enterprise',
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  website: String,
  shareId: String (unique, 10 chars),
  formSettings: {
    collectEmail: Boolean,
    collectCompany: Boolean,
    collectPosition: Boolean,
    allowVideo: Boolean,
    allowPhoto: Boolean,
    requireApproval: Boolean,
    customQuestions: Array
  },
  widgetSettings: {
    layout: 'carousel' | 'grid' | 'cards' | 'list',
    theme: {
      primaryColor: String,
      backgroundColor: String,
      textColor: String,
      fontFamily: String
    },
    showRatings: Boolean,
    showPhotos: Boolean,
    showCompany: Boolean,
    maxTestimonials: Number
  },
  stats: {
    totalSubmissions: Number,
    approvedCount: Number,
    rejectedCount: Number
  },
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial Model
```javascript
{
  userId: ObjectId,
  projectId: ObjectId,
  name: String,
  email: String,
  company: String,
  position: String,
  rating: Number (1-5),
  testimonial: String,
  photo: String (URL),
  video: String (URL),
  status: 'pending' | 'approved' | 'rejected',
  featured: Boolean,
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date,
  approvedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `GET /api/auth/signout` - Sign out

### Projects
- `GET /api/projects` - Get all projects (authenticated)
- `POST /api/projects` - Create new project (authenticated)
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `GET /api/projects/[id]/testimonials` - Get project testimonials

### Public Submission
- `POST /api/submit/[shareId]` - Submit testimonial (public)
- `GET /api/submit/[shareId]` - Get form settings (public)

### Widgets
- `GET /api/widgets/[shareId]` - Get widget data (public)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up MongoDB
- Local: Install MongoDB or use MongoDB Atlas (cloud)
- Get connection string
- Add to `.env.local`

### 3. Set up Cloudinary
- Create account at cloudinary.com
- Get API credentials
- Add to `.env.local`

### 4. Configure Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Run Development Server
```bash
npm run dev
```

## 📱 User Flow

### For Business Owners:
1. Sign up / Sign in
2. Create a project
3. Customize form settings
4. Share the unique link
5. Review and approve testimonials
6. Customize widget appearance
7. Generate and embed widget code

### For Customers (Testimonial Submitters):
1. Click shared link
2. Fill out form (name, email, rating, review)
3. Optionally upload photo/video
4. Submit testimonial
5. Receive confirmation

## 🎨 Widget Embedding

### JavaScript Snippet
```html
<div id="testimonials-widget"></div>
<script src="https://yourapp.com/widget.js" data-project="SHARE_ID"></script>
```

### iFrame (Alternative)
```html
<iframe src="https://yourapp.com/embed/SHARE_ID" width="100%" height="500"></iframe>
```

## 🔒 Security Features

- **Password Hashing** - bcryptjs with 12 rounds
- **JWT Sessions** - Secure token-based auth
- **Input Validation** - Zod schema validation
- **Spam Protection** - IP and user agent tracking
- **CORS Protection** - Environment-based origins
- **Rate Limiting** - (To be implemented)

## 📈 Future Enhancements (Phase 2)

- Email notifications
- Advanced analytics dashboard
- A/B testing for forms
- Integration with review platforms
- AI-powered sentiment analysis
- Multi-language support
- White-label options
- Advanced spam filtering
- Video testimonials processing
- SEO-optimized testimonial pages

## 🛠️ Tech Stack Details

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (ES6+)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js v4
- **File Upload**: Cloudinary
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom components
- **Forms**: React Hook Form (recommended)
- **State Management**: React hooks + SWR (recommended)

## 📝 Development Notes

- Uses MongoDB connection caching for performance
- Implements proper error handling
- Follows Next.js 14 best practices
- Server and client components separation
- API routes with proper HTTP methods
- Indexes on frequently queried fields

## 🚢 Deployment

### Recommended: Vercel
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas
- Use MongoDB Atlas for production database
- Enable IP whitelist (0.0.0.0/0 for Vercel)
- Set up database user

### Cloudinary
- Production account recommended
- Configure upload presets
- Set up transformations

## 📧 Support

For issues or questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

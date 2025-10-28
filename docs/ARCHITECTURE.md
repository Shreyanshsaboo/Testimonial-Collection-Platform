# 🏗️ Architecture & Implementation Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE (Browser)                    │
├─────────────────────────────────────────────────────────────┤
│  Landing Page  │  Auth Pages  │  Dashboard  │  Forms        │
│  (Marketing)   │ (Sign In/Up) │  (Private)  │  (Public)     │
└────────┬────────────────┬────────────┬───────────────┬───────┘
         │                │            │               │
         └────────────────┴────────────┴───────────────┘
                          │
         ┌────────────────┴────────────────┐
         │   Next.js 14 App Router         │
         │   - Server Components           │
         │   - Client Components           │
         │   - API Routes                  │
         └────────┬────────────────┬───────┘
                  │                │
      ┌───────────┴─────┐   ┌──────┴─────────┐
      │   NextAuth.js   │   │   Zod Schema   │
      │   (JWT Auth)    │   │   Validation   │
      └────────┬────────┘   └────────────────┘
               │
      ┌────────┴─────────────────────────────┐
      │        MongoDB (Database)             │
      │  ┌─────────┬──────────┬────────────┐ │
      │  │  Users  │ Projects │Testimonials│ │
      │  └─────────┴──────────┴────────────┘ │
      └───────────────────────────────────────┘
               │
      ┌────────┴─────────┐
      │    Cloudinary    │
      │ (Media Storage)  │
      └──────────────────┘
```

## Data Flow

### 1. User Registration Flow
```
User → /auth/signup → POST /api/auth/signup
  → Validate (Zod) → Hash Password (bcrypt)
  → Save to MongoDB → Return Success
  → Redirect to /auth/signin
```

### 2. Authentication Flow
```
User → /auth/signin → POST /api/auth/[...nextauth]
  → NextAuth validates credentials → Check MongoDB
  → Generate JWT token → Set session cookie
  → Redirect to /dashboard
```

### 3. Project Creation Flow
```
Authenticated User → /dashboard → Create Project Button
  → POST /api/projects → Validate session
  → Generate unique shareId (nanoid)
  → Save to MongoDB → Return project data
  → Display in dashboard
```

### 4. Testimonial Submission Flow (Public)
```
Customer → Shareable Link (/submit/[shareId])
  → GET /api/submit/[shareId] (fetch form settings)
  → Fill form → Upload media to Cloudinary
  → POST /api/submit/[shareId] → Validate data
  → Save to MongoDB (status: pending)
  → Update project stats → Show success message
```

### 5. Testimonial Management Flow
```
Project Owner → /dashboard/projects/[id]
  → GET /api/projects/[id]/testimonials
  → Display testimonials (pending, approved, rejected)
  → Approve/Reject/Edit actions
  → PUT /api/testimonials/[id] → Update status
  → Refresh list
```

### 6. Widget Embedding Flow
```
Project Owner → Customize Widget → Generate Embed Code
  → Copy JavaScript snippet
Website Owner → Paste on website → Script loads
  → GET /api/widgets/[shareId] → Fetch approved testimonials
  → Render widget (carousel/grid/cards)
```

## Database Schema Relationships

```
User (1) ──────< (Many) Project
              │
              └──< (Many) Testimonial
              
Project (1) ───< (Many) Testimonial
```

### User Document
```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$12...", // bcrypt hash
  company: "Acme Inc",
  plan: "free", // free | pro | enterprise
  createdAt: ISODate,
  updatedAt: ISODate
}
```

### Project Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: "Website Testimonials",
  shareId: "abc123xyz0", // Unique 10-char ID
  formSettings: {
    collectEmail: true,
    collectCompany: true,
    allowVideo: true,
    requireApproval: true
  },
  widgetSettings: {
    layout: "carousel",
    theme: {
      primaryColor: "#0ea5e9",
      backgroundColor: "#ffffff"
    }
  },
  stats: {
    totalSubmissions: 25,
    approvedCount: 20,
    rejectedCount: 5
  },
  active: true,
  createdAt: ISODate
}
```

### Testimonial Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  projectId: ObjectId,
  name: "Jane Smith",
  email: "jane@example.com",
  company: "Tech Corp",
  position: "CEO",
  rating: 5,
  testimonial: "Amazing product!",
  photo: "https://res.cloudinary.com/...",
  video: null,
  status: "approved", // pending | approved | rejected
  featured: false,
  ipAddress: "192.168.1.1",
  createdAt: ISODate,
  approvedAt: ISODate
}
```

## API Routes Structure

```
/api
├── auth/
│   ├── [...nextauth]/route.js    # NextAuth handler
│   └── signup/route.js           # User registration
├── projects/
│   ├── route.js                  # List/Create projects
│   ├── [id]/
│   │   ├── route.js              # Get/Update/Delete project
│   │   └── testimonials/
│   │       └── route.js          # List project testimonials
├── testimonials/
│   └── [id]/
│       └── route.js              # Update/Delete testimonial
├── submit/
│   └── [shareId]/
│       └── route.js              # Public submission endpoint
└── widgets/
    └── [shareId]/
        └── route.js              # Public widget data endpoint
```

## Security Implementation

### 1. Authentication
```javascript
// Using NextAuth.js with JWT
- Password hashing: bcrypt (12 rounds)
- Session management: JWT tokens
- Protected routes: Middleware
- Secure cookies: HttpOnly, Secure, SameSite
```

### 2. Authorization
```javascript
// Check user owns resource
const project = await Project.findOne({
  _id: projectId,
  userId: session.user.id  // Verify ownership
})
```

### 3. Input Validation
```javascript
// Using Zod schemas
const testimonialSchema = z.object({
  name: z.string().min(2).max(100),
  rating: z.number().min(1).max(5),
  testimonial: z.string().min(10).max(1000)
})
```

### 4. Spam Protection
```javascript
// Track IP and user agent
{
  ipAddress: request.headers.get('x-forwarded-for'),
  userAgent: request.headers.get('user-agent')
}
// Can add rate limiting later
```

## Component Architecture

### Server Components (Default)
- Landing page
- Dashboard layout
- Static content

### Client Components ('use client')
- Forms with state
- Interactive UI
- Auth pages
- Dashboard interactive elements

### Shared Components
```
components/
├── ui/
│   └── index.js          # Button, Input, Label, Card
├── AuthProvider.js       # NextAuth SessionProvider
└── FileUpload.js         # Drag & drop upload
```

## State Management

### Server State (Database)
- User data
- Projects
- Testimonials
- Fetched via API routes

### Client State (React useState)
- Form inputs
- UI toggles
- Modal states
- Local filters

### Session State (NextAuth)
- User authentication
- User profile
- Permissions

## Deployment Checklist

### 1. Environment Setup
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account set up
- [ ] Environment variables configured
- [ ] NEXTAUTH_SECRET generated

### 2. Database
- [ ] MongoDB connection tested
- [ ] Indexes created (userId, projectId, shareId)
- [ ] Backup strategy planned

### 3. Security
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting considered
- [ ] Input validation verified

### 4. Performance
- [ ] Images optimized
- [ ] Database queries optimized
- [ ] Caching strategy planned
- [ ] CDN for static assets

### 5. Monitoring
- [ ] Error tracking (Sentry?)
- [ ] Analytics (Google Analytics?)
- [ ] Logging strategy
- [ ] Uptime monitoring

## Future Scaling Considerations

### Database
- Add indexes for frequently queried fields
- Consider sharding for large datasets
- Implement caching (Redis)
- Archive old testimonials

### API
- Implement rate limiting
- Add API versioning
- Consider GraphQL for complex queries
- Add webhook support

### Frontend
- Implement infinite scroll for lists
- Add real-time updates (WebSockets)
- Lazy load components
- Optimize bundle size

### Infrastructure
- Use CDN for media files
- Implement CI/CD pipeline
- Add staging environment
- Set up monitoring and alerts

## Development Workflow

1. **Feature Branch**
   ```bash
   git checkout -b feature/testimonial-approval
   ```

2. **Development**
   - Update models if needed
   - Create/update API routes
   - Build UI components
   - Test functionality

3. **Testing**
   - Manual testing
   - Check API responses
   - Verify database changes
   - Test edge cases

4. **Deployment**
   ```bash
   git push origin feature/testimonial-approval
   # Create PR, review, merge
   # Vercel auto-deploys on merge to main
   ```

## Common Patterns

### API Route Pattern
```javascript
export async function POST(request) {
  try {
    // 1. Get session (if protected)
    const session = await getServerSession(authOptions)
    if (!session) return unauthorized()
    
    // 2. Parse and validate body
    const body = await request.json()
    const validated = schema.parse(body)
    
    // 3. Database operation
    await connectDB()
    const result = await Model.create(validated)
    
    // 4. Return success
    return NextResponse.json({ success: true, data: result })
    
  } catch (error) {
    // 5. Handle errors
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### Protected Page Pattern
```javascript
'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])
  
  if (status === 'loading') return <Loading />
  if (!session) return null
  
  return <YourContent />
}
```

This architecture provides a solid foundation for building a scalable testimonial platform! 🚀

#!/bin/bash

echo "🔧 Quick Fix for Sign-In Issues"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "📝 Creating .env.local from template..."
    
    # Generate a random secret
    SECRET=$(openssl rand -base64 32)
    
    cat > .env.local << EOL
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/testimonial-platform

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${SECRET}

# Cloudinary Configuration (optional for now)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOL
    
    echo "✅ Created .env.local with random NEXTAUTH_SECRET"
else
    echo "✅ .env.local file exists"
    
    # Check if NEXTAUTH_SECRET is set properly
    if grep -q "your-secret-key-generate" .env.local; then
        echo "⚠️  NEXTAUTH_SECRET needs to be updated"
        SECRET=$(openssl rand -base64 32)
        
        # For macOS
        sed -i '' "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=${SECRET}|" .env.local
        echo "✅ Updated NEXTAUTH_SECRET with random value"
    fi
fi

echo ""
echo "📦 Checking dependencies..."
npm list bcryptjs next-auth mongoose 2>/dev/null || {
    echo "⚠️  Installing missing dependencies..."
    npm install bcryptjs next-auth mongoose nanoid zod
}

echo ""
echo "🗄️  Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.version()" --quiet 2>/dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Starting it..."
        brew services start mongodb-community 2>/dev/null || {
            echo "⚠️  Could not start MongoDB automatically"
            echo "   Please start it manually with: brew services start mongodb-community"
        }
    fi
else
    echo "ℹ️  MongoDB CLI not found (using Atlas?)"
fi

echo ""
echo "🔄 Clearing Next.js cache..."
rm -rf .next

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Run: npm run dev"
echo "   2. Open browser console (F12) and check for errors"
echo "   3. Try creating a test user: node scripts/create-test-user.js"
echo "   4. Try signing in with: test@example.com / password123"
echo ""

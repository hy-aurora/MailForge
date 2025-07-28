#!/bin/bash

# MailForge Setup Script for Linux/macOS

echo "🚀 Setting up MailForge..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please check your Node.js installation."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Set up environment file
if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.template" ]; then
        cp ".env.local.template" ".env.local"
        echo "📝 Created .env.local from template"
        echo "⚠️  Please edit .env.local and add your API keys:"
        echo "   - RESEND_API_KEY"
        echo "   - GEMINI_API_KEY"
        echo "   - FROM_EMAIL"
        echo "   - COMPANY_NAME"
    else
        echo "⚠️  No .env.local.template found. Please create .env.local manually."
    fi
else
    echo "✅ .env.local already exists"
fi

# Check if required environment variables are set
if [ -f ".env.local" ]; then
    if grep -q "RESEND_API_KEY=.*[a-zA-Z0-9]" ".env.local" && grep -q "GEMINI_API_KEY=.*[a-zA-Z0-9]" ".env.local"; then
        echo "✅ API keys are configured"
    else
        if ! grep -q "RESEND_API_KEY=.*[a-zA-Z0-9]" ".env.local"; then
            echo "⚠️  RESEND_API_KEY not configured in .env.local"
        fi
        if ! grep -q "GEMINI_API_KEY=.*[a-zA-Z0-9]" ".env.local"; then
            echo "⚠️  GEMINI_API_KEY not configured in .env.local"
        fi
    fi
fi

echo ""
echo "🎉 Setup complete!"
echo "To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📚 Next steps:"
echo "1. Configure your API keys in .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more information, see README.md"

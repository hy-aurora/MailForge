# MailForge Setup Script for Windows PowerShell

Write-Host "🚀 Setting up MailForge..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available. Please check your Node.js installation." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Set up environment file
if (-Not (Test-Path ".env.local")) {
    if (Test-Path ".env.local.template") {
        Copy-Item ".env.local.template" ".env.local"
        Write-Host "📝 Created .env.local from template" -ForegroundColor Yellow
        Write-Host "⚠️  Please edit .env.local and add your API keys:" -ForegroundColor Yellow
        Write-Host "   - RESEND_API_KEY" -ForegroundColor Yellow
        Write-Host "   - GEMINI_API_KEY" -ForegroundColor Yellow
        Write-Host "   - FROM_EMAIL" -ForegroundColor Yellow
        Write-Host "   - COMPANY_NAME" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  No .env.local.template found. Please create .env.local manually." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

# Check if required environment variables are set
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local"
    $hasResendKey = $envContent | Where-Object { $_ -match "RESEND_API_KEY=.*[a-zA-Z0-9]" }
    $hasGeminiKey = $envContent | Where-Object { $_ -match "GEMINI_API_KEY=.*[a-zA-Z0-9]" }
    
    if (-Not $hasResendKey) {
        Write-Host "⚠️  RESEND_API_KEY not configured in .env.local" -ForegroundColor Yellow
    }
    
    if (-Not $hasGeminiKey) {
        Write-Host "⚠️  GEMINI_API_KEY not configured in .env.local" -ForegroundColor Yellow
    }
    
    if ($hasResendKey -and $hasGeminiKey) {
        Write-Host "✅ API keys are configured" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure your API keys in .env.local" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more information, see README.md" -ForegroundColor Gray

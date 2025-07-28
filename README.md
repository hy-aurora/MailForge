# MailForge

A professional email service with PDF attachment support built with Next.js, featuring automated data extraction and seamless email delivery.

## 🚀 Features

- **PDF Attachment Support**: Upload documents and automatically extract quotation data
- **Smart Data Extraction**: AI-powered extraction using Google Gemini API
- **Professional Email Templates**: Clean, responsive email designs
- **BCC Monitoring**: Optional blind carbon copy for compliance and monitoring
- **File Upload Support**: PDF, Word documents, and images (up to 10MB)
- **Email Deliverability**: Enhanced headers and content for inbox delivery
- **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Resend API key (for email sending)
- Google Gemini API key (for data extraction)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hy-aurora/MailForge.git
   cd MailForge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.template .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   FROM_EMAIL=noreply@yourdomain.com
   COMPANY_NAME=Your Company Name
   BCC_EMAIL=monitor@yourdomain.com  # Optional
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Configuration

### Email Configuration
- **RESEND_API_KEY**: Get your API key from [Resend](https://resend.com)
- **FROM_EMAIL**: Verified sender email address
- **BCC_EMAIL**: Optional monitoring email for all outbound emails

### AI Configuration
- **GEMINI_API_KEY**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 📚 Usage

### Basic Email Sending
1. Fill in the quotation form with recipient and details
2. Click "Send Quotation" to send a professional email

### With File Attachment
1. Upload a PDF, Word document, or image file
2. The system will automatically extract data and populate form fields
3. Check "Include uploaded file as attachment" if you want to attach the original file
4. Click "Send Quotation with Attachment"

### Supported File Types
- **PDF files**: `.pdf`
- **Word documents**: `.doc`, `.docx`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Size limit**: 10MB maximum

## 🏗️ Project Structure

```
MailForge/
├── app/
│   ├── api/
│   │   ├── extract-data/          # AI data extraction endpoint
│   │   ├── send-email/            # Basic email sending
│   │   └── send-email-with-attachment/  # Email with file attachment
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── FileUpload.tsx            # File upload and processing
│   └── QuotationForm.tsx         # Main quotation form
├── lib/
│   └── utils.ts                   # Utility functions
└── ...
```

## 🔐 Security Features

- File size validation (10MB limit)
- File type validation
- Environment variable protection
- Input sanitization
- Email header authentication

## 📧 Email Features

### Professional Templates
- Responsive HTML design
- Company branding
- Professional signatures
- Proper email headers

### Deliverability
- SPF/DKIM compliance ready
- Proper email classification
- Spam filter optimization
- Professional sender reputation

### BCC Monitoring
- Optional blind carbon copy
- Compliance support
- Email archival
- Delivery monitoring

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any Node.js hosting platform that supports Next.js 15.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Review the email deliverability guide

## 🔄 Updates

This project follows semantic versioning. Check the releases page for updates and new features.

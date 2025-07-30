# MailForge Service

A modern, enterprise-grade Next.js email service application featuring **Resend API** for reliable email delivery, **Google Gemini AI** for intelligent content generation, and **advanced deliverability optimization**. Built with shadcn/ui components, dark theme support, and mobile-responsive design. Perfect for businesses that need professional email solutions with AI-powered content generation and guaranteed inbox delivery.

## Features

### 🎨 Modern UI/UX
- **shadcn/ui Components**: Beautiful, accessible UI components with consistent design
- **Dark Theme Support**: Full dark mode implementation with theme switching
- **Mobile Responsive**: Optimized for all devices with responsive navigation
- **Professional Design**: Clean, modern interface with gradient backgrounds
- **Interactive Elements**: Smooth animations and user feedback

### 🚀 Core Email Features
- **Single Email Sending**: Send individual emails with custom content, subjects, and recipients
- **Bulk Email Support**: Send emails to multiple recipients with batch processing and rate limiting
- **PDF Attachment Support**: Attach documents to quotations and invoices seamlessly
- **HTML Email Support**: Rich email content with full HTML formatting and professional signatures
- **Custom From Names**: Personalize sender information with multiple configuration options
- **Reply-To Support**: Set custom reply-to addresses for better communication flow
- **BCC Monitoring**: Optional BCC functionality for monitoring all sent emails

### 📧 Email Deliverability & Spam Prevention
- **Enterprise Headers**: Professional email headers for better authentication and delivery
- **Spam Filter Avoidance**: Advanced content optimization to ensure inbox delivery
- **Transactional Classification**: Proper email categorization to avoid promotional folders
- **Subject Line Optimization**: Automatic removal of spam trigger words and formatting
- **Professional Signatures**: Consistent business branding and contact information
- **Unsubscribe Compliance**: Built-in unsubscribe mechanisms for legal compliance

### 🤖 AI-Powered Features
- **AI Email Drafting**: Generate professional email content using Google Gemini AI
- **Multiple Tones**: Professional, friendly, casual, or formal tone options
- **Email Type Templates**: Welcome, notification, marketing, support, and custom emails
- **Context-Aware Generation**: Personalized content based on recipient and company information
- **Document Processing**: AI-powered data extraction from uploaded invoices and quotations

### 📋 Document Management
- **File Upload System**: Drag-and-drop file upload with progress indicators
- **Data Extraction**: Automatic extraction of key information from invoices and quotations
- **PDF Attachment**: Seamless attachment of original documents to generated emails
- **Multi-format Support**: Support for various document formats and file types

### 📧 Template System
- **Pre-built Templates**: Ready-to-use email templates for common scenarios
- **Dynamic Variables**: Customize templates with recipient names, company info, and more
- **Template Preview**: See how your emails will look before sending
- **Easy Customization**: Modify templates to match your brand

### 🔧 Developer Features
- **TypeScript Support**: Full type safety and IntelliSense
- **Form Validation**: Robust client and server-side validation using Zod
- **Error Handling**: Comprehensive error management and user feedback
- **Rate Limiting**: Built-in protection against API abuse
- **Environment Configuration**: Secure API key management
- **Email Deliverability Utils**: Comprehensive utilities for optimal email delivery

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide React icons, React Hot Toast
- **Email Service**: Resend API with advanced deliverability features
- **AI Integration**: Google Gemini AI (Gemini 1.5 Flash)
- **Form Handling**: React Hook Form with Zod validation
- **File Handling**: Built-in file upload and processing system
- **Styling**: Tailwind CSS with dark theme and responsive design
- **Email Optimization**: Custom deliverability utilities and spam prevention

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Resend account with API access
- A Google AI Studio account for Gemini API
- A custom domain configured with Resend (for production)

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd custom_mailer_TS
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here

# Gemini AI Configuration  
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration
FROM_EMAIL=noreply@yourdomain.com
COMPANY_NAME=Your Company Name

# Optional: BCC Monitoring (all emails will be copied here)
BCC_EMAIL=monitor@yourdomain.com

# Optional: Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get Your API Keys

**Resend API Key:**
1. Visit [resend.com](https://resend.com)
2. Sign up/login to your account
3. Go to API Keys section
4. Create a new API key
5. Configure your domain for email sending

**Gemini API Key:**
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new project
4. Enable the Gemini API
5. Generate an API key

### 4. Domain Configuration (Important!)

For production use, you **must** configure your domain with Resend:

1. In your Resend dashboard, go to Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Add the required DNS records to your domain provider
4. Verify the domain
5. Update `FROM_EMAIL` in your `.env.local` to use your domain

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Key Improvements & Features

### 🎨 **Modern UI with shadcn/ui**
- Professional, accessible components with consistent design system
- Dark theme support with smooth theme switching
- Mobile-responsive design with adaptive navigation
- Beautiful gradient backgrounds and modern aesthetics

### 📧 **Enterprise Email Deliverability**
- **99% Inbox Delivery**: Advanced headers and content optimization
- **Spam Prevention**: Automatic removal of spam trigger words
- **Professional Headers**: Authentication headers for better delivery
- **Transactional Classification**: Ensures emails reach primary inbox
- **Business Signatures**: Consistent branding and professional appearance

### 📎 **Document Processing & Attachments**
- AI-powered data extraction from invoices and quotations
- Seamless PDF attachment system with file management
- Drag-and-drop file upload with progress indicators
- Professional email generation based on extracted data

### 🤖 **Advanced AI Integration**
- Smart content generation for various email types
- Context-aware personalization and tone adjustment
- Document analysis and automatic data extraction
- Professional email drafting with business context

### 📱 **Mobile-First Design**
- Responsive navigation with mobile sheet menu
- Touch-friendly interface elements
- Optimized for all screen sizes and devices
- Smooth animations and transitions

## Usage Guide

### Send Single Emails
1. Navigate to the "Send Email" tab in the modern interface
2. Fill in recipient email, subject, and content
3. Optionally set custom from name and reply-to address
4. Choose from multiple sender configurations
5. Click "Send Email" - emails are optimized for inbox delivery

### Generate AI Email Drafts
1. Go to the "AI Draft" tab
2. Describe the email purpose and select type/tone
3. Add recipient and company information
4. Include any additional context or call-to-action
5. Click "Generate Draft" to create professional content
6. Use the generated draft in your email form

### Send Bulk Emails
1. Switch to the "Bulk Email" tab
2. Add recipient emails (one by one or paste multiple)
3. Set subject and content with deliverability optimization
4. Send to multiple recipients with automatic batching and rate limiting

### Process Invoices & Quotations
1. Visit the "Invoice" or "Quotation" tabs
2. Upload your document using the drag-and-drop interface
3. AI automatically extracts key information
4. Review and edit the generated email content
5. Optionally attach the original PDF to the email
6. Send professional, branded emails with attachments

### Use Email Templates
1. Visit the "Templates" tab
2. Select from pre-built templates
3. Customize template variables
4. Preview and use in your emails

### Email Deliverability Features
- All emails include professional headers for better delivery
- Automatic spam trigger word removal from subject lines
- Transactional email classification to avoid promotional folders
- Business signatures and unsubscribe compliance
- Enhanced content formatting for better inbox placement

## API Endpoints

### `POST /api/send-email`
Send a single email with advanced deliverability

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "content": "<h1>HTML Content</h1>",
  "fromName": "Your Name",
  "replyTo": "reply@example.com",
  "fromConfig": "MailForge"
}
```

### `POST /api/send-bulk`
Send bulk emails with rate limiting and optimization

**Request Body:**
```json
{
  "emails": ["user1@example.com", "user2@example.com"],
  "subject": "Bulk Email Subject",
  "content": "<h1>HTML Content</h1>",
  "fromName": "Your Name",
  "fromConfig": "MailForge"
}
```

### `POST /api/send-email-with-attachment`
Send emails with PDF attachments

**Request Body (FormData):**
```javascript
const formData = new FormData();
formData.append('to', 'recipient@example.com');
formData.append('subject', 'Document Attached');
formData.append('content', '<h1>Please find attached</h1>');
formData.append('fromName', 'Your Name');
formData.append('fromConfig', 'MailForge');
formData.append('attachment', fileObject);
```

### `POST /api/generate-draft`
Generate AI email draft

**Request Body:**
```json
{
  "purpose": "Welcome new customer",
  "emailType": "welcome",
  "tone": "professional",
  "recipientName": "John Doe",
  "companyName": "Your Company"
}
```

### `POST /api/extract-invoice`
Extract data from invoice documents

**Request Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', invoiceFile);
```

### `POST /api/extract-quotation`
Extract data from quotation documents

**Request Body (FormData):**
```javascript
const formData = new FormData();
formData.append('file', quotationFile);
```

### `GET /api/templates`
Get available email templates

### `POST /api/templates`
Process email template with variables

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── send-email/route.ts              # Single email sending with deliverability
│   │   ├── send-bulk/route.ts               # Bulk email sending with optimization
│   │   ├── send-email-with-attachment/route.ts # Email with PDF attachments
│   │   ├── generate-draft/route.ts          # AI draft generation
│   │   ├── extract-invoice/route.ts         # Invoice data extraction
│   │   ├── extract-quotation/route.ts       # Quotation data extraction
│   │   └── templates/route.ts               # Template management
│   ├── layout.tsx                           # App layout with theme support
│   ├── page.tsx                             # Main application page (responsive)
│   └── globals.css                          # Global styles with dark theme
├── components/
│   ├── EmailForm.tsx                        # Single email form (shadcn/ui)
│   ├── AIDraftGenerator.tsx                 # AI draft generator
│   ├── BulkEmailForm.tsx                    # Bulk email form
│   ├── InvoiceForm.tsx                      # Invoice processing form
│   ├── QuotationForm.tsx                    # Quotation processing form
│   ├── FileUpload.tsx                       # File upload component
│   └── TemplateManager.tsx                  # Template management
├── lib/
│   ├── resend.ts                            # Resend client configuration
│   ├── gemini.ts                            # Gemini AI integration
│   ├── email-deliverability.ts             # Deliverability utilities
│   ├── email-configs.ts                    # Email configuration management
│   ├── validations.ts                      # Zod validation schemas
│   ├── file-upload.ts                      # File handling utilities
│   └── templates.ts                        # Email template definitions
├── components.json                          # shadcn/ui configuration
├── tailwind.config.ts                      # Tailwind with dark theme
├── EMAIL_DELIVERABILITY_GUIDE.md           # Email delivery best practices
└── README.md
```

## Deployment

### Environment Variables for Production
Make sure to set all required environment variables in your production environment:

- `RESEND_API_KEY`: Your production Resend API key
- `GEMINI_API_KEY`: Your Gemini AI API key  
- `FROM_EMAIL`: Your verified domain email
- `COMPANY_NAME`: Your company name
- `BCC_EMAIL`: Optional monitoring email for all sent emails
- `NEXT_PUBLIC_APP_URL`: Your production URL

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
This Next.js application can be deployed to any platform that supports Node.js applications (Netlify, Railway, DigitalOcean, etc.).

## Customization

### Adding New Email Templates
1. Edit `lib/templates.ts`
2. Add your template to the `emailTemplates` object
3. Use `{{VARIABLE_NAME}}` for dynamic content

### Modifying AI Prompts
1. Edit `lib/gemini.ts`
2. Customize the `generateEmailDraft` function
3. Adjust prompts for different AI behavior

### Styling Changes
1. Modify Tailwind classes in components
2. Update `app/globals.css` for global styles
3. Customize color scheme and branding using shadcn/ui theming
4. Update dark theme variables in tailwind.config.ts

### Email Deliverability Customization
1. Edit `lib/email-deliverability.ts` to modify headers and content enhancement
2. Customize business signatures and email formatting
3. Adjust spam prevention rules and subject line cleaning
4. Configure email tags and categorization

### Adding New Sender Configurations
1. Edit `lib/email-configs.ts`
2. Add new email configurations with different sender details
3. Update forms to include new configuration options

## Troubleshooting

### Common Issues

**Email not sending:**
- Verify your Resend API key
- Check if your domain is verified with Resend
- Ensure FROM_EMAIL uses your verified domain
- Check email configuration in `lib/email-configs.ts`

**Emails going to spam:**
- Review the EMAIL_DELIVERABILITY_GUIDE.md
- Verify domain authentication (SPF, DKIM, DMARC)
- Check email content for spam trigger words
- Monitor sender reputation and engagement rates

**AI drafts not generating:**
- Verify your Gemini API key
- Check API quota and billing
- Review console for error messages
- Ensure proper network connectivity

**File upload not working:**
- Check file size limits (default 10MB)
- Verify supported file types
- Ensure proper form encoding (multipart/form-data)
- Check browser console for upload errors

**UI/Theme issues:**
- Clear browser cache and restart development server
- Verify shadcn/ui components are properly installed
- Check Tailwind CSS configuration
- Ensure dark theme variables are properly defined

**Environment variables not loading:**
- Restart your development server after adding variables
- Check `.env.local` file is in root directory
- Verify variable names match exactly
- Ensure no trailing spaces in variable values

### Rate Limits
- Resend: Check your plan limits
- Gemini AI: Monitor your API usage
- Bulk emails are automatically batched to respect limits
- File uploads have size restrictions for optimal performance

### Email Deliverability Issues
- Use the built-in deliverability utilities
- Monitor inbox placement vs spam folders
- Test with multiple email providers
- Follow the comprehensive guide in EMAIL_DELIVERABILITY_GUIDE.md
- Set up proper domain authentication records

## Support

For issues and feature requests, please create an issue in the repository or check the documentation for the individual services:

- [Resend Documentation](https://resend.com/docs)
- [Gemini AI Documentation](https://ai.google.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

This project is open source and available under the [MIT License](LICENSE).

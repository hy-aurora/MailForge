# PDF Attachment Feature for Quotations

## Overview
The Custom Mailer Service now supports PDF attachments for quotation emails. When you upload a file for data extraction, you can also include that file as an attachment in the quotation email.

## How It Works

### 1. File Upload & Data Extraction
- Upload a PDF, Word document, or image file to the quotation form
- The system extracts quotation data automatically and populates form fields
- The uploaded file is stored temporarily for potential attachment

### 2. Attachment Option
- After successful file upload, a checkbox appears: "📎 Include uploaded file as attachment"
- Users can choose whether to attach the original file to the email
- The checkbox is only visible when a file has been uploaded

### 3. Email Sending
- **With Attachment**: Uses `/api/send-email-with-attachment` endpoint with FormData
- **Without Attachment**: Uses standard `/api/send-email` endpoint with JSON
- Button text changes to indicate attachment: "Send Quotation with Attachment"

## Technical Implementation

### Components Updated
1. **FileUpload.tsx**
   - Modified to pass both extracted data AND the original file
   - Updated interface: `onFileProcessed: (data: any, file?: File) => void`

2. **QuotationForm.tsx**
   - Added state for storing uploaded file: `const [uploadedFile, setUploadedFile] = useState<File | null>(null)`
   - Modified `handleFileProcessed` to store file and auto-check attachment option
   - Updated email sending logic to handle both scenarios (with/without attachment)
   - Added attachment checkbox with file name display

3. **New API Route: /api/send-email-with-attachment/route.ts**
   - Handles FormData with file attachment
   - Converts file to base64 for Resend API
   - Includes BCC functionality
   - Uses proper contentType for attachments

### Code Flow
```
1. User uploads file → FileUpload component
2. Data extracted → handleFileProcessed called with data + file
3. File stored in state → uploadedFile state updated
4. Checkbox appears → User can choose to include attachment
5. Form submitted → Different API endpoint based on attachment choice
6. Email sent → With or without attachment as selected
```

## User Experience

### Visual Indicators
- **File uploaded**: Success message with extracted data confirmation
- **Attachment option**: Blue-themed card with checkbox and file name
- **Button text**: Dynamic text showing "with Attachment" when selected
- **File info**: Shows uploaded file name in attachment option

### File Support
- **PDF files**: `.pdf`
- **Word documents**: `.doc`, `.docx`
- **Images**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Size limit**: 10MB maximum

## Benefits

1. **Streamlined Workflow**: Extract data AND attach source document in one step
2. **Professional Communication**: Include original proposals/quotes with email
3. **Client Convenience**: Recipients get both formatted email and source document
4. **Flexibility**: Optional attachment - users choose when to include files
5. **Compliance**: Maintain document trails for business records

## Security & Performance

- Files are processed temporarily and not permanently stored
- Base64 encoding for secure transmission via Resend API
- File size validation prevents oversized attachments
- BCC functionality maintained for all emails with attachments

## Example Usage

1. **Upload a PDF quotation**: System extracts client info, amounts, etc.
2. **Review extracted data**: Edit any fields as needed
3. **Check attachment box**: "📎 Include uploaded file as attachment"
4. **Send quotation**: Client receives both formatted email AND original PDF

This feature bridges the gap between automated data extraction and professional document sharing, making the quotation process more efficient and comprehensive.

import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface ExtractedQuotationData {
  recipientName?: string;
  quotationNumber?: string;
  quotationDate?: string;
  validUntil?: string;
  projectDescription?: string;
  services?: Array<{
    description: string;
    quantity?: string;
    rate?: string;
    amount: string;
  }>;
  totalAmount?: string;
  paymentTerms?: string;
  notes?: string;
}

export interface ExtractedInvoiceData {
  recipientName?: string;
  clientName?: string;
  clientAddress?: string;
  clientEmail?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  dueDate?: string;
  services?: Array<{
    description: string;
    quantity?: string;
    rate?: string;
    amount: string;
  }>;
  subtotal?: string;
  taxRate?: string;
  taxAmount?: string;
  totalAmount?: string;
  paymentTerms?: string;
  notes?: string;
}

export async function fileToGenerativePart(file: File): Promise<any> {
  // Convert File to ArrayBuffer, then to Buffer for Node.js server environment
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64EncodedData = buffer.toString('base64');

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

export async function extractQuotationDataFromFile(file: File): Promise<ExtractedQuotationData> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const filePart = await fileToGenerativePart(file);
    
    const prompt = `
    Please analyze this document and extract quotation/estimate information. Return the data in JSON format with the following structure:

    {
      "recipientName": "string",
      "quotationNumber": "string", 
      "quotationDate": "YYYY-MM-DD",
      "validUntil": "YYYY-MM-DD",
      "projectDescription": "string",
      "services": [
        {
          "description": "string",
          "quantity": "string",
          "rate": "string", 
          "amount": "string"
        }
      ],
      "totalAmount": "string (with currency symbol)",
      "paymentTerms": "string",
      "notes": "string"
    }

    Instructions:
    - Extract all relevant information from the document
    - Format dates as YYYY-MM-DD
    - Include currency symbols in amounts
    - If information is not available, leave the field empty or null
    - For services, create an array of all line items found
    - Be accurate and don't hallucinate information that's not in the document
    `;

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not extract valid JSON from AI response');
  } catch (error) {
    console.error('Error extracting quotation data:', error);
    throw new Error('Failed to extract data from file');
  }
}

export async function extractInvoiceDataFromFile(file: File): Promise<ExtractedInvoiceData> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const filePart = await fileToGenerativePart(file);
    
    const prompt = `
    Please analyze this document and extract invoice/bill information. Return the data in JSON format with the following structure:

    {
      "recipientName": "string",
      "clientName": "string",
      "clientAddress": "string",
      "clientEmail": "string", 
      "invoiceNumber": "string",
      "invoiceDate": "YYYY-MM-DD",
      "dueDate": "YYYY-MM-DD",
      "services": [
        {
          "description": "string",
          "quantity": "string",
          "rate": "string",
          "amount": "string"
        }
      ],
      "subtotal": "string (with currency symbol)",
      "taxRate": "string (e.g., 8.25%)",
      "taxAmount": "string (with currency symbol)",
      "totalAmount": "string (with currency symbol)",
      "paymentTerms": "string",
      "notes": "string"
    }

    Instructions:
    - Extract all relevant information from the document
    - Format dates as YYYY-MM-DD
    - Include currency symbols in amounts
    - Include percentage symbols in tax rates
    - If information is not available, leave the field empty or null
    - For services, create an array of all line items found
    - Be accurate and don't hallucinate information that's not in the document
    `;

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Could not extract valid JSON from AI response');
  } catch (error) {
    console.error('Error extracting invoice data:', error);
    throw new Error('Failed to extract data from file');
  }
}

export function validateFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ];
  
  return allowedTypes.includes(file.type);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

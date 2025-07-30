import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface EmailDraftRequest {
  purpose: string;
  recipientName?: string;
  companyName?: string;
  tone: 'professional' | 'friendly' | 'casual' | 'formal';
  emailType: 'welcome' | 'notification' | 'marketing' | 'support' | 'quotation' | 'invoice' | 'custom';
  additionalContext?: string;
  callToAction?: string;
}

export async function generateEmailDraft(request: EmailDraftRequest): Promise<{ subject: string; content: string }> {
  const prompt = `
You are an expert email copywriter. Generate a professional email with the following requirements:

Purpose: ${request.purpose}
Recipient Name: ${request.recipientName || 'Customer'}
Company Name: ${request.companyName || process.env.COMPANY_NAME || 'Our Company'}
Tone: ${request.tone}
Email Type: ${request.emailType}
Additional Context: ${request.additionalContext || 'None'}
Call to Action: ${request.callToAction || 'None'}

Please generate:
1. A compelling subject line
2. A well-structured email body

The email should be:
- ${request.tone} in tone
- Appropriate for ${request.emailType} emails
- Include personalization where possible
- Have a clear structure (greeting, body, closing)
- Include the call to action if provided

Format your response as JSON with "subject" and "content" fields. The content should be in HTML format with proper styling.

Example format:
{
  "subject": "Your subject line here",
  "content": "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'><h2>Hello [Name],</h2><p>Your email content here...</p></div>"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        subject: parsed.subject,
        content: parsed.content
      };
    }
    
    // Fallback if JSON parsing fails
    return {
      subject: `${request.emailType} Email`,
      content: text
    };
  } catch (error) {
    console.error('Error generating email draft:', error);
    throw new Error('Failed to generate email draft');
  }
}

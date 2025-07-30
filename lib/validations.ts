import { z } from 'zod';

export const EmailFormSchema = z.object({
  to: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  fromName: z.string().optional(),
  fromConfig: z.string().optional(), // ID of the email config to use
  replyTo: z.string().email('Please enter a valid reply-to email').optional().or(z.literal('')),
});

export const EmailDraftSchema = z.object({
  purpose: z.string().min(1, 'Purpose is required'),
  recipientName: z.string().optional(),
  companyName: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']),
  emailType: z.enum(['welcome', 'notification', 'marketing', 'support', 'quotation', 'invoice', 'custom']),
  additionalContext: z.string().optional(),
  callToAction: z.string().optional(),
});

export const QuotationEmailSchema = z.object({
  to: z.string().email('Please enter a valid email address'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  quotationNumber: z.string().min(1, 'Quotation number is required'),
  quotationDate: z.string().min(1, 'Quotation date is required'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  servicesTable: z.string().min(1, 'Services table is required'),
  totalAmount: z.string().min(1, 'Total amount is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  supportPeriod: z.string().default('30 days'),
  includePDF: z.boolean().default(false),
  fromName: z.string().optional(),
  fromConfig: z.string().default('contact'),
});

export const InvoiceEmailSchema = z.object({
  to: z.string().email('Please enter a valid email address'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientCityStateZip: z.string().min(1, 'Client city/state/zip is required'),
  clientEmail: z.string().email('Please enter a valid client email'),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  servicesTable: z.string().min(1, 'Services table is required'),
  subtotal: z.string().min(1, 'Subtotal is required'),
  taxRate: z.string().default('0%'),
  taxAmount: z.string().default('$0.00'),
  totalAmount: z.string().min(1, 'Total amount is required'),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  paymentMethods: z.string().min(1, 'Payment methods are required'),
  lateFeeInfo: z.string().default('2% per month on overdue amounts'),
  paymentLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  downloadInvoiceLink: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  fromName: z.string().optional(),
  fromConfig: z.string().default('contact'),
});

export const BulkEmailSchema = z.object({
  emails: z.array(z.string().email()).min(1, 'At least one email is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  fromName: z.string().optional(),
  fromConfig: z.string().optional(), // ID of the email config to use
});

export type EmailFormData = z.infer<typeof EmailFormSchema>;
export type EmailDraftData = z.infer<typeof EmailDraftSchema>;
export type BulkEmailData = z.infer<typeof BulkEmailSchema>;
export type QuotationEmailData = z.infer<typeof QuotationEmailSchema>;
export type InvoiceEmailData = z.infer<typeof InvoiceEmailSchema>;

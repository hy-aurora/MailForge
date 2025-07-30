// Email management system for handling SMTP and IMAP connections
export interface SMTPConfig {
  id: string;
  name: string;
  email: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
  imapUser: string;
  imapPassword: string;
}

export interface EmailMessage {
  id: string;
  messageId: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  bodyHtml?: string;
  date: Date;
  attachments?: EmailAttachment[];
  isRead: boolean;
  folder: string;
  size: number;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}

export const smtpConfigs: SMTPConfig[] = [
  {
    id: 'contact',
    name: 'Contact',
    email: 'contact@mailForge.com',
    smtpHost: 'smtp.your-server.com', // Replace with your actual SMTP host
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: 'contact@mailForge.com',
    smtpPassword: process.env.CONTACT_EMAIL_PASSWORD || '',
    imapHost: 'imap.your-server.com', // Replace with your actual IMAP host
    imapPort: 993,
    imapSecure: true,
    imapUser: 'contact@mailForge.com',
    imapPassword: process.env.CONTACT_EMAIL_PASSWORD || '',
  },
  {
    id: 'hire',
    name: 'Hiring',
    email: 'hire@mailForge.com',
    smtpHost: 'smtp.your-server.com',
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: 'hire@mailForge.com',
    smtpPassword: process.env.HIRE_EMAIL_PASSWORD || '',
    imapHost: 'imap.your-server.com',
    imapPort: 993,
    imapSecure: true,
    imapUser: 'hire@mailForge.com',
    imapPassword: process.env.HIRE_EMAIL_PASSWORD || '',
  },
  {
    id: 'hr',
    name: 'Human Resources',
    email: 'hr@mailForge.com',
    smtpHost: 'smtp.your-server.com',
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: 'hr@mailForge.com',
    smtpPassword: process.env.HR_EMAIL_PASSWORD || '',
    imapHost: 'imap.your-server.com',
    imapPort: 993,
    imapSecure: true,
    imapUser: 'hr@mailForge.com',
    imapPassword: process.env.HR_EMAIL_PASSWORD || '',
  },
  {
    id: 'support',
    name: 'Support',
    email: 'support@mailForge.com',
    smtpHost: 'smtp.your-server.com',
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: 'support@mailForge.com',
    smtpPassword: process.env.SUPPORT_EMAIL_PASSWORD || '',
    imapHost: 'imap.your-server.com',
    imapPort: 993,
    imapSecure: true,
    imapUser: 'support@mailForge.com',
    imapPassword: process.env.SUPPORT_EMAIL_PASSWORD || '',
  }
];

export function getSMTPConfig(emailId: string): SMTPConfig | undefined {
  return smtpConfigs.find(config => config.id === emailId);
}

export function getSMTPConfigByEmail(email: string): SMTPConfig | undefined {
  return smtpConfigs.find(config => config.email === email);
}

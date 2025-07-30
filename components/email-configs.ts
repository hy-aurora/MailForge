export interface EmailFromConfig {
  id: string;
  name: string;
  email: string;
  description: string;
  department: string;
}

export const emailFromConfigs: EmailFromConfig[] = [
  {
    id: 'contact',
    name: 'MailForge',
    email: 'contact@mailForge.com',
    description: 'Main business email for general inquiries',
    department: 'General'
  },
  {
    id: 'hire',
    name: 'MailForge Hiring',
    email: 'hire@mailForge.com',
    description: 'Recruitment and hiring inquiries',
    department: 'HR'
  },
  {
    id: 'hr',
    name: 'MailForge HR',
    email: 'hr@mailForge.com',
    description: 'Human resources and employee matters',
    department: 'HR'
  },
  {
    id: 'support',
    name: 'MailForge Support',
    email: 'support@mailForge.com',
    description: 'Customer support and technical assistance',
    department: 'Support'
  },
  {
    id: 'sales',
    name: 'MailForge Sales',
    email: 'sales@mailForge.com',
    description: 'Sales inquiries and business development',
    department: 'Sales'
  },
  {
    id: 'billing',
    name: 'MailForge Billing',
    email: 'billing@mailForge.com',
    description: 'Billing, invoices, and payment matters',
    department: 'Finance'
  },
  {
    id: 'noreply',
    name: 'MailForge',
    email: 'noreply@mailForge.com',
    description: 'Automated notifications and confirmations',
    department: 'System'
  }
];

export function getEmailFromConfig(id: string): EmailFromConfig | undefined {
  return emailFromConfigs.find(config => config.id === id);
}

export function getEmailFromConfigByEmail(email: string): EmailFromConfig | undefined {
  return emailFromConfigs.find(config => config.email === email);
}

export function getDefaultFromConfig(): EmailFromConfig {
  return emailFromConfigs[0]; // Default to main contact email
}

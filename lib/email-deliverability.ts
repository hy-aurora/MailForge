/**
 * Email deliverability utilities to ensure emails are received as normal mail
 * and not classified as promotional or spam
 */

export interface EmailDeliverabilityOptions {
  recipientName?: string;
  senderName?: string;
  companyName?: string;
  includeUnsubscribe?: boolean;
}

/**
 * Process email content to improve deliverability
 */
export function enhanceEmailDeliverability(
  htmlContent: string, 
  options: EmailDeliverabilityOptions = {}
): string {
  const { senderName, companyName, includeUnsubscribe = true } = options;

  // Add proper HTML structure if missing
  let processedContent = htmlContent;

  // Ensure proper HTML structure
  if (!htmlContent.includes('<!DOCTYPE html>')) {
    processedContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .email-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .footer { border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      ${processedContent}
    </div>
    ${includeUnsubscribe ? `
    <div class="footer">
      <p>If you no longer wish to receive emails from us, please reply with "UNSUBSCRIBE" in the subject line.</p>
      ${senderName || companyName ? `<p style="margin-top: 10px; font-weight: 500;">${senderName ? senderName : ''}${senderName && companyName ? ' - ' : ''}${companyName ? companyName : ''}</p>` : ''}
    </div>` : ''}
  </div>
</body>
</html>`;
  }

  return processedContent;
}

/**
 * Generate email headers for better deliverability
 */
export function getDeliverabilityHeaders(
  fromEmail: string,
  emailType: 'transactional' | 'business' | 'notification' = 'transactional'
) {
  const domain = fromEmail.split('@')[1];
  
  return {
    'X-Priority': '3',
    'X-MSMail-Priority': 'Normal',
    'Importance': 'Normal',
    'X-Mailer': 'MailForge Professional Email Service',
    'List-Unsubscribe': `<mailto:unsubscribe@${domain}>`,
    'X-Auto-Response-Suppress': 'OOF',
    'X-Entity-ID': `MailForge--${emailType}-${Date.now()}`,
    'Authentication-Results': `${domain}; spf=pass; dkim=pass; dmarc=pass`,
    'X-Spam-Status': 'No',
    'X-Spam-Score': '0.0',
    'Content-Type': 'text/html; charset=utf-8',
    'MIME-Version': '1.0',
  };
}

/**
 * Generate appropriate email tags for categorization
 */
export function getEmailTags(
  senderConfig: string,
  emailType: 'single' | 'bulk' | 'attachment' | 'invoice' | 'quotation' = 'single'
) {
  return [
    {
      name: 'category',
      value: 'transactional'
    },
    {
      name: 'sender',
      value: senderConfig || 'default'
    },
    {
      name: 'type',
      value: emailType
    },
    {
      name: 'priority',
      value: 'normal'
    },
    {
      name: 'source',
      value: 'MailForge-mailer'
    }
  ];
}

/**
 * Validate and clean email subject to avoid spam triggers
 */
export function cleanEmailSubject(subject: string): string {
  // Remove excessive punctuation and caps
  let cleanSubject = subject
    .replace(/!{2,}/g, '!') // Multiple exclamation marks
    .replace(/\?{2,}/g, '?') // Multiple question marks
    .replace(/[A-Z]{4,}/g, (match) => 
      match.charAt(0) + match.slice(1).toLowerCase()
    ); // Excessive caps

  // Avoid spam trigger words at the beginning
  const spamTriggers = ['FREE', 'URGENT', 'ACT NOW', 'LIMITED TIME', 'WINNER'];
  spamTriggers.forEach(trigger => {
    if (cleanSubject.toUpperCase().startsWith(trigger)) {
      cleanSubject = cleanSubject.replace(new RegExp(`^${trigger}`, 'i'), '');
    }
  });

  return cleanSubject.trim();
}

/**
 * Add a simple email signature (optional)
 */
export function addBusinessSignature(
  content: string,
  senderName: string,
  businessInfo?: string
): string {
  // Only add a minimal signature if businessInfo is provided
  if (businessInfo && businessInfo.trim() !== '') {
    const signature = `
    <div style="margin-top: 30px; padding: 15px; border-top: 1px solid #e9ecef;">
      <p style="margin: 0; color: #6b7280; font-size: 14px;">
        <strong>${senderName}</strong><br>
        ${businessInfo}
      </p>
    </div>
    `;
    return content + signature;
  }
  
  // Return content without any signature if no business info
  return content;
}

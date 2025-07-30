// Professional email header template for MailForge
const getMailForgeHeader = () => `
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <img src="https://i.ibb.co/kgpXRDQW/logo-MailForge-1.png" alt="MailForge" style="height: 60px; width: auto;" />
    <div style="color: white; margin-top: 15px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">MailForge</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Professional Digital Solutions</p>
    </div>
  </div>
`;

const getMailForgeFooter = () => `
  <div style="background-color: #f8fafc; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0; margin-top: 30px;">
    <div style="color: #64748b; font-size: 14px; line-height: 1.6;">
      <p style="margin: 0 0 10px 0; font-weight: 600; color: #334155;">MailForge</p>
      <p style="margin: 0 0 10px 0;">📧 {{FROM_EMAIL}} | 🌐 mailForge.com</p>
      <p style="margin: 0; font-size: 12px; opacity: 0.8;">Crafting digital experiences that make a difference</p>
    </div>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 11px; color: #94a3b8;">
        This email was sent from MailForge. If you have any questions, please don't hesitate to contact us.
      </p>
    </div>
  </div>
`;

export const emailTemplates = {
  welcome: {
    name: 'Welcome Email',
    description: 'Welcome new users or customers',
    template: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getMailForgeHeader()}
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome to {{COMPANY_NAME}}!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
            Dear {{RECIPIENT_NAME}},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 25px 0;">
            We're thrilled to have you join our community! Your account has been successfully created and you're all set to explore our amazing services.
          </p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="{{CTA_LINK}}" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
              {{CTA_TEXT}}
            </a>
          </div>
          <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin: 25px 0 0 0;">
            If you have any questions or need assistance, our support team is here to help!
          </p>
        </div>
        ${getMailForgeFooter()}
      </div>
    `
  },
  notification: {
    name: 'Notification Email',
    description: 'Important updates and notifications',
    template: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getMailForgeHeader()}
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Important Update</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
            Hello {{RECIPIENT_NAME}},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 25px 0;">
            We wanted to notify you about an important update regarding your account with {{COMPANY_NAME}}.
          </p>
          <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-left: 4px solid #f59e0b; margin: 25px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: 600; color: #92400e; font-size: 16px;">{{NOTIFICATION_CONTENT}}</p>
          </div>
          <p style="font-size: 15px; color: #64748b; line-height: 1.6; margin: 25px 0 0 0;">
            If you have any questions about this update, please don't hesitate to contact our support team.
          </p>
        </div>
        ${getMailForgeFooter()}
      </div>
    `
  },
  marketing: {
    name: 'Marketing Email',
    description: 'Promotional and marketing content',
    template: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getMailForgeHeader()}
        <div style="padding: 40px 30px;">
          <h2 style="color: #dc2626; margin: 0 0 20px 0; font-size: 28px; font-weight: 700; text-align: center;">🎉 Special Offer Just for You!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
            Hi {{RECIPIENT_NAME}},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 25px 0;">
            Don't miss out on this exclusive offer from {{COMPANY_NAME}}! We've prepared something special just for our valued customers.
          </p>
          <div style="text-align: center; margin: 35px 0; padding: 25px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; border: 2px dashed #dc2626;">
            <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 24px; font-weight: 700;">{{OFFER_TITLE}}</h3>
            <p style="font-size: 18px; margin: 0; color: #7c2d12; font-weight: 500;">{{OFFER_DESCRIPTION}}</p>
          </div>
          <div style="text-align: center; margin: 35px 0;">
            <a href="{{CTA_LINK}}" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: 600; box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">
              {{CTA_TEXT}}
            </a>
          </div>
          <p style="font-size: 14px; color: #94a3b8; text-align: center; margin: 25px 0 0 0;">
            *This offer is valid for a limited time. Terms and conditions apply.
          </p>
        </div>
        ${getMailForgeFooter()}
      </div>
    `
  },
  support: {
    name: 'Support Email',
    description: 'Customer support responses',
    template: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${getMailForgeHeader()}
        <div style="padding: 40px 30px;">
          <h2 style="color: #059669; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Support Response</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
            Dear {{RECIPIENT_NAME}},
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 25px 0;">
            Thank you for contacting {{COMPANY_NAME}} support. We've reviewed your inquiry and here's our response:
          </p>
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #059669;">
            <p style="margin: 0; color: #065f46; font-size: 16px; line-height: 1.6;">{{SUPPORT_RESPONSE}}</p>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 25px 0 0 0;">
            If you need further assistance, please don't hesitate to reach out to us again. We're always here to help!
          </p>
        </div>
        ${getMailForgeFooter()}
      </div>
    `
  }
};

export function processTemplate(template: string, variables: Record<string, string>): string {
  let processed = template;
  
  // Add default APP_URL if not provided
  const defaultVariables = {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    COMPANY_NAME: process.env.COMPANY_NAME || 'MailForge',
    FROM_EMAIL: process.env.FROM_EMAIL || 'contact@mailForge.com',
    ...variables
  };
  
  Object.entries(defaultVariables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return processed;
}

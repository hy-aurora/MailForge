import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { SMTPConfig, EmailMessage } from './email-management';

export class EmailService {
  private config: SMTPConfig;

  constructor(config: SMTPConfig) {
    this.config = config;
  }

  // Create SMTP transporter
  private createTransporter() {
    return nodemailer.createTransport({
      host: this.config.smtpHost,
      port: this.config.smtpPort,
      secure: this.config.smtpSecure,
      auth: {
        user: this.config.smtpUser,
        pass: this.config.smtpPassword,
      },
    });
  }

  // Send email via SMTP
  async sendEmail(to: string | string[], subject: string, html: string, options?: {
    from?: string;
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: any[];
  }) {
    try {
      const transporter = this.createTransporter();
      
      const mailOptions = {
        from: options?.from || `${this.config.name} <${this.config.email}>`,
        to: Array.isArray(to) ? to.join(', ') : to,
        cc: options?.cc?.join(', '),
        bcc: options?.bcc?.join(', '),
        subject,
        html,
        replyTo: options?.replyTo,
        attachments: options?.attachments,
      };

      const result = await transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
        response: result.response,
      };
    } catch (error) {
      console.error('SMTP send error:', error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Connect to IMAP and fetch emails
  async fetchEmails(options?: {
    folder?: string;
    limit?: number;
    since?: Date;
    unseen?: boolean;
  }): Promise<EmailMessage[]> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: this.config.imapUser,
        password: this.config.imapPassword,
        host: this.config.imapHost,
        port: this.config.imapPort,
        tls: this.config.imapSecure,
        tlsOptions: { rejectUnauthorized: false }
      });

      const emails: EmailMessage[] = [];

      imap.once('ready', () => {
        const folder = options?.folder || 'INBOX';
        
        imap.openBox(folder, false, (err, box) => {
          if (err) {
            reject(err);
            return;
          }

          // Build search criteria
          const searchCriteria: any[] = ['ALL'];
          if (options?.unseen) searchCriteria.push('UNSEEN');
          if (options?.since) searchCriteria.push(['SINCE', options.since]);

          imap.search(searchCriteria, (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            if (!results || results.length === 0) {
              imap.end();
              resolve([]);
              return;
            }

            // Limit results if specified
            const limitedResults = options?.limit ? results.slice(-options.limit) : results;

            const fetch = imap.fetch(limitedResults, {
              bodies: '',
              struct: true,
              envelope: true
            });

            fetch.on('message', (msg) => {
              const email: Partial<EmailMessage> = {};

              msg.on('body', (stream) => {
                let buffer = '';
                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });

                stream.once('end', () => {
                  simpleParser(buffer).then((parsed) => {
                    email.messageId = parsed.messageId || '';
                    email.from = parsed.from?.text || '';
                    email.to = parsed.to ? (Array.isArray(parsed.to) 
                      ? parsed.to.map((addr: any) => addr.text || addr.value || '').filter(Boolean)
                      : [(parsed.to as any)?.text || (parsed.to as any)?.value || '']) : [];
                    email.cc = parsed.cc ? (Array.isArray(parsed.cc)
                      ? parsed.cc.map((addr: any) => addr.text || addr.value || '').filter(Boolean)
                      : [(parsed.cc as any)?.text || (parsed.cc as any)?.value || '']) : [];
                    email.subject = parsed.subject || '';
                    email.body = parsed.text || '';
                    email.bodyHtml = parsed.html || '';
                    email.date = parsed.date || new Date();
                    email.attachments = parsed.attachments?.map(att => ({
                      filename: att.filename || 'unnamed',
                      contentType: att.contentType || 'application/octet-stream',
                      size: att.size || 0,
                      content: att.content
                    })) || [];
                  }).catch(console.error);
                });
              });

              msg.once('attributes', (attrs) => {
                email.id = attrs.uid.toString();
                email.isRead = !attrs.flags.includes('\\Seen');
                email.folder = folder;
                email.size = attrs.size || 0;
              });

              msg.once('end', () => {
                if (email.id) {
                  emails.push(email as EmailMessage);
                }
              });
            });

            fetch.once('error', (err) => {
              reject(err);
            });

            fetch.once('end', () => {
              imap.end();
              resolve(emails);
            });
          });
        });
      });

      imap.once('error', (err: any) => {
        reject(err);
      });

      imap.connect();
    });
  }

  // Mark email as read
  async markAsRead(messageId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: this.config.imapUser,
        password: this.config.imapPassword,
        host: this.config.imapHost,
        port: this.config.imapPort,
        tls: this.config.imapSecure,
        tlsOptions: { rejectUnauthorized: false }
      });

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err) => {
          if (err) {
            reject(err);
            return;
          }

          imap.addFlags([messageId], '\\Seen', (err) => {
            imap.end();
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      imap.once('error', reject);
      imap.connect();
    });
  }

  // Get folder list
  async getFolders(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: this.config.imapUser,
        password: this.config.imapPassword,
        host: this.config.imapHost,
        port: this.config.imapPort,
        tls: this.config.imapSecure,
        tlsOptions: { rejectUnauthorized: false }
      });

      imap.once('ready', () => {
        imap.getBoxes((err, boxes) => {
          imap.end();
          if (err) {
            reject(err);
          } else {
            const folderNames = Object.keys(boxes);
            resolve(folderNames);
          }
        });
      });

      imap.once('error', reject);
      imap.connect();
    });
  }
}

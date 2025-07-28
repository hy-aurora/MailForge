import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const to = formData.get("to") as string;
    const subject = formData.get("subject") as string;
    const clientName = formData.get("clientName") as string;
    const clientCompany = formData.get("clientCompany") as string;
    const quotationNumber = formData.get("quotationNumber") as string;
    const amount = formData.get("amount") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;
    const attachment = formData.get("attachment") as File;

    if (!to || !subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 }
      );
    }

    if (!attachment) {
      return NextResponse.json(
        { error: "No attachment provided" },
        { status: 400 }
      );
    }

    // Validate attachment size (10MB limit)
    if (attachment.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Attachment size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Convert attachment to base64
    const bytes = await attachment.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString("base64");

    // Determine content type
    const getContentType = (filename: string): string => {
      const ext = filename.toLowerCase().split('.').pop();
      switch (ext) {
        case 'pdf': return 'application/pdf';
        case 'doc': return 'application/msword';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
        case 'webp': return 'image/webp';
        default: return 'application/octet-stream';
      }
    };

    // Create professional email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation with Attachment</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; }
        .quotation-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: 600; color: #555; }
        .detail-value { color: #333; }
        .amount { font-size: 1.2em; font-weight: bold; color: #2563eb; }
        .attachment-notice { background: #e1f5fe; border: 1px solid #01579b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 0.9em; color: #666; border-radius: 0 0 8px 8px; }
        .signature { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        .unsubscribe { font-size: 0.8em; color: #999; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Quotation with Attachment</h1>
        <p>Professional Service Quotation</p>
    </div>
    
    <div class="content">
        <p>Dear ${clientName || "Valued Client"},</p>
        
        <p>Thank you for your interest in our services. Please find below the detailed quotation for your project${clientCompany ? ` at ${clientCompany}` : ''}, along with the attached document for your reference.</p>
        
        <div class="attachment-notice">
            <h4 style="margin: 0 0 10px 0; color: #01579b;">📎 Attachment Included</h4>
            <p style="margin: 0; color: #0277bd;">We've attached the original document (${attachment.name}) that contains additional details for your review.</p>
        </div>
        
        <div class="quotation-details">
            <h3 style="margin-top: 0; color: #2563eb;">Quotation Details</h3>
            
            ${quotationNumber ? `
            <div class="detail-row">
                <span class="detail-label">Quotation Number:</span>
                <span class="detail-value">${quotationNumber}</span>
            </div>
            ` : ''}
            
            ${clientCompany ? `
            <div class="detail-row">
                <span class="detail-label">Company:</span>
                <span class="detail-value">${clientCompany}</span>
            </div>
            ` : ''}
            
            ${amount ? `
            <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value amount">${amount}</span>
            </div>
            ` : ''}
            
            ${dueDate ? `
            <div class="detail-row">
                <span class="detail-label">Due Date:</span>
                <span class="detail-value">${new Date(dueDate).toLocaleDateString()}</span>
            </div>
            ` : ''}
        </div>
        
        ${description ? `
        <div style="margin: 20px 0;">
            <h4 style="color: #2563eb; margin-bottom: 10px;">Project Description:</h4>
            <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">${description}</p>
        </div>
        ` : ''}
        
        <p>This quotation is valid for 30 days from the date of issue. Please review the attached document for additional details and specifications.</p>
        
        <p>If you have any questions or would like to discuss this proposal further, please don't hesitate to contact us.</p>
        
        <p>We look forward to working with you and delivering exceptional results for your project.</p>
        
        <div class="signature">
            <p><strong>Best regards,</strong></p>
            <p><strong>${process.env.COMPANY_NAME || 'MailForge Team'}</strong></p>
            <p>Email: ${process.env.FROM_EMAIL || 'noreply@mailforge.com'}</p>
        </div>
    </div>
    
    <div class="footer">
        <p>This is a professional quotation email with attachment sent via MailForge Email Service</p>
        <div class="unsubscribe">
            <p>If you believe you received this email in error, please contact us.</p>
        </div>
    </div>
</body>
</html>`;

    // Prepare email data with attachment
    const emailData: any = {
      from: process.env.FROM_EMAIL || 'noreply@mailforge.com',
      to: [to],
      subject: subject,
      html: emailHtml,
      attachments: [
        {
          filename: attachment.name,
          content: base64Content,
          contentType: getContentType(attachment.name),
          disposition: 'attachment',
        },
      ],
      headers: {
        'X-Priority': '3',
        'X-Mailer': 'MailForge Professional Email Service',
        'List-Unsubscribe': '<mailto:unsubscribe@mailforge.com>',
        'Authentication-Results': 'spf=pass smtp.mailfrom=mailforge.com',
        'X-Entity-ID': `quotation-attachment-${Date.now()}`,
      },
    };

    // Add BCC if configured
    if (process.env.BCC_EMAIL) {
      emailData.bcc = [process.env.BCC_EMAIL];
    }

    const data = await resend.emails.send(emailData);

    return NextResponse.json({ 
      success: true, 
      messageId: data.data?.id,
      message: "Email with attachment sent successfully",
      attachmentName: attachment.name,
      attachmentSize: `${(attachment.size / 1024 / 1024).toFixed(2)} MB`
    });
  } catch (error) {
    console.error("Error sending email with attachment:", error);
    return NextResponse.json(
      { error: "Failed to send email with attachment" },
      { status: 500 }
    );
  }
}

export const vendorRejectionEmailTemplate = (
  vendorName: string,
  companyName: string,
  reason: string,
  applicationDate?: string,
  contactEmail?: string,
) => {
  return `
    <!DOCTYPE html>
    <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #FFF8E1;
            border-radius: 8px 8px 0 0;
        }
        .logo {
            font-size: 24px;
            color: #DAA520;
            font-weight: bold;
        }
        .content {
            padding: 30px 20px;
        }
        .rejection-notice {
            background-color: #FFF3CD;
            border-left: 4px solid #DAA520;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .rejection-status {
            font-size: 18px;
            font-weight: bold;
            color: #B8860B;
            text-align: center;
            margin-bottom: 15px;
        }
        .reason-box {
            background-color: #FFF8E1;
            border: 1px solid rgba(218, 165, 32, 0.3);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .reason-title {
            font-weight: bold;
            color: #B8860B;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .reason-text {
            color: #666666;
            line-height: 1.5;
        }
        .message {
            margin: 20px 0;
            color: #666666;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #999999;
            border-top: 1px solid #F0E6C0;
        }
        .note {
            font-size: 13px;
            color: #666666;
            font-style: italic;
            background-color: #F8F9FA;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .info-section {
            background-color: #F8F9FA;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 3px solid #DAA520;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
        }
        .info-label {
            font-weight: bold;
            color: #B8860B;
        }
        .info-value {
            color: #666666;
        }
        h2 {
            color: #B8860B;
            text-align: center;
        }
        .contact-info {
            text-align: center;
            margin: 25px 0;
            padding: 15px;
            background-color: #FFF8E1;
            border-radius: 8px;
        }
        .contact-info p {
            margin: 5px 0;
            font-size: 14px;
        }
        .contact-email {
            color: #DAA520;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Planzo</div>
        </div>
        <div class="content">
            <h2>Vendor Application Status</h2>
            
            <p class="message">Dear ${vendorName},</p>
            <p class="message">Thank you for your interest in becoming a vendor partner with Planzo. We appreciate the time and effort you invested in your application.</p>
            
            <div class="rejection-notice">
                <div class="rejection-status">APPLICATION STATUS: REJECTED</div>
            </div>
            
            ${
              applicationDate
                ? `
            <div class="info-section">
                <div class="info-row">
                    <span class="info-label">Application Date:</span>
                    <span class="info-value">${applicationDate}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Company Name:</span>
                    <span class="info-value">${companyName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Review Date:</span>
                    <span class="info-value">${new Date().toLocaleDateString()}</span>
                </div>
            </div>
            `
                : ""
            }
            
            <div class="reason-box">
                <div class="reason-title">Reason for Rejection:</div>
                <div class="reason-text">${reason}</div>
            </div>
            
            <p class="message">While we cannot move forward with your application at this time, we encourage you to address the mentioned concerns and consider reapplying in the future.</p>
            
            <div class="note">
                <strong>Next Steps:</strong> If you believe this decision was made in error or if you have questions about the rejection, please don't hesitate to contact our vendor relations team. We're here to help you understand our requirements better.
            </div>
            
            ${
              contactEmail
                ? `
            <div class="contact-info">
                <p><strong>Questions or Concerns?</strong></p>
                <p>Contact our Vendor Relations Team:</p>
                <p class="contact-email">${contactEmail}</p>
            </div>
            `
                : ""
            }
            
            <p class="message">We wish you success in your business endeavors and thank you again for your interest in partnering with Planzo.</p>
            
            <p class="message">Best regards,<br>
            <strong>Planzo Vendor Relations Team</strong></p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Planzo. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
            <p>For vendor inquiries, please contact our vendor relations team.</p>
        </div>
    </div>
</body>
</html>
    `
}
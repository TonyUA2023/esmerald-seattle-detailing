import { NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const COMPANY_EMAIL = 'jstackinfo@gmail.com';

interface QuotePayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  contactCall?: string | boolean;
  contactEmail?: string | boolean;
  contactSms?: string | boolean;
  vehicleDetails: string;
}

export async function POST(request: Request) {
  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY environment variable is not defined.');
    return NextResponse.json(
      { error: 'Server configuration error: BREVO_API_KEY is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body: QuotePayload = await request.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      contactCall,
      contactEmail,
      contactSms,
      vehicleDetails,
    } = body;

    // Determine contact preferences
    const preferences: string[] = [];
    if (contactCall) preferences.push('Call');
    if (contactEmail) preferences.push('Email');
    if (contactSms) preferences.push('SMS/Text');
    const contactPrefText = preferences.length > 0 ? preferences.join(', ') : 'No preference specified';

    // 1. Email for the Company
    const companyHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Quote Request Received</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f1f5f9;
            color: #334155;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #cbd5e1;
          }
          .header {
            background-color: #10b981;
            padding: 20px;
            color: #ffffff;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
          }
          .content {
            padding: 25px;
          }
          .section-title {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 5px;
            margin-top: 20px;
            margin-bottom: 12px;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
          }
          .info-table td {
            padding: 8px 0;
            vertical-align: top;
            font-size: 14px;
          }
          .label {
            font-weight: 600;
            color: #64748b;
            width: 155px;
          }
          .value {
            color: #0f172a;
          }
          .action-box {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            padding: 15px;
            margin-top: 25px;
            text-align: center;
          }
          .action-btn {
            display: inline-block;
            background-color: #10b981;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 NEW QUOTE REQUEST (60s Form)</h1>
          </div>
          <div class="content">
            <p style="margin-top: 0; font-size: 15px; line-height: 1.5;">
              A potential client has requested a custom mobile detailing quote via the 60-second form.
            </p>
            
            <div class="section-title">Client Information</div>
            <table class="info-table">
              <tr>
                <td class="label">Name:</td>
                <td class="value">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td class="label">Email:</td>
                <td class="value"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td class="label">Phone:</td>
                <td class="value"><a href="tel:${phone}" style="font-weight: bold; color: #10b981;">${phone}</a></td>
              </tr>
              <tr>
                <td class="label">Contact Preference:</td>
                <td class="value"><strong>${contactPrefText}</strong></td>
              </tr>
            </table>

            <div class="section-title">Vehicle & Service Request Details</div>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; font-size: 14px; line-height: 1.6; color: #1e293b; font-style: italic; white-space: pre-wrap;">${vehicleDetails}</div>

            <div class="action-box">
              <strong>Reply to this lead immediately:</strong><br>
              <a href="tel:${phone}" class="action-btn">Call / Text Client</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. Email for the Customer
    const customerHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Request Received</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f7f6;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
          }
          .header {
            background-color: #059669;
            background-image: linear-gradient(135deg, #059669 0%, #10b981 100%);
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .content {
            padding: 30px 25px;
          }
          .welcome-text {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
          }
          .summary-card {
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #edf2f7;
            padding: 20px;
            margin-bottom: 25px;
          }
          .summary-card h3 {
            margin-top: 0;
            margin-bottom: 12px;
            color: #065f46;
            font-size: 15px;
            border-bottom: 2px solid #e6f4ea;
            padding-bottom: 6px;
          }
          .detail-row {
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.4;
          }
          .detail-label {
            color: #64748b;
            font-weight: 600;
            display: inline-block;
            width: 150px;
          }
          .detail-value {
            color: #1e293b;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #edf2f7;
          }
          .footer a {
            color: #059669;
            text-decoration: none;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Esmerald Apex Mobile Detailing</h1>
          </div>
          <div class="content">
            <p class="welcome-text">
              Hi <strong>${firstName}</strong>,<br><br>
              We have successfully received your custom detailing quote request. 
              Our team will review the details about your vehicle and get back to you shortly via your preferred contact method: <strong>${contactPrefText}</strong>.
            </p>
            
            <div class="summary-card">
              <h3>Quote Request Summary</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${firstName} ${lastName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${phone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${email}</span>
              </div>
            </div>
            
            <p class="welcome-text" style="font-size: 14px; color: #64748b; margin-top: 20px;">
              If you have any additional photos or details to share, feel free to reply directly to this email. We look forward to talking with you!
            </p>
          </div>
          <div class="footer">
            &copy; 2026 Esmerald Apex Mobile Detailing. All rights reserved.<br>
            Seattle, WA &bull; <a href="mailto:${COMPANY_EMAIL}">${COMPANY_EMAIL}</a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send requests to Brevo API
    const responses = await Promise.all([
      // Send to Customer
      fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'Esmerald Apex Mobile Detailing',
            email: COMPANY_EMAIL,
          },
          to: [
            {
              email: email,
              name: `${firstName} ${lastName}`,
            },
          ],
          subject: 'We Received Your Quote Request! - Esmerald Apex Mobile Detailing',
          htmlContent: customerHtmlContent,
        }),
      }),
      // Send to Company
      fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'Esmerald Apex Quote Form',
            email: COMPANY_EMAIL,
          },
          to: [
            {
              email: COMPANY_EMAIL,
              name: 'Esmerald Apex Detailing',
            },
          ],
          subject: `📋 NEW QUOTE REQUEST: ${firstName} ${lastName}`,
          htmlContent: companyHtmlContent,
        }),
      })
    ]);

    // Check if any request failed
    const failedResponse = responses.find(res => !res.ok);
    if (failedResponse) {
      const errorText = await failedResponse.text();
      console.error('Brevo API Quote Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to send quote emails via Brevo API', details: errorText },
        { status: failedResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Quote route handler error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

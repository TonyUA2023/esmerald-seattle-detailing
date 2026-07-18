import { NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const COMPANY_EMAIL = 'jstackinfo@gmail.com';

interface Addon {
  name: string;
  price: number;
}

interface BookingPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  packageName: string;
  vehicleSize: string;
  addons: Addon[];
  date: string;
  timeSlot: string;
  hasWaterAccess: string;
  hasPowerAccess: string;
  total: string;
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
    const body: BookingPayload = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      notes = 'None provided',
      packageName,
      vehicleSize,
      addons = [],
      date,
      timeSlot,
      hasWaterAccess,
      hasPowerAccess,
      total,
    } = body;

    const addonsText = addons.length > 0 
      ? addons.map(a => `${a.name} (+$${a.price})`).join(', ') 
      : 'None';

    const addonsHtml = addons.length > 0
      ? addons.map(a => `<li>${a.name} (+$${a.price})</li>`).join('')
      : '<li>None</li>';

    // 1. Email for the Customer
    const customerHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Request Received</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
            letter-spacing: -0.5px;
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
            margin-bottom: 15px;
            color: #065f46;
            font-size: 16px;
            border-bottom: 2px solid #e6f4ea;
            padding-bottom: 8px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
            line-height: 1.4;
          }
          .detail-label {
            color: #64748b;
            font-weight: 600;
            flex-shrink: 0;
            width: 140px;
          }
          .detail-value {
            color: #1e293b;
            text-align: right;
            flex-grow: 1;
            font-weight: 500;
          }
          .addons-list {
            margin: 0;
            padding-left: 20px;
            text-align: right;
            list-style-type: none;
          }
          .divider {
            border-top: 1px dashed #e2e8f0;
            margin: 15px 0;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
          }
          .guarantee-box {
            background-color: #ecfdf5;
            border: 1px solid #d1fae5;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 25px;
            display: flex;
            align-items: flex-start;
          }
          .guarantee-icon {
            font-size: 20px;
            margin-right: 12px;
            line-height: 1;
          }
          .guarantee-text {
            font-size: 13px;
            line-height: 1.5;
            color: #065f46;
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
              Thank you for booking with us! We have received your appointment request. 
              <strong>Fernando</strong> will review the details and send you a confirmation text to finalize your arrival time shortly.
            </p>
            
            <div class="summary-card">
              <h3>Appointment Summary</h3>
              
              <div class="detail-row">
                <span class="detail-label">Service Package:</span>
                <span class="detail-value">${packageName} (${vehicleSize})</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Add-ons:</span>
                <div class="detail-value">
                  <ul class="addons-list">
                    ${addonsHtml}
                  </ul>
                </div>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">${date} @ ${timeSlot}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Location Address:</span>
                <span class="detail-value">${address}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Utility Access:</span>
                <span class="detail-value">Water: ${hasWaterAccess} | Power: ${hasPowerAccess}</span>
              </div>
              
              <div class="divider"></div>
              
              <div class="total-row">
                <span>Estimated Total:</span>
                <span>$${total}</span>
              </div>
            </div>
            
            <div class="guarantee-box">
              <span class="guarantee-icon">🛡️</span>
              <div class="guarantee-text">
                <strong>100% Free Booking Guarantee</strong><br>
                No deposit or credit card is required today. You pay only after the detailing service is complete and you are fully satisfied with our work.
              </div>
            </div>
            
            <p class="welcome-text" style="font-size: 14px; color: #64748b;">
              Need to make changes or have questions? Simply reply to this email or call/text us directly. We look forward to restoring your vehicle's shine!
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

    // 2. Email for the Company
    const companyHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request</title>
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
            background-color: #1e293b;
            padding: 20px;
            color: #f8fafc;
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
            width: 130px;
          }
          .value {
            color: #0f172a;
          }
          .highlight {
            background-color: #fef08a;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
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
            background-color: #2563eb;
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
            <h1>🚨 NEW BOOKING REQUEST</h1>
          </div>
          <div class="content">
            <p style="margin-top: 0; font-size: 15px; line-height: 1.5;">
              A new mobile detailing booking request has been received from the website. Please contact the client immediately to confirm and block off the calendar.
            </p>
            
            <div class="section-title">Customer Contact Details</div>
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
                <td class="value"><a href="tel:${phone}" style="font-weight: bold; color: #2563eb;">${phone}</a></td>
              </tr>
              <tr>
                <td class="label">Address:</td>
                <td class="value"><a href="https://maps.google.com/?q=${encodeURIComponent(address)}" target="_blank" style="color: #2563eb;">${address}</a></td>
              </tr>
            </table>

            <div class="section-title">Detailing Details</div>
            <table class="info-table">
              <tr>
                <td class="label">Package:</td>
                <td class="value"><strong>${packageName}</strong></td>
              </tr>
              <tr>
                <td class="label">Vehicle Size:</td>
                <td class="value" style="text-transform: capitalize;">${vehicleSize}</td>
              </tr>
              <tr>
                <td class="label">Add-ons:</td>
                <td class="value">${addonsText}</td>
              </tr>
              <tr>
                <td class="label">Date & Time:</td>
                <td class="value class="highlight">${date} @ ${timeSlot}</td>
              </tr>
              <tr>
                <td class="label">Utility Setup:</td>
                <td class="value">Water: ${hasWaterAccess} | Power: ${hasPowerAccess}</td>
              </tr>
              <tr>
                <td class="label">Special Notes:</td>
                <td class="value"><em>${notes}</em></td>
              </tr>
              <tr>
                <td class="label">Estimated Price:</td>
                <td class="value" style="font-size: 16px; font-weight: bold; color: #16a34a;">$${total}</td>
              </tr>
            </table>

            <div class="action-box">
              <strong>Need to contact client?</strong><br>
              Click below to send a message or dial directly.
              <br>
              <a href="tel:${phone}" class="action-btn">Call Client Now</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // 3. Make requests to Brevo API
    // We send separate API requests so that the customer and company receive dedicated customized emails.
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
          subject: 'We Received Your Booking Request! - Esmerald Apex Mobile Detailing',
          htmlContent: customerHtmlContent,
        }),
      }),
      // Send to Company (jstackinfo@gmail.com)
      fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: {
            name: 'Esmerald Apex Web Booking',
            email: COMPANY_EMAIL,
          },
          to: [
            {
              email: COMPANY_EMAIL,
              name: 'Esmerald Apex Detailing',
            },
          ],
          subject: `🚨 NEW BOOKING: ${firstName} ${lastName} - ${packageName}`,
          htmlContent: companyHtmlContent,
        }),
      })
    ]);

    // Check if any request failed
    const failedResponse = responses.find(res => !res.ok);
    if (failedResponse) {
      const errorText = await failedResponse.text();
      console.error('Brevo API Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to send one or more emails via Brevo API', details: errorText },
        { status: failedResponse.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Booking route handler error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

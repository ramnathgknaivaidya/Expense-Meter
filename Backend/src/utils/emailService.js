import nodemailer from 'nodemailer';

// Lazy singleton transporter - created ONLY when needed (after .env is loaded)
let transporterInstance = null;

const getTransporter = () => {
  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('📧 Transporter initialized with host:', process.env.EMAIL_HOST);
  }
  return transporterInstance;
};

/**
 * Generate beautiful HTML email template for expense notification
 */
const generateExpenseEmailHTML = (userName, expense) => {
  const formattedDate = new Date(expense.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const amount = expense.amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Expense Alert</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        .header h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: 1px;
        }
        .header p {
          margin: 5px 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content {
          padding: 30px 25px;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .greeting strong {
          color: #4CAF50;
        }
        .expense-detail {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 15px 0;
          border-left: 4px solid #4CAF50;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        .amount {
          font-size: 28px;
          font-weight: bold;
          color: #4CAF50;
        }
        .footer {
          text-align: center;
          padding: 20px 25px;
          background: #f9f9f9;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #888;
        }
        .footer a {
          color: #4CAF50;
          text-decoration: none;
        }
        @media (max-width: 480px) {
          .content { padding: 20px 15px; }
          .detail-row { flex-direction: column; gap: 4px; }
          .amount { font-size: 22px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Expense Alert</h2>
          <p>New expense recorded in your account</p>
        </div>
        <div class="content">
          <div class="greeting">
            Hello <strong>${userName}</strong>,
          </div>
          <p>A new expense has been recorded in your <strong>Expense Meter</strong> account.</p>

          <div class="expense-detail">
            <div class="detail-row">
              <span class="detail-label">Amount</span>
              <span class="amount">${amount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Category</span>
              <span>${expense.category}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Merchant</span>
              <span>${expense.merchant || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method</span>
              <span>${expense.paymentMethod}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span>${formattedDate}</span>
            </div>
            ${expense.description ? `
            <div class="detail-row">
              <span class="detail-label">Description</span>
              <span>${expense.description}</span>
            </div>` : ''}
          </div>

          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Stay on top of your finances with <strong>Expense Meter</strong>! 📊
          </p>
        </div>
        <div class="footer">
          <p>
            You are receiving this email because you have an account with Expense Meter.
          </p>
          <p>
            © ${new Date().getFullYear()} Expense Meter. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send expense notification email to the user
 */
export const sendExpenseEmail = async (userEmail, userName, expense) => {
  try {
    // Skip if no email provided
    if (!userEmail) {
      console.warn('No email provided, skipping notification');
      return null;
    }

    const transporter = getTransporter(); // Created HERE (after .env is loaded)

    const htmlContent = generateExpenseEmailHTML(userName, expense);

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Expense Alert: ${expense.amount} spent on ${expense.category}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Expense email sent to ${userEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Failed to send expense email:', error.message);
    // Don't throw - email failure should not break the expense creation flow
    return null;
  }
};

/**
 * Test email configuration (useful for debugging)
 */// KEEP THIS (it's useful for debugging, but not exposed as an API)


export const testEmailConfig = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('Email transporter is configured correctly');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error.message);
    return false;
  }
};
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: Number(process.env.BREVO_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendInvoiceEmail = async ({ to, ownerName, invoice }) => {
  const invoiceLink = `${process.env.FRONTEND_URL}/invoice/${invoice.public_token}`;

  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_EMAIL}>`,
    to,
    subject: `Invoice ${invoice.invoice_number} from Zymgoo CRM`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Invoice ${invoice.invoice_number}</h2>

        <p>Hello ${ownerName || "Customer"},</p>

        <p>Your gym subscription invoice has been generated.</p>

        <table style="width:100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Invoice Number</td>
            <td style="padding:10px; border:1px solid #ddd;">${invoice.invoice_number}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Issue Date</td>
            <td style="padding:10px; border:1px solid #ddd;">${invoice.issue_date}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Due Date</td>
            <td style="padding:10px; border:1px solid #ddd;">${invoice.due_date || "Not specified"}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Total Amount</td>
            <td style="padding:10px; border:1px solid #ddd;">₹${invoice.total}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;">Balance Due</td>
            <td style="padding:10px; border:1px solid #ddd;">₹${invoice.balance_due}</td>
          </tr>
        </table>

        <a 
          href="${invoiceLink}"
          style="
            display:inline-block;
            background:#ff6b00;
            color:#ffffff;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          "
        >
          View Invoice
        </a>

        <p style="margin-top:25px;">Thank you,<br/>Zymgoo CRM Team</p>
      </div>
    `,
  };

  if (invoice.pdf_url) {
    mailOptions.attachments = [
      {
        filename: `${invoice.invoice_number}.pdf`,
        path: invoice.pdf_url,
      },
    ];
  }

  return transporter.sendMail(mailOptions);
};

module.exports = sendInvoiceEmail;
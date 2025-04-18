const nodemailer = require("nodemailer")

const sendContactEmail = async (req, res) => {
  const { name, email, phone, message } = req.body

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  const mailOptions = {
    from: email,
    to: process.env.SMTP_EMAIL,
    subject: `New message from ${name}`,
    html: `
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ success: true, message: "Email sent" })
  } catch (error) {
    console.error("Email error:", error)
    res
      .status(500)
      .json({ success: false, message: "Email failed to send" })
  }
}

module.exports = { sendContactEmail }

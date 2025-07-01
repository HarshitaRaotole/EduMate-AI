const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendAssignmentReminder = async (email, assignmentTitle, deadline, subject) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: `Assignment Reminder: ${assignmentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3B82F6;">Assignment Reminder</h2>
        <p>Hi there!</p>
        <p>This is a friendly reminder about your upcoming assignment:</p>
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #1F2937;">${assignmentTitle}</h3>
          <p style="margin: 5px 0; color: #6B7280;">Subject: ${subject}</p>
          <p style="margin: 5px 0; color: #EF4444; font-weight: bold;">Due: ${deadline}</p>
        </div>
        <p>Don't forget to submit your assignment on time!</p>
        <p>Best regards,<br>EduMateAI Team</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Reminder email sent successfully")
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

module.exports = { sendAssignmentReminder }

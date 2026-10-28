import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  const { name, email, date, time, message } = req.body || {};

  if (!name || !email || !date || !time) {
    return res.status(400).json({
      message: "Please fill in all required fields.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Booking" <${process.env.MAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `New consultation request from ${name}`,
      text: `
New consultation request

Name: ${name}
Email: ${email}
Requested date: ${date}
Requested time: ${time}

Message: ${message || "No message provided"}
      `,
    });

    return res.status(200).json({
      message: "Consultation request submitted successfully.",
    });
  } catch (error) {
    console.error("Email sending failed:", error);

    return res.status(500).json({
      message: "Unable to submit your request. Please try again.",
    });
  }
}
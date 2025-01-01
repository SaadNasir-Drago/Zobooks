import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { to, subject, text } = await req.json();

  // Configure Nodemailer with SMTP settings
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use "gmail" or another provider
    // auth: {
    //   user: 'snasir2223@gmail.com', // Your email address
    //   // pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    // },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}

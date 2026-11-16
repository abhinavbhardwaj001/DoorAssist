import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: env.brevoSmtpUser,
    pass: env.brevoSmtpKey,
  },
});

const sender = {
  name: "DoorAssist Support",
  address: env.brevoSenderEmail,
};

// Email verification OTP
export const sendVerificationOtp = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"${sender.name}" <${sender.address}>`,
      to: email,
      subject: "Verify your DoorAssist email",
      text: `Your DoorAssist email verification OTP is ${otp}. It expires in 5 minutes. If you did not create an account, ignore this email.`,
      html: `
        <h2>Verify your DoorAssist account</h2>
        <p>Your email verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not create a DoorAssist account, you can ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error("Brevo verification email error:", error.message);

    throw new Error("Failed to send verification email");
  }
};

// Password reset OTP
export const sendPasswordResetOtp = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"${sender.name}" <${sender.address}>`,
      to: email,
      subject: "Reset your DoorAssist password",
      text: `Your DoorAssist password reset OTP is ${otp}. It expires in 5 minutes. If you did not request a password reset, ignore this email.`,
      html: `
        <h2>Reset your DoorAssist password</h2>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request a password reset, you can ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error("Brevo password reset email error:", error.message);

    throw new Error("Failed to send password reset email");
  }
};

// Welcome email
export const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: `"${sender.name}" <${sender.address}>`,
    to: email,
    subject: "Welcome to DoorAssist! 🎉",
    text: `Hi ${name}, your email has been successfully verified. Welcome to DoorAssist! You can now log in and explore local services.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px;">
        <h2 style="color: #2563eb;">Welcome to DoorAssist! 🎉</h2>

        <p>Hi ${name},</p>

        <p>Your email address has been successfully verified.</p>

        <p>
          Your DoorAssist account is now ready! You can log in,
          discover local services, and book trusted service providers.
        </p>

        <p>Thank you for joining DoorAssist.</p>

        <p style="margin-top: 30px;">
          Best regards,<br />
          <strong>Team DoorAssist</strong>
        </p>
      </div>
    `,
  });
};

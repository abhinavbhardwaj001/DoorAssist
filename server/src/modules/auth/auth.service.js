import bcrypt from "bcrypt";
import User from "../users/user.model.js";
import Session from "./session.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../utils/token.js";
import { generateOtp, hashOtp } from "../../utils/otp.js";
import {
  sendVerificationOtp,
  sendPasswordResetOtp,
  sendWelcomeEmail,
} from "../../utils/email.js";
import { AUTH_CONSTANTS, OTP_CONSTANTS } from "./auth.constants.js";

// Register user
export const registerUser = async (userData) => {
  const { name, email, phone, password } = userData;

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check whether the email already exists
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(
    password,
    AUTH_CONSTANTS.SALT_ROUNDS,
  );

  // 3. Generate and hash the verification OTP
  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const otpExpiresAt = new Date(Date.now() + OTP_CONSTANTS.EXPIRES_IN);

  // 4. Create an unverified user
  let user;

  try {
    user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
      role: "customer",
      isEmailVerified: false,
      emailVerificationOtpHash: otpHash,
      emailVerificationOtpExpiresAt: otpExpiresAt,
      emailVerificationOtpAttempts: 0,
    });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error(
        "Email or phone number is already registered",
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }

  // 5. Send the verification email
  try {
    await sendVerificationOtp(user.email, otp);
  } catch (error) {
    // Do not leave a usable OTP after a failed email attempt
    user.emailVerificationOtpHash = null;
    user.emailVerificationOtpExpiresAt = null;
    user.emailVerificationOtpAttempts = 0;
    await user.save();

    const emailError = new Error(
      "Unable to send verification email. Please try again.",
    );
    emailError.statusCode = 502;
    throw emailError;
  }

  // 6. Return safe information only
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    message: "Registration successful. Please verify your email.",
  };
};

// Verify email otp
export const verifyEmailOtp = async ({ email, otp }) => {
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    const error = new Error("Invalid email or OTP");
    error.statusCode = 400;
    throw error;
  }

  if (user.isEmailVerified) {
    return { message: "Email is already verified" };
  }

  if (!user.emailVerificationOtpHash || !user.emailVerificationOtpExpiresAt) {
    const error = new Error(
      "No active verification OTP. Please request a new one.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (user.emailVerificationOtpExpiresAt.getTime() <= Date.now()) {
    const error = new Error("OTP has expired. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  if (user.emailVerificationOtpAttempts >= OTP_CONSTANTS.MAX_ATTEMPTS) {
    const error = new Error(
      "Maximum OTP attempts reached. Please request a new one.",
    );
    error.statusCode = 429;
    throw error;
  }

  user.emailVerificationOtpAttempts += 1;

  if (hashOtp(otp) !== user.emailVerificationOtpHash) {
    await user.save();

    const error = new Error("Invalid email or OTP");
    error.statusCode = 400;
    throw error;
  }

  user.isEmailVerified = true;
  user.emailVerificationOtpHash = null;
  user.emailVerificationOtpExpiresAt = null;
  user.emailVerificationOtpAttempts = 0;

  await user.save();
  try {
    await sendWelcomeEmail(user.email, user.name);
  } catch (error) {
    console.error("Welcome email failed:", error.message);
  }
  return {
    message: "Email verified successfully",
  };
};

// Resend verification otp
export const resendVerificationOtp = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error("Unable to process verification request");
    error.statusCode = 400;
    throw error;
  }

  if (user.isEmailVerified) {
    const error = new Error("Email is already verified");
    error.statusCode = 400;
    throw error;
  }

  // Enforce a 60-second cooldown after the previous OTP was issued
  if (user.emailVerificationOtpExpiresAt) {
    const issuedAt =
      user.emailVerificationOtpExpiresAt.getTime() - OTP_CONSTANTS.EXPIRES_IN;

    const remainingTime = issuedAt + OTP_CONSTANTS.RESEND_COOLDOWN - Date.now();

    if (remainingTime > 0) {
      const error = new Error(
        `Please wait ${Math.ceil(remainingTime / 1000)} seconds before requesting another OTP`,
      );
      error.statusCode = 429;
      throw error;
    }
  }

  const otp = generateOtp();

  user.emailVerificationOtpHash = hashOtp(otp);
  user.emailVerificationOtpExpiresAt = new Date(
    Date.now() + OTP_CONSTANTS.EXPIRES_IN,
  );
  user.emailVerificationOtpAttempts = 0;

  await user.save();

  try {
    await sendVerificationOtp(user.email, otp);
  } catch {
    // Invalidate the newly issued OTP if email delivery fails
    user.emailVerificationOtpHash = null;
    user.emailVerificationOtpExpiresAt = null;
    user.emailVerificationOtpAttempts = 0;
    await user.save();

    const error = new Error(
      "Unable to send verification email. Please try again later.",
    );
    error.statusCode = 502;
    throw error;
  }

  return {
    message: "A new verification OTP has been sent to your email",
  };
};

// Forgot password
export const forgotPassword = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const genericMessage =
    "If an account exists with this email, password reset instructions will be sent.";

  const user = await User.findOne({ email: normalizedEmail });

  // Use the same response whether or not the account exists.
  if (!user) {
    return { message: genericMessage };
  }

  const otp = generateOtp();

  user.passwordResetOtpHash = hashOtp(otp);
  user.passwordResetOtpExpiresAt = new Date(
    Date.now() + OTP_CONSTANTS.EXPIRES_IN,
  );
  user.passwordResetOtpAttempts = 0;

  await user.save();

  try {
    await sendPasswordResetOtp(user.email, otp);
  } catch {
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpiresAt = null;
    user.passwordResetOtpAttempts = 0;
    await user.save();

    const error = new Error(
      "Unable to send password reset email. Please try again later.",
    );
    error.statusCode = 502;
    throw error;
  }

  return { message: genericMessage };
};

// Reset password
export const resetPassword = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    const error = new Error("Invalid email or OTP");
    error.statusCode = 400;
    throw error;
  }

  if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
    const error = new Error(
      "No active password reset OTP. Please request another one.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (user.passwordResetOtpExpiresAt.getTime() <= Date.now()) {
    const error = new Error("OTP has expired. Please request another one.");
    error.statusCode = 400;
    throw error;
  }

  if (user.passwordResetOtpAttempts >= OTP_CONSTANTS.MAX_ATTEMPTS) {
    const error = new Error(
      "Maximum OTP attempts reached. Please request another one.",
    );
    error.statusCode = 429;
    throw error;
  }

  user.passwordResetOtpAttempts += 1;

  if (hashOtp(otp) !== user.passwordResetOtpHash) {
    await user.save();

    const error = new Error("Invalid email or OTP");
    error.statusCode = 400;
    throw error;
  }

  // Hash the new password
  user.password = await bcrypt.hash(newPassword, AUTH_CONSTANTS.SALT_ROUNDS);

  // Clear the OTP so it cannot be reused
  user.passwordResetOtpHash = null;
  user.passwordResetOtpExpiresAt = null;
  user.passwordResetOtpAttempts = 0;

  await user.save();

  // Revoke every existing session for this user
  await Session.updateMany(
    {
      userId: user._id,
      revokedAt: null,
    },
    {
      $set: { revokedAt: new Date() },
    },
  );

  return {
    message: "Password reset successful. Please log in again.",
  };
};

// Login user
export const loginUser = async ({ email, password, userAgent, ip }) => {
  // 1. Find the user and explicitly include the password hash
  const user = await User.findOne({ email }).select("+password");

  // 2. Verify credentials without revealing whether the email exists
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isEmailVerified) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 403;
    throw error;
  }

  // 3. Reject inactive accounts before creating a session
  if (user.status !== "active") {
    const error = new Error(
      "Your account is not active. Please contact the administrator.",
    );
    error.statusCode = 403;
    throw error;
  }

  // 4. Generate access and refresh tokens
  const userId = user._id.toString();

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  // 5. Hash the refresh token before storing it
  const refreshTokenHash = hashToken(refreshToken);

  // 6. Calculate session expiry
  const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_MAX_AGE);

  // 7. Save the session
  await Session.create({
    userId: user._id,
    refreshTokenHash,
    userAgent,
    ip,
    expiresAt,
  });

  // 8. Return tokens and safe user information
  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    },
  };
};

// Refresh access and refresh tokens
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 401;
    throw error;
  }

  // 1. Verify the refresh token
  const decodedToken = verifyRefreshToken(refreshToken);

  const userId = decodedToken.userId;

  if (typeof userId !== "string" || !/^[0-9a-fA-F]{24}$/.test(userId)) {
    const error = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  // 2. Find the user and verify account status
  const user = await User.findById(userId);

  if (!user || user.status !== "active" || !user.isEmailVerified) {
    const error = new Error("Invalid or inactive account");
    error.statusCode = 401;
    throw error;
  }

  // 3. Find the matching active session
  const oldTokenHash = hashToken(refreshToken);
  const now = new Date();

  const session = await Session.findOne({
    userId: user._id,
    refreshTokenHash: oldTokenHash,
    revokedAt: null,
    expiresAt: { $gt: now },
  }).select("+refreshTokenHash");

  if (!session) {
    const error = new Error("Invalid or expired session");
    error.statusCode = 401;
    throw error;
  }

  // 4. Generate the replacement tokens
  const newAccessToken = generateAccessToken(user._id.toString());
  const newRefreshToken = generateRefreshToken(user._id.toString());
  const newTokenHash = hashToken(newRefreshToken);

  const newExpiresAt = new Date(
    Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_MAX_AGE,
  );

  // 5. Atomically replace the old token hash.
  // Only one concurrent request can successfully rotate this token.
  const updatedSession = await Session.findOneAndUpdate(
    {
      _id: session._id,
      refreshTokenHash: oldTokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        refreshTokenHash: newTokenHash,
        expiresAt: newExpiresAt,
      },
    },
    { returnDocument: "after" },
  );

  if (!updatedSession) {
    const error = new Error("Refresh token has already been used");
    error.statusCode = 401;
    throw error;
  }

  // 6. Return both replacement tokens
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Logout user
export const logoutUser = async (refreshToken) => {
  // If there is no refresh token, there is no session to revoke
  if (!refreshToken) {
    return;
  }

  // Hash the refresh token
  const refreshTokenHash = hashToken(refreshToken);

  // Revoke the matching session
  await Session.findOneAndUpdate(
    {
      refreshTokenHash,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: { revokedAt: new Date() },
    },
  );
};

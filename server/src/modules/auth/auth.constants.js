export const AUTH_CONSTANTS = Object.freeze({
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",

  REFRESH_TOKEN_COOKIE_NAME: "refreshToken",
  REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  SALT_ROUNDS: 12,
});

export const OTP_CONSTANTS = {
  LENGTH: 6,
  EXPIRES_IN: 5 * 60 * 1000, // 5 minutes
  MAX_ATTEMPTS: 5,
  RESEND_COOLDOWN: 60 * 1000, // 60 seconds
};

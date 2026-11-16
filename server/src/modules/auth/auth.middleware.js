import jwt from "jsonwebtoken";
import env from "../../config/env.js";
import User from "../users/user.model.js";

export const authenticate = async (req, res, next) => {
  try {
    // 1. Read and validate the Authorization header
    const authHeader = req.headers.authorization;

    const match = authHeader?.match(/^Bearer\s+(\S+)$/i);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing or malformed",
      });
    }

    const accessToken = match[1];

    // 2. Verify the token using the expected algorithm
    const decodedToken = jwt.verify(accessToken, env.accessTokenSecret, {
      algorithms: ["HS256"],
    });
    // 3. Validate the expected token payload
    if (
      typeof decodedToken !== "object" ||
      decodedToken === null ||
      typeof decodedToken.userId !== "string" ||
      !/^[0-9a-fA-F]{24}$/.test(decodedToken.userId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    // 4. Find the user
    const user = await User.findById(decodedToken.userId);

    if (!user || user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    // 5. Attach trusted user information to the request
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token",
      });
    }

    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
    }

    return next();
  };
};

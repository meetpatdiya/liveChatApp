import {rateLimit} from "express-rate-limit"

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: 'Too many login attempts. Please try again in a minute.',
  statusCode:429,
});

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

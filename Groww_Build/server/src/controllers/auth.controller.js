import { AuthService } from '../services/auth/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

// Cookie options for secure HTTP-only refresh token
const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await AuthService.register({ name, email, password });

  // Set HTTP-only refresh cookie
  res.cookie('refreshToken', result.refreshToken, getCookieOptions());

  return sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.accessToken,
    },
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login({ email, password });

  // Set HTTP-only refresh cookie
  res.cookie('refreshToken', result.refreshToken, getCookieOptions());

  return sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.accessToken,
    },
    200
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const result = await AuthService.refresh(refreshToken);

  // Refresh cookie if rotated
  if (result.refreshToken) {
    res.cookie('refreshToken', result.refreshToken, getCookieOptions());
  }

  return sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.accessToken,
    },
    200
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return sendSuccess(res, { message: 'Logged out successfully' }, 200);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await AuthService.getMe(req.user.id);
  return sendSuccess(res, { user }, 200);
});

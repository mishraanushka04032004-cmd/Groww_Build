import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models/User.js';
import { Watchlist } from '../../models/Watchlist.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../config/logger.js';

export class AuthService {
  /**
   * Hash a plain password with bcrypt (10 rounds)
   */
  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  /**
   * Compare plain password against hash
   */
  static async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate Access and Refresh JWTs
   */
  static generateTokens(user) {
    const payload = {
      sub: user._id ? user._id.toString() : user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Register a new user and provision a default watchlist
   */
  static async register({ name, email, password }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('An account with this email address already exists', 409, 'DUPLICATE_EMAIL');
    }

    const passwordHash = await this.hashPassword(password);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
    });

    // Automatically provision default watchlist for user
    await Watchlist.create({
      userId: user._id,
      name: 'My Watchlist',
      isDefault: true,
    });

    logger.info({ userId: user._id, email: user.email }, 'User registered successfully');

    const tokens = this.generateTokens(user);
    return { user: user.toJSON(), ...tokens };
  }

  /**
   * Authenticate user with credentials
   */
  static async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await this.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    logger.info({ userId: user._id, email: user.email }, 'User logged in successfully');

    const tokens = this.generateTokens(user);
    return { user: user.toJSON(), ...tokens };
  }

  /**
   * Verify refresh token and issue new access token
   */
  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 401, 'UNAUTHORIZED');
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.sub);

      if (!user) {
        throw new AppError('User not found', 401, 'UNAUTHORIZED');
      }

      const tokens = this.generateTokens(user);
      return { user: user.toJSON(), ...tokens };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid or expired refresh token', 401, 'UNAUTHORIZED');
    }
  }

  /**
   * Get user profile by ID
   */
  static async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user.toJSON();
  }
}

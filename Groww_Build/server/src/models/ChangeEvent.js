import mongoose from 'mongoose';

const changeEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    watchlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Watchlist',
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
      index: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'HIGH_VOLUME_BREAKOUT',
        'VOLUME_SPIKE',
        'PRICE_SURGE',
        'PRICE_DROP',
        'VOLATILITY_EXPANSION',
        'TREND_SHIFT_BULLISH',
        'TREND_SHIFT_BEARISH',
        'ROUTINE_DRIFT',
      ],
      default: 'PRICE_SURGE',
    },
    severity: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    deltaPercent: {
      type: Number,
      required: true,
    },
    baseline: {
      price: { type: Number, required: true },
      timestamp: { type: Date, required: true },
    },
    current: {
      price: { type: Number, required: true },
      volume: { type: Number, default: 0 },
      volumeRatio: { type: Number, default: 1.0 },
      timestamp: { type: Date, default: Date.now },
    },
    signals: {
      priceSignal: { type: Number, default: 0 },
      volumeSignal: { type: Number, default: 0 },
      volatilitySignal: { type: Number, default: 0 },
      trendSignal: { type: Number, default: 0 },
      breakoutSignal: { type: Number, default: 0 },
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    detectedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.userId = ret.userId.toString();
        if (ret.watchlistId) ret.watchlistId = ret.watchlistId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for user feed and stock timeline retrieval
changeEventSchema.index({ userId: 1, detectedAt: -1 });
changeEventSchema.index({ userId: 1, symbol: 1, detectedAt: -1 });
changeEventSchema.index({ symbol: 1, detectedAt: -1 });

export const ChangeEvent = mongoose.model('ChangeEvent', changeEventSchema);

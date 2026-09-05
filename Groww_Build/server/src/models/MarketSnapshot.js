import mongoose from 'mongoose';

const marketSnapshotSchema = new mongoose.Schema(
  {
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
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    open: {
      type: Number,
      default: 0,
    },
    high: {
      type: Number,
      default: 0,
    },
    low: {
      type: Number,
      default: 0,
    },
    previousClose: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 0,
    },
    averageVolume: {
      type: Number,
      default: 0,
    },
    volumeRatio: {
      type: Number,
      default: 1.0,
    },
    change: {
      type: Number,
      default: 0,
    },
    changePercent: {
      type: Number,
      default: 0,
    },
    high52Week: {
      type: Number,
    },
    low52Week: {
      type: Number,
    },
    high20Day: {
      type: Number,
    },
    low20Day: {
      type: Number,
    },
    sma20: {
      type: Number,
    },
    sma50: {
      type: Number,
    },
    atr14: {
      type: Number,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    source: {
      type: String,
      default: 'mock',
    },
    isDelayed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// High performance compound index for historical range queries & latest snapshots
marketSnapshotSchema.index({ symbol: 1, timestamp: -1 });

export const MarketSnapshot = mongoose.model('MarketSnapshot', marketSnapshotSchema);

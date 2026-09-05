import mongoose from 'mongoose';

const userMarketStateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
    },
    lastSeenPrice: {
      type: Number,
      required: [true, 'Last seen price is required'],
    },
    lastSeenTimestamp: {
      type: Date,
      required: [true, 'Last seen timestamp is required'],
      default: Date.now,
    },
    lastAcknowledgedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.userId = ret.userId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound Unique Index: One baseline state per user per symbol
userMarketStateSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const UserMarketState = mongoose.model('UserMarketState', userMarketStateSchema);

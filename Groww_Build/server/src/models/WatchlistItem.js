import mongoose from 'mongoose';

const watchlistItemSchema = new mongoose.Schema(
  {
    watchlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Watchlist',
      required: [true, 'Watchlist ID is required'],
      index: true,
    },
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        ret.watchlistId = ret.watchlistId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound Unique Index: Strictly prevents duplicate stocks in the same watchlist
watchlistItemSchema.index({ watchlistId: 1, symbol: 1 }, { unique: true });
// Compound Index for efficient ordered listing
watchlistItemSchema.index({ watchlistId: 1, position: 1 });

export const WatchlistItem = mongoose.model('WatchlistItem', watchlistItemSchema);

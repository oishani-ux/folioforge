import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    theme: { type: mongoose.Schema.Types.Mixed, default: {} },
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Portfolio', portfolioSchema);

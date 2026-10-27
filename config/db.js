import dns from 'node:dns';
import mongoose from 'mongoose';

// Local-only workaround: this laptop's default DNS refuses the SRV lookup that
// mongodb+srv:// needs. On Render (production) the normal DNS works, so skip it there.
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
}

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
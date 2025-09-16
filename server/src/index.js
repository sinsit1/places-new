import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const app = createApp();
    app.listen(PORT, () => console.log('API on http://localhost:' + PORT));
  } catch (err) {
    console.error('DB connection error', err);
    process.exit(1);
  }
})();

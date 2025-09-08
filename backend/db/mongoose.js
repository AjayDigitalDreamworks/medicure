import mongoose from 'mongoose';
import { env } from '../config/env.js';


export async function connectDB() {
mongoose.set('strictQuery', true);
await mongoose.connect(env.mongoUri, {
autoIndex: env.nodeEnv !== 'production',
});
return mongoose;
}
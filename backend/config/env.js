import 'dotenv/config';


export const env = {
port: process.env.PORT || 4000,
mongoUri: process.env.MONGO_URI,
sessionSecret: process.env.SESSION_SECRET,
cryptoKey: process.env.CRYPTO_KEY,
cryptoIvSalt: process.env.CRYPTO_IV_SALT,
nodeEnv: process.env.NODE_ENV || 'development',
corsOrigin: process.env.CORS_ORIGIN || '*',
};


if (!env.mongoUri || !env.sessionSecret || !env.cryptoKey || !env.cryptoIvSalt) {
throw new Error('Missing required env vars');
}
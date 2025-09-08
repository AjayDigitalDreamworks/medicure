import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from './env.js';


export function sessionMiddleware() {
return session({
secret: env.sessionSecret,
resave: false,
saveUninitialized: false,
cookie: {
httpOnly: true,
secure: env.nodeEnv === 'production',
sameSite: 'lax',
maxAge: 1000 * 60 * 60 * 8, // 8h
},
store: MongoStore.create({ mongoUrl: env.mongoUri, ttl: 60 * 60 * 12 })
});
}
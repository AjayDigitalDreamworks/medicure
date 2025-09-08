import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';


export const security = {
helmet: helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }),
sanitize: mongoSanitize(),
xss: xss(),
limiter: rateLimit({ windowMs: 15 * 60 * 1000, max: 300, standardHeaders: true, legacyHeaders: false }),
};
import jwt from 'jsonwebtoken';

export function ensureAuth(req, res, next) {
if (req.isAuthenticated?.()) return next();
return res.status(401).json({ error: 'unauthenticated' });
}


export function ensureRole(role) {
return (req, res, next) => {
if (!req.isAuthenticated?.()) return res.status(401).json({ error: 'unauthenticated' });
if (req.user?.role !== role) return res.status(403).json({ error: 'forbidden' });
next();
};
}


// For patients: require that they selected city+hospital this session
export function ensurePatientContext(req, res, next) {
if (req.user?.role !== 'patient') return res.status(403).json({ error: 'forbidden' });
const { cityId, hospitalId } = req.session?.context || {};
if (!cityId || !hospitalId) return res.status(428).json({ error: 'select_city_and_hospital' });
next();
}




export const authenticateJWT = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/User.js';


passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
async (email, password, done) => {
try {
const user = await User.findOne({ email });
if (!user) return done(null, false, { message: 'Invalid credentials' });
const ok = await user.verifyPassword(password);
if (!ok) return done(null, false, { message: 'Invalid credentials' });
return done(null, user);
} catch (e) {
return done(e);
}
}
));


passport.serializeUser((user, done) => {
done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
try {
const user = await User.findById(id).select('+role');
done(null, user);
} catch (e) {
done(e);
}
});


export default passport;
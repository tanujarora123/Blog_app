const googleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../model/User');

function initializeGoogleStrategy(passport){
    passport.use(
        new googleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/redirect'
        }, (atoken, rfrshtoken, profile, done) => {
            userModel.findOne({ googleId: profile.id })
            .then((user) => {
                if(user){
                    console.log('Existing User');
                    done(null, user);
                } else{
                    console.log('New User');
                    const newUser = new userModel({
                        name: profile.displayName,
                        googleId: profile.id,
                        image: profile.photos[0].value
                    });
                    newUser.save()
                    .then(rslt => done(null, newUser))
                    .catch(err => console.log(err))
                ;
                }
            })
            .catch((err) => {})
        ;
        })
    );

    passport.serializeUser((user, done) => {
        console.log('Serializing User');
        return done(null, user)
    });
    passport.deserializeUser((id, done) => {
        console.log('Deserializing User');
        userModel.findById(id, (err, user) => done(null, user))
    });
}

module.exports = initializeGoogleStrategy;
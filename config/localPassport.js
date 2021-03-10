const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('../model/User');

function initializeLocalStrategy(passport){
    passport.use(
        new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, done) => {
            try{
                const user = await userModel.findOne({ email });
                if(!user){
                    //user not found 
                    return done(null, false, { message: 'User not registered' })
                }
                //compare Password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(isMatch){
                        return done(null, user)
                    } else{
                        return done(null, false, { message: 'Incorrect Password' })
                    }
                });
            } catch(err){
                console.log(err);
            }
        })
    )

    passport.serializeUser((user, done) => {
        console.log('Serializing User');
        return done(null, user)
    });
    passport.deserializeUser((id, done) => {
        console.log('Deserializing User');
        userModel.findById(id, (err, user) => done(null, user))
    });
}

module.exports = initializeLocalStrategy;
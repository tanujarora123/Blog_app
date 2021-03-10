const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const userModel = require('../model/User');
const { ensureAuth, ensureGuest } = require('../middlewares/authMiddlewares'); 
const router = express.Router();

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body
    const errors = [];

    //All feilds are required
    if(!name || !email || !password || !password2){
        errors.push({ msg: 'Please provide all feilds' });
    }

    //password length is atleast 6 charcs
    if(password.length < 6){
        errors.push({ msg: 'Password must be atleast 6 Charcters' });
    }

    //Password and confirm passwords must Match
    if(password != password2){
        errors.push({ msg: 'Passwod and confirm passwod must match' });
    }

    if(errors.length != 0){
        res.render('index', { errors })
    }

    userModel.findOne({ email }, (err, user) => {
        if(user){
            errors.push({ msg: 'User already Exists' });
            res.render('index', { errors })
        } else{
            bcrypt.hash(password, 10, async (err, hashPassword) => {
                const newUser = new userModel({ name, email, password: hashPassword });
                try{
                    const user = await newUser.save();
                    req.flash('success_msg', 'You are Now Registered')
                    res.redirect('/auth/login');
                } catch(err){
                    console.log(err);
                }
            });
        }
    })

});

router.get('/login', ensureGuest, (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashbord',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/google', ensureGuest, passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/redirect', ensureGuest, passport.authenticate('google', { failureRedirect: '/' }), (req, res) => res.redirect('/dashbord'));

router.get('/logout', ensureAuth, (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});

module.exports = router
module.exports = {
    ensureAuth: (req, res, next) => {
        if(req.user){
            next();
        } else{
            req.flash('error_msg', 'Please Login to continue');
            res.redirect('/auth/login');
        }
    },

    ensureGuest: (req, res, next) => {
        if(!req.user){
            next();
        } else{
            req.flash('error_msg', 'You are alredy Logged in');
            res.redirect('/dashbord');
        }
    }
}
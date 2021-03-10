if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo').default;
const app = express();

//DB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if(!err){
        app.listen(3000, () => console.log('Server Running'));
        console.log('DB conncted');
    } else{
        console.log(err);
    }
});

//Google Strategy
require('./config/googlePassport')(passport);

//Local Strategy
require('./config/localPassport')(passport);

//Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

//Flash messages
app.use(flash());

//Passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//BodyParser
app.use(express.urlencoded({ extended: false }));

//MethodOverride middleware
app.use(methodOverride('_method'));

//EJS middlewares
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/blog', require('./routes/blog'));
app.use('/auth', require('./routes/auth'));
const express = require('express');
const { ensureAuth, ensureGuest } = require('../middlewares/authMiddlewares'); 
const router = express.Router();
// const dummyBlogs = require('../blogs');
const blogModel = require('../model/Blog');

router.get('/', ensureGuest, (req, res) => {
    res.render('index');
});

router.get('/dashbord', ensureAuth, async (req, res) => {
    try{
        const blogs = await blogModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.render('dashbord', { name: req.user.name, blogs });
    } catch(err) {
        console.log(err);
    }
});

module.exports = router
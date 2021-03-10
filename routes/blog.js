const express = require('express');
// const dummyBlogs = require('../blogs');
const blogModel = require('../model/Blog');
const { ensureAuth, ensureGuest } = require('../middlewares/authMiddlewares');
const router = express.Router();

router.get('/create', ensureAuth, (req, res) => {
    res.render('./blog/create');
});

router.post('/create', async (req, res) => {
    //Creating and Saving new blog in DB
    const { title, discription } = req.body;
    const newBlog = new blogModel({ title, discription, user: req.user.id });
    try{
        const rslt = await newBlog.save();
        res.redirect('/dashbord');
    } catch(err) {
        console.log(err);
        res.redirect('/blog/create');
    }
});

router.get('/edit/:id', ensureAuth, async (req, res) => {
    try{
        const requiredBlog = await blogModel.findById(req.params.id);
        res.render('./blog/edit', { 
            title: requiredBlog.title, 
            discription: requiredBlog.discription,
            id: requiredBlog.id
        });
    } catch(err){
        console.log(err);
    }
});

router.post('/edit/:id', (req, res) => {
    blogModel.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            discription: req.body.discription
        }, 
        (err, doc) => {
            if(err){
                console.log(err);
            } else{
                res.redirect('/dashbord');
            }
        }
    );
});

router.delete('/delete/:id', async (req, res) => {
    try{
        const rslt = await blogModel.findByIdAndDelete(req.params.id);
        res.redirect('/dashbord');
    } catch(err){
        console.log(err);
    }
});

module.exports = router
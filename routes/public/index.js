const express = require('express');
const router = express.Router();
const Course = require('../../models/course');
const Subject = require('../../models/subject');
const auth = require('../../directives/authentication');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;
    let dateNow = Date.now();

    Course.find({})
        .sort({viewCount: 'desc'})
        .skip((perPage*page)-perPage)
        .limit(perPage)
        .then(courses => {
            courses.forEach(courses => {
                courses.deadlinePassed = dateNow > courses.dateToApply
            })
            Course.count().then(courseCount=>{
                Subject.find({}).then(subjects => {
                    res.render('home/index', {
                        courses: courses,
                        subjects: subjects,
                        current: parseInt(page),
                        pages: Math.ceil(courseCount/perPage)
                    });
                });
            });
        });
});

router.get('/login', (req, res) => {
    res.render('home/login');
});

router.post('/login',(req, res) => {
    auth.authenticate('local', {
        failureRedirect: '/login',
        badRequestMessage: 'Please fill all the fields below to log in',
        failureFlash: true
    })(req, res => {
        req.flash('success_message', 'You are now logged in');
        res.redirect('/admin');
    });
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_message', 'You are now logged out');
    res.redirect('/login');
});

router.get('/course/:slug',(req, res) => {
    Course.findOneAndUpdate({slug : req.params.slug}, {$inc : {viewCount : 1}}, {new: true})
        .then(course => {
            return Subject.find({})
                .then(subjects => {
                    res.render('home/course', {course: course, subjects: subjects});
                });
        });
});

module.exports = router;

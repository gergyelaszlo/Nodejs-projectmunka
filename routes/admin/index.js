const express = require('express');
const router = express.Router();
const Course = require('../../models/course');
const Subject = require('../../models/subject');
const faker = require('faker');

router.all('/*', (req, res, next) => {
    if(req.admin) {
        req.app.locals.layout = 'admin';
        next();
    }
});

router.get('/', (req, res) => {
    const promises = [
        Course.count().exec(),
        Subject.count().exec()
    ];

    Promise.all(promises)
        .then(([courseCount, subjectCount]) => {
            res.render('admin/index', {
                courseCount: courseCount,
                subjectCount: subjectCount
            });
        });
});

router.post('/generate-faker-courses', (req, res) => {
    for (let i = 0; i < req.body.amount; i++) {
        const course = new Course();
        course.title = faker.name.title();
        course.body = faker.lorem.sentence();
        course.slug = faker.name.title();
        course.save();
    }
    req.flash('success_message', 'Course is successfully generated');
    res.redirect('/admin/courses');
});

module.exports = router;

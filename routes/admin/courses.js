const express = require('express');
const router = express.Router();
const Course = require('../../models/course');
const Subject = require('../../models/subject');
const fs = require('fs');
const path = require('path');
const {body, validationResult} = require('express-validator');
const {isEmpty} = require('../../directives/uploads');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Course.find({})
        .then(courses => {
            res.render('admin/courses', {courses: courses});
        });
});

router.get('/create', (req, res) => {
    Subject.find({})
        .then(subjects => {
            res.render('admin/courses/create', {subjects: subjects});
        });
});

router.post('/create',
    body('name').notEmpty(),
    (req, res) => {
        const result = validationResult(req);

        if (result.errors && result.errors.length > 0) {
            res.render('admin/courses/create', {errors: result.errors});
        } else {
            let fileName = 'no_image.jpg';
            if (!isEmpty(req.files)) {
                const file = req.files.file;
                fileName = `${Date.now()}-${file.name}`;
                file.mv(`./public/uploads/${fileName}`, error => {
                    if (error) {
                        throw error;
                    }
                });
            }

            const newCourse = new Course({
                name: req.body.name,
                subject: req.body.subject,
                file: fileName,
                dateToApply: req.body.dateToApply,
            });

            newCourse.save()
                .then(_ => {
                    req.flash('success_message', 'Course is successfully created');
                    res.redirect('/admin/courses');
                });
        }
    });

router.get('/edit/:id', (req, res) => {
    Course.findById(req.params.id)
        .then((course) => {
            Subject.find({})
                .then((subjects) => {
                    res.render('admin/courses/edit', {course: course, subjects: subjects});
                });
        });
});

router.put('/edit/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            course.name = req.body.name;
            course.subject = req.body.subject;
            course.dateToApply = req.body.dateToApply;

            if (!isEmpty(req.files)) {
                const file = req.files.file;
                course.file = `${Date.now()}-${file.name}`
                file.mv(`./public/uploads/${course.file}`, err => {
                    if (err) {
                        throw err;
                    }
                });
            }

            course.save()
                .then(_ => {
                    // noinspection SpellCheckingInspection
                    req.flash('success_message', 'Course is now updated');
                    res.redirect('/admin/posts/user-posts');
                });
        });
});

router.delete('/:id', (req, res) => {
    Course.findById(req.params.id)
        .then(course => {
            if (course.file && course.file.length > 0) {
                fs.unlink(path.join(__dirname, 'public', 'uploads', course.name), () => {
                    deletePost(course, req, res)
                });
            } else {
                deletePost(course, req, res);
            }
        });
});

const deletePost = (course, req, res) => {
    course.remove()
        .then(_ => {
            req.flash('success_message', 'Course is successfully deleted');
            res.redirect('/admin/courses/index');
        });
}

module.exports = router;

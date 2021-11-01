const express = require("express");
const router = express.Router();
const Subject = require('../../models/subject');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Subject.find({})
        .then(subjects => {
            res.render('admin/subjects/index', {subjects: subjects});
        });
});

router.post('/create', (req, res) => {
    const newSubject = new Subject({
        title: req.body.title,
        body: req.body.body
    });

    newSubject.save()
        .then(_ => {
            req.flash('success_message', 'Subject is created');
            res.redirect('/admin/subjects');
        });
});

router.get('/edit/:id', (req, res) => {
    Subject.findById(req.params.id)
        .then(subject => {
            res.render('admin/subjects/edit', {subject: subject});
        });
});

router.put('/edit/:id', (req, res) => {
    Subject.findById(req.params.id)
        .then(subject => {
            subject.title = req.body.title;
            subject.body = req.body.body;
            subject.save()
                .then(_ => {
                    req.flash('success_message', 'Subject is updated');
                    res.redirect('/admin/subjects');
                });
        });
});

router.delete('/:id', (req, res) => {
    Subject.remove({_id: req.params.id})
        .then(_ => {
            req.flash('success_message', 'Subject is deleted');
            res.redirect('/admin/subjects');
        });
});

module.exports = router;

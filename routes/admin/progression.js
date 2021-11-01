const express = require("express");
const router = express.Router();
const Progress = require('../../models/progress');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Progress.find({})
        .then(progression => {
            res.render('admin/progression/index', {progression: progression});
        });
});

router.post('/create', (req, res) => {
    const newProgress = new Progress({
        name: req.body.name
    });

    newProgress.save()
        .then(_ => {
            req.flash('success_message', 'Progress is created');
            res.redirect('/admin/progression');
        });

});

router.get('/edit/:id', (req, res) => {
    Progress.findById(req.params.id)
        .then(progression => {
            res.render('admin/progression/edit', {progression: progression});
        });
});

router.put('/edit/:id', (req, res) => {
    Progress.findById(req.params.id)
        .then(progression => {
            progression.name = req.body.name;
            progression.save()
                .then(_ => {
                    req.flash('success_message', 'Progress is updated');
                    res.redirect('/admin/progression');
                });
        });
});

router.delete('/:id', (req, res) => {
    Progress.remove({_id: req.params.id})
        .then(_ => {
            req.flash('success_message', 'Progress is deleted');
            res.redirect('/admin/progression');
        });
});

module.exports = router;

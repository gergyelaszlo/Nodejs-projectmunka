const express = require("express");
const router = express.Router();
const Apply = require('../../models/apply');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/',(req, res) => {
    Apply.find({})
        .then(applications => {
            res.render('admin/apply/apply', {applications: applications});
        });
});

router.get('/edit/:id', (req, res) => {
    Apply.findById(req.params.id)
        .then(apply => {
            res.render('admin/apply/edit', {apply: apply});
        });
});

router.put('/edit/:id', (req, res) => {
    Apply.findById(req.params.id)
        .then(apply => {
            apply.applyStatus = req.body.applyStatus;
            apply.save()
                .then(_ => {
                    req.flash('success_message', 'Application is updated');
                    res.redirect('/admin/apply');
                });
        });
});

module.exports = router;

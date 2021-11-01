const express = require("express");
const router = express.Router();
const Apply = require('../../models/apply');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res) => {
    Apply.find({})
        .then(applies => {
            res.render('home/apply', {applies: applies});
        });
});

router.post('/', (req, res) => {
    const newApply = new Apply({
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        placeOfBirth: req.body.placeOfBirth,
        applyStatus: req.body.applyStatus
    });

    newApply.save()
        .then(_ => {
            req.flash('success_message', 'Apply is send');
            res.redirect('/');
        });

});

module.exports = router;

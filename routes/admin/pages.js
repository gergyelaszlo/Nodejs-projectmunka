const express = require("express");
const router = express.Router();
const Page = require('../../models/page');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Page.find({})
        .then(pages => {
            res.render('admin/pages/index', {pages: pages});
        });
});

router.post('/create', (req, res) => {
    const newPage = new Page({
        title: req.body.title,
        content: req.body.content
    });

    newPage.save()
        .then(_ => {
            req.flash('success_message', 'Page is created');
            res.redirect('/admin/pages');
        });

});

router.get('/edit/:id', (req, res) => {
    Page.findById(req.params.id)
        .then(post => {
            res.render('admin/pages/edit', {post: post});
        });
});

router.put('/edit/:id', (req, res) => {
    Page.findById(req.params.id)
        .then(post => {
            post.title = req.body.title;
            post.content = req.body.content;
            post.save()
                .then(_ => {
                    req.flash('success_message', 'Page is updated');
                    res.redirect('/admin/pages');
                });
        });
});

router.delete('/:id', (req, res) => {
    Page.remove({_id: req.params.id})
        .then(_ => {
            req.flash('success_message', 'Page is deleted');
            res.redirect('/admin/pages');
        });
});

module.exports = router;

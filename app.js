const express = require('express');
const session = require('express-session');
const upload = require('express-fileupload');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const {generateDate, pagination} = require('./directives/handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/projectnodejsgergyelaszlo',
    {useUnifiedTopology: true, useNewUrlParser: true});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'home',
    helpers: {
        generateDate: generateDate,
        pagination: pagination},
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

app.use(upload());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', require('./routes/public/index'));
app.use('/applications', require('./routes/public/applications'));
app.use('/admin', require('./routes/admin/index'));
app.use('/admin/courses', require('./routes/admin/courses'));
app.use('/admin/applications', require('./routes/admin/applications'));
app.use('/admin/pages', require('./routes/admin/pages'));
app.use('/admin/progression', require('./routes/admin/progression'));
app.use('/admin/subjects', require('./routes/admin/subjects'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

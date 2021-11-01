const passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
    admin = {
        _id: 1,
        adminname: 'admin',
        email: 'admin@email.com',
        password: 'admin'
    };

passport.use('login', new LocalStrategy(
    function(adminname, password, done) {
        if(adminname === admin.adminname && password === admin.password) {
            return done(null, admin);
        }
        else {
            done(null, false, { message: 'Invalid name and password.' });
        }
    }
));

passport.serializeUser(function(admin, done) {
    done(null, admin._id);
});

passport.deserializeUser(function(id, done) {
    done(null, admin);
});

module.exports = passport;

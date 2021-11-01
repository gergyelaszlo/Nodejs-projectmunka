const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

try {
    module.exports = model('admin', UserSchema);
} catch (e) {
    module.exports = model('admin');
}

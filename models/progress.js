const {Schema, model} = require('mongoose');

const ProgressSchema = new Schema({
    name: {
        type: String,
        default: 'In progress',
        require: true
    }
});

try {
    module.exports = model('progression', ProgressSchema);
} catch (e) {
    module.exports = model('progression');
}

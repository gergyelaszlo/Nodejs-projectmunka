const {Schema, model} = require('mongoose');

const PageSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    file: {
        type: String
    },
    slug: {
        type: String
    }
});

try {
    module.exports = model('pages', PageSchema);
} catch (e) {
    module.exports = model('pages');
}

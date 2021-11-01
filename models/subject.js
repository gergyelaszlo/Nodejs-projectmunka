const {Schema, model} = require('mongoose');
const UrlSlugs = require('mongoose-url-slugs');

const SubjectSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    body: {
        type: String,
        require: true
    }
});

SubjectSchema.plugin(UrlSlugs('title', {field: 'slug'}));

try {
    module.exports = model('subjects', SubjectSchema);
} catch (e) {
    module.exports = model('subjects');
}

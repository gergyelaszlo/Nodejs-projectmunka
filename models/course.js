const {Schema, model} = require('mongoose');

const CourseSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'subjects'
    },
    slug: {
        type: String
    },
    name: {
        type: String,
        require: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    file: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    },
    dateToApply: {
        type: Date
    }
});

try {
    module.exports = model('courses', CourseSchema);
} catch (e) {
    module.exports = model('courses');
}

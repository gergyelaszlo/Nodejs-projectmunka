const {Schema, model} = require('mongoose');

const ApplySchema = new Schema({
    progress: {
        type: Schema.Types.ObjectId,
        ref: 'progression'
    },
    name: {
        type: String,
        require: true
    },
    dateOfBirth: {
        type: String,
        require: true
    },
    placeOfBirth: {
        type: String,
        require: true
    }
});

try {
    module.exports = model('applications', ApplySchema);
} catch (e) {
    module.exports = model('applications');
}

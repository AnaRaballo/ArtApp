const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TYPES = require('./artwork-types');

const ArtworkSchema = new Schema({
    title         : { type: String, required: true },
    description   : { type: String, required: true },
    category      : { type: String, enum: TYPES, required: false },
    _creator      : { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
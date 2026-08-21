const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = mongoose.ObjectId;

const noteSchema = new Schema({
    title: { type: String, required: true, trim: true},
    content: { type: String, required: true, trim: true},
    tags: { type: [String], default: []},
    isPinned: { type: Boolean, default: false },
    userId: { type: ObjectId, required: true},
    createdOn: { type: Date, default: Date.now }
});

noteSchema.index({ userId: 1, isPinned: -1, createdOn: -1 });
noteSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Note", noteSchema);

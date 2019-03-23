var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//creating new USERschema object

var EntrySchema = new Schema ({

    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Entry = mongoose.model("Entry", EntrySchema);
module.exports = Entry;
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionSchema = new Schema(
    {

        _id: Number,
        id:Number,
        questionInput: String,
        inputType: String,

        response: [{data:String,
            date: Number,
        choices:[String]}],
        agent: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    }
);

//Export model
module.exports = mongoose.model('note_model', questionSchema);
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LogSchema = new Schema(
    {
        userid: {
            type: String,
            maxlength: 100
        },
        responses: [
            {
                date: String,
                answer: [
                    {
                        qid: String,
                        questionType:String,
                        ans: String
                    }
                ]
            }
        ]
    }
);

module.exports = mongoose.model('Log', LogSchema);
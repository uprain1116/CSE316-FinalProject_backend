var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Logschema = new Schema(
    {
        userid: {
            type: String,
            maxlength: 100
        },
        responses: [
            {
                date: Date,
                answer: [
                    {
                        qid: String,
                        ans: Number || String || Boolean || undefined
                    }
                ]
            }
        ]
    }
);
var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('../utils/validators');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        userInfo: {
            name: {
                type: String,
                maxlength: 100
            },
            email: {
                type: String,
                validator:{
                    validator: validator.validateEmail,
                    message: props => `${props.value} is not a valid email`
                },
                required: true,
                trim: true,
                unique: true,
                maxlength: 100
            },
            password:{
                type: String,
                required: true,
                minlength: 8
            },
            address:{
                address1:{
                    type: String,
                    maxlength: 100
                },
                address2:{
                    type: String,
                    maxlength: 100
                }
            }
        },
        questions:[
            {
                id: String, 
                type: String, 
                question: String, 
                option: [{type: String}] || undefined
            }
        ]
    }
);

//Export model
module.exports = mongoose.model('User', UserSchema);
//user.js
var mongoose = require('mongoose');
const bcrypt = require('bcrypt')

var Schema = mongoose.Schema;

var validateEmail = function(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}

var UserSchema = new Schema(
    {

        name:{type:String,
            required:true,

        },
        email: {
            type: String,
            validate: {
                validator: validateEmail,
                message: props => `${props.value} is not a valid email!`
            },
            required: true,
            trim:true,   // This will trim the whitespace automatically from the email before saving
            unique: true
        },
        password:{
            type:String,
            required:true,
            minlength: 6
        },

        colorScheme: String,


        profile_url: {type: String},
    }
);



UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

//Export model
module.exports = User= mongoose.model('User', UserSchema);
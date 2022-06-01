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
                validate:{
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
            },
            isAdmin:{
                type: Boolean
            }
        },
        questions:[
            {
                id: String,
                questionType: String,
                question: String,
                option: [ ] || undefined
            }
        ]
    }
);

UserSchema.pre('save', async function (next) {
    if (!this.isModified('userInfo.password')) return next();
    this.userInfo.password = await bcrypt.hash(this.userInfo.password, 10);
    next();
})

UserSchema.statics.findAndValidate = async function (email, password) {
    const user = await this.findOne({"userInfo.email":email});
    if(!user) {
        return false;
    }

    const isValid = await bcrypt.compare(password, user.userInfo.password);
    return isValid ? user : false;
}

//Export model
module.exports = mongoose.model('User', UserSchema);

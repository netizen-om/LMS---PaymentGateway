import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { type } from "os";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Name is Required"],
        trim : true,
        maxLength : [50, "Name cannot exceed 50 Characters"]
    },
    email : {
        type : String,
        required : [true, "Email is Required"],
        trim : true,
        unique : true,
        lowercase : true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please provide a valid email"],
    },
    password : {
        type : String,
        required : true,
        minLength : [8, "Password must be at least 8 Characters"],
        select : false
    },
    role : {
        type : String,
        enum : {
            values : ['student', 'instructor', 'admin'],
            message : "Please a valid role"
        },
        default : "student"
    },
    avatar : {
        type : String,
        default : 'default-avatar.png'
    },
    bio : {
        type : String,
        maxLength : [200, "Bio cannot exceed 200 Characters"]
    },
    enrolledCourses : [
        {
            course : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Course"
            },
            enrolledAt : {
                type : Date,
                default : Date.now
            }
        }
    ],
    createdCourses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Course"
        }
    ],
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    lastActive : {
        type : Date,
        default : Date.now
    },
}, {
    timestamps : true
})

//hashing Password
userSchema.pre('save', async function(next) {
    
    if(!this.isModified("password")) {
        return next();    
    }

    this.password = await bcrypt.hash(this.password, 12)
    next()
})

//compare Password
userSchema.methods.comparePassword = async function(enterPassword) {
    return await bcrypt.compare(enterPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
}

userSchema.methods.updateLastActive = async function() {
    this.lastActive = Date.now()
    return this.save({ validateBeforeSave: false });
}

// virtual field for total enrolled courses
userSchema.virtual("totalEnrolledCourses").get(function() {
    return this.enrolledCourses.length
})

export const User = mongoose.model('User', userSchema)


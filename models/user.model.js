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

export const User = mongoose.model('User', userSchema)


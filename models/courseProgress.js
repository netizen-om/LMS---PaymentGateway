import mongoose, { Types } from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
    lecture : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Lecture",
        required : [true, "Lectuer Reference is required"],
    },
    isCompleted : {
        type : Boolean,
        default : false
    },
    watchTime : {
        type : Number,
        default : 0 
    },
    lastWatch : {
        type : Date,
        default : Date.now,
    }
})

const courseProgressSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "User Reference is required"],
    },
    course : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course",
        required : [true, "Course Reference is required"],
    },
    isCompleted : {
        type : Boolean,
        default : false
    },
    completionPercentage : {
        type : Number,
        default : 0,
        min : 0,
        max : 100
    },
    lectureProgress : [
        lectureProgressSchema
    ],
    lastAccessed : {
        type : Date,
        default : Date.now
        
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
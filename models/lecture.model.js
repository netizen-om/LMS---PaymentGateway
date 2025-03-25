import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Lecture title is required"],
        trim : true,
    },
    description : {
        type : String,
        maxLength : [500, "Lecture Description cannot exceed 500 character"],
    },
    videoUrl : {
        type : String,
        required : [true, "Video URL is required"],
    },
    duration : {
        type : Number,
        default : 0
    },
    publicId : {
        type : String,
        required : [true, "publicID for video Management"]
    },
    isPreview : {
        type : Boolean,
        default : false
    },
    order : {
        type : Number,
        required : [true, "Lecture order is required"]
    },

}, {
    timestamps : true,
    toJSON : { virtuals : true },
    toObject : { virtuals : true }, 
})
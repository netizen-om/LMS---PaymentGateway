import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "Course title is required"],
        trim : true,
        maxLength : [100, "Course title cannot exceed 100 character"],
    },
    subtitle : {
        type : String,
        trim : true,
        maxLength : [200, "Course subtitle cannot exceed 200 character"],
    },
    description : {
        type : String,
        trim : true,
    },
    category : {
        type : String,
        required : [true, "Course Category is required"],
        trim : true,
    },
    level : {
        type : String,
        enum : {
            values : ["beginner", "intermediate", "advanceed"],
            message : 'Please select valid course level'
        },
        default : "beginner"
    },
    price : {
        type : Number,
        required : [true, "Course price is required"],
        mixLength : [0, "Course price must be not-negative number"],
    },
    thumbnail : {
            type : String,
            required : [true, "Course thumbnail is required"]
    },
    enrolledStudent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    lectures : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Lecture"
        }
    ],
    instructor : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "Course instructor is required"]
    },
    isPublished : {
        type : Boolean,
        default : false
    },
    totalDuration : {
        type : Number,
        default : 0 
    },
    totalLecture : {

    }
}, {
    timestamps : true,
    toJSON : { virtuals : true },
    toObject : { virtuals : true }, 
})

courseSchema.virtual("averageRating").get(function() {
    return 0; //placeholder assignment, Have to add averate rating
})

courseSchema.pre('save', function(next) {
    if(this.lectures) {
        this.totalLecture = this.lectures.length
    }

    next()
})

export const Course = mongoose.model("Course", courseSchema) 
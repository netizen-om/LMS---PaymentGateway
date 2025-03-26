import mongoose from "mongoose";

const coursePurchaseSchema = new mongoose.Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        required:[true, 'Course reference is required']
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'User reference is required']
    },
    amount:{
        type:Number,
        required:[true, 'Purchase amount is required'],
        min:[0, 'Amount must be non-negative']
    },
    currency:{
        type:String,
        required:[true, 'Currency is required'],
        uppercase:true,
        default:'USD'
    },
    status:{
        type:String,
        enum:{
            values:['pending', 'completed', 'failed', 'refunded'],
            message:'Please select a valid status'
        },
        default:'pending'
    },
    paymentMethod:{
        type:String,
        required:[true, 'Payment method is required']
    },
    paymentId:{
        type:String,
        required:[true, 'Payment ID is required']
    },
    refundId:{
        type:String
    },
    refundAmount:{
        type:Number,
        min:[0, 'Refund amount must be non-negative']
    },
    refundReason:{
        type:String
    },
    metadata:{
        type:Map,
        of:String
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

coursePurchaseSchema.index({user : 1, course : 1})
coursePurchaseSchema.index({status : 1})
coursePurchaseSchema.index({createdAt : -1})

coursePurchaseSchema.virtual('isRefundable').get(function() {
    if(this.status !== "completed") return false;
    const thirtyDayPeriod = new Date(Date.now() - (1000 * 60 * 60 * 24 * 30))
    return this.createdAt > thirtyDayPeriod
})

// method to add refund
coursePurchaseSchema.methods.processRefund = async function(reason,amount) {
    this.refundReason = reason
    this.status = "refunded"
    this.refundAmount = amount || this.amount

    return this.save({ validateBeforeSave: false });
} 
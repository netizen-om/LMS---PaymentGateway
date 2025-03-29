import { ApiError, catchAsync } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";


export const createUserAccount = catchAsync(async(req, res) => {
    const { name, email, password, role="student" } = req.body;

    const exsistingUser = await User.findOne({ email : email.toLowerCase() })
    if(exsistingUser){
        throw new ApiError("User already exists", 400);
    }

    const user = await User.create({
        email : email.toLowerCase(),
        name,
        password,
        role
    })

    await user.updateLastActive()
    generateToken(res, user, "Account created successfully")
    
})
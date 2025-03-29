import { ApiError, catchAsync } from "./error.middleware.js";
import jwt from "jsonwebtoken"; 

export const isAuthenticated = catchAsync(async (req,res,next) => {
    const token = req.cookies.token
    if(!token) {
        throw new ApiError("You are not logged in", 401)
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req._id = decoded.userId
        next()
    } catch (error) {
        throw new ApiError("JWT Token error", 401)
    }
})
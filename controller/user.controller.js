import { catchAsync } from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";

export const createUserAccount = catchAsync(async(req, res) => {
    const { name, email, password, role="student" } = req.body;
})
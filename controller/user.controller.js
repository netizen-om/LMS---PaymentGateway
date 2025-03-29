import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { catchAsync } from "../middleware/error.middleware.js";
import { AppError } from "../middleware/error.middleware.js";
import crypto from "crypto";

/**
 * Create a new user account
 * @route POST /api/v1/users/signup
 */
export const createUserAccount = catchAsync(async (req, res) => {
  // TODO: Implement create user account functionality
  const { name, email, password, role = "student", bio } = req.body;

  const isExistedUser = await User.findOne({ email : email.toLowerCase() })
  if(isExistedUser) {
    AppError("User Already Existed", 400);
  }

  const user = await User.create({
    name,
    email : email.toLowerCase(),
    password,
    role,
    bio
  })
  
  await user.updateLastActive();
  generateToken(res, user._id, "Account created successfully")

});

/**
 * Authenticate user and get token
 * @route POST /api/v1/users/signin
 */
export const authenticateUser = catchAsync(async (req, res) => {
  // TODO: Implement user authentication functionality
  const { email, password } = req.body;
  
  const user = await User.findOne( { email } ).select("+password")
  console.log(user);
  
  if(!user) {
    throw new AppError("User does not exist", 400)
  }
  
  let iscorrectPassword = await user.comparePassword(password)
  console.log(iscorrectPassword);
  
  if(!iscorrectPassword) {
    throw new AppError("Invalid Credentials", 400)
  }
  
  await user.updateLastActive()
  generateToken(res, user._id, `SignIn Successfull`);
  
});

/**
 * Sign out user and clear cookie
 * @route POST /api/v1/users/signout
*/
export const signOutUser = catchAsync(async (_, res) => {
  // TODO: Implement sign out functionality
  res
  .status(200)
  .cookie("token", "", { maxAge: 0 })
  .json({ message : "Signout Successfull" }, { success : true})
});

/**
 * Get current user profile
 * @route GET /api/v1/users/profile
*/
export const getCurrentUserProfile = catchAsync(async (req, res) => {
  // TODO: Implement get current user profile functionality
  const user = User.findById(req.id).populate({
    path : "enrolledCourses.course",
    select : "title thumbnail description"
  });
  
  if(!user) {
    throw new AppError("User does not exist", 400)
  }

  res.status(200).json({
    success : true,
    data : {
      ...user.toJSON(),
      totalEnrolledCourse : user.totalEnrolledCourses,
    }
  })

});

/**
 * Update user profile
 * @route PATCH /api/v1/users/profile
 */
export const updateUserProfile = catchAsync(async (req, res) => {
  // TODO: Implement update user profile functionality
  
});

/**
 * Change user password
 * @route PATCH /api/v1/users/password
 */
export const changeUserPassword = catchAsync(async (req, res) => {
  // TODO: Implement change user password functionality
  const { currentPassword, newPassword } = req.body;

  if(!currentPassword || !newPassword) {
    throw new AppError("All fields are required", 400)
  }
  
  const user = await User.findById(req.id).select("+password")
  
  if(!(user.comparePassword(currentPassword))){
    throw new AppError("Incorrect Password", 400)
  }

  user.password = newPassword
  await user.save()

  res
    .status(200)
    .json(
      {
        message : "Password Changed Successfully"
      },
      {
        success : true
      }

    )

});

/**
 * Request password reset
 * @route POST /api/v1/users/forgot-password
 */
export const forgotPassword = catchAsync(async (req, res) => {
  // TODO: Implement forgot password functionality
});

/**
 * Reset password
 * @route POST /api/v1/users/reset-password/:token
 */
export const resetPassword = catchAsync(async (req, res) => {
  // TODO: Implement reset password functionality
});

/**
 * Delete user account
 * @route DELETE /api/v1/users/account
 */
export const deleteUserAccount = catchAsync(async (req, res) => {
  // TODO: Implement delete user account functionality
  const user = await User.findByIdAndDelete(req.id)

  res.cookie("token", "", { maxAge: 0 });
  return res
            .status(200)
            .json(
              {
                message : "Account Deleted"
              },
              {
                success : true
              }
        
            )
});

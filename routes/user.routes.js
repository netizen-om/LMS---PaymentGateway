import express from "express"
import { authenticateUser, createUserAccount, getCurrentUserProfile, signOutUser, updateUserProfile } from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from "../utils/multer.js";

const router = express.Router()

// Auth routes
router.post("/signup", createUserAccount);
router.post("/signin", authenticateUser);
router.get("/signout", signOutUser);

// Profile routes : PROTECTED :
router.get("/profile", isAuthenticated, getCurrentUserProfile);
router.patch("/profile", upload.single("avatar") , isAuthenticated, updateUserProfile);


export default router;
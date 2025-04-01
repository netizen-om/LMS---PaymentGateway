import express from "express"
import { authenticateUser, createUserAccount, getCurrentUserProfile, signOutUser } from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
createUserAccount

const router = express.Router()

// Auth routes
router.post("/signup", createUserAccount);
router.post("/signin", authenticateUser);
router.get("/signout", signOutUser);

// Profile routes : PROTECTED :
router.get("/profile", isAuthenticated, getCurrentUserProfile);


export default router;
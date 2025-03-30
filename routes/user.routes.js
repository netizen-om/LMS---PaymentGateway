import express from "express"
import { authenticateUser, createUserAccount } from "../controller/user.controller.js";
createUserAccount

const router = express.Router()

router.get("/signup", createUserAccount);
router.get("/signin", authenticateUser);

export default router;
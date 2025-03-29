import express from "express"
import { checkHealth } from "../controller/health.controller.js"

const router = express.Router()

router.get("/", checkHealth);

export default router;
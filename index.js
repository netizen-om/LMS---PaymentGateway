// TODO : LEARN about Bind, call and apply in JS 
import dotenv from "dotenv"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import mongoSanitizer from "express-mongo-sanitize" 
import express from "express"
import helmet from "helmet"
import hpp from "hpp"
import cookieParser from "cookie-parser"
import cors from "cors"
import healthRoute from "./routes/health.routes.js"
import userRoute from "./routes/user.routes.js"


dotenv.config()
const app = express()
const PORT = process.env.PORT

//Global rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	message : "Too many request this IP, you may try again later"
});

//Security Middleware
app.use('/api', limiter); // only apply rate limit to routes which starts from "/api"
app.use(helmet());
app.use(hpp());
app.use(mongoSanitizer());

//CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials : true,
    methods : ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept",
    ],
}))


//body Parser middleware
app.use(express.json( {limit : '10kb'} ))
app.use(express.urlencoded( {extended : true, limit : '10kb'} ))
app.use(cookieParser())

//logging middleware
if(process.env.NODE_ENV = 'development'){
    app.use(morgan('dev'))
}



//Global error handler
app.use((err, req, res, next) => {
    console.log(err.stack);
    res
        .status(err.status || 500)
        .json({
            status : 'error',
            message : err.message || "Internal server error",
            ...(process.env.NODE_ENV === 'development' && { stack : err.stack})
        })   
}) 

// API Routes
app.use("/health", healthRoute)
app.use("/api/v1/user", userRoute)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Route not found sould be at end of all routes in express application
app.use((req,res) => {
    res.status(400).json(
        {status : "error",
        message : "Route not found"}
    )
})
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
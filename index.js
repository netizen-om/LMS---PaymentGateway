import dotenv from "dotenv"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import mongoSanitizer from "express-mongo-sanitize" 
dotenv.config()


import express from "express"
import helmet from "helmet"
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
app.use(mongoSanitizer());


//body Parser middleware
app.use(express.json( {limit : '10kb'} ))
app.use(express.urlencoded( {extended : true, limit : '10kb'} ))

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


app.use((req,res) => {
    res.status(400).json(
        {status : "error",
        message : "Route not found"}
    )
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => console.log(`Example app listening on port ${PORT}!`))
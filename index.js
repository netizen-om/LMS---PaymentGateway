import dotenv from "dotenv"
import morgan from "morgan"
dotenv.config()


import express from "express"
const app = express()
const port = process.env.PORT

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
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
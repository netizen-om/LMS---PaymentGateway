import { getDBStatus } from "../database/db.js"

 
 export const checkHealth = async(req, res) => {
    try {
        const dbstatus = getDBStatus();
    
        const healthStatus = {
            status : "OK",
            timeStamp : new Date().toISOString(),
            services : {
                datebase : {
                    status : dbstatus.isconnected ? "healthy" : "unhealthy",
                    details : {
                        ...dbstatus,
                        readyState : getReadyStateText(dbstatus.readyState)
                    }
                },
                server : {
                    status : "healthy",
                    uptime : process.uptime(),
                    memoryUsage : process.memoryUsage(),
                }
    
            }
        }
    
        const httpStatus = healthStatus.services.datebase.status === "healthy" ? 200 : 503
    
        res.status(httpStatus).json(healthStatus)
    } catch (error) {
        console.error("Health check failed");
        res.status(500).json({
            status : "ERROR",
            timeStamp : new Date().toISOString(),
            error : error.message
        })
    }

 }



 // This is just small utility function That take number insted of string from fronted
 function getReadyStateText(state) {
    switch (state) {
        case 0:
            return "disconnected"
        case 1:
            return "connected"
        case 2:
            return "connecting"
        case 3:
            return "disconnecting"
    
        default:
            return "unknown"
    }
 }
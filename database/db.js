import mongoose from "mongoose";

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 sec


class DataBaseConnection{
    constructor() {
        this.retryCount = 0;
        this.isConnected = false;

        // mongoose configuration
        mongoose.set('strictQuery', true);

        mongoose.connection.on("connected", () => {
            console.log("MONGODB CONNECTED ");   
            this.isConnected = true;    
        })   

        mongoose.connection.on("error", () => {
            console.log("MONGODB connection ERROR ");  
            this.isConnected = false;     
        })   
        mongoose.connection.on("disconnecting", () => {
            console.log("MONGODB DISCONNECTING "); 
            this.isConnected = false;      
            this.handleDisconnection()
        })   

        process.on('SIGTERM', this.handleAppTermination.bind(this))

    }

    async connect(){
        try {
            if(!process.env.MONGO_URI) {
                throw new Error("MongoDB URI is not defined in env variables")
            }
    
            const connectionOptions = {
                useNewUrlParser : true,
                useUnifiedTopology : true,
                maxPoolSize : 10,
                serverSelectionTimeoutMS : 5000,
                socketTimeoutMS : 45000,
                family : 4 //it specify IP version to use. In this case IPv4   
            } ;
    
            if(process.env.NODE_ENV === "development") {
                mongoose.set('debug', true)
            }
    
            await mongoose.connect(process.env.MONGO_URI, connectionOptions);
            this.retryCount = 0; // If we are at this point, the connection is successfull (Reset retryCount on connection).
        } catch (error) {
            console.error(error.message)
            await this.handleConnectionError()
        }

    }

    async handleConnectionError() {
        if(this.retryCount < MAX_RETRIES) {
            this.retryCount++;
            console.log(`Retrying Connection.... Attempt ${this.retryCount} of ${MAX_RETRIES}`);

            // waiting for 5 sec
            await new Promise(resolve => setTimeout(() => {
                resolve
            }, RETRY_INTERVAL))

            return this.connect() // Trying to reconnect
        } else {
            console.error(`Failed to Connect to Database after ${MAX_RETRIES} Attempts`)
            process.exit(1)
        }
    }

    async handleDisconnection() {
         if(!this.isConnected === false) {
            console.log("Attempting to reconnection to MongoDB....");
            this.connect()
         }
    }

    async handleAppTermination() {
        try {
            await mongoose.connection.close()
            console.log("MongoDB connection closed through App Termination ");
            process.exit(0)
        } catch (error) {
            console.error("Error during Databse disconnection", error);
            process.exit(1)
            
        }
    }

    getConnectionStatus() {
        return {
            isConnected : this.isConnected,
            readyState : mongoose.connection.readyState,
            host : mongoose.connection.host,
            name : mongoose.connection.name    
        }
    }
}

// create singleton instance
const dbConnection = new DataBaseConnection();

export default dbConnection.connect.bind(dbConnection)
export const getgetDBStatus = dbConnection.getConnectionStatus.bind(dbConnection)
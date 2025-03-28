 
 
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
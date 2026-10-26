const mongoose = require('mongoose')

const db = async ()=>{
    try{
        await mongoose.connect(process.env.MODE==='PRODUCTION' ? process.env.PRO_DB_URL : process.env.DEV_DB_URL)
        console.log("database connected...")
    
    }catch{
        console.log("database not connected...")
    }
}

module.exports = db;
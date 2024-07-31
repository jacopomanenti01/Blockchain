const mongoose = require("mongoose")
require("dotenv").config();


const ConntecDB = async () => {
        if(mongoose.connection[0].readyState){
            console.log("already logged in")
            return;
        }

        mongoose.connect(process.env.MONGODB_UIR)
        .then(() =>{
            console.log("connected to MongoDB")
        }
    ).catch(
        (err) =>{
            throw err;
        }
    );
};

module.exports = {ConntecDB};
const mongoose = require("mongoose")


const transferScheme = new mongoose.Schema(
    {
        fromAddress:{
            type: String,
        },
        toAddress:{
            type: String,
        },
        value:{
            type: String,
        },
        valueWithDecimals:{
            type: String,
        }
    },
    {timestamps: true}
)

let Transfer = mongoose.models.transfers || mongoose.model("transfer", transferScheme);

export default Transfer; 
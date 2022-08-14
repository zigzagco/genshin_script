const mongoose = require("mongoose");
const Schema = mongoose.Schema

const schema = new Schema({
    id:{
        type: String
    },
    title:{
        type: String
    },
    items:{
        type: Array
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})
module.exports = mongoose.model('Posts',schema)
// defining a schema and string in the collection which is exported in other files
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/thyroidDB")
.then(() => {
    console.log("port connected")
})
.catch(() => {
    console.log("failed to connect")
})
// schema - format in which data is stored in our collection
const loginschema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    predictions: [
        {
          input_data: {
            type: [Number],
            required: true
          },
          prediction: {
            type: Number,
            required: true
          },
          message: {
            type: String,
            required: true
          },
          timestamp: {
            type: Date,
            default: Date.now
          }
        }
      ]
})
const collection = new mongoose.model("newCollection",loginschema)
module.exports = collection
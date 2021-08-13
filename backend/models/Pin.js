const mongoose=require("mongoose")

const userSchema=mongoose.Schema({

    username:{
          type:String,
          require:true,
    },
    title:{
        type:String,
        require:true,
        min:3
    },
    description:{
        type:String,
        require:true,
    },
    rating:{
        type:Number,
        require:true,
        min:0,
        max:5
    },
    latitude:{
        type:Number,
        require:true
    },
    longitude:{
        type:Number,
        require:true
    },
    averageRating:{
        type:Number
    },
    
    users:[String]
},{timestamps:true});

module.exports=mongoose.model("Pin",userSchema);
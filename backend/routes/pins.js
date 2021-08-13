const router=require("express").Router()
const Pin=require("../models/Pin");

router.post("/",async(req,res)=>{
    const newPin= new Pin(req.body);
    try{
      const savedPin= await newPin.save();
      return res.status(200).json(savedPin)
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.get("/",async(req,res)=>{
    try{
    const pins=await Pin.find();
    return res.status(200).json(pins);
    }
    catch(err){
    return res.status(500).json(err);
    }
})

router.put("/",async(req,res)=>{
    const pin=req.body.pin;
    const _id=pin._id
    await Pin.updateOne({_id},{
     $set:{
         averageRating:pin.averageRating,
         users:pin.users
     }
    })
})

module.exports=router
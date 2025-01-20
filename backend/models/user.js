const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
    verified:{
        type:Boolean,
        default:false, 
    },
    verificationtoken:String,
    addresses: [
        {
          name: String,
          mobileNo: String,
          houseNo: String,
          street: String,
          landmark: String,
          city: String,
          country: String,
          postalCode: String,
        },
      ],
      orders: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
    const user=mongoose.model("users",userSchema);
 
    module.exports=user;
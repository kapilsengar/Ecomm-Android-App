const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const port = 8000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const user = require('./models/user');
const Order = require("./models/order");


app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require('./Config');

app.listen(port, () => {
    console.log('Server is running on port 8000');
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationtoken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "kapilsengar49@gmail.com", 
            pass: "doph xqni dpkg jnpy", // Use app-specific password
        }
    });

    const mailOptions = {
        from: "amazon.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: http://localhost:8000/verify/${verificationtoken}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error in sending email:', error);
    }
};

// Register route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('Request body:', req.body);  // Log the request body

        // Check existing user
        const existingUser = await user.findOne({ email  });

        if (existingUser) {
            console.log("Already registered")
            return res.status(400).json("Email is Already Registered" )
        }

        // Create new user
        const newUser = new user({ name, email, password });

        // Generate verification token
        newUser.verificationtoken = crypto.randomBytes(20).toString("hex");

        // Save the user
        await newUser.save();

        // Send verification email
        sendVerificationEmail(newUser.email, newUser.verificationtoken);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log('Error while registering user:', error);
        res.status(500).json({ message: "Error while registering user" });
    }
});

app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token;

        // Find the user
        const foundUser = await user.findOne({ verificationtoken: token });
        if (!foundUser) {
            return res.status(400).json({ message: "Invalid Verification token" });
        }

        foundUser.verified = true;
        foundUser.verificationtoken = undefined;

        await foundUser.save();
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Email verification failed" });
    }
});


const generatesecreatKey=()=>{
    return crypto.randomBytes(32).toString("hex")
}
const secreatKey=generatesecreatKey();

//endpoint to login   

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
   
        // Find the user by email
        const loginUser = await user.findOne({ email });
        if (!loginUser) {
            return res.status(400).json("Invalid email");
        }

        // Check the password
        if (loginUser.password !== password) {
            return res.status(400).json("Invalid password" );
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: loginUser._id }, secreatKey, { expiresIn: '1h' });

        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: "Error logging in" });
    }
});


app.get("/profile", async (req, res) => {
    try {
        const userId=req.query.userId
        const foundUser = await user.findById(userId);
            res.send(foundUser)
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the user profile" });
    }
});
app.get("/get-user", async (req, res) => {
    try {
        const {email}=req.query
        const foundUser = await user.findOne({email});
            res.send(foundUser._id)
    } catch (error) {
        res.status(500).json({ message: "Error retrieving the user profile" });
    }
});

app.post("/address",async(req,res)=>{
    try {
        
        const {address,useremail} =req.body
        console.log('addess',address)
        console.log('email',useremail)
        const foundUser=await user.findOne({email:useremail})
        console.log('user',foundUser)
        foundUser.addresses.push(address)
         await foundUser.save()
         res.status(200).json({message:"Address Created Successfully"})
    } catch (error) {
        res.status(500).json({message:"error adding addresses"})
    }
})
  
app.get("/addresses", async (req, res) => {
    try {
        const {useremail } = req.query;  // Access email from query parameters
        console.log("email", useremail);
        
        // Fetch user by email
        const foundUser = await user.findOne({ email:useremail });
        console.log("user", foundUser);

        if (foundUser) {
            res.send(foundUser.addresses);  // Return the addresses
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error retrieving the user profile:", error);
        res.status(500).json({ message: "Error retrieving the user profile" });
    }
});


app.post('/orders', async (req, res) => {
    try {
      const { useremail, cartItems, totalPrice, shippingAddress, paymentMethod } = req.body;
  
      // Validate input
      if (!useremail || !cartItems || !totalPrice || !shippingAddress || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Check if user exists
      const existingUser = await user.findOne({ email: useremail });
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Convert totalPrice to a number
      const formattedTotalPrice = parseFloat(totalPrice.toString().replace(/,/g, ''));
  
      if (isNaN(formattedTotalPrice)) {
        return res.status(400).json({ message: 'Invalid total price' });
      }
  
      // Prepare product objects
      const products = cartItems.map((item) => ({
        name: item?.title || 'Unknown Product',
        quantity: item?.quantity || 1,
        price: item?.price || 0,
        image: item?.image || '',
      }));
  
      if (products.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      // Create and save the order
      const order = new Order({
        user: existingUser._id, // Use ObjectId of the user
        products: products,
        totalPrice: formattedTotalPrice,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
      });
  
      await order.save();
  
      res.status(200).json({ message: 'Order created successfully!' });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  });
  

  app.get('/orders', async (req, res) => {
    try {
        const userId = req.query.userId; // Fetch userId from query parameter
        const foundOrder = await Order.find({ user: userId }); // Fetch the order for the given userId

        if (!foundOrder) {
            return res.status(404).json({ message: "Orders not found" });
        }

        // Assuming `foundOrder.orders` contains the list of orders
        
        console.log("Fetched ordersrererere:", foundOrder);
        res.send(foundOrder)
    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders" });
        console.error("Error retrieving orders:", error);
    }
});

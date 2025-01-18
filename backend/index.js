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
  
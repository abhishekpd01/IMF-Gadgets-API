const bcrypt = require("bcrypt");
const { setUser } = require("../service/auth");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function handleUserSignup(req, res){
    // get the email and password from the request body
    const { email, password } = req.body;
    try {
        // check if the email already exists
        const user = await prisma.user.findUnique({where: {email}});
        if(user){
            return res.status(400).json({message: "Agent already exists"});
        }
    
        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // create a new user in the postgre database
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        })
        
    
        // return a success message
        res.status(201).json({
            message: "Agent created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
            }
        });
    } catch (error) {
        res.status(500).json({message: "Error creating agent", error});
    }
}

async function handleUserLogin(req, res) {
    // get the email and password from the req body
    const { email, password } = req.body;
    try {
        // check if the email exists
        const user = await prisma.user.findUnique({where: {email}});
        if(!user){
            return res.status(400).json({message: "Agent not found, please sign up"});
        }
        // validate and check if the email and password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({message: "Invalid credentials"});
        }
        // create cookie
        const token = setUser(user);
        res.cookie("TOKEN", token, 
            {
                httpOnly: true,
                secure: true, 
                expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            });
        
        // return success message
        res.status(200).json({
            message: "Agent logged in successfully",
            user: {
                id: user.id,
                email: user.email,
            }
        });
    } catch (e) {
        res.status(500).json({message: "Error logging in agent", error: e});
    }
}

async function handleUserLogout(req, res) {
    // clear the cookie
    res.clearCookie("TOKEN");
    // return success message
    res.status(200).json({message: "Agent logged out successfully"});
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserLogout
};
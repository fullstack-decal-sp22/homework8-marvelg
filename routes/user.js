const express = require('express');
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const router = express.Router();


const User = require("../models/User")
require("dotenv").config();

router.use(express.json())

router.post('/signup',
    [
        check("username", "Please Enter a Valid Username")
        .exists()
        .notEmpty(),

        check('password', "Please Enter a Valid Password")
        .isLength({
            min: 6
        })

    ], 
    async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            "errors": errors.array()
        })
    }

    
    // Checks if user exists
    let user = await User.findOne({
        "username" : req.body.username
    })
    
    if (user) {
        return res.status(400).json({
            msg: "User already exists!"
        })
    }
    
    // Creates New User
    user = {"username" : req.body.username, 
    "password": req.body.password,
    "shoppinglist": req.body.shoppinglist ? req.body.shoppinglist : []}

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt)

    const response = await User.create(user)

    const accessToken = jwt.sign({"id": response._id}, process.env.ACCESS_TOKEN)
    
    res.json({status: 'ok' , response})

    
})

router.post("/login", 
    [
        check("username", "Please Enter a Valid Username")
        .exists()
        .notEmpty(),

        check('password', "Please Enter a Valid Password")
        .isLength({
            min: 6
        })
    ], 
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
        }

        const {username, password} = req.body

        let user = await User.findOne({
            username
          });

        if (!user) {
            return res.status(400).json({
                message: "User Not Exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({
            message: "Incorrect Password !"
            });
        }
        
        const token = jwt.sign({"id": user._id}, process.env.ACCESS_TOKEN);

    
        res.header('auth-token', token).send(token);
        
        
})

router.delete('/delete', async (req, res) => {
    try {
        const response = await User.deleteOne({
            "username": req.body.username
        })
        if (response.deletedCount){
            res.json({status: "Deleted!"})
        } else{
            res.json({status: "Not Found"})
        }
        

    } catch(err) {
        console.log(err)
        res.status(400)
    }
})

module.exports = router;
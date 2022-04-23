const express = require('express');
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const router = express.Router();


const User = require("../models/User")
require("dotenv").config();

router.use(express.json())

function auth(req, res, next){
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send('Access Denied');
    }
    try{
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN)
        req.user = verified
        next()
    } catch{
        res.send("Invalid Token")
    }
    
}

router.get('/list', auth, async (req, res) => {
    const user = await User.findOne({
        '_id':req.user.id
    });

    res.json(user.shoppinglist);
})

router.post('/add', auth, async (req, res) => {
    const user = await User.findOne({
        '_id':req.user.id
    });

    const shoppinglist = [...user.shoppinglist, req.body.item]
    
    await User.updateOne({
        "_id" : req.user.id
    }, {$set: {"shoppinglist" : shoppinglist}}
    )

    res.json(shoppinglist);
})


router.post('/delete', auth, async (req, res) => {
    const user = await User.findOne({
        '_id':req.user.id
    });
    const shoppinglist = user.shoppinglist.filter(item => item !== req.body.item)

    await User.updateOne({
        "_id" : req.user.id
    }, {$set: {"shoppinglist" : shoppinglist}}
    )
    
    res.json(shoppinglist);
})

module.exports = router;
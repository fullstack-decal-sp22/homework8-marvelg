const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const mongoose = require('mongoose')
const user = require('./models/user')

const url = "mongodb://127.0.0.1:27017/auth-hw"

const InitiateServer = async () => {
    try {
        await mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Connected to DB!')
    }
    catch(err) {
        console.log(err);
    }
}
InitiateServer()

const userRoute = require("./routes/user")
const shopRoute = require("./routes/shop")

const db = mongoose.connection

const port = process.env.PORT || 4000

app.use('/user', userRoute)

app.use('/shop', shopRoute)

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
  });
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
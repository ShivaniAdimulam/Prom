const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose')
const router = require('./router/router')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));




mongoose.connect('mongodb+srv://ShivaniAdimulam:6YVITVtB4JZQZ2Qb@cluster0.vhsq6.mongodb.net/shivaniadi17?retryWrites=true&w=majority',{useNewUrlParser:true})
.then( () =>console.log("mongoose is contected..."))
.catch( err => console.log(err))

app.use('/', router)


app.listen(process.env.PORT || 3000, function() {
    console.log(" Express App Running on port " +  (process.env.PORT || 3000));
});
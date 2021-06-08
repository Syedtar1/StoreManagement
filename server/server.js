const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const apiRoutes = require('./routes/api');

const app=express();

app.use(express.json());
app.use(express.urlencoded({
    extended:true  
})); 


app.use(cors())

app.use('/api',apiRoutes);

app.get('/', (req,res) =>{

    res.send(`hello from server which is running on ${PORT}`);
});

app.listen(PORT, ()=>{

    console.log(`Server running on localhost:${PORT}`);

});
const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const mongoose = require("mongoose");

//Import the models
const users = require("../Models/user");
const distributorInventory = require("../Models/distributorinventory");
const saleOrder = require("../Models/saleorder");
const customerBilling = require("../Models/customerbilling");
const inventory = require('../Models/inventory');
const product=require('../Models/productmaster');

const db =
  "mongodb+srv://<UserName>:<password>@cluster0.kjen7.mongodb.net/StoreManagement?retryWrites=true&w=majority";

mongoose.connect(db, (err) => {
  if (err) {
    res.status(401).send({
      message: err,
      statusCode: 401,
    });
  } else {
    console.log("Connected to Mongodb..");
  }
});

function verifyToken(req, res, next)
{
if(!req.headers.authorization)
{
return res.status(401).send('unauthorized request');
}

let token =req.headers.authorization.split(' ')[1]
if(token ==='null')
{
return res.status(401).send('unauthorized request');
}

let payload =jwt.verify(token, 'secretKey');
if(!payload)
{
return res.status(401).send('unauthorized request');
}
req._id=payload.subject
next();
}

router.get("/", (req, res) => {
  res.send("from API route");
});

//Register user API
router.post("/register", (req, res) => {
  let userData = req.body;
  let user = new users(userData);
  user.save((err, result) => {
    if (err) {
      res.status(401).send({
        message: err,
        statusCode: 401,
      });
    } 
    else {
        let payload = {subject:result._id};
        let token = jwt.sign(payload, 'secretKey');
      res.status(200).send({token});
    }
  });
});

//Get all user Profile API
router.get("/profile", verifyToken,(req, res) => {

  users.find({}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//Get all user Profile API
router.get("/profileBy/:id", verifyToken,(req, res) => {
  const { id } = req.params;
  users.find({_id:id}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});


//Update Profile API
router.put("/profile", verifyToken,(req, res) => {
  let userData = req.body;
 
  users.updateOne(
    {_id:userData._id},
    {
      firstname:userData.firstname,
      lastname:userData.lastname,
      email:userData.email
    },
    (err, result) => {
      if (err) {
        res.status(400).send({
        message: err,
          statusCode: 400,
        });
      } else {
       
        res.status(200).send(result);
      }
    }
  );
});

//Reset User Password API
router.put("/resetpassword", verifyToken,(req, res) => {
  let userData = req.body;
 
  users.updateOne(
    {_id:userData._id},
    {
      password:userData.password
    },
    (err, result) => {
      if (err) {
        res.status(400).send({
        message: err,
          statusCode: 400,
        });
      } else {
       
        res.status(200).send(result);
      }
    }
  );
});

//Lock/Unlock User API
router.put("/useraccess", verifyToken,(req, res) => {
  let userData = req.body;
 
  users.updateOne(
    {_id:userData._id},
    {
      isactive:userData.isactive
    },
    (err, result) => {
      if (err) {
        res.status(400).send({
        message: err,
          statusCode: 400,
        });
      } else {
       
        res.status(200).send(result);
      }
    }
  );
});




//Get logged in user profile API
router.get("/Order/:id", verifyToken,(req, res) => {
  const { id } = req.params;

  users.find({_id:id}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//Login User API
router.post("/login", (req, res) => {
  let userData = req.body;

  users.findOne({ email: userData.email}, (err, userResult) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      
      if (!userResult) {
        res.status(401).send({
        message: "Invalid email",
          statusCode: 401,
        });
      } else {
        if (!userResult.isactive) {
          res.status(401).send({
            message: "Account is inactive.",
            statusCode: 401,
          });
        } else if (userResult.password !== userData.password) {
          res.status(401).send({
            message: "invalid pasword.",
            statusCode: 401,
          });
        } else {
          let payload = {subject:userResult._id};
          let token = jwt.sign(payload, 'secretKey');
          res.status(200).send({token,userResult});
        }
      }
    }
  });
});

//Get Distributor Inventry API
router.get("/distributorinventory", verifyToken,(req, res) => {
  distributorInventory.find({}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//Post Distributor Inventry API
router.post("/distributorinventory",verifyToken ,(req, res) => {
  let distributorinventoryData = req.body;
  let distributorInventoryOne = new distributorInventory(
    distributorinventoryData
  );
  distributorInventoryOne.save((err, result) => {
    if (err) {
      res.status(400).send({
        message:err, 
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//Get inventory API
router.get("/inventory",verifyToken ,(req, res) => {
  inventory.find({}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//Put Inventry
router.put("/inventory", verifyToken,(req, res) => {
  let InventoryData = req.body;
 
  inventory.updateOne(
    {_id:InventoryData._id},
    {
      instock:InventoryData.instock
    },
    (err, result) => {
      if (err) {
        res.status(400).send({
        message: err,
          statusCode: 400,
        });
      } else {
       
        res.status(200).send(result);
      }
    }
  );
});

//Get Order API
router.get("/Order", verifyToken,(req, res) => {
  
  saleOrder.find({}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});
//Get Order by ID API
router.get("/Order/:id", verifyToken,(req, res) => {
  const { id } = req.params;

  saleOrder.find({_id:id}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//post order API
router.post("/order", verifyToken,(req, res) => {
  let orderData = req.body;
  let saleOrderPostData = new saleOrder(orderData);

  let customerBillingObject = {
    customername: saleOrderPostData.customername,
    contactnumber: saleOrderPostData.customernumber,
    email: saleOrderPostData.email,
    lastbillingdate: new Date(),
    lastbillamount:orderData.discountedPrice,
  };

  let customerBillingData = new customerBilling(customerBillingObject);

  customerBillingData.save((err, result) => {
    if (!err) {
        saleOrderPostData.save((err1, result1) => {
        if (err1) {
          res.status(400).send({
            message:err1,
            statusCode: 400,
          });
        } else {
          res.status(200).send(result1);
        }
      });
    } else {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    }
  });
});

//update order API
router.put("/order", verifyToken,(req, res) => {
  let orderData = req.body;
 
  saleOrder.updateOne(
    {_id:orderData._id},
    {
      customername: orderData.customername,
      contactnumber: orderData.contactnumber,
      email: orderData.email,
      productname: orderData.productname,
      manufacturer: orderData.manufacturer,
      discount: orderData.discount,
      price: orderData.price,
    },
    (err, result) => {
      if (err) {
        res.status(400).send({
        message: err,
          statusCode: 400,
        });
      } else {
       
        res.status(200).send(result);
      }
    }
  );
});

//Delete order API
router.delete("/order/:id", verifyToken,(req, res) => {
  const { id } = req.params;

  saleOrder.findOneAndDelete({ _id: id }, (err, result) => {
    if (err) {
      res.status(400).send({
        message: err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});


router.get('/product',verifyToken,(req, res) => {

  product.find({}, (err, result) => {
    if (err) {
      res.status(400).send({
        message:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});



module.exports = router;

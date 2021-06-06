const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Import the models
const users = require("../Models/user");
const distributorInventory = require("../Models/distributorinventory");
const saleOrder = require("../Models/saleorder");
const customerBilling = require("../Models/customerbilling");

const db =
  "mongodb+srv://Sa-user1:SA1234567@cluster0.kjen7.mongodb.net/StoreManagement?retryWrites=true&w=majority";

mongoose.connect(db, (err) => {
  if (err) {
    res.status(401).send({
      errorMessage: err,
      statusCode: 401,
    });
  } else {
    console.log("Connected to Mongodb..");
  }
});

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
        errorMessage: err,
        statusCode: 401,
      });
    } else res.status(200).send(result);
  });
});

//Login User API
router.post("/login", (req, res) => {
  let userData = req.body;

  users.findOne({ email: userData.email }, (err, result) => {
    if (err) {
      res.status(400).send({
        errorMessage:err,
        statusCode: 400,
      });
    } else {
      if (!result) {
        res.status(401).send({
        errorMessage: "Invalid email",
          statusCode: 401,
        });
      } else {
        if (!result.isactive) {
          res.status(401).send({
            errorMessage: "Account is inactive.",
            statusCode: 401,
          });
        } else if (result.password !== userData.password) {
          res.status(401).send({
            errorMessage: "invalid pasword.",
            statusCode: 401,
          });
        } else {
          res.status(200).send(result);
        }
      }
    }
  });
});

//Get Distributor Inventry API
router.get("/distributorinventorylist", (req, res) => {
  distributorInventory.find({}, (err, result) => {
    if (err) {
      res.status(400).send({
        errorMessage:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//Post Distributor Inventry API
router.post("/distributorinventory", (req, res) => {
  let distributorinventoryData = req.body;
  let distributorInventoryOne = new distributorInventory(
    distributorinventoryData
  );
  distributorInventoryOne.save((err, result) => {
    if (err) {
      res.status(400).send({
        errorMessage:err, 
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

//Get Order API
router.get("/Order", (req, res) => {
  saleOrder.find({}, (err, result) => {
    if (err) {
      res.status(400).send({
        errorMessage:err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});


//post order API
router.post("/order", (req, res) => {
  let orderData = req.body;
  let saleOrderPostData = new saleOrder(orderData);

  let customerBillingObject = {
    customername: saleOrderPostData.customername,
    contactnumber: saleOrderPostData.customernumber,
    email: saleOrderPostData.email,
    lastbillingdate: new Date(),
    lastbillamount:saleOrderPostData.price,
  };

  let customerBillingData = new customerBilling(customerBillingObject);

  customerBillingData.save((err, result) => {
    if (!err) {
        saleOrderPostData.save((err1, result1) => {
        if (err1) {
          res.status(400).send({
            errorMessage:err1,
            statusCode: 400,
          });
        } else {
          res.status(200).send(result1);
        }
      });
    } else {
      res.status(400).send({
        errorMessage:err,
        statusCode: 400,
      });
    }
  });
});

//update order API
router.put("/order", (req, res) => {
  let orderData = req.body;
  
  saleOrder.findByIdAndUpdate(
    orderData._id,
    {
      customername: orderData.customername,
      contactnumber: orderData.customernumber,
      email: orderData.email,
      productname: orderData.productname,
      manufacturer: orderData.manufacturer,
      discount: orderData.discount,
      price: orderData.price,
    },
    (err, result) => {
      if (err) {
        res.status(400).send({
        errorMessage: err,
          statusCode: 400,
        });
      } else {
        res.status(200).send(result);
      }
    }
  );
});

//Delete order API
router.delete("/order", (req, res) => {
  let orderData = req.body;

    console.log(orderData);

  saleOrder.deleteOne({ _id: orderData._id }, (err, result) => {
    if (err) {
      res.status(400).send({
        errorMessage: err,
        statusCode: 400,
      });
    } else {
      res.status(200).send(result);
    }
  });
});

module.exports = router;

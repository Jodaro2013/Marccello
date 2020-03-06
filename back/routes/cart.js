const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  User,
  Product,
  Purchase,
  ProductPurchase,
  Order
} = require("../models");

/*
router.use("/", function(req, res, next) {
  User.findByPk(1).then(data => {
    req.user = data;
    next();
  });
});*/

function isLoggedIn(req,res,next) {
  if (req.isAuthenticated()) next();
  else res.status(401).send({msg: "Anda a loguearte"})
}

router.use("/", isLoggedIn);

router.post("/:id", function(req, res) {
  Order.create({ productId: req.params.id, userId: req.user.id }).then(data => {
    res.status(201).send({ msg: "Añadido correctamente" });
  });
});

router.get("/", function(req, res) {
  req.user.getCart().then(data => {
    res.send(data.products.sort((a,b)=> (new Date(a)) - (new Date(b))));
  });
});

//id de la orden

router.put("/:id", function(req, res) {
  Order.findOne({
    where: { userId: req.user.id, productId: req.params.id }
  }).then(orden => {
    orden.amount = Number(orden.amount) + Number(req.body.amount);
    if (orden.amount < 1) {
      orden.amount = 1;
    }
    orden.save();
    res.send({ msg: "Modificado perfectamente", result: orden.amount });
  });
});

router.delete("/:id", function(req, res) {
  Order.findOne({
    where: { userId: req.user.id, productId: req.params.id }
  }).then(data => {
    data.destroy().then(() => {
      res.send({ msg: "Eliminado correctamente" });
    });
  });
});

module.exports = router;

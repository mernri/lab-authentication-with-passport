const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

// GET ROUTE - SIGNUP
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

// POST ROUTE - SIGNUP
passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // cas d'erreur 1 : si username ou password vides
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  // cas d'erreur 2 : si le username existe déjà dans la base
  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          message: "The username already exists"
        });
        return;
      }

      // crypte le mot de passe
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        username,
        password: hashPass
      });

      // Enregistre le nouveau user dans la DB avec user et mdp crypté
      newUser.save(err => {
        if (err) {
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error);
    });
});

// GET ROUTE - SIGNUP
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

// POST ROUTE - SIGNUP
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = passportRouter;

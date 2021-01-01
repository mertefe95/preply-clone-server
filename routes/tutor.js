const express = require("express");
const Tutor = require("../models/tutor");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();



router.get("/", async (req, res) => {
  const tutors = await Tutor.find({});

  if (!tutors) {
    return res.status(400).send({ msg: "No tutors found." });
  }

  return res.status(200).send(tutors);
});

router.get("/:id", async (req, res) => {
  const tutor = Tutor.findById(req.params.id);

  if (!tutor) {
    return res.status(400).send({ msg: "No tutor found with the id." });
  }

  return res.status(200).send(tutor);
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body; 

  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

  if (!email) {
    return res
      .status(400)
      .send({ msg: "Please enter your email." })
  } else if (!validator.isEmail(email)) {
    return res
      .status(400)
      .send({ msg: "Please enter a valid email." })
  } else if (!password) {
    return res
      .status(400)
      .send({ msg: "Please enter your password." })
  } else if (password.length < 7) {
    return res
      .status(400)
      .send({ msg: "Please enter a password that is more than 7 characters length." })
  } else if (!digit.test(password)) {
    return res 
      .status(400)
      .send({ msg: "Please enter a password that has at least a number." })
  } else if (!upperLetter.test(password)) {
    return res
      .status(400)
      .send({ msg: "Please enter an at least one uppercase letter in your password." })
  }

  try {
    const tutorExistsByEmail = await Tutor.findOne({ email: email })
    if (tutorExistsByEmail) {
      return res
        .status(400)
        .send({ msg: "Tutor with this email already existing." })
    }

    const theSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, theSalt)

    const newTutor = {
      email,
      password: hashedPassword
    }

    const registerTutor = new Tutor(newTutor)
    await registerTutor.save();

    const token = await jwt.sign({ id: registerTutor._id }, process.env.SECRET_TOKEN)

    return res
      .status(200)
      .json({ token,
        user: {
          id: registerTutor._id,
          email: registerTutor.email
        }
      })
  } catch (e) {
    return res 
      .status(500)
      .send(e)
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return res 
      .status(400)
      .send({ msg: "Please enter your email." })
  } else if (!password) {
    return res 
      .status(400)
      .send({ msg: "Please enter your password."})
  }

  try {
    const loginTutor = Tutor.findOne({ email })

    if (!loginTutor) {
      return res
        .status(400)
        .send({ msg: "User with this email does not exist." })
    }

    const comparePassword = await bcrypt.compare(password, loginTutor.password)

    if (!comparePassword) {
      return res
        .status(400)
        .send({ msg: "Wrong Password." })
    }

    const token = await jwt.sign({ id: loginTutor.id}, process.env.SECRET_TOKEN)

    return res
      .status(200)
      .send({ token,
      user: {
        id: loginTutor._id,
        email: loginTutor.email
      }})

  } catch (e) {
    return res  
      .status(500)
      .send(e)
  }

})


router.delete("/:id", async (req, res) => {
  const deletedTutor = Tutor.findByIdAndDelete(req.params.id);

  if (!deletedTutor) {
    return res.status(400).send({ msg: "Tutor not found, deletion is failed." });
  }

  return res.status(200).send(deletedTutor);
});

module.exports = router;

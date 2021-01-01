const express = require("express");
const router = new express.Router();
const Student = require("../models/student");
const { sendForgotEmail, sendWelcomeEmail, sendVerificationEmail } = require("../utils/account");

router.get("/", async (req, res) => {
  const students = Student.find({});

  if (!students) {
    return res.status(400).send({ msg: "Students not found. " });
  }

  return res.status(200).send(students);
});

router.get("/:id", async (req, res) => {
  const student = Student.findById(req.params.id);

  if (!student) {
    return res.status(400).send({ msg: "Student not found" });
  }

  return res.status(200).send(student);
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  
  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

  if (!email) {
    return res.status(400).send({ msg: "Please enter your email." })
  } else if (!password) {
    return res.status(400).send({ msg: "Please enter your passwod." })
  } else if (!validator.isEmail(email)) {
    return res.status(400).send({ msg: "Please enter a valid email." })
  } else if (password.length < 7) {
    return res.status(400).send({ msg: "Password must be more than 7 characters length." })
  } else if (!digit.test(password)) {
    return res.status(400).send({ msg: "Please enter at least a number in your password." })
  } else if (!upperLetter.test(password)) {
    return res.status(400).send({ msg: "Please enter at least an uppercase letter in your password." })
  }

  const existingStudent = Student.findOne({ email: email})
  if (existingStudent) {
    return res.status(400).send({ msg: "An user is already existing with this email." })
  }

  const theSalt = await genSalt(10);
  const hashedPassword = await bcrypt.hash(password, theSalt);

  const newStudent = {
    email,
    password: hashedPassword
  }

  const registerStudent = new Student(newStudent);
  registerStudent.save();

  // sendWelcomeEmail()
  // sendVerificationEmail()

  const token = jwt.sign({ id: user.id }, process.env.SECRET_TOKEN );

  return res
    .status(200)
    .json({ token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }})
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if(!email) {
    return res
      .status(400)
      .send({ msg: "Please enter your email." })
  } else if (!password) {
    return res  
      .status(400)
      .send({ msg: "Please enter your password." })
  }

  const student = Student.findOne({ email })
  if (!student) {
    return res
      .status(400)
      .send({ msg: "User with this email address doesn't exist." })
  }

  const loginStudent = await bcrypt.compare(password, student.password)
  if (!loginStudent) {
    return res 
      .status(400)
      .send({ msg: "Wrong password." })
  }

  return res
    .status(200)
    .json({ token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }})

})

router.delete("/:id", async (req, res) => {
  const deletedStudent = Student.findByIdAndDelete(req.params.id);

  if (!deletedStudent) {
    return res.status(400).send({ msg: "Student not found. Deleted is failed." });
  }

  return res.status(200).send(deletedStudent);
});

module.exports = router;

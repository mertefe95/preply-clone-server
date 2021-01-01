const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

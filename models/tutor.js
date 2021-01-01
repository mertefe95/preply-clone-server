const mongoose = require("mongoose");
const { Schema } = mongoose;

const tutorSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
}
);


const Tutor = mongoose.model("Tutor", tutorSchema);

module.exports = Tutor;
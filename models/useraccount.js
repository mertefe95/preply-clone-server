const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProfile = new Schema({
  profileImage: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  timeZone: {
    type: String,
    required: true
  },
  socialNetworks: {
    type: String,
    required: true
  }
})
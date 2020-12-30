const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());


const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB connection has been established.")
});

const uri = process.env.ATLAS_URI;


mongoose.connect(uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`${PORT} is running on.`)
})
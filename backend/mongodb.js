const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const predictionSchema = new mongoose.Schema({
  username: String,
  input_data: [Number],
  prediction: Number,
  message: String,
  timestamp: Date,
});

const collection = mongoose.model('Predictions', predictionSchema);

module.exports = collection;

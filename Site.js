


let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
});

const siteSchema = new mongoose.Schema({
  url: String,
  shorturl: Number
});

module.exports = mongoose.model("Site", siteSchema);





const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  postId: String,
  subject: String,
  link: String,
});

module.exports = Chan = mongoose.model("post", postSchema);

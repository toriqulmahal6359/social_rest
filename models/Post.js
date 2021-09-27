const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {type: String, require: true},
    desc: {type: String, max: 500},
    image: {type: String, default: ""},
    likes: {type: Array, default: []},
    hearts: {type: Array, default: []},
}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
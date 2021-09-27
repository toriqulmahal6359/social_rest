const Post = require("../models/Post");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

//create a post
router.post("/", async (req, res) => {
    try{
        const post = new Post(req.body);
        const savePost = await post.save();
        res.status(200).json(savePost);
    }catch(err){
        res.status(500).json(err);
    }
});

//edit a post
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId == req.body.userId){
            const updatedPost = await post.updateOne({ $set: req.body });
            res.status(200).json(updatedPost);
        }else{
            res.status(403).json("You can Update only Your Post");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//delete a post
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId == req.body.userId){
            await post.deleteOne(req.params.id);
            res.status(200).json("Your Post has been Deleted");
        }else{
            res.status(403).json("You can only Delete your Post");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//like or dislike a post
router.put("/:id/likes", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try{
        if(post.hearts.includes(req.body.userId) || !post.likes.includes(req.body.userId)){
            const likes = await post.updateOne({ $push: {likes: req.body.userId} });
            const unhearts = await post.updateOne({ $pull: {hearts: req.body.userId} });
            res.status(200).json("the post is given a Like and an unheart"); 
        }else{
            const dislikes = await post.updateOne({ $pull: {likes: req.body.userId} });
            // const unhearts = await post.updateOne({ $pull: {hearts: req.body.userId} });
            res.status(200).json("the post is neither given Like nor a Heart"); 
        }
    }catch(err){
        res.status(500).json(err);
    }
})

//give heart in a post
router.put("/:id/hearts", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try{
        if(!post.hearts.includes(req.body.userId) || post.likes.includes(req.body.userId)){
            const hearts = await post.updateOne({ $push: {hearts: req.body.userId} });
            const dislikes = await post.updateOne({ $pull: {likes: req.body.userId} });
            res.status(200).json("the post is given a Heart and a dislike"); 
        }else{
            const unhearts = await post.updateOne({ $pull: {hearts: req.body.userId} });
            // const dislikes = await post.updateOne({ $pull: {likes: req.body.userId} });
            res.status(200).json("the post is neither given Like nor a Heart"); 
        }
    }catch(err){
        res.status(500).json(err);
    }
}) 

//get a post
router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
});

//get timeline of post
router.post("/timeline/all", async (req, res) => {
    try{
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );
        res.json(userPosts.concat(...friendPosts));
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;
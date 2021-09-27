const User = require("../models/User");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//Update user
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(err){
                res.status(403).json(err);
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account Has been Updated");
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can Update only your account");
    }
});

//Delete User
router.delete("/:id", async (req, res) => {
    if(req.params.id === req.body.userId || req.body.isAdmin){
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }catch(err){
            res.status(500).json(err)
        }
    }
})

//get an user
router.get("/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})

//follow an user
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push: {followers: req.body.userId} });
                await currentUser.updateOne({ $push: {followings: req.params.id} });
                res.status(200).json("You followed this user");
            }else{
                res.status(403).json("You already Followed this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't Follow Yourself");
    }

});

//unfollow an user
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {followers: req.body.userId} });
                await currentUser.updateOne({ $pull: {followings: req.params.id} });
                res.status(200).json("You unfollowed this user");
            }else{
                res.status(403).json("You already Unfollowed this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You can't Unfollow Yourself");
    }

});

module.exports = router;
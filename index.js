const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

//env
dotenv.config();

//create database
mongoose.connect(process.env.MONGO_URL, {useCreateIndex:true, useNewUrlParser:true, useFindAndModify:true, useUnifiedTopology:true});
const connection = mongoose.connection
connection.once('open', () => {
    console.log("Connection Established Successfully");
}).catch(err => {
    console.log("Connection Failed");
})

//built-in middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//server listening From Express
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running From ${PORT}`);
}) 
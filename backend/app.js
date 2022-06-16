const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const { errorHandler } = require('./middlewares/errorMiddleware')

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/package", require("./routes/packageRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));

app.use(errorHandler);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});




const port = process.env.PORT

mongoose
    .connect(process.env.MONGO_URI, {})
    .then((result) => {
        console.log("connected to the db");
        app.listen(port, () => {
            console.log(`app listening on port ${port}...`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
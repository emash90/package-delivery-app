const express = require('express')
const app = express()
const path = require("path");
const http = require('http')
const { Server } =require('socket.io')

const server = http.Server(app)
require('dotenv').config()
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const { errorHandler } = require('./middlewares/errorMiddleware')

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
})
io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected`)
    socket.on("statusSet", (data) => {
        console.log(data)
        socket.emit("received status", data)
        socket.broadcast.emit("new status", data)
    })

})

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/package", require("./routes/packageRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
} else {
    app.get("/", (req, res) => {
        res.send('set to "production"');
    });
}
app.get("*", (req, res) =>
    res.sendFile(
        path.resolve(__dirname, "../", "client", "build", "index.html")
    )
);
//app.use(errorHandler);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});




const port = process.env.PORT || 5050

mongoose
    .connect(process.env.MONGO_URI, {})
    .then((result) => {
        console.log("connected to the db");
        server.listen(port, () => {
            console.log(`server listening on port ${port}...`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
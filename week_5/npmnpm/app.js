const express = require("express");
const path = require("path");

const app = express();
app.set("port", process.env.PORT || 3000);

app.use((req, res, next) => {
    console.log("Excuted in all requests.");
    next();
});

app.get(
    "/",
    (req, res, next) => {
        // res.send("Hello Express!");
        res.sendFile(path.join(__dirname, "/index.html"));
        console.log("Executed in GET request");
        next();
    },
    (req, res) => {
        throw new Error("Error will be send to error handling middleware");
    }
);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
    console.log("listening in ", app.get("port"), "port");
});

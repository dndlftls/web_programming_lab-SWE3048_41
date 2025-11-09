const express = require("express");
const path = require("path");

const app = express();
app.set("port", process.env.PORT || 3000);
app.use("/", express.static(path.join(__dirname, "week_4")));

app.listen(app.get("port"), () => {
    console.log("listening in ", app.get("port"), "port");
});

module.exports = app;

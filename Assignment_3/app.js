const express = require("express");
const path = require("path");

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);
app.use("/", express.static(path.join(__dirname, "public")));

app.post("/login", (req, res) => {
    const body = req.body;
    console.log(body);
    if (body["userid"] == "admin" && body["userpassword"] == "1234") {
        res.status(200).send("Login Success");
    } else {
        res.status(401).send("Login failed");
    }
});

app.get("/signup", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "public", "signup.html"));
});

app.post("/signup", (req, res) => {
    const body = req.body;
    console.log("Signup request body:", body);

    const { userid, userpassword, userpasswordcheck } = body;

    if (
        userid &&
        userpassword &&
        userpasswordcheck &&
        userpassword === userpasswordcheck
    ) {
        // 여기서는 DB를 쓰지 않고 비밀번호 일치만 확인
        res.status(200).send("signup success");
    } else {
        res.status(401).send("signup failed");
    }
});

app.listen(app.get("port"), () => {
    console.log("listening in ", app.get("port"), "port");
});

module.exports = app;

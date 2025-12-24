const loginbtn = document.getElementById("login-btn");
let id = document.getElementById("id");
let pw = document.getElementById("pwd");

loginbtn.addEventListener("click", function () {
    if (id.value == "admin" && pw.value == "1234") {
        alert("로그인 성공");
    } else {
        alert("로그인 실패");
    }
});

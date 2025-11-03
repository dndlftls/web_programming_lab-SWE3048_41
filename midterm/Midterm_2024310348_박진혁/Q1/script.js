const handleClick = () => {
    // Todo : Changing Background Color
    document.body.style.backgroundColor = "red";
    alert("Background color will change!");
};

const btn = document.getElementById("clickme");
// TODO : Add Event Listener
btn.addEventListener("click", handleClick);

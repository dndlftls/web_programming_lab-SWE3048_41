document.addEventListener("DOMContentLoaded", () => {
    // .Calculator button = the only button inside your form/card
    const button = document.querySelector(".Calculator button");
    if (button) button.addEventListener("click", calculateBMI);
});

function calculateBMI() {
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value) / 100;

    // TODO : Calculate BMI and use displayResult function to show the result.
    const bmi = weight / (height * height);
    displayResult(bmi);
}

function displayResult(bmi) {
    const resultDiv = document.getElementById("final-result");
    let category = "";

    // TODO : Display Result of BMI
    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal";
    } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
    } else {
        category = "Obese";
    }

    resultDiv.innerHTML = `Your BMI is ${bmi.toFixed(
        2
    )}. You are in the ${category} category.`;
}

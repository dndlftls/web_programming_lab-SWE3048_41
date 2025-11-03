const { odd, even } = require(".var.js");
const checkNumber = require(".func.js");

function checkStringOddorEven(str) {
    if (str.length % 2) {
        return odd;
    }

    return even;
}
console.log(checkNumber(10));
console.log(checkStringOddorEven("hello"));

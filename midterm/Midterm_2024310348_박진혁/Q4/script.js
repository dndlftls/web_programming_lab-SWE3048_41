document.getElementById("processBtn").addEventListener("click", function () {
    const input = document.getElementById("arrayInput").value.trim();
    arr = input.split(",").map(Number);
    console.log(arr);
    // TODO : Move zeros to end while maintaining order of non-zeros
    let nonZero; // TODO : Assign nonZero's value
    nonZero = arr.filter((num) => num !== 0);
    console.log(nonZero);
    let zeros; // TODO : Assign zeros' value
    zeros = arr.filter((num) => num === 0);
    console.log(zeros);
    const result = [...nonZero, ...zeros];
    document.getElementById("resultBox").textContent = `[ ${result.join(
        ", "
    )} ]`;
});

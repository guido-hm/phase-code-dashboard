const addButton = document.getElementById("addButton");
const phasesContainer = document.getElementById("phasesContainer");

addButton.addEventListener("click", () => {
    const phaseName = prompt("Enter phase name:");
    const estimatedQuantity = parseFloat(prompt("Enter estimated quantity:"));
    const claimedQuantity = parseFloat(prompt("Enter claimed quantity:"));

    if (!isNaN(estimatedQuantity) && !isNaN(claimedQuantity)) {
        createPhase(phaseName, estimatedQuantity, claimedQuantity);
    } else {
        alert("Invalid input. Please enter valid numbers for estimated and claimed quantities.");
    }
});

function createPhase(phaseName, estimatedQuantity, claimedQuantity) {
    const phaseDiv = document.createElement("div");
    phaseDiv.className = "phase";

    const h2 = document.createElement("h2");
    h2.textContent = phaseName;

    const progressBar1 = createProgressBar((claimedQuantity / estimatedQuantity) * 100);

    phaseDiv.appendChild(h2);
    phaseDiv.appendChild(progressBar1);

    phasesContainer.appendChild(phaseDiv);
}

function createProgressBar(progressPercentage) {
    const progressBarDiv = document.createElement("div");
    progressBarDiv.className = "progress-bar";

    const progressDiv = document.createElement("div");
    progressDiv.className = "progress";
    progressDiv.style.width = `${Math.min(100, progressPercentage)}%`;

    progressBarDiv.appendChild(progressDiv);

    return progressBarDiv;
}

const addButton = document.getElementById("addButton");
const phasesContainer = document.getElementById("phasesContainer");

addButton.addEventListener("click", () => {
    const phaseName = prompt("Enter phase name:");
    const estimatedQuantity = parseFloat(prompt("Enter estimated quantity:"));
    const claimedQuantity = parseFloat(prompt("Enter claimed quantity:"));

    if (!isNaN(estimatedQuantity) && !isNaN(claimedQuantity)) {
        const budgets = {};
        // budgets.activity = { total: estimatedQuantity, current: claimedQuantity };
        
        const budgetTypes = ["labor", "equipment", "material", "subcontractor"];
        for (const budgetType of budgetTypes) {
            const totalBudget = parseFloat(prompt(`Enter total budget for ${budgetType} (optional):`));
            const currentCost = parseFloat(prompt(`Enter current cost for ${budgetType} (optional):`));
            
            if (!isNaN(totalBudget) && !isNaN(currentCost)) {
                budgets[budgetType] = { total: totalBudget, current: currentCost };
            }
        }

        createPhase(phaseName, estimatedQuantity, claimedQuantity, budgets);
    } else {
        alert("Invalid input. Please enter valid numbers for estimated and claimed quantities.");
    }
});

function createPhase(phaseName, estimatedQuantity, claimedQuantity, budgets) {
    const phaseDiv = document.createElement("div");
    phaseDiv.className = "phase";

    const h2 = document.createElement("h2");
    h2.textContent = phaseName;

    const activityProgressBar = createProgressBar((claimedQuantity / estimatedQuantity) * 100);

    const budgetDropdown = createBudgetDropdown(budgets);

    phaseDiv.appendChild(h2);
    phaseDiv.appendChild(activityProgressBar);
    phaseDiv.appendChild(budgetDropdown);

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

function createBudgetDropdown(budgets) {
    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "budget-dropdown";

    const budgetBars = [];

    for (const budgetName in budgets) {
        if (budgets.hasOwnProperty(budgetName)) {
            const budget = budgets[budgetName];
            budgetBars.push(createBudgetLabel(budgetName));
            budgetBars.push(createBudgetProgressBar(budgetName, budget.total, budget.current));
        }
    }

    const dropdownButton = document.createElement("button");
    dropdownButton.textContent = "Show Budgets";
    dropdownButton.className = "show-button";

    const budgetContainer = document.createElement("div");
    budgetContainer.className = "budget-container";

    dropdownButton.addEventListener("click", () => {
        budgetContainer.classList.toggle("show");
    });

    for (const bar of budgetBars) {
        budgetContainer.appendChild(bar);
    }

    dropdownDiv.appendChild(dropdownButton);
    dropdownDiv.appendChild(budgetContainer);

    return dropdownDiv;
}

function createBudgetLabel(budgetName) {
    const progressLabel = document.createElement("div");
    progressLabel.className = "optionl-progress-label";
    progressLabel.textContent = budgetName

    return progressLabel

}

function createBudgetProgressBar(budgetName, totalBudget, currentCost) {
    const progressBarDiv = document.createElement("div");
    progressBarDiv.className = "optional-progress-bar";

    const progressBarLabel = document.createElement("div");

    // progressBarLabel.textContent = budgetName;
    // progressBarLabel.className = "bar-label"

    const progressDiv = document.createElement("div");
    progressDiv.className = "progress";
    // progressDiv.textContent = budgetName

    if (totalBudget > 0) {
        const progressPercentage = (currentCost / totalBudget) * 100;
        progressDiv.style.width = `${Math.min(100, progressPercentage)}%`;
    } else {
        progressDiv.style.width = "0";
    }

    progressBarDiv.appendChild(progressDiv);

    return progressBarDiv;
}

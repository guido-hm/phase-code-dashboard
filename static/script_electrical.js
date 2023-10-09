const addButton = document.getElementById("addButton");
const phasesContainer = document.getElementById("phasesContainer");


document.addEventListener("DOMContentLoaded", function() {
    // Your code here will run once the DOM content is ready.
    callBackend();
});

function callBackend() {
    // Call Backend to Get Data. This will return an object. Each object will represent a different phase code and contain all the different pieces of data needed for each phase code
    fetch('api/data-electrical')
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP error. Status:');
            }
            return response.json();
        })
        .then(data => {
            // Iterate through data
            // In each iteration, get all the info needed to call createPhase
            // Call createPhase
            console.log(data);
            console.log("TEST")
            for (const key in data) {
                console.log(`${key}: ${data[key]}`);
                var phaseName = key
                var estimatedQuantity = data[key][0]
                var claimedQuantity = data[key][1]
        
                var budgetTypes = data[key][2]
        
                const budgets = {};
                
                for (const budgetType in budgetTypes) {
                    const totalBudget = data[key][3][budgetType];
                    const currentCost = data[key][4][budgetType];
                    
                    budgets[budgetTypes[budgetType]] = { total: totalBudget, current: currentCost };
                }
        
                createPhase(phaseName, estimatedQuantity, claimedQuantity, budgets, budgetTypes);
        
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        })    

}

function createPhase(phaseName, estimatedQuantity, claimedQuantity, budgets, budgetTypes) {
    const phaseDiv = document.createElement("div");
    phaseDiv.className = "phase";

    const h2 = document.createElement("h2");
    h2.textContent = phaseName;

    // Create Activity Progress Bar
    const activityProgress = ((claimedQuantity / estimatedQuantity) * 100).toFixed(2)
    const activityProgressBar = createProgressBar(activityProgress);
    // Color Acitivty Progress Bar
    activityProgressBar.getElementsByClassName("progress").item(0).classList.add("progress-activity");


    // Create Cost Progress Bar
    var totalBudget = 0;
    var currentCost = 0;
    for (const budgetType of budgetTypes) {
        totalBudget += budgets[budgetType].total;
        currentCost += budgets[budgetType].current;
    }
    const activityCost = ((currentCost / totalBudget) * 100).toFixed(2)
    const activityCostBar = createProgressBar(activityCost);
    // Color Cost Progress Bar
    const progressDiv = activityCostBar.getElementsByClassName("progress").item(0)
    moneyProgressBarColorLogic(progressDiv, currentCost, totalBudget, activityProgress)

    const budgetDropdown = createBudgetDropdown(budgets, activityProgress);

    phaseDiv.appendChild(h2);
    phaseDiv.appendChild(activityProgressBar);
    phaseDiv.appendChild(activityCostBar);
    phaseDiv.appendChild(budgetDropdown);

    phasesContainer.appendChild(phaseDiv);
}

function createProgressBar(progressPercentage) {
    const progressBarDiv = document.createElement("div");
    progressBarDiv.className = "progress-bar";

    const progressDiv = document.createElement("div");
    progressDiv.className = "progress";
    progressDiv.style.width = `${Math.min(100, progressPercentage)}%`;

    const percentDiv = document.createElement("div");
    percentDiv.className = "percent";
    percentDiv.textContent = progressPercentage+"%";
    progressBarDiv.appendChild(percentDiv);

    progressBarDiv.appendChild(progressDiv);

    return progressBarDiv;
}

function createBudgetDropdown(budgets, activityProgress) {
    const dropdownDiv = document.createElement("div");
    dropdownDiv.className = "budget-dropdown";

    const budgetBars = [];

    for (const budgetName in budgets) {
        if (budgets.hasOwnProperty(budgetName)) {
            const budget = budgets[budgetName];
            budgetBars.push(createBudgetLabel(budgetName));
            budgetBars.push(createBudgetProgressBar(budgetName, budget.total, budget.current, activityProgress));
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

function createBudgetProgressBar(budgetName, totalBudget, currentCost, activityProgress) {
    const progressBarDiv = document.createElement("div");
    progressBarDiv.className = "optional-progress-bar";

    const progressDiv = document.createElement("div");
    progressDiv.className = "progress";

    // Call color Logic function
    moneyProgressBarColorLogic(progressDiv, currentCost, totalBudget, activityProgress)

    var progressPercentageString = "N/A";   
    if (totalBudget > 0) {
        progressPercentageString = String( ((currentCost / totalBudget) * 100).toFixed(2))+"%";
        const progressPercentage = ((currentCost / totalBudget) * 100).toFixed(2);
        progressDiv.style.width = `${Math.min(100, progressPercentage)}%`;
    } else {
        progressDiv.style.width = "0";
    }

    const percentDiv = document.createElement("div");
    percentDiv.className = "percent";
    percentDiv.textContent = progressPercentageString;
    progressBarDiv.appendChild(percentDiv);

    progressBarDiv.appendChild(progressDiv);

    return progressBarDiv;
}

function moneyProgressBarColorLogic(progressBar, currentCost, totalBudget, activityProgress) {
    if (currentCost > totalBudget) {
        progressBar.classList.add("progress-money-blown");
    } else if ( (currentCost == totalBudget) && (activityProgress < 100) ) {
        progressBar.classList.add("progress-money-blown");
    } else if ((currentCost/totalBudget)*100 > activityProgress) {
        progressBar.classList.add("progress-money-concern");
    } else {
        progressBar.classList.add("progress-money");
    }
}





// TODO: Find a name to diffirintiate progress bar and actual progress. (the static bar and the dynamic one which grows on top of the static with color, depending on percent complete)
// Sometimes progress bar refers to static and proress refers to dynamic, but in some parts or function names, progress bar refers to the dynamic one which makes things confusing.
// Example of solution. Progress Bar Holder/Container and Progress Bar.


// TODO: Fix Bugs. When budget is 0/0, infinity is shown as answer
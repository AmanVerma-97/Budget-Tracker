let totalBudget = 0;
let entries = JSON.parse(localStorage.getItem("budgetEntries")) || [];

const form = document.getElementById("budget-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const budgetDisplay = document.getElementById("total-budget");
const entryList = document.getElementById("entry-list");

// Generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Format current date/time
function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString(); // Example: "6/21/2025, 2:30:15 PM"
}

// Recalculate total budget
function calculateBudget() {
    totalBudget = entries.reduce((acc, entry) => {
        return entry.type === "income"
            ? acc + entry.amount
            : acc - entry.amount;
    }, 0);

    if (totalBudget < 0) {
        budgetDisplay.classList.add("negative");
    } else {
        budgetDisplay.classList.remove("negative");
    }

    budgetDisplay.innerText = `Total Budget: ₹${totalBudget}`;
}

// Render all entries

function renderEntries() {
    entryList.innerHTML = ""; // clear list
    entries.forEach((entry) => {
        const li = document.createElement("li");
        li.classList.add(entry.type === "income" ? "income-tag" : "expense-tag");
        li.innerHTML = `
            <strong>${entry.description}</strong> - ₹${entry.amount} 
            <em>(${entry.type})</em> <br>
            <small>${entry.date}</small>
            <button onclick="deleteEntry('${entry.id}')">Delete</button>
        `;
        entryList.appendChild(li);
    });
}

// Add new entry
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (!description || isNaN(amount)) {
        alert("Please enter valid description and amount.");
        descriptionInput.value = "";
        amountInput.value = "";
        descriptionInput.focus();
        return;
    }

    const newEntry = {
        id: generateId(),
        description,
        amount,
        type,
        date: getCurrentDateTime()
    };

    entries.push(newEntry);
    localStorage.setItem("budgetEntries", JSON.stringify(entries));

    form.reset();
    calculateBudget();
    renderEntries();
});

// Delete entry by unique ID
window.deleteEntry = function (id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem("budgetEntries", JSON.stringify(entries));
    calculateBudget();
    renderEntries();
};

// Initial setup
calculateBudget();
renderEntries();

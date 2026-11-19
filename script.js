let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

const form = document.getElementById("transactionForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter valid details.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category
    };

    transactions.push(transaction);

    saveData();
    displayTransactions();
    form.reset();
});

function saveData() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function displayTransactions() {
    const list = document.getElementById("transactionList");

    list.innerHTML = "";

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(item) {

        if (item.type === "income") {
            totalIncome += item.amount;
        } else {
            totalExpense += item.amount;
        }

        const li = document.createElement("li");

        const info = document.createElement("div");
        info.className = "transaction-info";

        const name = document.createElement("strong");
        name.textContent = item.description;

        const category = document.createElement("small");
        category.textContent = item.category;

        info.append(name, category);

        const amount = document.createElement("span");
        amount.className =
            item.type === "income" ? "positive" : "negative";

        amount.textContent =
            (item.type === "income" ? "+ ₹" : "- ₹") +
            item.amount.toFixed(2);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            transactions = transactions.filter(
                transaction => transaction.id !== item.id
            );

            saveData();
            displayTransactions();
        });

        li.append(info, amount, deleteButton);
        list.appendChild(li);
    });

    if (transactions.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "No transactions yet.";
        list.appendChild(empty);
    }

    document.getElementById("income").textContent =
        "₹" + totalIncome.toFixed(2);

    document.getElementById("expense").textContent =
        "₹" + totalExpense.toFixed(2);

    document.getElementById("balance").textContent =
        "₹" + (totalIncome - totalExpense).toFixed(2);
}

displayTransactions();
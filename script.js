const transactionForm = document.getElementById("transactionForm");
const textInput = document.getElementById("textInput");
const amountInput = document.getElementById("amountInput");
const transactionList = document.getElementById("transactionList");
const incomeDisplay = document.getElementById("incomeDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");

// Load transactions if exist
let transactions = JSON.parse(localStorage.getItem("budget_transactions")) || [];

// Add transaction and refresh
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const desc = textInput.value.trim();
  const amount = +amountInput.value.trim();

  if (desc === "" || isNaN(amount)) {
    alert("Please enter valid description and amount.");
    return;
  }

  const transaction = {
    id: Date.now(),
    description: desc,
    amount: amount
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  updateSummary();

  textInput.value = "";
  amountInput.value = "";
});

// Render transaction list
function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach(tx => {
    const listItem = document.createElement("li");
    listItem.classList.add(tx.amount < 0 ? "expense" : "income");
    listItem.innerHTML = `
      ${tx.description} 
      <span>₹${tx.amount.toFixed(2)}</span>
      <button onclick="removeTransaction(${tx.id})">x</button>
    `;
    transactionList.appendChild(listItem);
  });
}

// Remove
function removeTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  updateLocalStorage();
  renderTransactions();
  updateSummary();
}

function updateSummary() {
  const amounts = transactions.map(tx => tx.amount);
  const income = amounts.filter(a => a > 0).reduce((a,b) => a + b, 0);
  const expense = amounts.filter(a => a < 0).reduce((a,b) => a + b, 0);

  incomeDisplay.textContent = `₹${income.toFixed(2)}`;
  expenseDisplay.textContent = `₹${Math.abs(expense).toFixed(2)}`;
  balanceDisplay.textContent = `₹${(income + expense).toFixed(2)}`;
}

// Store
function updateLocalStorage() {
  localStorage.setItem("budget_transactions", JSON.stringify(transactions));
}

// Initial load
renderTransactions();
updateSummary();

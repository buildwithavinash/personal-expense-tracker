let expenseList = document.querySelector(".expense-list");
let expenseForm = document.querySelector(".expense-form");
let expenseTitleInput = document.querySelector(".title-input");
let expenseAmountInp = document.querySelector(".amount-input");
let expenseCategory = document.querySelector(".category-options");
let addExpenseBtn = document.querySelector(".btn-add");
let cancelEditBtn = document.querySelector(".btn-cancelEdit");
let isEditMode = false;
let itemToEditID = null;

//* expenses : 

let expenses = [
  {
    id: Date.now(),
    title: "Eggs",
    amount: 345,
    category: "Food",
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  },
];

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (isEditMode) {
    let itemToEdit = expenses.find((ele) => {
      return ele.id === itemToEditID;
    });

    itemToEdit.title = expenseTitleInput.value.trim();
    itemToEdit.amount = parseFloat(expenseAmountInp.value);
    itemToEdit.category = expenseCategory.value;
    itemToEdit.date = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    isEditMode = false;
    itemToEditID = null;

    addExpenseBtn.textContent = "Add Expense";
  } else {
    let expense = {
      id: Date.now(),
      title: expenseTitleInput.value.trim(),
      amount: parseFloat(expenseAmountInp.value),
      category: expenseCategory.value,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    expenses.push(expense);
  }

  render(expenses);
  expenseForm.reset();
});

function render(expenses) {
  expenseList.innerHTML = "";

  document.querySelector(".empty-state").style.display =
    expenses.length === 0 ? "block" : "none";

  expenses.forEach((exp) => {
    let li = document.createElement("li");
    li.classList.add("expense-item");
    li.dataset.id = exp.id;

    li.innerHTML = `
        <div class="expense-item__left">
    <div class="expense-item__info">
      <h3 class="expense-title">${exp.title}</h3>
      <span class="expense-category category-food">${exp.category}</span>
    </div>

    <p class="expense-date">${exp.date}</p>
  </div>

  <div class="expense-item__right">
    <p class="expense-amount">₹${exp.amount}</p>

    <div class="expense-actions">
      <button class="btn btn-edit">Edit</button>
      <button class="btn btn-delete">Delete</button>
    </div>
  </div>
        `;

    expenseList.append(li);
  });
}

expenseList.addEventListener("click", function (e) {
  let target = e.target;
  let closestItem = target.closest(".expense-item");
  let clickedItemID = Number(closestItem.dataset.id);
  if (target.classList.contains("btn-delete")) {
    expenses = expenses.filter((ele) => {
      return ele.id !== clickedItemID;
    });

    render(expenses);
  }

  if (target.classList.contains("btn-edit")) {
    isEditMode = true;
    itemToEditID = clickedItemID;
    cancelEditBtn.classList.remove("hidden");
    let itemToEdit = expenses.find((ele) => {
      return ele.id === clickedItemID;
    });

    expenseTitleInput.value = itemToEdit.title;
    expenseAmountInp.value = itemToEdit.amount;
    expenseCategory.value = itemToEdit.category;

    addExpenseBtn.textContent = "Update Expense";
  }
});

cancelEditBtn.addEventListener("click", function (e) {
  // exit edit mode

  isEditMode = false;
  itemToEditID = null;

  // reset the form field

  expenseForm.reset();

  addExpenseBtn.textContent = "Add Expense";

  addExpenseBtn.disabled = false;

  cancelEditBtn.classList.add("hidden");
});

let expenseList = document.querySelector(".expense-list");
let expenseForm = document.querySelector(".expense-form");
let expenseTitleInput = document.querySelector(".title-input");
let expenseAmountInp = document.querySelector(".amount-input");
let expenseCategory = document.querySelector(".category-options");
let addExpenseBtn = document.querySelector(".btn-add");
let cancelEditBtn = document.querySelector(".btn-cancelEdit");
let clearBtn = document.querySelector(".btn-clear");
let isEditMode = false;
let itemToEditID = null;

//* expenses
let totalExpense = document.querySelector(".total__expense");
let highestExpense = document.querySelector(".highest__expense");

//* filters 
let categoryFilter = document.querySelector(".category__filtering--type")
let sortFilter = document.querySelector(".category__filtering--timeline");
let searchInput = document.querySelector(".search__input")
 let errMsg =  document.querySelector(".error__msg");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

render(expenses)




expenseForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if(expenseTitleInput.value === "" || expenseAmountInp.value === "" || expenseCategory.value === ""){
  
   errMsg.classList.remove("hidden")

   errMsg.textContent = "Please fill all the details";
   return;
  }else {
     errMsg.classList.add("hidden")
  }
  if (isEditMode) {
    let itemToEdit = expenses.find((ele) => {
      return ele.id === itemToEditID;
    });

    if(!itemToEdit) return;

    itemToEdit.title = expenseTitleInput.value.trim();
    itemToEdit.amount = parseFloat(expenseAmountInp.value);
    itemToEdit.category = expenseCategory.value;


    isEditMode = false;
    itemToEditID = null;

    addExpenseBtn.textContent = "Add Expense";
    cancelEditBtn.classList.add("hidden");
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
 localStorage.setItem("expenses", JSON.stringify(expenses));
expenseForm.reset();
});

function render(expenses) {
  expenseList.innerHTML = "";

  clearBtn.style.display = expenses.length === 0 ? "none" : "inline-block";

  document.querySelector(".empty-state").style.display =
    expenses.length === 0 ? "block" : "none";

  expenses.forEach(exp => {

    const li = document.createElement("li");
    li.classList.add("expense-item");
    li.dataset.id = exp.id;

    // LEFT SECTION
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("expense-item__left");

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("expense-item__info");

    const title = document.createElement("h3");
    title.classList.add("expense-title");
    title.textContent = exp.title;   // ✅ SAFE

    const category = document.createElement("span");
    category.classList.add("expense-category");

    const categoryType = exp.category.toLowerCase();
    if (categoryType === "food") category.classList.add("category-food");
    else if (categoryType === "travel") category.classList.add("category-travel");
    else if (categoryType === "shopping") category.classList.add("category-shopping");
    else category.classList.add("category-other");

    category.textContent = capitalize(exp.category); // ✅ SAFE

    infoDiv.append(title, category);

    const date = document.createElement("p");
    date.classList.add("expense-date");
    date.textContent = exp.date;

    leftDiv.append(infoDiv, date);

    // RIGHT SECTION
    const rightDiv = document.createElement("div");
    rightDiv.classList.add("expense-item__right");

    const amount = document.createElement("p");
    amount.classList.add("expense-amount");
    amount.textContent = `₹${exp.amount.toLocaleString("en-IN")}`;

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("expense-actions");

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-edit");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-delete");
    deleteBtn.textContent = "Delete";

    actionsDiv.append(editBtn, deleteBtn);
    rightDiv.append(amount, actionsDiv);

    li.append(leftDiv, rightDiv);

    expenseList.append(li);
  });

  showTotalExpense(expenses);
  showHighestExpense(expenses);
}



function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}


expenseList.addEventListener("click", function (e) {

  let target = e.target;

  if(!target.classList.contains("btn-delete") && !target.classList.contains("btn-edit")) {
    return;
  }
  let closestItem = target.closest(".expense-item");
  let clickedItemID = Number(closestItem.dataset.id);
  if (target.classList.contains("btn-delete")) {
    expenses = expenses.filter((ele) => {
      return ele.id !== clickedItemID;
    });

    render(expenses);
    localStorage.setItem("expenses", JSON.stringify(expenses));

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

function showTotalExpense(expenses) {
  let total = 0;

  expenses.forEach((exp) => {
    total = total + exp.amount;
  });

  totalExpense.textContent = `₹${total}`;
}

function showHighestExpense(expenses) {
  let highest = 0;

  expenses.forEach((ele) => {
    if (ele.amount >= highest) {
      highest = ele.amount;
    }
  });

  highestExpense.textContent = `₹${highest}`;
}

function updateDashboard(){
   const searchItem = searchInput.value.toLowerCase().trim();
   const selectedCategory = categoryFilter.value;
   const sortType = sortFilter.value;
   
   let duplicateData = [...expenses]
   let results = duplicateData.filter((exp)=>{

    if(searchItem !== ""){
      return exp.title.toLowerCase().includes(searchItem);
    }

    return selectedCategory === "all" || exp.category === selectedCategory;
   })

   results.sort((a, b) => {
    if (sortType === "latest") return b.id - a.id;
    if (sortType === "oldest") return a.id - b.id;
    if (sortType === "amount-high") return b.amount - a.amount;
    if (sortType === "amount-low") return a.amount - b.amount;
    return 0;
  });

  render(results);
}

searchInput.addEventListener("input", updateDashboard);
categoryFilter.addEventListener("change", updateDashboard);
sortFilter.addEventListener("change", updateDashboard);




if (clearBtn) {
  clearBtn.addEventListener("click", function () {
  
  const confirmClear = confirm("Delete all expenses?");

  if (!confirmClear) return;

  expenses = [];

  render(expenses);

  localStorage.removeItem("expenses");
});
}


// service worker

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW failed", err));
}

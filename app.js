let expenseList = document.querySelector(".expense-list");
let expenseForm = document.querySelector(".expense-form");
let expenseTitleInput = document.querySelector(".title-input");
let expenseAmountInp = document.querySelector(".amount-input");
let expenseCategory = document.querySelector(".category-options");
let addExpenseBtn = document.querySelector(".btn-add");
let cancelEditBtn = document.querySelector(".btn-cancelEdit");
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

    itemToEdit.title = expenseTitleInput.value.trim();
    itemToEdit.amount = parseFloat(expenseAmountInp.value);
    itemToEdit.category = expenseCategory.value;

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
    let categoryType = exp.category.toLowerCase();
    let categoryClass = null
    if(categoryType === "food"){
      categoryClass = "category-food";
    }else if(categoryType === "travel"){
      categoryClass = "category-travel";
    }else if(categoryType === "shopping"){
      categoryClass = "category-shopping";
    }else if(categoryType === "other"){
      categoryClass = "category-other";
    }


    li.innerHTML = `
        <div class="expense-item__left">
    <div class="expense-item__info">
      <h3 class="expense-title">${exp.title}</h3>
      <span class="expense-category ${categoryClass}">${exp.category}</span>
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

  showTotalExpense(expenses);
  showHighestExpense(expenses);
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

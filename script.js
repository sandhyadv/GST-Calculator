let categories = JSON.parse(localStorage.getItem("categories")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

// Function to create a new category
function createCategory() {
  // Retrieve input values
  const categoryName = document.getElementById("categoryName").value;
  const gstRate = parseFloat(document.getElementById("gstRate").value);

  // Validate input
  if (!categoryName || isNaN(gstRate) || gstRate < 0) {
    alert("Invalid input. Please provide valid data.");
    return;
  }

  // Add new category to the array and save to local storage
  categories.push({ name: categoryName, rate: gstRate });
  saveDataToLocalStorage();
  alert("Categories created", categories);

  // Reset form and navigate to categories.html
  document.getElementById("categoryForm").reset();

  window.location.href = "categories.html";
}

// Function to update GST rate for a category
function updateGst() {
  // Retrieve input values
  const selectedCategory = document.getElementById("selectCategory").value;
  const newGstRate = parseFloat(document.getElementById("newGstRate").value);

  // Validate input
  if (!selectedCategory || isNaN(newGstRate) || newGstRate < 0) {
    alert("Invalid input. Please provide valid data.");
    return;
  }

  // Find the selected category and update its GST rate
  const categoryToUpdate = categories.find(
    (category) => category.name === selectedCategory
  );
  if (categoryToUpdate) {
    categoryToUpdate.rate = newGstRate;
    saveDataToLocalStorage();
    alert("Updated Categories", categories);
  } else {
    alert("Category not found. Please select a valid category.");
  }
  // Reset form and navigate to product.html
  document.getElementById("gstForm").reset();
  window.location.href = "product.html";
}

// Function to update product details dropdown based on selected category
function updateProductDetailts() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectProductElement = document.getElementById("selectProduct");

  // Clear existing options
  selectProductElement.innerHTML =
    '<option value="" selected disabled>Select Product</option>';

  // Filter products based on selected category and populate the dropdown
  const productsInCategory = products.filter(
    (product) => product.category === selectedCategory
  );
  productsInCategory.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.name;
    option.text = product.name;
    selectProductElement.appendChild(option);
  });
}

// Function to create a new product
function createProduct() {
  // Retrieve input values
  const selectedCategory = document.getElementById("selectCategory").value;
  const productName = document.getElementById("productName").value;
  const productPrice = parseFloat(
    document.getElementById("productPrice").value
  );

  // Validate input
  if (
    !selectedCategory ||
    !productName ||
    isNaN(productPrice) ||
    productPrice < 0
  ) {
    alert("Invalid input. Please provide valid data.");
    return;
  }

  // Add new product to the array and save to local storage
  products.push({
    category: selectedCategory,
    name: productName,
    price: productPrice,
  });
  saveDataToLocalStorage();
  alert("Products created", products);

  // Reset form and navigate to sale.html
  document.getElementById("productForm").reset();
  window.location.href = "sale.html";
}

// Function to create a new sale
function createSales() {
  // Retrieve input values
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectedProduct = document.getElementById("selectProduct").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  // Validate input
  if (
    !selectedCategory ||
    !selectedProduct ||
    isNaN(quantity) ||
    quantity < 1
  ) {
    alert("Please Choose Category & Product & Quantity properly.");
    return;
  }
  // Find details of the selected product
  const selectedProductDetails = products.find(
    (product) =>
      product.category === selectedCategory && product.name === selectedProduct
  );

  // Validate selected product
  if (!selectedProductDetails) {
    alert("Product not found. Please select a valid product.");
    return;
  }

  // Calculate total amount and tax, then add new sale to the array and save to local storage
  const totalAmount = quantity * selectedProductDetails.price;
  const tax =
    totalAmount *
    (categories.find((category) => category.name === selectedCategory).rate /
      100);

  sales.push({
    category: selectedCategory,
    product: selectedProduct,
    quantity: quantity,
    totalAmount: totalAmount,
    tax: tax,
  });

  saveDataToLocalStorage();
  alert("Sales created", sales);

  // Reset form and navigate to bill.html
  document.getElementById("saleForm").reset();
  window.location.href = "bill.html";
}

// Function to update total amount and GST rate based on selected product and quantity
function updateTotalAmount() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectedProduct = document.getElementById("selectProduct").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  // Find details of the selected product
  const selectedProductDetails = products.find(
    (product) =>
      product.category === selectedCategory && product.name === selectedProduct
  );

  // If the product details are found, update GST rate and total amount
  if (selectedProductDetails) {
    const gstRate = categories.find(
      (category) => category.name === selectedCategory
    ).rate;
    const totalAmount = quantity * selectedProductDetails.price;

    // Update GST rate and total amount fields in the form
    document.getElementById("gstRate").value = gstRate + "%";
    document.getElementById("totalAmount").value = totalAmount.toFixed(2);
  }
}

// Function to create a bill and populate the bill table
function createBill() {
  const billTable = document.getElementById("billTable");
  billTable.innerHTML = "";

  // Create header row for the bill table
  const headerRow = billTable.insertRow(0);
  headerRow.insertCell(0).textContent = "Category";
  headerRow.insertCell(1).textContent = "Product";
  headerRow.insertCell(2).textContent = "Quantity";
  headerRow.insertCell(3).textContent = "Total Amount";
  headerRow.insertCell(4).textContent = "Tax";
  headerRow.insertCell(5).textContent = "Grand Total";

  // Initialize grandTotal variable to store the overall total of the bill
  let grandTotal = 0;

  // Populate bill table with sales data
  sales.forEach((sale, index) => {
    // Find product details based on the sale's category and product name
    const productDetails = products.find(
      (product) =>
        product.category === sale.category && product.name === sale.product
    );
    // Find category details based on the sale's category
    const categoryDetails = categories.find(
      (category) => category.name === sale.category
    );

    // Insert a new row in the bill table for each sale
    const row = billTable.insertRow(index + 1);

    // Populate cells in the row with sale details
    row.insertCell(0).textContent = sale.category;
    row.insertCell(1).textContent = sale.product;
    row.insertCell(2).textContent = sale.quantity;
    row.insertCell(3).textContent = sale.totalAmount.toFixed(2);
    row.insertCell(4).textContent = sale.tax.toFixed(2);

    // Calculate and update grand total for the current row
    const grandTotalForRow = sale.totalAmount + sale.tax;
    grandTotal += grandTotalForRow;
    row.insertCell(5).textContent = grandTotalForRow.toFixed(2);
  });

  // Insert a total row at the end of the bill table
  const totalRow = billTable.insertRow(sales.length + 1);
  totalRow.insertCell(4).textContent = "Total:";
  totalRow.insertCell(5).textContent = grandTotal.toFixed(2);
}

// Function to populate category options in the select element
function populateCategoryOptions() {
  // Get the select element by its ID
  const selectElement = document.getElementById("selectCategory");

  // Set a default option for the select element
  selectElement.innerHTML =
    '<option value="" selected disabled>Select Category</option>';

  // Iterate through each category and create an option element for each
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.text = category.name;
    selectElement.appendChild(option);
  });
}

// Function to save data to local storage
function saveDataToLocalStorage() {
  // Convert and store categories, products, and sales as JSON strings in local storage
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("sales", JSON.stringify(sales));
}

// Execute functions when the window is fully loaded
window.onload = function () {
  populateCategoryOptions(); // Populate category options in the select element
  createBill(); // Create and populate the bill table with sales data
  updateTotalAmount(); // Update the total amount in the bill
};

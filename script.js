let categories = JSON.parse(localStorage.getItem("categories")) || [];
let products = JSON.parse(localStorage.getItem("products")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

function createCategory() {
  const categoryName = document.getElementById("categoryName").value;
  const gstRate = parseFloat(document.getElementById("gstRate").value);

  if (!categoryName || isNaN(gstRate) || gstRate < 0) {
    alert("Invalid input. Please provide valid data.");
    return;
  }

  categories.push({ name: categoryName, rate: gstRate });
  saveDataToLocalStorage();
  alert("Categories created", categories);

  document.getElementById("categoryForm").reset();

  window.location.href = "categories.html";
}

function updateGst() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const newGstRate = parseFloat(document.getElementById("newGstRate").value);

  if (!selectedCategory || isNaN(newGstRate) || newGstRate < 0) {
    alert("Invalid input. Please provide valid data.");
    return;
  }

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
  document.getElementById("gstForm").reset();
  window.location.href = "product.html";
}

function updateProductDetailts() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectProductElement = document.getElementById("selectProduct");

  selectProductElement.innerHTML =
    '<option value="" selected disabled>Select Product</option>';

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

function createProduct() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const productName = document.getElementById("productName").value;
  const productPrice = parseFloat(
    document.getElementById("productPrice").value
  );

  if (
    !selectedCategory ||
    !productName ||
    isNaN(productPrice) ||
    productPrice < 0
  ) {
    alert("Invalid input. Please provide valid data.");
    return;
  }

  products.push({
    category: selectedCategory,
    name: productName,
    price: productPrice,
  });
  saveDataToLocalStorage();
  alert("Products created", products);

  document.getElementById("productForm").reset();
  window.location.href = "sale.html";
}

function createSales() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectedProduct = document.getElementById("selectProduct").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (
    !selectedCategory ||
    !selectedProduct ||
    isNaN(quantity) ||
    quantity < 1
  ) {
    alert("Please Choose Category & Product & Quantity properly.");
    return;
  }
  const selectedProductDetails = products.find(
    (product) =>
      product.category === selectedCategory && product.name === selectedProduct
  );

  if (!selectedProductDetails) {
    alert("Product not found. Please select a valid product.");
    return;
  }

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

  document.getElementById("saleForm").reset();
  window.location.href = "bill.html";
}

function updateTotalAmount() {
  const selectedCategory = document.getElementById("selectCategory").value;
  const selectedProduct = document.getElementById("selectProduct").value;
  const quantity = parseFloat(document.getElementById("quantity").value);

  const selectedProductDetails = products.find(
    (product) =>
      product.category === selectedCategory && product.name === selectedProduct
  );

  if (selectedProductDetails) {
    const gstRate = categories.find(
      (category) => category.name === selectedCategory
    ).rate;
    const totalAmount = quantity * selectedProductDetails.price;

    document.getElementById("gstRate").value = gstRate + "%";
    document.getElementById("totalAmount").value = totalAmount.toFixed(2);
  }
}

function createBill() {
  const billTable = document.getElementById("billTable");
  billTable.innerHTML = "";

  const headerRow = billTable.insertRow(0);
  headerRow.insertCell(0).textContent = "Category";
  headerRow.insertCell(1).textContent = "Product";
  headerRow.insertCell(2).textContent = "Quantity";
  headerRow.insertCell(3).textContent = "Total Amount";
  headerRow.insertCell(4).textContent = "Tax";
  headerRow.insertCell(5).textContent = "Grand Total";
  let grandTotal = 0;
  sales.forEach((sale, index) => {
    const productDetails = products.find(
      (product) =>
        product.category === sale.category && product.name === sale.product
    );
    const categoryDetails = categories.find(
      (category) => category.name === sale.category
    );

    const row = billTable.insertRow(index + 1);
    row.insertCell(0).textContent = sale.category;
    row.insertCell(1).textContent = sale.product;
    row.insertCell(2).textContent = sale.quantity;
    row.insertCell(3).textContent = sale.totalAmount.toFixed(2);
    row.insertCell(4).textContent = sale.tax.toFixed(2);

    const grandTotalForRow = sale.totalAmount + sale.tax;
    grandTotal += grandTotalForRow;
    row.insertCell(5).textContent = grandTotalForRow.toFixed(2);
  });

  const totalRow = billTable.insertRow(sales.length + 1);
  totalRow.insertCell(4).textContent = "Total:";
  totalRow.insertCell(5).textContent = grandTotal.toFixed(2);
}

function populateCategoryOptions() {
  const selectElement = document.getElementById("selectCategory");

  selectElement.innerHTML =
    '<option value="" selected disabled>Select Category</option>';

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.text = category.name;
    selectElement.appendChild(option);
  });
}

function saveDataToLocalStorage() {
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("products", JSON.stringify(products));
  localStorage.setItem("sales", JSON.stringify(sales));
}

window.onload = function () {
  populateCategoryOptions();
  createBill();
  updateTotalAmount();
};

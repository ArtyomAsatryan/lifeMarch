fetch("https://dev-su.eda1.ru/test_task/products.php")
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log("Запрос успешно выполнен");
    } else {
      console.log("Ошибка выполнения запроса");
    }
    const select = document.getElementById("mySelect");
    data.products.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.text = item.title;
      option.dataset.price = item.price;
      select.appendChild(option);
    });
  })
  .catch((error) => console.error("Ошибка:", error));

function calculateTotal() {
  const table = document.getElementById("myTable");
  let total = 0;

  for (let i = 1; i < table.rows.length; i++) {
    const priceCell = table.rows[i].cells[2];
    const price = parseFloat(priceCell.textContent);

    if (!isNaN(price)) {
      total += price;
    }
  }

  const totalSumElement = document.getElementById("totalSum");
  totalSumElement.textContent = "Итого: " + total.toFixed(2);

  return total;
}

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const select = document.getElementById("mySelect");
  const quantity = document.getElementById("quantity").value;
  const quantityWithUnit = quantity + " шт.";
  const product = select.options[select.selectedIndex].text;
  const price = select.options[select.selectedIndex].dataset.price;

  const newRow = document.createElement("tr");

  const productCell = document.createElement("td");
  productCell.textContent = product;
  const quantityCell = document.createElement("td");
  quantityCell.textContent = quantityWithUnit;
  const priceCell = document.createElement("td");
  priceCell.textContent = price;

  newRow.appendChild(productCell);
  newRow.appendChild(quantityCell);
  newRow.appendChild(priceCell);

  document.getElementById("myTable").querySelector("tbody").appendChild(newRow);

  calculateTotal();
});

document.querySelector(".products__btn").addEventListener("click", function () {
  saveOrder()
    .then((orderNumber) => {
      alert("Заказ успешно сохранен. Номер заказа: " + orderNumber);
    })
    .catch((error) => {
      console.error("Ошибка при сохранении заказа:", error);
    });
});

function saveOrder() {
  const table = document.getElementById("myTable");
  const products = [];
  for (let i = 1; i < table.rows.length; i++) {
    const productId = table.rows[i].cells[0].textContent;
    const quantity = parseInt(
      table.rows[i].cells[1].textContent.split(" ")[0],
      10
    );
    products.push({ product_id: productId, quantity: quantity });
  }

  return fetch("https://dev-su.eda1.ru/test_task/save.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ products: products }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при сохранении заказа: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        return data.code;
      } else {
        throw new Error("Ошибка при сохранении заказа: " + data.message);
      }
    });
}

document.querySelector(".products__btn").addEventListener("click", function () {
  saveOrder()
    .then((orderNumber) => {
      alert("Заказ успешно сохранен. Номер заказа: " + orderNumber);
    })
    .catch((error) => {
      console.error("Ошибка при сохранении заказа:", error);
    });
});

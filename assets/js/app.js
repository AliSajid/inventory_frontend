var API_URL = "https://xeuq3n6x45.execute-api.us-east-1.amazonaws.com/api/:action";
var API_KEY = "45RyYMv4l18bnit8Nidt8N34budgAg249keKuLc6";

const addInventoryRow = function (table_id) {
  const table = document.getElementById(table_id);
  let newRow = table.insertRow(-1);
  let nameCell = newRow.insertCell(0);
  let quantCell = newRow.insertCell(1);
  let nameInput = document.createElement("input")
  nameInput.type = "text";
  nameInput.value = "";
  let quantInput = document.createElement("input")
  quantInput.type = "number";
  quantInput.value = 0;
  nameCell.appendChild(nameInput);
  quantCell.appendChild(quantInput);
}

const addInventoryEditor = function (item, table_id) {
  const table = document.getElementById(table_id);
  let newRow = table.insertRow(-1);
  let nameCell = newRow.insertCell(0);
  let quantCell = newRow.insertCell(1);
  let nameText = document.createTextNode(item.name);
  let quantInput = document.createElement("input")
  quantInput.type = "number";
  quantInput.value = item.quantity;
  nameCell.appendChild(nameText);
  quantCell.appendChild(quantInput);
}

const getInventory = function () {
  let request = new XMLHttpRequest();
  const URL = API_URL.replace(':action', "inventory");

  request.open('GET', URL);
  request.setRequestHeader("X-API-KEY", API_KEY);
  request.responseType = 'json';

  request.onload = function () {
    if (this.status === 200) {
      let inventoryData = this.response;
      console.log(inventoryData)
      for (let item of inventoryData) {
        addInventoryEditor(item, "inventory_table_body");
      }
    }
  }
  request.send();
}


const update_item = function (obj) {
  let request = new XMLHttpRequest();
  const URL = API_URL.replace(":action", "item");

  request.open("POST", URL);
  request.setRequestHeader("X-API-KEY", API_KEY);
  request.setRequestHeader("Content-Type", "application/json")
  request.responseType = 'json';

  request.onload = function () {
    if (this.status === 200) {
      console.log("Successfully uploaded all items.");
      console.log(this.response);
      showAlertSuccess("Successfully uploaded all items.", 3000);
    } else {
      console.log("Failed to upload all items");
      console.log(this.response);
      showAlertFailure("Failed to upload all items.", 3000);
    }
  }

  request.send(JSON.stringify(obj));

}

const extractName = function (node) {
  let nodeName = node.firstChild.nodeName;
  if (nodeName === "INPUT") {
    return node.firstChild.value;
  } else  {
    return node.innerHTML;
  }
}

const update_all_items = function (table_id) {
  let data_table = document.getElementById("inventory_table_body");
  for (let i = 0; i < data_table.rows.length; i++) {
    let name = extractName(data_table.rows[i].childNodes[0]);
    let quantity = data_table.rows[i].childNodes[1].firstChild.value;
    let item = {
      "name": name,
      "quantity": quantity
    }
    console.log(item);
    update_item(item);
  }
}

const showAlertSuccess = function (message, timer) {
  const alert_div = document.getElementById("alert");
  alert_div.className = "alert alert-success alert-dismissible fadeIn";
  alert_div.innerHTML = message;
  setTimeout(function () {
    alert_div.className = "alert alert-success alert-dismissible fade close";
    location.reload();
  }, timer)
}

const showAlertFailure = function (message, timer) {
  const alert_div = document.getElementById("alert");
  alert_div.className = "alert alert-danger alert-dismissible fadeIn";
  alert_div.innerHTML = message;
  setTimeout(function () {
    alert_div.className = "alert alert-success alert-dismissible fade close";
    location.reload();
  }, timer)
}

document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  getInventory();

  const update_items = document.getElementById("update_item");

  update_items.onclick = function (event) {
    update_all_items("inventory_table_body");
  }

  const add_item = document.getElementById("add_item");

  add_item.onclick = function (event) {
    addInventoryRow("inventory_table_body");
  }
});

let INVMODULE = {}

INVMODULE.API_URL_TEMPLATE = "https://:api_id.execute-api.us-east-1.amazonaws.com/api/:action";
INVMODULE.API_KEY = "45RyYMv4l18bnit8Nidt8N34budgAg249keKuLc6";

INVMODULE.setApiId = function (apiid) {
  INVMODULE.API_URL = INVMODULE.API_URL_TEMPLATE.replace(":api_id", apiid);
}

INVMODULE.setApiKey = function (apikey) {
  INVMODULE.API_KEY = apikey;
}

INVMODULE.showAlertSuccess = function (message, timer) {
  const alert_div = document.getElementById("alert");
  alert_div.className = "alert alert-success alert-dismissible fadeIn";
  alert_div.innerHTML = message;
  setTimeout(function () {
    alert_div.className = "alert alert-success alert-dismissible fade close";
    location.reload();
  }, timer)
}

INVMODULE.showAlertFailure = function (message, timer) {
  const alert_div = document.getElementById("alert");
  alert_div.className = "alert alert-danger alert-dismissible fadeIn";
  alert_div.innerHTML = message;
  setTimeout(function () {
    alert_div.className = "alert alert-success alert-dismissible fade close";
    location.reload();
  }, timer)
}

INVMODULE.extractName = function (node) {
  let nodeName = node.firstChild.nodeName;
  if (nodeName === "INPUT") {
    return node.firstChild.value;
  } else  {
    return node.innerHTML;
  }
}

INVMODULE.addInventoryRow = function (table_id) {
  const table = document.getElementById(table_id);
  let newRow = table.insertRow(-1);
  let nameCell = newRow.insertCell(0);
  let quantCell = newRow.insertCell(1);
  let nameInput = document.createElement("input")
  nameInput.type = "text";
  nameInput.value = "";
  nameInput.className = "input-text text-center";
  let quantInput = document.createElement("input")
  quantInput.type = "number";
  quantInput.value = 0;
  quantInput.className = "input-text text-center";
  nameCell.appendChild(nameInput);
  quantCell.appendChild(quantInput);
}

INVMODULE.addInventoryEditor = function (item, table_id) {
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

INVMODULE.getInventory = function () {
  let request = new XMLHttpRequest();
  const URL = INVMODULE.API_URL.replace(':action', "inventory");

  request.open('GET', URL);
  request.setRequestHeader("X-API-KEY", INVMODULE.API_KEY);
  request.responseType = 'json';

  request.onload = function () {
    if (this.status === 200) {
      let inventoryData = this.response;
      console.log(inventoryData)
      for (let item of inventoryData) {
        INVMODULE.addInventoryEditor(item, "inventory_table_body");
      }
    }
  }
  request.send();
}


INVMODULE.update_item = function (obj) {
  let request = new XMLHttpRequest();
  const URL = INVMODULE.API_URL.replace(":action", "item");

  request.open("POST", URL);
  request.setRequestHeader("X-API-KEY", INVMODULE.API_KEY);
  request.setRequestHeader("Content-Type", "application/json")
  request.responseType = 'json';

  request.onload = function () {
    if (this.status === 200) {
      console.log("Successfully uploaded all items.");
      console.log(this.response);
      INVMODULE.showAlertSuccess("Successfully uploaded all items.", 3000);
    } else {
      console.log("Failed to upload all items");
      console.log(this.response);
      INVMODULE.showAlertFailure("Failed to upload all items.", 3000);
    }
  }

  request.send(JSON.stringify(obj));

}


INVMODULE.update_all_items = function (table_id) {
  let data_table = document.getElementById(table_id);
  for (let i = 0; i < data_table.rows.length; i++) {
    let name = INVMODULE.extractName(data_table.rows[i].childNodes[0]);
    let quantity = data_table.rows[i].childNodes[1].firstChild.value;
    let item = {
      "name": name,
      "quantity": quantity
    }
    console.log(item);
    INVMODULE.update_item(item);
  }
}

export { INVMODULE };

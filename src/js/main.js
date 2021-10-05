import 'app.js';

(function () {
  document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    INVMODULE.getInventory();

    const update_items = document.getElementById("update_item");

    update_items.onclick = function (event) {
      INVMODULE.update_all_items("inventory_table_body");
    }

    const add_item = document.getElementById("add_item");

    add_item.onclick = function (event) {
      INVMODULE.addInventoryRow("inventory_table_body");
    }
  });
})()

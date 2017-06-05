var sizeTable;
var regions = {
  "Canada": {
    // mediaUrl = "",
    "variantsUrl" : "http://www.adidas.ca/on/demandware.store/Sites-adidas-CA-Site/en_CA/Product-GetVariants",
  },
  "United States": {
    // mediaUrl = "",
    "variantsUrl" : "http://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Product-GetVariants"
  }
};

window.onload = function() {
  document.getElementById("sku-button").addEventListener("click", sendStockRequest);
  sizeTable = document.getElementById("size-table");
}

function sendStockRequest() {
  var country = document.getElementById("region").value;
  var url = regions[country].variantsUrl;

  var xhr = new XMLHttpRequest();
  var stockUrl = url + "?pid=" + document.getElementById("sku-input").value;
  xhr.open("GET", stockUrl);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        displaySizes(JSON.parse(xhr.responseText).variations.variants);
      }
      else if (xhr.status == 404) {
        console.log("error: invalid SKU!");
      }
      else {
        console.log("There was an error checking stock.");
      }
    }
  }
  xhr.send();
}

function displaySizes(variants) {
  var totalStock = 0;

  // clear the table
  while(sizeTable.rows[1]) {
    sizeTable.deleteRow(1);
  }

  // initialize table header
  if(!sizeTable.tHead) {
    var header = sizeTable.createTHead();
    var row = header.insertRow(0);
    var x = row.insertCell(0);
    var y = row.insertCell(1);
    x.textContent = "Size";
    y.textContent = "Available";
  }

  // populate table with sizes
  var body = sizeTable.createTBody();
  for (var i = 0; i < variants.length; i++) {
    var row = body.insertRow();
    var size = row.insertCell(0);
    var avail = row.insertCell(1);

    size.textContent = variants[i].attributes.size.replace(/,/g ,'.');
    avail.textContent = variants[i].ATS;

    totalStock += variants[i].ATS;
  }

  // initialize tfoot with total stock
  var footer = sizeTable.createTFoot();
  var row = footer.insertRow(0);
  var x = row.insertCell(0);
  var y = row.insertCell(1);
  x.textContent = "Total Stock";
  y.textContent = totalStock;
}

function displayError() {

}

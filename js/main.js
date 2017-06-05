const regions = {
  "Canada": {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.ca/on/demandware.store/Sites-adidas-CA-Site/en_CA/Product-GetVariants"
  },
  "US": {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Product-GetVariants"
  },
  "EUUK" : {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.nl/on/demandware.store/Sites-adidas-GB-Site/nl_NL/Product-GetVariants"
  },
  "EUEU" : {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.nl/on/demandware.store/Sites-adidas-GB-Site/nl_NL/Product-GetVariants"
  },
  "EUUK" : {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.nl/on/demandware.store/Sites-adidas-DE-Site/de_DE/Product-GetVariants"
  }
};

function displaySizes(variants) {

  // clear table and recreate tBody
  while (sizeTable.rows[1]) {
    sizeTable.deleteRow(1);
  }
  const body = sizeTable.createTBody();

  // create a new row for each item variant
  variants.forEach(element => {
    const size = element.attributes.size.replace(/,/g, '.');
    const avail = element.ATS;
    const row = `
    <tr>
      <td>${size}</td>
      <td>${avail}</td>
    </tr>
    `;
    body.innerHTML += row;
  });
}

// request the item variant data
function getStock() {
  const country = document.getElementById('region').value;
  const url = regions[country].variantsUrl;
  const sku = searchInput.value;

  const variants = [];
  fetch(`${url}?pid=${sku}`)
    .then(response => {
      // check for errors 
      if (response.status !== 200) {
        console.log(`sku error, status code: ${response.status}`);
        return;
      }

      // parse item variant data
      response.json().then(data => {
        variants.push(...data.variations.variants);
        displaySizes(variants);
      });
    })
    .catch(err => console.log('Fetch error:-S',err));
}

const sizeTable = document.getElementById('size-table');
const searchInput = document.getElementById('sku-input');
const searchButton = document.getElementById('sku-button');

searchButton.addEventListener('click', getStock);
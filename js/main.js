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

const options = {
  chartArea: {
    backgroundColor: '#FFFF9D'
  },
  legend: { display: false },
  scales: {
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: 'Stock'
      }
    }]
  }
}

function createChart(variants) {
  let sizes = [];
  let stock = [];
  variants.forEach(element => {
    sizes.push(element.attributes.size.replace(/,/g, '.'));
    stock.push(element.ATS);
  });

  let chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sizes, // sizes array
      datasets: [{
        label: 'Stock', // "Sizes"
        data: stock, //ATS array
        backgroundColor: '#FF6138'
      }]
    },
    options
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
        // displaySizes(variants);
        const sizes = createChart(variants);
      });
    })
    .catch(err => console.log('Fetch error:-S',err));
}

// const sizeTable = document.getElementById('size-table');
const ctx = document.querySelector('canvas').getContext('2d');
const searchInput = document.getElementById('sku-input');
const searchButton = document.getElementById('sku-button');

searchButton.addEventListener('click', getStock);


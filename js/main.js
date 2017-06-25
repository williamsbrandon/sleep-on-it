const regions = {
  "Canada": {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.ca/on/demandware.store/Sites-adidas-CA-Site/en_CA/Product-GetVariants"
  },
  "US": {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.com/on/demandware.store/Sites-adidas-US-Site/en_US/Product-GetVariants"
  },
  "EUUK": {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.nl/on/demandware.store/Sites-adidas-GB-Site/nl_NL/Product-GetVariants"
  },
  "EUEU": {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.nl/on/demandware.store/Sites-adidas-GB-Site/nl_NL/Product-GetVariants"
  },
  "EUUK": {
    // mediaUrl = "",
    "variantsUrl" : "https://www.adidas.nl/on/demandware.store/Sites-adidas-DE-Site/de_DE/Product-GetVariants"
  },
  'Australia': {
    'variantsUrl': 'http://www.adidas.com.au/on/demandware.store/Sites-adidas-AU-Site/en_AU/Product-GetVariants'
  }
};

const options = {
  chartArea: {
    backgroundColor: '#FFFF9D'
  },
  legend: { display: false },
  scales: {
    xAxes: [{
      categoryPercentage: 1.0,
      ticks: {
        fontSize: 11
      }
    }],
    yAxes: [{
      ticks: {
        beginAtZero: true,
        stepSize: 1
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

  // updateButton doesn't change skuCurrent
  if (this.id === 'generate-button') {
    console.log(this.id)
    skuCurrent = skuInput.value;
  }

  fetch(`${url}?pid=${skuCurrent}`)
    .then(response => {
      // check for errors 
      if (response.status !== 200) {
        console.log(`sku error, status code: ${response.status}`);
        return;
      }

      // parse item variant data
      response.json().then(data => showStock(data));
    })
    .catch(err => console.log('Fetch error:-S',err));
}

function showStock(data) {
  // show canvas and snapshot       
  document.querySelectorAll('.hidden').forEach(element => element.classList.remove('hidden'));
  
  // create graph
  const variants = [...data.variations.variants];
  const sizes = createChart(variants);

  // create snapshot description
  skuDisplay.innerHTML = `Product ID: ${skuCurrent}`;
  snapShotTime.innerHTML = `Snapshot: ${new Date().toLocaleTimeString()}`;
}


// global and mutable for update button functionality
let skuCurrent = '';

const skuInput = document.querySelector('#sku-input');
const snapShotTime = document.querySelector('#time');
const skuDisplay = document.querySelector('#sku-display');
const ctx = document.querySelector('canvas').getContext('2d');
const searchButton = document.querySelector('#generate-button');
const updateButton = document.querySelector('#update-button');

searchButton.addEventListener('click', getStock);
updateButton.addEventListener('click', getStock);
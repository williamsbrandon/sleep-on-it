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
  const sizes = [];
  const stock = [];
  const colors = [];
  variants.forEach(element => {
    sizes.push(element.attributes.size.replace(/,/g, '.'));

    const ats = parseInt(element.ATS);
    // console.log(ats);
    switch (true) {
      case (ats <= 1):
        colors.push('#FF6138');
        break;
      case (ats <= 3):
        colors.push('#FFFF9D');
        break;
      case (ats <= 5):
        colors.push('#BEEB9F');
        break;
      default:
        colors.push('#79BD8F');
        break;
    }
    stock.push(ats);
  });
  // console.log(colors);

  if (sizeChart) {
    sizeChart.destroy();
  }
  sizeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sizes, // sizes array
      datasets: [{
        label: 'Stock', // "Sizes"
        data: stock, //ATS array
        backgroundColor: colors
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
    skuCurrent = skuInput.value;
  }

  fetch(`${url}?pid=${skuCurrent}`)
    .then(response => {
      // check for errors 
      if (response.status !== 200) {
        errorDisplay.classList.remove('hidden');
        errorDisplay.innerHTML = `SKU Error: ${response.statusText}`;
        console.log(response.status);
        return;
      }
      // hide error display if shown
      errorDisplay.classList.add('hidden');

      // parse item variant data
      response.json().then(data => showStock(data));
    })
    .catch(err => {
      errorDisplay.classList.remove('hidden');
      errorDisplay.innerHTML = `Fetch error: ${err.message}`;
    });
}

function showStock(data) {
  // show snapshot
  if (snapshot.classList.contains('hidden')) {
    snapshot.classList.remove('hidden');
  }
  
  // create graph
  const variants = [...data.variations.variants];
  const sizes = createChart(variants);

  // create snapshot description
  skuDisplay.innerHTML = `Product ID: ${skuCurrent}`;
  snapshotTime.innerHTML = `snapshot: ${new Date().toLocaleTimeString()}`;
}

// search form
const skuInput = document.querySelector('#sku-input');
const searchButton = document.querySelector('#generate-button');
const errorDisplay = document.querySelector('.error');

// snapshot details
const snapshot = document.querySelector('.snapshot');
const snapshotTime = document.querySelector('#time');
const skuDisplay = document.querySelector('#sku-display');
const updateButton = document.querySelector('#update-button');
// global and mutable for update button functionality
let skuCurrent = '';

// canvas setup
const ctx = document.querySelector('canvas').getContext('2d');
let sizeChart = '';

// event listeners
searchButton.addEventListener('click', getStock);
updateButton.addEventListener('click', getStock);
skuInput.addEventListener('keypress', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    searchButton.click();
  }
})
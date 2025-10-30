const basketElement = document.querySelector('.BasketItems');
const itemCount = document.querySelector('.ItemCount');

function addProductToCart() {
  fetch('https://shopping-cart-api-kappa.vercel.app/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((data) => console.log('New entry added:', data))
    .catch((error) => console.error('Error adding new entry:', error));
}

async function getProducts() {
  return fetch('https://shopping-cart-api-kappa.vercel.app/api/products')
    .then((response) => {
      // Check if the response was successful (e.g., status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the response body as JSON (or text, blob, etc.)
      return response.json();
    })
    .then((data) => {
      // Access the actual data from the response
      console.log(data);
      return data;
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch or parsing
      console.error('Error fetching data:', error);
    });
}

function renderProducts(products) {
  console.log('Rendering products:', products);
  products.map((product) => {
    const productElement = document.createElement('li');
    productElement.className = 'BasketItem';
    productElement.innerHTML = `
      <div class="BasketItemContent">
        <div class="BasketItemImageContainer">
          <img
            src="${product.imageURL}"
            alt="${product.name}"
          />
        </div>
        <div class="BasketItemDetails">
          <span class="BasketItemName">${product.name}</span>
          <span class="BasketItemPrice">$${product.price}</span>
          <button class="BasketItemAddButton" data-product-id="${product.id}">
          Add to Cart
          </button>
          <button class="RemoveButton" data-product-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
    basketElement.appendChild(productElement);
  });
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', async () => {
  const productList = await getProducts();
  if (!productList) {
    console.error('No products found.');
    return;
  } else {
    console.log('Products fetched:', productList);
    renderProducts(productList);
    itemCount.textContent = productList.length;
  }
});

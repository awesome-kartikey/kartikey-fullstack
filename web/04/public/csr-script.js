document.addEventListener('DOMContentLoaded', function () {
    const appDiv = document.getElementById('app');

    fetch('/api/product')
        .then(response => response.json())
        .then(product => {
            appDiv.innerHTML = `
        <h2>${product.name}</h2>
        <p>Price: ${product.price}</p>
        <p>Stock: ${product.stock}</p>
      `;
        });
});
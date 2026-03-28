// Using form submission
const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('/cart/add', { method: 'POST', body: new FormData(form) })
        .then(() => alert('Added to cart using form submission'));
});

// Using JS to add event listener
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('add-to-cart');

    if (btn) {
        btn.addEventListener('click', () => alert('Added to cart using JS'));
        btn.textContent = 'Add to Cart using JS';
        btn.disabled = false;
    }
});
import express from "express";
const app = express();

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const product = {
  name: "Headphone",
  price: "Rs. 2000",
  stock: "In Stock",
};

app.get("/api/product", (req, res) => {
  res.json(product);
});

app.get("/api/product-slow", (req, res) => {
  setTimeout(() => res.json(product), 2000);
});

// CSR - Client Side Rendering
app.get("/csr", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>CSR Demo</title></head>
      <body>
        <h1>CSR Page</h1>
        <div id="app">Loading...</div>
        <script src="/csr-script.js"></script>
      </body>
    </html>
  `);
});

//SSR - Server Side Rendering
app.get('/ssr', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>SSR Demo</title></head>
      <body>
        <h1>SSR Page</h1>
        <div id="app">
          <h2>${product.name}</h2>
          <p>Price: ${product.price}</p>
          <p>Stock: ${product.stock}</p>
        </div>
      </body>
    </html>
  `);
});

app.get('/ssr-hydrated', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>SSR + Hydration Demo</title></head>
      <body>
        <h1>SSR Page with Hydration</h1>
        <div id="app">
          <h2>${product.name}</h2>
          <p>Price: ${product.price}</p>
          <p>Stock: ${product.stock}</p>
          
          <button id="add-to-cart" disabled>Add to Cart Using JS</button>

          <form action="/cart/add" method="POST">
            <input type="hidden" name="productId" value="keyboard-001">
            <button type="submit">Add to Cart Using Form</button>
          </form>

        </div>
        <script src="/ssr-hydration.js"></script>
      </body>
    </html>
  `);
});

app.post('/cart/add', (req, res) => {
  console.log('Cart item added:', req.body);
  res.send('Item added to cart!');
});

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
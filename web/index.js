const fs = require('fs');
const http = require('http');
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate');

// SERVER: ----------------------------------------------------------------
// CALL OUTSIDE:

// TEMPLATES:
const OVERVIEW = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const CARD = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const PRODUCT = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

// JSON DATA:
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// MAIN SERVER: ----->
const server = http.createServer((req, res) => {
   // PATH FOR THE PRODUCT:
   const {
      query,
      pathname
   } = url.parse(req.url, true);

   // OVERVIEW:
   if (pathname == '/' || pathname == '/overview') {
      res.writeHead(200, {
         'Content-type': 'text/html'
      });

      const cardsHtml = dataObj.map(productData => replaceTemplate(CARD, productData)).join('');

      const output = OVERVIEW.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

      res.end(output);

      // PRODUCT:
   } else if (pathname == '/product') {
      res.writeHead(200, {
         'Content-type': 'text/html'
      });
      const productData = dataObj[query.id];
      const output = replaceTemplate(PRODUCT, productData);
      res.end(output);

      // API:
   } else if (pathname == '/api') {
      res.writeHead(200, {
         'Content-type': 'application/json'
      });
      res.end(data);

      // NOT FOUND:
   } else {
      res.writeHead(404, {
         'Content-type': 'text/html',
         'my-own-header': 'hello-world'
      });
      res.end('<h2>PAGE NOT FOUND 404!</h2>');
   }
});

// // LUNCH THE SERVER: ----->
// server.listen(8000, '127.0.0.1', () => {
//    console.log('Listening to requests on port 8000');
// })
server.listen(80, 'https://jamal-bahammou.github.io/fruitApp', () => {
   console.log('Listening to requests on port 8000');
})
const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const json_articulos = fs.readFileSync('src/articulos.json', 'utf-8');
let articulos = JSON.parse(json_articulos);

router.get('/', (req, res) => {
  res.render('index', { articulos });
}); 

router.get('/leer/:id', (req, res) => {
  articulos = articulos.filter(articulo => articulo.id == req.params.id);
  articulo = articulos[0]
  console.log(articulo) 
  res.render('articulo',{ articulo });

});

router.get('/new-entry', (req, res) => {
  res.render('new-entry');
});

router.post('/new-entry', (req, res) => {

  const { title, author, image, description } = req.body;

  if (!title || !author || !image || !description) {
    res.status(400).send("Entries must have a title and body");
    return;
  }

  var newarticulo = {
    id: uuidv4(),
    title,
    author,
    image,
    description
  };

  // add a new articulo to the array
  articulos.push(newarticulo);

  // saving the array in a file
  const json_articulos = JSON.stringify(articulos);
  fs.writeFileSync('src/articulos.json', json_articulos, 'utf-8');

  res.redirect('/');
});

router.get('/delete/:id', (req, res) => {
  articulos = articulos.filter(articulo => articulo.id != req.params.id);

  // saving data
  const json_articulos = JSON.stringify(articulos);
  fs.writeFileSync('src/articulos.json', json_articulos, 'utf-8');

  res.redirect('/')
});



module.exports = router;
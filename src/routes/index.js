const express = require('express');
const router = express.Router();
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const json_articulos = fs.readFileSync('src/articulos.json', 'utf-8');
let articulos = JSON.parse(json_articulos);

router.get('/', (req, res) => {
  articulos = JSON.parse(fs.readFileSync('src/articulos.json', 'utf-8')); 
     
  res.render('index', { articulos });
}); 

router.get('/admin', (req, res) => {
  articulos = JSON.parse(json_articulos);
  res.render('admin', { articulos });
}); 
  
router.get('/leer/:id', (req, res) => {
  articulos = articulos.filter(articulo => articulo.id == req.params.id);
  articulo = articulos[0]
  console.log(articulo)     
  res.render('articulo',{ articulo });

});
    
router.get('/editar/:id', (req, res) => {
  articulos = articulos.filter(articulo => articulo.id == req.params.id);
  articulo = articulos[0]
  console.log(articulo) 
  res.render('editar',{ articulo });  
  
}); 

router.get('/buscar/:palabra', (req, res) => {
  articulos = JSON.parse(json_articulos); 
  articulos = articulos.filter(articulo => articulo.title.toLowerCase().includes(req.params.palabra.toLowerCase()));
  console.log("palabra :: ",req.params.palabra.toLowerCase())
  res.render('index',{ articulos });  
  
});    

router.get('/new-entry', (req, res) => {
  articulos = JSON.parse(json_articulos); 
  res.render('new-entry');
});

router.post('/new-entry', (req, res) => {

  const { title, author, image, description } = req.body;
 
  articulos = JSON.parse(fs.readFileSync('src/articulos.json', 'utf-8')); 
  
  id_ = uuidv4();
  if (req.body.id!=undefined){
    id_ = req.body.id;
    articulos = articulos.filter(articulo => articulo.id != id_);
    // saving data 
    //json_articulos = JSON.stringify(articulos);
    fs.writeFileSync('src/articulos.json', JSON.stringify(articulos), 'utf-8');
  }

  if (!title || !author || !image || !description) {
    res.status(400).send("Entries must have a title and body");
    return;
  }

  var newarticulo = {
    id: id_,
    title,
    author,
    image,
    description
  };
  articulos = JSON.parse(fs.readFileSync('src/articulos.json', 'utf-8')); 

  // add a new articulo to the array
  articulos.push(newarticulo);

  // saving the array in a file
  //const json_articulos = JSON.stringify(articulos);
  fs.writeFileSync('src/articulos.json', JSON.stringify(articulos), 'utf-8');
  
  articulos = JSON.parse(fs.readFileSync('src/articulos.json', 'utf-8')); 
  res.redirect('/'); 
  
});

router.get('/delete/:id', (req, res) => {
  articulos = articulos.filter(articulo => articulo.id != req.params.id);

  // saving data
  json_articuloss = JSON.stringify(articulos);
  fs.writeFileSync('src/articulos.json', json_articuloss, 'utf-8');
  
  res.redirect('/')
});



module.exports = router;
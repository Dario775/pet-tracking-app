const express = require('express');
const bodyParser = require('body-parser');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

let pets = [];
let nextId = 1;

app.get('/', (req, res) => {
  res.render('index', { pets });
});

app.get('/registrar', (req, res) => {
  res.render('registrar');
});

app.post('/registrar', async (req, res) => {
  const id = nextId++;
  const petUrl = `${req.protocol}://${req.get('host')}/mascota/${id}`;
  const qrData = await qrcode.toDataURL(petUrl);
  const pet = {
    id,
    nombre: req.body.nombre,
    raza: req.body.raza,
    color: req.body.color,
    identificacion: req.body.identificacion,
    telefono: req.body.telefono,
    direccion: req.body.direccion,
    qr: qrData
  };
  pets.push(pet);
  res.render('confirmacion', { pet });
});

app.get('/mascota/:id', (req, res) => {
  const pet = pets.find(p => p.id === parseInt(req.params.id));
  if (!pet) {
    return res.status(404).send('Mascota no encontrada');
  }
  res.render('mascota', { pet });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

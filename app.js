const express = require("express");
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require("cors");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'carnetui/build')));
app.use(cors());

// Conexión a la base de datos
const user = "edgar94";
const password = "oLbVSOWQiWOiZcmk";
const bdname = "estudiante";
const uri = `mongodb+srv://${user}:${password}@cluster0.cgpunkw.mongodb.net/${bdname}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Base de datos conectada"))
  .catch(error => console.log("Error en la conexión a la base de datos:", error));

// Rutas
app.use("/", require("./router/Carnets"));

// Ruta de inicio
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error del servidor');
});

app.listen(port, () => {
  console.log("Servidor en funcionamiento en el puerto", port);
});


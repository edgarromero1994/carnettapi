const express = require("express")
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const cors = require("cors")

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//conexion a base de datos
const user = "edgar94";
const password ="oLbVSOWQiWOiZcmk";
const bdname= "estudiante"
const uri = `mongodb+srv://${user}:${password}@cluster0.cgpunkw.mongodb.net/${bdname}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,}
).then(() => console.log("base de datos conectados"))
.catch(error => console.log(error));

//para compilar la vista 
app.use(cors())

//RUTAS WEB
app.use("/", require("./router/RutasWeb"));
app.use("/", require("./router/Carnets"))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
  

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error del servidor');
  });


app.listen(port, () => {
    console.log("servidor a su servicio en el puerto", port)
})



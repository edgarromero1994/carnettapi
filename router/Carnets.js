const express = require("express"); 
const router = express.Router(); 
const { parseISO, differenceInYears } = require('date-fns');

const Carnet = require("../models/carnet")

router.get("/carnet", async(req, res)=>{
    try {
      const arrayCarnetDB = await Carnet.find()
      console.log(arrayCarnetDB)
      res.json({
        arrayCarnet: arrayCarnetDB
      });
    } catch (error) {
      console.log(error);
      res.status(500).send('Error al obtener las películas desde la base de datos');
    }
  });
  

 // Ruta para agregar un nuevo registro
 router.post('/carnet', async (req, res) => {
  try {
    const {
      nombre,
      direccion,
      genero,
      nacimiento,
      carrera,
      poesia,
      imagen,
      telefono,
    } = req.body;

    const fechaNacimiento = parseISO(nacimiento);
    const edad = differenceInYears(new Date(), fechaNacimiento);
    let aprobado;
    if (edad <= 17) {
      aprobado = 'No Aprobado';
    } else {
      aprobado = 'Aprobado';
    }

    const numcarnet = generateCarnetNumber(genero); // Generar número de carnet

    const nuevoCarnet = new Carnet({
      nombre,
      direccion,
      genero,
      nacimiento,
      carrera,
      poesia,
      imagen,
      telefono,
      edad:edad,
      numcarnet:numcarnet,
      aprobado:aprobado,
      fecha: new Date(), // Fecha actual
      fechaconcurso: calculateFechaConcurso(numcarnet, poesia), // Calcular fecha de concurso
    });

    await nuevoCarnet.save();
    res.status(201).send('Carnet agregado correctamente');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al agregar nuevo carnet a la base de datos');
  }
});

// Función para generar el número de carnet
function generateCarnetNumber(genero) {
  const firstChar = 'A';
  const lastCharOptionss = ['1', '2', '3','4', '6', '7','8', '9', ];
  const thirdChar = '5';
  const lastCharOptions = ['1', '3', '9'];
  const segundo = lastCharOptionss[Math.floor(Math.random() * lastCharOptions.length)];
  const lastChar = lastCharOptions[Math.floor(Math.random() * lastCharOptions.length)];
  return `${firstChar}${segundo}${thirdChar}${genero.toUpperCase()}${lastChar}`;
}

// Función para calcular la fecha de concurso
// Función para calcular la fecha de concurso
function calculateFechaConcurso(numcarnet, poesia) {
  const lastChar = numcarnet.charAt(numcarnet.length - 1);
  const currentDay = new Date().getDay(); // 0 (domingo) a 6 (sábado)

  if (lastChar === '1' && poesia.toLowerCase() === 'dramático') {
    const daysToAdd = currentDay === 5 ? 3 : currentDay === 6 ? 2 : 1;
    const fechaConcurso = new Date();
    fechaConcurso.setDate(fechaConcurso.getDate() + daysToAdd);
    skipWeekend(fechaConcurso);
    return fechaConcurso;
  }

  if (lastChar === '3' && poesia.toLowerCase() === 'épica') {
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const fechaConcurso = new Date(new Date().getFullYear(), new Date().getMonth(), lastDayOfMonth);
    while (fechaConcurso.getDay() === 0 || fechaConcurso.getDay() === 6) {
      fechaConcurso.setDate(fechaConcurso.getDate() - 1);
    }
    return fechaConcurso;
  }

  const daysToAdd = currentDay === 5 ? 7 : currentDay === 6 ? 6 : 5;
  const fechaConcurso = new Date();
  fechaConcurso.setDate(fechaConcurso.getDate() + daysToAdd);
  skipWeekend(fechaConcurso);
  return fechaConcurso;
}

function skipWeekend(date) {
  const day = date.getDay(); // 0 (domingo) a 6 (sábado)

  // Si es sábado (6), sumar 2 días para saltar al lunes
  if (day === 6) {
    date.setDate(date.getDate() + 2);
  }
  // Si es domingo (0), sumar 1 día para saltar al lunes
  else if (day === 0) {
    date.setDate(date.getDate() + 1);
  }
}

router.delete('/carnet/:id', async (req, res) => {
  try {
    const carnetId = req.params.id;
    const carnetEliminado = await Carnet.findByIdAndRemove(carnetId);

    if (!carnetEliminado) {
      return res.status(404).send('No se encontró el carnet');
    }

    res.status(200).send('Carnet eliminado correctamente');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al eliminar el carnet de la base de datos');
  }
});

module.exports = router;